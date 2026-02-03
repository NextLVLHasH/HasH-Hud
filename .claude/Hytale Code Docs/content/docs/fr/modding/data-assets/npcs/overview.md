---
id: npcs-overview
title: Vue d'ensemble des PNJs
sidebar_label: Vue d'ensemble
sidebar_position: 0
description: Introduction au modding de PNJs dans Hytale
---

# Vue d'ensemble des PNJs

Les PNJs (Personnages Non-Joueurs) sont des entités qui peuplent le monde de Hytale. Cette section couvre la création et la personnalisation des PNJs.

## Qu'est-ce qu'un PNJ ?

Les PNJs incluent les créatures, monstres, villageois et toute entité non-joueur avec un comportement IA. Ils peuvent être amicaux, hostiles ou neutres.

## Composants d'un PNJ

Une définition de PNJ se compose de plusieurs composants :

| Composant | Description |
|-----------|-------------|
| **Identité** | ID unique et nom d'affichage |
| **Stats** | Santé, dégâts, vitesse |
| **Système IA** | Arbres de comportement et objectifs |
| **Visuels** | Modèle, textures, animations |
| **Butin** | Tables de loot |

## Structure des Fichiers

Les définitions de PNJs sont stockées en fichiers JSON :

```
my_mod/
  data/
    npcs/
      custom_creature.json
  assets/
    models/
      npcs/
        custom_creature.blockymodel
    textures/
      npcs/
        custom_creature.png
    animations/
      npcs/
        custom_creature/
          idle.animation
          walk.animation
```

## Exemple de Base

```json
{
  "id": "my_mod:custom_creature",
  "displayName": "Créature Personnalisée",
  "stats": {
    "health": 20,
    "damage": 5,
    "speed": 0.25
  },
  "model": "models/npcs/custom_creature.blockymodel"
}
```

## Catégories de PNJs

### Hostiles
- Monstres qui attaquent les joueurs
- Ennemis de donjons
- Créatures boss

### Passifs
- Animaux qui fuient les menaces
- Faune ambiante
- Créatures ressources

### Neutres
- Attaquent seulement si provoqués
- Créatures territoriales
- Gardiens

### Amicaux
- Villageois et marchands
- Donneurs de quêtes
- Compagnons alliés

## Stats des PNJs

| Stat | Type | Description |
|------|------|-------------|
| `health` | number | Points de vie maximum |
| `damage` | number | Dégâts d'attaque de base |
| `speed` | number | Vitesse de déplacement |
| `armor` | number | Réduction de dégâts |
| `knockbackResistance` | number | Réduction de recul (0-1) |

## Prochaines Étapes

- [Créer des PNJs](/docs/modding/data-assets/npcs/creating-npcs) - Guide étape par étape
- [Système IA](/docs/modding/data-assets/npcs/ai-system) - Configurer les comportements
- [Comportements](/docs/modding/data-assets/npcs/behaviors) - Types de comportements
- [Capteurs & Actions](/docs/modding/data-assets/npcs/sensors-actions) - Composants IA
