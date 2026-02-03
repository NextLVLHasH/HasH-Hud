---
id: entity-remove-event
title: EntityRemoveEvent
sidebar_label: EntityRemoveEvent
---

# EntityRemoveEvent

L'événement `EntityRemoveEvent` est déclenché lorsqu'une entite est en cours de suppression du monde. Cet événement offre aux plugins la possibilite d'effectuer des operations de nettoyage ou de suivre la suppression des entites.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent` |
| **Classe parente** | `EntityEvent<Entity, String>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Type de cle** | `String` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/entity/EntityRemoveEvent.java:6` |

## Declaration

```java
public class EntityRemoveEvent extends EntityEvent<Entity, String> {
    public EntityRemoveEvent(Entity entity) {
        super(entity);
    }

    @Nonnull
    @Override
    public String toString() {
        return "EntityRemoveEvent{} " + super.toString();
    }
}
```

## Classe parente : EntityEvent

Le `EntityRemoveEvent` etend `EntityEvent`, qui fournit un acces a l'entite concernee :

```java
public abstract class EntityEvent<EntityType extends Entity, KeyType> implements IEvent<KeyType> {
    private final EntityType entity;

    public EntityEvent(EntityType entity) {
        this.entity = entity;
    }

    public EntityType getEntity() {
        return this.entity;
    }

    @Nonnull
    @Override
    public String toString() {
        return "EntityEvent{entity=" + this.entity + "}";
    }
}
```

## Champs

| Champ | Type | Description | Accesseur |
|-------|------|-------------|-----------|
| `entity` | `Entity` | L'entite en cours de suppression du monde | `getEntity()` |

## Méthodes

### Héritées de EntityEvent

| Méthode | Type de retour | Description |
|---------|----------------|-------------|
| `getEntity()` | `Entity` | Retourne l'entite en cours de suppression |
| `toString()` | `@Nonnull String` | Retourne une representation textuelle de l'événement |

## Exemple d'utilisation

### Suivi basique de la suppression des entites

```java
import com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent;
import com.hypixel.hytale.event.EventBus;

public class EntityTrackerPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Listen for all entity removal events
        eventBus.registerGlobal(EntityRemoveEvent.class, this::onEntityRemove);
    }

    private void onEntityRemove(EntityRemoveEvent event) {
        Entity entity = event.getEntity();
        getLogger().info("Entity removed: " + entity.getClass().getSimpleName());
    }
}
```

### Suivi des statistiques des entites

```java
import com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class EntityStatsPlugin extends PluginBase {

    private final ConcurrentHashMap<String, AtomicInteger> removalStats = new ConcurrentHashMap<>();

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.registerGlobal(EntityRemoveEvent.class, this::trackRemoval);
    }

    private void trackRemoval(EntityRemoveEvent event) {
        Entity entity = event.getEntity();
        String entityType = entity.getClass().getSimpleName();

        removalStats.computeIfAbsent(entityType, k -> new AtomicInteger(0))
                   .incrementAndGet();
    }

    public int getRemovalCount(String entityType) {
        AtomicInteger count = removalStats.get(entityType);
        return count != null ? count.get() : 0;
    }

    public ConcurrentHashMap<String, AtomicInteger> getAllStats() {
        return new ConcurrentHashMap<>(removalStats);
    }
}
```

### Nettoyage des donnees associees

```java
import com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class EntityDataPlugin extends PluginBase {

    private final ConcurrentHashMap<UUID, CustomEntityData> entityData = new ConcurrentHashMap<>();

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.registerGlobal(EntityRemoveEvent.class, this::cleanupEntityData);
    }

    private void cleanupEntityData(EntityRemoveEvent event) {
        Entity entity = event.getEntity();

        // Get entity UUID if available
        UUID entityId = getEntityUUID(entity);
        if (entityId != null) {
            // Remove associated custom data
            CustomEntityData data = entityData.remove(entityId);
            if (data != null) {
                getLogger().info("Cleaned up data for entity: " + entityId);
                data.dispose();
            }
        }
    }

    public void setEntityData(UUID entityId, CustomEntityData data) {
        entityData.put(entityId, data);
    }

    public CustomEntityData getEntityData(UUID entityId) {
        return entityData.get(entityId);
    }

    private UUID getEntityUUID(Entity entity) {
        // Implementation depends on entity type
        return null; // Placeholder
    }

    private static class CustomEntityData {
        void dispose() {
            // Cleanup resources
        }
    }
}
```

### Gestion de types d'entites spécifiques

```java
import com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent;
import com.hypixel.hytale.event.EventBus;

public class MonsterTrackerPlugin extends PluginBase {

    private int monstersKilled = 0;

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.registerGlobal(EntityRemoveEvent.class, this::onEntityRemove);
    }

    private void onEntityRemove(EntityRemoveEvent event) {
        Entity entity = event.getEntity();

        // Check if the entity is a monster type
        if (isMonster(entity)) {
            monstersKilled++;
            getLogger().info("Monster removed! Total: " + monstersKilled);
        }
    }

    private boolean isMonster(Entity entity) {
        // Check entity type - implementation depends on entity hierarchy
        String typeName = entity.getClass().getSimpleName().toLowerCase();
        return typeName.contains("zombie") ||
               typeName.contains("skeleton") ||
               typeName.contains("trork");
    }

    public int getMonstersKilled() {
        return monstersKilled;
    }
}
```

### Journalisation de la suppression des entites

```java
import com.hypixel.hytale.server.core.event.events.entity.EntityRemoveEvent;
import com.hypixel.hytale.event.EventBus;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EntityLoggerPlugin extends PluginBase {

    private static final DateTimeFormatter FORMATTER =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.registerGlobal(EntityRemoveEvent.class, this::logEntityRemoval);
    }

    private void logEntityRemoval(EntityRemoveEvent event) {
        Entity entity = event.getEntity();
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String entityType = entity.getClass().getSimpleName();

        // Get position if available
        String position = getEntityPosition(entity);

        getLogger().info(String.format("[%s] Entity removed: %s at %s",
            timestamp, entityType, position));
    }

    private String getEntityPosition(Entity entity) {
        // Get position from entity - implementation depends on Entity API
        return "unknown";
    }
}
```

## Quand cet événement est déclenché

Le `EntityRemoveEvent` est déclenché lorsqu'une entite est en cours de suppression du monde. Cela peut se produire en raison de :

1. La mort ou la destruction de l'entite
2. La disparition due a la distance des joueurs
3. La suppression administrative
4. Le dechargement du monde
5. Le dechargement du chunk
6. La transformation de l'entite en un autre type d'entite
7. Les mecaniques de jeu qui suppriment les entites

L'événement est déclenché :
- Apres que la decision de suppression a ete prise
- Avant que l'entite soit complètement supprimee du monde
- Tant que les donnees de l'entite sont encore accessibles

## Notes importantes

1. **Non annulable** : Cet événement ne peut pas etre annule. L'entite sera supprimee quoi qu'il arrive.

2. **Acces pendant la validite** : La reference de l'entite est encore valide pendant l'événement, vous permettant d'acceder a ses proprietes.

3. **Moment du nettoyage** : Utilisez cet événement pour les operations de nettoyage qui doivent se produire lors de la suppression des entites.

4. **Filtrage base sur les cles** : L'événement utilise `String` comme type de cle, qui peut etre utilise pour le filtrage par type d'entite.

## Événements associes

| Evenement | Description |
|-----------|-------------|
| [LivingEntityInventoryChangeEvent](./living-entity-inventory-change-event) | Déclenché lorsque l'inventaire d'une entite vivante change |
| [AddPlayerToWorldEvent](/docs/fr/modding/plugins/events/player/add-player-to-world-event) | Déclenché lorsqu'un joueur est ajoute a un monde |
| [DrainPlayerFromWorldEvent](/docs/fr/modding/plugins/events/player/drain-player-from-world-event) | Déclenché lorsqu'un joueur est retire d'un monde |

## Référence source

- **Package** : `com.hypixel.hytale.server.core.event.events.entity`
- **Hierarchie** : `EntityRemoveEvent` -> `EntityEvent<Entity, String>` -> `IEvent<String>` -> `IBaseEvent<String>`
- **Systeme d'événements** : Evenement synchrone standard distribue via `EventBus`
