---
id: stamina-system
title: Systeme de Stamina
sidebar_label: Systeme de Stamina
sidebar_position: 7
description: Documentation complete du systeme de stamina Hytale pour la gestion de la consommation, la regeneration et l'integration au combat
---

# Systeme de Stamina

Le systeme de stamina dans Hytale gere la consommation et la regeneration de stamina pour les entites. La stamina est utilisee pour diverses actions incluant le sprint, les interactions de combat et le blocage. Le systeme s'integre au systeme de statistiques d'entites et fournit des mecaniques de jeu configurables.

## Vue d'ensemble

Le `StaminaModule` est un plugin principal qui depend de `EntityModule` et `EntityStatsModule`. Il fournit :

- La consommation de stamina pendant le sprint
- Les delais de regeneration de stamina apres le sprint
- Les calculs de cout de stamina pour le blocage en combat
- L'integration avec le systeme d'effet "Stamina Broken"
- L'affichage HUD du statut de stamina

**Source :** `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaModule`

```java
public class StaminaModule extends JavaPlugin {
   public static final PluginManifest MANIFEST = PluginManifest.corePlugin(StaminaModule.class)
      .depends(EntityModule.class)
      .depends(EntityStatsModule.class)
      .build();
   private static StaminaModule instance;
   private ResourceType<EntityStore, SprintStaminaRegenDelay> sprintRegenDelayResourceType;

   @Override
   protected void setup() {
      this.sprintRegenDelayResourceType = this.getEntityStoreRegistry()
         .registerResource(SprintStaminaRegenDelay.class, SprintStaminaRegenDelay::new);
      this.getEntityStoreRegistry()
         .registerSystem(new StaminaSystems.SprintStaminaEffectSystem());
      this.getCodecRegistry(GameplayConfig.PLUGIN_CODEC)
         .register(StaminaGameplayConfig.class, "Stamina", StaminaGameplayConfig.CODEC);
      this.getEventRegistry()
         .register(LoadedAssetsEvent.class, GameplayConfig.class, StaminaModule::onGameplayConfigsLoaded);
   }
}
```

## Acceder aux statistiques de stamina

La stamina est l'un des types de statistiques d'entite par defaut. Vous pouvez y acceder via la classe `DefaultEntityStatTypes` :

```java
// Obtenir l'index de la statistique stamina
int staminaIndex = DefaultEntityStatTypes.getStamina();

// Obtenir la carte de statistiques d'une entite
EntityStatMap statMap = store.getComponent(entityRef, EntityStatMap.getComponentType());

// Obtenir la valeur de stamina
EntityStatValue staminaValue = statMap.get(staminaIndex);

// Obtenir la stamina actuelle
float currentStamina = staminaValue.get();

// Obtenir la stamina en pourcentage (0.0 a 1.0)
float staminaPercent = staminaValue.asPercentage();

// Obtenir les limites min/max
float minStamina = staminaValue.getMin();
float maxStamina = staminaValue.getMax();
```

**Source :** `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes`

```java
public abstract class DefaultEntityStatTypes {
   private static int HEALTH;
   private static int OXYGEN;
   private static int STAMINA;
   private static int MANA;
   private static int SIGNATURE_ENERGY;
   private static int AMMO;

   public static int getStamina() {
      return STAMINA;
   }

   public static void update() {
      IndexedLookupTableAssetMap<String, EntityStatType> assetMap = EntityStatType.getAssetMap();
      STAMINA = assetMap.getIndex("Stamina");
      // ... autres statistiques
   }
}
```

## Consommation de stamina

### Sprint

Le systeme de stamina suit quand les joueurs arretent de sprinter et applique un delai de regeneration. Cela empeche la stamina de se regenerer immediatement apres un sprint intense.

**Source :** `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaSystems`

```java
public static class SprintStaminaEffectSystem extends EntityTickingSystem<EntityStore> {
   private final Query<EntityStore> query = Query.and(
      playerComponentType,
      entityStatMapComponentType,
      movementStatesComponentType
   );

   @Override
   public void tick(
      float dt,
      int index,
      @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
      @Nonnull Store<EntityStore> store,
      @Nonnull CommandBuffer<EntityStore> commandBuffer
   ) {
      MovementStatesComponent movementStates = archetypeChunk.getComponent(
         index, movementStatesComponentType
      );

      // Detecter la transition de sprint a non-sprint
      if (!movementStates.getMovementStates().sprinting &&
          movementStates.getSentMovementStates().sprinting) {
         SprintStaminaRegenDelay regenDelay = store.getResource(sprintRegenDelayResourceType);
         EntityStatMap statMap = archetypeChunk.getComponent(index, entityStatMapComponentType);
         EntityStatValue statValue = statMap.get(regenDelay.getIndex());

         if (statValue != null && statValue.get() <= regenDelay.getValue()) {
            return;
         }

         // Appliquer le delai de regeneration
         statMap.setStatValue(regenDelay.getIndex(), regenDelay.getValue());
      }
   }
}
```

### Blocage en combat

Lors du blocage de degats, la stamina est consommee en fonction du montant de degats entrants. La configuration `StaminaCost` determine comment la consommation de stamina est calculee.

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.WieldingInteraction`

```java
public static class StaminaCost {
   public static final BuilderCodec<StaminaCost> CODEC = BuilderCodec.builder(
         StaminaCost.class, StaminaCost::new
      )
      .append(
         new KeyedCodec<>("CostType", new EnumCodec<>(CostType.class)),
         (staminaCost, costType) -> staminaCost.costType = costType,
         staminaCost -> staminaCost.costType
      )
      .append(
         new KeyedCodec<>("Value", Codec.FLOAT),
         (staminaCost, aFloat) -> staminaCost.value = aFloat,
         staminaCost -> staminaCost.value
      )
      .build();

   private CostType costType = CostType.MAX_HEALTH_PERCENTAGE;
   private float value = 0.04F;

   public float computeStaminaAmountToConsume(float damageRaw, @Nonnull EntityStatMap entityStatMap) {
      return switch (this.costType) {
         case MAX_HEALTH_PERCENTAGE ->
            damageRaw / (this.value * entityStatMap.get(DefaultEntityStatTypes.getHealth()).getMax());
         case DAMAGE ->
            damageRaw / this.value;
      };
   }

   static enum CostType {
      MAX_HEALTH_PERCENTAGE,
      DAMAGE;
   }
}
```

### Types de cout de stamina

| Type de cout | Description | Valeur par defaut |
|--------------|-------------|-------------------|
| `MAX_HEALTH_PERCENTAGE` | Definit combien de % de vie max equivaut a 1 point de stamina | 0.04 (4%) |
| `DAMAGE` | Definit combien de degats equivaut a 1 point de stamina | N/A |

### Systeme de degats sur la stamina

Lors du blocage de degats, le systeme `DamageStamina` gere la consommation de stamina :

**Source :** `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems`

```java
public static class DamageStamina extends DamageEventSystem
   implements EntityStatsSystems.StatModifyingSystem {

   @Nonnull
   private static final Query<EntityStore> QUERY = Query.and(
      DamageDataComponent.getComponentType(),
      EntityStatMap.getComponentType()
   );

   public void handleInternal(
      int index,
      @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
      @Nonnull Store<EntityStore> store,
      @Nonnull CommandBuffer<EntityStore> commandBuffer,
      @Nonnull Damage damage
   ) {
      EntityStatMap entityStatMapComponent = archetypeChunk.getComponent(
         index, EntityStatMap.getComponentType()
      );
      DamageDataComponent damageDataComponent = archetypeChunk.getComponent(
         index, DamageDataComponent.getComponentType()
      );

      if (damageDataComponent.getCurrentWielding() != null) {
         WieldingInteraction.StaminaCost staminaCost =
            damageDataComponent.getCurrentWielding().getStaminaCost();

         if (staminaCost != null) {
            Boolean isBlocked = damage.getMetaStore().getIfPresentMetaObject(Damage.BLOCKED);

            if (isBlocked != null && isBlocked) {
               float staminaToConsume = staminaCost.computeStaminaAmountToConsume(
                  damage.getInitialAmount(), entityStatMapComponent
               );

               // Appliquer le multiplicateur de drain de stamina si present
               Float multiplier = damage.getIfPresentMetaObject(Damage.STAMINA_DRAIN_MULTIPLIER);
               if (multiplier != null) {
                  staminaToConsume *= multiplier;
               }

               entityStatMapComponent.subtractStatValue(
                  DefaultEntityStatTypes.getStamina(), staminaToConsume
               );
            }
         }
      }
   }
}
```

## Regeneration de stamina

### Configuration du delai de regeneration

Le delai de regeneration de stamina apres le sprint est configure via `StaminaGameplayConfig` :

**Source :** `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaGameplayConfig`

```java
public class StaminaGameplayConfig {
   public static final String ID = "Stamina";
   public static final BuilderCodec<StaminaGameplayConfig> CODEC = BuilderCodec.builder(
         StaminaGameplayConfig.class, StaminaGameplayConfig::new
      )
      .appendInherited(
         new KeyedCodec<>("SprintRegenDelay", SprintRegenDelayConfig.CODEC),
         (config, s) -> config.sprintRegenDelay = s,
         config -> config.sprintRegenDelay,
         (config, parent) -> config.sprintRegenDelay = parent.sprintRegenDelay
      )
      .addValidator(Validators.nonNull())
      .documentation("Le delai de regeneration de stamina applique apres le sprint")
      .add()
      .build();

   protected SprintRegenDelayConfig sprintRegenDelay;

   @Nonnull
   public SprintRegenDelayConfig getSprintRegenDelay() {
      return this.sprintRegenDelay;
   }
}
```

### Configuration du delai de regeneration sprint

```java
public static class SprintRegenDelayConfig {
   public static final BuilderCodec<SprintRegenDelayConfig> CODEC = BuilderCodec.builder(
         SprintRegenDelayConfig.class, SprintRegenDelayConfig::new
      )
      .appendInherited(
         new KeyedCodec<>("EntityStatId", Codec.STRING),
         (config, s) -> config.statId = s,
         config -> config.statId,
         (config, parent) -> config.statId = parent.statId
      )
      .addValidator(Validators.nonNull())
      .addValidator(EntityStatType.VALIDATOR_CACHE.getValidator())
      .documentation("L'ID de l'EntityStat pour le delai de regeneration de stamina")
      .add()
      .appendInherited(
         new KeyedCodec<>("Value", Codec.FLOAT),
         (config, s) -> config.statValue = s,
         config -> config.statValue,
         (config, parent) -> config.statValue = parent.statValue
      )
      .addValidator(Validators.max(0.0F))
      .documentation("Le montant de delai de regeneration de stamina a appliquer")
      .add()
      .afterDecode(config ->
         config.statIndex = EntityStatType.getAssetMap().getIndex(config.statId)
      )
      .build();

   protected String statId;
   protected int statIndex;
   protected float statValue;

   public int getIndex() {
      return this.statIndex;
   }

   public float getValue() {
      return this.statValue;
   }
}
```

### Ressource de delai de regeneration sprint

Le systeme utilise une ressource pour suivre et valider les delais de regeneration :

**Source :** `com.hypixel.hytale.server.core.modules.entity.stamina.SprintStaminaRegenDelay`

```java
public class SprintStaminaRegenDelay implements Resource<EntityStore> {
   private static final AtomicInteger ASSET_VALIDATION_STATE = new AtomicInteger(0);
   protected int statIndex = 0;
   protected float statValue;
   protected int validationState = ASSET_VALIDATION_STATE.get() - 1;

   public static ResourceType<EntityStore, SprintStaminaRegenDelay> getResourceType() {
      return StaminaModule.get().getSprintRegenDelayResourceType();
   }

   public int getIndex() {
      return this.statIndex;
   }

   public float getValue() {
      return this.statValue;
   }

   public boolean validate() {
      return this.validationState == ASSET_VALIDATION_STATE.get();
   }

   public boolean hasDelay() {
      return this.statIndex != 0 && this.statValue < 0.0F;
   }

   public void update(int statIndex, float statValue) {
      this.statIndex = statIndex;
      this.statValue = statValue;
      this.validationState = ASSET_VALIDATION_STATE.get();
   }

   public static void invalidateResources() {
      ASSET_VALIDATION_STATE.incrementAndGet();
   }
}
```

## Effet Stamina Brisee

Lorsque la stamina est epuisee a cause des degats pendant le blocage, un effet "Stamina Broken" peut etre applique. Ceci est configure dans `CombatConfig` :

**Source :** `com.hypixel.hytale.server.core.asset.type.gameplay.CombatConfig`

```java
public class CombatConfig {
   @Nonnull
   public static final BuilderCodec<CombatConfig> CODEC = BuilderCodec.builder(
         CombatConfig.class, CombatConfig::new
      )
      .appendInherited(
         new KeyedCodec<>("StaminaBrokenEffectId", Codec.STRING),
         (config, s) -> config.staminaBrokenEffectId = s,
         config -> config.staminaBrokenEffectId,
         (config, parent) -> config.staminaBrokenEffectId = parent.staminaBrokenEffectId
      )
      .documentation("L'id de l'EntityEffect a appliquer lorsque la stamina est epuisee a cause des degats.")
      .addValidator(Validators.nonNull())
      .addValidator(EntityEffect.VALIDATOR_CACHE.getValidator())
      .add()
      // ... autres champs
      .build();

   protected String staminaBrokenEffectId = "Stamina_Broken";
   private int staminaBrokenEffectIndex;

   public int getStaminaBrokenEffectIndex() {
      return this.staminaBrokenEffectIndex;
   }
}
```

## Etats de mouvement

La consommation de stamina est liee a differents etats de mouvement. La classe `MovementStates` suit :

**Source :** `com.hypixel.hytale.protocol.MovementStates`

| Etat | Description |
|------|-------------|
| `sprinting` | Le joueur sprinte (haute consommation de stamina) |
| `running` | Le joueur court |
| `walking` | Le joueur marche |
| `jumping` | Le joueur saute |
| `rolling` | Le joueur roule (peut attenuer les degats de chute) |
| `swimming` | Le joueur nage |
| `climbing` | Le joueur grimpe |
| `gliding` | Le joueur plane |
| `crouching` | Le joueur s'accroupit |
| `sliding` | Le joueur glisse |
| `mantling` | Le joueur escalade des obstacles |

## Integration HUD

La stamina a un composant HUD dedie pour afficher le statut de stamina :

**Source :** `com.hypixel.hytale.protocol.packets.interface_.HudComponent`

```java
public enum HudComponent {
   // ... autres composants
   Stamina(18),
   // ...
}
```

## Multiplicateur de drain de stamina

Les effets de degats peuvent modifier le drain de stamina via un multiplicateur :

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects`

```java
public class DamageEffects implements NetworkSerializable<com.hypixel.hytale.protocol.DamageEffects> {
   protected float staminaDrainMultiplier = 1.0F;

   public void addToDamage(@Nonnull Damage damageEvent) {
      // ... autres effets

      if (this.staminaDrainMultiplier != 1.0F) {
         damageEvent.putMetaObject(Damage.STAMINA_DRAIN_MULTIPLIER, Float.valueOf(this.staminaDrainMultiplier));
      }
   }
}
```

## Exemple de plugin

Voici un exemple complet de plugin qui gere la stamina :

```java
public class StaminaPlugin extends JavaPlugin {

    public StaminaPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Ecouter les evenements de mouvement des joueurs
        getEventRegistry().register(PlayerMoveEvent.class, this::onPlayerMove);
    }

    private void onPlayerMove(PlayerMoveEvent event) {
        PlayerRef playerRef = event.getPlayerRef();
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore();

        // Obtenir la carte de statistiques du joueur
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            // Obtenir l'index de la statistique stamina
            int staminaIndex = DefaultEntityStatTypes.getStamina();

            // Obtenir la valeur actuelle de stamina
            EntityStatValue stamina = statMap.get(staminaIndex);
            if (stamina != null) {
                float currentStamina = stamina.get();
                float staminaPercent = stamina.asPercentage();

                getLogger().info("Stamina du joueur: " + currentStamina +
                    " (" + (staminaPercent * 100) + "%)");

                // Verifier si la stamina est basse
                if (staminaPercent < 0.2f) {
                    getLogger().warn("La stamina du joueur est basse!");
                }
            }
        }
    }

    // Drainer la stamina d'un joueur
    public void drainStamina(PlayerRef playerRef, Store<EntityStore> store, float amount) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int staminaIndex = DefaultEntityStatTypes.getStamina();
            statMap.subtractStatValue(staminaIndex, amount);
        }
    }

    // Restaurer la stamina d'un joueur
    public void restoreStamina(PlayerRef playerRef, Store<EntityStore> store, float amount) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int staminaIndex = DefaultEntityStatTypes.getStamina();
            statMap.addStatValue(staminaIndex, amount);
        }
    }

    // Mettre la stamina au maximum
    public void maxStamina(PlayerRef playerRef, Store<EntityStore> store) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int staminaIndex = DefaultEntityStatTypes.getStamina();
            statMap.maximizeStatValue(staminaIndex);
        }
    }

    // Ajouter un modificateur de stamina
    public void addStaminaModifier(PlayerRef playerRef, Store<EntityStore> store,
                                   String key, float amount) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int staminaIndex = DefaultEntityStatTypes.getStamina();
            StaticModifier modifier = new StaticModifier(
                Modifier.ModifierTarget.MAX,
                StaticModifier.CalculationType.MULTIPLICATIVE,
                amount
            );
            statMap.putModifier(staminaIndex, key, modifier);
        }
    }
}
```

## Commandes console

Utilisez les commandes standard de statistiques joueur/entite pour gerer la stamina :

| Commande | Description |
|----------|-------------|
| `/player stats get <joueur> Stamina` | Obtenir la stamina actuelle d'un joueur |
| `/player stats set <joueur> Stamina <valeur>` | Definir la stamina d'un joueur |
| `/player stats add <joueur> Stamina <montant>` | Ajouter a la stamina d'un joueur |
| `/player stats sub <joueur> Stamina <montant>` | Soustraire de la stamina d'un joueur |
| `/player stats settomax <joueur> Stamina` | Mettre la stamina d'un joueur au maximum |
| `/player stats reset <joueur> Stamina` | Reinitialiser la stamina d'un joueur |

## Fichiers sources

| Classe | Chemin |
|--------|--------|
| `StaminaModule` | `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaModule` |
| `StaminaSystems` | `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaSystems` |
| `StaminaGameplayConfig` | `com.hypixel.hytale.server.core.modules.entity.stamina.StaminaGameplayConfig` |
| `SprintStaminaRegenDelay` | `com.hypixel.hytale.server.core.modules.entity.stamina.SprintStaminaRegenDelay` |
| `DefaultEntityStatTypes` | `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes` |
| `DamageSystems.DamageStamina` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems` |
| `WieldingInteraction.StaminaCost` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.WieldingInteraction` |
| `CombatConfig` | `com.hypixel.hytale.server.core.asset.type.gameplay.CombatConfig` |
| `DamageEffects` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects` |
| `MovementStates` | `com.hypixel.hytale.protocol.MovementStates` |
| `MovementStatesComponent` | `com.hypixel.hytale.server.core.entity.movement.MovementStatesComponent` |

## Voir aussi

- [Systeme de statistiques d'entites](/modding/plugins/entity-stats) - Documentation du systeme de statistiques de base
- [Systeme de degats](/modding/plugins/damage-system) - Comment les degats affectent la stamina
- [Interactions](/modding/plugins/interactions) - Interactions de maniement et de blocage
