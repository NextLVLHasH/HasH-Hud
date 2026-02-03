---
id: world-path-changed-event
title: WorldPathChangedEvent
sidebar_label: WorldPathChangedEvent
---

# WorldPathChangedEvent

Declenche lorsque la configuration du chemin du monde change. Cet evenement est utile pour suivre les mises a jour des chemins de navigation et les changements de structure du monde qui affectent la facon dont les entites naviguent dans le monde.

> **Evenement interne :** Ceci est un evenement serveur interne qui se declenche uniquement quand `WorldPathConfig.putPath()` est appele par le systeme de pathfinding. Il ne peut pas etre declenche manuellement par des actions de gameplay.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.path.WorldPathChangedEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/path/WorldPathChangedEvent.java` |

## Declaration

```java
public class WorldPathChangedEvent implements IEvent<Void> {
   private WorldPath worldPath;

   public WorldPathChangedEvent(WorldPath worldPath) {
      Objects.requireNonNull(worldPath, "World path must not be null in an event");
      this.worldPath = worldPath;
   }

   public WorldPath getWorldPath() {
      return this.worldPath;
   }

   @Nonnull
   @Override
   public String toString() {
      return "WorldPathChangedEvent{worldPath=" + this.worldPath + "}";
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `worldPath` | `WorldPath` | `getWorldPath()` | L'objet chemin du monde qui a change |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getWorldPath` | `public WorldPath getWorldPath()` | Retourne le chemin du monde qui a ete modifie |

## Validation

Le constructeur de l'evenement valide que :
- `worldPath` ne doit pas etre null - lance `NullPointerException` avec le message "World path must not be null in an event"

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.path.WorldPathChangedEvent;
import com.hypixel.hytale.server.core.universe.world.path.WorldPath;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class PathfindingPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(WorldPathChangedEvent.class, this::onWorldPathChanged, EventPriority.NORMAL);
    }

    private void onWorldPathChanged(WorldPathChangedEvent event) {
        WorldPath worldPath = event.getWorldPath();

        // Reagir aux changements de chemin
        getLogger().info("Chemin du monde change: " + worldPath.toString());

        // Mettre a jour les donnees de pathfinding en cache
        invalidatePathfindingCache(worldPath);

        // Notifier les PNJ qui pourraient avoir besoin de recalculer leurs routes
        notifyAffectedEntities(worldPath);
    }

    private void invalidatePathfindingCache(WorldPath worldPath) {
        // Vider les chemins en cache qui pourraient etre affectes par le changement
    }

    private void notifyAffectedEntities(WorldPath worldPath) {
        // Mettre a jour les entites dont la navigation pourrait etre affectee
    }
}
```

## Quand cet evenement se declenche

Le `WorldPathChangedEvent` est declenche **exclusivement** depuis `WorldPathConfig.putPath()` quand un nouveau `WorldPath` est ajoute ou qu'un existant est mis a jour dans la configuration des chemins du monde.

```java
// Depuis WorldPathConfig.java
public WorldPath putPath(@Nonnull WorldPath worldPath) {
   Objects.requireNonNull(worldPath);
   IEventDispatcher<WorldPathChangedEvent, WorldPathChangedEvent> dispatcher =
      HytaleServer.get().getEventBus().dispatchFor(WorldPathChangedEvent.class);
   if (dispatcher.hasListener()) {
      dispatcher.dispatch(new WorldPathChangedEvent(worldPath));
   }
   return this.paths.put(worldPath.getName(), worldPath);
}
```

**Important :** Cet evenement ne se declenche que s'il y a au moins un listener enregistre (`dispatcher.hasListener()`).

L'evenement se declenche **avant** que le chemin soit stocke dans la map de configuration, permettant aux gestionnaires de :
- Inspecter le nouveau chemin ou celui mis a jour
- Mettre a jour les donnees de pathfinding en cache
- Journaliser les changements de navigation
- Declencher des systemes dependants

## Comprendre WorldPath

L'objet `WorldPath` represente les informations de chemin de navigation dans le monde, qui peuvent inclure :
- Points de passage et connexions
- Donnees de maillage de navigation
- Contraintes et couts de chemin
- Informations d'accessibilite

## Cas d'utilisation

- **Pathfinding personnalise** : S'integrer avec des systemes de navigation personnalises
- **Invalidation de cache** : Vider les caches de pathfinding obsoletes
- **Comportement des PNJ** : Mettre a jour la navigation des PNJ quand les chemins changent
- **Debogage** : Suivre les changements de chemin pour le depannage
- **Analytique** : Surveiller les mises a jour de navigation du monde

## Details internes

### Listener connu

Le `NPCPlugin` ecoute cet evenement pour suivre les changements de chemins :

```java
// Depuis NPCPlugin.java
protected void onPathChange(WorldPathChangedEvent event) {
   this.pathChangeRevision.getAndIncrement();
}
```

Cela incremente un compteur de revision utilise pour invalider les caches de pathfinding des PNJ quand les chemins du monde changent.

### Structure de WorldPath

La classe `WorldPath` contient :
- `UUID id` - Identifiant unique du chemin
- `String name` - Nom du chemin
- `List<Transform> waypoints` - Liste des positions de points de passage

## Limitations de test

> **Verifie :** 18 janvier 2026 - Verification structurelle uniquement

Cet evenement **ne peut pas etre declenche manuellement** par le gameplay. C'est un evenement serveur interne qui se declenche uniquement quand :
- Le systeme de pathfinding du serveur ajoute ou met a jour des chemins de navigation
- Un plugin appelle programmatiquement `WorldPathConfig.putPath()`

Pour tester cet evenement, vous devriez :
1. Enregistrer un listener pour `WorldPathChangedEvent`
2. Attendre que le systeme de pathfinding interne du serveur mette a jour les chemins, OU
3. Creer et ajouter programmatiquement un `WorldPath` a la configuration

```java
// Test programmatique (necessite l'acces a WorldPathConfig)
WorldPath testPath = new WorldPath("test-path", waypointsList);
worldPathConfig.putPath(testPath); // Cela declenchera l'evenement
```

## Evenements lies

- [AddWorldEvent](./add-world-event) - Declenche quand un monde est ajoute
- [StartWorldEvent](./start-world-event) - Declenche quand un monde demarre

## Reference source

- Classe de l'evenement : `com/hypixel/hytale/server/core/universe/world/path/WorldPathChangedEvent.java`
- Lieu de declenchement : `com/hypixel/hytale/server/core/universe/world/path/WorldPathConfig.java` (ligne 51)
