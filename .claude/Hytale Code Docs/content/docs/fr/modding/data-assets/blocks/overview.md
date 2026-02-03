---
id: blocks-overview
title: Vue d'ensemble des Blocs
sidebar_label: Vue d'ensemble
sidebar_position: 0
description: Introduction au modding de blocs dans Hytale
---

# Vue d'ensemble des Blocs

Les blocs sont les unités de construction fondamentales du monde de Hytale. Cette section couvre tout ce que vous devez savoir sur la création et la personnalisation des blocs.

## Qu'est-ce qu'un Bloc ?

Dans Hytale, les blocs sont les éléments voxeliques qui composent le terrain, les structures et les décorations. Chaque type de bloc possède des propriétés uniques qui définissent son apparence et son comportement.

## Composants d'un Bloc

Une définition de bloc se compose de plusieurs composants :

| Composant | Description |
|-----------|-------------|
| **Identité** | ID unique et nom d'affichage |
| **Propriétés** | Caractéristiques physiques (dureté, résistance) |
| **Comportements** | Fonctionnalités interactives (gravité, liquides, lumière) |
| **Visuels** | Modèle, textures et options de rendu |
| **Sons** | Audio pour placement, destruction, pas |

## Structure des Fichiers

Les définitions de blocs sont stockées en fichiers JSON :

```
my_mod/
  data/
    blocks/
      custom_block.json
  assets/
    textures/
      blocks/
        custom_block.png
```

## Exemple de Base

```json
{
  "id": "my_mod:custom_block",
  "displayName": "Bloc Personnalisé",
  "properties": {
    "hardness": 2.0,
    "resistance": 3.0,
    "material": "stone"
  }
}
```

## Catégories de Blocs

### Blocs Naturels
- Terrain (terre, pierre, sable)
- Végétation (herbe, fleurs, arbres)
- Minerais et minéraux

### Blocs de Construction
- Matériaux de construction
- Blocs décoratifs
- Blocs fonctionnels (portes, coffres)

### Blocs Interactifs
- Stations de craft
- Conteneurs de stockage
- Composants mécaniques

## Prochaines Étapes

- [Créer des Blocs](/docs/modding/data-assets/blocks/creating-blocks) - Guide étape par étape
- [Propriétés des Blocs](/docs/modding/data-assets/blocks/properties) - Référence des propriétés
- [Comportements des Blocs](/docs/modding/data-assets/blocks/behaviors) - Ajouter de l'interactivité
