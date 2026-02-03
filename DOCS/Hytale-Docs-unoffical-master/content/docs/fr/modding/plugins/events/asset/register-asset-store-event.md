---
id: register-asset-store-event
title: RegisterAssetStoreEvent
sidebar_label: RegisterAssetStoreEvent
---

# RegisterAssetStoreEvent

Declenche lorsqu'un nouveau magasin d'assets est enregistre dans le systeme d'assets. Cet evenement permet aux plugins de reagir a l'ajout de nouveaux magasins d'assets, permettant l'enregistrement et l'initialisation de contenu dynamique.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.RegisterAssetStoreEvent` |
| **Classe parente** | `AssetStoreEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/RegisterAssetStoreEvent.java:6` |

## Declaration

```java
public class RegisterAssetStoreEvent extends AssetStoreEvent<Void> {
   public RegisterAssetStoreEvent(@Nonnull AssetStore<?, ?, ?> assetStore) {
      super(assetStore);
   }
}
```

## Champs herites

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetStore` | `AssetStore<?, ?, ?>` | `getAssetStore()` | Le magasin d'assets en cours d'enregistrement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetStore` | `@Nonnull public AssetStore<?, ?, ?> getAssetStore()` | Retourne le magasin d'assets en cours d'enregistrement |

## Exemple d'utilisation

```java
// Ecouter l'enregistrement de nouveaux magasins d'assets
eventBus.register(RegisterAssetStoreEvent.class, event -> {
    AssetStore<?, ?, ?> store = event.getAssetStore();

    // Journaliser l'enregistrement
    logger.info("Nouveau magasin d'assets enregistre: " + store.getClass().getSimpleName());

    // Effectuer l'initialisation selon le type de magasin
    if (store instanceof BlockTypeStore) {
        initializeCustomBlocks((BlockTypeStore) store);
    }
});

// Suivre tous les magasins d'assets enregistres
eventBus.register(RegisterAssetStoreEvent.class, event -> {
    AssetStore<?, ?, ?> store = event.getAssetStore();
    registeredStores.add(store);
});
```

## Cas d'utilisation courants

- Suivre quand de nouveaux magasins d'assets deviennent disponibles
- Initialiser la gestion d'assets specifique au plugin
- Enregistrer des assets personnalises apres la creation d'un magasin
- Configurer des ecouteurs ou moniteurs de magasins d'assets
- Valider les configurations des magasins d'assets
- Creer des index ou caches de magasins d'assets

## Evenements lies

- [RemoveAssetStoreEvent](./remove-asset-store-event) - Declenche lorsqu'un magasin d'assets est supprime
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche lorsque des assets sont charges dans un magasin
- [GenerateAssetsEvent](./generate-assets-event) - Declenche pour generer des assets derives

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/RegisterAssetStoreEvent.java:6`
