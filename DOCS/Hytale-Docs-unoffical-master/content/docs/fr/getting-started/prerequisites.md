---
id: prerequisites
title: Prerequis
sidebar_label: Prerequis
sidebar_position: 2
description: Ce dont vous avez besoin avant de commencer le developpement Hytale
---

# Prerequis

Avant de commencer le developpement Hytale, assurez-vous d'avoir installe les elements suivants.

## Logiciels requis

### Pour tous les developpeurs

| Logiciel | Version | Telechargement |
|----------|---------|----------------|
| **Hytale** | Derniere | [hytale.com](https://hytale.com) |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com) |
| **Editeur de texte** | N'importe lequel | VS Code recommande |

### Pour le developpement de plugins

| Logiciel | Version | Telechargement |
|----------|---------|----------------|
| **Java JDK** | 25 | [adoptium.net](https://adoptium.net) (recommande) |
| **IDE** | Derniere | IntelliJ IDEA ou Eclipse |
| **Gradle** | 9.2.0 | Generalement inclus avec l'IDE |

:::warning Version Java
Les plugins Hytale necessitent **Java 25**. Les versions anterieures ne sont pas supportees. Adoptium (anciennement AdoptOpenJDK) est la distribution recommandee.
:::

### Pour la modelisation 3D

| Logiciel | Version | Telechargement |
|----------|---------|----------------|
| **Blockbench** | 4.x+ | [blockbench.net](https://blockbench.net) |
| **Hytale Plugin** | Derniere | [GitHub](https://github.com/JannisX11/hytale-blockbench-plugin) |

Le plugin Blockbench remplace l'ancien Hytale Model Maker et supporte :
- Format `.blockymodel` pour les modeles 3D
- Format `.blockyanim` pour les animations

## Types de Mods et Prerequis

| Type de Mod | Competences Requises | Outils Necessaires |
|-------------|---------------------|-------------------|
| **Packs** | Aucun code - Asset Editor uniquement | Hytale Asset Editor |
| **Plugins** | Programmation Java | Java 25, IDE, Gradle |
| **Bootstrap Plugins** | Java avance | Java 25, IDE, Gradle |

## Connaissances requises

### Parcours debutant (Packs / Data Assets)

- Syntaxe JSON de base
- Navigation dans le systeme de fichiers
- Utilisation d'un editeur de texte
- Aucune programmation requise

### Parcours intermediaire (Art Assets)

- Concepts de modelisation 3D
- Bases de l'animation
- Creation de textures

### Parcours avance (Java Plugins)

- Programmation Java
- Conception orientee objet
- Architecture evenementielle

## Outils de Developpement Officiels

| Outil | Objectif |
|-------|----------|
| **Hytale Asset Editor** | Editeur principal pour les data assets (JSON) |
| **Hytale Node Editor** | Scripts visuels pour brushes et world gen |
| **Plugin Blockbench** | Creer des modeles 3D et animations |
| **Machinima** | Enregistrement de contenu |
| **World Tools** | Modification/edition de monde |

## Langages et Scripting

:::info Pas de support Lua/Python
Hypixel Studios a officiellement decide de **ne pas supporter Lua ou Python** pour le modding. Les options disponibles sont :
- **Scripting Visuel** via Node Editor (inspire des Blueprints d'Unreal Engine)
- **Plugins Java** pour la logique cote serveur
:::

## Configuration systeme requise

| Composant | Minimum | Recommande |
|-----------|---------|------------|
| OS | Windows 10 / macOS 11 / Linux | Windows 11 / macOS 14 / Linux |
| RAM | 8 Go | 16 Go |
| Stockage | 10 Go libres | 50 Go SSD |

## Plateforme de Distribution

**CurseForge** est le partenaire de distribution officiel (depuis le 5 janvier 2026) :
- Commission 0% sur les mods et serveurs pendant les 2 premieres annees
- Visitez [curseforge.com/hytale](https://www.curseforge.com/hytale)

## Prochaines etapes

Une fois les prerequis installes :

1. [Configuration de l'environnement](/docs/getting-started/environment-setup) - Configurez vos outils
2. [Votre premier mod](/docs/getting-started/first-mod) - Creez quelque chose !
