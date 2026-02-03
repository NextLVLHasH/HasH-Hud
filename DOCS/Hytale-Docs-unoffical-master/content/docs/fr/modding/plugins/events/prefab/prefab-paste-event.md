---
id: prefab-paste-event
title: PrefabPasteEvent
sidebar_label: PrefabPasteEvent
---

# PrefabPasteEvent

Declenche lorsqu'une structure prefab est collee dans le monde. C'est un evenement annulable qui permet aux plugins d'intercepter les operations de collage de prefab, soit au debut soit a la fin du processus de collage.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.prefab.event.PrefabPasteEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/prefab/event/PrefabPasteEvent.java:5` |

## Declaration

```java
public class PrefabPasteEvent extends CancellableEcsEvent {
   private final int prefabId;
   private final boolean pasteStart;
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `prefabId` | `int` | `getPrefabId()` | L'identifiant unique du prefab en cours de collage |
| `pasteStart` | `boolean` | `isPasteStart()` | Si cet evenement est declenche au debut (true) ou a la fin (false) de l'operation de collage |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getPrefabId` | `public int getPrefabId()` | Retourne l'identifiant unique du prefab en cours de collage |
| `isPasteStart` | `public boolean isPasteStart()` | Retourne true si cet evenement est au debut du collage, false s'il est a la fin |
| `isCancelled` | `public boolean isCancelled()` | Retourne si cet evenement a ete annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Definit l'etat d'annulation de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les evenements de collage de prefab
eventBus.register(PrefabPasteEvent.class, event -> {
    int prefabId = event.getPrefabId();
    boolean isStart = event.isPasteStart();

    if (isStart) {
        // Le collage du prefab commence
        logger.info("Debut du collage du prefab ID: " + prefabId);

        // Verifier si ce prefab est autorise dans cette zone
        if (!isPrefabAllowedInRegion(prefabId)) {
            event.setCancelled(true);
            return;
        }
    } else {
        // Le collage du prefab est termine
        logger.info("Fin du collage du prefab ID: " + prefabId);
        // Effectuer les operations post-collage
    }
});

// Annuler le collage de prefabs specifiques
eventBus.register(EventPriority.FIRST, PrefabPasteEvent.class, event -> {
    // Empecher certains prefabs d'etre colles
    if (isRestrictedPrefab(event.getPrefabId()) && event.isPasteStart()) {
        event.setCancelled(true);
        logger.warn("Tentative de collage de prefab restreint bloquee: " + event.getPrefabId());
    }
});

// Suivre les placements de prefab pour les analyses de generation de monde
eventBus.register(PrefabPasteEvent.class, event -> {
    if (!event.isPasteStart()) {
        // Enregistrer le collage termine pour les analyses
        analyticsTracker.recordPrefabPaste(event.getPrefabId());
    }
});
```

## Cas d'utilisation courants

- Empecher certains prefabs d'etre colles dans certaines regions
- Journaliser le placement de prefab pour le debogage de generation de monde
- Declencher une logique personnalisee lors de la generation de structures
- Implementer des restrictions de placement de prefab basees sur les regles du jeu
- Suivre la generation de structures pour les analyses ou les succes
- Modifier l'etat du monde avant ou apres le placement de prefab
- Implementer des zones de protection ou les prefabs ne peuvent pas etre places

## Evenements lies

- [PrefabPlaceEntityEvent](./prefab-place-entity-event) - Declenche lorsqu'une entite est placee dans le cadre d'un prefab
- [PlaceBlockEvent](../block/place-block-event) - Declenche lorsque des blocs individuels sont places
- [BreakBlockEvent](../block/break-block-event) - Declenche lorsque des blocs sont casses

## Reference source

`decompiled/com/hypixel/hytale/server/core/prefab/event/PrefabPasteEvent.java:5`
