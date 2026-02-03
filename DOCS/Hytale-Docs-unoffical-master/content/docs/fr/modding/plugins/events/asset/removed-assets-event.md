---
id: removed-assets-event
title: RemovedAssetsEvent
sidebar_label: RemovedAssetsEvent
---

# RemovedAssetsEvent

Declenche lorsque des assets ont ete supprimes d'un magasin d'assets. Cet evenement fournit des informations sur les assets supprimes et s'ils ont ete remplaces par de nouvelles versions, permettant aux plugins de nettoyer les references et de mettre a jour leur etat en consequence.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.RemovedAssetsEvent` |
| **Classe parente** | `AssetsEvent<K, T>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/RemovedAssetsEvent.java:9` |

## Declaration

```java
public class RemovedAssetsEvent<K, T extends JsonAsset<K>, M extends AssetMap<K, T>> extends AssetsEvent<K, T> {
   private final Class<T> tClass;
   private final M assetMap;
   @Nonnull
   private final Set<K> removedAssets;
   private final boolean replaced;
```

## Parametres de type

| Parametre | Description |
|-----------|-------------|
| `K` | Le type de cle utilise pour identifier les assets |
| `T` | Le type d'asset, doit etendre `JsonAsset<K>` |
| `M` | Le type de map d'assets, doit etendre `AssetMap<K, T>` |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `tClass` | `Class<T>` | `getAssetClass()` | Le type de classe des assets supprimes |
| `assetMap` | `M` | `getAssetMap()` | La map d'assets d'ou les assets ont ete supprimes |
| `removedAssets` | `Set<K>` | `getRemovedAssets()` | Ensemble non modifiable des cles des assets supprimes |
| `replaced` | `boolean` | `isReplaced()` | Indique si les assets ont ete remplaces par de nouvelles versions |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetClass` | `public Class<T> getAssetClass()` | Retourne le type de classe des assets supprimes |
| `getAssetMap` | `public M getAssetMap()` | Retourne la map d'assets pour ce type d'asset |
| `getRemovedAssets` | `@Nonnull public Set<K> getRemovedAssets()` | Retourne un ensemble non modifiable des cles d'assets supprimes |
| `isReplaced` | `public boolean isReplaced()` | Retourne true si les assets ont ete remplaces, false si supprimes definitivement |

## Exemple d'utilisation

```java
// Nettoyer lors de la suppression d'assets
eventBus.register(RemovedAssetsEvent.class, event -> {
    Set<?> removed = event.getRemovedAssets();

    logger.info("Supprime " + removed.size() + " assets de type " +
                event.getAssetClass().getSimpleName());

    // Verifier si c'est un remplacement ou une suppression definitive
    if (event.isReplaced()) {
        logger.info("Les assets ont ete remplaces par de nouvelles versions");
    } else {
        logger.info("Les assets ont ete supprimes definitivement");
        // Nettoyer les references a ces assets
        for (Object key : removed) {
            assetReferences.remove(key);
        }
    }
});

// Gerer la suppression de types d'assets specifiques
eventBus.register(RemovedAssetsEvent.class, event -> {
    if (event.getAssetClass() == ItemType.class) {
        @SuppressWarnings("unchecked")
        Set<String> removedItems = (Set<String>) event.getRemovedAssets();

        for (String itemKey : removedItems) {
            // Nettoyer les donnees liees aux items
            itemCache.invalidate(itemKey);
            recipeManager.removeItemRecipes(itemKey);
        }
    }
});
```

## Cas d'utilisation courants

- Nettoyer les references en cache vers les assets supprimes
- Invalider les caches dependants des assets
- Mettre a jour les elements d'interface qui affichent des assets
- Gerer les scenarios de rechargement a chaud pendant le developpement
- Supprimer les references de recettes ou de fabrication
- Nettoyer les configurations d'apparition d'entites

## Evenements lies

- [LoadedAssetsEvent](./loaded-assets-event) - Declenche lorsque des assets sont charges dans un magasin
- [RemoveAssetStoreEvent](./remove-asset-store-event) - Declenche lorsqu'un magasin d'assets entier est supprime
- [GenerateAssetsEvent](./generate-assets-event) - Declenche pour generer des assets derives

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/RemovedAssetsEvent.java:9`
