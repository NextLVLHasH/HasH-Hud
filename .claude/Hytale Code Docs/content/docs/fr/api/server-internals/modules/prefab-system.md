---
id: prefab-system
title: Systeme de Prefabs
sidebar_label: Systeme de Prefabs
sidebar_position: 15
description: Documentation complete du systeme de prefabs Hytale pour generer des structures, batiments et arrangements complexes de blocs
---

# Systeme de Prefabs

Le systeme de prefabs dans Hytale offre un moyen puissant de creer, stocker et generer des structures pre-construites dans le monde. Les prefabs peuvent contenir des blocs, des entites, des fluides et des prefabs enfants imbriques, ce qui les rend ideaux pour tout, des petites decorations aux batiments complexes.

## Vue d'ensemble du systeme

Le systeme de prefabs est compose de plusieurs composants cles :

| Composant | Role |
|-----------|------|
| `PrefabStore` | Singleton central pour le chargement et la sauvegarde des prefabs |
| `PrefabBuffer` | Representation en memoire des donnees de prefab |
| `PrefabSpawnerModule` | Module plugin pour les blocs generateurs de prefabs |
| `PrefabSpawnerState` | Etat de bloc pour configurer les generateurs de prefabs |
| `PrefabUtil` | Classe utilitaire pour coller et supprimer des prefabs |
| `PrefabWeights` | Selection aleatoire ponderee pour les variantes de prefabs |

**Package source :** `com.hypixel.hytale.server.core.prefab`

## Format de fichier Prefab

Les prefabs sont stockes sous forme de fichiers `.prefab.json` avec un cache binaire optionnel (format `.lpf` pour un chargement plus rapide).

```
prefabs/
├── buildings/
│   ├── house_small.prefab.json
│   ├── house_medium.prefab.json
│   └── house_large.prefab.json
└── decorations/
    ├── tree_oak.prefab.json
    └── rock_formation.prefab.json
```

**Suffixes de fichiers :**
- `.prefab.json` - Format JSON lisible par l'homme
- `.lpf` - Format binaire en cache (genere automatiquement)
- `.prefab.json.lpf` - Cache binaire pour les assets immuables

**Source :** `com.hypixel.hytale.server.core.prefab.selection.buffer.PrefabBufferUtil`

## PrefabStore

Le `PrefabStore` est un singleton qui gere le chargement et la sauvegarde des prefabs a travers differents emplacements.

```java
// Obtenir l'instance singleton
PrefabStore prefabStore = PrefabStore.get();
```

### Chemins des Prefabs

Le systeme supporte plusieurs emplacements de prefabs :

| Type de chemin | Methode | Description |
|----------------|---------|-------------|
| Prefabs serveur | `getServerPrefabsPath()` | Repertoire `prefabs/` |
| Prefabs assets | `getAssetPrefabsPath()` | `Assets/Server/Prefabs/` |
| Prefabs WorldGen | `getWorldGenPrefabsPath()` | `worldgen/Default/Prefabs/` |

### Chargement des Prefabs

```java
// Charger un prefab par chemin relatif
BlockSelection prefab = PrefabStore.get().getServerPrefab("buildings/house.prefab.json");

// Charger depuis les packs d'assets
BlockSelection assetPrefab = PrefabStore.get().getAssetPrefab("structures/tower.prefab.json");

// Charger un repertoire de prefabs (pour la selection ponderee)
Map<Path, BlockSelection> prefabs = PrefabStore.get().getServerPrefabDir("buildings/houses");

// Trouver un prefab dans tous les packs d'assets
BlockSelection foundPrefab = PrefabStore.get().getAssetPrefabFromAnyPack("decorations/tree.prefab.json");
```

### Sauvegarde des Prefabs

```java
// Sauvegarder un prefab (echoue si existant)
PrefabStore.get().saveServerPrefab("my_prefab.prefab.json", blockSelection);

// Sauvegarder avec ecrasement
PrefabStore.get().saveServerPrefab("my_prefab.prefab.json", blockSelection, true);

// Sauvegarder dans le repertoire worldgen
PrefabStore.get().saveWorldGenPrefab("structures/dungeon.prefab.json", blockSelection, true);
```

**Source :** `com.hypixel.hytale.server.core.prefab.PrefabStore`

## PrefabBuffer

Le `PrefabBuffer` est une representation efficace en memoire des donnees de prefab, stockant les blocs dans un format base sur les colonnes.

### Proprietes du Buffer

```java
public interface IPrefabBuffer {
    // Point d'ancrage (origine de placement)
    int getAnchorX();
    int getAnchorY();
    int getAnchorZ();

    // Boite englobante
    int getMinX(PrefabRotation rotation);
    int getMinY();
    int getMinZ(PrefabRotation rotation);
    int getMaxX(PrefabRotation rotation);
    int getMaxY();
    int getMaxZ(PrefabRotation rotation);

    // Acces aux donnees
    int getColumnCount();
    ChildPrefab[] getChildPrefabs();
    int getBlockId(int x, int y, int z);
    int getFiller(int x, int y, int z);
    int getRotationIndex(int x, int y, int z);
}
```

### Chargement des Buffers avec mise en cache

```java
// Obtenir un buffer de prefab en cache (recommande pour les performances)
IPrefabBuffer buffer = PrefabBufferUtil.getCached(prefabPath);

// Charger sans mise en cache
PrefabBuffer buffer = PrefabBufferUtil.loadBuffer(prefabPath);

// Creer un accesseur pour l'iteration
PrefabBuffer.PrefabBufferAccessor accessor = buffer.newAccess();

// Toujours liberer une fois termine
accessor.release();
```

### Construction de Prefabs par programmation

```java
// Creer un nouveau constructeur de prefab
PrefabBuffer.Builder builder = PrefabBuffer.newBuilder();

// Definir le point d'ancrage
builder.setAnchor(new Vector3i(0, 0, 0));

// Ajouter des entrees de blocs
PrefabBufferBlockEntry[] entries = new PrefabBufferBlockEntry[3];
entries[0] = builder.newBlockEntry(0);
entries[0].blockId = BlockType.getAssetMap().getIndex("Stone");
entries[1] = builder.newBlockEntry(1);
entries[1].blockId = BlockType.getAssetMap().getIndex("Stone");
entries[2] = builder.newBlockEntry(2);
entries[2].blockId = BlockType.getAssetMap().getIndex("Stone");

// Ajouter la colonne (x=0, z=0)
builder.addColumn(0, 0, entries, null);

// Ajouter une reference de prefab enfant
builder.addChildPrefab(
    5, 0, 5,                    // Decalage de position
    "decorations/tree.prefab.json",  // Chemin
    false,                      // fitHeightmap
    true,                       // inheritSeed
    true,                       // inheritHeightCondition
    PrefabWeights.NONE,         // poids
    PrefabRotation.ROTATION_0   // rotation
);

// Construire le buffer final
PrefabBuffer prefab = builder.build();
```

**Source :** `com.hypixel.hytale.server.core.prefab.selection.buffer.impl.PrefabBuffer`

## Rotation de Prefab

Les prefabs peuvent etre tournes par increments de 90 degres autour de l'axe Y.

```java
public enum PrefabRotation {
    ROTATION_0,     // Pas de rotation
    ROTATION_90,    // 90 degres dans le sens horaire
    ROTATION_180,   // 180 degres
    ROTATION_270    // 270 degres (90 sens anti-horaire)
}
```

### Utilisation des Rotations

```java
// Convertir depuis l'enum Rotation
PrefabRotation rotation = PrefabRotation.fromRotation(Rotation.Ninety);

// Combiner des rotations
PrefabRotation combined = PrefabRotation.ROTATION_90.add(PrefabRotation.ROTATION_180);

// Tourner un vecteur
Vector3d position = new Vector3d(5, 0, 3);
rotation.rotate(position);

// Obtenir les coordonnees tournees
int newX = rotation.getX(originalX, originalZ);
int newZ = rotation.getZ(originalX, originalZ);

// Obtenir l'angle yaw en radians
float yaw = rotation.getYaw();
```

**Source :** `com.hypixel.hytale.server.core.prefab.PrefabRotation`

## Collage de Prefabs

La classe `PrefabUtil` fournit des methodes pour coller des prefabs dans le monde.

### Collage basique

```java
// Collage simple
PrefabUtil.paste(
    buffer,                      // IPrefabBuffer
    world,                       // World
    position,                    // Vector3i position cible
    Rotation.None,               // Rotation yaw
    false,                       // Force (ignorer les regles de placement)
    new Random(),                // Random pour les blocs bases sur la chance
    componentAccessor            // ComponentAccessor pour les evenements
);
```

### Options de collage avancees

```java
PrefabUtil.paste(
    buffer,                      // IPrefabBuffer
    world,                       // World
    position,                    // Vector3i position cible
    Rotation.Ninety,             // Rotation yaw
    true,                        // Forcer le placement
    random,                      // Instance Random
    setBlockSettings,            // Flags de parametres de bloc
    false,                       // technicalPaste (inclut les blocs editeur)
    false,                       // pasteAnchorAsBlock
    true,                        // loadEntities
    componentAccessor            // ComponentAccessor
);
```

### Verification de la validite du placement

```java
// Verifier si le prefab peut etre place
boolean canPlace = PrefabUtil.canPlacePrefab(
    buffer,
    world,
    position,
    Rotation.None,
    blockMask,                   // IntSet des IDs de blocs autorises a remplacer
    random,
    false                        // ignoreOrigin
);

// Verifier si le prefab correspond aux blocs existants
boolean matches = PrefabUtil.prefabMatchesAtPosition(
    buffer,
    world,
    position,
    Rotation.None,
    random
);
```

### Suppression de Prefabs

```java
// Supprimer un prefab du monde
PrefabUtil.remove(
    buffer,
    world,
    position,
    Rotation.None,
    false,                       // Force
    random,
    setBlockSettings,
    1.0                          // brokenParticlesRate
);
```

**Source :** `com.hypixel.hytale.server.core.util.PrefabUtil`

## Module Generateur de Prefab

Le `PrefabSpawnerModule` enregistre des blocs speciaux qui generent des prefabs pendant la generation du monde.

```java
public class PrefabSpawnerModule extends JavaPlugin {
    @Nonnull
    public static final PluginManifest MANIFEST = PluginManifest.corePlugin(PrefabSpawnerModule.class)
        .depends(BlockStateModule.class)
        .build();

    @Override
    protected void setup() {
        this.getBlockStateRegistry().registerBlockState(
            PrefabSpawnerState.class,
            "prefabspawner",
            PrefabSpawnerState.CODEC
        );
        this.getCommandRegistry().registerCommand(new PrefabSpawnerCommand());
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerModule`

## PrefabSpawnerState

L'etat de bloc `PrefabSpawnerState` configure le comportement d'un generateur de prefab.

### Proprietes

| Propriete | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `PrefabPath` | String | null | Chemin en notation point vers le prefab (ex: `buildings.houses.small_house`) |
| `FitHeightmap` | boolean | false | Ajuster le prefab enfant a la hauteur du terrain |
| `InheritSeed` | boolean | true | Les prefabs enfants heritent du seed worldgen |
| `InheritHeightCondition` | boolean | true | Les prefabs enfants heritent des restrictions de hauteur |
| `PrefabWeights` | PrefabWeights | NONE | Selection ponderee pour les dossiers avec plusieurs prefabs |

### Configuration JSON

```json
{
    "PrefabPath": "buildings.houses",
    "FitHeightmap": true,
    "InheritSeed": true,
    "InheritHeightCondition": false,
    "PrefabWeights": {
        "Default": 1.0,
        "Weights": {
            "small_house.prefab.json": 3.0,
            "medium_house.prefab.json": 2.0,
            "large_house.prefab.json": 1.0
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerState`

## Poids des Prefabs

La classe `PrefabWeights` permet une selection aleatoire ponderee parmi plusieurs prefabs.

```java
// Creer des poids
PrefabWeights weights = new PrefabWeights();
weights.setDefaultWeight(1.0);
weights.setWeight("rare_variant.prefab.json", 0.1);
weights.setWeight("common_variant.prefab.json", 5.0);

// Selectionner depuis un tableau en utilisant les poids
Path[] prefabPaths = getPrefabPaths();
Path selected = weights.get(
    prefabPaths,
    path -> path.getFileName().toString(),
    random
);

// Parser depuis le format chaine
PrefabWeights parsed = PrefabWeights.parse("small=3.0, medium=2.0, large=1.0");

// Obtenir la chaine de mapping
String mapping = weights.getMappingString(); // "small=3.0, medium=2.0, large=1.0"
```

**Source :** `com.hypixel.hytale.server.core.prefab.PrefabWeights`

## Evenements Prefab

Le systeme de prefabs declenche des evenements que les plugins peuvent ecouter.

### PrefabPasteEvent

Declenche au debut et a la fin d'une operation de collage de prefab.

```java
public class PrefabPasteEvent extends CancellableEcsEvent {
    public int getPrefabId();      // ID unique de l'operation de collage
    public boolean isPasteStart(); // true = debut, false = fin
}
```

### PrefabPlaceEntityEvent

Declenche quand une entite d'un prefab est en cours de placement.

```java
public class PrefabPlaceEntityEvent extends EcsEvent {
    public int getPrefabId();                    // ID de l'operation de collage
    @Nonnull
    public Holder<EntityStore> getHolder();      // Entite en cours de placement
}
```

**Source :** `com.hypixel.hytale.server.core.prefab.event`

## SpawnPrefabInteraction

Generer des prefabs via le systeme d'interaction pour les objets et capacites.

```java
public class SpawnPrefabInteraction extends SimpleInstantInteraction {
    String prefabPath;                    // Chemin vers le prefab
    Vector3i offset = Vector3i.ZERO;      // Decalage de position
    Rotation rotationYaw = Rotation.None; // Rotation
    OriginSource originSource = ENTITY;   // ENTITY ou BLOCK
    boolean force;                        // Forcer le placement
}
```

### Configuration JSON

```json
{
    "Type": "SpawnPrefab",
    "PrefabPath": "structures/tower.prefab.json",
    "Offset": { "x": 0, "y": 0, "z": 0 },
    "RotationYaw": "None",
    "OriginSource": "ENTITY",
    "Force": false
}
```

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.SpawnPrefabInteraction`

## Commandes Console

### Commandes du Generateur de Prefab

| Commande | Description |
|----------|-------------|
| `/prefabspawner get` | Afficher les parametres du generateur de prefab a la position cible |
| `/prefabspawner set <prefab> [options]` | Configurer le generateur de prefab |
| `/prefabspawner weight <prefab> <weight>` | Definir le poids pour un prefab specifique |

**Alias :** `/pspawner`

### Options de la commande Set

```
/prefabspawner set <prefabPath> [fitHeightmap] [inheritSeed] [inheritHeightCheck] [defaultWeight]
```

**Exemples :**
```
/prefabspawner set buildings.houses.small_house
/prefabspawner set trees.oak fitHeightmap=true
/prefabspawner set dungeons.entrance defaultWeight=0.5
```

**Source :** `com.hypixel.hytale.server.core.modules.prefabspawner.commands`

## Integration avec la Generation du Monde

Les prefabs s'integrent au systeme de generation du monde pour les grottes et les structures.

### Placement de Prefab dans les Grottes

```java
public enum CavePrefabPlacement {
    CEILING,  // Placer au plafond de la grotte
    FLOOR,    // Placer au sol de la grotte
    DEFAULT   // Placer au centre de la grotte
}
```

### CavePrefab

```java
public class CavePrefab implements CaveElement {
    @Nonnull
    private final WorldGenPrefabSupplier prefabSupplier;
    @Nonnull
    private final PrefabRotation rotation;
    private final IIntCondition biomeMask;
    private final BlockMaskCondition blockMask;
    private final int x, y, z;
}
```

**Source :** `com.hypixel.hytale.server.worldgen.cave.element.CavePrefab`

## Exemple de Plugin

Voici un exemple complet de generation de prefabs dans un plugin :

```java
public class PrefabPlugin extends JavaPlugin {

    public PrefabPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer les ecouteurs d'evenements de prefab
        getEventRegistry().register(PrefabPasteEvent.class, this::onPrefabPaste);
        getEventRegistry().register(PrefabPlaceEntityEvent.class, this::onPrefabPlaceEntity);
    }

    /**
     * Generer un prefab a l'emplacement d'un joueur
     */
    public void spawnPrefabAtPlayer(PlayerRef playerRef, World world, String prefabPath) {
        Store<EntityStore> store = world.getEntityStore().getStore();
        TransformComponent transform = store.getComponent(
            playerRef.getReference(),
            TransformComponent.getComponentType()
        );

        if (transform != null) {
            Vector3i position = transform.getPosition().toVector3i();

            // Charger le prefab
            Path fullPath = PrefabStore.get().getAssetPrefabsPath().resolve(prefabPath);
            IPrefabBuffer buffer = PrefabBufferUtil.getCached(fullPath);

            // Coller avec rotation aleatoire
            PrefabRotation[] rotations = PrefabRotation.VALUES;
            Rotation rotation = rotations[new Random().nextInt(rotations.length)].getRotation();

            PrefabUtil.paste(
                buffer,
                world,
                position,
                rotation,
                false,
                new Random(),
                store
            );

            getLogger().info("Prefab genere a " + position);
        }
    }

    /**
     * Generer un prefab aleatoire depuis une liste ponderee
     */
    public void spawnWeightedPrefab(World world, Vector3i position, String prefabDir) {
        Map<Path, BlockSelection> prefabs = PrefabStore.get().getAssetPrefabDir(prefabDir);

        if (!prefabs.isEmpty()) {
            PrefabWeights weights = new PrefabWeights();
            weights.setDefaultWeight(1.0);

            Path[] paths = prefabs.keySet().toArray(new Path[0]);
            Path selected = weights.get(paths, p -> p.getFileName().toString(), new Random());

            if (selected != null) {
                IPrefabBuffer buffer = PrefabBufferUtil.getCached(selected);
                PrefabUtil.paste(buffer, world, position, Rotation.None, false, new Random(),
                    world.getEntityStore().getStore());
            }
        }
    }

    private void onPrefabPaste(PrefabPasteEvent event) {
        if (event.isPasteStart()) {
            getLogger().info("Collage de prefab en cours : " + event.getPrefabId());
        } else {
            getLogger().info("Collage de prefab termine : " + event.getPrefabId());
        }
    }

    private void onPrefabPlaceEntity(PrefabPlaceEntityEvent event) {
        Holder<EntityStore> entity = event.getHolder();
        getLogger().info("Entite placee depuis le prefab " + event.getPrefabId());

        // Modifier l'entite avant son ajout au monde
        // entity.addComponent(...);
    }
}
```

## Composant FromPrefab

Les entites generees depuis des prefabs sont marquees avec le composant `FromPrefab`.

```java
public class FromPrefab implements Component<EntityStore> {
    public static final FromPrefab INSTANCE = new FromPrefab();

    public static ComponentType<EntityStore, FromPrefab> getComponentType() {
        return EntityModule.get().getFromPrefabComponentType();
    }
}
```

### Verifier si une Entite provient d'un Prefab

```java
// Verifier si l'entite a ete generee depuis un prefab
FromPrefab fromPrefab = store.getComponent(entityRef, FromPrefab.getComponentType());
boolean isFromPrefab = fromPrefab != null;
```

**Source :** `com.hypixel.hytale.server.core.modules.entity.component.FromPrefab`

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `PrefabStore` | `com.hypixel.hytale.server.core.prefab.PrefabStore` |
| `PrefabBuffer` | `com.hypixel.hytale.server.core.prefab.selection.buffer.impl.PrefabBuffer` |
| `IPrefabBuffer` | `com.hypixel.hytale.server.core.prefab.selection.buffer.impl.IPrefabBuffer` |
| `PrefabBufferUtil` | `com.hypixel.hytale.server.core.prefab.selection.buffer.PrefabBufferUtil` |
| `PrefabRotation` | `com.hypixel.hytale.server.core.prefab.PrefabRotation` |
| `PrefabWeights` | `com.hypixel.hytale.server.core.prefab.PrefabWeights` |
| `PrefabUtil` | `com.hypixel.hytale.server.core.util.PrefabUtil` |
| `PrefabSpawnerModule` | `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerModule` |
| `PrefabSpawnerState` | `com.hypixel.hytale.server.core.modules.prefabspawner.PrefabSpawnerState` |
| `PrefabEntry` | `com.hypixel.hytale.server.core.prefab.PrefabEntry` |
| `PrefabPasteEvent` | `com.hypixel.hytale.server.core.prefab.event.PrefabPasteEvent` |
| `PrefabPlaceEntityEvent` | `com.hypixel.hytale.server.core.prefab.event.PrefabPlaceEntityEvent` |
| `FromPrefab` | `com.hypixel.hytale.server.core.modules.entity.component.FromPrefab` |
| `SpawnPrefabInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.SpawnPrefabInteraction` |
| `CavePrefab` | `com.hypixel.hytale.server.worldgen.cave.element.CavePrefab` |
| `CavePrefabPlacement` | `com.hypixel.hytale.server.worldgen.cave.CavePrefabPlacement` |
