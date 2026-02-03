---
id: prefab-place-entity-event
title: PrefabPlaceEntityEvent
sidebar_label: PrefabPlaceEntityEvent
---

# PrefabPlaceEntityEvent

Declenche lorsqu'une entite est placee dans le cadre d'une structure prefab. Cet evenement permet aux plugins d'intercepter et de modifier les entites qui sont generees lorsqu'un prefab est instancie dans le monde.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.prefab.event.PrefabPlaceEntityEvent` |
| **Classe parente** | `EcsEvent` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/prefab/event/PrefabPlaceEntityEvent.java:8` |

## Declaration

```java
public class PrefabPlaceEntityEvent extends EcsEvent {
   private final int prefabId;
   @Nonnull
   private final Holder<EntityStore> holder;
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `prefabId` | `int` | `getPrefabId()` | L'identifiant unique du prefab en cours de placement |
| `holder` | `Holder<EntityStore>` | `getHolder()` | Le conteneur d'entite contenant le magasin d'entite pour l'entite generee |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getPrefabId` | `public int getPrefabId()` | Retourne l'identifiant unique du prefab qui a declenche ce placement d'entite |
| `getHolder` | `@Nonnull public Holder<EntityStore> getHolder()` | Retourne le conteneur d'entite pour l'entite en cours de placement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour quand les entites sont placees via des prefabs
eventBus.register(PrefabPlaceEntityEvent.class, event -> {
    int prefabId = event.getPrefabId();
    Holder<EntityStore> holder = event.getHolder();

    // Journaliser le placement d'entite de prefab
    logger.info("Entite placee depuis le prefab ID: " + prefabId);

    // Acceder au magasin d'entite pour modifier les proprietes de l'entite
    EntityStore entityStore = holder.get();
    if (entityStore != null) {
        // Personnaliser l'entite generee
        // Par exemple, definir des attributs ou des tags personnalises
    }
});

// Enregistrer avec une priorite specifique
eventBus.register(EventPriority.NORMAL, PrefabPlaceEntityEvent.class, event -> {
    // Suivre les entites generees a partir de prefabs specifiques
    if (event.getPrefabId() == DUNGEON_MONSTER_PREFAB_ID) {
        // Appliquer des modifications specifiques au donjon
        Holder<EntityStore> holder = event.getHolder();
        // Ameliorer l'entite pour la difficulte du donjon
    }
});
```

## Cas d'utilisation courants

- Modifier les entites generees a partir de prefabs avant leur initialisation complete
- Suivre quelles entites proviennent de structures prefab specifiques
- Appliquer des attributs ou composants personnalises aux entites generees par prefab
- Journaliser la generation d'entites de prefab pour le debogage ou les analyses
- Implementer une logique de generation personnalisee pour les entites de donjon ou de structure
- Ajouter des tags ou metadonnees aux entites en fonction de leur prefab source

## Evenements lies

- [PrefabPasteEvent](./prefab-paste-event) - Declenche lorsqu'une structure prefab est collee dans le monde
- [EntityRemoveEvent](../entity/entity-remove-event) - Declenche lorsqu'une entite est supprimee du monde

## Reference source

`decompiled/com/hypixel/hytale/server/core/prefab/event/PrefabPlaceEntityEvent.java:8`
