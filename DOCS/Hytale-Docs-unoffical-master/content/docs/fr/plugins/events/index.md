---
title: Référence des Événements
description: Référence complète des 69 événements du serveur Hytale avec filtres et recherche
---

# Référence des Événements

Le serveur Hytale utilise un système d'événements sophistiqué permettant aux plugins d'écouter et de répondre à diverses actions du jeu. Cette référence fournit une liste complète et consultable de tous les événements disponibles.

<EventsReference />

## Démarrage Rapide

Commencez avec les événements en quelques secondes :

```java
// Écouter les connexions joueurs (IEvent)
getEventRegistry().register(PlayerConnectEvent.class, event -> {
    getLogger().info("Bienvenue " + event.getPlayer().getName() + " !");
});

// Écouter les destructions de blocs (ECS Event)
getEntityStoreRegistry().registerSystem(new BlockBreakSystem());
```

:::tip Intégration IntelliJ
Utilisez le template `hyevent` pour créer rapidement des écouteurs d'événements. Tapez simplement `hyevent` et appuyez sur Tab.
:::

## Comprendre les Deux Systèmes d'Événements

Hytale utilise deux systèmes d'événements distincts :

### Système IEvent (EventBus)

À utiliser pour les **événements de cycle de vie serveur et état joueur** :
- Connexion/déconnexion joueur
- Démarrage/arrêt serveur
- Création/suppression de monde
- Changements de permissions
- Messages de chat

**Enregistrement :** `getEventRegistry().register(...)`

### Système ECS Event (EntityEventSystem)

À utiliser pour les **événements de gameplay et liés aux entités** :
- Destruction/placement de blocs
- Lâcher/ramassage d'items
- Changements d'inventaire
- Événements de dégâts

**Enregistrement :** `getEntityStoreRegistry().registerSystem(new VotreSystem())`

:::info Les événements ECS nécessitent une classe System
Les événements ECS ne peuvent pas utiliser un simple lambda. Vous devez créer une classe qui étend `EntityEventSystem`.
:::

## Priorités des Événements

Les événements sont distribués aux gestionnaires par ordre de priorité :

| Priorité | Valeur | Cas d'usage |
|----------|--------|-------------|
| `FIRST` | -21844 | Vérifications sécurité, logging |
| `EARLY` | -10922 | Validation, permissions |
| `NORMAL` | 0 | Traitement standard |
| `LATE` | 10922 | Réagir aux modifications |
| `LAST` | 21844 | Logging final, nettoyage |

## Voir Aussi

- [Guide de Développement Plugin](/docs/modding/plugins/overview)
- [Vue d'ensemble du Système ECS](/docs/api/server-internals/ecs)
- [Plugin IntelliJ](/docs/modding/plugins/intellij-plugin)
