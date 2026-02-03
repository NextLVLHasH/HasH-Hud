---
id: singleplayer-request-access-event
title: SingleplayerRequestAccessEvent
sidebar_label: SingleplayerRequestAccessEvent
---

# SingleplayerRequestAccessEvent

Declenche lorsqu'une session solo demande l'acces au serveur. Cet evenement permet aux plugins d'intercepter, valider ou modifier les demandes d'acces pour les sessions de jeu en solo.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.singleplayer.SingleplayerRequestAccessEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/modules/singleplayer/SingleplayerRequestAccessEvent.java` |

## Declaration

```java
public class SingleplayerRequestAccessEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `access` | `Access` | `getAccess()` | L'objet de demande d'acces contenant les informations de session |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAccess` | `public Access getAccess()` | Retourne l'objet de demande d'acces pour la session solo |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de l'evenement incluant l'objet d'acces |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.modules.singleplayer.SingleplayerRequestAccessEvent;
import com.hypixel.hytale.protocol.packets.serveraccess.Access;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class SingleplayerAccessPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(SingleplayerRequestAccessEvent.class, this::onRequestAccess, EventPriority.NORMAL);
    }

    private void onRequestAccess(SingleplayerRequestAccessEvent event) {
        Access access = event.getAccess();

        // Journaliser la demande d'acces
        getLogger().info("Acces solo demande: " + access.toString());

        // Valider la demande d'acces
        if (!validateAccess(access)) {
            getLogger().warn("Demande d'acces solo invalide");
            return;
        }

        // Initialiser les fonctionnalites specifiques au solo
        initializeSingleplayerFeatures(access);

        // Appliquer des modifications d'acces personnalisees
        customizeAccessPermissions(access);
    }

    private boolean validateAccess(Access access) {
        // Effectuer la validation sur la demande d'acces
        return true;
    }

    private void initializeSingleplayerFeatures(Access access) {
        // Configurer les fonctionnalites specifiques au mode solo
        // Cela peut inclure :
        // - Fonctionnalite de pause
        // - Gestion des sauvegardes locales
        // - Fonctionnalites du mode hors ligne
    }

    private void customizeAccessPermissions(Access access) {
        // Modifier les permissions pour le solo
        // Le solo pourrait accorder des permissions supplementaires
    }
}
```

## Quand cet evenement se declenche

Le `SingleplayerRequestAccessEvent` est declenche lorsque :

1. **Demarrage d'une partie solo** - Quand un joueur demarre une session solo
2. **Initialisation du serveur local** - Quand le serveur integre recoit une demande d'acces
3. **Reprise de session** - Lors du retour a un monde solo

L'evenement permet aux gestionnaires de :
- Valider les demandes d'acces solo
- Initialiser des fonctionnalites specifiques au solo
- Appliquer des permissions personnalisees pour le jeu local
- Suivre les demarrages de sessions solo

## Comprendre Access

L'objet `Access` represente la demande d'acces au serveur et peut contenir :
- Donnees d'authentification de session
- Informations d'identite du joueur
- Permissions et capacites demandees
- Options de configuration de session

## Solo vs Multijoueur

En mode solo :
- Le serveur fonctionne localement/de maniere integree
- La latence reseau est minimale
- Le joueur a typiquement des permissions elevees
- La fonctionnalite de pause peut etre disponible
- Les donnees du monde sont stockees localement

## Cas d'utilisation

- **Gestion des permissions** : Accorder toutes les permissions en solo
- **Initialisation de fonctionnalites** : Activer les fonctionnalites solo uniquement
- **Suivi de session** : Surveiller quand les parties solo demarrent
- **Stockage local** : Initialiser les systemes de sauvegarde locaux
- **Support de la pause** : Configurer la fonctionnalite de pause

## Evenements lies

- [PlayerConnectEvent](../player/player-connect-event) - Declenche quand n'importe quel joueur se connecte
- [BootEvent](../server/boot-event) - Declenche quand le serveur demarre
- [PlayerReadyEvent](../player/player-ready-event) - Declenche quand un joueur est pret a jouer

## Reference source

`decompiled/com/hypixel/hytale/server/core/modules/singleplayer/SingleplayerRequestAccessEvent.java`
