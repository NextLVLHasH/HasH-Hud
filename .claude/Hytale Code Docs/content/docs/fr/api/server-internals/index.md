---
id: server-internals
title: Documentation Interne du Serveur Hytale
sidebar_label: Internals Serveur
sidebar_position: 10
description: Documentation technique v2 du serveur Hytale - Architecture, API, Packets et Systemes internes
---

# Documentation Interne du Serveur Hytale

<div className="version-badge">
  <span className="badge badge--primary">Version 2.0 - Documentation Verifiee</span>
</div>

:::warning Avis sur la Précision de la Documentation
Cette documentation est basée sur du **code source décompilé** et peut contenir des erreurs ou inexactitudes. Bien que nous vérifions contre le code réel, certaines informations peuvent être incomplètes, obsolètes ou mal interprétées. **Testez toujours vos implémentations** et ne vous fiez pas uniquement à cette documentation. Vous avez trouvé une erreur ? [Signalez-la sur GitHub](https://github.com/timiliris/Hytale-Docs/issues) pour aider à améliorer la qualité !
:::

:::info Documentation v2 - Vérifiée par Multi-Agent

Cette documentation a été générée par un système d'analyse multi-agent qui :

- Extrait les données directement du code source décompilé du serveur
- Vérifie toutes les informations avec des références aux fichiers sources et numéros de ligne
- Inclut de vrais extraits de code de la base de code réelle
- Utilise des mesures anti-hallucination pour éviter la confusion avec les patterns Minecraft/Bukkit

:::

## Qu'est-ce que cette documentation ?

Cette documentation revele comment le serveur Hytale fonctionne **sous le capot**. Alors que les outils de modding officiels d'Hytale fournissent une interface conviviale pour creer du contenu, comprendre les systemes internes du serveur vous donne le pouvoir de creer des modifications plus sophistiquees et performantes.

## Nouveautés de la v2

La version 2.0 de cette documentation apporte des améliorations majeures :

- **Système d'événements précis** : 50+ events documentés avec les vraies interfaces (IEvent, IAsyncEvent, ICancellable)
- **Système de commandes complet** : Hiérarchie AbstractCommand, types d'arguments, méthodes d'enregistrement
- **Protocole réseau** : Protocole QUIC/UDP, 268 paquets, documentation du flux de connexion
- **API Plugin** : Méthodes de cycle de vie précises (preLoad, setup, start, shutdown), registres
- **Références sources** : Chaque classe et méthode inclut les chemins des fichiers sources et numéros de ligne
- **Exemples de code** : Code réel de BlockTickPlugin, BlockSpawnerPlugin et autres plugins builtin

### A qui s'adresse cette documentation ?

- **Developpeurs de plugins** qui veulent etendre Hytale au-dela de ce qui est possible avec les outils visuels
- **Createurs de mods** qui ont besoin d'un controle precis sur les mecaniques de jeu
- **Passionnes de technique** curieux de savoir comment un serveur de jeu moderne est architecture
- **Createurs de contenu** qui veulent comprendre le "pourquoi" derriere les comportements du jeu

### Pourquoi apprendre les mecanismes internes ?

Pensez au serveur Hytale comme au moteur d'une voiture. Vous pouvez conduire sans savoir comment le moteur fonctionne, mais un mecanicien qui comprend le moteur peut :
- Diagnostiquer les problemes plus rapidement
- Optimiser les performances
- Ajouter des modifications personnalisees
- Repousser les limites du possible

De meme, comprendre les mecanismes internes vous permet de :
- **Deboguer les problemes** en tracant exactement ce qui se passe quand un joueur place un bloc ou subit des degats
- **Optimiser les performances** en sachant quels systemes sont couteux et comment minimiser leur impact
- **Creer un gameplay unique** en vous connectant a des systemes non exposes par les API normales
- **Eviter les pieges courants** en comprenant pourquoi certains patterns fonctionnent et d'autres non

## A propos de cette documentation

Cette section documente les **mecanismes internes** du serveur Hytale, destines aux developpeurs de plugins avances souhaitant comprendre le fonctionnement en profondeur du serveur.

### Sources

- Code source decompile du serveur Hytale (version Early Access)
- Analyse automatisee avec verification manuelle
- Package principal : `com.hypixel.hytale`

---

## Architecture du Serveur

Le serveur Hytale est construit sur une architecture modulaire basee sur :

| Composant | Description |
|-----------|-------------|
| **ECS (Entity Component System)** | Systeme de gestion des entites performant |
| **EventBus** | Bus d'evenements synchrone et asynchrone |
| **PluginManager** | Gestionnaire de plugins avec cycle de vie complet |
| **Protocol QUIC** | Communication reseau via Netty + QUIC (port 5520) |

---

## Sections de la Documentation

### Systeme de Plugins

Tout ce dont vous avez besoin pour creer des plugins Java pour Hytale.

| Guide | Description |
|-------|-------------|
| [**Systeme de Plugins**](./plugins) | Architecture, cycle de vie, PluginManager |
| [**Systeme d'Evenements**](./events) | EventBus, priorites, evenements annulables |
| [**Systeme de Commandes**](./commands) | CommandManager, creation de commandes |

### Architecture Interne

Comprehension approfondie des systemes internes du serveur.

| Guide | Description |
|-------|-------------|
| [**Systeme ECS**](./ecs) | Entity Component System, Components, Queries |
| [**Types de Donnees**](./types) | BlockType, Items, EntityEffect, enums |
| [**Packets Reseau**](./packets) | Protocole, 200+ packets documentes |

---

## Statistiques de la Documentation

| Metrique | Valeur |
|----------|--------|
| Fichiers Java analyses | 5 218 |
| Packets documentes | 200+ |
| Commandes documentees | 50+ |
| Evenements documentes | 30+ |
| Composants ECS | 20+ |

---

## Informations Techniques

### Port par defaut

```
5520 (UDP - QUIC)
```

### Package principal

```
com.hypixel.hytale
```

### Classe principale

```java
com.hypixel.hytale.server.core.HytaleServer
```

---

## Pour Commencer

<div className="doc-card-grid">
  <div className="doc-card">
    <h3>Creer un Plugin</h3>
    <p>Apprenez a creer votre premier plugin Java pour Hytale.</p>
    <a href="./plugins">Voir la documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Ecouter des Evenements</h3>
    <p>Reagissez aux actions des joueurs et du serveur.</p>
    <a href="./events">Voir la documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Creer des Commandes</h3>
    <p>Ajoutez des commandes personnalisees a votre serveur.</p>
    <a href="./commands">Voir la documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Comprendre l'ECS</h3>
    <p>Maitrisez le systeme de composants pour les entites.</p>
    <a href="./ecs">Voir la documentation →</a>
  </div>
</div>

---

## Contribuer

Cette documentation est open source. Si vous trouvez des erreurs ou souhaitez ameliorer le contenu :

- Ouvrez une issue sur GitHub
- Proposez une pull request
- Rejoignez le Discord de la communaute

---

:::info Verification du code
Cette documentation a ete verifiee par rapport au code source decompile. Consultez le [rapport de verification](/docs/api/server-internals/verification) pour plus de details.
:::
