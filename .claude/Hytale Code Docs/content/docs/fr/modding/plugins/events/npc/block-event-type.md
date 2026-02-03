---
id: block-event-type
title: BlockEventType
sidebar_label: BlockEventType
---

# BlockEventType

Une enumeration qui definit les types d'evenements lies aux blocs auxquels les PNJ peuvent ecouter et reagir. Ces types d'evenements sont utilises par le systeme de tableau noir des PNJ pour declencher des comportements d'IA lorsque des interactions de blocs specifiques se produisent dans le monde.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.blackboard.view.event.block.BlockEventType` |
| **Type** | `enum` |
| **Implemente** | `Supplier<String>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/block/BlockEventType.java:5` |

## Declaration

```java
public enum BlockEventType implements Supplier<String> {
   DAMAGE("On block damage"),
   DESTRUCTION("On block destruction"),
   INTERACTION("On block use interaction");

   public static final BlockEventType[] VALUES = values();
   private final String description;
```

## Valeurs de l'enumeration

| Valeur | Description | Condition de declenchement |
|--------|-------------|---------------------------|
| `DAMAGE` | "Sur degats de bloc" | Declenche lorsqu'un bloc subit des degats de minage ou d'attaques |
| `DESTRUCTION` | "Sur destruction de bloc" | Declenche lorsqu'un bloc est completement detruit |
| `INTERACTION` | "Sur interaction d'utilisation de bloc" | Declenche lorsqu'un joueur utilise l'action d'interaction sur un bloc |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `VALUES` | `BlockEventType[]` | (statique) | Tableau cache de toutes les valeurs enum pour l'iteration |
| `description` | `String` | `get()` | Description lisible du type d'evenement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `get` | `public String get()` | Retourne la description lisible de ce type d'evenement |
| `values` | `public static BlockEventType[] values()` | Retourne toutes les valeurs enum (methode Java enum standard) |
| `valueOf` | `public static BlockEventType valueOf(String name)` | Retourne la constante enum avec le nom specifie |

## Exemple d'utilisation

```java
// Parcourir tous les types d'evenements de bloc
for (BlockEventType type : BlockEventType.VALUES) {
    logger.info("Type d'evenement de bloc: " + type.name() + " - " + type.get());
}

// Gerer differents evenements de bloc dans l'IA des PNJ
public void handleBlockEvent(BlockEventType eventType, Vector3i position) {
    switch (eventType) {
        case DAMAGE:
            // Le bloc est endommage - le PNJ pourrait enqueter
            investigateBlockDamage(position);
            break;
        case DESTRUCTION:
            // Le bloc a ete detruit - mettre a jour le pathfinding
            onBlockDestroyed(position);
            break;
        case INTERACTION:
            // Le joueur a interagi avec un bloc - le PNJ pourrait reagir
            onBlockInteraction(position);
            break;
    }
}

// Configurer un PNJ pour reagir aux evenements de bloc
public void setupBlockEventListeners(NPCEntity npc) {
    // Faire en sorte que le PNJ garde alerte lorsque certains blocs sont endommages
    npc.registerForBlockEvent(BlockEventType.DAMAGE, "alarm_block", this::onAlarmDamaged);

    // Faire reagir le PNJ lorsque les portes sont utilisees
    npc.registerForBlockEvent(BlockEventType.INTERACTION, "door", this::onDoorUsed);
}
```

## Cas d'utilisation courants

- Creer des PNJ gardes qui reagissent a la destruction de blocs
- Implementer des systemes d'alarme declenches par les degats aux blocs
- Faire reagir les PNJ aux joueurs utilisant des portes ou des interrupteurs
- Construire une IA qui enquete sur les changements environnementaux
- Creer des PNJ qui reagissent a la construction/destruction
- Implementer une IA territoriale qui defend les structures
- Construire des mecaniques de pieges ou de puzzles avec des reponses de PNJ

## Integration avec BlockEventView

BlockEventType est utilise par `BlockEventView` pour enregistrer et dispatcher les evenements de bloc aux PNJ en ecoute:

```java
// BlockEventView traite ces evenements
public class BlockEventView extends EventView<...> {
    public BlockEventView(@Nonnull World world) {
        // Enregistrer les handlers d'evenements pour les interactions des joueurs
        this.eventRegistry.register(PlayerInteractEvent.class, world.getName(), this::onPlayerInteraction);

        // Configurer les enregistrements de types d'evenements
        for (BlockEventType eventType : BlockEventType.VALUES) {
            this.entityMapsByEventType.put(eventType, new EventTypeRegistration<>(...));
        }
    }
}
```

## Types lies

- [EntityEventType](./entity-event-type) - Enumeration similaire pour les evenements lies aux entites
- [BlockEventView](./block-event-view) - Vue qui traite les evenements de bloc
- [EventNotification](./event-notification) - Classe de donnees pour les notifications d'evenements

## Evenements de bloc lies

- [BreakBlockEvent](../block/break-block-event) - Evenement de plugin pour la destruction de bloc
- [DamageBlockEvent](../block/damage-block-event) - Evenement de plugin pour les degats de bloc
- [UseBlockEvent](../block/use-block-event) - Evenement de plugin pour les interactions de bloc

## Reference source

`decompiled/com/hypixel/hytale/server/npc/blackboard/view/event/block/BlockEventType.java:5`
