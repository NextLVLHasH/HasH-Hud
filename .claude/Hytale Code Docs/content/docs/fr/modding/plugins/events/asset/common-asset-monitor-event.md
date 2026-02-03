---
id: common-asset-monitor-event
title: CommonAssetMonitorEvent
sidebar_label: CommonAssetMonitorEvent
---

# CommonAssetMonitorEvent

Declenche lorsque le systeme de surveillance des assets detecte des modifications de fichiers dans les assets communs partages entre tous les magasins d'assets. Cet evenement permet la fonctionnalite de rechargement a chaud specifiquement pour les fichiers d'assets communs/partages.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.common.events.CommonAssetMonitorEvent` |
| **Classe parente** | `AssetMonitorEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/common/events/CommonAssetMonitorEvent.java` |

## Declaration

```java
public class CommonAssetMonitorEvent extends AssetMonitorEvent<Void> {
   public CommonAssetMonitorEvent(
      String assetPack,
      List<Path> createdOrModified,
      List<Path> removed,
      List<Path> createdOrModifiedDirectories,
      List<Path> removedDirectories
   )
```

## Champs herites

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetPack` | `String` | `getAssetPack()` | Le nom du pack d'assets contenant les assets communs |
| `createdOrModifiedFilesToLoad` | `List<Path>` | `getCreatedOrModifiedFilesToLoad()` | Fichiers communs crees ou modifies |
| `removedFilesToUnload` | `List<Path>` | `getRemovedFilesToUnload()` | Fichiers communs supprimes |
| `createdOrModifiedDirectories` | `List<Path>` | `getCreatedOrModifiedDirectories()` | Repertoires communs crees ou modifies |
| `removedFilesAndDirectories` | `List<Path>` | `getRemovedFilesAndDirectories()` | Fichiers et repertoires communs supprimes |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetPack` | `@Nonnull public String getAssetPack()` | Retourne le nom du pack d'assets |
| `getCreatedOrModifiedFilesToLoad` | `@Nonnull public List<Path> getCreatedOrModifiedFilesToLoad()` | Retourne les chemins des fichiers communs nouveaux ou modifies |
| `getRemovedFilesToUnload` | `@Nonnull public List<Path> getRemovedFilesToUnload()` | Retourne les chemins des fichiers communs supprimes |
| `getCreatedOrModifiedDirectories` | `@Nonnull public List<Path> getCreatedOrModifiedDirectories()` | Retourne les chemins des repertoires communs nouveaux ou modifies |
| `getRemovedFilesAndDirectories` | `@Nonnull public List<Path> getRemovedFilesAndDirectories()` | Retourne les chemins de tous les elements communs supprimes |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.common.events.CommonAssetMonitorEvent;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;
import java.nio.file.Path;
import java.util.List;

public class CommonAssetWatcherPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(CommonAssetMonitorEvent.class, this::onCommonAssetChange, EventPriority.NORMAL);
    }

    private void onCommonAssetChange(CommonAssetMonitorEvent event) {
        String assetPack = event.getAssetPack();

        getLogger().info("Modifications d'assets communs detectees dans le pack: " + assetPack);

        // Traiter les fichiers communs crees ou modifies
        List<Path> modified = event.getCreatedOrModifiedFilesToLoad();
        for (Path path : modified) {
            getLogger().info("Fichier commun cree/modifie: " + path);
            handleModifiedCommonAsset(path);
        }

        // Traiter les fichiers communs supprimes
        List<Path> removed = event.getRemovedFilesToUnload();
        for (Path path : removed) {
            getLogger().info("Fichier commun supprime: " + path);
            handleRemovedCommonAsset(path);
        }
    }

    private void handleModifiedCommonAsset(Path path) {
        String fileName = path.getFileName().toString();

        // Gerer differents types d'assets communs
        if (fileName.endsWith(".json")) {
            reloadCommonJsonConfig(path);
        } else if (fileName.endsWith(".lang")) {
            reloadLanguageFile(path);
        }
    }

    private void handleRemovedCommonAsset(Path path) {
        // Nettoyer les references en cache vers les assets supprimes
        invalidateCommonAssetCache(path);
    }
}
```

## Quand cet evenement se declenche

Le `CommonAssetMonitorEvent` est declenche lorsque :

1. **Modifications de fichiers d'assets communs** - Quand des fichiers dans les repertoires d'assets communs sont modifies
2. **Mises a jour de ressources partagees** - Quand des textures, configurations ou fichiers de donnees partages changent
3. **Detection de rechargement a chaud** - Quand le surveillant de fichiers detecte des modifications d'assets communs

L'evenement permet aux gestionnaires de :
- Reagir aux changements dans les assets partages
- Mettre a jour les ressources communes en cache
- Rafraichir les configurations partagees
- Declencher des rechargements d'assets dependants
- Journaliser les modifications d'assets communs

## Difference avec AssetStoreMonitorEvent

| Aspect | CommonAssetMonitorEvent | AssetStoreMonitorEvent |
|--------|------------------------|------------------------|
| **Portee** | Assets communs/partages uniquement | Magasin d'assets specifique |
| **Magasin d'assets** | Pas de reference de magasin specifique | Inclut `getAssetStore()` |
| **Cas d'utilisation** | Ressources globales partagees | Assets specifiques au magasin |

```java
// Gerer les deux types d'evenements pour une surveillance complete
eventBus.register(CommonAssetMonitorEvent.class, event -> {
    // Gerer les changements d'assets communs (partages entre magasins)
    logger.info("Assets communs modifies dans: " + event.getAssetPack());
});

eventBus.register(AssetStoreMonitorEvent.class, event -> {
    // Gerer les changements d'assets specifiques au magasin
    logger.info("Assets du magasin modifies: " + event.getAssetStore().getName());
});
```

## Exemple de structure de repertoires

```java
// Les assets communs peuvent etre organises comme:
// assets/
//   common/              <- CommonAssetMonitorEvent se declenche pour les changements ici
//     textures/
//     lang/
//     config/
//   stores/
//     items/             <- AssetStoreMonitorEvent se declenche pour les changements ici
//     blocks/            <- AssetStoreMonitorEvent se declenche pour les changements ici
```

## Cas d'utilisation courants

- Surveiller les changements dans les fichiers de langue partages
- Detecter les mises a jour des fichiers de configuration communs
- Rechargement a chaud des textures et ressources partagees
- Journaliser les modifications pour le debogage
- Invalidation du cache pour les assets communs
- Declencher des mises a jour de systemes dependants

## Evenements lies

- [AssetStoreMonitorEvent](./asset-store-monitor-event) - Declenche quand des assets specifiques au magasin changent
- [RegisterAssetStoreEvent](./register-asset-store-event) - Declenche lorsqu'un magasin d'assets est enregistre
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche lorsque des assets sont charges
- [SendCommonAssetsEvent](./send-common-assets-event) - Declenche lorsque des assets communs sont envoyes aux clients

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/common/events/CommonAssetMonitorEvent.java`
