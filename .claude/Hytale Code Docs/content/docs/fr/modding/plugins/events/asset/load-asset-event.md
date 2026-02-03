---
id: load-asset-event
title: LoadAssetEvent
sidebar_label: LoadAssetEvent
---

# LoadAssetEvent

Declenche pendant la phase de chargement des assets au demarrage du serveur. Cet evenement fournit un mecanisme pour suivre la progression du chargement, signaler les echecs, et optionnellement declencher l'arret du serveur si des assets critiques ne se chargent pas.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.LoadAssetEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/LoadAssetEvent.java` |

## Declaration

```java
public class LoadAssetEvent implements IEvent<Void> {
```

## Constantes de priorite

| Constante | Valeur | Description |
|-----------|--------|-------------|
| `PRIORITY_LOAD_COMMON` | `-32` | Priorite pour charger les assets communs/partages en premier |
| `PRIORITY_LOAD_REGISTRY` | `-16` | Priorite pour charger les assets du registre |
| `PRIORITY_LOAD_LATE` | `64` | Priorite pour les assets qui doivent charger plus tard |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `bootStart` | `long` | `getBootStart()` | Horodatage du debut du processus de demarrage |
| `reasons` | `List<String>` | `getReasons()` | Liste des raisons d'echec si le chargement echoue |
| `shouldShutdown` | `boolean` | `isShouldShutdown()` | Si le serveur doit s'arreter a cause des echecs |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getBootStart` | `public long getBootStart()` | Retourne l'horodatage du debut du demarrage du serveur |
| `isShouldShutdown` | `public boolean isShouldShutdown()` | Retourne vrai si le serveur doit s'arreter |
| `getReasons` | `@Nonnull public List<String> getReasons()` | Retourne la liste des raisons d'echec |
| `failed` | `public void failed(boolean shouldShutdown, String reason)` | Signale un echec de chargement avec indicateur d'arret optionnel |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.LoadAssetEvent;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class AssetValidationPlugin extends PluginBase {

    @Override
    public void onEnable() {
        // Enregistrer avec la priorite appropriee
        EventBus.register(LoadAssetEvent.class, this::onLoadAssets, EventPriority.NORMAL);
    }

    private void onLoadAssets(LoadAssetEvent event) {
        long bootStart = event.getBootStart();
        long elapsed = System.currentTimeMillis() - bootStart;

        getLogger().info("Phase de chargement des assets demarree. Temps ecoule depuis le boot: " + elapsed + "ms");

        // Tenter de charger les assets requis du plugin
        if (!loadPluginAssets()) {
            // Signaler l'echec - erreur critique, doit s'arreter
            event.failed(true, "Echec du chargement des assets critiques du plugin");
            return;
        }

        // Tenter de charger les assets optionnels
        if (!loadOptionalAssets()) {
            // Signaler l'echec - non critique, continuer mais journaliser l'avertissement
            event.failed(false, "Les assets optionnels du plugin n'ont pas pu etre charges");
        }

        // Verifier si d'autres gestionnaires ont signale des echecs
        if (event.isShouldShutdown()) {
            getLogger().error("Le serveur va s'arreter a cause des echecs de chargement d'assets:");
            for (String reason : event.getReasons()) {
                getLogger().error("  - " + reason);
            }
        }
    }

    private boolean loadPluginAssets() {
        // Charger les assets requis
        return true; // Retourner false si le chargement echoue
    }

    private boolean loadOptionalAssets() {
        // Charger les assets optionnels
        return true; // Retourner false si le chargement echoue
    }
}
```

## Quand cet evenement se declenche

Le `LoadAssetEvent` est declenche lorsque :

1. **Demarrage du serveur** - Pendant la phase de chargement des assets de l'initialisation
2. **Apres le debut du boot** - L'horodatage `bootStart` marque quand le boot a commence

L'evenement est utilise par les gestionnaires pour :
- Charger des assets specifiques au plugin
- Valider que les ressources requises existent
- Signaler les echecs critiques
- Suivre la progression du chargement

## Comprendre le systeme d'echec

La methode `failed()` permet aux gestionnaires de signaler les echecs de chargement :

```java
// Echec critique - le serveur doit s'arreter
event.failed(true, "Asset requis 'items.json' non trouve");

// Echec non critique - journaliser mais continuer
event.failed(false, "Pack de textures optionnel non disponible");
```

Plusieurs gestionnaires peuvent signaler des echecs :
- `shouldShutdown` est OU logique ensemble (tout true signifie arret)
- Toutes les raisons sont collectees dans la liste `reasons`

## Systeme de priorite

Utilisez les constantes de priorite pour controler l'ordre de chargement :

```java
// Charger les assets communs en premier
EventBus.register(LoadAssetEvent.class, this::loadCommon,
    LoadAssetEvent.PRIORITY_LOAD_COMMON);

// Charger les donnees du registre en second
EventBus.register(LoadAssetEvent.class, this::loadRegistry,
    LoadAssetEvent.PRIORITY_LOAD_REGISTRY);

// Charger les assets a liaison tardive en dernier
EventBus.register(LoadAssetEvent.class, this::loadLate,
    LoadAssetEvent.PRIORITY_LOAD_LATE);
```

## Cas d'utilisation

- **Chargement d'assets de plugin** : Charger la configuration et les ressources specifiques au plugin
- **Validation** : Verifier que les assets de jeu requis existent
- **Signalement d'erreurs** : Signaler les echecs critiques qui empechent le fonctionnement du serveur
- **Chronometrage** : Suivre combien de temps le processus de demarrage a pris
- **Chargement de dependances** : Charger les assets dans le bon ordre

## Evenements lies

- [BootEvent](../server/boot-event) - Declenche quand le serveur demarre
- [AssetPackRegisterEvent](./asset-pack-register-event) - Declenche quand les packs d'assets s'enregistrent
- [AllWorldsLoadedEvent](../world/all-worlds-loaded-event) - Declenche apres le chargement des mondes

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/LoadAssetEvent.java`
