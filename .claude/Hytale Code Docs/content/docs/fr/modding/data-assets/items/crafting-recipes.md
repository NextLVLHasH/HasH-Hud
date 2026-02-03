---
id: crafting-recipes
title: Recettes de Craft
sidebar_label: Recettes de Craft
sidebar_position: 3
---

# Recettes de Craft

Définissez comment les objets sont fabriqués.

## Structure d'une Recette

```json
{
  "type": "shaped",
  "pattern": [
    " R ",
    " R ",
    " S "
  ],
  "key": {
    "R": "my_mod:ruby",
    "S": "minecraft:stick"
  },
  "result": "my_mod:ruby_sword"
}
```
