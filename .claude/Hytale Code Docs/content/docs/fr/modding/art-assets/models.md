---
id: models
title: Modèles 3D
sidebar_label: Modèles
sidebar_position: 2
description: Guide complet pour créer des modèles 3D pour Hytale avec Blockbench
---

# Modèles 3D

Apprenez à créer des modèles 3D personnalisés pour les blocs, objets, créatures et accessoires dans Hytale en utilisant Blockbench.

## Aperçu

Hytale utilise un format de modèle personnalisé appelé `.blockymodel` qui supporte :

- **Géométrie basée sur des cuboïdes** - Les modèles sont construits à partir de boîtes rectangulaires
- **Hiérarchies d'os** - Pour le support de l'animation squelettique
- **Mapping UV** - Positionnement précis des textures
- **Points de pivot** - Définissent les centres de rotation pour les animations
- **Textures multiples** - Support pour les maps diffuse, émissive et spéciales

:::info Pourquoi Blockbench ?
Blockbench est l'outil officiellement recommandé pour créer des modèles Hytale. Il dispose d'un plugin Hytale dédié qui exporte directement au format `.blockymodel` et fournit des fonctionnalités spécifiques à Hytale.
:::

## Format de Fichier

### Structure .blockymodel

Les modèles Hytale utilisent le format JSON `.blockymodel` :

```json
{
  "format_version": "1.0",
  "model": {
    "identifier": "custom:my_creature",
    "texture_width": 64,
    "texture_height": 64,
    "bones": [
      {
        "name": "root",
        "pivot": [0, 0, 0],
        "cubes": [...],
        "children": [...]
      }
    ]
  }
}
```

### Propriétés Clés

| Propriété | Type | Description |
|-----------|------|-------------|
| `format_version` | string | Version du format de modèle (actuellement "1.0") |
| `identifier` | string | ID unique du modèle au format `namespace:name` |
| `texture_width` | integer | Largeur de l'atlas de texture en pixels (doit être un multiple de 32) |
| `texture_height` | integer | Hauteur de l'atlas de texture en pixels (doit être un multiple de 32) |
| `bones` | array | Structure hiérarchique des os |

## Hiérarchie des Os

Les os sont les blocs de construction des modèles animables. Chaque os peut contenir :

- **Cubes** - La géométrie visible
- **Point de pivot** - Le centre de rotation
- **Enfants** - Les os enfants qui héritent des transformations

### Squelette Humanoïde Standard

Pour les créatures humanoïdes, Hytale utilise cette hiérarchie d'os standard :

```filetree
waist (root)
├── torso/
│   ├── chest/
│   │   ├── shoulder_left/
│   │   │   ├── arm_left/
│   │   │   │   └── hand_left/
│   │   ├── shoulder_right/
│   │   │   ├── arm_right/
│   │   │   │   └── hand_right/
│   │   └── neck/
│   │       └── head/
├── hip_left/
│   ├── leg_left/
│   │   └── foot_left/
└── hip_right/
    ├── leg_right/
        └── foot_right/
```

:::tip Convention de Nommage
Utilisez des noms d'os cohérents dans vos modèles pour réutiliser les animations. Le système d'animation de Hytale fait correspondre les os par leur nom.
:::

### Propriétés des Os

```json
{
  "name": "arm_left",
  "pivot": [4, 22, 0],
  "rotation": [0, 0, 0],
  "cubes": [
    {
      "origin": [4, 12, -2],
      "size": [4, 10, 4],
      "uv": [40, 16]
    }
  ],
  "children": [...]
}
```

| Propriété | Description |
|-----------|-------------|
| `name` | Identifiant de l'os (utilisé pour cibler les animations) |
| `pivot` | Point central de rotation [x, y, z] |
| `rotation` | Rotation par défaut en degrés [x, y, z] |
| `cubes` | Tableau de géométrie cuboïde |
| `children` | Os enfants imbriqués |

## Cubes (Géométrie)

Les cubes sont les primitives géométriques qui composent la forme visible de votre modèle.

### Propriétés des Cubes

```json
{
  "origin": [0, 0, 0],
  "size": [8, 8, 8],
  "uv": [0, 0],
  "inflate": 0,
  "mirror": false
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `origin` | [x, y, z] | Position du coin bas-nord-ouest |
| `size` | [w, h, d] | Dimensions en pixels (1 pixel = 1/16 de bloc) |
| `uv` | [u, v] | Décalage UV de texture pour le mapping automatique |
| `inflate` | number | Étendre le cube vers l'extérieur (utile pour les couches d'armure) |
| `mirror` | boolean | Miroir UV horizontal |

### Mapping UV par Face

Pour un contrôle précis des textures, utilisez l'UV par face :

```json
{
  "origin": [0, 0, 0],
  "size": [8, 8, 8],
  "faces": {
    "north": {"uv": [8, 8, 16, 16]},
    "south": {"uv": [24, 8, 32, 16]},
    "east": {"uv": [0, 8, 8, 16]},
    "west": {"uv": [16, 8, 24, 16]},
    "up": {"uv": [8, 0, 16, 8]},
    "down": {"uv": [16, 0, 24, 8]}
  }
}
```

## Exigences pour les Textures

### Dimensions

- Doivent être des **multiples de 32 pixels** (32x32, 64x64, 128x128, etc.)
- Textures carrées recommandées mais pas obligatoires
- Taille maximale : 512x512 pixels

### Format

- **Format PNG** avec support de la transparence
- Utilisez le scaling **nearest-neighbor** (pas d'anti-aliasing)
- Gardez une taille de fichier raisonnable pour le streaming réseau

### Disposition UV

Disposition UV standard pour un cube :

```
┌─────────┬─────────┬─────────┬─────────┐
│         │   UP    │         │         │
│         │ (haut)  │         │         │
├─────────┼─────────┼─────────┼─────────┤
│  WEST   │  NORTH  │  EAST   │  SOUTH  │
│ (gauche)│ (avant) │ (droite)│(arrière)│
├─────────┼─────────┼─────────┼─────────┤
│         │  DOWN   │         │         │
│         │  (bas)  │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

## Types de Modèles

### Modèles de Blocs

Pour les blocs personnalisés, les modèles sont plus simples sans hiérarchies d'os :

```json
{
  "format_version": "1.0",
  "model": {
    "identifier": "mymod:fancy_block",
    "texture_width": 32,
    "texture_height": 32,
    "elements": [
      {
        "from": [0, 0, 0],
        "to": [16, 16, 16],
        "faces": {
          "all": {"uv": [0, 0, 16, 16], "texture": "#main"}
        }
      }
    ]
  }
}
```

### Modèles d'Objets

Les objets peuvent utiliser des sprites 2D ou des modèles 3D :

```json
{
  "format_version": "1.0",
  "model": {
    "identifier": "mymod:custom_sword",
    "display": {
      "hand": {
        "rotation": [0, -90, -45],
        "translation": [0, 4, 0],
        "scale": [1.5, 1.5, 1.5]
      }
    }
  }
}
```

### Modèles d'Entités

Modèles de créatures complets avec support d'animation :

```json
{
  "format_version": "1.0",
  "model": {
    "identifier": "mymod:custom_creature",
    "visible_bounds_width": 2,
    "visible_bounds_height": 3,
    "visible_bounds_offset": [0, 1.5, 0],
    "texture_width": 128,
    "texture_height": 128,
    "bones": [...]
  }
}
```

## Bonnes Pratiques

### Performance

1. **Minimisez le nombre de cubes** - Chaque cube ajoute un coût de rendu
2. **Utilisez des tailles de texture appropriées** - N'utilisez pas 512x512 pour un petit accessoire
3. **Optimisez la hiérarchie des os** - Moins d'os = meilleures performances d'animation
4. **Supprimez les faces invisibles** - Retirez les faces qui ne seront jamais vues

### Organisation

1. **Nommage cohérent** - Utilisez des noms d'os clairs et descriptifs
2. **Hiérarchie logique** - Les os parents doivent avoir du sens pour l'animation
3. **Centrez votre modèle** - Origine au centre du modèle pour une rotation correcte
4. **Documentez les points de pivot** - Notez les centres de rotation pour les animateurs

### Compatibilité

1. **Testez en jeu** - L'aperçu Blockbench peut différer de l'affichage en jeu
2. **Vérifiez les collisions** - Les limites du modèle affectent le gameplay
3. **Vérifiez le mapping UV** - Assurez-vous qu'il n'y a pas de débordement de texture
4. **Testez les animations** - Vérifiez que la hiérarchie des os fonctionne avec les animations prévues

## Workflow

### Créer un Nouveau Modèle

1. **Ouvrez Blockbench** et sélectionnez le format "Hytale Model"
2. **Définissez les dimensions de texture** appropriées pour la complexité de votre modèle
3. **Construisez la hiérarchie des os** en partant de la racine
4. **Ajoutez des cubes** à chaque os
5. **Mappez les UV** de vos textures
6. **Exportez** en `.blockymodel`

### Placement des Fichiers

```filetree
mods/
└── my-mod/
    └── assets/
        └── models/
            ├── blocks/
            │   └── fancy_block.blockymodel
            ├── items/
            │   └── custom_sword.blockymodel
            └── entities/
                └── custom_creature.blockymodel
```

## Dépannage

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| Le modèle n'apparaît pas | Vérifiez que le chemin du fichier et l'identifiant correspondent |
| Glitches de texture | Vérifiez le mapping UV et les dimensions de texture |
| L'animation casse | Assurez-vous que les noms d'os correspondent aux cibles d'animation |
| Z-fighting | Ajustez les positions des cubes pour éviter le chevauchement |
| Modèle trop grand/petit | Vérifiez l'échelle et assurez-vous que 1 pixel = 1/16 de bloc |

### Conseils de Débogage

- Utilisez l'aperçu de Blockbench avec différents éclairages
- Vérifiez la console du jeu pour les erreurs de chargement de modèle
- Vérifiez la syntaxe JSON avec un validateur
- Testez d'abord avec une texture simple

## Prochaines Étapes

<div className="doc-card-grid">
  <DocCard item={{
    type: 'link',
    label: 'Guide des Textures',
    href: '/docs/modding/art-assets/textures',
    description: 'Apprenez la création et le mapping de textures'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Animations',
    href: '/docs/modding/art-assets/animations',
    description: 'Donnez vie à vos modèles avec des animations'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Configuration de Blockbench',
    href: '/docs/tools/blockbench/installation',
    description: 'Installez et configurez Blockbench'
  }} />
</div>
