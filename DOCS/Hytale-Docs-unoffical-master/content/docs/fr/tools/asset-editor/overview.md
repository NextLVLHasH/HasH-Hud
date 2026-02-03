---
id: overview
title: Apercu de l'editeur d'assets
sidebar_label: Apercu
sidebar_position: 1
description: Decouvrir l'editeur d'assets integre de Hytale pour modifier le contenu du jeu
---

# Apercu de l'editeur d'assets

L'editeur d'assets est l'editeur principal integre de Hytale pour les assets de donnees. Il fournit une interface graphique pour modifier les Packs sans ecrire de code.

## Qu'est-ce que l'editeur d'assets ?

L'editeur d'assets vous permet de :
- Editer le contenu du jeu via une interface visuelle
- Modifier les Packs sans connaissance en programmation
- Voir les changements instantanement avec le hot reloading
- Travailler avec differents types de donnees de jeu

## Fonctionnalites principales

### Interface graphique

Aucun code requis - editez les assets via des controles visuels intuitifs :
- Edition par formulaires
- Selections par menu deroulant
- Curseurs de valeurs
- Previsualisations visuelles

### Hot reloading

Voyez vos changements instantanement en jeu :
- Les modifications s'appliquent immediatement
- Pas besoin de redemarrer le jeu
- Iteration et tests rapides
- Retour en temps reel

### Modification de Pack

Editez les Packs directement :
- Modifier le contenu existant
- Creer de nouveaux assets
- Remplacer le contenu du jeu de base
- Construire des packs de contenu complets

## Acceder a l'editeur d'assets

L'editeur d'assets est integre directement dans Hytale :
1. Lancer Hytale
2. Acceder a l'editeur via le menu des outils
3. Selectionner le type d'asset a editer
4. Commencer les modifications

## Types d'assets supportes

Actuellement supportes :
- Blocs
- Objets
- PNJ (basique)
- Autres assets de donnees

:::note En developpement
Certains types d'assets ne sont pas encore completement supportes. Les editeurs de PNJ et de generation de monde sont encore en amelioration.
:::

## Interface de l'editeur

L'interface de l'editeur d'assets inclut :

| Panneau | Fonction |
|---------|---------|
| Navigateur d'assets | Naviguer et selectionner des assets |
| Panneau des proprietes | Editer les valeurs des assets |
| Previsualisation | Voir la representation visuelle |
| Validation | Verifier les erreurs |

## Workflow

### Workflow d'edition de base

1. **Ouvrir l'editeur d'assets** - Acceder depuis les outils de Hytale
2. **Selectionner le type d'asset** - Choisir blocs, objets, etc.
3. **Trouver l'asset** - Parcourir ou rechercher l'asset
4. **Editer les proprietes** - Modifier les valeurs dans le panneau des proprietes
5. **Previsualiser** - Voir les changements dans la previsualisation
6. **Tester** - Le hot reload applique les changements instantanement

### Creer de nouveaux assets

1. Selectionner le type d'asset
2. Cliquer sur "Create New"
3. Definir l'identifiant de l'asset
4. Configurer les proprietes
5. Sauvegarder et tester

## Integration avec les autres outils

L'editeur d'assets fonctionne aux cotes des autres outils Hytale :

- **Blockbench** - Creer des modeles, les referencer dans l'editeur d'assets
- **Mode creatif** - Tester les assets edites en jeu
- **Node Editor** - Comportements complexes (generation de monde, PNJ)

## Bonnes pratiques

1. **Sauvegarder votre travail** - Faire des copies avant les changements majeurs
2. **Tester frequemment** - Utiliser le hot reloading pour verifier les changements
3. **Commencer petit** - Faire des modifications incrementales
4. **Referencer les assets existants** - Apprendre du contenu du jeu de base
5. **Organiser les assets** - Garder votre Pack bien structure

## Limitations

Limitations actuelles :
- Certains types d'assets pas encore editables
- Edition des comportements de PNJ incomplete
- Edition de la generation de monde en developpement

Ces fonctionnalites seront etendues avec le temps.

## Prochaines etapes

- [Edition des donnees](/docs/tools/asset-editor/editing-data) - Apprendre a editer des types d'assets specifiques
- [Blockbench](/docs/tools/blockbench/installation) - Creer des modeles pour vos assets
- [Mode creatif](/docs/tools/creative-mode) - Tester vos creations
