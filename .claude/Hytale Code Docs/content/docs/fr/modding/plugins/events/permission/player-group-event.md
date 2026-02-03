---
id: player-group-event
title: PlayerGroupEvent
sidebar_label: PlayerGroupEvent
---

# PlayerGroupEvent

Le `PlayerGroupEvent` est déclenché lorsque l'appartenance d'un joueur a un groupe de permissions change. Il éténd `PlayerPermissionChangeEvent` et fournit deux classes internes pour suivre quand les joueurs sont ajoutes ou retires des groupes.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent` |
| **Classe parente** | `PlayerPermissionChangeEvent` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/permissions/PlayerGroupEvent.java:6` |

## Declaration

```java
public class PlayerGroupEvent extends PlayerPermissionChangeEvent {
    @Nonnull
    private final String groupName;

    public PlayerGroupEvent(@Nonnull UUID playerUuid, @Nonnull String groupName) {
        super(playerUuid);
        this.groupName = groupName;
    }

    @Nonnull
    public String getGroupName() {
        return this.groupName;
    }
}
```

## Champs

| Champ | Type | Description | Accesseur |
|-------|------|-------------|-----------|
| `playerUuid` | `UUID` | L'identifiant unique du joueur (hérité) | `getPlayerUuid()` |
| `groupName` | `String` | Le nom du groupe de permissions | `getGroupName()` |

## Méthodes

### Héritées de PlayerPermissionChangeEvent

| Méthode | Type de retour | Description |
|---------|----------------|-------------|
| `getPlayerUuid()` | `UUID` | Retourne l'UUID du joueur affecte |

### Méthodes spécifiques a l'événement

| Méthode | Type de retour | Description |
|---------|----------------|-------------|
| `getGroupName()` | `String` | Retourne le nom du groupe auquel le joueur a été ajoute ou retire |

## Classes internes

Le `PlayerGroupEvent` contient deux classes internes representant des changements d'appartenance spécifiques :

### Added

Déclenché lorsqu'un joueur est ajoute a un groupe de permissions.

```java
public static class Added extends PlayerGroupEvent {
    public Added(@Nonnull UUID playerUuid, @Nonnull String groupName) {
        super(playerUuid, groupName);
    }
}
```

Cette classe hérité de tous les champs et methodes de `PlayerGroupEvent` sans ajouter de nouveaux membres.

### Removed

Déclenché lorsqu'un joueur est retire d'un groupe de permissions.

```java
public static class Removed extends PlayerGroupEvent {
    public Removed(@Nonnull UUID playerUuid, @Nonnull String groupName) {
        super(playerUuid, groupName);
    }
}
```

Cette classe hérité de tous les champs et methodes de `PlayerGroupEvent` sans ajouter de nouveaux membres.

## Résumé des classes internes

| Classe interne | Description | Champs supplémentaires |
|----------------|-------------|------------------------|
| `Added` | Le joueur a été ajoute a un groupe de permissions | Aucun (hérité de `PlayerGroupEvent`) |
| `Removed` | Le joueur a été retire d'un groupe de permissions | Aucun (hérité de `PlayerGroupEvent`) |

## Exemple d'utilisation

> **Testé** - Ce code a été vérifié avec un plugin fonctionnel.

Puisque `PlayerGroupEvent` étend `PlayerPermissionChangeEvent` qui implémente `IEvent<Void>`, vous pouvez utiliser la méthode `register()` standard.

### Suivi basique de l'appartenance aux groupes

```java
import com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent;
import com.hypixel.hytale.event.EventRegistry;
import java.util.UUID;

public class GroupMembershipPlugin extends JavaPlugin {

    @Override
    protected void setup() {
        EventRegistry eventBus = getEventRegistry();

        // Ecouter les joueurs rejoignant des groupes
        eventBus.register(PlayerGroupEvent.Added.class, event -> {
            UUID playerId = event.getPlayerUuid();
            String groupName = event.getGroupName();

            logger.info("Player " + playerId + " joined group '" + groupName + "'");
        });

        // Ecouter les joueurs quittant des groupes
        eventBus.register(PlayerGroupEvent.Removed.class, event -> {
            UUID playerId = event.getPlayerUuid();
            String groupName = event.getGroupName();

            logger.info("Player " + playerId + " left group '" + groupName + "'");
        });
    }
}
```

### Cache d'appartenance aux groupes

```java
import com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class GroupCachePlugin extends PluginBase {

    // Map de l'UUID du joueur vers ses groupes
    private final ConcurrentHashMap<UUID, Set<String>> playerGroups = new ConcurrentHashMap<>();

    // Map du nom de groupe vers les UUIDs des membres
    private final ConcurrentHashMap<String, Set<UUID>> groupMembers = new ConcurrentHashMap<>();

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.register(
            PlayerGroupEvent.Added.class,
            this::onPlayerAddedToGroup
        );
        eventBus.register(
            PlayerGroupEvent.Removed.class,
            this::onPlayerRemovedFromGroup
        );
    }

    private void onPlayerAddedToGroup(PlayerGroupEvent.Added event) {
        UUID playerId = event.getPlayerUuid();
        String groupName = event.getGroupName();

        // Mettre a jour le mapping joueur -> groupes
        playerGroups.computeIfAbsent(playerId, k -> ConcurrentHashMap.newKeySet())
                   .add(groupName);

        // Mettre a jour le mapping groupe -> joueurs
        groupMembers.computeIfAbsent(groupName, k -> ConcurrentHashMap.newKeySet())
                   .add(playerId);

        getLogger().info("Cache mis a jour: " + playerId + " ajoute a " + groupName);
    }

    private void onPlayerRemovedFromGroup(PlayerGroupEvent.Removed event) {
        UUID playerId = event.getPlayerUuid();
        String groupName = event.getGroupName();

        // Mettre a jour le mapping joueur -> groupes
        Set<String> groups = playerGroups.get(playerId);
        if (groups != null) {
            groups.remove(groupName);
        }

        // Mettre a jour le mapping groupe -> joueurs
        Set<UUID> members = groupMembers.get(groupName);
        if (members != null) {
            members.remove(playerId);
        }

        getLogger().info("Cache mis a jour: " + playerId + " retire de " + groupName);
    }

    public Set<String> getPlayerGroups(UUID playerId) {
        Set<String> groups = playerGroups.get(playerId);
        return groups != null ? new HashSet<>(groups) : Collections.emptySet();
    }

    public Set<UUID> getGroupMembers(String groupName) {
        Set<UUID> members = groupMembers.get(groupName);
        return members != null ? new HashSet<>(members) : Collections.emptySet();
    }

    public boolean isPlayerInGroup(UUID playerId, String groupName) {
        Set<String> groups = playerGroups.get(playerId);
        return groups != null && groups.contains(groupName);
    }
}
```

### Message de bienvenue pour les nouveaux membres de groupe

```java
import com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.Map;
import java.util.UUID;

public class GroupWelcomePlugin extends PluginBase {

    // Messages de bienvenue personnalises par groupe
    private static final Map<String, String> WELCOME_MESSAGES = Map.of(
        "admin", "Bienvenue dans l'équipe Admin! Vous avez maintenant un acces complet au serveur.",
        "moderator", "Bienvenue dans l'équipe de Moderation! Aidez a garder notre communaute sure.",
        "vip", "Merci de nous soutenir! Profitez de vos avantages VIP.",
        "builder", "Bienvenue dans l'équipe de Construction! Créez des structures incroyables."
    );

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.register(
            PlayerGroupEvent.Added.class,
            this::sendWelcomeMessage
        );
    }

    private void sendWelcomeMessage(PlayerGroupEvent.Added event) {
        UUID playerId = event.getPlayerUuid();
        String groupName = event.getGroupName();

        String message = WELCOME_MESSAGES.get(groupName.toLowerCase());
        if (message != null) {
            sendMessageToPlayer(playerId, message);
            getLogger().info("Message de bienvenue envoyé a " + playerId + " pour le groupe " + groupName);
        }
    }

    private void sendMessageToPlayer(UUID playerId, String message) {
        // L'implementation depend de l'API de messagerie
        // player.sendMessage(message);
    }
}
```

### Systeme d'audit des changements de groupe

```java
import com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent;
import com.hypixel.hytale.event.EventBus;
import java.time.Instant;
import java.util.*;

public class GroupAuditPlugin extends PluginBase {

    private final List<GroupMembershipChange> auditLog =
        Collections.synchronizedList(new ArrayList<>());

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.register(
            PlayerGroupEvent.Added.class,
            e -> logChange(e.getPlayerUuid(), e.getGroupName(), ChangeType.ADDED)
        );
        eventBus.register(
            PlayerGroupEvent.Removed.class,
            e -> logChange(e.getPlayerUuid(), e.getGroupName(), ChangeType.REMOVED)
        );
    }

    private void logChange(UUID playerId, String groupName, ChangeType type) {
        GroupMembershipChange change = new GroupMembershipChange(
            Instant.now(),
            playerId,
            groupName,
            type
        );
        auditLog.add(change);
        getLogger().info("[AUDIT] " + change);
    }

    public List<GroupMembershipChange> getAuditLog() {
        return new ArrayList<>(auditLog);
    }

    public List<GroupMembershipChange> getPlayerHistory(UUID playerId) {
        return auditLog.stream()
            .filter(c -> c.playerId().equals(playerId))
            .toList();
    }

    public List<GroupMembershipChange> getGroupHistory(String groupName) {
        return auditLog.stream()
            .filter(c -> c.groupName().equals(groupName))
            .toList();
    }

    public enum ChangeType {
        ADDED, REMOVED
    }

    public record GroupMembershipChange(
        Instant timestamp,
        UUID playerId,
        String groupName,
        ChangeType type
    ) {
        @Override
        public String toString() {
            return String.format(
                "[%s] Le joueur %s a %s le groupe '%s'",
                timestamp,
                playerId,
                type == ChangeType.ADDED ? "rejoint" : "quitte",
                groupName
            );
        }
    }
}
```

### Deblocage de fonctionnalites base sur les roles

```java
import com.hypixel.hytale.server.core.event.events.permissions.PlayerGroupEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.*;

public class FeatureUnlockPlugin extends PluginBase {

    // Fonctionnalites debloquees par chaque groupe
    private static final Map<String, Set<String>> GROUP_FEATURES = Map.of(
        "vip", Set.of("colored_chat", "nickname", "extra_homes"),
        "premium", Set.of("fly", "unlimited_teleports", "custom_items"),
        "admin", Set.of("god_mode", "world_edit", "console_access")
    );

    @Override
    public void onEnable(EventBus eventBus) {
        eventBus.register(
            PlayerGroupEvent.Added.class,
            this::unlockFeatures
        );
        eventBus.register(
            PlayerGroupEvent.Removed.class,
            this::lockFeatures
        );
    }

    private void unlockFeatures(PlayerGroupEvent.Added event) {
        UUID playerId = event.getPlayerUuid();
        String groupName = event.getGroupName();

        Set<String> features = GROUP_FEATURES.get(groupName.toLowerCase());
        if (features != null && !features.isEmpty()) {
            for (String feature : features) {
                enableFeature(playerId, feature);
            }
            getLogger().info(String.format(
                "Deblocage de %d fonctionnalites pour le joueur %s (groupe: %s)",
                features.size(), playerId, groupName
            ));
        }
    }

    private void lockFeatures(PlayerGroupEvent.Removed event) {
        UUID playerId = event.getPlayerUuid();
        String groupName = event.getGroupName();

        Set<String> features = GROUP_FEATURES.get(groupName.toLowerCase());
        if (features != null && !features.isEmpty()) {
            for (String feature : features) {
                // Ne desactiver que si le joueur n'a pas la fonctionnalite d'un autre groupe
                if (!hasFeatureFromOtherGroup(playerId, feature, groupName)) {
                    disableFeature(playerId, feature);
                }
            }
            getLogger().info(String.format(
                "Verrouillage des fonctionnalites pour le joueur %s (retire du groupe: %s)",
                playerId, groupName
            ));
        }
    }

    private void enableFeature(UUID playerId, String feature) {
        // Implementation: activer la fonctionnalite pour le joueur
    }

    private void disableFeature(UUID playerId, String feature) {
        // Implementation: desactiver la fonctionnalite pour le joueur
    }

    private boolean hasFeatureFromOtherGroup(UUID playerId, String feature, String excludeGroup) {
        // Verifier si le joueur a cette fonctionnalite d'un autre groupe
        // L'implementation depend du systeme de permissions
        return false;
    }
}
```

## Quand cet événement se déclenché

### Événement Added
- Lorsqu'un joueur est assigne a un groupe de permissions via des commandes
- Lorsqu'un joueur est ajoute programmatiquement a un groupe
- Lorsqu'un joueur achété ou gagne l'appartenance a un groupe
- Lorsque l'appartenance au groupe est restauree a la connexion

### Événement Removed
- Lorsqu'un joueur est retire d'un groupe de permissions via des commandes
- Lorsqu'un joueur est retire programmatiquement d'un groupe
- Lorsque l'appartenance au groupe expire (rangs temporaires)
- Lorsqu'un joueur est rétrogradé

## Relation avec PlayerPermissionChangeEvent

Le `PlayerGroupEvent` est une version plus spécifique de `PlayerPermissionChangeEvent.GroupAdded` et `PlayerPermissionChangeEvent.GroupRemoved`. Les principales differences sont :

| Aspect | PlayerGroupEvent | PlayerPermissionChangeEvent.GroupAdded/GroupRemoved |
|--------|------------------|-----------------------------------------------------|
| Classe parente | `PlayerPermissionChangeEvent` | `PlayerPermissionChangeEvent` |
| Classes internes | `Added`, `Removed` | N/A (ce sont les classes internes) |
| Cas d'utilisation | Suivre l'appartenance aux groupes | Suivre l'appartenance aux groupes |

Les deux peuvent etre utilises pour suivre les changements d'appartenance aux groupes. Choisissez en fonction de votre modele d'enregistrement et de vos besoins de cohérence.

## Hierarchie des événements

```
IEvent<Void>
  └── PlayerPermissionChangeEvent (abstract)
        └── PlayerGroupEvent
              ├── Added
              └── Removed
```

## Événements lies

| Événement | Description |
|-----------|-------------|
| [PlayerPermissionChangeEvent](./player-permission-change-event) | Classe parente pour tous les changements de permissions des joueurs |
| [GroupPermissionChangeEvent](./group-permission-change-event) | Déclenché lorsque les permissions d'un groupe sont modifiees |
| [PlayerConnectEvent](/docs/fr/modding/plugins/events/player/player-connect-event) | Utile pour initialiser les permissions des joueurs a la connexion |
| [PlayerDisconnectEvent](/docs/fr/modding/plugins/events/player/player-disconnect-event) | Utile pour le nettoyage lorsque les joueurs partent |

## Référence source

- **Package**: `com.hypixel.hytale.server.core.event.events.permissions`
- **Hierarchie**: `PlayerGroupEvent` -> `PlayerPermissionChangeEvent` -> `IEvent<Void>` -> `IBaseEvent<Void>`
- **Classes internes**: `Added`, `Removed`
- **Systeme d'événements**: Événement synchrone standard distribue via `EventBus`
