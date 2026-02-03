---
id: overview
title: Vue d'ensemble du Modding
sidebar_label: Vue d'ensemble
sidebar_position: 1
description: Guide complet du modding Hytale - plugins, data assets et art assets
---

# Vue d'ensemble du Modding

Hytale a ete concu des le depart avec le modding au coeur. Cette section couvre tout ce que vous devez savoir sur la creation de contenu pour Hytale.

## Philosophie

> "Notre objectif est de permettre aux moddeurs de reproduire tout ce que nous faisons en utilisant les memes outils que nous utilisons en interne."
> - Hypixel Studios

### "Une Communaute, Un Client"

Contrairement a Minecraft, ou les joueurs luttent souvent avec des incompatibilites de versions et des installations de modpacks complexes, Hytale elimine totalement ces frictions avec son **approche cote serveur** :

- Meme le mode solo fonctionne via un serveur local
- Les joueurs rejoignent n'importe quel serveur modde sans installer de mods
- Le serveur envoie automatiquement tout le contenu requis
- Un seul client propre pour tous les serveurs - pas de clients moddes supportes

> "Le principe directeur est d'eviter d'avoir besoin d'un client modde."
> - [Strategie Modding Hytale](https://hytale.com/news/2025/11/hytale-modding-strategy-and-status)

### Avantages

| Avantage | Description |
|----------|-------------|
| **Experience Fluide** | Changez de serveur sans configuration |
| **Mises a Jour Instantanees** | Les modifications de mods s'appliquent immediatement |
| **Securite Renforcee** | Pas de clients modifies |
| **UX Simple** | Pas de gestion de modpacks |

## Types de Mods Supportes

Hytale supporte trois types de mods distincts, chacun ciblant differents niveaux de competences :

| Type | Description | Competences Requises |
|------|-------------|---------------------|
| **Packs** | Packs d'assets pour nouveaux blocs, mobs, items | Aucun code - Asset Editor |
| **Plugins** | Mods ecrits en Java utilisant l'API du jeu | Programmation Java |
| **Bootstrap Plugins** | Plugins bas niveau pour transformation de bytecode | Java avance |

### 1. Packs (Data Assets)

Fichiers de configuration JSON pour le contenu du jeu :

- Modifiables via l'Asset Editor (pas de code requis)
- Peuvent etre combines avec les Plugins
- Support du rechargement en direct

**Elements configurables :**
- Blocs et items
- NPCs et comportements
- Tables de loot
- Generation de monde

[En savoir plus sur les Data Assets →](/docs/modding/data-assets/overview)

### 2. Plugins Serveur (Java)

Plugins bases sur Java pour un controle approfondi du serveur :

- Ecrits en Java, empaquetes en fichiers `.jar`
- Similaires aux plugins Bukkit/Spigot
- Acces a l'API serveur complete
- **Requiert Java 25** (Adoptium recommande)

**Cas d'utilisation :**
- Commandes personnalisees
- Systemes d'economie
- Logique de minijeux
- Plugins de protection
- Outils d'administration

[En savoir plus sur les Plugins →](/docs/modding/plugins/overview)

### 3. Art Assets

Contenu visuel pour vos mods :

- Modeles 3D (`.blockymodel`)
- Animations (`.blockyanim`)
- Textures (PNG, 32px ou 64px par unite)
- Effets sonores

**Outil principal :** [Blockbench](https://blockbench.net) avec le [plugin Hytale officiel](https://github.com/JannisX11/hytale-blockbench-plugin)

[En savoir plus sur les Art Assets →](/docs/modding/art-assets/overview)

## Langages et Scripting

### Position Officielle

Hypixel Studios a officiellement decide de **ne pas supporter Lua ou Python** pour le modding. A la place, les options suivantes sont disponibles :

- **Scripting Visuel** via Node Editor (inspire des Blueprints d'Unreal Engine)
- **Asset Graph Editor** integre avec rechargement en temps reel
- **Plugins Java** necessitant Java 25 (Adoptium recommande)

### Scripting Visuel

Scripting base sur des noeuds inspire des Blueprints Unreal Engine :

- Pas de code requis - concevez la logique visuellement
- Creez des mecaniques de jeu en connectant des noeuds
- Comble le fosse entre designers et programmeurs
- Les programmeurs peuvent creer des noeuds personnalises en Java

> "Le scripting visuel comble le fosse entre designers et programmeurs. Les designers peuvent construire la logique visuellement sans erreurs de syntaxe."
> - [Strategie Modding Hytale](https://hytale.com/news/2025/11/hytale-modding-strategy-and-status)

### Code Source Serveur

Le code source du serveur est prevu **1-2 mois apres le lancement**, donnant aux developpeurs un acces complet aux mecanismes internes du jeu.

## Outils de Developpement

### Outils Officiels

| Outil | Objectif | Statut |
|-------|----------|--------|
| **Hytale Asset Editor** | Editeur principal pour les data assets | Disponible |
| **Hytale Node Editor** | Scripts visuels pour brushes et world gen | Disponible |
| **Plugin Blockbench** | Creer des modeles 3D et animations | Disponible |
| **Machinima** | Enregistrement de contenu | Disponible |
| **World Tools** | Modification/edition de monde | Disponible |

### Plugin Blockbench

Le plugin Blockbench remplace l'ancien Hytale Model Maker :

- **Formats :** `.blockymodel` et `.blockyanim`
- **GitHub :** [https://github.com/JannisX11/hytale-blockbench-plugin](https://github.com/JannisX11/hytale-blockbench-plugin)

### Outils Communautaires

- [HytaleModding.dev](https://hytalemodding.dev) - Documentation et guides
- [HytalePlugins.gg](https://hytaleplugins.gg) - Hub de plugins
- [CurseForge](https://www.curseforge.com/hytale) - Plateforme de distribution officielle

## Formats de Fichiers

| Type | Format |
|------|--------|
| Data Assets | JSON |
| Modeles | `.blockymodel` |
| Animations | `.blockyanim` |
| Plugins | `.jar` |
| Configuration | `config.json`, `permissions.json` |

## Distribution

**CurseForge** est le partenaire de distribution officiel (depuis le 5 janvier 2026) :

- **Commission 0%** sur les mods et serveurs pendant les 2 premieres annees
- Plateforme officielle pour decouvrir et partager du contenu

## Structure des Fichiers Serveur

```
/hytale-server/
├── mods/           # Packs de contenu
├── plugins/        # Plugins Java (.jar)
├── config/         # Configuration serveur
└── worlds/         # Sauvegardes de mondes
```

## Etat Actuel

Base sur l'article officiel [Strategie Modding](https://hytale.com/news/2025/11/hytale-modding-strategy-and-status) :

### Disponible au Lancement (13 Janvier 2026)

- Plugins Java serveur (Java 25, Gradle 9.2.0)
- Data Assets via Asset Editor
- Modeles 3D via [plugin Blockbench](https://github.com/JannisX11/hytale-blockbench-plugin)
- [Mode Creatif](https://hytale.com/news/2025/11/hytale-creative-mode) avec outils de construction
- Outils Machinima pour cinematiques
- Le serveur n'est pas obfusque (peut etre decompile)

### A Venir

- **Code source serveur** (1-2 mois apres lancement) - sera entierement open source
- **Systeme de scripting visuel** - logique basee sur des noeuds inspiree des Blueprints Unreal
- **Generation de Monde V2** - editeur de noeuds visuel pour les biomes ([Source](https://hytale.com/news/2026/1/the-future-of-world-generation))
- Documentation GitBook complete

### Limitations Connues (Early Access)

- Documentation incomplete (GitBook en cours)
- Certains workflows sont bruts et non polis
- L'Asset Graph Editor necessite du polish
- Integrite des donnees non garantie - **les sauvegardes sont obligatoires**
- Sauvegardez frequemment (risque de crash en early access)

## Pour Commencer

Choisissez votre chemin selon vos objectifs :

<div className="doc-card-grid">
  <DocCard item={{
    type: 'link',
    label: 'Data Assets',
    href: '/docs/modding/data-assets/overview',
    description: 'Creez des blocs, items, NPCs sans coder'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Plugins Java',
    href: '/docs/modding/plugins/overview',
    description: 'Construisez des plugins serveur puissants'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Art Assets',
    href: '/docs/modding/art-assets/overview',
    description: 'Creez des modeles, textures, animations'
  }} />
</div>
