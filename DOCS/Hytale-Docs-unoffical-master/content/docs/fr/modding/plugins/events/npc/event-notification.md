---
id: event-notification
title: EventNotification
sidebar_label: EventNotification
---

# EventNotification

Une classe de donnees qui transporte des informations sur les evenements du tableau noir des PNJ. Cette classe fournit le contexte necessaire pour que les PNJ reagissent aux evenements, incluant la position ou l'evenement s'est produit et l'entite qui l'a initie.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.EventNotification` |
| **Classe parente** | `Object` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/EventNotification.java:7` |

## Declaration

```java
public class EventNotification {
   private final Vector3d position = new Vector3d();
   private Ref<EntityStore> initiator;
   private int set;

   public EventNotification() {
   }
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `position` | `Vector3d` | `getPosition()` | La position 3D ou l'evenement s'est produit |
| `initiator` | `Ref<EntityStore>` | `getInitiator()` / `setInitiator()` | Reference a l'entite qui a cause l'evenement |
| `set` | `int` | `getSet()` / `setSet()` | L'identifiant de l'ensemble d'evenements pour le filtrage |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getPosition` | `@Nonnull public Vector3d getPosition()` | Retourne le vecteur de position (mutable pour la reutilisation) |
| `setPosition` | `public void setPosition(double x, double y, double z)` | Definit les coordonnees de position de l'evenement |
| `getInitiator` | `public Ref<EntityStore> getInitiator()` | Retourne l'entite qui a initie l'evenement |
| `setInitiator` | `public void setInitiator(Ref<EntityStore> initiator)` | Definit la reference de l'entite initiatrice |
| `getSet` | `public int getSet()` | Retourne l'identifiant de l'ensemble d'evenements |
| `setSet` | `public void setSet(int set)` | Definit l'identifiant de l'ensemble d'evenements |

## Patron de conception

EventNotification utilise le pooling d'objets pour la performance. Une seule instance est reutilisee a travers plusieurs evenements plutot que de creer de nouveaux objets:

```java
// Dans la classe de base EventView
protected final NotificationType reusableEventNotification;

// Reutilise pendant le traitement des evenements
protected void onEvent(int senderTypeId, double x, double y, double z, ...) {
    this.reusableEventNotification.setPosition(x, y, z);
    this.reusableEventNotification.setInitiator(initiator);
    // Traiter l'evenement...
}
```

## Exemple d'utilisation

```java
// Acceder aux donnees de notification d'evenement dans le callback du PNJ
public void onEventReceived(NPCEntity npc, EntityEventType type, EventNotification notification) {
    // Obtenir la position de l'evenement
    Vector3d eventPos = notification.getPosition();

    // Obtenir l'entite qui a cause l'evenement
    Ref<EntityStore> initiator = notification.getInitiator();

    // Calculer la distance du PNJ a l'evenement
    Vector3d npcPos = npc.getPosition();
    double distance = npcPos.distance(eventPos);

    // Reagir en fonction de la distance
    if (distance < 10.0) {
        // L'evenement est proche - alerte haute
        npc.setAlertLevel(AlertLevel.HIGH);
        npc.lookAt(eventPos);
    } else if (distance < 30.0) {
        // L'evenement est a moyenne portee - enqueter
        npc.setAlertLevel(AlertLevel.MEDIUM);
        npc.moveTo(eventPos);
    }
}

// Utiliser la reference de l'initiateur
public void processEvent(EventNotification notification, ComponentAccessor<EntityStore> accessor) {
    Ref<EntityStore> initiator = notification.getInitiator();

    if (initiator != null && initiator.isValid()) {
        // Obtenir les composants de l'entite initiatrice
        Player player = accessor.getComponent(initiator, Player.getComponentType());
        if (player != null) {
            // L'evenement a ete cause par un joueur
            handlePlayerEvent(player, notification);
        }
    }
}
```

## Cas d'utilisation courants

- Determiner l'emplacement de l'evenement pour la navigation des PNJ
- Identifier la source des menaces pour le ciblage de l'IA
- Filtrer les evenements par ensemble pour des comportements specifiques des PNJ
- Calculer les distances pour des reponses basees sur la portee
- Implementer des comportements d'enquete
- Creer des systemes de propagation d'alerte

## Classe etendue: EntityEventNotification

Pour les evenements d'entite, `EntityEventNotification` etend cette classe avec des informations de troupeau:

```java
public class EntityEventNotification extends EventNotification {
   private Ref<EntityStore> flockReference;

   public Ref<EntityStore> getFlockReference();
   public void setFlockReference(Ref<EntityStore> flockReference);
}
```

Cela permet des comportements de meute/troupeau ou un groupe entier peut repondre aux evenements affectant un membre.

## Types lies

- [EntityEventNotification](./entity-event-notification) - Notification etendue pour les evenements d'entite
- [EntityEventView](./entity-event-view) - Vue qui traite les evenements d'entite
- [BlockEventView](./block-event-view) - Vue qui traite les evenements de bloc
- [EventView](./event-view) - Classe de base qui gere les notifications

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/EventNotification.java:7`
