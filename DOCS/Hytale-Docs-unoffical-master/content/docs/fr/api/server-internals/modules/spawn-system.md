---
id: spawn-system
title: Systeme de Spawn
sidebar_label: Systeme de Spawn
sidebar_position: 18
description: Documentation du systeme SpawnProvider pour gerer les points d'apparition des joueurs dans les mondes Hytale
---

# Systeme de Spawn

Le systeme de spawn dans Hytale gere ou les joueurs apparaissent quand ils rejoignent un monde ou reapparaissent. Il utilise une architecture flexible basee sur des providers qui permet differents comportements de spawn par monde.

## Architecture

### Interface principale : ISpawnProvider

```java
package com.hypixel.hytale.server.core.universe.world.spawn;

public interface ISpawnProvider {
    // Obtenir le point de spawn pour un joueur specifique
    Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID playerUuid);

    // Obtenir tous les points de spawn possibles (deprecie)
    @Deprecated
    Transform[] getSpawnPoints();

    // Verifier si une position est dans la distance de protection du spawn
    boolean isWithinSpawnDistance(@Nonnull Vector3d position, double distance);
}
```

### Implementations disponibles

| Provider | Description | Cas d'usage |
|----------|-------------|-------------|
| `GlobalSpawnProvider` | Point de spawn fixe unique pour tous les joueurs | Mondes hub, lobbys |
| `IndividualSpawnProvider` | Selectionne parmi plusieurs points selon l'UUID du joueur | Repartir les joueurs |
| `FitToHeightMapSpawnProvider` | Enveloppe un autre provider et ajuste Y a la hauteur du terrain | Evite de spawn sous terre |

## Types de SpawnProvider

### GlobalSpawnProvider

Fournit un point de spawn statique unique pour tous les joueurs.

```java
public class GlobalSpawnProvider implements ISpawnProvider {
    private Transform spawnPoint;

    public GlobalSpawnProvider(Transform spawnPoint) {
        this.spawnPoint = spawnPoint;
    }

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        return this.spawnPoint; // Meme point pour tout le monde
    }
}
```

**Configuration JSON :**
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

Selectionne un point de spawn dans une liste basee sur le hash de l'UUID du joueur. Cela distribue les joueurs sur plusieurs points de spawn de maniere consistante (meme joueur = meme spawn).

```java
public class IndividualSpawnProvider implements ISpawnProvider {
    private Transform[] spawnPoints;

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        // Selection basee sur hash - consistant par joueur
        int index = Math.abs((int)HashUtil.hashUuid(uuid)) % spawnPoints.length;
        return spawnPoints[index];
    }
}
```

**Configuration JSON :**
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

Un decorateur qui enveloppe un autre SpawnProvider et ajuste la coordonnee Y pour correspondre a la hauteur du terrain si le point de spawn est sous terre (Y < 0).

```java
public class FitToHeightMapSpawnProvider implements ISpawnProvider {
    private ISpawnProvider spawnProvider; // Provider enveloppe

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID uuid) {
        Transform spawnPoint = spawnProvider.getSpawnPoint(world, uuid);
        Vector3d position = spawnPoint.getPosition();

        // Si sous terre, ajuster a la hauteur du terrain
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

## Acceder au SpawnProvider

### Depuis WorldConfig

```java
World world = Universe.get().getWorld("myworld");
WorldConfig config = world.getWorldConfig();

// Obtenir le spawn provider actuel
ISpawnProvider spawnProvider = config.getSpawnProvider();

// Obtenir le point de spawn pour un joueur
Transform spawnPoint = spawnProvider.getSpawnPoint(world, playerUuid);
Vector3d position = spawnPoint.getPosition();
Vector3f rotation = spawnPoint.getRotation();
```

### Definir le SpawnProvider

```java
// Creer un nouveau point de spawn
Vector3d position = new Vector3d(100, 65, 200);
Vector3f rotation = new Vector3f(0, 90, 0); // Face a l'est
Transform transform = new Transform(position, rotation);

// Definir comme spawn global
WorldConfig config = world.getWorldConfig();
config.setSpawnProvider(new GlobalSpawnProvider(transform));
config.markChanged(); // Sauvegarder les changements
```

## Classe utilitaire SpawnUtil

La classe `SpawnUtil` fournit des methodes utilitaires pour appliquer les transforms de spawn :

```java
public final class SpawnUtil {
    // Appliquer le transform de spawn a un joueur rejoignant un monde
    public static TransformComponent applyFirstSpawnTransform(
        @Nonnull Holder<EntityStore> holder,
        @Nonnull World world,
        @Nonnull WorldConfig worldConfig,
        @Nonnull UUID playerUuid
    ) {
        ISpawnProvider spawnProvider = worldConfig.getSpawnProvider();
        if (spawnProvider == null) return null;

        Transform spawnPoint = spawnProvider.getSpawnPoint(world, playerUuid);

        // Creer et appliquer le composant transform
        TransformComponent transform = new TransformComponent(
            spawnPoint.getPosition(),
            new Vector3f(0, spawnPoint.getRotation().getYaw(), 0)
        );
        holder.addComponent(TransformComponent.getComponentType(), transform);

        // Definir la rotation de la tete
        HeadRotation headRotation = holder.ensureAndGetComponent(HeadRotation.getComponentType());
        headRotation.teleportRotation(spawnPoint.getRotation());

        return transform;
    }
}
```

## Commandes integrees

### /world config setspawn

Definit le spawn du monde a la position actuelle ou aux coordonnees specifiees.

```
/world config setspawn                    # Utiliser position et rotation actuelles
/world config setspawn 100 65 200         # Specifier la position
/world config setspawn 100 65 200 0 90 0  # Specifier position et rotation
```

Cette commande cree un `GlobalSpawnProvider` avec le transform specifie.

### /world config setspawn default

Reinitialise le spawn provider aux valeurs par defaut du generateur de monde.

## Creer des SpawnProviders personnalises

Vous pouvez creer des spawn providers personnalises en implementant `ISpawnProvider` :

```java
public class TeamSpawnProvider implements ISpawnProvider {
    private final Map<String, Transform> teamSpawns;
    private final Transform defaultSpawn;

    @Override
    public Transform getSpawnPoint(@Nonnull World world, @Nonnull UUID playerUuid) {
        // Obtenir l'equipe du joueur et retourner le spawn d'equipe
        String team = getPlayerTeam(playerUuid);
        return teamSpawns.getOrDefault(team, defaultSpawn);
    }

    @Override
    public Transform[] getSpawnPoints() {
        return teamSpawns.values().toArray(new Transform[0]);
    }

    @Override
    public boolean isWithinSpawnDistance(@Nonnull Vector3d position, double distance) {
        // Verifier si la position est proche d'un spawn d'equipe
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

## Protection du Spawn

La methode `isWithinSpawnDistance()` est utilisee pour les mecaniques de protection du spawn :

```java
ISpawnProvider spawnProvider = world.getWorldConfig().getSpawnProvider();

// Verifier si une position est a moins de 16 blocs du spawn
boolean nearSpawn = spawnProvider.isWithinSpawnDistance(blockPosition, 16.0);

if (nearSpawn) {
    // Empecher la destruction de blocs pres du spawn
    event.setCancelled(true);
}
```

## Classe Transform

Les points de spawn utilisent la classe `Transform` qui contient position et rotation :

```java
public class Transform {
    private Vector3d position;  // Coordonnees X, Y, Z
    private Vector3f rotation;  // Pitch, Yaw, Roll en degres

    public Transform(Vector3d position, Vector3f rotation) {
        this.position = position;
        this.rotation = rotation;
    }

    public Vector3d getPosition() { return position; }
    public Vector3f getRotation() { return rotation; }
}
```

## Classes associees

| Classe | Package | Description |
|--------|---------|-------------|
| `ISpawnProvider` | `...world.spawn` | Interface de base pour les spawn providers |
| `GlobalSpawnProvider` | `...world.spawn` | Point de spawn unique pour tous |
| `IndividualSpawnProvider` | `...world.spawn` | Points multiples, selection par hash |
| `FitToHeightMapSpawnProvider` | `...world.spawn` | Decorateur ajuste au terrain |
| `SpawnUtil` | `...world` | Methodes utilitaires pour les transforms |
| `WorldConfig` | `...world` | Configuration du monde incluant le spawn |
| `Transform` | `...math.vector` | Donnees position + rotation |

## References source

- `com/hypixel/hytale/server/core/universe/world/spawn/ISpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/GlobalSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/IndividualSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/spawn/FitToHeightMapSpawnProvider.java`
- `com/hypixel/hytale/server/core/universe/world/SpawnUtil.java`
