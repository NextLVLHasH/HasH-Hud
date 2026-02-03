---
id: block-event-view
title: BlockEventView
sidebar_label: BlockEventView
---

# BlockEventView

Un composant de vue de tableau noir qui gere les notifications d'evenements lies aux blocs pour les PNJ. Cette classe gere l'enregistrement, le filtrage et la distribution des evenements de bloc (degats, destruction, interaction) aux PNJ qui sont configures pour les ecouter.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.block.BlockEventView` |
| **Classe parente** | `EventView<BlockEventView, BlockEventType, EventNotification>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/block/BlockEventView.java:26` |

## Declaration

```java
public class BlockEventView extends EventView<BlockEventView, BlockEventType, EventNotification> {
    public BlockEventView(@Nonnull World world) {
        super(BlockEventType.class, BlockEventType.VALUES, new EventNotification(), world);
        this.eventRegistry.register(PlayerInteractEvent.class, world.getName(), this::onPlayerInteraction);

        for (BlockEventType eventType : BlockEventType.VALUES) {
            this.entityMapsByEventType.put(
                eventType,
                new EventTypeRegistration<>(
                    eventType,
                    (set, blockId) -> BlockSetModule.getInstance().blockInSet(set, blockId),
                    NPCEntity::notifyBlockChange
                )
            );
        }
    }
```

## Constructeur

| Parametre | Type | Description |
|-----------|------|-------------|
| `world` | `World` | Le monde auquel cette vue est associee |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getUpdatedView` | `public BlockEventView getUpdatedView(@Nonnull Ref<EntityStore> ref, @Nonnull ComponentAccessor<EntityStore> componentAccessor)` | Retourne la vue pour le monde actuel de l'entite |
| `initialiseEntity` | `public void initialiseEntity(@Nonnull Ref<EntityStore> ref, @Nonnull NPCEntity npcComponent)` | Enregistre les ecouteurs d'evenements de bloc d'un PNJ |
| `onEvent` | `protected void onEvent(int senderTypeId, double x, double y, double z, Ref<EntityStore> initiator, Ref<EntityStore> skip, @Nonnull ComponentAccessor<EntityStore> componentAccessor, BlockEventType type)` | Traite et distribue un evenement de bloc (ajoute un decalage de 0.5 pour centrer sur le bloc) |
| `onEntityDamageBlock` | `public void onEntityDamageBlock(@Nonnull Ref<EntityStore> ref, @Nonnull DamageBlockEvent event)` | Gere les evenements de degats de bloc |
| `onEntityBreakBlock` | `public void onEntityBreakBlock(@Nonnull Ref<EntityStore> ref, @Nonnull BreakBlockEvent event)` | Gere les evenements de destruction de bloc |

## Caracteristiques cles

### Filtrage par ensemble de blocs

Les evenements sont filtres en fonction des ensembles de blocs utilisant le BlockSetModule:

```java
(set, blockId) -> BlockSetModule.getInstance().blockInSet(set, blockId)
```

### Centrage de position

Les evenements de bloc sont centres sur la position du bloc en ajoutant 0.5 a chaque coordonnee:

```java
protected void onEvent(...) {
    super.onEvent(senderTypeId, x + 0.5, y + 0.5, z + 0.5, initiator, skip, componentAccessor, type);
}
```

### Filtrage du mode de jeu

Les joueurs en mode creatif peuvent optionnellement contourner la detection des PNJ:

```java
if (playerComponent.getGameMode() == GameMode.Creative) {
    PlayerSettings playerSettingsComponent = store.getComponent(initiatorRef, PlayerSettings.getComponentType());
    if (playerSettingsComponent == null || !playerSettingsComponent.creativeSettings().allowNPCDetection()) {
        return; // Sauter la notification en mode creatif
    }
}
```

## Exemple d'utilisation

```java
// Le BlockEventView est generalement gere par le systeme Blackboard
Blackboard blackboard = componentAccessor.getResource(Blackboard.getResourceType());
BlockEventView blockView = blackboard.getView(BlockEventView.class, ref, componentAccessor);

// Initialiser les ecouteurs d'evenements de bloc d'un PNJ
public void setupNpcBlockEvents(Ref<EntityStore> ref, NPCEntity npc, BlockEventView view) {
    view.initialiseEntity(ref, npc);
}

// Se connecter aux evenements de degats de bloc (appele depuis les systemes de jeu)
public void onBlockDamaged(Ref<EntityStore> playerRef, DamageBlockEvent event) {
    BlockEventView view = getBlockEventView(event.getWorld());
    view.onEntityDamageBlock(playerRef, event);
}

// Se connecter aux evenements de destruction de bloc
public void onBlockBroken(Ref<EntityStore> playerRef, BreakBlockEvent event) {
    BlockEventView view = getBlockEventView(event.getWorld());
    view.onEntityBreakBlock(playerRef, event);
}
```

## Flux d'evenements

1. **Declenchement de l'evenement**: Un evenement de bloc se produit (degats, destruction ou interaction)
2. **Reception de l'evenement**: `onEntityDamageBlock`, `onEntityBreakBlock` ou `onPlayerInteraction` est appele
3. **Verification d'annulation**: Les evenements annules sont ignores
4. **Verification du mode de jeu**: Le mode creatif peut contourner la detection des PNJ
5. **Recherche d'ID de bloc**: L'ID du type de bloc est resolu a partir du bloc a la position
6. **Traitement de l'evenement**: `onEvent` est appele avec des coordonnees centrees
7. **Filtrage des PNJ**: Les evenements sont filtres par ensembles de blocs
8. **Notification**: Les PNJ correspondants recoivent l'evenement via `NPCEntity::notifyBlockChange`

## Cas d'utilisation courants

- Creer des PNJ gardes qui reagissent aux degats de structures
- Implementer des blocs d'alarme qui alertent les PNJ a proximite
- Faire reagir les PNJ aux interactions porte/levier
- Construire une IA qui repond a la destruction environnementale
- Implementer des comportements de defense territoriale
- Creer des mecaniques de puzzles avec des reponses de PNJ

## Types lies

- [BlockEventType](./block-event-type) - Enumeration des types d'evenements de bloc
- [EntityEventView](./entity-event-view) - Vue similaire pour les evenements d'entite
- [EventNotification](./event-notification) - Donnees de notification d'evenement
- [EventView](./event-view) - Classe de base pour les vues d'evenements

## Evenements de bloc lies

- [BreakBlockEvent](../block/break-block-event) - Evenement de plugin pour la destruction de bloc
- [DamageBlockEvent](../block/damage-block-event) - Evenement de plugin pour les degats de bloc
- [UseBlockEvent](../block/use-block-event) - Evenement de plugin pour les interactions de bloc

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/block/BlockEventView.java:26`
