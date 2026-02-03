---
id: item-properties
title: Propriétés des Items
sidebar_label: Propriétés
sidebar_position: 2
description: Référence de toutes les propriétés d'items disponibles dans Hytale
---

# Propriétés des Items

Référence complète de toutes les propriétés d'items disponibles.

## Propriétés Principales

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `maxStackSize` | number | 64 | Taille maximale de pile |
| `durability` | number | null | Durabilité (null = incassable) |
| `rarity` | string | "common" | Niveau de rareté |
| `category` | string | null | Catégorie d'inventaire |

### Niveaux de Rareté

| Rareté | Couleur | Description |
|--------|---------|-------------|
| `common` | Blanc | Items standards |
| `uncommon` | Vert | Légèrement meilleurs |
| `rare` | Bleu | Items notables |
| `epic` | Violet | Items puissants |
| `legendary` | Orange | Items exceptionnels |

## Propriétés d'Armes

| Propriété | Type | Description |
|-----------|------|-------------|
| `damage` | number | Dégâts de base |
| `attackSpeed` | number | Attaques par seconde |
| `knockback` | number | Force de recul |
| `reach` | number | Portée d'attaque |
| `critChance` | number | Chance de critique (0-1) |
| `critMultiplier` | number | Multiplicateur de dégâts critiques |

```json
{
  "type": "weapon",
  "weaponType": "sword",
  "properties": {
    "damage": 10,
    "attackSpeed": 1.4,
    "knockback": 0.5,
    "reach": 3.0,
    "critChance": 0.1,
    "critMultiplier": 1.5
  }
}
```

## Propriétés d'Outils

| Propriété | Type | Description |
|-----------|------|-------------|
| `miningSpeed` | number | Multiplicateur de vitesse de minage |
| `harvestLevel` | number | Niveau d'outil pour récolte |
| `efficiency` | number | Efficacité globale |
| `toolType` | string | Catégorie d'outil |

```json
{
  "type": "tool",
  "toolType": "pickaxe",
  "properties": {
    "miningSpeed": 8.0,
    "harvestLevel": 3,
    "efficiency": 9.0,
    "durability": 1500
  }
}
```

## Propriétés d'Armures

| Propriété | Type | Description |
|-----------|------|-------------|
| `defense` | number | Réduction de dégâts |
| `toughness` | number | Résistance aux gros dégâts |
| `slot` | string | Emplacement d'équipement |
| `weight` | string | Catégorie de pénalité de mouvement |

```json
{
  "type": "armor",
  "slot": "chest",
  "properties": {
    "defense": 8,
    "toughness": 2.5,
    "weight": "heavy"
  }
}
```

### Emplacements d'Armure

- `head` - Casques
- `chest` - Plastrons
- `legs` - Jambières
- `feet` - Bottes
- `accessory` - Anneaux, amulettes

## Propriétés de Consommables

| Propriété | Type | Description |
|-----------|------|-------------|
| `consumeTime` | number | Temps de consommation (ticks) |
| `nutrition` | number | Faim restaurée |
| `saturation` | number | Bonus de saturation |
| `effects` | array | Effets de statut appliqués |

```json
{
  "type": "consumable",
  "properties": {
    "consumeTime": 32,
    "nutrition": 8,
    "saturation": 1.2,
    "effects": [
      {
        "type": "regeneration",
        "duration": 200,
        "amplifier": 1
      }
    ]
  }
}
```

## Propriétés Visuelles

| Propriété | Type | Description |
|-----------|------|-------------|
| `icon` | string | Texture d'icône d'inventaire |
| `model` | string | Chemin du modèle 3D |
| `color` | string | Couleur de teinte (hex) |
| `enchantGlint` | boolean | Afficher l'effet d'enchantement |

## Voir Aussi

- [Créer des Items](/docs/modding/data-assets/items/creating-items)
- [Comportements des Items](/docs/modding/data-assets/items/behaviors)
- [Types d'Items](/docs/modding/data-assets/items/item-types)
