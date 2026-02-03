---
id: animation
title: Guide d'animation
sidebar_label: Animation
sidebar_position: 4
description: Creer des animations pour les modeles Hytale avec Blockbench
---

# Guide d'animation

Creer des animations pour vos modeles Hytale avec Blockbench et les exporter en fichiers `.blockyanim`.

## Pour commencer

### Prerequis

Avant d'animer :
- Avoir un modele complete avec une hierarchie d'os appropriee
- Les os doivent avoir des points de pivot corrects
- Suivre les conventions de nommage des os de Hytale

### Acceder au mode animation

1. Ouvrir votre modele dans Blockbench
2. Cliquer sur l'onglet **Animate** en haut
3. Le panneau Timeline apparaitra en bas

## Creer des animations

### Nouvelle animation

1. Dans le panneau Animation, cliquer sur **Add Animation** (+)
2. Nommer votre animation (ex: `idle`, `walk`, `attack`)
3. Definir les proprietes de l'animation :
   - **Loop Mode** : Once, Loop, ou Hold
   - **Length** : Duree en secondes

### Definir des images cles

Les images cles definissent les positions des os a des moments specifiques :

1. Deplacer le curseur de la timeline au temps desire
2. Selectionner un os dans l'Outliner
3. Transformer l'os (rotation, deplacement, echelle)
4. Une image cle est automatiquement creee

### Types d'images cles

| Type | Raccourci | Utilisation |
|------|----------|-----|
| Rotation | R | Faire pivoter les os |
| Position | G | Deplacer les os |
| Scale | S | Mettre a l'echelle les os |

## Workflow d'animation

### Workflow de base

1. **Planifier** - Storyboarder votre animation
2. **Bloquer** - Definir les poses cles aux frames importants
3. **Affiner** - Ajouter des images cles intermediaires
4. **Peaufiner** - Ajuster le timing et les courbes
5. **Tester** - Previsualiser et iterer

### Creer un cycle de marche

Exemple de workflow pour une animation de marche :

1. Creer une nouvelle animation nommee `walk`
2. Definir le mode de boucle sur **Loop**
3. Definir la duree (ex: 1 seconde)
4. Image cle 0 : Pose de contact (pieds ensemble)
5. Image cle 0.25s : Pose de passage (une jambe en avant)
6. Image cle 0.5s : Pose de contact (oppose)
7. Image cle 0.75s : Pose de passage (autre jambe)
8. S'assurer que l'image cle 1s correspond a l'image cle 0 pour une boucle fluide

## Editeur de courbes

Utiliser l'editeur de courbes pour des animations fluides :

1. Selectionner des images cles dans la timeline
2. Ouvrir le panneau Graph Editor
3. Ajuster les courbes pour l'easing :
   - **Linear** - Vitesse constante
   - **Smooth** - Ease in/out
   - **Bezier** - Courbes personnalisees

### Conseils d'easing

- Utiliser ease-in pour les mouvements de demarrage
- Utiliser ease-out pour les mouvements d'arret
- Combiner pour un mouvement naturel

## Types d'animations

### Animations courantes

| Animation | Description |
|-----------|-------------|
| `idle` | Debout immobile, respiration |
| `walk` | Mouvement normal |
| `run` | Mouvement rapide |
| `attack` | Action de combat |
| `hurt` | Prendre des degats |
| `death` | Animation de mort |
| `jump` | Mouvement de saut |

### Boucle vs Une fois

- **Boucle** : `idle`, `walk`, `run` - Actions continues
- **Une fois** : `attack`, `death` - Lecture unique

## Exporter les animations

### Exporter en .blockyanim

1. Aller dans **File > Export > Hytale Animation**
2. Choisir l'emplacement d'export
3. Nommer votre fichier
4. Cliquer sur **Export**

### Exporter toutes les animations

Pour exporter plusieurs animations :
1. Chaque animation s'exporte en fichier `.blockyanim` separe
2. Nommer les animations de maniere coherente
3. Garder les animations organisees dans des dossiers

## Bonnes pratiques

1. **Commencer par idle** - C'est l'animation la plus vue
2. **Garder les mouvements fluides** - Eviter les transitions saccadees
3. **Tester en jeu frequemment** - Voir comment ca apparait vraiment
4. **Utiliser des references** - Etudier le mouvement reel ou d'autres jeux
5. **12 principes** - Appliquer les principes d'animation
6. **Timing coherent** - Correspondre a l'ambiance du jeu

## Problemes courants

### Mouvement saccade

- Ajouter plus d'images cles entre les poses
- Utiliser l'editeur de courbes pour lisser
- Verifier les images cles conflictuelles

### L'animation ne boucle pas

- S'assurer que les premiere et derniere images cles correspondent exactement
- Definir le mode de boucle sur **Loop**
- Verifier que tous les os retournent a la position de depart

### Mauvais os en mouvement

- Verifier que le bon os est selectionne
- Verifier la hierarchie/parentage des os
- S'assurer que les images cles sont sur le bon os

### Problemes de point de pivot

- Retourner en mode Edit
- Ajuster la position du point de pivot
- Re-tester l'animation

## Conseils pour la qualite

1. **Anticipation** - Petit mouvement de preparation avant l'action
2. **Suivi** - Le mouvement continue apres l'action
3. **Squash and stretch** - Dans les limites du style artistique de Hytale
4. **Mouvement secondaire** - Cheveux, tissu, accessoires
5. **Poids** - Les choses lourdes bougent differemment des legeres

## Prochaines etapes

- [Editeur d'assets](/docs/tools/asset-editor/overview) - Configurer les animations en jeu
- [Guide de modelisation](/docs/tools/blockbench/modeling) - Creer de nouveaux modeles
