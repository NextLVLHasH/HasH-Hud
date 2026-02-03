---
id: loaded-assets-event
title: LoadedAssetsEvent
sidebar_label: LoadedAssetsEvent
---

# LoadedAssetsEvent

Declenche lorsque des assets ont ete charges avec succes dans un magasin d'assets. Cet evenement generique fournit un acces aux assets charges et aux metadonnees sur le processus de chargement, permettant aux plugins de reagir a la disponibilite de nouveau contenu.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.LoadedAssetsEvent` |
| **Classe parente** | `AssetsEvent<K, T>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/LoadedAssetsEvent.java:10` |

## Declaration

```java
public class LoadedAssetsEvent<K, T extends JsonAsset<K>, M extends AssetMap<K, T>> extends AssetsEvent<K, T> {
   @Nonnull
   private final Class<T> tClass;
   @Nonnull
   private final M assetMap;
   @Nonnull
   private final Map<K, T> loadedAssets;
   private final boolean initial;
   @Nonnull
   private final AssetUpdateQuery query;
```

## Parametres de type

| Parametre | Description |
|-----------|-------------|
| `K` | Le type de cle utilise pour identifier les assets (ex: String, ResourceLocation) |
| `T` | Le type d'asset, doit etendre `JsonAsset<K>` |
| `M` | Le type de map d'assets, doit etendre `AssetMap<K, T>` |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `tClass` | `Class<T>` | `getAssetClass()` | Le type de classe des assets charges |
| `assetMap` | `M` | `getAssetMap()` | La map d'assets contenant tous les assets de ce type |
| `loadedAssets` | `Map<K, T>` | `getLoadedAssets()` | Map non modifiable des assets nouvellement charges |
| `initial` | `boolean` | `isInitial()` | Indique si c'est le chargement initial ou un rechargement |
| `query` | `AssetUpdateQuery` | `getQuery()` | La requete qui a declenche cette operation de chargement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetClass` | `public Class<T> getAssetClass()` | Retourne le type de classe des assets charges |
| `getAssetMap` | `public M getAssetMap()` | Retourne la map d'assets pour ce type d'asset |
| `getLoadedAssets` | `@Nonnull public Map<K, T> getLoadedAssets()` | Retourne une map non modifiable des assets nouvellement charges |
| `isInitial` | `public boolean isInitial()` | Retourne true si c'est le chargement initial, false pour les rechargements |
| `getQuery` | `@Nonnull public AssetUpdateQuery getQuery()` | Retourne la requete qui a declenche le chargement |

## Exemple d'utilisation

```java
// Reagir aux assets nouvellement charges
eventBus.register(LoadedAssetsEvent.class, event -> {
    Map<?, ?> loaded = event.getLoadedAssets();

    logger.info("Charge " + loaded.size() + " assets de type " +
                event.getAssetClass().getSimpleName());

    // Verifier si c'est un chargement initial ou un rechargement a chaud
    if (event.isInitial()) {
        logger.info("Chargement initial des assets termine");
    } else {
        logger.info("Assets recharges - mise a jour des caches");
        refreshCaches(event.getAssetMap());
    }
});

// Gerer des types d'assets specifiques
eventBus.register(LoadedAssetsEvent.class, event -> {
    if (event.getAssetClass() == BlockType.class) {
        @SuppressWarnings("unchecked")
        Map<String, BlockType> blocks = (Map<String, BlockType>) event.getLoadedAssets();

        for (Map.Entry<String, BlockType> entry : blocks.entrySet()) {
            processNewBlock(entry.getKey(), entry.getValue());
        }
    }
});
```

## Cas d'utilisation courants

- Traiter le contenu de jeu nouvellement charge
- Mettre a jour les caches lors du rechargement des assets
- Valider que les assets charges repondent aux exigences
- Initialiser les fonctionnalites du plugin en fonction des assets disponibles
- Suivre le chargement des assets pour le debogage
- Implementer la fonctionnalite de rechargement a chaud pour le developpement

## Evenements lies

- [RemovedAssetsEvent](./removed-assets-event) - Declenche lorsque des assets sont supprimes d'un magasin
- [GenerateAssetsEvent](./generate-assets-event) - Declenche pour generer des assets derives a partir de ceux charges
- [RegisterAssetStoreEvent](./register-asset-store-event) - Declenche lorsqu'un magasin d'assets est enregistre

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/LoadedAssetsEvent.java:10`
