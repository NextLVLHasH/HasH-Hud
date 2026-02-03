---
id: block-behaviors
title: Comportements des Blocs
sidebar_label: Comportements
sidebar_position: 3
---

# Comportements des Blocs

Ajoutez des comportements interactifs à vos blocs.

## Comportements Disponibles

- **Gravity** - Le bloc tombe comme le sable
- **Liquid** - Coule comme l'eau
- **Interactive** - Répond aux actions du joueur
- **Emissive** - Produit de la lumière

## Exemple

```json
{
  "behaviors": [
    {
      "type": "emissive",
      "light_level": 15
    }
  ]
}
```

*La documentation sera enrichie à mesure que de nouveaux comportements seront documentés.*
