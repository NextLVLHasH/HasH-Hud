---
id: player-setup-disconnect-event
title: PlayerSetupDisconnectEvent
sidebar_label: PlayerSetupDisconnectEvent
---

# PlayerSetupDisconnectEvent

Déclenché lorsqu'un joueur se deconnecte pendant la phase de configuration de connexion, avant d'etre complètement connecte au serveur. Cela se produit quand une tentative de connexion echoue ou est annulee pendant le processus initial d'authentification et de configuration.

## Informations sur l'evenement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerSetupDisconnectEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerSetupDisconnectEvent.java:9` |

## Declaration

```java
public class PlayerSetupDisconnectEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `username` | `String` | `getUsername()` | Le nom d'utilisateur du joueur qui se deconnecte |
| `uuid` | `UUID` | `getUuid()` | L'UUID du joueur qui se deconnecte |
| `auth` | `PlayerAuthentication` | `getAuth()` | Les informations d'authentification du joueur |
| `disconnectReason` | `PacketHandler.DisconnectReason` | `getDisconnectReason()` | La raison de la deconnexion |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getUsername` | `public String getUsername()` | Retourne le nom d'utilisateur du joueur |
| `getUuid` | `public UUID getUuid()` | Retourne l'UUID du joueur |
| `getAuth` | `public PlayerAuthentication getAuth()` | Retourne les informations d'authentification |
| `getDisconnectReason` | `public PacketHandler.DisconnectReason getDisconnectReason()` | Retourne la raison de la deconnexion du joueur |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les deconnexions pendant la configuration
eventBus.register(PlayerSetupDisconnectEvent.class, event -> {
    String username = event.getUsername();
    UUID uuid = event.getUuid();
    PacketHandler.DisconnectReason reason = event.getDisconnectReason();

    // Journaliser la tentative de connexion echouee
    logger.info("Player " + username + " failed to connect: " + reason);

    // Suivre les connexions echouees pour la securite
    trackFailedConnection(uuid, reason);
});

// Surveiller les attaques potentielles
eventBus.register(PlayerSetupDisconnectEvent.class, event -> {
    PacketHandler.DisconnectReason reason = event.getDisconnectReason();

    // Verifier les activites suspectes
    if (reason == PacketHandler.DisconnectReason.AUTHENTICATION_FAILED) {
        incrementFailedAuthCount(event.getUuid());

        // Limiter le taux apres trop d'echecs
        if (getFailedAuthCount(event.getUuid()) > 5) {
            temporarilyBlockUuid(event.getUuid());
        }
    }
});

// Analyses et rapports
eventBus.register(PlayerSetupDisconnectEvent.class, event -> {
    // Enregistrer les statistiques de connexion
    analytics.recordConnectionFailure(
        event.getUsername(),
        event.getUuid(),
        event.getDisconnectReason()
    );
});
```

## Cas d'utilisation courants

- Journalisation des tentatives de connexion echouees
- Surveillance de la securite et detection d'intrusion
- Analyses et statistiques de connexion
- Debogage des problemes d'authentification
- Suivi des echecs de redirection/transfert de serveur
- Limitation du taux basee sur les connexions echouees

## Événements lies

- [PlayerSetupConnectEvent](./player-setup-connect-event) - Déclenché pendant une configuration de connexion reussie
- [PlayerConnectEvent](./player-connect-event) - Déclenché quand un joueur se connecte complètement
- [PlayerDisconnectEvent](./player-disconnect-event) - Déclenché quand un joueur connecte se deconnecte

## Notes

Cet evenement est spécifique aux deconnexions qui se produisent pendant la phase de configuration. Il n'est PAS déclenché quand des joueurs complètement connectes se deconnectent - utilisez [PlayerDisconnectEvent](./player-disconnect-event) pour cela.

Les raisons courantes de deconnexion pendant la configuration incluent :
- Echecs d'authentification
- Serveur plein (expulse avant la connexion)
- Rejets de liste blanche
- Application des bannissements
- Delais d'expiration de connexion
- Transferts de serveur (redirections vers un autre serveur)

Comme cet evenement n'est pas annulable, il est principalement utilise a des fins de journalisation et de surveillance.

## Détails internes

### Chaîne de traitement de l'événement

```
Le joueur commence à se connecter
        ↓
SetupPacketHandler gère la phase de configuration
        ↓
Le joueur se déconnecte pendant la configuration (abandon, timeout, échec auth)
        ↓
SetupPacketHandler.closed() est appelé
        ↓
PlayerSetupDisconnectEvent est dispatché
        ↓
Les listeners reçoivent l'événement (informatif uniquement)
```

### Où l'événement est déclenché

L'événement est déclenché dans la méthode `SetupPacketHandler.closed()` :

```java
// Fichier: SetupPacketHandler.java:210-217
@Override
public void closed(ChannelHandlerContext ctx) {
   super.closed(ctx);
   IEventDispatcher<PlayerSetupDisconnectEvent, PlayerSetupDisconnectEvent> dispatcher = HytaleServer.get()
      .getEventBus()
      .dispatchFor(PlayerSetupDisconnectEvent.class);
   if (dispatcher.hasListener()) {
      dispatcher.dispatch(new PlayerSetupDisconnectEvent(this.username, this.uuid, this.auth, this.disconnectReason));
   }
}
```

### Hiérarchie de classes

```
PlayerSetupDisconnectEvent
    └── implements IEvent<Void>
            └── extends IBaseEvent<Void>
```

### Structure de DisconnectReason

La classe `PacketHandler.DisconnectReason` contient :

```java
public static class DisconnectReason {
   @Nullable private String serverDisconnectReason;  // Défini quand le serveur initie la déconnexion
   @Nullable private DisconnectType clientDisconnectType;  // Défini quand le client envoie la déconnexion

   public String getServerDisconnectReason();
   public void setServerDisconnectReason(String serverDisconnectReason);
   public DisconnectType getClientDisconnectType();
   public void setClientDisconnectType(DisconnectType clientDisconnectType);
}
```

## Test

> **Testé :** 17 janvier 2026 - Vérifié avec le plugin doc-test (l'événement se déclenche correctement)

Pour tester cet événement :
1. Exécutez `/doctest test-player-setup-disconnect-event` sur le serveur
2. Faites connecter un joueur au serveur
3. Déconnectez-vous **pendant** l'écran de chargement (avant d'entrer dans le monde)
4. Vérifiez la console du serveur pour les détails de l'événement

**Note :** Cet événement est difficile à déclencher manuellement car la fenêtre de la phase de configuration est très courte. L'événement se déclenche entre `PlayerSetupConnectEvent` et `PlayerConnectEvent`.

Exemple de log serveur quand l'événement se déclenche :
```
[INFO] [TestLogger] [DocTest] Player Event: PlayerSetupDisconnectEvent | Player: Username
[INFO] [EventTracker] [DocTest] Event fired: PlayerSetupDisconnectEvent
```

## Référence source

> **Dernière mise à jour :** 17 janvier 2026 - Testé et vérifié. Ajout des détails internes depuis le code source décompilé.

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerSetupDisconnectEvent.java:9`
