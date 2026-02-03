---
id: player-connect-event
title: PlayerConnectEvent
sidebar_label: PlayerConnectEvent
---

# PlayerConnectEvent

Déclenché lorsqu'un joueur se connecte avec succès au serveur et est en cours d'initialisation. Cet événement se produit apres que le joueur a termine la phase de configuration (PlayerSetupConnectEvent) et est maintenant entierement connecte.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerConnectEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerConnectEvent.java:12` |

## Declaration

```java
public class PlayerConnectEvent implements IEvent<Void> {
   private final Holder<EntityStore> holder;
   private final PlayerRef playerRef;
   @Nullable
   private World world;

   public PlayerConnectEvent(@Nonnull Holder<EntityStore> holder, @Nonnull PlayerRef playerRef, @Nullable World world) {
      // ...
   }
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `holder` | `Holder<EntityStore>` | `getHolder()` | Le conteneur d'entite contenant le magasin d'entite du joueur |
| `playerRef` | `PlayerRef` | `getPlayerRef()` | Référence vers le joueur qui se connecte |
| `world` | `World` | `getWorld()` | Le monde dans lequel le joueur va apparaitre (nullable, peut etre défini) |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getHolder` | `public Holder<EntityStore> getHolder()` | Retourne le conteneur d'entite pour le joueur qui se connecte |
| `getPlayerRef` | `public PlayerRef getPlayerRef()` | Retourne la reference du joueur qui se connecte |
| `getPlayer` | `@Nullable @Deprecated public Player getPlayer()` | **Obsolete** - Retourne l'objet Player directement (nullable) |
| `getWorld` | `@Nullable public World getWorld()` | Retourne le monde dans lequel le joueur va apparaitre (nullable) |
| `setWorld` | `public void setWorld(@Nullable World world)` | Definit le monde ou le joueur va apparaitre |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

> **Testé** - Ce code a été vérifié avec un plugin fonctionnel.

Puisque `PlayerConnectEvent` implémente `IEvent<Void>`, vous pouvez utiliser la méthode `register()` standard.

```java
// Enregistrer un handler pour quand les joueurs se connectent
eventBus.register(PlayerConnectEvent.class, event -> {
    PlayerRef playerRef = event.getPlayerRef();
    String playerName = playerRef != null ? playerRef.getUsername() : "Unknown";
    String worldName = event.getWorld() != null ? event.getWorld().getName() : "null";

    // Journaliser la connexion
    logger.info("Player connected: " + playerName + " to world: " + worldName);

    // Optionnellement définir un monde d'apparition spécifique
    World lobbyWorld = worldManager.getWorld("lobby");
    if (lobbyWorld != null) {
        event.setWorld(lobbyWorld);
    }
});

// Enregistrer avec une priorite haute pour s'executer avant les autres handlers
eventBus.register(EventPriority.FIRST, PlayerConnectEvent.class, event -> {
    // Traiter la connexion en premier
    Holder<EntityStore> holder = event.getHolder();
    // Initialiser les donnees du joueur
});
```

**Note:** Utilisez `playerRef.getUsername()` pour obtenir le nom du joueur depuis `PlayerRef`.

## Cas d'utilisation courants

- Accueillir les joueurs avec un message personnalise
- Configurer les donnees et l'etat initial du joueur
- Rediriger les joueurs vers des mondes spécifiques a la connexion
- Initialiser des plugins ou fonctionnalites spécifiques au joueur
- Journaliser les connexions des joueurs pour les analyses
- Charger les donnees sauvegardees du joueur depuis le stockage

## Événements lies

- [PlayerSetupConnectEvent](./player-setup-connect-event) - Déclenché plus tot pendant la configuration de connexion, avant cet événement
- [PlayerDisconnectEvent](./player-disconnect-event) - Déclenché quand un joueur se deconnecte
- [PlayerReadyEvent](./player-ready-event) - Déclenché quand le client du joueur est entierement pret
- [AddPlayerToWorldEvent](./add-player-to-world-event) - Déclenché quand le joueur est ajoute a un monde

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerConnectEvent.java:12`
