---
id: asset-pack-register-event
title: AssetPackRegisterEvent
sidebar_label: AssetPackRegisterEvent
---

# AssetPackRegisterEvent

Declenche lorsqu'un pack d'assets est enregistre sur le serveur. Cet evenement permet aux plugins de reagir a l'ajout de nouveaux packs d'assets, valider le contenu, ou etendre les fonctionnalites basees sur les assets disponibles.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.AssetPackRegisterEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/AssetPackRegisterEvent.java` |

## Declaration

```java
public class AssetPackRegisterEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `assetPack` | `AssetPack` | `getAssetPack()` | Le pack d'assets en cours d'enregistrement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetPack` | `public AssetPack getAssetPack()` | Retourne le pack d'assets qui est en cours d'enregistrement |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.AssetPackRegisterEvent;
import com.hypixel.hytale.assetstore.AssetPack;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class AssetPackManagerPlugin extends PluginBase {

    private final List<AssetPack> registeredPacks = new ArrayList<>();

    @Override
    public void onEnable() {
        EventBus.register(AssetPackRegisterEvent.class, this::onAssetPackRegister, EventPriority.NORMAL);
    }

    private void onAssetPackRegister(AssetPackRegisterEvent event) {
        AssetPack assetPack = event.getAssetPack();

        // Suivre les packs d'assets enregistres
        registeredPacks.add(assetPack);

        getLogger().info("Pack d'assets enregistre: " + assetPack.getName());

        // Valider le pack d'assets
        validateAssetPack(assetPack);

        // Initialiser les fonctionnalites qui dependent de ce pack
        initializePackFeatures(assetPack);
    }

    private void validateAssetPack(AssetPack assetPack) {
        // Verifier les assets requis
        // Verifier la compatibilite avec les exigences du plugin
    }

    private void initializePackFeatures(AssetPack assetPack) {
        // Activer les fonctionnalites qui necessitent des assets de ce pack
    }

    public List<AssetPack> getRegisteredPacks() {
        return Collections.unmodifiableList(registeredPacks);
    }
}
```

## Quand cet evenement se declenche

Le `AssetPackRegisterEvent` est declenche lorsque :

1. **Demarrage du serveur** - Quand les packs d'assets sont charges pendant l'initialisation du serveur
2. **Enregistrement dynamique** - Quand des packs d'assets sont ajoutes a l'execution
3. **Chargement de mod** - Quand les packs d'assets de mod sont enregistres

L'evenement se declenche **quand** un pack d'assets est enregistre, permettant aux gestionnaires de :
- Suivre les packs d'assets disponibles
- Valider le contenu des packs
- Activer les fonctionnalites dependantes des packs
- Journaliser l'enregistrement pour le debogage

## Comprendre AssetPack

L'objet `AssetPack` represente une collection d'assets de jeu incluant :
- Textures et modeles
- Fichiers audio
- Donnees de configuration
- Scripts et comportements
- Definitions de blocs et d'objets

## Cas d'utilisation

- **Detection de fonctionnalites** : Activer des fonctionnalites de plugin basees sur les packs d'assets disponibles
- **Validation** : Verifier que les assets requis sont presents
- **Compatibilite** : Verifier les conflits entre les packs d'assets
- **Suivi** : Maintenir une liste des ressources disponibles
- **Integration** : Connecter les systemes de plugin aux assets charges

## Evenements lies

- [AssetPackUnregisterEvent](./asset-pack-unregister-event) - Declenche quand un pack d'assets est desenregistre
- [LoadAssetEvent](./load-asset-event) - Declenche pendant le chargement des assets
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche quand les assets finissent de charger

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/AssetPackRegisterEvent.java`
