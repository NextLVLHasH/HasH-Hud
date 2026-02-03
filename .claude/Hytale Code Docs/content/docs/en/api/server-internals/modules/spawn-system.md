---
id: spawn-system
title: Spawn System
sidebar_label: Spawn System
sidebar_position: 18
description: Documentation of the SpawnProvider system for managing player spawn points in Hytale worlds
---

# Spawn System

The Spawn System in Hytale manages where players appear when they join a world or respawn. It uses a flexible provider-based architecture that allows different spawn behaviors per world.

## Architecture

### Core Interface: ISpawnProvider

```java
package com.hypixel.hytale.server.core.universe.world.spawn;

public interface ISpawnProvider {
    // Get spawn point for a specific player
    Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID playerUuid);

    // Get all possible spawn points (deprecated)
    @Deprecated
    Transform[] getSpawnPoints();

    // Check if a position is within spawn protection distance
    boolean isWithinSpawnDistance(@Nonnull Vector3d position, double distance);
}
```

### Available Implementations

| Provider | Description | Use Case |
|----------|-------------|----------|
| `GlobalSpawnProvider` | Single fixed spawn point for all players | Hub worlds, lobbies |
| `IndividualSpawnProvider` | Selects from multiple spawn points based on player UUID | Spread players across spawn area |
| `FitToHeightMapSpawnProvider` | Wraps another provider and adjusts Y to terrain height | Prevents spawning underground |

## SpawnProvider Types

### GlobalSpawnProvider

Provides a single static spawn point for all players.

```java
public class GlobalSpawnProvider implements ISpawnProvider {
    private Transform spawnPoint;

    public GlobalSpawnProvider(Transform spawnPoint) {
        this.spawnPoint = spawnPoint;
    }

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        return this.spawnPoint; // Same point for everyone
    }
}
```

**JSON Configuration:**
```json
{
    "SpawnProvider": {
        "Type": "GlobalSpawnProvider",
        "SpawnPoint": {
            "Position": [0, 100, 0],
            "Rotation": [0, 0, 0]
        }
    }
}
```

### IndividualSpawnProvider

Selects a spawn point from a list based on the player's UUID hash. This distributes players across multiple spawn points consistently (same player always gets same spawn).

```java
public class IndividualSpawnProvider implements ISpawnProvider {
    private Transform[] spawnPoints;

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        // Hash-based selection - consistent per player
        int index = Math.abs((int)HashUtil.hashUuid(uuid)) % spawnPoints.length;
        return spawnPoints[index];
    }
}
```

**JSON Configuration:**
```json
{
    "SpawnProvider": {
        "Type": "IndividualSpawnProvider",
        "SpawnPoints": [
            { "Position": [0, 100, 0], "Rotation": [0, 0, 0] },
            { "Position": [10, 100, 0], "Rotation": [0, 90, 0] },
            { "Position": [0, 100, 10], "Rotation": [0, 180, 0] },
            { "Position": [-10, 100, 0], "Rotation": [0, 270, 0] }
        ]
    }
}
```

### FitToHeightMapSpawnProvider

A decorator that wraps another SpawnProvider and adjusts the Y coordinate to match the terrain height if the spawn point is below ground (Y < 0).

```java
public class FitToHeightMapSpawnProvider implements ISpawnProvider {
    private ISpawnProvider spawnProvider; // Wrapped provider

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        Transform spawnPoint = spawnProvider.getSpawnPoint(world, uuid);
        Vector3d position = spawnPoint.getPosition();

        // If below ground, adjust to terrain height
        if (position.getY() < 0.0) {
            WorldChunk chunk = world.getNonTickingChunk(...);
            if (chunk != null) {
                position.setY(chunk.getHeight(x, z) + 1);
            }
        }
        return spawnPoint;
    }
}
```

**JSON Configuration:**
```json
{
    "SpawnProvider": {
        "Type": "FitToHeightMapSpawnProvider",
        "SpawnProvider": {
            "Type": "IndividualSpawnProvider",
            "SpawnPoints": [...]
        }
    }
}
```

## Accessing SpawnProvider

### From WorldConfig

```java
World world = Universe.get().getWorld("myworld");
WorldConfig config = world.getWorldConfig();

// Get the current spawn provider
ISpawnProvider spawnProvider = config.getSpawnProvider();

// Get spawn point for a player
Transform spawnPoint = spawnProvider.getSpawnPoint(world, playerUuid);
Vector3d position = spawnPoint.getPosition();
Vector3f rotation = spawnPoint.getRotation();
```

### Setting Spawn Provider

```java
// Create a new spawn point
Vector3d position = new Vector3d(100, 65, 200);
Vector3f rotation = new Vector3f(0, 90, 0); // Facing east
Transform transform = new Transform(position, rotation);

// Set as global spawn
WorldConfig config = world.getWorldConfig();
config.setSpawnProvider(new GlobalSpawnProvider(transform));
config.markChanged(); // Save changes
```

## SpawnUtil Helper Class

The `SpawnUtil` class provides utility methods for applying spawn transforms:

```java
public final class SpawnUtil {
    // Apply spawn transform to a player joining a world
    public static TransformComponent applyFirstSpawnTransform(
        @Nonnull Holder<EntityStore> holder,
        @Nonnull World world,
        @Nonnull WorldConfig worldConfig,
        @Nonnull UUID playerUuid
    ) {
        ISpawnProvider spawnProvider = worldConfig.getSpawnProvider();
        if (spawnProvider == null) return null;

        Transform spawnPoint = spawnProvider.getSpawnPoint(world, playerUuid);

        // Create and apply transform component
        TransformComponent transform = new TransformComponent(
            spawnPoint.getPosition(),
            new Vector3f(0, spawnPoint.getRotation().getYaw(), 0)
        );
        holder.addComponent(TransformComponent.getComponentType(), transform);

        // Set head rotation
        HeadRotation headRotation = holder.ensureAndGetComponent(HeadRotation.getComponentType());
        headRotation.teleportRotation(spawnPoint.getRotation());

        return transform;
    }
}
```

## Built-in Commands

### /world config setspawn

Sets the world spawn to the current position or specified coordinates.

```
/world config setspawn                    # Use current position and rotation
/world config setspawn 100 65 200         # Specify position
/world config setspawn 100 65 200 0 90 0  # Specify position and rotation
```

This command creates a `GlobalSpawnProvider` with the specified transform.

### /world config setspawn default

Resets the spawn provider to the world generator's default.

## Creating Custom SpawnProviders

You can create custom spawn providers by implementing `ISpawnProvider`:

```java
public class TeamSpawnProvider implements ISpawnProvider {
    private final Map<String, Transform> teamSpawns;
    private final Transform defaultSpawn;

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID playerUuid) {
        // Get player's team and return team spawn
        String team = getPlayerTeam(playerUuid);
        return teamSpawns.getOrDefault(team, defaultSpawn);
    }

    @Override
    public Transform[] getSpawnPoints() {
        return teamSpawns.values().toArray(new Transform[0]);
    }

    @Override
    public boolean isWithinSpawnDistance(@Nonnull Vector3d position, double distance) {
        // Check if position is near any team spawn
        double distSq = distance * distance;
        for (Transform spawn : teamSpawns.values()) {
            if (position.distanceSquaredTo(spawn.getPosition()) < distSq) {
                return true;
            }
        }
        return false;
    }
}
```

## Spawn Protection

The `isWithinSpawnDistance()` method is used for spawn protection mechanics:

```java
ISpawnProvider spawnProvider = world.getWorldConfig().getSpawnProvider();

// Check if a position is within 16 blocks of spawn
boolean nearSpawn = spawnProvider.isWithinSpawnDistance(blockPosition, 16.0);

if (nearSpawn) {
    // Prevent block breaking near spawn
    event.setCancelled(true);
}
```

## Transform Class

Spawn points use the `Transform` class which contains position and rotation:

```java
public class Transform {
    private Vector3d position;  // X, Y, Z coordinates
    private Vector3f rotation;  // Pitch, Yaw, Roll in degrees

    public Transform(Vector3d position, Vector3f rotation) {
        this.position = position;
        this.rotation = rotation;
    }

    public Vector3d getPosition() { return position; }
    public Vector3f getRotation() { return rotation; }
}
```

## Related Classes

| Class | Package | Description |
|-------|---------|-------------|
| `ISpawnProvider` | `...world.spawn` | Base interface for spawn providers |
| `GlobalSpawnProvider` | `...world.spawn` | Single spawn point for all |
| `IndividualSpawnProvider` | `...world.spawn` | Multiple spawn points, hash-selected |
| `FitToHeightMapSpawnProvider` | `...world.spawn` | Terrain-adjusted spawn decorator |
| `SpawnUtil` | `...world` | Helper methods for spawn transforms |
| `WorldConfig` | `...world` | World configuration including spawn |
| `Transform` | `...math.vector` | Position + rotation data |

## Source References

- `com/hypixel/hytale/server/core/universe/world/spawn/ISpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/GlobalSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/IndividualSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/FitToHeightMapSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/SpawnUtil.java`
