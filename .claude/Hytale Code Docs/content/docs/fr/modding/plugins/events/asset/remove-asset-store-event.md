---
id: remove-asset-store-event
title: RemoveAssetStoreEvent
sidebar_label: RemoveAssetStoreEvent
---

# RemoveAssetStoreEvent

Declenche lorsqu'un magasin d'assets est en cours de suppression du systeme d'assets. Cet evenement permet aux plugins d'effectuer des operations de nettoyage et de liberer les ressources associees au magasin d'assets avant sa desenregistrement.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.RemoveAssetStoreEvent` |
| **Classe parente** | `AssetStoreEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/RemoveAssetStoreEvent.java:6` |

## Declaration

```java
public class RemoveAssetStoreEvent extends AssetStoreEvent<Void> {
   public RemoveAssetStoreEvent(@Nonnull AssetStore<?, ?, ?> assetStore) {
      super(assetStore);
   }
}
```

## Champs herites

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetStore` | `AssetStore<?, ?, ?>` | `getAssetStore()` | Le magasin d'assets en cours de suppression |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetStore` | `@Nonnull public AssetStore<?, ?, ?> getAssetStore()` | Retourne le magasin d'assets en cours de suppression |

## Exemple d'utilisation

```java
// Nettoyer lors de la suppression d'un magasin d'assets
eventBus.register(RemoveAssetStoreEvent.class, event -> {
    AssetStore<?, ?, ?> store = event.getAssetStore();

    // Journaliser la suppression
    logger.info("Magasin d'assets en cours de suppression: " + store.getClass().getSimpleName());

    // Nettoyer toutes les donnees en cache pour ce magasin
    assetCache.removeStore(store);
});

// Liberer les ressources associees au magasin
eventBus.register(RemoveAssetStoreEvent.class, event -> {
    AssetStore<?, ?, ?> store = event.getAssetStore();

    // Retirer du suivi
    registeredStores.remove(store);

    // Nettoyer les ecouteurs
    storeListeners.remove(store);
});
```

## Cas d'utilisation courants

- Nettoyer les assets en cache lors de la suppression d'un magasin
- Liberer la memoire et les ressources
- Supprimer les ecouteurs associes au magasin
- Mettre a jour l'etat interne pour refleter la suppression du magasin
- Journaliser les evenements du cycle de vie des magasins d'assets
- Effectuer une validation finale ou une sauvegarde avant la suppression

## Evenements lies

- [RegisterAssetStoreEvent](./register-asset-store-event) - Declenche lorsqu'un magasin d'assets est enregistre
- [RemovedAssetsEvent](./removed-assets-event) - Declenche lorsque des assets specifiques sont supprimes d'un magasin
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche lorsque des assets sont charges dans un magasin

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/RemoveAssetStoreEvent.java:6`
