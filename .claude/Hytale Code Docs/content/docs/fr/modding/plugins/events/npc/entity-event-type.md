---
id: entity-event-type
title: EntityEventType
sidebar_label: EntityEventType
---

# EntityEventType

Une enumeration qui definit les types d'evenements lies aux entites auxquels les PNJ peuvent ecouter et reagir. Ces types d'evenements sont utilises par le systeme de tableau noir des PNJ pour declencher des comportements d'IA lorsque des interactions d'entites specifiques se produisent.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.entity.EntityEventType` |
| **Type** | `enum` |
| **Implemente** | `Supplier<String>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/entity/EntityEventType.java:5` |

## Declaration

```java
public enum EntityEventType implements Supplier<String> {
   DAMAGE("On taking damage"),
   DEATH("On dying"),
   INTERACTION("On use interaction");

   public static final EntityEventType[] VALUES = values();
   private final String description;
```

## Valeurs de l'enumeration

| Valeur | Description | Condition de declenchement |
|--------|-------------|---------------------------|
| `DAMAGE` | "En recevant des degats" | Declenche lorsqu'une entite recoit des degats de n'importe quelle source |
| `DEATH` | "En mourant" | Declenche lorsqu'une entite meurt |
| `INTERACTION` | "Lors d'une interaction d'utilisation" | Declenche lorsqu'un joueur utilise l'action d'interaction sur une entite |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `VALUES` | `EntityEventType[]` | (statique) | Tableau cache de toutes les valeurs enum pour l'iteration |
| `description` | `String` | `get()` | Description lisible du type d'evenement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `get` | `public String get()` | Retourne la description lisible de ce type d'evenement |
| `values` | `public static EntityEventType[] values()` | Retourne toutes les valeurs enum (methode Java enum standard) |
| `valueOf` | `public static EntityEventType valueOf(String name)` | Retourne la constante enum avec le nom specifie |

## Exemple d'utilisation

```java
// Parcourir tous les types d'evenements d'entite
for (EntityEventType type : EntityEventType.VALUES) {
    logger.info("Type d'evenement: " + type.name() + " - " + type.get());
}

// Verifier un type d'evenement specifique
public void handleEntityEvent(EntityEventType eventType, Entity entity) {
    switch (eventType) {
        case DAMAGE:
            // Gerer l'evenement de degats - le PNJ a ete attaque
            onNpcDamaged(entity);
            break;
        case DEATH:
            // Gerer l'evenement de mort - le PNJ est mort
            onNpcDeath(entity);
            break;
        case INTERACTION:
            // Gerer l'interaction - le joueur a interagi avec le PNJ
            onNpcInteraction(entity);
            break;
    }
}

// Enregistrer un PNJ pour des types d'evenements specifiques
public void setupNpcEventListeners(NPCEntity npc) {
    // Faire reagir le PNJ aux degats
    npc.registerForEvent(EntityEventType.DAMAGE, this::onDamageReceived);

    // Faire reagir le PNJ aux morts a proximite
    npc.registerForEvent(EntityEventType.DEATH, this::onNearbyDeath);
}
```

## Cas d'utilisation courants

- Configurer les reponses d'IA des PNJ aux evenements de combat
- Mettre en place des systemes d'alerte lorsque les PNJ subissent des degats
- Declencher des animations de mort ou des largages de butin
- Implementer des dialogues ou des interactions de quete
- Creer des PNJ gardes qui reagissent aux attaques
- Construire une IA de compagnon qui reagit aux interactions du joueur
- Implementer des comportements de meute de monstres (aggro de groupe sur degats)

## Integration avec EntityEventView

EntityEventType est utilise par `EntityEventView` pour enregistrer et dispatcher les evenements d'entite aux PNJ en ecoute:

```java
// EntityEventView traite ces evenements
public class EntityEventView extends EventView<...> {
    public EntityEventView(@Nonnull World world) {
        // Enregistrer les handlers pour chaque type d'evenement
        for (EntityEventType eventType : EntityEventType.VALUES) {
            this.entityMapsByEventType.put(eventType, new EventTypeRegistration<>(...));
        }
    }
}
```

## Types lies

- [BlockEventType](./block-event-type) - Enumeration similaire pour les evenements lies aux blocs
- [EntityEventView](./entity-event-view) - Vue qui traite les evenements d'entite
- [EventNotification](./event-notification) - Classe de donnees pour les notifications d'evenements

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/entity/EntityEventType.java:5`
