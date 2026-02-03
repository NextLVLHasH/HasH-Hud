---
id: overview
title: Aperçu des Art Assets
sidebar_label: Aperçu
sidebar_position: 1
description: Créer du contenu visuel pour Hytale
---

# Aperçu des Art Assets

Les art assets donnent vie à vos mods avec des visuels personnalisés.

## Types d'Assets

| Type | Format | Outil |
|------|--------|-------|
| Modèles 3D | `.blockymodel` | Blockbench |
| Animations | `.blockyanim` | Blockbench |
| Textures | `.png` | Éditeur d'image |
| Sons | `.ogg` | Éditeur audio |

## Blockbench

L'outil principal pour le contenu 3D Hytale :

- Plugin Hytale officiel
- Création de modèles
- Système d'animation
- Support de la hiérarchie d'os

[Guide d'installation de Blockbench](/docs/tools/blockbench/installation)

## Spécifications des Textures

| Propriété | Exigence |
|-----------|----------|
| Format | PNG |
| Dimensions | Multiples de 32px |
| Densité de Texels | 64px/unité (personnages), 32px/unité (blocs) |
| Style | Peint à la main, pas de PBR |

## Directives pour les Modèles

### Géométrie

- Utilisez uniquement des cuboïdes et des quads
- Minimisez le nombre de polygones
- Optimisez pour les performances

### Hiérarchie des Os

```
waist (root)
├── torso
│   ├── shoulder_left → elbow_left → hand_left
│   ├── shoulder_right → elbow_right → hand_right
│   └── head
├── hip_left → knee_left → foot_left
└── hip_right → knee_right → foot_right
```

## Pour Commencer

- [Installation de Blockbench](/docs/tools/blockbench/installation)
- [Guide de Modélisation](/docs/tools/blockbench/modeling)
- [Guide d'Animation](/docs/tools/blockbench/animation)
