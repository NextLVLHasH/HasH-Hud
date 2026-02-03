---
id: textures
title: Textures
sidebar_label: Textures
sidebar_position: 3
description: Guide complet pour créer des textures pour les modèles et blocs Hytale
---

# Textures

Apprenez à créer des textures de haute qualité qui correspondent au style artistique distinctif peint à la main de Hytale. Ce guide est basé sur l'article officiel [Introduction to Making Models for Hytale](https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale) de Xael et Thomas Frick.

## Aperçu

Le style artistique de Hytale est décrit comme **"un jeu voxel moderne et stylisé, avec des textures pixel-art rétro"** - le plaçant à l'intersection du pixel art basse définition et de la 3D peinte à la main.

### Caractéristiques du Style Artistique

- **Style illustration** - ombres et reflets peints directement dans les textures
- **Pas de workflow PBR** - pas de maps de rugosité, normales ou métalliques
- **Dégradés doux** avec de subtiles variations de couleur
- **Couleurs chaudes et saturées** avec des ombres teintées (ex : violet dans les zones d'ombre)
- **Évitez le noir/blanc pur** - cela casse l'éclairage en jeu

> "Chaque texture est traitée comme une illustration où les ombres, l'occlusion ambiante et les reflets sont peints/intégrés directement dans la texture."
> — [Hytale Art Pipeline](https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale)

:::tip Conseils Officiels de Thomas Frick

- **Utilisez des ombres colorées** - ajoutez des teintes violet/bleu aux zones d'ombre pour plus de vivacité
- **Utilisez deux types de pinceaux** - un crayon pour les détails et un pinceau doux pour les dégradés
- **3-5 valeurs de couleur par matériau** - base, ombre, reflet et accent optionnel
:::

## Spécifications Techniques

### Résolutions Officielles

Hytale utilise deux densités de pixels distinctes selon le type d'objet :

| Type d'Objet | Pixels Par Unité | Cas d'Utilisation |
|--------------|------------------|-------------------|
| **64px** | Haute densité | Avatars, cosmétiques, outils, armes |
| **32px** | Standard | Blocs de construction, accessoires, props |

> "64px par unité permet des visages détaillés et l'expression des émotions."
> — [Official Art Pipeline](https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale)

### Format Requis

| Propriété | Exigence |
|-----------|----------|
| Format de Fichier | PNG (avec canal alpha) |
| Profondeur de Couleur | RGBA 32-bit |
| Dimensions | Multiples de 32px (32, 64, 128, 256, 512) |
| Taille Max | 512 x 512 pixels |
| Compression | Sans perte (pas d'artefacts JPEG) |

### Règles d'Étirement

L'étirement est permis pour éviter les problèmes de Z-fighting, mais doit être limité :

| Facteur d'Étirement | Recommandation |
|---------------------|----------------|
| **0.7x - 1.3x** | Plage sûre, distorsion de pixels minimale |
| **< 0.7x ou > 1.3x** | À éviter - cause une distorsion de pixels visible |

### Pourquoi des Multiples de 32 ?

Le moteur de rendu de Hytale optimise les atlas de textures basés sur un alignement de grille de 32 pixels. Les textures non conformes peuvent :

- Causer des erreurs de mapping UV
- Résulter en des débordements de texture
- Réduire les performances à cause de la fragmentation de l'atlas

```
✓ 32×32    ✓ 64×64    ✓ 128×128    ✓ 256×256
✓ 64×32    ✓ 128×64   ✓ 256×128    ✓ 512×256
✗ 50×50    ✗ 100×100  ✗ 48×48      ✗ 200×200
```

## Créer des Textures

### Logiciels Recommandés

| Logiciel | Idéal Pour | Coût |
|----------|------------|------|
| **Aseprite** | Pixel art, animations | 20$ |
| **GIMP** | Édition générale, option gratuite | Gratuit |
| **Photoshop** | Workflow professionnel | Abonnement |
| **Krita** | Peinture numérique | Gratuit |
| **Pixelorama** | Pixel art, open source | Gratuit |

### Configuration de l'Espace de Travail

1. **Créez un nouveau document** à votre résolution cible
2. **Définissez le mode couleur** en RGB 8-bit
3. **Activez la grille de pixels** pour une édition précise
4. **Désactivez l'anti-aliasing** sur tous les outils
5. **Utilisez l'interpolation nearest-neighbor** pour le redimensionnement

### Directives de Palette de Couleurs

Hytale utilise des palettes de couleurs soigneusement sélectionnées :

```
Couleurs de Base (exemples) :
├── Herbe :   #7cb342, #8bc34a, #9ccc65
├── Pierre :  #78909c, #90a4ae, #b0bec5
├── Bois :    #8d6e63, #a1887f, #bcaaa4
├── Sable :   #ffe082, #ffca28, #ffc107
└── Eau :     #4fc3f7, #29b6f6, #03a9f4
```

:::info Harmonie des Couleurs
Chaque matériau utilise 3-5 valeurs de couleur : base, ombre, reflet et accent optionnel. Gardez les variations subtiles pour le look peint à la main.
:::

## Types de Textures

### Textures de Blocs

Textures standard 32×32 ou 64×64 pour les blocs du monde :

```json
{
  "texture": {
    "identifier": "mymod:textures/blocks/custom_stone",
    "faces": {
      "all": "custom_stone.png"
    }
  }
}
```

#### Blocs Multi-Faces

Pour les blocs avec des côtés différents :

```json
{
  "texture": {
    "faces": {
      "up": "grass_top.png",
      "down": "dirt.png",
      "north": "grass_side.png",
      "south": "grass_side.png",
      "east": "grass_side.png",
      "west": "grass_side.png"
    }
  }
}
```

### Textures d'Entités

Textures plus grandes (64×64 à 256×256) pour les créatures et personnages :

```filetree
textures/
└── entities/
    └── custom_creature/
        ├── body.png
        ├── body_hurt.png
        └── body_emissive.png
```

### Textures d'Objets

Généralement des sprites 32×32 pour l'affichage d'inventaire :

```json
{
  "texture": {
    "identifier": "mymod:textures/items/magic_sword",
    "sprite": "magic_sword.png"
  }
}
```

## Mapping UV

### UV de Boîte Standard

Pour les modèles simples basés sur des cubes, Blockbench génère automatiquement les UV :

```
Disposition de Texture (cube déplié) :
┌────┬────┬────┬────┐
│    │HAUT│    │    │
│    │    │    │    │
├────┼────┼────┼────┤
│ O  │ N  │ E  │ S  │
│    │    │    │    │
├────┼────┼────┼────┤
│    │ BAS│    │    │
│    │    │    │    │
└────┴────┴────┴────┘

N = Nord (avant)
S = Sud (arrière)
E = Est (droite)
O = Ouest (gauche)
```

### Mapping UV Personnalisé

Pour les modèles complexes, utilisez l'éditeur UV de Blockbench :

1. Sélectionnez la/les face(s) dans la vue
2. Ouvrez le panneau UV
3. Faites glisser les sommets pour positionner sur la texture
4. Utilisez l'accrochage à la grille pour un alignement propre

### Éviter les Débordements de Texture

Le débordement de texture se produit quand les pixels adjacents "fuient" sur votre modèle :

**Solutions :**
- Ajoutez 1-2 pixels de marge entre les îlots UV
- Utilisez des textures en puissance de deux
- Évitez que les bords UV soient exactement sur les limites de pixels
- Activez "Pixel Perfect" dans Blockbench

## Types de Textures Spéciales

### Textures Émissives

Pour les parties lumineuses (yeux, effets magiques) :

```
nom de fichier : creature_emissive.png
- Pixels blancs = luminosité maximale
- Pixels noirs = pas de luminosité
- Gris = luminosité partielle
```

Les textures émissives ignorent l'éclairage et s'affichent toujours à pleine luminosité.

### Transparence

Pour les feuilles, le verre et les effets :

```
Valeurs du canal alpha :
- 255 = entièrement opaque
- 0 = entièrement transparent
- 1-254 = semi-transparent (à utiliser avec parcimonie)
```

:::warning Note de Performance
Les textures semi-transparentes sont plus coûteuses à rendre. Utilisez un alpha binaire (0 ou 255) quand c'est possible.
:::

### Textures Animées

Pour l'eau qui coule, les effets de feu :

```json
{
  "animation": {
    "frames": 8,
    "speed": 2,
    "interpolate": false
  }
}
```

Créez une bande verticale avec toutes les images :

```
Texture 32×256 pour une animation de 8 images :
┌────┐ Image 1
├────┤ Image 2
├────┤ Image 3
├────┤ Image 4
├────┤ Image 5
├────┤ Image 6
├────┤ Image 7
└────┘ Image 8
```

## Conseils de Style Artistique

### Obtenir le Look Hytale

1. **Commencez avec des couleurs plates** - Bloquez les zones principales d'abord
2. **Ajoutez des ombres douces** - Utilisez des variantes plus foncées, pas du noir
3. **Reflets subtils** - Variantes plus claires sur les bords
4. **Variation de couleur** - Brisez les grandes zones avec de légers décalages de teinte
5. **Évitez le noir/blanc pur** - Utilisez des sombres/clairs teintés

### Erreurs Courantes

| Erreur | Correction |
|--------|------------|
| Trop de contraste | Réduisez l'intensité des reflets/ombres |
| Ombrage en coussin | Éclairez depuis une direction de manière cohérente |
| Banding | Ajoutez du bruit/dithering aux dégradés |
| Sur-détaillage | Simplifiez pour la visualisation à l'échelle du jeu |
| Couleurs discordantes | Utilisez une palette harmonieuse |

### Exemple de Workflow

Créer une texture de bloc de pierre :

```
1. Remplissage de base avec gris moyen (#808080)
2. Ajoutez une légère teinte chaude (#858075)
3. Peignez des fissures plus foncées (#605850)
4. Reflets doux sur les bords (#a0a090)
5. Petites variations de couleur (#807878, #858080)
6. Vérifiez à 100% de zoom pour l'échelle du jeu
```

## Organisation des Fichiers

### Structure Recommandée

```filetree
mods/
└── my-mod/
    └── assets/
        └── textures/
            ├── blocks/
            │   ├── custom_stone.png
            │   └── custom_wood.png
            ├── items/
            │   ├── magic_sword.png
            │   └── health_potion.png
            ├── entities/
            │   └── custom_creature/
            │       ├── body.png
            │       └── body_emissive.png
            └── particles/
                └── magic_sparkle.png
```

### Conventions de Nommage

- Utilisez les **minuscules** avec des **underscores** : `fire_sword.png`
- Soyez **descriptif** : `oak_planks_vertical.png`
- Incluez les **variantes** : `grass_dry.png`, `grass_wet.png`
- Utilisez des **suffixes** pour les types : `_emissive.png`, `_normal.png`

## Dépannage

### Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Textures floues | Mauvais filtrage | Vérifiez les paramètres de mipmapping |
| Décalage de couleur | Incompatibilité sRGB | Exportez dans l'espace colorimétrique sRGB |
| Coutures visibles | Débordement UV | Ajoutez du padding aux îlots UV |
| Mauvaise taille | Non multiple de 32 | Redimensionnez aux dimensions valides |
| Alpha manquant | Mauvaise exportation | Activez l'export RGBA 32-bit |

## Prochaines Étapes

<div className="doc-card-grid">
  <DocCard item={{
    type: 'link',
    label: 'Modèles 3D',
    href: '/docs/modding/art-assets/models',
    description: 'Appliquez vos textures à des modèles personnalisés'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Animations',
    href: '/docs/modding/art-assets/animations',
    description: 'Animez vos modèles texturés'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Guide Blockbench',
    href: '/docs/tools/blockbench/modeling',
    description: 'Apprenez le mapping UV dans Blockbench'
  }} />
</div>
