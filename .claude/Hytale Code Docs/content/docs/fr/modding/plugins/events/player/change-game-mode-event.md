---
id: change-game-mode-event
title: ChangeGameModeEvent
sidebar_label: ChangeGameModeEvent
sidebar_position: 5
---

# ChangeGameModeEvent

Déclenché lorsque le mode de jeu d'un joueur est sur le point de changer. Cet événement permet aux plugins d'intercepter, modifier ou empêcher les changements de mode de jeu. Bien qu'il s'agisse principalement d'un événement de gameplay, il est inclus dans la categorie des événements d'inventaire car les changements de mode de jeu ont souvent des impacts significatifs sur le comportement de l'inventaire (par exemple, l'acces a l'inventaire en mode créatif).

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.ChangeGameModeEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |
| **Événement ECS** | Oui |
| **Fichier source** | `com/hypixel/hytale/server/core/event/events/ecs/ChangeGameModeEvent.java:7` |

## Declaration

```java
public class ChangeGameModeEvent extends CancellableEcsEvent {
    @Nonnull
    private GameMode gameMode;

    // Constructeur et methodes...
}
```

## Champs

| Champ | Type | Ligne | Description |
|-------|------|-------|-------------|
| `gameMode` | `GameMode` | 9 | Le mode de jeu cible (modifiable via le setter) |

## Méthodes

| Méthode | Type de retour | Ligne | Description |
|---------|----------------|-------|-------------|
| `getGameMode()` | `@Nonnull GameMode` | 16 | Obtient le mode de jeu cible |
| `setGameMode(@Nonnull GameMode)` | `void` | 20 | Change le mode de jeu cible |
| `isCancelled()` | `boolean` | - | Retourne si l'événement a ete annulé (hérité) |
| `setCancelled(boolean)` | `void` | - | Définit l'etat d'annulation de l'événement (hérité) |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.event.events.ecs.ChangeGameModeEvent;
import com.hypixel.hytale.event.EventPriority;

public class GameModeListener extends PluginBase {

    @Override
    public void onEnable() {
        getServer().getEventBus().register(
            EventPriority.NORMAL,
            ChangeGameModeEvent.class,
            this::onGameModeChange
        );
    }

    private void onGameModeChange(ChangeGameModeEvent event) {
        GameMode newMode = event.getGameMode();

        getLogger().info("Le joueur change vers le mode de jeu: " + newMode);
    }
}
```

### Empêcher les changements de mode de jeu

```java
// Exemple: Restreindre les changements de mode de jeu dans certains contextes
getServer().getEventBus().register(
    EventPriority.FIRST,
    ChangeGameModeEvent.class,
    event -> {
        // Exemple: Empêcher le passage en mode créatif sans permission
        // if (event.getGameMode() == GameMode.CREATIVE) {
        //     if (!hasCreativePermission(player)) {
        //         event.setCancelled(true);
        //         // Envoyer un message de permission refusée
        //     }
        // }
    }
);
```

### Rediriger les changements de mode de jeu

```java
// Exemple: Forcer un mode de jeu different
getServer().getEventBus().register(
    EventPriority.FIRST,
    ChangeGameModeEvent.class,
    event -> {
        // Exemple: Dans un monde spécifique, toujours utiliser le mode aventure
        // if (isRestrictedWorld(player)) {
        //     event.setGameMode(GameMode.ADVENTURE);
        // }
    }
);
```

### Journaliser les changements de mode de jeu

```java
// Exemple: Journal d'audit pour les changements de mode de jeu
getServer().getEventBus().register(
    EventPriority.LAST,
    ChangeGameModeEvent.class,
    event -> {
        if (!event.isCancelled()) {
            GameMode mode = event.getGameMode();
            // auditLogger.log("Mode de jeu change vers: " + mode);
        }
    }
);
```

## Quand cet événement se déclenché

Le `ChangeGameModeEvent` se déclenché dans les scenarios suivants :

1. **Utilisation de commande** : Lorsqu'un joueur ou un administrateur utilise une commande de mode de jeu
2. **Action de plugin** : Lorsqu'un plugin change programmatiquement le mode de jeu d'un joueur
3. **Regles de monde** : Lors de l'entree dans un monde avec des regles de mode de jeu spécifiques
4. **Configuration du serveur** : Lorsque les paramètres du serveur dictent des changements de mode de jeu
5. **Mécaniques de jeu** : Lorsque les regles du jeu déclenchént des changements automatiques de mode de jeu

## Comportement d'annulation

Lorsque cet événement est annulé :

- Le mode de jeu du joueur **restera inchangé**
- Tout changement d'inventaire associé au changement de mode est empêché
- Le joueur n'obtiendra pas l'acces a l'inventaire créatif (si passage en mode créatif)
- Le vol et autres capacités spécifiques au mode ne seront pas accordés/révoqués
- Le joueur ne reçoit aucune notification du changement empêché

```java
// Exemple: Verrouillage du mode de jeu en minijeu
getServer().getEventBus().register(
    EventPriority.FIRST,
    ChangeGameModeEvent.class,
    event -> {
        // Pendant une partie active, verrouiller le mode de jeu
        // if (isInActiveGame(player)) {
        //     event.setCancelled(true);
        //     // player.sendMessage("Impossible de changer de mode de jeu pendant la partie!");
        // }
    }
);
```

## Types de mode de jeu

Bien que les valeurs spécifiques de l'enum `GameMode` dependent de l'implementation de Hytale, les modes de jeu courants incluent typiquement :

| Mode | Description |
|------|-------------|
| **Survie** | Gameplay standard avec sante, faim et collecte de ressources |
| **Creatif** | Ressources illimitées, vol et capacités de construction |
| **Aventure** | Interactions restreintes, conçu pour les cartes et experiences |
| **Spectateur** | Mode observateur sans interaction avec le monde |

**Note** : Consultez la documentation de l'API Hytale pour les valeurs exactes de l'enum `GameMode` disponibles.

## Impact sur l'inventaire

Les changements de mode de jeu affectent souvent le comportement de l'inventaire :

### Passage en mode créatif
- Peut accorder l'acces a un panneau d'inventaire créatif
- Peut permettre de faire apparaître des objets
- Peut changer le comportement de durabilité des objets

### Sortie du mode créatif
- Peut vider les objets de l'inventaire créatif
- Peut restaurer l'inventaire de survie
- Peut affecter les restrictions d'objets

### Mode aventure
- Peut restreindre le placement/la destruction d'objets
- Peut limiter les interactions avec l'inventaire

```java
// Exemple: Vider les objets créatifs en quittant le mode créatif
getServer().getEventBus().register(
    EventPriority.NORMAL,
    ChangeGameModeEvent.class,
    event -> {
        // Si on quitte le mode créatif, gerer l'inventaire de maniere appropriee
        // GameMode newMode = event.getGameMode();
        // if (newMode != GameMode.CREATIVE && wasCreativeMode(player)) {
        //     // Gerer la transition d'inventaire
        // }
    }
);
```

## Événements lies

- **[DropItemEvent](./drop-item-event)** - Peut etre affecte par les restrictions de mode de jeu
- **[InteractivelyPickupItemEvent](./interactively-pickup-item-event)** - Le comportement de ramassage peut varier selon le mode
- **[CraftRecipeEvent](./craft-recipe-event)** - La fabrication peut dépendre du mode
- **LivingEntityInventoryChangeEvent** - Changements d'inventaire déclenchés par les changements de mode

## Détails internes

### Où l'événement est déclenché

Le `ChangeGameModeEvent` est déclenché dans `Player.java` (ligne 734) lorsque le mode de jeu d'un joueur change :

```java
// Depuis Player.java:734
GameMode oldGameMode = playerComponent.gameMode;
if (oldGameMode != gameMode) {
   ChangeGameModeEvent event = new ChangeGameModeEvent(gameMode);
   componentAccessor.invoke(playerRef, event);
   if (event.isCancelled()) {
      return;  // Le changement de mode de jeu est bloqué
   }

   setGameModeInternal(playerRef, event.getGameMode(), movementManagerComponent, componentAccessor);
   runOnSwitchToGameMode(playerRef, gameMode);
}
```

### Hiérarchie de classes

```
EcsEvent (abstrait)
  └── CancellableEcsEvent (abstrait)
       └── ChangeGameModeEvent
```

### Import GameMode

```java
import com.hypixel.hytale.protocol.GameMode;
```

## Test

> **Testé :** 17 janvier 2026 - Vérifié avec le plugin doc-test

Pour tester cet événement :
1. Exécutez `/doctest test-change-game-mode-event`
2. Changez votre mode de jeu avec `/gamemode creative`, `/gamemode survival`, `/gamemode adventure`, ou `/gamemode spectator`
3. L'événement devrait se déclencher et afficher les détails dans le chat

## Référence source

- **Classe** : `com.hypixel.hytale.server.core.event.events.ecs.ChangeGameModeEvent`
- **Source** : `decompiled/com/hypixel/hytale/server/core/event/events/ecs/ChangeGameModeEvent.java`
- **Ligne** : 7
- **Parent** : `CancellableEcsEvent` (`com.hypixel.hytale.component.system.CancellableEcsEvent`)

> **Dernière mise à jour :** 17 janvier 2026 - Testé et vérifié. Ajout des détails internes depuis le code source décompilé.
