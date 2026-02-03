---
id: player-mouse-button-event
title: PlayerMouseButtonEvent
sidebar_label: PlayerMouseButtonEvent
---

# PlayerMouseButtonEvent

> **Note :** Cet événement ne se déclenche que lorsque le curseur de la souris est visible (ex: en mode caméra du dessus avec `displayCursor = true`). Il ne se déclenche pas en modes première/troisième personne standard.

Déclenché lorsqu'un joueur appuie ou relâche un bouton de la souris. C'est un événement annulable qui fournit des informations détaillées sur les entrées de la souris, incluant le bouton appuyé, la position à l'écran et les blocs ou entités ciblés.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerMouseButtonEvent` |
| **Classe parente** | `PlayerEvent<Void>` |
| **Annulable** | Oui |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerMouseButtonEvent.java:15` |

## Declaration

```java
public class PlayerMouseButtonEvent extends PlayerEvent<Void> implements ICancellable {
   @Nonnull
   private final PlayerRef playerRef;
   private final long clientUseTime;
   private final Item itemInHand;
   private final Vector3i targetBlock;
   private final Entity targetEntity;
   private final Vector2f screenPoint;
   private final MouseButtonEvent mouseButton;
   private boolean cancelled;
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `playerRef` | `Ref<EntityStore>` | `getPlayerRef()` | Référence vers le magasin d'entite du joueur (hérité de PlayerEvent) |
| `player` | `Player` | `getPlayer()` | L'objet joueur (hérité de PlayerEvent) |
| `playerRef` | `PlayerRef` | `getPlayerRefComponent()` | Composant de reference du joueur |
| `clientUseTime` | `long` | `getClientUseTime()` | Horodatage cote client de l'événement souris |
| `itemInHand` | `Item` | `getItemInHand()` | L'objet que le joueur tient en main |
| `targetBlock` | `Vector3i` | `getTargetBlock()` | La position du bloc cible (si applicable) |
| `targetEntity` | `Entity` | `getTargetEntity()` | L'entite ciblee (si applicable) |
| `screenPoint` | `Vector2f` | `getScreenPoint()` | Les coordonnees a l'ecran de la souris |
| `mouseButton` | `MouseButtonEvent` | `getMouseButton()` | Les details de l'événement du bouton de la souris |
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'événement a ete annule |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getPlayerRef` | `@Nonnull public Ref<EntityStore> getPlayerRef()` | Retourne la reference du magasin d'entite du joueur (hérité) |
| `getPlayer` | `@Nonnull public Player getPlayer()` | Retourne l'objet joueur (hérité) |
| `getPlayerRefComponent` | `@Nonnull public PlayerRef getPlayerRefComponent()` | Retourne le composant PlayerRef |
| `getClientUseTime` | `public long getClientUseTime()` | Retourne l'horodatage client |
| `getItemInHand` | `public Item getItemInHand()` | Retourne l'objet tenu en main |
| `getTargetBlock` | `public Vector3i getTargetBlock()` | Retourne la position du bloc cible |
| `getTargetEntity` | `public Entity getTargetEntity()` | Retourne l'entite ciblee |
| `getScreenPoint` | `public Vector2f getScreenPoint()` | Retourne les coordonnees a l'ecran |
| `getMouseButton` | `public MouseButtonEvent getMouseButton()` | Retourne l'événement du bouton de la souris |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'événement est annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Annule ou reactive l'événement |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les événements de bouton de souris
eventBus.register(PlayerMouseButtonEvent.class, event -> {
    Player player = event.getPlayer();
    MouseButtonEvent mouseEvent = event.getMouseButton();

    // Verifier quel bouton a ete appuye
    if (mouseEvent.isLeftButton() && mouseEvent.isPressed()) {
        // Clic gauche appuye
        handleLeftClick(player, event);
    } else if (mouseEvent.isRightButton() && mouseEvent.isPressed()) {
        // Clic droit appuye
        handleRightClick(player, event);
    }

    // Verifier si un bloc est cible
    Vector3i targetBlock = event.getTargetBlock();
    if (targetBlock != null) {
        // Interaction avec un bloc
        if (isProtectedArea(targetBlock)) {
            event.setCancelled(true);
            player.sendMessage("You cannot interact with blocks here!");
            return;
        }
    }

    // Verifier si une entite est ciblee
    Entity targetEntity = event.getTargetEntity();
    if (targetEntity != null) {
        // Interaction avec une entite
        handleEntityClick(player, targetEntity, mouseEvent);
    }
});

// Suivre la position a l'ecran pour les interactions UI
eventBus.register(PlayerMouseButtonEvent.class, event -> {
    Vector2f screenPos = event.getScreenPoint();
    // Verifier si le clic est dans une region UI personnalisee
    if (isInCustomUIRegion(screenPos)) {
        handleUIClick(event.getPlayer(), screenPos);
        event.setCancelled(true);
    }
});

// Comportements de clic spécifiques aux objets
eventBus.register(PlayerMouseButtonEvent.class, event -> {
    Item item = event.getItemInHand();
    if (item != null && item.getType().equals("custom:magic_wand")) {
        // Comportement personnalise de la baguette magique
        castSpell(event.getPlayer(), event.getTargetBlock(), event.getTargetEntity());
        event.setCancelled(true);
    }
});
```

## Cas d'utilisation courants

- Comportements personnalises des armes ou outils
- Systemes de competences bases sur les clics
- Protection de regions (empêcher les clics dans certaines zones)
- Systemes d'interaction UI personnalises
- Interactions avec les PNJ et les boutiques
- Systemes de permissions de construction
- Modifications de combat

## Événements lies

- [PlayerMouseMotionEvent](./player-mouse-motion-event) - Pour suivre le mouvement de la souris
- [PlayerInteractEvent](./player-interact-event) - Evenement d'interaction obsolete
- [BreakBlockEvent](../ecs/break-block-event) - Spécifiquement pour la destruction de blocs
- [PlaceBlockEvent](../ecs/place-block-event) - Spécifiquement pour le placement de blocs

## Notes

L'objet `MouseButtonEvent` contient des informations détaillées sur l'entree de la souris incluant :
- Quel bouton a ete appuye (gauche, droit, milieu, etc.)
- Si le bouton a ete appuye ou relache
- Les touches de modification maintenues pendant le clic

Le champ `screenPoint` fournit les coordonnees a l'ecran ou le clic s'est produit, utile pour les systemes UI personnalises.

## Résultats des tests

> **Testé :** 23 janvier 2026 - Vérifié par la communauté ([#25](https://github.com/timiliris/Hytale-Docs/issues/25))

**Statut : FONCTIONNEL** (quand le curseur est visible)

> **Important :** Cet événement ne se déclenche que lorsque le curseur de la souris est visible à l'écran. Cela se produit généralement lors de l'utilisation d'un mode caméra personnalisé avec `displayCursor = true` (ex: vue du dessus). En modes première personne ou troisième personne standard où le curseur est masqué, cet événement **ne se déclenchera pas**.

Cet événement a été confirmé fonctionnel par la communauté. Voici un exemple fonctionnel utilisant une vue caméra du dessus :

```java
getEventRegistry().registerGlobal(PlayerMouseButtonEvent.class, event -> {
    MouseButtonEvent mouseEvent = event.getMouseButton();

    if (mouseEvent.mouseButtonType != MouseButtonType.Left || mouseEvent.state != MouseButtonState.Pressed) {
        return;
    }

    Player player = event.getPlayer();
    Vector3i blockPos = event.getTargetBlock();

    player.sendMessage(Message.raw("Clic détecté à : " + blockPos.toString()));
});
```

## Événements associés

Pour des cas d'utilisation plus spécifiques, vous pouvez également considérer :
- **[DamageBlockEvent](../block/damage-block-event)** - Se déclenche en maintenant le clic gauche sur un bloc
- **[BreakBlockEvent](../block/break-block-event)** - Se déclenche quand un bloc est cassé
- **[PlaceBlockEvent](../block/place-block-event)** - Se déclenche lors du placement d'un bloc
- **[UseBlockPreEvent / UseBlockPostEvent](../block/use-block-pre-event)** - Pour les interactions avec les blocs (clic droit)

## Détails internes

### Lieu de dispatch de l'événement

**Fichier :** `InteractionModule.java:866-886`

L'événement serait dispatché lors de la réception d'un paquet `MouseInteraction` avec un champ `mouseButton` non-null.

### Structure de MouseButtonEvent

```java
public class MouseButtonEvent {
    public MouseButtonType mouseButtonType;  // Left, Middle, Right, X1, X2
    public MouseButtonState state;           // Pressed, Released
    public byte clicks;                      // Nombre de clics
}
```

### Hiérarchie de classes

```
PlayerMouseButtonEvent
├── extends: PlayerEvent<Void>
│   └── extends: IEvent<Void>
└── implements: ICancellable
```

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerMouseButtonEvent.java:15`

---

> **Dernière mise à jour :** 23 janvier 2026 - Événement confirmé fonctionnel par les tests de la communauté ([#25](https://github.com/timiliris/Hytale-Docs/issues/25)).
