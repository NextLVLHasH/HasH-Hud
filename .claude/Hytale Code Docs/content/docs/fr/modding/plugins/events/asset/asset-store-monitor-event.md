---
id: asset-store-monitor-event
title: AssetStoreMonitorEvent
sidebar_label: AssetStoreMonitorEvent
---

# AssetStoreMonitorEvent

Declenche lorsque le systeme de surveillance des assets detecte des modifications de fichiers dans le repertoire d'un magasin d'assets. Cet evenement permet la fonctionnalite de rechargement a chaud en notifiant les plugins des fichiers d'assets crees, modifies ou supprimes.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.AssetStoreMonitorEvent` |
| **Classe parente** | `AssetMonitorEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/AssetStoreMonitorEvent.java:8` |

## Declaration

```java
public class AssetStoreMonitorEvent extends AssetMonitorEvent<Void> {
   @Nonnull
   private final AssetStore<?, ?, ?> assetStore;

   public AssetStoreMonitorEvent(
      @Nonnull String assetPack,
      @Nonnull AssetStore<?, ?, ?> assetStore,
      @Nonnull List<Path> createdOrModified,
      @Nonnull List<Path> removed,
      @Nonnull List<Path> createdOrModifiedDirectories,
      @Nonnull List<Path> removedDirectories
   )
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetStore` | `AssetStore<?, ?, ?>` | `getAssetStore()` | Le magasin d'assets surveille |

## Champs herites

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetPack` | `String` | `getAssetPack()` | Le nom du pack d'assets surveille |
| `createdOrModifiedFilesToLoad` | `List<Path>` | `getCreatedOrModifiedFilesToLoad()` | Fichiers crees ou modifies |
| `removedFilesToUnload` | `List<Path>` | `getRemovedFilesToUnload()` | Fichiers supprimes |
| `createdOrModifiedDirectories` | `List<Path>` | `getCreatedOrModifiedDirectories()` | Repertoires crees ou modifies |
| `removedFilesAndDirectories` | `List<Path>` | `getRemovedFilesAndDirectories()` | Fichiers et repertoires supprimes |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetStore` | `@Nonnull public AssetStore<?, ?, ?> getAssetStore()` | Retourne le magasin d'assets surveille |
| `getAssetPack` | `@Nonnull public String getAssetPack()` | Retourne le nom du pack d'assets |
| `getCreatedOrModifiedFilesToLoad` | `@Nonnull public List<Path> getCreatedOrModifiedFilesToLoad()` | Retourne les chemins des fichiers nouveaux ou modifies |
| `getRemovedFilesToUnload` | `@Nonnull public List<Path> getRemovedFilesToUnload()` | Retourne les chemins des fichiers supprimes |

## Exemple d'utilisation

```java
// Reagir aux modifications de fichiers pour le rechargement a chaud
eventBus.register(AssetStoreMonitorEvent.class, event -> {
    AssetStore<?, ?, ?> store = event.getAssetStore();
    String assetPack = event.getAssetPack();

    logger.info("Modifications de fichiers detectees dans le pack d'assets: " + assetPack);

    // Traiter les fichiers nouveaux ou modifies
    List<Path> modified = event.getCreatedOrModifiedFilesToLoad();
    for (Path path : modified) {
        logger.info("Fichier cree/modifie: " + path);
    }

    // Traiter les fichiers supprimes
    List<Path> removed = event.getRemovedFilesToUnload();
    for (Path path : removed) {
        logger.info("Fichier supprime: " + path);
    }
});

// Implementer une logique de rechargement a chaud personnalisee
eventBus.register(AssetStoreMonitorEvent.class, event -> {
    List<Path> modified = event.getCreatedOrModifiedFilesToLoad();

    // Verifier les types de fichiers specifiques
    for (Path path : modified) {
        String fileName = path.getFileName().toString();
        if (fileName.endsWith(".json")) {
            reloadJsonAsset(path);
        } else if (fileName.endsWith(".png")) {
            reloadTexture(path);
        }
    }
});
```

## Cas d'utilisation courants

- Implementer le rechargement a chaud pour le developpement
- Surveiller les modifications de fichiers d'assets
- Declencher l'invalidation du cache lors des modifications de fichiers
- Journaliser les modifications d'assets pour le debogage
- Compiler automatiquement les assets modifies
- Detecter les nouveaux ajouts de contenu
- Implementer la fonctionnalite d'apercu en direct

## Evenements lies

- [RegisterAssetStoreEvent](./register-asset-store-event) - Declenche lorsqu'un magasin d'assets est enregistre
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche lorsque des assets sont charges
- [RemovedAssetsEvent](./removed-assets-event) - Declenche lorsque des assets sont supprimes

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/AssetStoreMonitorEvent.java:8`
