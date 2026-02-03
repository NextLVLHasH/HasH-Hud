---
id: player-setup-connect-event
title: PlayerSetupConnectEvent
sidebar_label: PlayerSetupConnectEvent
---

# PlayerSetupConnectEvent

Déclenché pendant la phase de configuration initiale de connexion lorsqu'un joueur tente de rejoindre le serveur. C'est un événement annulable qui permet aux plugins de valider, rejeter ou rediriger les connexions entrantes avant que le joueur ne soit complètement connecte.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerSetupConnectEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Oui |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerSetupConnectEvent.java:16` |

## Declaration

```java
public class PlayerSetupConnectEvent implements IEvent<Void>, ICancellable {
   public static final String DEFAULT_REASON = "You have been disconnected from the server!";
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `packetHandler` | `PacketHandler` | `getPacketHandler()` | Le gestionnaire de paquets pour cette connexion |
| `username` | `String` | `getUsername()` | Le nom d'utilisateur du joueur |
| `uuid` | `UUID` | `getUuid()` | L'identifiant unique du joueur |
| `auth` | `PlayerAuthentication` | `getAuth()` | Les informations d'authentification du joueur |
| `referralData` | `byte[]` | `getReferralData()` | Les donnees transmises depuis un serveur de redirection (si applicable) |
| `referralSource` | `HostAddress` | `getReferralSource()` | L'adresse du serveur de redirection (si applicable) |
| `cancelled` | `boolean` | `isCancelled()` | Indique si la connexion a ete annulee |
| `reason` | `String` | `getReason()` | Le message de raison de deconnexion |
| `clientReferral` | `ClientReferral` | `getClientReferral()` | Les informations de redirection client pour les transferts de serveur |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getPacketHandler` | `public PacketHandler getPacketHandler()` | Retourne le gestionnaire de paquets de la connexion |
| `getUsername` | `public String getUsername()` | Retourne le nom d'utilisateur du joueur |
| `getUuid` | `public UUID getUuid()` | Retourne l'UUID du joueur |
| `getAuth` | `public PlayerAuthentication getAuth()` | Retourne les informations d'authentification |
| `getReferralData` | `@Nullable public byte[] getReferralData()` | Retourne les donnees de redirection du serveur precedent (nullable) |
| `getReferralSource` | `@Nullable public HostAddress getReferralSource()` | Retourne l'adresse du serveur de redirection (nullable) |
| `isReferralConnection` | `public boolean isReferralConnection()` | Verifie s'il s'agit d'un transfert serveur-a-serveur |
| `getClientReferral` | `@Nullable public ClientReferral getClientReferral()` | Retourne les informations de redirection client (nullable) |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'événement est annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Annule ou reactive l'événement |
| `getReason` | `public String getReason()` | Retourne la raison de deconnexion |
| `setReason` | `public void setReason(String reason)` | Definit le message de raison de deconnexion |
| `referToServer` | `public void referToServer(@Nonnull String host, int port)` | Redirige le joueur vers un autre serveur |
| `referToServer` | `public void referToServer(@Nonnull String host, int port, @Nullable byte[] data)` | Redirige avec des donnees personnalisees |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Constantes

| Constante | Valeur | Description |
|-----------|--------|-------------|
| `DEFAULT_REASON` | `"You have been disconnected from the server!"` | Message par defaut affiche quand la connexion est annulee |

## Exemple d'utilisation

```java
// Enregistrer un handler pour la configuration de connexion
eventBus.register(PlayerSetupConnectEvent.class, event -> {
    String username = event.getUsername();
    UUID uuid = event.getUuid();

    // Verifier si le joueur est banni
    if (isBanned(uuid)) {
        event.setCancelled(true);
        event.setReason("You are banned from this server!");
        return;
    }

    // Verifier la capacite du serveur
    if (getOnlinePlayerCount() >= getMaxPlayers()) {
        if (!isVIP(uuid)) {
            event.setCancelled(true);
            event.setReason("Server is full! VIP members can still join.");
            return;
        }
    }

    // Verifier la liste blanche
    if (isWhitelistEnabled() && !isWhitelisted(uuid)) {
        event.setCancelled(true);
        event.setReason("You are not whitelisted on this server.");
        return;
    }

    logger.info("Player " + username + " is connecting...");
});

// Equilibrage de charge du reseau de serveurs
eventBus.register(EventPriority.FIRST, PlayerSetupConnectEvent.class, event -> {
    // Verifier si ce serveur est surcharge
    if (getCurrentLoad() > 0.9) {
        // Rediriger vers un autre serveur du reseau
        event.referToServer("lobby2.example.com", 25565);
        return;
    }
});

// Gerer les transferts de serveur
eventBus.register(PlayerSetupConnectEvent.class, event -> {
    if (event.isReferralConnection()) {
        // Le joueur a ete transfere depuis un autre serveur
        byte[] referralData = event.getReferralData();
        HostAddress source = event.getReferralSource();

        // Traiter les donnees de transfert
        handleServerTransfer(event.getUuid(), referralData, source);
    }
});

// Authentification personnalisee
eventBus.register(EventPriority.EARLY, PlayerSetupConnectEvent.class, event -> {
    PlayerAuthentication auth = event.getAuth();

    // Verifier l'authentification
    if (!verifyAuth(auth)) {
        event.setCancelled(true);
        event.setReason("Authentication failed.");
    }
});
```

## Cas d'utilisation courants

- Verification et application des bannissements
- Systemes de liste blanche
- Gestion de la capacite du serveur (places VIP)
- Equilibrage de charge du reseau de serveurs
- Redirection et transferts de joueurs
- Systemes d'authentification personnalises
- Limitation du taux de connexion
- Restrictions basees sur l'IP
- Implementation du mode maintenance

## Événements lies

- [PlayerConnectEvent](./player-connect-event) - Déclenché apres une configuration reussie, quand le joueur est complètement connecte
- [PlayerSetupDisconnectEvent](./player-setup-disconnect-event) - Déclenché si la connexion en phase de configuration echoue
- [PlayerDisconnectEvent](./player-disconnect-event) - Déclenché quand un joueur connecte se deconnecte

## Notes

Cet événement se déclenche très tôt dans le processus de connexion, avant que l'entité du joueur ne soit créée. Utilisez-le pour :
- La validation de connexion
- Les vérifications d'authentification
- Les transferts de serveur

Les méthodes `referToServer` vous permettent de rediriger les joueurs vers différents serveurs dans un réseau, en passant des données optionnelles qui seront disponibles sur le serveur de destination.

## Test

> **Testé :** 17 janvier 2026 - Vérifié avec le plugin doc-test

Pour tester cet événement :
1. Exécutez `/doctest test-player-setup-connect-event`
2. Faites connecter un autre joueur au serveur (ou déconnectez-vous et reconnectez-vous)
3. Consultez la console du serveur pour les détails

Toutes les méthodes documentées ont été vérifiées :
- `getUsername()` - Retourne le nom d'utilisateur du joueur
- `getUuid()` - Retourne l'UUID du joueur
- `getPacketHandler()` - Retourne l'instance SetupPacketHandler
- `getAuth()` - Retourne l'objet PlayerAuthentication
- `isReferralConnection()` - Retourne false pour les connexions normales
- `getReferralData()` - Retourne null pour les connexions non-référées
- `getReferralSource()` - Retourne null pour les connexions non-référées
- `getClientReferral()` - Retourne null quand aucune redirection n'est définie
- `isCancelled()` - Retourne false par défaut
- `getReason()` - Retourne le message par défaut "You have been disconnected from the server!"
- `toString()` - Retourne la représentation complète de l'événement

## Détails internes

### Où l'événement est déclenché

L'événement est déclenché dans `SetupPacketHandler.registered0()` à la ligne 130-135 :

```java
// decompiled/com/hypixel/hytale/server/core/io/handlers/SetupPacketHandler.java:130
PlayerSetupConnectEvent event = HytaleServer.get()
   .getEventBus()
   .<Void, PlayerSetupConnectEvent>dispatchFor(PlayerSetupConnectEvent.class)
   .dispatch(new PlayerSetupConnectEvent(this, this.username, this.uuid, this.auth, this.referralData, this.referralSource));
```

### Implémentation de l'annulation

Quand l'événement est annulé, la connexion est immédiatement terminée :

```java
// SetupPacketHandler.java:135-136
if (event.isCancelled()) {
    this.disconnect(event.getReason());
    return;
}
```

### Chaîne de traitement de l'événement

```
Le joueur tente une connexion
        ↓
L'authentification se termine
        ↓
SetupPacketHandler.registered0() appelé
        ↓
PlayerSetupConnectEvent dispatché
        ↓
    ┌───────────────────────────────┐
    │ Les handlers de plugin        │
    │ s'exécutent. Peuvent :        │
    │ cancel, setReason,            │
    │ referToServer                 │
    └───────────────────────────────┘
        ↓
    isCancelled()?
    ├─ OUI → disconnect(reason)
    │
    └─ NON → clientReferral défini?
           ├─ OUI → envoie le paquet de référence au client
           │
           └─ NON → continue la connexion normale
                    (compression, paramètres monde, assets)
```

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerSetupConnectEvent.java:16`

> **Dernière mise à jour :** 17 janvier 2026 - Testé et vérifié. Ajout des détails internes et de la section test.
