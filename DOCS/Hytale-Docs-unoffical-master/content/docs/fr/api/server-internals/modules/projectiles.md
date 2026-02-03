---
id: projectiles
title: Systeme de Projectiles
sidebar_label: Projectiles
sidebar_position: 7
description: Documentation complete du systeme de projectiles Hytale pour creer des fleches, objets lances et projectiles personnalises
---

# Systeme de Projectiles

Le systeme de projectiles dans Hytale fournit un cadre complet pour creer et gerer des projectiles tels que des fleches, des armes de jet, des sorts et d'autres objets volants. Le systeme est construit sur l'architecture ECS (Entity Component System) et prend en charge la prediction cote client pour une jouabilite reactive.

## Vue d'ensemble de l'architecture

Le systeme de projectiles se compose de plusieurs composants cles :

| Composant | Description |
|-----------|-------------|
| `ProjectileModule` | Module principal qui gere la creation et les systemes de projectiles |
| `Projectile` | Composant marqueur identifiant une entite comme projectile |
| `PredictedProjectile` | Composant pour le support de prediction cote client |
| `ProjectileConfig` | Asset de configuration definissant les proprietes du projectile |
| `StandardPhysicsProvider` | Composant de simulation physique pour les projectiles |
| `StandardPhysicsConfig` | Configuration physique (gravite, rebond, trainee, etc.) |

**Source :** `com.hypixel.hytale.server.core.modules.projectile.ProjectileModule`

## Enregistrement du module

Le ProjectileModule depend de CollisionModule et EntityModule :

```java
@Nonnull
public static final PluginManifest MANIFEST = PluginManifest.corePlugin(ProjectileModule.class)
   .description(
      "This module implements the new projectile system. Disabling this module will prevent anything using the new projectile system from functioning."
   )
   .depends(CollisionModule.class)
   .depends(EntityModule.class)
   .build();
```

## Composant Projectile

Le composant `Projectile` est un simple composant marqueur qui identifie une entite comme projectile :

```java
public class Projectile implements Component<EntityStore> {
   @Nonnull
   public static Projectile INSTANCE = new Projectile();

   public static ComponentType<EntityStore, Projectile> getComponentType() {
      return ProjectileModule.get().getProjectileComponentType();
   }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.component.Projectile`

## Composant PredictedProjectile

Le composant `PredictedProjectile` active la prediction cote client en associant un UUID au projectile :

```java
public class PredictedProjectile implements Component<EntityStore> {
   @Nonnull
   private final UUID uuid;

   public PredictedProjectile(@Nonnull UUID uuid) {
      this.uuid = uuid;
   }

   @Nonnull
   public UUID getUuid() {
      return this.uuid;
   }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.component.PredictedProjectile`

## ProjectileConfig

La classe `ProjectileConfig` definit toutes les proprietes configurables pour un type de projectile :

### Proprietes de configuration

| Propriete | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `Physics` | `PhysicsConfig` | `StandardPhysicsConfig.DEFAULT` | Parametres de simulation physique |
| `Model` | `String` | - | ID d'asset du modele pour la representation visuelle |
| `LaunchForce` | `double` | `1.0` | Multiplicateur de velocite initiale |
| `SpawnOffset` | `Vector3f` | `(0, 0, 0)` | Decalage de position depuis le point d'apparition |
| `SpawnRotationOffset` | `Direction` | `(0, 0, 0)` | Decalage de rotation (pitch, yaw, roll) |
| `Interactions` | `Map<InteractionType, String>` | Vide | Gestionnaires d'interaction par type |
| `LaunchLocalSoundEventId` | `String` | - | Son joue pour le lanceur |
| `LaunchWorldSoundEventId` | `String` | - | Son joue pour les joueurs proches |
| `ProjectileSoundEventId` | `String` | - | Son en boucle attache au projectile |

### Interface BallisticData

ProjectileConfig implemente l'interface `BallisticData` pour les calculs de trajectoire :

```java
public interface BallisticData {
   double getMuzzleVelocity();
   double getGravity();
   double getVerticalCenterShot();
   double getDepthShot();
   boolean isPitchAdjustShot();
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.config.ProjectileConfig`

## Configuration physique

### Proprietes de StandardPhysicsConfig

| Propriete | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `Density` | `double` | `700.0` | Densite du projectile pour la flottabilite |
| `Gravity` | `double` | `0.0` | Acceleration de la gravite |
| `Bounciness` | `double` | `0.0` | Coefficient de rebond (0.0 - 1.0) |
| `BounceLimit` | `double` | `0.4` | Velocite minimale pour rebondir |
| `BounceCount` | `int` | `-1` | Nombre max de rebonds (-1 = illimite) |
| `SticksVertically` | `boolean` | `false` | Coller aux surfaces a l'impact |
| `ComputeYaw` | `boolean` | `true` | Calcul auto du yaw depuis la velocite |
| `ComputePitch` | `boolean` | `true` | Calcul auto du pitch depuis la velocite |
| `RotationMode` | `RotationMode` | `VelocityDamped` | Comment la rotation suit la velocite |
| `MoveOutOfSolidSpeed` | `double` | `0.0` | Vitesse pour sortir des blocs solides |
| `TerminalVelocityAir` | `double` | `1.0` | Velocite max dans l'air |
| `DensityAir` | `double` | `1.2` | Densite de l'air pour la trainee |
| `TerminalVelocityWater` | `double` | `1.0` | Velocite max dans l'eau |
| `DensityWater` | `double` | `998.0` | Densite de l'eau pour la trainee |
| `HitWaterImpulseLoss` | `double` | `0.2` | Perte de velocite a l'entree dans l'eau |
| `RotationForce` | `double` | `3.0` | Force d'amortissement de rotation |
| `SpeedRotationFactor` | `float` | `2.0` | Couplage velocite-rotation |
| `SwimmingDampingFactor` | `double` | `1.0` | Amortissement en immersion |
| `AllowRolling` | `boolean` | `false` | Activer le roulement sur les surfaces |
| `RollingFrictionFactor` | `double` | `0.99` | Coefficient de friction de roulement |
| `RollingSpeed` | `float` | `0.1` | Vitesse de rotation de roulement |

### Modes de rotation

```java
public enum RotationMode {
   None,           // Pas de rotation automatique
   Velocity,       // Rotation instantanee pour correspondre a la velocite
   VelocityDamped, // Rotation lissee suivant la velocite
   VelocityRoll    // Rotation de roulement basee sur la velocite
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.config.StandardPhysicsConfig`

## Creation de projectiles

### Utilisation de ProjectileModule

Le `ProjectileModule` fournit des methodes pour creer des projectiles :

```java
// Sans prediction client
@Nonnull
public Ref<EntityStore> spawnProjectile(
   Ref<EntityStore> creatorRef,
   @Nonnull CommandBuffer<EntityStore> commandBuffer,
   @Nonnull ProjectileConfig config,
   @Nonnull Vector3d position,
   @Nonnull Vector3d direction
)

// Avec prediction client
@Nonnull
public Ref<EntityStore> spawnProjectile(
   @Nullable UUID predictionId,
   Ref<EntityStore> creatorRef,
   @Nonnull CommandBuffer<EntityStore> commandBuffer,
   @Nonnull ProjectileConfig config,
   @Nonnull Vector3d position,
   @Nonnull Vector3d direction
)
```

### Processus de creation

Quand un projectile est cree, le systeme :

1. Cree un nouveau holder d'entite
2. Calcule la rotation depuis le vecteur de direction
3. Applique le decalage de position et de rotation
4. Ajoute les composants requis :
   - `TransformComponent` - Position et rotation
   - `HeadRotation` - Orientation de la tete
   - `Interactions` - Gestionnaires d'interaction
   - `ModelComponent` / `PersistentModel` - Modele visuel
   - `BoundingBox` - Limites de collision
   - `NetworkId` - Synchronisation reseau
   - `Projectile` - Composant marqueur
   - `Velocity` - Velocite de mouvement
   - `DespawnComponent` - Disparition auto apres 300 secondes
5. Configure la physique via `PhysicsConfig.apply()`
6. Joue les sons de lancement
7. Declenche l'interaction `ProjectileSpawn`

**Source :** `com.hypixel.hytale.server.core.modules.projectile.ProjectileModule.spawnProjectile()`

## Systeme physique

### StandardPhysicsProvider

Le `StandardPhysicsProvider` gere toute la simulation physique :

```java
public class StandardPhysicsProvider implements IBlockCollisionConsumer, Component<EntityStore> {
   // Etat physique
   protected final Vector3d velocity;
   protected final Vector3d position;
   protected final Vector3d movement;

   // Gestion des collisions
   protected final BlockCollisionProvider blockCollisionProvider;
   protected final EntityRefCollisionProvider entityCollisionProvider;

   // Suivi d'etat
   protected boolean bounced;
   protected int bounces = 0;
   protected boolean onGround;
   protected boolean inFluid;

   // Callbacks
   protected BounceConsumer bounceConsumer;
   protected ImpactConsumer impactConsumer;
}
```

### Etats physiques

```java
public enum STATE {
   ACTIVE,   // Simulation physique active
   RESTING,  // Au repos sur une surface
   INACTIVE  // Physique desactivee (apres impact)
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.config.StandardPhysicsProvider`

### StandardPhysicsTickSystem

Le systeme de tick physique s'execute a chaque frame pour mettre a jour les projectiles :

```java
public class StandardPhysicsTickSystem extends EntityTickingSystem<EntityStore> {
   @Nonnull
   private final Query<EntityStore> query = Query.and(
      StandardPhysicsProvider.getComponentType(),
      TransformComponent.getComponentType(),
      HeadRotation.getComponentType(),
      Velocity.getComponentType(),
      BoundingBox.getComponentType()
   );
}
```

Le processus de tick :

1. Obtient le modificateur de dilatation temporelle
2. Met a jour la velocite depuis les forces
3. Calcule le vecteur de mouvement
4. Verifie les collisions avec les entites
5. Verifie les collisions avec les blocs
6. Gere les interactions avec les fluides
7. Traite les rebonds ou impacts
8. Met a jour la rotation basee sur la velocite
9. Finalise la position et la velocite

**Source :** `com.hypixel.hytale.server.core.modules.projectile.system.StandardPhysicsTickSystem`

## Detection de collision et degats

### ImpactConsumer

L'interface `ImpactConsumer` gere les impacts de projectiles :

```java
@FunctionalInterface
public interface ImpactConsumer {
   void onImpact(
      @Nonnull Ref<EntityStore> projectileRef,
      @Nonnull Vector3d position,
      @Nullable Ref<EntityStore> targetRef,
      @Nullable String collisionDetailName,
      @Nonnull CommandBuffer<EntityStore> commandBuffer
   );
}
```

### BounceConsumer

L'interface `BounceConsumer` gere les rebonds de projectiles :

```java
@FunctionalInterface
public interface BounceConsumer {
   void onBounce(
      @Nonnull Ref<EntityStore> projectileRef,
      @Nonnull Vector3d position,
      @Nonnull CommandBuffer<EntityStore> commandBuffer
   );
}
```

### Types d'interaction

Les projectiles declenchent differents types d'interaction :

| Type d'interaction | Condition de declenchement |
|--------------------|----------------------------|
| `ProjectileSpawn` | Quand le projectile est cree |
| `ProjectileHit` | Quand le projectile touche une entite |
| `ProjectileMiss` | Quand le projectile touche le terrain/s'arrete |
| `ProjectileBounce` | Quand le projectile rebondit |

**Source :** `com.hypixel.hytale.server.core.modules.projectile.config.ImpactConsumer`, `BounceConsumer`

## Prediction cote client

### PredictedProjectileSystems

Le systeme de prediction synchronise les projectiles predits par le client :

```java
public class PredictedProjectileSystems {
   public static class EntityTrackerUpdate extends EntityTickingSystem<EntityStore> {
      @Nonnull
      private final Query<EntityStore> query = Query.and(
         EntityTrackerSystems.Visible.getComponentType(),
         PredictedProjectile.getComponentType()
      );

      @Override
      public void tick(...) {
         // Met en file les mises a jour de prediction pour les entites nouvellement visibles
         if (!visibleComponent.newlyVisibleTo.isEmpty()) {
            queueUpdatesFor(ref, predictedProjectile, visibleComponent.newlyVisibleTo);
         }
      }
   }
}
```

Le systeme envoie `ComponentUpdate` avec `ComponentUpdateType.Prediction` pour synchroniser les predictions client.

**Source :** `com.hypixel.hytale.server.core.modules.projectile.system.PredictedProjectileSystems`

## ProjectileInteraction

Le `ProjectileInteraction` cree des projectiles depuis le systeme d'interaction :

```java
public class ProjectileInteraction extends SimpleInstantInteraction implements BallisticDataProvider {
   protected String config;  // ID d'asset ProjectileConfig

   @Override
   protected void firstRun(InteractionType type, InteractionContext context, CooldownHandler cooldownHandler) {
      ProjectileConfig config = this.getConfig();
      if (config != null) {
         // Obtient la position et direction depuis l'etat client ou serveur
         Vector3d position;
         Vector3d direction;
         UUID generatedUUID;

         if (hasClientState) {
            position = PositionUtil.toVector3d(clientState.attackerPos);
            direction = new Vector3d(lookVec.getYaw(), lookVec.getPitch());
            generatedUUID = clientState.generatedUUID;
         } else {
            Transform lookVec = TargetUtil.getLook(ref, commandBuffer);
            position = lookVec.getPosition();
            direction = lookVec.getDirection();
            generatedUUID = null;
         }

         ProjectileModule.get().spawnProjectile(generatedUUID, ref, commandBuffer, config, position, direction);
      }
   }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.projectile.interaction.ProjectileInteraction`

## Ancien systeme de projectiles

:::warning Obsolete
L'ancien systeme de projectiles utilisant `ProjectileComponent` est obsolete. Utilisez le nouveau systeme `ProjectileModule` a la place.
:::

L'ancien `ProjectileComponent` fournit des fonctionnalites supplementaires comme les degats et les particules :

```java
@Deprecated
public class ProjectileComponent implements Component<EntityStore> {
   // Proprietes
   private String projectileAssetName;
   private float brokenDamageModifier = 1.0F;
   private double deadTimer = -1.0;
   private UUID creatorUuid;
   private boolean haveHit;

   // Physique
   private SimplePhysicsProvider simplePhysicsProvider;
}
```

**Source :** `com.hypixel.hytale.server.core.entity.entities.ProjectileComponent`

## Exemple de plugin

Voici un exemple complet de creation d'un projectile depuis un plugin :

```java
public class ProjectilePlugin extends JavaPlugin {

   public ProjectilePlugin(@Nonnull JavaPluginInit init) {
      super(init);
   }

   @Override
   protected void setup() {
      getEventRegistry().register(PlayerInteractEvent.class, this::onPlayerInteract);
   }

   private void onPlayerInteract(PlayerInteractEvent event) {
      PlayerRef playerRef = event.getPlayerRef();
      World world = event.getWorld();
      Store<EntityStore> store = world.getEntityStore().getStore();

      // Obtient la direction du regard du joueur
      TransformComponent transform = store.getComponent(
         playerRef.getReference(),
         TransformComponent.getComponentType()
      );

      if (transform != null) {
         Vector3d position = transform.getPosition().clone();
         position.y += 1.6; // Decalage hauteur des yeux

         Vector3f rotation = transform.getRotation();
         Vector3d direction = new Vector3d();
         PhysicsMath.vectorFromAngles(rotation.getYaw(), rotation.getPitch(), direction);

         // Obtient la config du projectile depuis le store d'assets
         ProjectileConfig config = ProjectileConfig.getAssetMap().getAsset("my_projectile");

         if (config != null) {
            // Cree le projectile via Store.forEach qui fournit le CommandBuffer
            store.forEach(PlayerSystem.getSystemType(), (ref, buffer) -> {
               if (ref.equals(playerRef.getReference())) {
                  Ref<EntityStore> projectileRef = ProjectileModule.get().spawnProjectile(
                     ref,
                     buffer,
                     config,
                     position,
                     direction
                  );
                  getLogger().info("Projectile cree : " + projectileRef);
               }
            });
         }
      }
   }

   // Projectile personnalise avec physique modifiee
   public void spawnCustomProjectile(
      Ref<EntityStore> creatorRef,
      CommandBuffer<EntityStore> commandBuffer,
      Vector3d position,
      Vector3d direction
   ) {
      ProjectileConfig baseConfig = ProjectileConfig.getAssetMap().getAsset("arrow");

      if (baseConfig != null) {
         // Cree avec force de lancement augmentee
         Vector3d boostedDirection = direction.clone().scale(2.0);

         ProjectileModule.get().spawnProjectile(
            creatorRef,
            commandBuffer,
            baseConfig,
            position,
            boostedDirection
         );
      }
   }
}
```

## Exemple de configuration JSON

Exemple de configuration de projectile en JSON :

```json
{
   "Id": "my_custom_arrow",
   "Physics": {
      "Type": "Standard",
      "Gravity": 9.8,
      "Density": 700.0,
      "Bounciness": 0.3,
      "BounceCount": 2,
      "BounceLimit": 0.4,
      "SticksVertically": true,
      "ComputeYaw": true,
      "ComputePitch": true,
      "RotationMode": "VelocityDamped",
      "TerminalVelocityAir": 50.0,
      "TerminalVelocityWater": 10.0
   },
   "Model": "models/projectiles/arrow",
   "LaunchForce": 25.0,
   "SpawnOffset": { "x": 0.0, "y": 0.5, "z": 1.0 },
   "SpawnRotationOffset": { "pitch": 0.0, "yaw": 0.0, "roll": 0.0 },
   "Interactions": {
      "ProjectileHit": "interactions/arrow_hit",
      "ProjectileMiss": "interactions/arrow_miss",
      "ProjectileBounce": "interactions/arrow_bounce"
   },
   "LaunchLocalSoundEventId": "sounds/bow_release",
   "LaunchWorldSoundEventId": "sounds/arrow_whoosh",
   "ProjectileSoundEventId": "sounds/arrow_flight_loop"
}
```

## Protocole reseau

Les configurations de projectiles sont serialisees pour la transmission reseau :

```java
public class ProjectileConfig {
   public PhysicsConfig physicsConfig;
   public Model model;
   public double launchForce;
   public Vector3f spawnOffset;
   public Direction rotationOffset;
   public Map<InteractionType, Integer> interactions;
   public int launchLocalSoundEventIndex;
   public int projectileSoundEventIndex;
}
```

**Source :** `com.hypixel.hytale.protocol.ProjectileConfig`

## Fichiers sources

| Classe | Chemin |
|--------|--------|
| `ProjectileModule` | `com.hypixel.hytale.server.core.modules.projectile.ProjectileModule` |
| `Projectile` | `com.hypixel.hytale.server.core.modules.projectile.component.Projectile` |
| `PredictedProjectile` | `com.hypixel.hytale.server.core.modules.projectile.component.PredictedProjectile` |
| `ProjectileConfig` | `com.hypixel.hytale.server.core.modules.projectile.config.ProjectileConfig` |
| `PhysicsConfig` | `com.hypixel.hytale.server.core.modules.projectile.config.PhysicsConfig` |
| `StandardPhysicsConfig` | `com.hypixel.hytale.server.core.modules.projectile.config.StandardPhysicsConfig` |
| `StandardPhysicsProvider` | `com.hypixel.hytale.server.core.modules.projectile.config.StandardPhysicsProvider` |
| `StandardPhysicsTickSystem` | `com.hypixel.hytale.server.core.modules.projectile.system.StandardPhysicsTickSystem` |
| `PredictedProjectileSystems` | `com.hypixel.hytale.server.core.modules.projectile.system.PredictedProjectileSystems` |
| `ProjectileInteraction` | `com.hypixel.hytale.server.core.modules.projectile.interaction.ProjectileInteraction` |
| `ImpactConsumer` | `com.hypixel.hytale.server.core.modules.projectile.config.ImpactConsumer` |
| `BounceConsumer` | `com.hypixel.hytale.server.core.modules.projectile.config.BounceConsumer` |
| `BallisticData` | `com.hypixel.hytale.server.core.modules.projectile.config.BallisticData` |
