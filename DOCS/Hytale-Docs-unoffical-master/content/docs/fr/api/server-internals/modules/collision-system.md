---
id: collision-system
title: Systeme de Collision
sidebar_label: Systeme de Collision
sidebar_position: 7
description: Documentation complete du systeme de detection de collision Hytale pour les blocs, entites, raycasting et integration physique
---

# Systeme de Collision

Le systeme de collision dans Hytale fournit des capacites completes de detection et de reponse aux collisions pour les entites, les blocs et le raycasting. Ce systeme est fondamental pour le mouvement des personnages, la detection des projectiles, les interactions physiques et les zones de declenchement.

## Vue d'ensemble

Le CollisionModule est un plugin central qui gere toutes les fonctionnalites liees aux collisions dans Hytale. Il supporte:

- **Collision de blocs** - Detection des collisions avec la geometrie du monde
- **Collision d'entites** - Detection des collisions entre entites
- **Raycasting** - Test d'intersections de rayons avec les AABBs
- **Zones de declenchement** - Detection de l'entree/sortie d'entites dans des regions de blocs
- **Filtrage par materiau** - Filtrage des collisions par type de materiau

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionModule`

## Types de Materiaux de Collision

Hytale utilise un systeme de masque binaire pour le filtrage des materiaux de collision:

| Materiau | Valeur | Description |
|----------|--------|-------------|
| `MATERIAL_EMPTY` | 1 | Blocs vides/air |
| `MATERIAL_FLUID` | 2 | Blocs fluides (eau, lave) |
| `MATERIAL_SOLID` | 4 | Blocs solides |
| `MATERIAL_SUBMERGED` | 8 | Submerge dans un fluide |
| `MATERIAL_DAMAGE` | 16 | Blocs infligeant des degats |
| `MATERIAL_SET_ANY` | 15 | Tous les materiaux sans degats |
| `MATERIAL_SET_NONE` | 0 | Aucun materiau |

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionMaterial`

```java
public class CollisionMaterial {
    public static final int MATERIAL_EMPTY = 1;
    public static final int MATERIAL_FLUID = 2;
    public static final int MATERIAL_SOLID = 4;
    public static final int MATERIAL_SUBMERGED = 8;
    public static final int MATERIAL_SET_ANY = 15;
    public static final int MATERIAL_DAMAGE = 16;
    public static final int MATERIAL_SET_NONE = 0;
}
```

## Types de Collision

Hytale supporte deux types de reponse de collision:

| Type | Valeur | Description |
|------|--------|-------------|
| `Hard` | 0 | Collision bloquante standard |
| `Soft` | 1 | Permet une penetration partielle |

**Source:** `com.hypixel.hytale.protocol.CollisionType`

```java
public enum CollisionType {
    Hard(0),
    Soft(1);
}
```

## CollisionResult

La classe `CollisionResult` stocke les resultats de detection de collision et gere l'etat des collisions:

```java
// Creer un resultat de collision pour utilisation standard
CollisionResult result = new CollisionResult();

// Creer avec des options specifiques
CollisionResult result = new CollisionResult(
    true,   // enableSlides - permettre le glissement au sol
    false   // enableCharacters - verifier les collisions d'entites
);
```

### Methodes de CollisionResult

| Methode | Description |
|---------|-------------|
| `getBlockCollisionCount()` | Obtenir le nombre de collisions de blocs |
| `getBlockCollision(int i)` | Obtenir les donnees de collision de bloc specifique |
| `getFirstBlockCollision()` | Obtenir la collision de bloc la plus proche |
| `getCharacterCollisionCount()` | Obtenir le nombre de collisions d'entites |
| `getFirstCharacterCollision()` | Obtenir la collision d'entite la plus proche |
| `getTriggerBlocks()` | Obtenir les blocs qui ont declenche des evenements |

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionResult`

### Configuration du Comportement de Collision

```java
// Definir les parametres de collision par defaut pour les joueurs
result.setDefaultPlayerSettings();

// Configurer la collision basee sur le materiau
result.setCollisionByMaterial(CollisionMaterial.MATERIAL_SOLID);

// Configurer les materiaux praticables (pour le glissement au sol)
result.setWalkableByMaterial(CollisionMaterial.MATERIAL_SET_ANY);

// Activer/desactiver les verifications de collision
result.enableSlides();        // Permettre le glissement au sol
result.disableSlides();
result.enableTriggerBlocks(); // Verifier les zones de declenchement
result.disableTriggerBlocks();
result.enableDamageBlocks();  // Verifier les blocs de degats
result.disableDamageBlocks();
```

## Recherche de Collisions

### Collisions de Blocs

Le point d'entree principal pour trouver des collisions avec les blocs:

```java
public static boolean findCollisions(
    @Nonnull Box collider,           // La boite de collision
    @Nonnull Vector3d pos,           // Position de depart
    @Nonnull Vector3d v,             // Vecteur de mouvement
    @Nonnull CollisionResult result, // Resultats en sortie
    @Nonnull ComponentAccessor<EntityStore> componentAccessor
)
```

Le systeme choisit automatiquement entre les algorithmes iteratifs (longue distance) et courte distance en fonction de l'amplitude du mouvement:

```java
// Seuil de courte distance
public static boolean isBelowMovementThreshold(@Nonnull Vector3d v) {
    return v.squaredLength() < 1.0000000000000002E-10;
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionModule`

### Collisions de Personnages/Entites

```java
public static void findCharacterCollisions(
    @Nonnull Vector3d pos,
    @Nonnull Vector3d v,
    @Nonnull CollisionResult result,
    @Nonnull ComponentAccessor<EntityStore> componentAccessor
)
```

### Validation de Position

Valider si une position est valide (ne chevauche pas la geometrie):

```java
// Codes de retour de validation
public static final int VALIDATE_INVALID = -1;   // Position chevauche la geometrie
public static final int VALIDATE_OK = 0;         // Position valide
public static final int VALIDATE_ON_GROUND = 1;  // Position au sol
public static final int VALIDATE_TOUCH_CEIL = 2; // Position touche le plafond

// Valider une position
int result = collisionModule.validatePosition(world, collider, pos, collisionResult);
```

## CollisionConfig

La classe `CollisionConfig` gere l'etat de collision et fournit la verification de collision au niveau des blocs:

```java
public class CollisionConfig {
    // Informations du bloc
    public int blockId;
    public BlockType blockType;
    public BlockMaterial blockMaterial;
    public int rotation;
    public int blockX, blockY, blockZ;

    // Informations du fluide
    public Fluid fluid;
    public int fluidId;
    public byte fluidLevel;

    // Etat de collision
    public boolean blockCanCollide;
    public boolean blockCanTrigger;
}
```

### Definition du Comportement de Collision

```java
// Definir le comportement par defaut (blocs solides uniquement)
collisionConfig.setDefaultCollisionBehaviour();

// Definir le masque de materiau de collision
collisionConfig.setCollisionByMaterial(CollisionMaterial.MATERIAL_SOLID);

// Activer les collisions avec les blocs de degats
collisionConfig.setCollideWithDamageBlocks(true);

// Predicat de collision personnalise
collisionConfig.canCollide = config -> {
    return (config.blockMaterialMask & CollisionMaterial.MATERIAL_SOLID) != 0;
};
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionConfig`

## CollisionMath - API de Raycasting

La classe `CollisionMath` fournit des utilitaires mathematiques pour la detection de collision:

### Codes d'Intersection

```java
public class CollisionMath {
    public static final int DISJOINT = 0;     // Pas d'intersection
    public static final int TOUCH_X = 1;      // Contact sur l'axe X
    public static final int TOUCH_Y = 2;      // Contact sur l'axe Y
    public static final int TOUCH_Z = 4;      // Contact sur l'axe Z
    public static final int TOUCH_ANY = 7;    // Contact sur n'importe quel axe
    public static final int OVERLAP_X = 8;    // Chevauchement sur l'axe X
    public static final int OVERLAP_Y = 16;   // Chevauchement sur l'axe Y
    public static final int OVERLAP_Z = 32;   // Chevauchement sur l'axe Z
    public static final int OVERLAP_ALL = 56; // Chevauchement complet
}
```

### Intersection Rayon-AABB

```java
// Tester si un rayon intersecte un AABB
public static boolean intersectRayAABB(
    @Nonnull Vector3d pos,   // Origine du rayon
    @Nonnull Vector3d ray,   // Direction du rayon
    double x, double y, double z, // Position de la boite
    @Nonnull Box box,        // Dimensions de la boite
    @Nonnull Vector2d minMax // Sortie: distances min/max d'intersection
)

// Tester si un vecteur (rayon de longueur limitee) intersecte un AABB
public static boolean intersectVectorAABB(
    @Nonnull Vector3d pos,
    @Nonnull Vector3d vec,
    double x, double y, double z,
    @Nonnull Box box,
    @Nonnull Vector2d minMax
)
```

### Collision AABB en Mouvement

Tester la collision entre un AABB en mouvement et un AABB statique:

```java
public static boolean intersectSweptAABBs(
    @Nonnull Vector3d posP,  // Position de la boite mobile
    @Nonnull Vector3d vP,    // Vecteur de mouvement
    @Nonnull Box p,          // Boite mobile
    @Nonnull Vector3d posQ,  // Position de la boite statique
    @Nonnull Box q,          // Boite statique
    @Nonnull Vector2d minMax,// Sortie: temps min/max d'intersection
    @Nonnull Box temp        // Boite temporaire pour le calcul
)
```

### Methodes Utilitaires

```java
// Verifier l'etat d'intersection
boolean pasDeCollision = CollisionMath.isDisjoint(code);
boolean chevauchementComplet = CollisionMath.isOverlapping(code);
boolean touche = CollisionMath.isTouching(code);
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionMath`

## Classes de Donnees de Collision

### BlockCollisionData

Contient les informations sur une collision avec un bloc:

```java
public class BlockCollisionData extends BoxCollisionData {
    public int x, y, z;              // Position du bloc
    public int blockId;              // ID du bloc
    public int rotation;             // Rotation du bloc
    public BlockType blockType;      // Asset du type de bloc
    public BlockMaterial blockMaterial;
    public int detailBoxIndex;       // Index de sous-hitbox
    public boolean willDamage;       // Le bloc inflige des degats
    public int fluidId;              // ID du fluide si present
    public Fluid fluid;              // Asset du fluide
    public boolean touching;         // Juste en contact
    public boolean overlapping;      // Chevauchement complet
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.BlockCollisionData`

### CharacterCollisionData

Contient les informations sur une collision avec une entite:

```java
public class CharacterCollisionData extends BasicCollisionData {
    public Ref<EntityStore> entityReference;  // Reference de l'entite
    public boolean isPlayer;                   // Est une entite joueur

    public void assign(
        @Nonnull Vector3d collisionPoint,
        double collisionVectorScale,
        Ref<EntityStore> entityReference,
        boolean isPlayer
    );
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CharacterCollisionData`

### BoxCollisionData

Classe de base pour les donnees de collision avec informations spatiales:

```java
public class BoxCollisionData extends BasicCollisionData {
    public double collisionEnd;               // Fin de la plage de collision
    public final Vector3d collisionNormal;    // Normale de surface a la collision

    public void setEnd(double collisionEnd, @Nonnull Vector3d collisionNormal);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.BoxCollisionData`

## Fournisseur de Collision d'Entites

Le `EntityCollisionProvider` gere la detection de collision entite-a-entite:

```java
public class EntityCollisionProvider {
    // Trouver la collision d'entite la plus proche
    public double computeNearest(
        @Nonnull Box entityBoundingBox,
        @Nonnull Vector3d pos,
        @Nonnull Vector3d dir,
        @Nullable Ref<EntityStore> ignoreSelf,
        @Nullable Ref<EntityStore> ignore,
        @Nonnull ComponentAccessor<EntityStore> componentAccessor
    );

    // Obtenir les resultats de collision
    public int getCount();
    public EntityContactData getContact(int index);
}
```

### Filtre d'Entite par Defaut

Le filtre par defaut exclut les projectiles et les entites mortes:

```java
public static boolean defaultEntityFilter(
    @Nonnull Ref<EntityStore> ref,
    @Nonnull ComponentAccessor<EntityStore> componentAccessor
) {
    Archetype<EntityStore> archetype = componentAccessor.getArchetype(ref);
    boolean isProjectile = archetype.contains(Projectile.getComponentType())
        || archetype.contains(ProjectileComponent.getComponentType());
    if (isProjectile) return false;

    boolean isDead = archetype.contains(DeathComponent.getComponentType());
    return !isDead && ref.isValid();
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.EntityCollisionProvider`

## Fournisseur de Collision de Blocs

Le `BlockCollisionProvider` gere la detection de collision avec la geometrie du monde:

```java
public class BlockCollisionProvider implements BoxBlockIterator.BoxIterationConsumer {
    // Lancer un rayon de collision a travers le monde
    public void cast(
        @Nonnull World world,
        @Nonnull Box collider,
        @Nonnull Vector3d pos,
        @Nonnull Vector3d v,
        @Nonnull IBlockCollisionConsumer collisionConsumer,
        @Nonnull IBlockTracker activeTriggers,
        double collisionStop
    );

    // Definir les materiaux avec lesquels entrer en collision
    public void setRequestedCollisionMaterials(int requestedCollisionMaterials);

    // Activer le rapport de chevauchement
    public void setReportOverlaps(boolean reportOverlaps);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.BlockCollisionProvider`

## Interface Consommateur de Collision

Implementez `IBlockCollisionConsumer` pour recevoir les callbacks de collision:

```java
public interface IBlockCollisionConsumer {
    // Appele quand une collision est detectee
    Result onCollision(int x, int y, int z, Vector3d motion,
        BlockContactData contactData, BlockData blockData, Box hitbox);

    // Appele pour sonder une collision de degats
    Result probeCollisionDamage(int x, int y, int z, Vector3d motion,
        BlockContactData contactData, BlockData blockData);

    // Appele quand la collision de degats est confirmee
    void onCollisionDamage(int x, int y, int z, Vector3d motion,
        BlockContactData contactData, BlockData blockData);

    // Appele apres chaque tranche d'iteration
    Result onCollisionSliceFinished();

    // Appele quand la detection de collision est terminee
    void onCollisionFinished();

    public enum Result {
        CONTINUE,   // Continuer la verification
        STOP,       // Arreter apres la tranche actuelle
        STOP_NOW    // Arreter immediatement
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.IBlockCollisionConsumer`

## Composant HitboxCollision

Les entites peuvent avoir un comportement de collision de hitbox configurable:

```java
public class HitboxCollision implements Component<EntityStore> {
    public int getHitboxCollisionConfigIndex();
    public void setHitboxCollisionConfigIndex(int hitboxCollisionConfigIndex);
}
```

### HitboxCollisionConfig

```java
public class HitboxCollisionConfig {
    protected String id;
    protected CollisionType collisionType;  // Hard ou Soft
    protected float softOffsetRatio = 1.0F; // Ratio de penetration pour collision douce
}
```

**Source:** `com.hypixel.hytale.server.core.modules.entity.hitboxcollision.HitboxCollisionConfig`

## Configuration

Le CollisionModule peut etre configure via `CollisionModuleConfig`:

```java
public class CollisionModuleConfig {
    // Seuil de mouvement pour l'optimisation courte distance
    public static final double MOVEMENT_THRESHOLD = 1.0E-5;
    public static final double MOVEMENT_THRESHOLD_SQUARED = 1.0000000000000002E-10;
    public static final double EXTENT = 1.0E-5;

    // Options de configuration
    private double extentMax = 0.0;            // Etendue maximale du bloc
    private boolean dumpInvalidBlocks = false; // Debug: journaliser les positions invalides
    private Double minimumThickness = null;    // Epaisseur minimale de hitbox
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionModuleConfig`

## Filtre de Collision

Filtrage de collision personnalise avec l'interface `CollisionFilter`:

```java
@FunctionalInterface
public interface CollisionFilter<D, T> {
    boolean test(T context, int collisionCode, D evaluator, CollisionConfig config);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.collision.CollisionFilter`

## Exemple de Plugin

Voici un exemple complet d'utilisation du systeme de collision dans un plugin:

```java
public class CollisionPlugin extends JavaPlugin {

    public CollisionPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // S'enregistrer pour les evenements de mouvement d'entite
        getEventRegistry().register(EntityMoveEvent.class, this::onEntityMove);
    }

    private void onEntityMove(EntityMoveEvent event) {
        World world = event.getWorld();
        Entity entity = event.getEntity();
        Vector3d position = entity.getPosition();
        Vector3d movement = event.getMovement();
        Box boundingBox = entity.getBoundingBox();

        // Creer un resultat de collision
        CollisionResult result = new CollisionResult(true, false);
        result.setCollisionByMaterial(CollisionMaterial.MATERIAL_SOLID);

        // Trouver les collisions
        boolean farDistance = CollisionModule.findCollisions(
            boundingBox,
            position,
            movement,
            result,
            world.getEntityStore().getComponentAccessor()
        );

        // Traiter les collisions de blocs
        int collisionCount = result.getBlockCollisionCount();
        for (int i = 0; i < collisionCount; i++) {
            BlockCollisionData collision = result.getBlockCollision(i);

            getLogger().info("Collision a: " + collision.x + ", "
                + collision.y + ", " + collision.z);
            getLogger().info("Type de bloc: " + collision.blockType.getId());
            getLogger().info("Point de collision: " + collision.collisionPoint);
            getLogger().info("Normale de collision: " + collision.collisionNormal);

            // Verifier si au sol
            if (collision.collisionNormal.y > 0.5) {
                getLogger().info("L'entite est au sol");
            }
        }
    }

    // Exemple de raycast personnalise
    public BlockCollisionData raycast(World world, Vector3d origin, Vector3d direction,
            double maxDistance) {
        Box pointBox = new Box(0, 0, 0, 0.01, 0.01, 0.01);
        Vector3d ray = direction.copy().normalize().scale(maxDistance);

        CollisionResult result = new CollisionResult(false, false);
        result.setCollisionByMaterial(CollisionMaterial.MATERIAL_SOLID);

        CollisionModule.findBlockCollisionsIterative(
            world, pointBox, origin, ray, true, result
        );

        return result.getFirstBlockCollision();
    }

    // Verifier si une position est valide (pas a l'interieur des blocs)
    public boolean isPositionValid(World world, Box collider, Vector3d position) {
        CollisionResult result = new CollisionResult();
        int validation = CollisionModule.get().validatePosition(
            world, collider, position, result
        );

        return validation != CollisionModule.VALIDATE_INVALID;
    }

    // Verifier l'etat au sol
    public boolean isOnGround(World world, Box collider, Vector3d position) {
        CollisionResult result = new CollisionResult();
        int validation = CollisionModule.get().validatePosition(
            world, collider, position, result
        );

        return (validation & CollisionModule.VALIDATE_ON_GROUND) != 0;
    }
}
```

## Traitement des Blocs de Declenchement

Le systeme de collision supporte les zones de declenchement qui lancent des interactions:

```java
// Traiter les blocs de declenchement dans le resultat de collision
int damage = result.defaultTriggerBlocksProcessing(
    interactionManager,
    entity,
    entityRef,
    true,  // executeTriggers
    componentAccessor
);

// Types d'interaction de declenchement
InteractionType.CollisionEnter  // L'entite entre dans la zone de declenchement
InteractionType.Collision       // L'entite est dans la zone de declenchement
InteractionType.CollisionLeave  // L'entite quitte la zone de declenchement
```

## Fichiers Source

| Classe | Chemin |
|--------|--------|
| `CollisionModule` | `com.hypixel.hytale.server.core.modules.collision.CollisionModule` |
| `CollisionConfig` | `com.hypixel.hytale.server.core.modules.collision.CollisionConfig` |
| `CollisionResult` | `com.hypixel.hytale.server.core.modules.collision.CollisionResult` |
| `CollisionMath` | `com.hypixel.hytale.server.core.modules.collision.CollisionMath` |
| `CollisionMaterial` | `com.hypixel.hytale.server.core.modules.collision.CollisionMaterial` |
| `CollisionFilter` | `com.hypixel.hytale.server.core.modules.collision.CollisionFilter` |
| `BlockCollisionData` | `com.hypixel.hytale.server.core.modules.collision.BlockCollisionData` |
| `CharacterCollisionData` | `com.hypixel.hytale.server.core.modules.collision.CharacterCollisionData` |
| `BlockCollisionProvider` | `com.hypixel.hytale.server.core.modules.collision.BlockCollisionProvider` |
| `EntityCollisionProvider` | `com.hypixel.hytale.server.core.modules.collision.EntityCollisionProvider` |
| `MovingBoxBoxCollisionEvaluator` | `com.hypixel.hytale.server.core.modules.collision.MovingBoxBoxCollisionEvaluator` |
| `HitboxCollision` | `com.hypixel.hytale.server.core.modules.entity.hitboxcollision.HitboxCollision` |
| `HitboxCollisionConfig` | `com.hypixel.hytale.server.core.modules.entity.hitboxcollision.HitboxCollisionConfig` |
| `CollisionType` | `com.hypixel.hytale.protocol.CollisionType` |
