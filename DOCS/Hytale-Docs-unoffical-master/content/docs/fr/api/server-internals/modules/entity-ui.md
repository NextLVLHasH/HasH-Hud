---
id: entity-ui
title: Systeme d'UI d'Entite
sidebar_label: UI d'Entite
sidebar_position: 7
description: Documentation complete du systeme d'UI d'entite Hytale pour les barres de vie, indicateurs de degats et texte de combat
---

# Systeme d'UI d'Entite

Le systeme d'UI d'Entite dans Hytale fournit un retour visuel pour les entites a travers les barres de vie, les indicateurs de degats et le texte de combat. Ce systeme est construit sur l'architecture ECS (Entity Component System) et s'integre au module de Stats d'Entite.

## Vue d'Ensemble du Systeme

L'EntityUIModule gere les composants d'UI qui sont rendus au-dessus des entites dans le monde du jeu. Ces composants incluent :

- **Entity Stat UI** - Barres de vie et affichages de stats
- **Combat Text UI** - Nombres de degats flottants et indicateurs de texte

**Source:** `com.hypixel.hytale.server.core.modules.entityui.EntityUIModule`

```java
public class EntityUIModule extends JavaPlugin {
   public static final PluginManifest MANIFEST = PluginManifest.corePlugin(EntityUIModule.class)
       .depends(EntityStatsModule.class).build();

   private ComponentType<EntityStore, UIComponentList> uiComponentListType;

   public static EntityUIModule get() {
      return instance;
   }

   public ComponentType<EntityStore, UIComponentList> getUIComponentListType() {
      return this.uiComponentListType;
   }
}
```

## Types de Composants UI

Hytale definit deux types de composants d'UI d'entite :

| Type | Classe | Description |
|------|--------|-------------|
| `EntityStat` | `EntityStatUIComponent` | Affiche les valeurs de stats (barres de vie, mana, etc.) |
| `CombatText` | `CombatTextUIComponent` | Texte de combat flottant (nombres de degats, statuts) |

## Classe de Base EntityUIComponent

Tous les composants UI heritent de la classe de base `EntityUIComponent` :

```java
public abstract class EntityUIComponent
   implements JsonAssetWithMap<String, IndexedLookupTableAssetMap<String, EntityUIComponent>>,
   NetworkSerializable<com.hypixel.hytale.protocol.EntityUIComponent> {

   protected String id;
   protected AssetExtraInfo.Data data;
   private Vector2f hitboxOffset = new Vector2f(0.0F, 0.0F);
}
```

### Proprietes de Base

| Propriete | Type | Description |
|-----------|------|-------------|
| `id` | `String` | Identifiant unique du composant |
| `HitboxOffset` | `Vector2f` | Decalage depuis le centre de la hitbox de l'entite pour afficher ce composant |

## EntityStatUIComponent

L'`EntityStatUIComponent` affiche visuellement les stats d'entite, comme les barres de vie :

```java
public class EntityStatUIComponent extends EntityUIComponent {
   public static final BuilderCodec<EntityStatUIComponent> CODEC = BuilderCodec.builder(
         EntityStatUIComponent.class, EntityStatUIComponent::new, EntityUIComponent.ABSTRACT_CODEC
      )
      .appendInherited(
         new KeyedCodec<>("EntityStat", Codec.STRING),
         (config, s) -> config.entityStat = s,
         config -> config.entityStat,
         (config, parent) -> config.entityStat = parent.entityStat
      )
      .addValidator(Validators.nonNull())
      .addValidator(Validators.nonEmptyString())
      .addValidator(EntityStatType.VALIDATOR_CACHE.getValidator())
      .documentation("The entity stat to represent.")
      .add()
      .afterDecode(config -> config.entityStatIndex = EntityStatType.getAssetMap().getIndex(config.entityStat))
      .build();

   protected String entityStat;
   protected int entityStatIndex;
}
```

### Proprietes d'EntityStatUIComponent

| Propriete | Type | Description |
|-----------|------|-------------|
| `EntityStat` | `String` | La stat d'entite a representer (ex: "Health", "Mana") |

### Exemple JSON

```json
{
  "Type": "EntityStat",
  "EntityStat": "Health",
  "HitboxOffset": { "x": 0.0, "y": 1.5 }
}
```

## CombatTextUIComponent

Le `CombatTextUIComponent` affiche du texte de combat flottant pour les nombres de degats et les effets de statut :

```java
public class CombatTextUIComponent extends EntityUIComponent {
   private static final float DEFAULT_FONT_SIZE = 68.0F;
   private static final Color DEFAULT_TEXT_COLOR = new Color((byte)-1, (byte)-1, (byte)-1);

   private RangeVector2f randomPositionOffsetRange;
   private float viewportMargin;
   private float duration;
   private float hitAngleModifierStrength = 1.0F;
   private float fontSize = 68.0F;
   private Color textColor = DEFAULT_TEXT_COLOR;
   private CombatTextUIComponentAnimationEvent[] animationEvents;
}
```

### Proprietes de CombatTextUIComponent

| Propriete | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `RandomPositionOffsetRange` | `RangeVector2f` | - | Plage maximale pour decaler aleatoirement le texte de sa position de depart |
| `ViewportMargin` | `float` | - | Distance minimale (px) des bords du viewport pour le clamping du texte (0-200) |
| `Duration` | `float` | - | Duree (secondes) pendant laquelle le texte doit etre visible (0.1-10.0) |
| `HitAngleModifierStrength` | `float` | 1.0 | Force du modificateur de position sur l'axe X base sur l'angle d'attaque melee (0-10) |
| `FontSize` | `float` | 68.0 | Taille de police pour les instances de texte |
| `TextColor` | `Color` | Blanc | Couleur du texte (RGB) |
| `AnimationEvents` | `Array` | - | Evenements d'animation pour l'echelle, la position et l'opacite |

### Exemple JSON

```json
{
  "Type": "CombatText",
  "RandomPositionOffsetRange": { "min": { "x": -10, "y": -5 }, "max": { "x": 10, "y": 5 } },
  "ViewportMargin": 20.0,
  "Duration": 1.5,
  "HitAngleModifierStrength": 1.0,
  "FontSize": 72.0,
  "TextColor": { "r": 255, "g": 0, "b": 0 },
  "AnimationEvents": [
    {
      "Type": "Scale",
      "StartAt": 0.0,
      "EndAt": 0.2,
      "StartScale": 0.0,
      "EndScale": 1.0
    },
    {
      "Type": "Position",
      "StartAt": 0.0,
      "EndAt": 1.0,
      "PositionOffset": { "x": 0, "y": 50 }
    },
    {
      "Type": "Opacity",
      "StartAt": 0.7,
      "EndAt": 1.0,
      "StartOpacity": 1.0,
      "EndOpacity": 0.0
    }
  ]
}
```

## Evenements d'Animation

Le texte de combat supporte trois types d'evenements d'animation qui controlent comment le texte apparait et se deplace :

### Evenement d'Animation d'Echelle

Controle le redimensionnement du texte de combat dans le temps :

```java
public class CombatTextUIComponentScaleAnimationEvent extends CombatTextUIComponentAnimationEvent {
   private float startScale;
   private float endScale;
}
```

| Propriete | Type | Plage | Description |
|-----------|------|-------|-------------|
| `StartAt` | `float` | 0.0-1.0 | Pourcentage de la duree ou l'animation commence |
| `EndAt` | `float` | 0.0-1.0 | Pourcentage de la duree ou l'animation se termine |
| `StartScale` | `float` | 0.0-1.0 | Echelle avant le debut de l'animation |
| `EndScale` | `float` | 0.0-1.0 | Echelle a la fin de l'animation |

### Evenement d'Animation de Position

Controle le mouvement du texte de combat :

```java
public class CombatTextUIComponentPositionAnimationEvent extends CombatTextUIComponentAnimationEvent {
   private Vector2f positionOffset;
}
```

| Propriete | Type | Description |
|-----------|------|-------------|
| `StartAt` | `float` | Pourcentage de la duree ou l'animation commence |
| `EndAt` | `float` | Pourcentage de la duree ou l'animation se termine |
| `PositionOffset` | `Vector2f` | Decalage depuis la position de depart vers lequel animer |

### Evenement d'Animation d'Opacite

Controle la transparence du texte de combat :

```java
public class CombatTextUIComponentOpacityAnimationEvent extends CombatTextUIComponentAnimationEvent {
   private float startOpacity;
   private float endOpacity;
}
```

| Propriete | Type | Plage | Description |
|-----------|------|-------|-------------|
| `StartAt` | `float` | 0.0-1.0 | Pourcentage de la duree ou l'animation commence |
| `EndAt` | `float` | 0.0-1.0 | Pourcentage de la duree ou l'animation se termine |
| `StartOpacity` | `float` | 0.0-1.0 | Opacite avant le debut de l'animation |
| `EndOpacity` | `float` | 0.0-1.0 | Opacite a la fin de l'animation |

## UIComponentList

L'`UIComponentList` est un composant ECS qui stocke tous les composants UI assignes a une entite :

```java
public class UIComponentList implements Component<EntityStore> {
   public static final BuilderCodec<UIComponentList> CODEC = BuilderCodec.builder(UIComponentList.class, UIComponentList::new)
      .append(new KeyedCodec<>("Components", Codec.STRING_ARRAY), (list, v) -> list.components = v, list -> list.components)
      .add()
      .afterDecode(list -> {
         list.componentIds = ArrayUtil.EMPTY_INT_ARRAY;
         list.update();
      })
      .build();

   protected String[] components;
   protected int[] componentIds;

   public static ComponentType<EntityStore, UIComponentList> getComponentType() {
      return EntityUIModule.get().getUIComponentListType();
   }

   public int[] getComponentIds() {
      return this.componentIds;
   }
}
```

### Obtenir les Composants UI d'une Entite

```java
// Obtenir le type de composant
ComponentType<EntityStore, UIComponentList> componentType = UIComponentList.getComponentType();

// Obtenir la liste des composants UI d'une entite
UIComponentList uiList = store.getComponent(entityRef, componentType);

// Obtenir les IDs des composants
int[] componentIds = uiList.getComponentIds();
```

## Systemes de Composants UI

L'EntityUIModule enregistre trois systemes ECS pour gerer les composants UI :

### Systeme de Configuration

Ajoute automatiquement `UIComponentList` aux entites vivantes lorsqu'elles apparaissent :

```java
public static class Setup extends HolderSystem<EntityStore> {
   @Override
   public void onEntityAdd(@Nonnull Holder<EntityStore> holder, @Nonnull AddReason reason, @Nonnull Store<EntityStore> store) {
      UIComponentList components = holder.getComponent(this.uiComponentListComponentType);
      if (components == null) {
         components = holder.ensureAndGetComponent(this.uiComponentListComponentType);
         components.update();
      }
   }

   @Nonnull
   @Override
   public Query<EntityStore> getQuery() {
      return AllLegacyLivingEntityTypesQuery.INSTANCE;
   }
}
```

### Systeme de Mise a Jour

Envoie les mises a jour des composants UI aux joueurs lorsque les entites deviennent visibles :

```java
public static class Update extends EntityTickingSystem<EntityStore> {
   @Override
   public void tick(float dt, int index, @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
         @Nonnull Store<EntityStore> store, @Nonnull CommandBuffer<EntityStore> commandBuffer) {
      EntityTrackerSystems.Visible visible = archetypeChunk.getComponent(index, this.visibleComponentType);
      UIComponentList uiComponentList = archetypeChunk.getComponent(index, this.uiComponentListComponentType);
      if (!visible.newlyVisibleTo.isEmpty()) {
         queueUpdatesFor(archetypeChunk.getReferenceTo(index), uiComponentList, visible.newlyVisibleTo);
      }
   }

   private static void queueUpdatesFor(Ref<EntityStore> ref, @Nonnull UIComponentList uiComponentList,
         @Nonnull Map<Ref<EntityStore>, EntityTrackerSystems.EntityViewer> visibleTo) {
      ComponentUpdate update = new ComponentUpdate();
      update.type = ComponentUpdateType.UIComponents;
      update.entityUIComponents = uiComponentList.getComponentIds();

      for (EntityTrackerSystems.EntityViewer viewer : visibleTo.values()) {
         viewer.queueUpdate(ref, update);
      }
   }
}
```

### Systeme de Suppression

Gere le nettoyage lorsque les composants UI sont supprimes des entites :

```java
public static class Remove extends RefChangeSystem<EntityStore, UIComponentList> {
   public void onComponentRemoved(@Nonnull Ref<EntityStore> ref, @Nonnull UIComponentList component,
         @Nonnull Store<EntityStore> store, @Nonnull CommandBuffer<EntityStore> commandBuffer) {
      for (EntityTrackerSystems.EntityViewer viewer : store.getComponent(ref, this.visibleComponentType).visibleTo.values()) {
         viewer.queueRemove(ref, ComponentUpdateType.UIComponents);
      }
   }
}
```

## Synchronisation Reseau

Les composants UI sont synchronises aux clients via la generation de paquets :

```java
public class EntityUIComponentPacketGenerator extends AssetPacketGenerator<String, EntityUIComponent,
      IndexedLookupTableAssetMap<String, EntityUIComponent>> {

   @Nonnull
   public Packet generateInitPacket(@Nonnull IndexedLookupTableAssetMap<String, EntityUIComponent> assetMap,
         @Nonnull Map<String, EntityUIComponent> assets) {
      Int2ObjectMap<com.hypixel.hytale.protocol.EntityUIComponent> configs = new Int2ObjectOpenHashMap<>();

      for (Entry<String, EntityUIComponent> entry : assets.entrySet()) {
         configs.put(assetMap.getIndex(entry.getKey()), entry.getValue().toPacket());
      }

      return new UpdateEntityUIComponents(UpdateType.Init, assetMap.getNextIndex(), configs);
   }
}
```

### Types de Mise a Jour

| Type | Description |
|------|-------------|
| `Init` | Paquet initial envoye lors de la connexion du client |
| `AddOrUpdate` | Met a jour des composants existants ou en ajoute de nouveaux |
| `Remove` | Supprime des composants UI |

## Exemple de Plugin

Voici un exemple complet de travail avec les composants d'UI d'entite dans un plugin :

```java
public class EntityUIPlugin extends JavaPlugin {

    public EntityUIPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Ecouter les evenements d'ajout de joueur au monde
        getEventRegistry().register(AddPlayerToWorldEvent.class, this::onPlayerAddedToWorld);
    }

    private void onPlayerAddedToWorld(AddPlayerToWorldEvent event) {
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore().getStore();
        Ref<EntityStore> entityRef = event.getHolder();

        // Obtenir la liste des composants UI de l'entite
        UIComponentList uiList = store.getComponent(entityRef, UIComponentList.getComponentType());

        if (uiList != null) {
            // Obtenir les IDs des composants actuels
            int[] componentIds = uiList.getComponentIds();

            getLogger().info("Joueur ajoute au monde avec " + componentIds.length + " composants UI");
        }
    }

    // Obtenir un composant UI par ID
    public EntityUIComponent getUIComponent(String componentId) {
        IndexedLookupTableAssetMap<String, EntityUIComponent> assetMap = EntityUIComponent.getAssetMap();
        int index = assetMap.getIndex(componentId);
        return assetMap.get(index);
    }

    // Verifier si une entite a un composant UI specifique
    public boolean hasUIComponent(Store<EntityStore> store, Ref<EntityStore> entityRef, String componentId) {
        UIComponentList uiList = store.getComponent(entityRef, UIComponentList.getComponentType());
        if (uiList == null) {
            return false;
        }

        IndexedLookupTableAssetMap<String, EntityUIComponent> assetMap = EntityUIComponent.getAssetMap();
        int targetIndex = assetMap.getIndex(componentId);

        for (int id : uiList.getComponentIds()) {
            if (id == targetIndex) {
                return true;
            }
        }
        return false;
    }
}
```

## Chemin des Assets

Les assets de composants d'UI d'entite sont charges depuis :

```
Entity/UI/
```

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `EntityUIModule` | `com.hypixel.hytale.server.core.modules.entityui.EntityUIModule` |
| `EntityUIComponent` | `com.hypixel.hytale.server.core.modules.entityui.asset.EntityUIComponent` |
| `EntityStatUIComponent` | `com.hypixel.hytale.server.core.modules.entityui.asset.EntityStatUIComponent` |
| `CombatTextUIComponent` | `com.hypixel.hytale.server.core.modules.entityui.asset.CombatTextUIComponent` |
| `UIComponentList` | `com.hypixel.hytale.server.core.modules.entityui.UIComponentList` |
| `UIComponentSystems` | `com.hypixel.hytale.server.core.modules.entityui.UIComponentSystems` |
| `CombatTextUIComponentAnimationEvent` | `com.hypixel.hytale.server.core.modules.entityui.asset.CombatTextUIComponentAnimationEvent` |
| `CombatTextUIComponentScaleAnimationEvent` | `com.hypixel.hytale.server.core.modules.entityui.asset.CombatTextUIComponentScaleAnimationEvent` |
| `CombatTextUIComponentPositionAnimationEvent` | `com.hypixel.hytale.server.core.modules.entityui.asset.CombatTextUIComponentPositionAnimationEvent` |
| `CombatTextUIComponentOpacityAnimationEvent` | `com.hypixel.hytale.server.core.modules.entityui.asset.CombatTextUIComponentOpacityAnimationEvent` |
| `EntityUIComponentPacketGenerator` | `com.hypixel.hytale.server.core.modules.entityui.asset.EntityUIComponentPacketGenerator` |
