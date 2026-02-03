---
id: block-properties
title: Propriétés des Blocs
sidebar_label: Propriétés
sidebar_position: 2
---

# Propriétés des Blocs

Référence pour toutes les propriétés de blocs disponibles.

## Propriétés Principales

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `hardness` | number | 1.0 | Difficulté de minage |
| `resistance` | number | 1.0 | Résistance aux explosions |
| `material` | string | "stone" | Type de matériau du bloc |
| `transparent` | boolean | false | La lumière passe à travers |

## Exemple

```json
{
  "properties": {
    "hardness": 5.0,
    "resistance": 10.0,
    "material": "metal",
    "transparent": false
  }
}
```
