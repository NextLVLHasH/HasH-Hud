---
id: send-common-assets-event
title: SendCommonAssetsEvent
sidebar_label: SendCommonAssetsEvent
---

# SendCommonAssetsEvent

Declenche de maniere asynchrone lorsque des assets communs sont envoyes a un client. Cet evenement permet aux plugins d'intercepter, modifier ou suivre les transferts d'assets pendant le processus de connexion client.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.common.events.SendCommonAssetsEvent` |
| **Classe parente** | `IAsyncEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Oui |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/common/events/SendCommonAssetsEvent.java` |

## Declaration

```java
public class SendCommonAssetsEvent implements IAsyncEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `packetHandler` | `PacketHandler` | `getPacketHandler()` | Le gestionnaire de paquets pour la connexion client |
| `assets` | `Asset[]` | `getRequestedAssets()` | Tableau des assets envoyes au client |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getPacketHandler` | `public PacketHandler getPacketHandler()` | Retourne le gestionnaire de paquets gerant la connexion client |
| `getRequestedAssets` | `public Asset[] getRequestedAssets()` | Retourne le tableau des assets en cours de transfert |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.common.events.SendCommonAssetsEvent;
import com.hypixel.hytale.protocol.Asset;
import com.hypixel.hytale.server.core.io.PacketHandler;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class AssetTransferMonitorPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(SendCommonAssetsEvent.class, this::onSendCommonAssets, EventPriority.NORMAL);
    }

    private void onSendCommonAssets(SendCommonAssetsEvent event) {
        PacketHandler packetHandler = event.getPacketHandler();
        Asset[] assets = event.getRequestedAssets();

        // Journaliser les informations de transfert d'assets
        getLogger().info("Envoi de " + assets.length + " assets communs au client");

        // Suivre l'utilisation de la bande passante
        long totalSize = calculateTotalSize(assets);
        getLogger().debug("Taille totale du transfert d'assets: " + totalSize + " octets");

        // Surveiller des assets specifiques
        for (Asset asset : assets) {
            trackAssetTransfer(packetHandler, asset);
        }
    }

    private long calculateTotalSize(Asset[] assets) {
        long total = 0;
        for (Asset asset : assets) {
            total += asset.getSize();
        }
        return total;
    }

    private void trackAssetTransfer(PacketHandler handler, Asset asset) {
        // Suivre les transferts d'assets individuels pour l'analytique
    }
}
```

## Quand cet evenement se declenche

Le `SendCommonAssetsEvent` est declenche lorsque :

1. **Connexion client** - Quand un client se connecte et demande des assets communs
2. **Synchronisation d'assets** - Quand le serveur envoie des assets partages/communs aux clients

Puisque c'est un **evenement asynchrone**, il se declenche sur un thread d'arriere-plan, permettant aux gestionnaires de :
- Surveiller les transferts d'assets sans bloquer
- Journaliser les statistiques de transfert
- Suivre l'utilisation de la bande passante
- Effectuer une validation asynchrone

## Comprendre les evenements asynchrones

En tant que `IAsyncEvent`, cet evenement :
- Se declenche sur un thread separe du thread principal du serveur
- Ne devrait pas effectuer d'operations bloquantes sur le thread principal
- Est adapte aux operations limitees par l'I/O comme la journalisation
- Ne peut pas annuler ou bloquer le transfert d'assets

## Comprendre les assets communs

Les assets communs sont des ressources partagees dont plusieurs clients ont besoin, incluant :
- Textures et modeles de base du jeu
- Donnees de configuration partagees
- Regles et definitions universelles du jeu
- Schemas requis par le client

## Cas d'utilisation

- **Surveillance de bande passante** : Suivre les donnees envoyees aux clients
- **Analytique** : Surveiller quels assets sont frequemment transferes
- **Debogage** : Journaliser les transferts d'assets pour le depannage
- **Limitation de debit** : Implementer une logique de throttling personnalisee
- **Analyse de cache** : Comprendre les patterns de distribution d'assets

## Evenements lies

- [PlayerConnectEvent](../player/player-connect-event) - Declenche quand un joueur se connecte
- [LoadedAssetsEvent](./loaded-assets-event) - Declenche quand les assets finissent de charger
- [AssetPackRegisterEvent](./asset-pack-register-event) - Declenche quand les packs d'assets s'enregistrent

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/common/events/SendCommonAssetsEvent.java`
