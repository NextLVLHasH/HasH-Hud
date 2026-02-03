---
id: discover-instance-event
title: DiscoverInstanceEvent
sidebar_label: DiscoverInstanceEvent
---

# DiscoverInstanceEvent

Declenche lorsqu'un joueur decouvre une nouvelle instance (comme un donjon ou une instance de monde speciale). Cette classe d'evenement abstraite contient un evenement Display imbrique qui permet de controler si la notification de decouverte est affichee au joueur.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.builtin.instances.event.DiscoverInstanceEvent` |
| **Classe parente** | `EcsEvent` |
| **Annulable** | Non (classe de base) |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/builtin/instances/event/DiscoverInstanceEvent.java:9` |

## Declaration

```java
public abstract class DiscoverInstanceEvent extends EcsEvent {
   @Nonnull
   private final UUID instanceWorldUuid;
   @Nonnull
   private final InstanceDiscoveryConfig discoveryConfig;
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `instanceWorldUuid` | `UUID` | `getInstanceWorldUuid()` | L'identifiant unique du monde d'instance decouvert |
| `discoveryConfig` | `InstanceDiscoveryConfig` | `getDiscoveryConfig()` | Configuration pour la decouverte d'instance (parametres d'affichage, etc.) |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getInstanceWorldUuid` | `@Nonnull public UUID getInstanceWorldUuid()` | Retourne l'UUID du monde d'instance decouvert |
| `getDiscoveryConfig` | `@Nonnull public InstanceDiscoveryConfig getDiscoveryConfig()` | Retourne la configuration de decouverte pour cette instance |

## Classes d'evenements imbriquees

### DiscoverInstanceEvent.Display

Declenche lorsque la notification de decouverte d'instance est sur le point d'etre affichee. Cet evenement annulable permet aux plugins de controler si le popup de decouverte est affiche et de personnaliser le comportement d'affichage.

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.builtin.instances.event.DiscoverInstanceEvent.Display` |
| **Classe parente** | `DiscoverInstanceEvent` |
| **Implemente** | `ICancellableEcsEvent` |
| **Annulable** | Oui |

#### Declaration

```java
public static class Display extends DiscoverInstanceEvent implements ICancellableEcsEvent {
   private boolean cancelled = false;
   private boolean display;
```

#### Champs supplementaires

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `cancelled` | `boolean` | `isCancelled()` / `setCancelled()` | Si l'evenement est annule |
| `display` | `boolean` | `shouldDisplay()` / `setDisplay()` | Si la notification de decouverte doit etre affichee |

#### Methodes supplementaires

| Methode | Signature | Description |
|---------|-----------|-------------|
| `isCancelled` | `public boolean isCancelled()` | Retourne si cet evenement a ete annule |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Definit l'etat d'annulation de cet evenement |
| `shouldDisplay` | `public boolean shouldDisplay()` | Retourne si la notification de decouverte doit etre affichee |
| `setDisplay` | `public void setDisplay(boolean display)` | Definit si la notification de decouverte doit etre affichee |

## Exemple d'utilisation

```java
// Gerer les evenements d'affichage de decouverte d'instance
eventBus.register(DiscoverInstanceEvent.Display.class, event -> {
    UUID instanceUuid = event.getInstanceWorldUuid();
    InstanceDiscoveryConfig config = event.getDiscoveryConfig();

    // Journaliser la decouverte
    logger.info("Joueur a decouvert l'instance: " + instanceUuid);

    // Verifier si nous devons afficher la notification
    if (!event.shouldDisplay()) {
        return;
    }

    // Optionnellement masquer l'affichage pour certaines instances
    if (isHiddenInstance(instanceUuid)) {
        event.setDisplay(false);
    }
});

// Annuler les notifications de decouverte pour certains joueurs
eventBus.register(DiscoverInstanceEvent.Display.class, event -> {
    // Ne pas afficher les popups de decouverte pour les joueurs qui ont deja visite
    if (playerHasVisitedInstance(event.getInstanceWorldUuid())) {
        event.setCancelled(true);
    }
});

// Suivre les decouvertes d'instances pour les succes
eventBus.register(DiscoverInstanceEvent.Display.class, event -> {
    UUID instanceUuid = event.getInstanceWorldUuid();
    InstanceDiscoveryConfig config = event.getDiscoveryConfig();

    // Attribuer le succes de decouverte
    achievementManager.checkInstanceDiscovery(instanceUuid);

    // Mettre a jour la liste des instances decouvertes du joueur
    playerData.addDiscoveredInstance(instanceUuid);
});

// Personnaliser l'affichage selon le type d'instance
eventBus.register(DiscoverInstanceEvent.Display.class, event -> {
    InstanceDiscoveryConfig config = event.getDiscoveryConfig();

    // Afficher la notification uniquement pour les decouvertes significatives
    if (!config.isDisplay()) {
        event.setDisplay(false);
    }
});
```

## Cas d'utilisation courants

- Suivre quelles instances les joueurs ont decouvertes
- Implementer des succes de decouverte d'instances
- Personnaliser les notifications de decouverte selon le type d'instance
- Masquer les popups de decouverte pour les instances revisitees
- Journaliser les decouvertes d'instances pour les analyses
- Declencher des evenements personnalises quand les joueurs trouvent de nouveaux donjons
- Implementer des systemes de deblocage progressif d'instances
- Creer des animations ou sons de decouverte personnalises

## Evenements lies

- [DiscoverZoneEvent](../zone/discover-zone-event) - Declenche lorsqu'un joueur decouvre une nouvelle zone
- [AddWorldEvent](../world/add-world-event) - Declenche lorsqu'un monde est ajoute a l'univers
- [AddPlayerToWorldEvent](../player/add-player-to-world-event) - Declenche lorsqu'un joueur est ajoute a un monde

## Reference source

`decompiled/com/hypixel/hytale/builtin/instances/event/DiscoverInstanceEvent.java:9`
