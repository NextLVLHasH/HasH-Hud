---
id: overview
title: Vue d'ensemble de la reference API
sidebar_label: Vue d'ensemble
sidebar_position: 1
description: Documentation de l'API Hytale pour les developpeurs
---

# Vue d'ensemble de la reference API

Cette section documente les APIs Hytale disponibles pour les developpeurs.

## Documentation Interne du Serveur

:::tip Nouveau - Documentation v2
La version 2 de la documentation interne du serveur est maintenant disponible, avec une documentation verifiee par multi-agents pour une precision et une exhaustivite ameliorees.
:::

La documentation couvre les systemes internes du serveur Hytale :

| Section | Description |
|---------|-------------|
| [**Systeme de Plugins**](/docs/api/server-internals/plugins) | Architecture, cycle de vie, PluginManager |
| [**Systeme d'Evenements**](/docs/api/server-internals/events) | EventBus, priorites, evenements annulables |
| [**Systeme de Commandes**](/docs/api/server-internals/commands) | CommandManager, creation de commandes |
| [**Systeme ECS**](/docs/api/server-internals/ecs) | Entity Component System complet |
| [**Types de Donnees**](/docs/api/server-internals/types) | BlockType, Items, EntityEffect |
| [**Packets Reseau**](/docs/api/server-internals/packets) | 200+ packets documentes |

[Explorer la documentation interne →](/docs/api/server-internals)

---

## API officielle Hytale

L'API officielle Hytale fournit des endpoints pour acceder aux donnees publiques du jeu.

### URL de base

```
https://hytale.com/api
```

### Endpoints disponibles

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/blog/post/published` | GET | Liste des articles de blog publies |
| `/blog/post/slug/:slug` | GET | Obtenir un article par son slug |
| `/jobs` | GET | Liste des offres d'emploi |

[Reference complete des endpoints →](/docs/api/official/endpoints)

## SDKs communautaires

- [SDK Node.js](/docs/api/sdks/javascript)
- [SDK PHP](/docs/api/sdks/php)

## Pour commencer

Explorez la documentation interne du serveur pour commencer a developper des plugins Hytale.
