---
id: entity-event-view
title: EntityEventView
sidebar_label: EntityEventView
---

# EntityEventView

Un composant de vue de tableau noir qui gere les notifications d'evenements lies aux entites pour les PNJ. Cette classe gere l'enregistrement, le filtrage et la distribution des evenements d'entite (degats, mort, interaction) aux PNJ qui sont configures pour les ecouter.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.entity.EntityEventView` |
| **Classe parente** | `EventView<EntityEventView, EntityEventType, EntityEventNotification>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/entity/EntityEventView.java:28` |

## Declaration

```java
public class EntityEventView extends EventView<EntityEventView, EntityEventType, EntityEventNotification> {
    public EntityEventView(@Nonnull World world) {
        super(EntityEventType.class, EntityEventType.VALUES, new EntityEventNotification(), world);
        this.eventRegistry.register(PlayerInteractEvent.class, world.getName(), this::onPlayerInteraction);

        for (EntityEventType eventType : EntityEventType.VALUES) {
            this.entityMapsByEventType.put(
                eventType,
                new EventTypeRegistration<>(
                    eventType,
                    (set, roleIndex) -> TagSetPlugin.get(NPCGroup.class).tagInSet(set, roleIndex),
                    NPCEntity::notifyEntityEvent
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
| `getUpdatedView` | `public EntityEventView getUpdatedView(@Nonnull Ref<EntityStore> ref, @Nonnull ComponentAccessor<EntityStore> componentAccessor)` | Retourne la vue pour le monde actuel de l'entite |
| `initialiseEntity` | `public void initialiseEntity(@Nonnull Ref<EntityStore> ref, @Nonnull NPCEntity npcComponent)` | Enregistre les ecouteurs d'evenements d'un PNJ |
| `onEvent` | `protected void onEvent(int senderTypeId, double x, double y, double z, Ref<EntityStore> initiator, @Nonnull Ref<EntityStore> skip, @Nonnull ComponentAccessor<EntityStore> componentAccessor, EntityEventType type)` | Traite et distribue un evenement d'entite (definit la reference du troupeau) |
| `processAttackedEvent` | `public void processAttackedEvent(@Nonnull Ref<EntityStore> victim, @Nonnull Ref<EntityStore> attacker, @Nonnull ComponentAccessor<EntityStore> componentAccessor, EntityEventType eventType)` | Gere les evenements de degats et de mort |

## Caracteristiques cles

### Enregistrement d'evenements

La vue s'enregistre automatiquement pour `PlayerInteractEvent` pour gerer les interactions avec les PNJ:

```java
this.eventRegistry.register(PlayerInteractEvent.class, world.getName(), this::onPlayerInteraction);
```

### Filtrage par groupe de PNJ

Les evenements sont filtres en fonction des groupes de PNJ utilisant le TagSetPlugin:

```java
(set, roleIndex) -> TagSetPlugin.get(NPCGroup.class).tagInSet(set, roleIndex)
```

### Suivi de reference de troupeau

Lors du traitement des evenements, la vue suit l'appartenance au troupeau pour les comportements d'IA de groupe:

```java
FlockMembership membership = componentAccessor.getComponent(skip, FlockMembership.getComponentType());
Ref<EntityStore> flockReference = membership != null ? membership.getFlockRef() : null;
this.reusableEventNotification.setFlockReference(flockReference);
```

## Exemple d'utilisation

```java
// L'EntityEventView est generalement gere par le systeme Blackboard
// Y acceder via la ressource blackboard
Blackboard blackboard = componentAccessor.getResource(Blackboard.getResourceType());
EntityEventView entityView = blackboard.getView(EntityEventView.class, ref, componentAccessor);

// Initialiser les ecouteurs d'evenements d'un PNJ
public void setupNpcEvents(Ref<EntityStore> ref, NPCEntity npc, EntityEventView view) {
    view.initialiseEntity(ref, npc);
}

// Traiter un evenement d'attaque (appele par les systemes de degats)
public void onEntityAttacked(Ref<EntityStore> victim, Ref<EntityStore> attacker,
                             ComponentAccessor<EntityStore> accessor) {
    EntityEventView view = getEntityEventView(accessor);

    // Notifier les PNJ de l'evenement de degats
    view.processAttackedEvent(victim, attacker, accessor, EntityEventType.DAMAGE);
}
```

## Flux d'evenements

1. **Declenchement de l'evenement**: Un evenement d'entite se produit (degats, mort ou interaction)
2. **Recherche de vue**: L'`EntityEventView` approprie est recupere pour le monde
3. **Traitement de l'evenement**: La vue appelle `onEvent` ou `processAttackedEvent`
4. **Filtrage des PNJ**: Les evenements sont filtres par groupe/role de PNJ
5. **Notification**: Les PNJ correspondants recoivent l'evenement via `NPCEntity::notifyEntityEvent`
6. **Reponse de l'IA**: Les PNJ traitent l'evenement via leurs arbres de comportement

## Cas d'utilisation courants

- Gerer la conscience des PNJ des combats a proximite
- Distribuer des evenements d'interaction aux PNJ de quete
- Coordonner les reponses d'IA de groupe aux menaces
- Implementer des systemes d'alerte pour les PNJ gardes
- Declencher des reponses a l'echelle de la faction aux attaques
- Gerer les notifications de mort des PNJ pour le comportement de meute

## Types lies

- [EntityEventType](./entity-event-type) - Enumeration des types d'evenements d'entite
- [EntityEventNotification](./entity-event-notification) - Donnees de notification d'evenement
- [BlockEventView](./block-event-view) - Vue similaire pour les evenements de bloc
- [EventView](./event-view) - Classe de base pour les vues d'evenements

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/entity/EntityEventView.java:28`
