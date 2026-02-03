---
id: player-interact-event
title: PlayerInteractEvent
sidebar_label: PlayerInteractEvent
---

# PlayerInteractEvent

:::danger Événement non fonctionnel
**Cet événement est obsolète ET n'est jamais déclenché par le serveur.** La classe de l'événement existe mais rien dans le code du serveur ne le crée ou ne le dispatche. Toute la gestion des interactions a été déplacée vers [PlayerMouseButtonEvent](./player-mouse-button-event).

N'utilisez pas cet événement dans de nouveaux plugins - il ne se déclenchera jamais.
:::

~~Déclenché lorsqu'un joueur interagit avec le monde (blocs, entités ou objets).~~ Cet événement n'est plus fonctionnel.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerInteractEvent` |
| **Classe parente** | `PlayerEvent<String>` |
| **Annulable** | Oui |
| **Asynchrone** | Non |
| **Obsolète** | Oui |
| **Statut** | **Non fonctionnel** - Jamais déclenché par le serveur |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerInteractEvent.java:14` |

## Declaration

```java
@Deprecated
public class PlayerInteractEvent extends PlayerEvent<String> implements ICancellable {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `playerRef` | `Ref<EntityStore>` | `getPlayerRef()` | Référence vers le magasin d'entite du joueur (hérité de PlayerEvent) |
| `player` | `Player` | `getPlayer()` | L'objet joueur (hérité de PlayerEvent) |
| `actionType` | `InteractionType` | `getActionType()` | Le type d'interaction effectuee |
| `clientUseTime` | `long` | `getClientUseTime()` | Horodatage cote client de l'interaction |
| `itemInHand` | `ItemStack` | `getItemInHand()` | L'objet que le joueur tient en main |
| `targetBlock` | `Vector3i` | `getTargetBlock()` | La position du bloc cible (si applicable) |
| `targetRef` | `Ref<EntityStore>` | `getTargetRef()` | Référence vers le magasin de l'entite cible (si applicable) |
| `targetEntity` | `Entity` | `getTargetEntity()` | L'entite ciblee (si applicable) |
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'interaction a ete annulee |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getPlayerRef` | `public Ref<EntityStore> getPlayerRef()` | Retourne la reference du magasin d'entite du joueur (hérité) |
| `getPlayer` | `public Player getPlayer()` | Retourne l'objet joueur (hérité) |
| `getActionType` | `public InteractionType getActionType()` | Retourne le type d'interaction |
| `getClientUseTime` | `public long getClientUseTime()` | Retourne l'horodatage client |
| `getItemInHand` | `public ItemStack getItemInHand()` | Retourne l'objet tenu en main |
| `getTargetBlock` | `public Vector3i getTargetBlock()` | Retourne la position du bloc cible |
| `getTargetRef` | `public Ref<EntityStore> getTargetRef()` | Retourne la reference de l'entite cible |
| `getTargetEntity` | `public Entity getTargetEntity()` | Retourne l'entite ciblee |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'événement est annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Annule ou reactive l'événement |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les interactions du joueur
eventBus.register(PlayerInteractEvent.class, event -> {
    Player player = event.getPlayer();
    InteractionType action = event.getActionType();

    // Verifier si un bloc est cible
    Vector3i targetBlock = event.getTargetBlock();
    if (targetBlock != null) {
        // Gerer l'interaction avec le bloc
        logger.info(player.getName() + " interacted with block at " + targetBlock);

        // Empecher l'interaction dans les zones protegees
        if (isProtectedArea(targetBlock)) {
            event.setCancelled(true);
            player.sendMessage("You cannot interact here!");
            return;
        }
    }

    // Verifier si une entite est ciblee
    Entity targetEntity = event.getTargetEntity();
    if (targetEntity != null) {
        // Gerer l'interaction avec l'entite
        logger.info(player.getName() + " interacted with entity: " + targetEntity);
    }

    // Verifier l'objet utilise
    ItemStack item = event.getItemInHand();
    if (item != null) {
        // Interactions d'objets personnalisees
        handleCustomItemUse(player, item, action);
    }
});
```

## Cas d'utilisation courants

- Protection de regions contre les interactions des joueurs
- Comportements personnalises des objets lors de leur utilisation
- Systemes d'interaction avec les entites (PNJ, boutiques)
- Journalisation des interactions avec les blocs
- Interactions personnalisees avec les stations de fabrication
- Restrictions d'interaction basees sur les permissions

## Événements lies

- [PlayerMouseButtonEvent](./player-mouse-button-event) - Remplacement moderne pour les interactions basees sur la souris
- [PlayerMouseMotionEvent](./player-mouse-motion-event) - Pour suivre le mouvement de la souris
- [BreakBlockEvent](../ecs/break-block-event) - Spécifiquement pour la destruction de blocs
- [PlaceBlockEvent](../ecs/place-block-event) - Spécifiquement pour le placement de blocs
- [UseBlockEvent](../ecs/use-block-event) - Pour les interactions d'utilisation de blocs

## Avis de migration

:::tip Migration requise
Cet événement est **non fonctionnel** - vous devez migrer vers [PlayerMouseButtonEvent](./player-mouse-button-event) immédiatement. Le `PlayerMouseButtonEvent` est créé dans `InteractionModule.java:872` et fournit des informations sur les boutons de la souris incluant le type de bouton, l'état et le nombre de clics.
:::

## Résultats des tests

> **Testé :** 17 janvier 2026 - Vérifié avec le plugin doc-test

**Résultat du test : L'événement ne se déclenche PAS**

- Commande de test : `/doctest test-player-interact-event`
- Actions testées : Clic droit sur des blocs, clic droit sur des entités
- Résultat : Aucun événement détecté

**Analyse du code décompilé :**
- `PlayerMouseButtonEvent` est créé dans `InteractionModule.java:872`
- `PlayerMouseMotionEvent` est créé dans `InteractionModule.java:893`
- `PlayerInteractEvent` n'est **jamais instancié** nulle part dans le code
- Les listeners existants (BlockEventView, EntityEventView, CameraDemo) sont du code mort

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerInteractEvent.java:14`
