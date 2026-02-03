---
id: entity-event-notification
title: EntityEventNotification
sidebar_label: EntityEventNotification
---

# EntityEventNotification

Une classe de notification d'evenement etendue qui ajoute des informations de reference de troupeau/groupe pour les evenements d'entite. Cette classe permet des comportements de meute ou un groupe entier de PNJ peut coordonner leur reponse aux evenements affectant les membres du groupe.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.EntityEventNotification` |
| **Classe parente** | `EventNotification` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/EntityEventNotification.java:6` |

## Declaration

```java
public class EntityEventNotification extends EventNotification {
   private Ref<EntityStore> flockReference;

   public EntityEventNotification() {
   }
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `flockReference` | `Ref<EntityStore>` | `getFlockReference()` / `setFlockReference()` | Reference au troupeau/groupe auquel l'entite affectee appartient |

## Champs herites

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `position` | `Vector3d` | `getPosition()` | La position 3D ou l'evenement s'est produit |
| `initiator` | `Ref<EntityStore>` | `getInitiator()` | Reference a l'entite qui a cause l'evenement |
| `set` | `int` | `getSet()` | L'identifiant de l'ensemble d'evenements pour le filtrage |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getFlockReference` | `public Ref<EntityStore> getFlockReference()` | Retourne la reference du troupeau de l'entite affectee |
| `setFlockReference` | `public void setFlockReference(Ref<EntityStore> flockReference)` | Definit la reference du troupeau |

## Methodes heritees

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getPosition` | `@Nonnull public Vector3d getPosition()` | Retourne la position de l'evenement |
| `setPosition` | `public void setPosition(double x, double y, double z)` | Definit la position de l'evenement |
| `getInitiator` | `public Ref<EntityStore> getInitiator()` | Retourne l'entite initiatrice |
| `setInitiator` | `public void setInitiator(Ref<EntityStore> initiator)` | Definit l'entite initiatrice |

## Integration avec les troupeaux

La reference de troupeau est definie pendant le traitement des evenements dans `EntityEventView`:

```java
protected void onEvent(int senderTypeId, double x, double y, double z,
                       Ref<EntityStore> initiator, Ref<EntityStore> skip,
                       ComponentAccessor<EntityStore> componentAccessor, EntityEventType type) {
    // Obtenir l'appartenance au troupeau de l'entite affectee
    FlockMembership membership = componentAccessor.getComponent(skip, FlockMembership.getComponentType());
    Ref<EntityStore> flockReference = membership != null ? membership.getFlockRef() : null;

    // Definir la reference du troupeau sur la notification
    this.reusableEventNotification.setFlockReference(flockReference);

    // Traiter l'evenement
    super.onEvent(senderTypeId, x, y, z, initiator, skip, componentAccessor, type);
}
```

## Exemple d'utilisation

```java
// Gerer les evenements d'entite avec conscience du troupeau
public void onEntityEvent(NPCEntity npc, EntityEventType type, EntityEventNotification notification) {
    // Obtenir les infos de base de l'evenement
    Vector3d eventPos = notification.getPosition();
    Ref<EntityStore> initiator = notification.getInitiator();

    // Verifier si cela affecte un membre du troupeau
    Ref<EntityStore> flockRef = notification.getFlockReference();

    if (flockRef != null && flockRef.isValid()) {
        // L'evenement affecte un membre d'un troupeau
        if (type == EntityEventType.DAMAGE) {
            // Alerter tout le troupeau de la menace
            alertFlock(flockRef, initiator, eventPos);
        } else if (type == EntityEventType.DEATH) {
            // Un membre du troupeau est mort - mettre a jour le comportement du groupe
            onFlockMemberDeath(flockRef, eventPos);
        }
    }
}

// Coordonner la reponse du troupeau aux menaces
public void alertFlock(Ref<EntityStore> flockRef, Ref<EntityStore> threat, Vector3d position) {
    FlockComponent flock = getFlockComponent(flockRef);

    for (Ref<EntityStore> member : flock.getMembers()) {
        NPCEntity memberNpc = getNpcEntity(member);
        if (memberNpc != null) {
            // Tous les membres du troupeau deviennent conscients de la menace
            memberNpc.setThreat(threat);
            memberNpc.setAlertLevel(AlertLevel.HIGH);
        }
    }
}

// Verifier si le PNJ est dans le meme troupeau que l'entite affectee
public boolean isSameFlockEvent(NPCEntity npc, EntityEventNotification notification) {
    Ref<EntityStore> eventFlockRef = notification.getFlockReference();
    Ref<EntityStore> npcFlockRef = npc.getFlockReference();

    if (eventFlockRef == null || npcFlockRef == null) {
        return false;
    }

    return eventFlockRef.equals(npcFlockRef);
}
```

## Cas d'utilisation courants

- Implementer un comportement de meute/troupeau ou les groupes reagissent ensemble
- Creer une IA de meute de loups ou attaquer l'un alerte la meute
- Construire des PNJ tribaux qui defendent les membres du groupe
- Implementer un combat de groupe coordonne
- Creer des comportements de groupe pour les oiseaux ou les poissons
- Construire des patrouilles de gardes qui partagent les informations sur les menaces
- Implementer des comportements de deuil ou de retraite lors de la mort d'un membre

## Exemples de comportement de meute

### Alerte sur degats
Lorsqu'un membre de la meute subit des degats, alerter les membres de la meute a proximite de la menace.

### Attaque coordonnee
Lorsqu'un membre de la meute engage le combat, les membres a proximite rejoignent.

### Retraite sur mort
Lorsqu'un membre de la meute meurt, les membres survivants peuvent fuir ou devenir enrages.

### Enquete de groupe
Lorsqu'un membre de la meute detecte quelque chose, le groupe enquete ensemble.

## Types lies

- [EventNotification](./event-notification) - Classe de notification de base
- [EntityEventView](./entity-event-view) - Vue qui cree ces notifications
- [EntityEventType](./entity-event-type) - Types d'evenements d'entite

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/EntityEventNotification.java:6`
