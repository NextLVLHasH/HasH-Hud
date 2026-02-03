---
id: shutdown-event
title: ShutdownEvent
sidebar_label: ShutdownEvent
---

# ShutdownEvent

L'événement `ShutdownEvent` est déclenché lorsque le serveur Hytale commence sa sequence d'arret. Cet événement permet aux plugins d'effectuer des operations de nettoyage et de sauvegarder les donnees avant l'arret du serveur. L'événement inclut des constantes de priorite qui definissent l'ordre dans lequel les operations d'arret integrees se produisent.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ShutdownEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/ShutdownEvent.java:6` |

## Declaration

```java
public class ShutdownEvent implements IEvent<Void> {
    public static final short DISCONNECT_PLAYERS = -48;
    public static final short UNBIND_LISTENERS = -40;
    public static final short SHUTDOWN_WORLDS = -32;

    public ShutdownEvent() {
    }

    @Nonnull
    @Override
    public String toString() {
        return "ShutdownEvent{}";
    }
}
```

## Constantes

Le `ShutdownEvent` definit des constantes de priorite qui indiquent quand des operations d'arret specifiques se produisent. Celles-ci peuvent etre utilisees pour planifier les gestionnaires d'arret de votre plugin au moment approprie par rapport aux operations integrees du serveur.

| Constante | Valeur | Description |
|-----------|--------|-------------|
| `DISCONNECT_PLAYERS` | `-48` | Priorite a laquelle tous les joueurs connectes sont deconnectes du serveur. Les gestionnaires enregistres avant cette priorite peuvent encore communiquer avec les joueurs. |
| `UNBIND_LISTENERS` | `-40` | Priorite a laquelle les ecouteurs reseau sont desactives. Apres ce point, aucune nouvelle connexion ne peut etre acceptee. |
| `SHUTDOWN_WORLDS` | `-32` | Priorite a laquelle les mondes sont arretes et sauvegardes. Enregistrez-vous avant cela pour effectuer des operations liees aux mondes. |

### Référence de l'ordre des priorites

Le tableau suivant montre comment les constantes d'arret se rapportent aux valeurs standard de `EventPriority` :

| Niveau de priorite | Valeur | Position relative |
|--------------------|--------|-------------------|
| `EventPriority.FIRST` | `-21844` | S'execute en premier (avant les constantes d'arret) |
| **`DISCONNECT_PLAYERS`** | **`-48`** | **Deconnecte tous les joueurs** |
| **`UNBIND_LISTENERS`** | **`-40`** | **Arrete d'accepter les connexions** |
| **`SHUTDOWN_WORLDS`** | **`-32`** | **Sauvegarde et arrete les mondes** |
| `EventPriority.EARLY` | `-10922` | Priorite anticipee (apres l'arret) |
| `EventPriority.NORMAL` | `0` | Priorite par defaut |
| `EventPriority.LATE` | `10922` | Priorite tardive |
| `EventPriority.LAST` | `21844` | S'execute en dernier |

## Champs

Cet événement n'a pas de champs au-dela des constantes statiques. Il sert de signal indiquant que le processus d'arret du serveur a commence.

## Exemple d'utilisation

### Gestionnaire d'arret basique

```java
import com.hypixel.hytale.server.core.event.events.ShutdownEvent;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class MyPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Register for shutdown with default priority
        eventBus.register(ShutdownEvent.class, this::onServerShutdown);
    }

    private void onServerShutdown(ShutdownEvent event) {
        getLogger().info("Server is shutting down - saving plugin data...");
        savePluginData();
        closeConnections();
    }
}
```

### Utilisation des constantes de priorite

```java
import com.hypixel.hytale.server.core.event.events.ShutdownEvent;
import com.hypixel.hytale.event.EventBus;

public class AdvancedPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Run BEFORE players are disconnected (to send goodbye messages)
        eventBus.register(
            (short)(ShutdownEvent.DISCONNECT_PLAYERS - 1),
            ShutdownEvent.class,
            null,
            this::notifyPlayers
        );

        // Run AFTER players disconnect but BEFORE worlds shutdown
        eventBus.register(
            (short)(ShutdownEvent.SHUTDOWN_WORLDS - 1),
            ShutdownEvent.class,
            null,
            this::saveWorldData
        );

        // Run AFTER worlds shutdown for final cleanup
        eventBus.register(
            (short)(ShutdownEvent.SHUTDOWN_WORLDS + 1),
            ShutdownEvent.class,
            null,
            this::finalCleanup
        );
    }

    private void notifyPlayers(ShutdownEvent event) {
        // Broadcast message to all players before they're disconnected
        getServer().broadcastMessage("Server is shutting down! Goodbye!");
    }

    private void saveWorldData(ShutdownEvent event) {
        // Save any world-specific plugin data while worlds still exist
        for (World world : getServer().getWorlds()) {
            saveWorldMetadata(world);
        }
    }

    private void finalCleanup(ShutdownEvent event) {
        // Perform final cleanup after everything else
        closeDatabase();
        flushLogs();
    }
}
```

### Nettoyage gracieux des ressources

```java
import com.hypixel.hytale.server.core.event.events.ShutdownEvent;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class DatabasePlugin extends PluginBase {

    private DatabaseConnection database;

    @Override
    public void onEnable(EventBus eventBus) {
        database = new DatabaseConnection();

        // Save pending data before players disconnect
        eventBus.register(
            (short)(ShutdownEvent.DISCONNECT_PLAYERS - 10),
            ShutdownEvent.class,
            null,
            event -> flushPendingPlayerData()
        );

        // Close database connection at the very end
        eventBus.register(
            EventPriority.LAST,
            ShutdownEvent.class,
            null,
            event -> database.close()
        );
    }

    private void flushPendingPlayerData() {
        // Ensure all player data is saved before disconnect
        database.flushPendingWrites();
    }
}
```

## Quand cet événement est déclenché

Le `ShutdownEvent` est déclenché lorsque le serveur commence sa sequence d'arret gracieux. Cela se produit :

1. Lorsqu'un administrateur emet une commande d'arret
2. Lorsque le serveur recoit un signal d'arret
3. Lors de la terminaison gracieuse du processus serveur

La sequence d'arret suit cet ordre :

1. `ShutdownEvent` est distribue
2. Les gestionnaires a la priorite `DISCONNECT_PLAYERS` (-48) deconnectent tous les joueurs
3. Les gestionnaires a la priorite `UNBIND_LISTENERS` (-40) arretent les ecouteurs reseau
4. Les gestionnaires a la priorite `SHUTDOWN_WORLDS` (-32) sauvegardent et dechargent les mondes
5. Les gestionnaires restants s'executent dans l'ordre de priorite
6. Le processus serveur se termine

## Bonnes pratiques

1. **Choisissez la priorite appropriee** : Utilisez les constantes pour comprendre quand votre gestionnaire doit s'executer par rapport aux operations integrees.

2. **Gardez les gestionnaires rapides** : L'arret doit etre rapide. Evitez les operations de longue duree.

3. **Gerez les exceptions gracieusement** : Les exceptions dans les gestionnaires d'arret peuvent empecher le nettoyage correct d'autres systemes.

4. **Sauvegardez les donnees critiques tot** : Enregistrez les gestionnaires avant `SHUTDOWN_WORLDS` pour vous assurer que les donnees sont sauvegardees pendant que les mondes sont accessibles.

5. **Fermez les connexions externes en dernier** : Les connexions a la base de donnees et au reseau doivent etre fermees a `EventPriority.LAST` pour s'assurer que toutes les donnees sont d'abord videes.

## Événements associes

| Événement | Description |
|-----------|-------------|
| [BootEvent](./boot-event) | Déclenché lorsque le serveur commence a demarrer |
| [PluginSetupEvent](./plugin-setup-event) | Déclenché lors de la configuration d'un plugin individuel |
| [RemoveWorldEvent](/docs/fr/modding/plugins/events/world/remove-world-event) | Déclenché lorsque des mondes individuels sont supprimes |

## Référence source

- **Package** : `com.hypixel.hytale.server.core.event.events`
- **Hierarchie** : `ShutdownEvent` -> `IEvent<Void>` -> `IBaseEvent<Void>`
- **Systeme d'événements** : Événement synchrone standard distribue via `EventBus`
