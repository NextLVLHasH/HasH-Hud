---
id: entity-spawning
title: Systeme d'apparition des entites
sidebar_label: Apparition des entites
sidebar_position: 15
description: Documentation complete du systeme d'apparition des entites dans Hytale pour l'apparition naturelle des monstres, les marqueurs d'apparition, les balises d'apparition et les blocs d'apparition
---

# Systeme d'apparition des entites

Le systeme d'apparition des entites dans Hytale fournit un cadre complet pour faire apparaitre des PNJ et des entites dans le monde. Ce systeme prend en charge plusieurs mecanismes d'apparition, notamment l'apparition naturelle dans le monde, les marqueurs d'apparition, les balises d'apparition, les blocs d'apparition et les prefabs d'apparition.

## Apercu

Le systeme d'apparition se compose de plusieurs composants cles :

- **SpawningPlugin** - Le plugin principal gerant toutes les fonctionnalites d'apparition
- **WorldSpawnManager** - Gere l'apparition naturelle des PNJ par environnement
- **BeaconSpawnManager** - Gere les balises d'apparition a proximite des joueurs
- **SpawnMarker** - Generateurs de PNJ a emplacement fixe avec minuteries de reapparition
- **BlockSpawner** - Generateurs bases sur des blocs qui se remplacent par d'autres blocs
- **PrefabSpawner** - Fait apparaitre des structures prefab pendant la generation du monde
- **SpawnSuppression** - Empeche l'apparition dans des zones designees

## SpawningPlugin

Le `SpawningPlugin` est le plugin principal qui gere l'ensemble du systeme d'apparition :

```java
package com.hypixel.hytale.server.spawning;

public class SpawningPlugin extends JavaPlugin {
    // Obtenir l'instance singleton
    public static SpawningPlugin get();

    // Obtenir les gestionnaires d'apparition
    public WorldSpawnManager getWorldSpawnManager();
    public BeaconSpawnManager getBeaconSpawnManager();

    // Obtenir les parametres d'apparition par environnement
    public EnvironmentSpawnParameters getWorldEnvironmentSpawnParameters(int environmentIndex);

    // Obtenir le modele par defaut du marqueur d'apparition
    public Model getSpawnMarkerModel();
}
```

**Source :** `com.hypixel.hytale.server.spawning.SpawningPlugin`

## Apparition naturelle dans le monde

### WorldNPCSpawn

Les apparitions de PNJ du monde definissent quels PNJ peuvent apparaitre naturellement dans des environnements specifiques :

```java
package com.hypixel.hytale.server.spawning.assets.spawns.config;

public class WorldNPCSpawn extends NPCSpawn {
    // Obtenir la carte des assets pour les configurations d'apparition mondiale
    public static IndexedLookupTableAssetMap<String, WorldNPCSpawn> getAssetMap();

    // Proprietes
    public String getId();
    public String[] getEnvironments();           // Environnements ou l'apparition se produit
    public IntSet getEnvironmentIds();           // Indices des environnements
    public RoleSpawnParameters[] getNPCs();      // PNJ pouvant apparaitre
    public double[] getDayTimeRange();           // Plage horaire (0-24 heures)
    public int[] getMoonPhaseRange();            // Plage de phase lunaire (0-4)
    public double[] getMoonPhaseWeightModifiers(); // Modificateurs de poids par phase lunaire
    public Map<LightType, double[]> getLightRange(LightType type); // Conditions de lumiere
    public DespawnParameters getDespawnParameters(); // Conditions de disparition
}
```

### Configuration WorldNPCSpawn

Les apparitions mondiales sont definies dans des fichiers JSON dans `NPC/Spawn/World/` :

```json
{
    "Id": "Zone1_Forest_Spawns",
    "Environments": ["Forest", "DenseForest"],
    "DayTimeRange": [0, 24],
    "MoonPhaseRange": [0, 4],
    "MoonPhaseWeightModifiers": [1.0, 1.0, 1.0, 1.5, 2.0],
    "LightRanges": {
        "Light": [0, 100],
        "SkyLight": [50, 100]
    },
    "ScaleDayTimeRange": true,
    "NPCs": [
        {
            "Id": "Kweebec",
            "Weight": 10.0,
            "SpawnBlockSet": "GrassBlocks",
            "Flock": "Kweebec_Small_Flock"
        },
        {
            "Id": "Trork_Scout",
            "Weight": 5.0,
            "SpawnBlockSet": "SolidBlocks"
        }
    ],
    "Despawn": {
        "DayTimeRange": [6, 18],
        "MoonPhaseRange": [0, 4]
    }
}
```

### RoleSpawnParameters

Chaque PNJ dans une configuration d'apparition a ses propres parametres :

```java
package com.hypixel.hytale.server.spawning.assets.spawns.config;

public class RoleSpawnParameters implements IWeightedElement {
    public String getId();              // ID du role du PNJ
    public double getWeight();          // Poids d'apparition relatif
    public String getSpawnBlockSet();   // Blocs valides pour l'apparition
    public int getSpawnBlockSetIndex(); // Index de l'ensemble de blocs
    public int getSpawnFluidTagIndex(); // Fluides valides pour l'apparition
    public String getFlockDefinitionId(); // Definition de groupe pour apparitions groupees
    public FlockAsset getFlockDefinition();
}
```

### Types de lumiere

Le systeme d'apparition prend en charge plusieurs conditions de lumiere :

| Type de lumiere | Description |
|-----------------|-------------|
| `Light` | Niveau de lumiere total combine (0-100) |
| `SkyLight` | Lumiere basee sur la profondeur souterraine (0-100) |
| `Sunlight` | Lumiere basee sur l'heure du jour (0-100) |
| `RedLight` | Niveau de lumiere rouge (0-100) |
| `GreenLight` | Niveau de lumiere verte (0-100) |
| `BlueLight` | Niveau de lumiere bleue (0-100) |

**Source :** `com.hypixel.hytale.server.spawning.assets.spawns.config.WorldNPCSpawn`

## Balises d'apparition

Les balises d'apparition font apparaitre des PNJ autour des joueurs dans des environnements specifiques avec des parametres configurables.

### BeaconNPCSpawn

```java
package com.hypixel.hytale.server.spawning.assets.spawns.config;

public class BeaconNPCSpawn extends NPCSpawn {
    // Obtenir la carte des assets
    public static IndexedLookupTableAssetMap<String, BeaconNPCSpawn> getAssetMap();

    // Distances d'apparition
    public double getTargetDistanceFromPlayer(); // Distance d'apparition ideale
    public double getMinDistanceFromPlayer();    // Distance d'apparition minimale
    public double getBeaconRadius();             // Rayon d'influence de la balise
    public double getSpawnRadius();              // Zone d'apparition physique

    // Limites d'apparition
    public int getMaxSpawnedNpcs();              // Maximum de PNJ simultanes
    public int[] getConcurrentSpawnsRange();     // PNJ par vague d'apparition

    // Timing d'apparition
    public Duration[] getSpawnAfterGameTimeRange(); // Temps de recharge en temps de jeu
    public Duration[] getSpawnAfterRealTimeRange(); // Temps de recharge en temps reel
    public double[] getInitialSpawnDelay();      // Delai initial avant la premiere apparition

    // Parametres de disparition
    public double getNpcIdleDespawnTimeSeconds(); // Temps de disparition PNJ inactif
    public Duration getBeaconVacantDespawnTime(); // Disparition de balise sans joueurs

    // Configuration des PNJ
    public String getNpcSpawnState();            // Forcer le PNJ dans cet etat
    public String getNpcSpawnSubState();         // Forcer le sous-etat du PNJ
    public String getTargetSlot();               // Slot cible pour le joueur

    // Suppression
    public String getSpawnSuppression();         // Suppression attachee
    public boolean isOverrideSpawnSuppressors(); // Ignorer les suppressions

    // Courbes de mise a l'echelle
    public ScaledXYResponseCurve getMaxSpawnsScalingCurve();      // Adapter max PNJ au nombre de joueurs
    public ScaledXYResponseCurve getConcurrentSpawnsScalingCurve(); // Adapter le taux avec les joueurs
}
```

### Configuration BeaconNPCSpawn

Les apparitions par balise sont definies dans des fichiers JSON dans `NPC/Spawn/Beacons/` :

```json
{
    "Id": "Forest_Hostile_Beacon",
    "Environments": ["Forest", "DenseForest"],
    "Model": "Spawn_Beacon_Hostile",
    "DayTimeRange": [20, 6],
    "TargetDistanceFromPlayer": 15.0,
    "MinDistanceFromPlayer": 8.0,
    "YRange": [-5, 10],
    "MaxSpawnedNPCs": 5,
    "ConcurrentSpawnsRange": [1, 3],
    "SpawnAfterGameTimeRange": ["PT2M", "PT5M"],
    "InitialSpawnDelayRange": [5.0, 15.0],
    "NPCIdleDespawnTime": 30.0,
    "BeaconVacantDespawnGameTime": "PT10M",
    "BeaconRadius": 25.0,
    "SpawnRadius": 20.0,
    "NPCSpawnState": "Chase",
    "TargetSlot": "LockedTarget",
    "SpawnSuppression": "Hostile_Suppression",
    "NPCs": [
        {
            "Id": "Trork_Scout",
            "Weight": 5.0,
            "Flock": "Trork_Patrol"
        },
        {
            "Id": "Skeleton_Archer",
            "Weight": 3.0
        }
    ]
}
```

### Entite SpawnBeacon

L'entite `SpawnBeacon` gere les instances de balise individuelles :

```java
package com.hypixel.hytale.server.spawning.beacons;

public class SpawnBeacon extends Entity {
    // Obtenir le type de composant
    public static ComponentType<EntityStore, SpawnBeacon> getComponentType();

    // Obtenir/definir la configuration d'apparition
    public BeaconSpawnWrapper getSpawnWrapper();
    public void setSpawnWrapper(BeaconSpawnWrapper spawnWrapper);
    public String getSpawnConfigId();

    // Declencher l'apparition manuellement
    public boolean manualTrigger(
        Ref<EntityStore> ref,
        FloodFillPositionSelector positionSelector,
        Ref<EntityStore> targetRef,
        Store<EntityStore> store
    );

    // Visibilite (visible uniquement en mode Creatif)
    public boolean isHiddenFromLivingEntity(...);

    // Non collisionnable
    public boolean isCollidable(); // Retourne false
}
```

**Source :** `com.hypixel.hytale.server.spawning.beacons.SpawnBeacon`

## Marqueurs d'apparition

Les marqueurs d'apparition sont des generateurs a emplacement fixe qui font apparaitre des PNJ avec des minuteries de reapparition.

### Configuration SpawnMarker

```java
package com.hypixel.hytale.server.spawning.assets.spawnmarker.config;

public class SpawnMarker {
    // Obtenir la carte des assets
    public static DefaultAssetMap<String, SpawnMarker> getAssetMap();

    // Proprietes
    public String getId();
    public String getModel();                     // Representation visuelle
    public IWeightedMap<SpawnConfiguration> getWeightedConfigurations(); // PNJ a faire apparaitre
    public double getExclusionRadius();           // Pas d'apparition si joueur a portee
    public double getMaxDropHeightSquared();      // Decalage maximum du sol
    public boolean isRealtimeRespawn();           // Utiliser temps reel vs temps de jeu
    public boolean isManualTrigger();             // Necessite un declenchement manuel
    public double getDeactivationDistance();      // Distance pour stocker les PNJ
    public double getDeactivationTime();          // Delai avant desactivation
}
```

### SpawnMarker.SpawnConfiguration

Chaque marqueur d'apparition peut faire apparaitre differents PNJ avec des poids :

```java
public static class SpawnConfiguration implements IWeightedElement {
    public String getNpc();                    // Nom du role du PNJ
    public double getWeight();                 // Poids d'apparition
    public double getRealtimeRespawnTime();    // Secondes jusqu'a reapparition
    public Duration getSpawnAfterGameTime();   // Temps de jeu jusqu'a reapparition
    public String getFlockDefinitionId();      // Groupe optionnel
    public FlockAsset getFlockDefinition();
}
```

### Configuration JSON SpawnMarker

Les marqueurs d'apparition sont definis dans des fichiers JSON dans `NPC/Spawn/Markers/` :

```json
{
    "Id": "Village_Guard_Marker",
    "Model": "NPC_Spawn_Marker",
    "ExclusionRadius": 10.0,
    "MaxDropHeight": 3.0,
    "RealtimeRespawn": false,
    "ManualTrigger": false,
    "DeactivationDistance": 50.0,
    "DeactivationTime": 10.0,
    "NPCs": [
        {
            "Name": "Village_Guard",
            "Weight": 1.0,
            "SpawnAfterGameTime": "P1D"
        },
        {
            "Name": null,
            "Weight": 0.2,
            "SpawnAfterGameTime": "PT1H"
        }
    ]
}
```

### Composant SpawnMarkerEntity

Le composant `SpawnMarkerEntity` gere l'etat du marqueur d'apparition :

```java
package com.hypixel.hytale.server.spawning.spawnmarkers;

public class SpawnMarkerEntity implements Component<EntityStore> {
    // Obtenir le type de composant
    public static ComponentType<EntityStore, SpawnMarkerEntity> getComponentType();

    // Configuration
    public SpawnMarker getCachedMarker();
    public void setSpawnMarker(SpawnMarker marker);
    public String getSpawnMarkerId();

    // Etat d'apparition
    public int getSpawnCount();
    public void setSpawnCount(int count);
    public int decrementAndGetSpawnCount();

    // Timing de reapparition
    public void setRespawnCounter(double seconds);
    public boolean tickRespawnTimer(float dt);
    public void setSpawnAfter(Instant instant);
    public Instant getSpawnAfter();
    public void setGameTimeRespawn(Duration duration);
    public Duration pollGameTimeRespawn();

    // Suppression
    public Set<UUID> getSuppressedBy();
    public void suppress(UUID suppressor);
    public void releaseSuppression(UUID suppressor);
    public void clearAllSuppressions();

    // Declenchement manuel
    public boolean isManualTrigger();
    public boolean trigger(Ref<EntityStore> markerRef, Store<EntityStore> store);

    // Apparition interne
    public boolean spawnNPC(Ref<EntityStore> ref, SpawnMarker marker, Store<EntityStore> store);
}
```

**Source :** `com.hypixel.hytale.server.spawning.spawnmarkers.SpawnMarkerEntity`

## Suppression d'apparition

Les suppressions d'apparition empechent l'apparition des PNJ dans des zones designees.

### Configuration SpawnSuppression

```java
package com.hypixel.hytale.server.spawning.assets.spawnsuppression;

public class SpawnSuppression {
    // Obtenir la carte des assets
    public static IndexedAssetMap<String, SpawnSuppression> getAssetMap();

    // Proprietes
    public String getId();
    public double getRadius();              // Rayon de suppression
    public int[] getSuppressedGroupIds();   // Groupes de PNJ a supprimer
    public boolean isSuppressSpawnMarkers(); // Supprimer aussi les marqueurs d'apparition
}
```

### Configuration JSON SpawnSuppression

Les suppressions sont definies dans des fichiers JSON dans `NPC/Spawn/Suppression/` :

```json
{
    "Id": "Village_Safe_Zone",
    "SuppressionRadius": 50.0,
    "SuppressedGroups": ["Hostile", "Undead"],
    "SuppressSpawnMarkers": true
}
```

**Source :** `com.hypixel.hytale.server.spawning.assets.spawnsuppression.SpawnSuppression`

## Blocs d'apparition

Les blocs d'apparition sont des blocs speciaux qui se remplacent par d'autres blocs pendant le chargement du monde.

### Composant BlockSpawner

```java
package com.hypixel.hytale.builtin.blockspawner.state;

public class BlockSpawner implements Component<ChunkStore> {
    // Obtenir le type de composant
    public static ComponentType<ChunkStore, BlockSpawner> getComponentType();

    // Proprietes
    public String getBlockSpawnerId();
    public void setBlockSpawnerId(String id);
}
```

### Configuration BlockSpawnerTable

Les tables de blocs d'apparition definissent des selections de blocs ponderees :

```json
{
    "Id": "Ore_Spawner",
    "Entries": [
        {
            "Block": "Stone",
            "Weight": 70.0,
            "Rotation": "NONE"
        },
        {
            "Block": "Iron_Ore",
            "Weight": 20.0,
            "Rotation": "RANDOM"
        },
        {
            "Block": "Gold_Ore",
            "Weight": 8.0,
            "Rotation": "RANDOM"
        },
        {
            "Block": "Diamond_Ore",
            "Weight": 2.0,
            "Rotation": "RANDOM"
        }
    ]
}
```

### Modes de rotation BlockSpawnerEntry

| Mode | Description |
|------|-------------|
| `NONE` | Aucune rotation appliquee |
| `RANDOM` | Rotation aleatoire basee sur le hachage de position |
| `INHERIT` | Heriter de la rotation du bloc d'apparition |

**Source :** `com.hypixel.hytale.builtin.blockspawner.BlockSpawnerPlugin`

## Prefabs d'apparition

Les prefabs d'apparition placent des structures prefab pendant la generation du monde.

### PrefabSpawnerState

```java
package com.hypixel.hytale.server.core.modules.prefabspawner;

public class PrefabSpawnerState extends BlockState {
    public static final String PREFAB_SPAWNER_TYPE = "prefabspawner";

    // Proprietes
    public String getPrefabPath();           // Chemin du prefab (notation par points)
    public void setPrefabPath(String path);

    public boolean isFitHeightmap();         // Suivre la carte de hauteur du terrain
    public void setFitHeightmap(boolean fit);

    public boolean isInheritSeed();          // Heriter de l'ID worldgen
    public void setInheritSeed(boolean inherit);

    public boolean isInheritHeightCondition(); // Heriter des verifications de hauteur
    public void setInheritHeightCondition(boolean inherit);

    public PrefabWeights getPrefabWeights(); // Selection de prefab ponderee
    public void setPrefabWeights(PrefabWeights weights);
}
```

**Source :** `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerState`

## Contexte d'apparition

Le `SpawningContext` gere la validation de la position d'apparition :

```java
package com.hypixel.hytale.server.spawning;

public class SpawningContext {
    // Donnees de position
    public int xBlock, yBlock, zBlock;
    public double xSpawn, ySpawn, zSpawn;
    public double yaw, pitch, roll;

    // Informations sur le sol
    public int groundLevel;
    public BlockType groundBlockType;
    public int groundFluidId;
    public Fluid groundFluid;

    // Niveau d'eau
    public int waterLevel;
    public int airHeight;

    // Definir le PNJ a faire apparaitre
    public boolean setSpawnable(ISpawnableWithModel spawnable);
    public boolean setSpawnable(ISpawnableWithModel spawnable, boolean maxScale);

    // Definir l'emplacement d'apparition
    public boolean set(World world, double x, double y, double z);
    public void setChunk(WorldChunk chunk, int environmentIndex);
    public boolean setColumn(int x, int z, int yHint, int[] yRange);

    // Validation d'apparition
    public SpawnTestResult canSpawn();
    public SpawnTestResult canSpawn(boolean testBlocks, boolean testEntities);

    // Helpers de position
    public boolean isOnSolidGround();
    public boolean isInWater(float minDepth);
    public boolean isInAir(double height);
    public boolean canBreathe(boolean breathesInAir, boolean breathesInWater);
    public boolean validatePosition(int invalidMaterials);

    // Obtenir les resultats
    public Vector3d newPosition();
    public Vector3f newRotation();
    public Model getModel();
}
```

### SpawnTestResult

```java
package com.hypixel.hytale.server.spawning;

public enum SpawnTestResult {
    TEST_OK,              // L'apparition est valide
    FAIL_NO_POSITION,     // Aucune position valide trouvee
    FAIL_INVALID_POSITION, // Position bloquee
    FAIL_INTERSECT_ENTITY, // Chevaucherait une entite
    FAIL_NO_MOTION_CONTROLLERS, // Le PNJ ne peut pas se deplacer ici
    FAIL_NOT_SPAWNABLE,   // PNJ non apparitionnable
    FAIL_NOT_BREATHABLE   // Le PNJ ne peut pas respirer ici
}
```

### SpawnRejection

```java
package com.hypixel.hytale.server.spawning;

public enum SpawnRejection {
    OUTSIDE_LIGHT_RANGE,  // Niveau de lumiere invalide
    INVALID_SPAWN_BLOCK,  // Mauvais type de bloc
    INVALID_POSITION,     // Position bloquee
    NO_POSITION,          // Aucune position trouvee
    NOT_BREATHABLE,       // Ne peut pas respirer
    OTHER                 // Autre raison
}
```

**Source :** `com.hypixel.hytale.server.spawning.SpawningContext`

## Faire apparaitre des entites par programmation

### Utiliser NPCPlugin

```java
import com.hypixel.hytale.server.npc.NPCPlugin;
import com.hypixel.hytale.server.npc.entities.NPCEntity;
import it.unimi.dsi.fastutil.Pair;

public class SpawnExample {

    public Pair<Ref<EntityStore>, NPCEntity> spawnNPC(
        Store<EntityStore> store,
        String roleName,
        Vector3d position,
        Vector3f rotation
    ) {
        NPCPlugin npcPlugin = NPCPlugin.get();
        int roleIndex = npcPlugin.getIndex(roleName);

        return npcPlugin.spawnEntity(
            store,
            roleIndex,
            position,
            rotation,
            null,  // Utiliser le modele par defaut
            null   // Pas de callback post-apparition
        );
    }

    public Pair<Ref<EntityStore>, NPCEntity> spawnNPCWithCallback(
        Store<EntityStore> store,
        String roleName,
        Vector3d position,
        Vector3f rotation
    ) {
        NPCPlugin npcPlugin = NPCPlugin.get();
        int roleIndex = npcPlugin.getIndex(roleName);

        return npcPlugin.spawnEntity(
            store,
            roleIndex,
            position,
            rotation,
            null,
            (npc, ref, componentStore) -> {
                // Configuration post-apparition
                npc.getRole().getStateSupport().setState(ref, "Idle", null, componentStore);
            }
        );
    }
}
```

### Utiliser SpawningContext pour la validation

```java
import com.hypixel.hytale.server.spawning.SpawningContext;
import com.hypixel.hytale.server.spawning.SpawnTestResult;

public class ValidatedSpawn {

    public boolean trySpawnAt(
        World world,
        ISpawnableWithModel spawnable,
        double x, double y, double z
    ) {
        SpawningContext context = new SpawningContext();

        // Definir le spawnable (charge le modele et les limites)
        if (!context.setSpawnable(spawnable)) {
            return false;
        }

        // Definir la position et valider
        if (!context.set(world, x, y, z)) {
            return false;
        }

        // Verifier si l'apparition est valide
        SpawnTestResult result = context.canSpawn();
        if (result != SpawnTestResult.TEST_OK) {
            context.releaseFull();
            return false;
        }

        // Obtenir la position validee
        Vector3d spawnPos = context.newPosition();
        Vector3f spawnRot = context.newRotation();

        context.releaseFull();
        return true;
    }
}
```

### Apparition avec des groupes (Flocks)

```java
import com.hypixel.hytale.server.flock.FlockPlugin;
import com.hypixel.hytale.server.flock.config.FlockAsset;

public class FlockSpawnExample {

    public void spawnFlock(
        Store<EntityStore> store,
        String roleName,
        String flockId,
        Vector3d position,
        Vector3f rotation
    ) {
        NPCPlugin npcPlugin = NPCPlugin.get();
        int roleIndex = npcPlugin.getIndex(roleName);

        // Faire apparaitre le leader
        Pair<Ref<EntityStore>, NPCEntity> leaderPair = npcPlugin.spawnEntity(
            store, roleIndex, position, rotation, null, null
        );

        // Obtenir la definition du groupe
        FlockAsset flockAsset = FlockAsset.getAssetMap().getAsset(flockId);

        // Faire apparaitre les membres du groupe autour du leader
        FlockPlugin.trySpawnFlock(
            leaderPair.first(),
            leaderPair.second(),
            store,
            roleIndex,
            position,
            rotation,
            flockAsset,
            null  // Callback post-apparition
        );
    }
}
```

## Commandes de console

### Commandes d'apparition

| Commande | Description |
|----------|-------------|
| `/spawn beacons` | Lister les balises d'apparition actives |
| `/spawn markers` | Lister les marqueurs d'apparition actifs |
| `/spawn populate` | Forcer le peuplement d'apparition |
| `/spawn stats` | Afficher les statistiques d'apparition |
| `/spawn suppression` | Lister les suppressions actives |

### Commandes de bloc d'apparition

| Commande | Description |
|----------|-------------|
| `/blockspawner get` | Obtenir le bloc d'apparition a la position |
| `/blockspawner set <id>` | Definir l'ID du bloc d'apparition |

### Commandes de prefab d'apparition

| Commande | Description |
|----------|-------------|
| `/prefabspawner get` | Obtenir les parametres du prefab d'apparition |
| `/prefabspawner set <path>` | Definir le chemin du prefab |
| `/prefabspawner weight <prefab> <weight>` | Definir le poids du prefab |

## Proprietes de base NPCSpawn

Toutes les configurations d'apparition (WorldNPCSpawn, BeaconNPCSpawn) partagent ces proprietes de base :

```java
package com.hypixel.hytale.server.spawning.assets.spawns.config;

public abstract class NPCSpawn {
    // Plages par defaut
    public static final double[] DEFAULT_DAY_TIME_RANGE = {0.0, Double.MAX_VALUE};
    public static final int[] DEFAULT_MOON_PHASE_RANGE = {0, Integer.MAX_VALUE};
    public static final double[] FULL_LIGHT_RANGE = {0.0, 100.0};

    // Proprietes communes
    public abstract String getId();
    public RoleSpawnParameters[] getNPCs();
    public DespawnParameters getDespawnParameters();
    public String[] getEnvironments();
    public IntSet getEnvironmentIds();
    public double[] getDayTimeRange();
    public int[] getMoonPhaseRange();
    public double[] getLightRange(LightType lightType);
    public boolean isScaleDayTimeRange();
}
```

### DespawnParameters

```java
public static class DespawnParameters {
    public double[] getDayTimeRange();  // Plage horaire pour disparition
    public int[] getMoonPhaseRange();   // Plage de phase lunaire pour disparition
}
```

## Fichiers sources

| Classe | Chemin |
|--------|--------|
| `SpawningPlugin` | `com.hypixel.hytale.server.spawning.SpawningPlugin` |
| `SpawningContext` | `com.hypixel.hytale.server.spawning.SpawningContext` |
| `SpawnTestResult` | `com.hypixel.hytale.server.spawning.SpawnTestResult` |
| `SpawnRejection` | `com.hypixel.hytale.server.spawning.SpawnRejection` |
| `ISpawnable` | `com.hypixel.hytale.server.spawning.ISpawnable` |
| `NPCSpawn` | `com.hypixel.hytale.server.spawning.assets.spawns.config.NPCSpawn` |
| `WorldNPCSpawn` | `com.hypixel.hytale.server.spawning.assets.spawns.config.WorldNPCSpawn` |
| `BeaconNPCSpawn` | `com.hypixel.hytale.server.spawning.assets.spawns.config.BeaconNPCSpawn` |
| `RoleSpawnParameters` | `com.hypixel.hytale.server.spawning.assets.spawns.config.RoleSpawnParameters` |
| `SpawnMarker` | `com.hypixel.hytale.server.spawning.assets.spawnmarker.config.SpawnMarker` |
| `SpawnMarkerEntity` | `com.hypixel.hytale.server.spawning.spawnmarkers.SpawnMarkerEntity` |
| `SpawnBeacon` | `com.hypixel.hytale.server.spawning.beacons.SpawnBeacon` |
| `SpawnSuppression` | `com.hypixel.hytale.server.spawning.assets.spawnsuppression.SpawnSuppression` |
| `WorldSpawnManager` | `com.hypixel.hytale.server.spawning.world.manager.WorldSpawnManager` |
| `BeaconSpawnManager` | `com.hypixel.hytale.server.spawning.managers.BeaconSpawnManager` |
| `SpawnManager` | `com.hypixel.hytale.server.spawning.managers.SpawnManager` |
| `BlockSpawnerPlugin` | `com.hypixel.hytale.builtin.blockspawner.BlockSpawnerPlugin` |
| `BlockSpawner` | `com.hypixel.hytale.builtin.blockspawner.state.BlockSpawner` |
| `PrefabSpawnerModule` | `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerModule` |
| `PrefabSpawnerState` | `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerState` |
