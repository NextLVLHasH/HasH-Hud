---
id: discover-zone-event
title: DiscoverZoneEvent
sidebar_label: DiscoverZoneEvent
---

# DiscoverZoneEvent

Declenche lorsqu'un joueur decouvre une nouvelle zone dans le monde. Les zones sont des zones nommees dans le monde du jeu que les joueurs peuvent explorer. Cette classe d'evenement abstraite fournit des informations sur la decouverte de zone et contient un evenement Display imbrique qui permet de controler la notification de decouverte.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.DiscoverZoneEvent` |
| **Classe parente** | `EcsEvent` |
| **Annulable** | Non (classe de base) |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/ecs/DiscoverZoneEvent.java:8` |

## Declaration

```java
public abstract class DiscoverZoneEvent extends EcsEvent {
   @Nonnull
   private final WorldMapTracker.ZoneDiscoveryInfo discoveryInfo;
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `discoveryInfo` | `WorldMapTracker.ZoneDiscoveryInfo` | `getDiscoveryInfo()` | Informations sur la zone en cours de decouverte |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getDiscoveryInfo` | `@Nonnull public WorldMapTracker.ZoneDiscoveryInfo getDiscoveryInfo()` | Retourne les informations de decouverte pour cette zone |

## Classes d'evenements imbriquees

### DiscoverZoneEvent.Display

Declenche lorsque la notification de decouverte de zone est sur le point d'etre affichee. Cet evenement annulable permet aux plugins de controler si le popup de decouverte de zone est affiche au joueur.

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.DiscoverZoneEvent.Display` |
| **Classe parente** | `DiscoverZoneEvent` |
| **Implemente** | `ICancellableEcsEvent` |
| **Annulable** | Oui |

#### Declaration

```java
public static class Display extends DiscoverZoneEvent implements ICancellableEcsEvent {
   private boolean cancelled = false;
```

#### Champs supplementaires

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `cancelled` | `boolean` | `isCancelled()` / `setCancelled()` | Si l'evenement est annule |

#### Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `isCancelled` | `public boolean isCancelled()` | Retourne si cet evenement a ete annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Definit l'etat d'annulation de cet evenement |

## Exemple d'utilisation

```java
// Gerer les evenements d'affichage de decouverte de zone
eventBus.register(DiscoverZoneEvent.Display.class, event -> {
    WorldMapTracker.ZoneDiscoveryInfo info = event.getDiscoveryInfo();

    // Journaliser la decouverte de zone
    logger.info("Joueur a decouvert la zone: " + info.getZoneName());

    // Verifier si nous voulons supprimer l'affichage
    if (isZoneDisplaySuppressed(info)) {
        event.setCancelled(true);
    }
});

// Suivre les decouvertes de zones pour les succes
eventBus.register(DiscoverZoneEvent.Display.class, event -> {
    WorldMapTracker.ZoneDiscoveryInfo info = event.getDiscoveryInfo();

    // Attribuer le succes d'exploration
    achievementManager.checkZoneDiscovery(info.getZoneName());

    // Mettre a jour les zones explorees du joueur
    playerData.addDiscoveredZone(info);
});

// Notifications personnalisees de decouverte de zone
eventBus.register(DiscoverZoneEvent.Display.class, event -> {
    WorldMapTracker.ZoneDiscoveryInfo info = event.getDiscoveryInfo();

    // Envoyer une notification personnalisee selon le type de zone
    if (isDangerousZone(info)) {
        player.sendMessage("Attention: Vous entrez dans une zone dangereuse !");
    }
});

// Implementer le suivi du pourcentage d'exploration
eventBus.register(DiscoverZoneEvent.Display.class, event -> {
    WorldMapTracker.ZoneDiscoveryInfo info = event.getDiscoveryInfo();

    // Mettre a jour la progression d'exploration
    int totalZones = worldZoneManager.getTotalZoneCount();
    int discoveredZones = playerData.getDiscoveredZoneCount() + 1;
    float explorationPercent = (float) discoveredZones / totalZones * 100;

    logger.info("Progression d'exploration: " + explorationPercent + "%");
});

// Masquer la decouverte de zone pour les joueurs qui revisitent
eventBus.register(DiscoverZoneEvent.Display.class, event -> {
    WorldMapTracker.ZoneDiscoveryInfo info = event.getDiscoveryInfo();

    // Ne pas afficher le popup pour les zones deja decouvertes
    if (playerData.hasDiscoveredZone(info.getZoneName())) {
        event.setCancelled(true);
    }
});
```

## Cas d'utilisation courants

- Suivre la progression d'exploration du joueur a travers la carte du monde
- Implementer des succes et recompenses de decouverte de zone
- Personnaliser les notifications de decouverte de zone
- Creer des quetes et objectifs bases sur l'exploration
- Masquer les notifications de decouverte de zone repetees
- Journaliser les decouvertes de zones pour les analyses
- Declencher des evenements specifiques a la zone quand les joueurs entrent dans de nouvelles zones
- Implementer le brouillard de guerre ou les mecaniques de revelation de carte
- Ajouter des sons ou effets personnalises pour la decouverte de zone
- Creer des recompenses d'exploration par paliers

## Evenements lies

- [DiscoverInstanceEvent](../instance/discover-instance-event) - Declenche lorsqu'un joueur decouvre une nouvelle instance
- [AddPlayerToWorldEvent](../player/add-player-to-world-event) - Declenche lorsqu'un joueur est ajoute a un monde
- [StartWorldEvent](../world/start-world-event) - Declenche lorsqu'un monde demarre

## Reference source

`decompiled/com/hypixel/hytale/server/core/event/events/ecs/DiscoverZoneEvent.java:8`
