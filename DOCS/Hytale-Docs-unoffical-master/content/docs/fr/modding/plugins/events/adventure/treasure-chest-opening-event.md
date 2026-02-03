---
id: treasure-chest-opening-event
title: TreasureChestOpeningEvent
sidebar_label: TreasureChestOpeningEvent
---

# TreasureChestOpeningEvent

Declenche lorsqu'un joueur ouvre un coffre au tresor dans le cadre d'un objectif d'aventure. Cet evenement permet aux plugins de suivre les decouvertes de tresors, modifier le comportement du butin, ou implementer des mecaniques de quete personnalisees.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.builtin.adventure.objectives.events.TreasureChestOpeningEvent` |
| **Classe parente** | `IEvent<String>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/builtin/adventure/objectives/events/TreasureChestOpeningEvent.java` |

## Declaration

```java
public class TreasureChestOpeningEvent implements IEvent<String> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `objectiveUUID` | `UUID` | `getObjectiveUUID()` | L'identifiant unique de l'objectif d'aventure associe a ce coffre |
| `chestUUID` | `UUID` | `getChestUUID()` | L'identifiant unique du coffre au tresor ouvert |
| `playerRef` | `Ref<EntityStore>` | `getPlayerRef()` | Reference a l'entite joueur qui ouvre le coffre |
| `store` | `Store<EntityStore>` | `getStore()` | Le store d'entites contenant les donnees du joueur |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getObjectiveUUID` | `@Nonnull public UUID getObjectiveUUID()` | Retourne l'UUID de l'objectif d'aventure auquel ce coffre appartient |
| `getChestUUID` | `@Nonnull public UUID getChestUUID()` | Retourne l'UUID de l'entite coffre au tresor |
| `getPlayerRef` | `@Nonnull public Ref<EntityStore> getPlayerRef()` | Retourne une reference au joueur ouvrant le coffre |
| `getStore` | `@Nonnull public Store<EntityStore> getStore()` | Retourne le store d'entites pour acceder aux composants du joueur |

## Exemple d'utilisation

```java
import com.hypixel.hytale.builtin.adventure.objectives.events.TreasureChestOpeningEvent;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class TreasureTrackerPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(TreasureChestOpeningEvent.class, this::onTreasureChestOpen, EventPriority.NORMAL);
    }

    private void onTreasureChestOpen(TreasureChestOpeningEvent event) {
        UUID objectiveId = event.getObjectiveUUID();
        UUID chestId = event.getChestUUID();
        Ref<EntityStore> playerRef = event.getPlayerRef();

        // Journaliser la decouverte de tresor
        getLogger().info("Joueur a ouvert le coffre " + chestId + " pour l'objectif " + objectiveId);

        // Suivre la progression pour les systemes de quete personnalises
        trackQuestProgress(playerRef, objectiveId);

        // Accorder des recompenses bonus ou declencher des effets speciaux
        grantBonusRewards(playerRef, event.getStore());
    }

    private void trackQuestProgress(Ref<EntityStore> playerRef, UUID objectiveId) {
        // Implementation personnalisee du suivi de quete
    }

    private void grantBonusRewards(Ref<EntityStore> playerRef, Store<EntityStore> store) {
        // Implementation personnalisee des recompenses
    }
}
```

## Quand cet evenement se declenche

Le `TreasureChestOpeningEvent` est declenche lorsque :

1. **Le joueur interagit avec un coffre au tresor** - Quand un joueur ouvre avec succes un coffre au tresor faisant partie d'un objectif d'aventure
2. **Decouverte de coffre liee a une quete** - Quand l'ouverture du coffre est liee a un objectif actif dans le systeme d'aventure

L'evenement se declenche **pendant** le processus d'ouverture du coffre, permettant aux gestionnaires de :
- Suivre quels coffres les joueurs ont decouverts
- Implementer des tables de butin personnalisees ou des recompenses bonus
- Mettre a jour les systemes de progression de quete
- Declencher des succes ou des effets speciaux

## Cas d'utilisation

- **Systemes de quetes** : Suivre quand les joueurs completent des objectifs de recherche de tresors
- **Suivi des succes** : Accorder des succes pour la decouverte de coffres rares
- **Butin personnalise** : Modifier ou ameliorer les drops selon la progression du joueur
- **Statistiques** : Enregistrer les statistiques de chasse au tresor par joueur
- **Declencheurs d'evenements** : Demarrer des evenements speciaux quand certains coffres sont ouverts

## Evenements lies

- [DiscoverInstanceEvent](../instance/discover-instance-event) - Declenche quand un joueur decouvre une nouvelle instance
- [DiscoverZoneEvent](../zone/discover-zone-event) - Declenche quand un joueur decouvre une nouvelle zone

## Reference source

`decompiled/com/hypixel/hytale/builtin/adventure/objectives/events/TreasureChestOpeningEvent.java`
