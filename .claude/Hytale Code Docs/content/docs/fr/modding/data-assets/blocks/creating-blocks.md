---
id: creating-blocks
title: Créer des Blocs
sidebar_label: Créer des Blocs
sidebar_position: 1
description: Comment créer des blocs personnalisés dans Hytale
---

# Créer des Blocs

Apprenez à créer des blocs personnalisés pour Hytale.

## Définition de Base d'un Bloc

```json
{
  "id": "my_mod:custom_block",
  "displayName": "Bloc Personnalisé",
  "properties": {
    "hardness": 2.0,
    "resistance": 3.0
  }
}
```

## Propriétés

| Propriété | Type | Description |
|-----------|------|-------------|
| `id` | string | Identifiant unique |
| `displayName` | string | Affiché en jeu |
| `hardness` | number | Temps de minage |
| `resistance` | number | Résistance aux explosions |

## Prochaines Étapes

- [Propriétés des Blocs](/docs/modding/data-assets/blocks/block-properties)
- [Comportements des Blocs](/docs/modding/data-assets/blocks/block-behaviors)
