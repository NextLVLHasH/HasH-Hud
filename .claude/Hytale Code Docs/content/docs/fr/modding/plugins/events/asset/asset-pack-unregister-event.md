---
id: asset-pack-unregister-event
title: AssetPackUnregisterEvent
sidebar_label: AssetPackUnregisterEvent
---

# AssetPackUnregisterEvent

Declenche lorsqu'un pack d'assets est desenregistre du serveur. Cet evenement permet aux plugins de nettoyer les ressources, desactiver les fonctionnalites, ou reagir a la suppression de packs d'assets.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.AssetPackUnregisterEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/AssetPackUnregisterEvent.java` |

## Declaration

```java
public class AssetPackUnregisterEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetPack` | `AssetPack` | `getAssetPack()` | Le pack d'assets en cours de desenregistrement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetPack` | `public AssetPack getAssetPack()` | Retourne le pack d'assets qui est en cours de desenregistrement |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.AssetPackUnregisterEvent;
import com.hypixel.hytale.assetstore.AssetPack;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class AssetCleanupPlugin extends PluginBase {

    private final Map<String, Object> packDependentFeatures = new HashMap<>();

    @Override
    public void onEnable() {
        EventBus.register(AssetPackUnregisterEvent.class, this::onAssetPackUnregister, EventPriority.NORMAL);
    }

    private void onAssetPackUnregister(AssetPackUnregisterEvent event) {
        AssetPack assetPack = event.getAssetPack();

        getLogger().info("Pack d'assets desenregistre: " + assetPack.getName());

        // Nettoyer les ressources associees a ce pack
        cleanupPackResources(assetPack);

        // Desactiver les fonctionnalites qui dependent de ce pack
        disablePackFeatures(assetPack);

        // Notifier les systemes dependants
        notifyDependentSystems(assetPack);
    }

    private void cleanupPackResources(AssetPack assetPack) {
        // Liberer les ressources en cache de ce pack
        packDependentFeatures.remove(assetPack.getName());
    }

    private void disablePackFeatures(AssetPack assetPack) {
        // Desactiver gracieusement les fonctionnalites qui necessitaient ce pack
    }

    private void notifyDependentSystems(AssetPack assetPack) {
        // Informer les autres systemes que le pack n'est plus disponible
    }
}
```

## Quand cet evenement se declenche

Le `AssetPackUnregisterEvent` est declenche lorsque :

1. **Arret du serveur** - Quand les packs d'assets sont nettoyes pendant l'arret
2. **Dechargement dynamique** - Quand les packs d'assets sont supprimes a l'execution
3. **Rechargement a chaud** - Quand les packs d'assets sont recharges (desenregistrement puis enregistrement)

L'evenement se declenche **quand** un pack d'assets est en cours de suppression, permettant aux gestionnaires de :
- Nettoyer les ressources en cache
- Desactiver les fonctionnalites dependantes du pack
- Mettre a jour le suivi interne
- Effectuer une degradation gracieuse

## Comprendre AssetPack

L'objet `AssetPack` represente une collection d'assets de jeu qui est en cours de suppression, incluant :
- Textures et modeles
- Fichiers audio
- Donnees de configuration
- Scripts et comportements
- Definitions de blocs et d'objets

## Cas d'utilisation

- **Nettoyage de ressources** : Liberer la memoire et les ressources liees au pack
- **Desactivation de fonctionnalites** : Desactiver gracieusement les fonctionnalites qui necessitent le pack
- **Prevention d'erreurs** : Empecher l'acces aux assets non disponibles
- **Suivi** : Mettre a jour les listes internes de packs disponibles
- **Support du rechargement a chaud** : Gerer correctement les mises a jour de packs d'assets

## Evenements lies

- [AssetPackRegisterEvent](./asset-pack-register-event) - Declenche quand un pack d'assets est enregistre
- [RemovedAssetsEvent](./removed-assets-event) - Declenche quand des assets sont supprimes

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/AssetPackUnregisterEvent.java`
