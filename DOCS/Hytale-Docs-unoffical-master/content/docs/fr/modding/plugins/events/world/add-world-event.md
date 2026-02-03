---
id: add-world-event
title: AddWorldEvent
sidebar_label: AddWorldEvent
description: Evenement déclenché lors de l'ajout d'un nouveau monde au serveur
---

# AddWorldEvent

L'événement `AddWorldEvent` est déclenché lorsqu'un nouveau monde est en cours d'ajout a l'univers du serveur. Cet événement permet aux plugins d'intercepter et potentiellement d'annuler l'ajout de mondes, offrant ainsi une logique personnalisee de gestion des mondes.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.AddWorldEvent` |
| **Classe parente** | `WorldEvent` |
| **Implemente** | `ICancellable` |
| **Annulable** | Oui |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/AddWorldEvent.java:7` |

## Declaration

```java
public class AddWorldEvent extends WorldEvent implements ICancellable {
   private boolean cancelled = false;

   public AddWorldEvent(@Nonnull World world) {
      super(world);
   }

   @Nonnull
   @Override
   public String toString() {
      return "AddWorldEvent{cancelled=" + this.cancelled + "} " + super.toString();
   }

   @Override
   public boolean isCancelled() {
      return this.cancelled;
   }

   @Override
   public void setCancelled(boolean cancelled) {
      this.cancelled = cancelled;
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'événement a ete annule |

## Champs herites

De `WorldEvent` :

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `world` | `World` | `getWorld()` | Le monde en cours d'ajout au serveur |

## Méthodes

### isCancelled()

```java
public boolean isCancelled()
```

Retourne si l'événement a ete annule.

**Retourne :** `boolean` - `true` si l'ajout du monde a ete annule, `false` sinon

### setCancelled(boolean)

```java
public void setCancelled(boolean cancelled)
```

Definit si l'événement doit etre annule. Lorsqu'il est annule, le monde ne sera pas ajoute au serveur.

**Parametres :**
- `cancelled` - `true` pour annuler l'ajout du monde, `false` pour l'autoriser

### getWorld()

```java
public World getWorld()
```

Hérité de `WorldEvent`. Retourne le monde qui est en cours d'ajout.

**Retourne :** `World` - L'instance du monde en cours d'ajout au serveur

## Exemple d'utilisation

> **Testé** - Ce code a été vérifié avec un plugin fonctionnel.

Puisque `AddWorldEvent` étend `WorldEvent` qui a un type de clé non-Void, vous devez utiliser `registerGlobal()` pour capturer tous les événements de monde indépendamment de leur clé.

```java
import com.hypixel.hytale.server.core.universe.world.events.AddWorldEvent;
import com.hypixel.hytale.event.EventRegistry;

// Enregistrer un listener global pour contrôler les ajouts de mondes
eventBus.registerGlobal(AddWorldEvent.class, event -> {
    World world = event.getWorld();
    String worldName = world != null ? world.getName() : "Unknown";

    // Journaliser les ajouts de mondes
    logger.info("Monde en cours d'ajout: " + worldName);

    // Exemple: Empêcher l'ajout de mondes avec certains noms
    if (worldName.startsWith("restricted_")) {
        event.setCancelled(true);
        logger.info("Ajout bloqué du monde restreint: " + worldName);
    }
});
```

**Important :** Utiliser `register()` au lieu de `registerGlobal()` ne fonctionnera pas pour cet événement car il a un type de clé non-Void.

## Quand cet événement se déclenche

L'événement `AddWorldEvent` est dispatché lorsque :

1. Un nouveau monde est en cours d'enregistrement auprès du système d'univers du serveur
2. Pendant le démarrage du serveur lorsque les mondes configurés sont chargés
3. Lorsque des plugins créent et ajoutent programmatiquement de nouveaux mondes (via `Universe.addWorld()`)
4. Lorsque la génération dynamique de mondes crée une nouvelle instance de monde

L'événement se déclenche **avant** que le monde soit complètement ajouté à l'univers, permettant aux handlers d'annuler l'opération si nécessaire.

> **Important :** Au moment où cet événement se déclenche, le monde n'est **pas encore complètement initialisé**. L'objet `World` existe mais son `EntityStore` n'est pas encore disponible. Cela signifie que des méthodes comme `world.toString()` peuvent lever une `NullPointerException`. Utilisez `world.getName()` pour accéder de manière sûre au nom du monde.

## Comportement de l'annulation

Lorsque l'événement est annule :
- Le monde ne sera pas ajoute a la liste des mondes du serveur
- Le monde ne sera pas accessible aux joueurs ou aux autres systemes
- Les ressources associees peuvent etre nettoyees selon l'implementation

## Événements associes

- [RemoveWorldEvent](./remove-world-event) - Déclenché lorsqu'un monde est en cours de suppression
- [StartWorldEvent](./start-world-event) - Déclenché lorsqu'un monde demarre apres avoir ete ajoute
- [AllWorldsLoadedEvent](./all-worlds-loaded-event) - Déclenché lorsque tous les mondes configures ont ete charges

## Détails internes

### Où l'événement est déclenché

L'événement est dispatché dans `Universe.makeWorld()` à la ligne 444 :

```java
// Dans Universe.java (méthode makeWorld)
World world = new World(name, savePath, worldConfig);
AddWorldEvent event = HytaleServer.get().getEventBus()
    .dispatchFor(AddWorldEvent.class, name)
    .dispatch(new AddWorldEvent(world));

if (!event.isCancelled() && !HytaleServer.get().isShuttingDown()) {
    // Le monde est ajouté aux maps de l'univers
    this.worlds.putIfAbsent(name.toLowerCase(), world);
    this.worldsByUuid.putIfAbsent(worldConfig.getUuid(), world);
} else {
    throw new WorldLoadCancelledException();
}
```

### Implémentation de l'annulation

Lorsque l'événement est annulé (`setCancelled(true)`) :
1. Le monde n'est **pas** ajouté à la map `Universe.worlds`
2. Le monde n'est **pas** ajouté à la map `Universe.worldsByUuid`
3. Une `WorldLoadCancelledException` est levée
4. La chaîne `CompletableFuture` échoue avec cette exception

### Ordre de dispatch des événements

1. `AddWorldEvent` - Quand le monde est en cours de création (annulable)
2. Initialisation du monde (init, paths, worldgen)
3. `StartWorldEvent` - Quand le monde démarre

## Test

> **Testé :** 18 janvier 2026 - Vérifié avec le plugin doc-test

Pour tester cet événement :

1. Exécutez `/doctest test-add-world-event`
2. La commande va créer un monde de test temporaire
3. Les détails de l'événement seront affichés dans la console du serveur
4. Vérifiez le message "AddWorldEvent fired!"

**Résultats du test :**
- `getWorld()` - Fonctionne correctement, retourne l'objet World
- `getWorld().getName()` - Fonctionne correctement, retourne le nom du monde
- `isCancelled()` - Fonctionne correctement, retourne l'état d'annulation
- `setCancelled(boolean)` - Fonctionne correctement, peut annuler l'ajout du monde
- `world.toString()` - Peut échouer (EntityStore pas encore initialisé)

## Référence source

- **Définition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/AddWorldEvent.java`
- **Classe parente :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/WorldEvent.java`
- **Interface Cancellable :** `decompiled/com/hypixel/hytale/event/ICancellable.java`
- **Lieu de déclenchement :** `decompiled/com/hypixel/hytale/server/core/universe/Universe.java:444`

---

> **Dernière mise à jour :** 18 janvier 2026 - Testé et vérifié. Ajout des détails internes et de la section test.
