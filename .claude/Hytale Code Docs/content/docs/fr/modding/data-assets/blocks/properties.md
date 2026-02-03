---
id: properties
title: Propriétés des Blocs
sidebar_label: Propriétés
sidebar_position: 2
description: Référence de toutes les propriétés de blocs disponibles dans Hytale
---

# Propriétés des Blocs

Référence complète de toutes les propriétés de blocs disponibles.

## Propriétés Principales

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `hardness` | number | 1.0 | Difficulté de minage (temps pour casser) |
| `resistance` | number | 1.0 | Résistance aux explosions |
| `material` | string | "stone" | Type de matériau du bloc |
| `transparent` | boolean | false | Si la lumière passe à travers |
| `solid` | boolean | true | Si les entités entrent en collision |

## Propriétés Visuelles

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `renderType` | string | "solid" | Mode de rendu |
| `color` | string | null | Couleur de teinte (hex) |
| `luminance` | number | 0 | Niveau d'émission de lumière (0-15) |
| `opacity` | number | 15 | Niveau de blocage de lumière (0-15) |

### Types de Rendu

| Type | Description |
|------|-------------|
| `solid` | Bloc opaque standard |
| `cutout` | Pixels transparents (feuilles, fleurs) |
| `translucent` | Semi-transparent (verre, eau) |
| `model` | Modèle 3D personnalisé |

## Propriétés Physiques

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `flammable` | boolean | false | Peut prendre feu |
| `replaceable` | boolean | false | Peut être écrasé par placement |
| `requiresTool` | boolean | false | Nécessite un outil spécifique |
| `toolType` | string | null | Outil requis (pioche, hache, pelle) |
| `harvestLevel` | number | 0 | Niveau d'outil minimum requis |

## Propriétés Sonores

| Propriété | Type | Description |
|-----------|------|-------------|
| `soundGroup` | string | Ensemble de sons pour interactions |
| `stepSound` | string | Son de pas personnalisé |
| `breakSound` | string | Son de destruction personnalisé |
| `placeSound` | string | Son de placement personnalisé |

### Groupes de Sons

- `stone` - Pierre, minerais, briques
- `wood` - Bûches, planches, objets en bois
- `grass` - Herbe, terre, sol
- `sand` - Sable, gravier
- `glass` - Verre, glace
- `metal` - Blocs métalliques, enclumes
- `cloth` - Laine, tissu

## Exemple

```json
{
  "id": "my_mod:reinforced_glass",
  "displayName": "Verre Renforcé",
  "properties": {
    "hardness": 3.0,
    "resistance": 15.0,
    "material": "glass",
    "transparent": true,
    "solid": true,
    "renderType": "translucent",
    "opacity": 0,
    "luminance": 0,
    "soundGroup": "glass",
    "requiresTool": true,
    "toolType": "pickaxe",
    "harvestLevel": 1
  }
}
```

## Types de Matériaux

| Matériau | Description | Outil |
|----------|-------------|-------|
| `stone` | Blocs de type pierre | Pioche |
| `wood` | Blocs en bois | Hache |
| `dirt` | Blocs de type sol | Pelle |
| `sand` | Blocs granulaires | Pelle |
| `metal` | Blocs métalliques | Pioche |
| `glass` | Transparents fragiles | Pioche |
| `cloth` | Tissus souples | Tout |
| `plant` | Végétation | Tout |

## Voir Aussi

- [Créer des Blocs](/docs/modding/data-assets/blocks/creating-blocks)
- [Comportements des Blocs](/docs/modding/data-assets/blocks/behaviors)
