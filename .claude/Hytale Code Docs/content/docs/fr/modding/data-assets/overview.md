---
id: overview
title: Aperçu des Data Assets
sidebar_label: Aperçu
sidebar_position: 1
description: Création de contenu basée sur JSON pour Hytale
---

# Aperçu des Data Assets

Les Data Assets sont des fichiers JSON qui définissent le contenu du jeu sans nécessiter de programmation.

## Que sont les Data Assets ?

Les Data Assets contrôlent :
- **Blocs** - Propriétés, comportements, apparence
- **Objets** - Statistiques, effets, interactions
- **PNJ** - Comportements, statistiques, IA
- **Tables de Butin** - Drops, probabilités
- **Génération du Monde** - Biomes, structures

## Avantages

- Pas de programmation requise
- Modifiable avec l'Asset Editor
- Support du rechargement en direct
- Peut être combiné avec des plugins

## Structure de Base

```json
{
  "id": "namespace:asset_name",
  "displayName": "Nom Lisible",
  "properties": {
    "key": "value"
  }
}
```

## Asset Editor

L'Asset Editor intégré fournit :
- Interface d'édition visuelle
- Validation
- Aperçu en direct
- Pas de code requis

## Organisation des Fichiers

```
mods/my-pack/
├── blocks/
│   └── custom_block.json
├── items/
│   └── custom_item.json
├── npcs/
│   └── custom_npc.json
└── loot_tables/
    └── custom_loot.json
```

## Pour Commencer

- [Créer des Blocs](/docs/modding/data-assets/blocks/creating-blocks)
- [Créer des Objets](/docs/modding/data-assets/items/creating-items)
- [Créer des PNJ](/docs/modding/data-assets/npcs/creating-npcs)
