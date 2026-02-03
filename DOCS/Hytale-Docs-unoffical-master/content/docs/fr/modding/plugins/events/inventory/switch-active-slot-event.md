---
id: switch-active-slot-event
title: SwitchActiveSlotEvent
sidebar_label: SwitchActiveSlotEvent
sidebar_position: 2
---

# SwitchActiveSlotEvent

Déclenché lorsqu'un joueur change l'emplacement actif de sa barre d'action. Cet événement peut etre déclenché soit par une entree client (défilement, touches numeriques) soit par une logique côté serveur, et fournit des informations sur les positions de l'emplacement precedent et du nouveau.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.SwitchActiveSlotEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |
| **Événement ECS** | Oui |
| **Fichier source** | `com/hypixel/hytale/server/core/event/events/ecs/SwitchActiveSlotEvent.java:5` |

## Declaration

```java
public class SwitchActiveSlotEvent extends CancellableEcsEvent {
    private final int previousSlot;
    private final int inventorySectionId;
    private byte newSlot;
    private final boolean serverRequest;

    // Constructeur et methodes...
}
```

## Champs

| Champ | Type | Ligne | Description |
|-------|------|-------|-------------|
| `previousSlot` | `int` | 6 | L'index de l'emplacement précédemment actif |
| `inventorySectionId` | `int` | 7 | L'ID de la section d'inventaire (typiquement la barre d'action) |
| `newSlot` | `byte` | 8 | L'index de l'emplacement vers lequel basculer (modifiable) |
| `serverRequest` | `boolean` | 9 | Si ce changement a ete initié par le serveur |

## Méthodes

| Méthode | Type de retour | Ligne | Description |
|---------|----------------|-------|-------------|
| `getPreviousSlot()` | `int` | 18 | Obtient l'index de l'emplacement précédemment actif |
| `getInventorySectionId()` | `int` | 38 | Obtient l'identifiant de la section d'inventaire |
| `getNewSlot()` | `byte` | 22 | Obtient l'index de l'emplacement cible |
| `setNewSlot(byte)` | `void` | 26 | Change l'emplacement cible (permet la redirection) |
| `isServerRequest()` | `boolean` | 30 | Retourne `true` si initié par le serveur |
| `isClientRequest()` | `boolean` | 34 | Retourne `true` si initié par le client |
| `isCancelled()` | `boolean` | - | Retourne si l'événement a ete annulé (hérité) |
| `setCancelled(boolean)` | `void` | - | Définit l'etat d'annulation de l'événement (hérité) |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.event.events.ecs.SwitchActiveSlotEvent;
import com.hypixel.hytale.event.EventPriority;

public class HotbarListener extends PluginBase {

    @Override
    public void onEnable() {
        getServer().getEventBus().register(
            EventPriority.NORMAL,
            SwitchActiveSlotEvent.class,
            this::onSlotSwitch
        );
    }

    private void onSlotSwitch(SwitchActiveSlotEvent event) {
        int previousSlot = event.getPreviousSlot();
        byte newSlot = event.getNewSlot();

        // Distinguer entre les demandes client et serveur
        if (event.isClientRequest()) {
            getLogger().info("Le joueur a change de l'emplacement " + previousSlot + " a l'emplacement " + newSlot);
        } else {
            getLogger().info("Le serveur a change l'emplacement de " + previousSlot + " a " + newSlot);
        }
    }
}
```

### Redirection de la selection d'emplacement

```java
// Exemple: Forcer le joueur vers un emplacement spécifique
getServer().getEventBus().register(
    EventPriority.FIRST,
    SwitchActiveSlotEvent.class,
    event -> {
        // Si le joueur essaie de passer a l'emplacement 8, rediriger vers l'emplacement 0
        if (event.getNewSlot() == 8) {
            event.setNewSlot((byte) 0);
            getLogger().info("Selection d'emplacement redirigee de 8 vers 0");
        }
    }
);
```

### Empêcher les changements d'emplacement

```java
// Exemple: Verrouiller la barre d'action pendant certains états de jeu
getServer().getEventBus().register(
    EventPriority.FIRST,
    SwitchActiveSlotEvent.class,
    event -> {
        // N'affecter que les demandes client
        if (event.isClientRequest()) {
            // Verifier si le joueur devrait etre verrouillé
            // if (isPlayerLocked(player)) {
            //     event.setCancelled(true);
            // }
        }
    }
);
```

## Quand cet événement se déclenché

Le `SwitchActiveSlotEvent` se déclenché dans les scenarios suivants :

1. **Defilement de la souris** : Lorsque le joueur fait defiler la molette de sa souris pour changer les emplacements de la barre d'action
2. **Appui sur une touche numerique** : Lorsque le joueur appuie sur 1-9 pour sélectionner directement un emplacement de la barre d'action
3. **Commandes serveur** : Lorsque le code côté serveur change programmatiquement l'emplacement actif
4. **Mécaniques de jeu** : Lorsque les regles du jeu ou les capacités forcent un changement d'emplacement
5. **Systèmes d'equipement** : Lorsque la logique d'equipement automatique selectionne un nouvel emplacement

## Comportement d'annulation

Lorsque cet événement est annulé :

- L'emplacement actif **restera inchange** a la position de l'emplacement precedent
- Pour les demandes client, la vue du client sera corrigée pour correspondre a l'etat du serveur
- Pour les demandes serveur, le code appelant doit gerer l'annulation
- Toute mecanique dépendante (utilisation d'objet, capacités) continuera a utiliser l'emplacement original

```java
// Exemple: Empêcher le changement d'emplacement pendant le combat
getServer().getEventBus().register(
    EventPriority.FIRST,
    SwitchActiveSlotEvent.class,
    event -> {
        // Ne restreindre que les changements initiés par le client
        if (!event.isClientRequest()) {
            return;
        }

        // Exemple de verification de combat
        // if (isInCombat(player)) {
        //     event.setCancelled(true);
        //     // Optionnellement envoyer un message au joueur
        // }
    }
);
```

## Demandes serveur vs client

Comprendre la distinction entre les demandes serveur et client est important :

### Demandes client (`isClientRequest() == true`)
- Déclenchées par l'entree du joueur (molette de défilement, touches numeriques)
- Peuvent etre annulées pour empêcher le joueur de changer d'emplacement
- Peuvent nécessiter une validation pour prévenir les exploits

### Demandes serveur (`isServerRequest() == true`)
- Déclenchées par la logique de jeu côté serveur
- Ne devraient généralement pas etre annulées (peuvent casser les mecaniques de jeu)
- Utilisées pour les changements d'equipement forcés, les activations de capacités, etc.

```java
// Exemple: Valider uniquement les demandes client
getServer().getEventBus().register(
    SwitchActiveSlotEvent.class,
    event -> {
        if (event.isServerRequest()) {
            // Faire confiance aux changements initiés par le serveur
            return;
        }

        // Valider la demande client
        byte requestedSlot = event.getNewSlot();
        if (requestedSlot < 0 || requestedSlot > 8) {
            event.setCancelled(true);
        }
    }
);
```

## Événements lies

- **[DropItemEvent](./drop-item-event)** - Déclenché lorsqu'un objet est lache de l'inventaire
- **[InteractivelyPickupItemEvent](./interactively-pickup-item-event)** - Déclenché lors du ramassage d'objets
- **LivingEntityInventoryChangeEvent** - Déclenché lors de tout changement d'inventaire
- **PlayerMouseButtonEvent** - Déclenché lors de l'utilisation d'objets depuis l'emplacement actif

## Référence source

- **Classe** : `com.hypixel.hytale.server.core.event.events.ecs.SwitchActiveSlotEvent`
- **Source** : `decompiled/com/hypixel/hytale/server/core/event/events/ecs/SwitchActiveSlotEvent.java`
- **Ligne** : 5
- **Parent** : `CancellableEcsEvent` (`com.hypixel.hytale.component.system.CancellableEcsEvent`)
