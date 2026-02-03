---
id: player-mouse-motion-event
title: PlayerMouseMotionEvent
sidebar_label: PlayerMouseMotionEvent
---

# PlayerMouseMotionEvent

> **⚠️ Attention :** Cet événement **ne se déclenche pas** actuellement en pratique. Bien que la classe d'événement existe dans le code serveur et que les listeners peuvent être enregistrés (avec `hasListener()` retournant `true`), le client Hytale n'envoie pas de paquets de mouvement de souris au serveur. Cela pourrait changer dans les versions futures. Testé en janvier 2026.

Déclenché lorsqu'un joueur deplace sa souris. C'est un événement annulable qui fournit des informations sur le mouvement de la souris, incluant la position actuelle a l'ecran et les blocs ou entites sous le curseur.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerMouseMotionEvent` |
| **Classe parente** | `PlayerEvent<Void>` |
| **Annulable** | Oui |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerMouseMotionEvent.java:14` |

## Declaration

```java
public class PlayerMouseMotionEvent extends PlayerEvent<Void> implements ICancellable {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `playerRef` | `Ref<EntityStore>` | `getPlayerRef()` | Référence vers le magasin d'entite du joueur (hérité de PlayerEvent) |
| `player` | `Player` | `getPlayer()` | L'objet joueur (hérité de PlayerEvent) |
| `clientUseTime` | `long` | `getClientUseTime()` | Horodatage cote client de l'événement de mouvement |
| `itemInHand` | `Item` | `getItemInHand()` | L'objet que le joueur tient en main |
| `targetBlock` | `Vector3i` | `getTargetBlock()` | La position du bloc sous le curseur (si applicable) |
| `targetEntity` | `Entity` | `getTargetEntity()` | L'entite sous le curseur (si applicable) |
| `screenPoint` | `Vector2f` | `getScreenPoint()` | Les coordonnees a l'ecran de la souris |
| `mouseMotion` | `MouseMotionEvent` | `getMouseMotion()` | Les details de l'événement de mouvement de la souris |
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'événement a ete annule |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getPlayerRef` | `@Nonnull public Ref<EntityStore> getPlayerRef()` | Retourne la reference du magasin d'entite du joueur (hérité) |
| `getPlayer` | `@Nonnull public Player getPlayer()` | Retourne l'objet joueur (hérité) |
| `getClientUseTime` | `public long getClientUseTime()` | Retourne l'horodatage client |
| `getItemInHand` | `public Item getItemInHand()` | Retourne l'objet tenu en main |
| `getTargetBlock` | `public Vector3i getTargetBlock()` | Retourne la position du bloc sous le curseur |
| `getTargetEntity` | `public Entity getTargetEntity()` | Retourne l'entite sous le curseur |
| `getScreenPoint` | `public Vector2f getScreenPoint()` | Retourne les coordonnees a l'ecran |
| `getMouseMotion` | `public MouseMotionEvent getMouseMotion()` | Retourne l'événement de mouvement de la souris |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'événement est annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Annule ou reactive l'événement |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les événements de mouvement de souris
eventBus.register(PlayerMouseMotionEvent.class, event -> {
    Player player = event.getPlayer();
    Vector2f screenPos = event.getScreenPoint();

    // Suivre la position de la souris pour l'UI
    updatePlayerCursorPosition(player, screenPos);

    // Mettre en surbrillance le bloc sous le curseur
    Vector3i targetBlock = event.getTargetBlock();
    if (targetBlock != null) {
        highlightBlock(player, targetBlock);
    }

    // Afficher une infobulle d'entite au survol
    Entity targetEntity = event.getTargetEntity();
    if (targetEntity != null) {
        showEntityTooltip(player, targetEntity);
    }
});

// Implementer des effets de survol
eventBus.register(PlayerMouseMotionEvent.class, event -> {
    Entity hoveredEntity = event.getTargetEntity();
    Player player = event.getPlayer();

    // Effacer l'etat de survol precedent
    clearHoverState(player);

    if (hoveredEntity != null) {
        // Appliquer un effet de contour au survol
        applyHoverOutline(player, hoveredEntity);

        // Afficher une invite d'interaction
        if (hoveredEntity instanceof NPC) {
            showInteractionPrompt(player, "Press E to talk");
        }
    }
});

// Systeme d'apercu de selection de bloc
eventBus.register(PlayerMouseMotionEvent.class, event -> {
    Item item = event.getItemInHand();
    Vector3i targetBlock = event.getTargetBlock();

    if (item != null && item.getType().equals("custom:building_tool") && targetBlock != null) {
        // Afficher l'apercu de placement
        showPlacementPreview(event.getPlayer(), targetBlock, item);
    }
});
```

## Cas d'utilisation courants

- Mise en surbrillance et apercu de selection de blocs
- Effets de survol et infobulles d'entites
- Systemes de curseur personnalises
- Systemes d'assistance a la visee ou de ciblage
- Apercus d'outils de construction
- Gestion de l'etat de survol de l'UI
- Detection du regard pour les tutoriels ou quetes

## Événements lies

- [PlayerMouseButtonEvent](./player-mouse-button-event) - Pour les événements de clic de souris
- [PlayerInteractEvent](./player-interact-event) - Evenement d'interaction obsolete

## Notes

L'objet `MouseMotionEvent` contient des informations détaillées sur le mouvement de la souris incluant :
- Le deplacement delta depuis le dernier événement
- La position actuelle
- La velocite du mouvement

Soyez attentif aux performances lors de la gestion de cet événement, car il peut se déclencher tres frequemment pendant le jeu normal. Considerez :
- Limiter les mises a jour pour reduire la charge de traitement
- Utiliser des structures de donnees efficaces pour le suivi de l'etat de survol
- Eviter les calculs lourds dans le handler d'événement

## Détails internes

### Lieu de déclenchement de l'événement

L'événement est dispatché dans `InteractionModule.java` (lignes 888-897) :

```java
IEventDispatcher<PlayerMouseMotionEvent, PlayerMouseMotionEvent> dispatcher = HytaleServer.get()
   .getEventBus()
   .dispatchFor(PlayerMouseMotionEvent.class);
if (dispatcher.hasListener()) {
   dispatcher.dispatch(new PlayerMouseMotionEvent(...));
}
```

**Important :** Le serveur ne dispatch cet événement que lorsque :
1. Un listener est enregistré (`hasListener()` retourne `true`)
2. Le client envoie un paquet d'interaction SANS appui sur un bouton de souris (`packet.mouseButton == null`)

### Structure du protocole MouseMotionEvent

L'objet `MouseMotionEvent` du protocole contient :
- `relativeMotion` (`Vector2i`) : Le mouvement relatif de la souris (delta x, y)
- `mouseButtonType[]` : Tableau des boutons de souris actuellement pressés (si applicable)

### Résultats des tests

- **Testé :** 17 janvier 2026
- **Résultat :** L'événement NE se déclenche PAS
- **Raison :** Le client n'envoie pas de paquets de mouvement de souris au serveur
- **Enregistrement :** Fonctionne correctement (`hasListener()` retourne `true` après enregistrement)
- **Note :** Doit être enregistré sur `HytaleServer.get().getEventBus()` directement pour que `hasListener()` fonctionne

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerMouseMotionEvent.java:14`
