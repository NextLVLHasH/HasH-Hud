---
id: modeling
title: Guide de modelisation
sidebar_label: Modelisation
sidebar_position: 3
description: Creer des modeles 3D pour Hytale avec Blockbench
---

# Guide de modelisation

Creer des modeles 3D pour Hytale en utilisant Blockbench et le plugin officiel Hytale.

## Pour commencer

### Creer un nouveau modele

1. Ouvrir Blockbench
2. Aller dans **File > New > Hytale Model**
3. Configurer les parametres de votre projet
4. Cliquer sur **Create**

### Workflow de base

1. **Planifier votre modele** - Esquisser ou referencer votre design
2. **Creer la forme de base** - Ajouter des cubes pour la geometrie principale
3. **Configurer la hierarchie des os** - Organiser pour l'animation
4. **Ajouter des details** - Affiner la geometrie
5. **Appliquer des textures** - Creer et mapper des textures
6. **Exporter** - Sauvegarder en `.blockymodel`

## Ajouter de la geometrie

### Travailler avec les cubes

Les modeles Hytale sont construits a partir de cubes :

1. Selectionner un os dans l'Outliner
2. Cliquer sur **Add Cube** ou appuyer sur `N`
3. Positionner et redimensionner avec les poignees ou l'entree numerique
4. Faire pivoter si necessaire

### Conseils pour la geometrie

- **Minimiser le nombre de cubes** - Moins de cubes = meilleures performances
- **Utiliser des tailles appropriees** - Correspondre au style artistique de Hytale
- **Eviter les superpositions** - Garder une geometrie propre

## Hierarchie des os

### Configurer les os

Les os definissent comment votre modele s'anime :

1. Clic droit dans l'Outliner > **Add Bone**
2. Nommer l'os de maniere appropriee
3. Positionner le point de pivot de l'os
4. Parenter les cubes a l'os

### Conventions de nommage des os

Suivre les patterns de nommage de Hytale :
- `root` - Os de base
- `body` - Corps principal
- `head` - Os de tete
- `arm_left`, `arm_right` - Os de bras
- `leg_left`, `leg_right` - Os de jambes

### Points de pivot

Les points de pivot determinent les centres de rotation :

1. Selectionner un os
2. Ajuster la position du pivot dans le panneau des proprietes
3. Tester en faisant pivoter l'os

## Texturation

### Creer des textures

1. Aller dans l'onglet **Paint**
2. Utiliser les outils de peinture integres
3. Ou importer des textures externes

### Mapping UV

Mapper les textures sur la geometrie :

1. Selectionner un cube
2. Ouvrir l'editeur UV
3. Ajuster les coordonnees UV pour correspondre a votre texture

### Conseils pour les textures

- **Densite de pixels coherente** - Correspondre au style artistique de Hytale
- **Utiliser Box UV** pour un mapping simple
- **Planifier la disposition des textures** avant de peindre

## Orientation du modele

Important : Les modeles Hytale font face vers +Z

- **Avant** = direction +Z
- **Arriere** = direction -Z
- **Droite** = direction +X
- **Gauche** = direction -X
- **Haut** = direction +Y

## Export

### Exporter en .blockymodel

1. Aller dans **File > Export > Hytale Model**
2. Choisir l'emplacement d'export
3. Nommer votre fichier
4. Cliquer sur **Export**

### Liste de verification avant export

Avant d'exporter :
- [ ] Tous les os correctement nommes
- [ ] Hierarchie correcte
- [ ] Textures assignees
- [ ] Modele face a +Z
- [ ] Points de pivot definis

## Bonnes pratiques

1. **Commencer simple** - Construire la complexite graduellement
2. **Referencer les modeles officiels** - Etudier le style artistique de Hytale
3. **Tester frequemment** - Exporter et voir en jeu
4. **Optimiser** - Supprimer la geometrie inutile
5. **Organiser** - Garder l'Outliner propre et logique

## Problemes courants

### Le modele apparait mal en jeu

- Verifier l'orientation du modele (+Z vers l'avant)
- Verifier la hierarchie des os
- S'assurer de l'echelle correcte

### Textures non visibles

- Verifier que la texture est assignee
- Verifier le mapping UV
- S'assurer que le fichier de texture existe

### Problemes d'animation

- Verifier que le nommage des os suit les conventions
- Verifier les positions des points de pivot
- Voir le [Guide d'animation](/docs/tools/blockbench/animation)

## Prochaines etapes

- [Guide d'animation](/docs/tools/blockbench/animation) - Donner vie a vos modeles
- [Editeur d'assets](/docs/tools/asset-editor/overview) - Configurer les modeles en jeu
