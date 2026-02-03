---
id: world
title: World API
sidebar_label: World
sidebar_position: 6
description: Complete documentation of the World class and related APIs
---

# World API

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis.
:::

## Overview

The `World` class represents a game world containing chunks, entities, and players. It manages world ticking, chunk loading, entity spawning, and player management.

**Source**: `com.hypixel.hytale.server.core.universe.world.World`

**Import**:
```java
import com.hypixel.hytale.server.core.universe.world.World;
```

## Getting a World Reference

### From Player

```java
Player player = context.senderAs(Player.class);
World world = player.getWorld();
```

### From Universe

```java
Universe universe = Universe.get();
World spawnWorld = universe.getSpawnWorld();
```

## World Properties

### Basic Information

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getName()` | `String` | Returns the world's name |
| `getWorldConfig()` | `WorldConfig` | Returns the world configuration |
| `getSavePath()` | `Path` | Returns the world's save directory path |
| `isAlive()` | `boolean` | Returns true if the world is active |

### Time and Ticking

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getTick()` | `long` | Returns the current tick count |
| `isTicking()` | `boolean` | Returns true if world is ticking |
| `setTicking(boolean)` | `void` | Enable/disable world ticking |
| `isPaused()` | `boolean` | Returns true if world is paused |
| `setPaused(boolean)` | `void` | Pause/unpause the world |
| `setTps(int)` | `void` | Set ticks per second |
| `getDaytimeDurationSeconds()` | `int` | Get daytime duration |
| `getNighttimeDurationSeconds()` | `int` | Get nighttime duration |

### Configuration

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getDeathConfig()` | `DeathConfig` | Returns death/respawn configuration |
| `getGameplayConfig()` | `GameplayConfig` | Returns gameplay configuration |
| `getWorldPathConfig()` | `WorldPathConfig` | Returns path configuration |

## Players

### Getting Players

```java
// Get all players in the world (deprecated)
@Deprecated
List<Player> players = world.getPlayers();

// Get player count (preferred)
int count = world.getPlayerCount();

// Get player references
Collection<PlayerRef> playerRefs = world.getPlayerRefs();
```

### Adding/Removing Players

```java
// Add a player to the world
CompletableFuture<PlayerRef> future = world.addPlayer(playerRef);

// Add player at specific position
Transform spawnPosition = new Transform(x, y, z, yaw, pitch, roll);
world.addPlayer(playerRef, spawnPosition);

// Drain all players to another world
world.drainPlayersTo(fallbackWorld);
```

### Tracking Players

```java
// Track a player reference
world.trackPlayerRef(playerRef);

// Untrack a player reference
world.untrackPlayerRef(playerRef);
```

## Entities

### Getting Entities

```java
// Get entity by UUID
Entity entity = world.getEntity(uuid);

// Get entity reference by UUID
Ref<EntityStore> entityRef = world.getEntityRef(uuid);
```

### Spawning Entities

```java
// Spawn an entity at a position
Vector3d position = new Vector3d(x, y, z);
Vector3f rotation = new Vector3f(yaw, pitch, roll);

MyEntity entity = new MyEntity();
world.spawnEntity(entity, position, rotation);

// Add entity with specific reason
world.addEntity(entity, position, rotation, AddReason.SPAWN);
```

## Chunks

### Loading Chunks

```java
// Get chunk if already in memory
WorldChunk chunk = world.getChunkIfInMemory(chunkIndex);

// Get chunk if loaded
WorldChunk chunk = world.getChunkIfLoaded(chunkIndex);

// Load chunk asynchronously
CompletableFuture<WorldChunk> future = world.getChunkAsync(chunkIndex);
```

### Chunk Managers

```java
// Get chunk store
ChunkStore chunkStore = world.getChunkStore();

// Get chunk lighting manager
ChunkLightingManager lighting = world.getChunkLighting();
```

## Messaging

```java
// Broadcast a message to all players in the world
world.sendMessage(Message.raw("Server announcement!"));

// Broadcast translated message
world.sendMessage(Message.translation("server.announcement.key"));
```

## Events

```java
// Get the world's event registry
EventRegistry eventRegistry = world.getEventRegistry();

// Register a world-specific event listener
eventRegistry.register(MyEvent.class, event -> {
    // Handle event in this world
});
```

## Stores

```java
// Get entity store for component access
EntityStore entityStore = world.getEntityStore();

// Get chunk store
ChunkStore chunkStore = world.getChunkStore();
```

## Execution

The World class extends `AbstractExecutorService` and can execute tasks on the world thread:

```java
// Execute a task on the world thread
world.execute(() -> {
    // This runs on the world's tick thread
    // Safe to modify world state here
});
```

## Features

```java
// Check if a feature is enabled
boolean enabled = world.isFeatureEnabled(ClientFeature.SOME_FEATURE);

// Register a feature
world.registerFeature(ClientFeature.SOME_FEATURE, true);

// Get all features
Map<ClientFeature, Boolean> features = world.getFeatures();

// Broadcast feature state to clients
world.broadcastFeatures();
```

## Example: World Information Command

```java
public class WorldInfoCommand extends CommandBase {
    public WorldInfoCommand() {
        super("worldinfo", "Show world information");
    }

    @Override
    protected void executeSync(CommandContext context) {
        if (!context.isPlayer()) {
            context.sendMessage(Message.raw("This command requires a player."));
            return;
        }

        Player player = context.senderAs(Player.class);
        World world = player.getWorld();

        StringBuilder info = new StringBuilder();
        info.append("=== World Info ===\n");
        info.append("Name: ").append(world.getName()).append("\n");
        info.append("Players: ").append(world.getPlayerCount()).append("\n");
        info.append("Tick: ").append(world.getTick()).append("\n");
        info.append("Ticking: ").append(world.isTicking()).append("\n");
        info.append("Paused: ").append(world.isPaused()).append("\n");
        info.append("Alive: ").append(world.isAlive()).append("\n");

        context.sendMessage(Message.raw(info.toString()));
    }
}
```

## Related Classes

- [`WorldConfig`](/docs/en/api/server-internals/world#worldconfig) - World configuration
- [`WorldChunk`](/docs/en/api/server-internals/chunks) - Chunk representation
- [`EntityStore`](/docs/en/api/server-internals/ecs) - Entity component storage
- [`Universe`](/docs/en/api/server-internals/universe) - World container/manager
- [`Player`](/docs/en/api/server-internals/player) - Player entity

## WorldConfig

The `WorldConfig` class holds world configuration settings.

### Common Properties

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getUuid()` | `UUID` | Returns the world's unique identifier |
| `getDisplayName()` | `String` | Returns the display name |
| `getSpawnPosition()` | `Vector3d` | Returns the default spawn position |
