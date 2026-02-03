---
id: items-overview
title: Vue d'ensemble des Items
sidebar_label: Vue d'ensemble
sidebar_position: 0
description: Introduction au modding d'items dans Hytale
---

# Vue d'ensemble des Items

Les items sont des objets que les joueurs peuvent collecter, utiliser et avec lesquels interagir. Cette section couvre tout sur la création d'items personnalisés.

## Qu'est-ce qu'un Item ?

Les items dans Hytale incluent les armes, outils, armures, consommables, matériaux et plus encore. Chaque item a des propriétés qui définissent sa fonctionnalité et son apparence.

## Composants d'un Item

Une définition d'item se compose de plusieurs composants :

| Composant | Description |
|-----------|-------------|
| **Identité** | ID unique et nom d'affichage |
| **Type** | Catégorie (arme, outil, armure, etc.) |
| **Propriétés** | Stats et caractéristiques |
| **Comportements** | Effets spéciaux et interactions |
| **Visuels** | Modèle, textures, icônes |

## Structure des Fichiers

Les définitions d'items sont stockées en fichiers JSON :

```
my_mod/
  data/
    items/
      ruby_sword.json
  assets/
    textures/
      items/
        ruby_sword.png
    models/
      items/
        ruby_sword.blockymodel
```

## Exemple de Base

```json
{
  "id": "my_mod:ruby_sword",
  "displayName": "Épée en Rubis",
  "type": "weapon",
  "properties": {
    "damage": 12,
    "attackSpeed": 1.2,
    "durability": 750
  }
}
```

## Catégories d'Items

### Armes
- Épées, haches, masses
- Arcs, arbalètes
- Bâtons magiques, baguettes

### Outils
- Pioches, pelles, haches
- Cannes à pêche
- Items utilitaires spéciaux

### Armures
- Casques, plastrons
- Jambières, bottes
- Accessoires (anneaux, amulettes)

### Consommables
- Nourriture et boissons
- Potions
- Parchemins

### Matériaux
- Ingrédients de craft
- Minerais et gemmes
- Loots de monstres

## Prochaines Étapes

- [Créer des Items](/docs/modding/data-assets/items/creating-items) - Guide étape par étape
- [Propriétés des Items](/docs/modding/data-assets/items/properties) - Référence des propriétés
- [Comportements des Items](/docs/modding/data-assets/items/behaviors) - Ajouter des effets spéciaux
- [Recettes de Craft](/docs/modding/data-assets/items/crafting-recipes) - Définir des recettes
