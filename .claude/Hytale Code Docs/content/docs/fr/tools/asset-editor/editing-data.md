---
id: editing-data
title: Edition des assets de donnees
sidebar_label: Edition des donnees
sidebar_position: 2
description: Guide pour editer les assets de donnees du jeu avec l'editeur d'assets
---

# Edition des assets de donnees

Utilisez l'editeur d'assets pour modifier le contenu du jeu sans ecrire de code. Ce guide couvre l'edition de differents types d'assets.

## Hot reloading

L'une des fonctionnalites les plus puissantes de l'editeur d'assets est le hot reloading :

- **Mises a jour instantanees** - Les changements s'appliquent immediatement en jeu
- **Pas de redemarrage requis** - Continuer a jouer pendant l'edition
- **Iteration rapide** - Tester et ajuster rapidement
- **Retour en temps reel** - Voir les resultats instantanement

## Types d'assets supportes

### Blocs

Editer les proprietes des blocs :
- Apparence visuelle
- Proprietes physiques
- Comportements d'interaction
- Relations de craft

### Objets

Modifier les attributs des objets :
- Proprietes d'affichage
- Tailles de pile
- Comportements d'utilisation
- Caracteristiques d'outils

### PNJ (Basique)

Configurer les proprietes des PNJ :
- References de modele
- Attributs de base
- Parametres d'apparition

:::note Support limite
L'edition complete des comportements de PNJ est encore en developpement. Pour les comportements complexes, utilisez le Node Editor.
:::

## Workflow d'edition

### Etape 1 : Ouvrir l'editeur d'assets

1. Lancer Hytale
2. Acceder a l'editeur d'assets depuis le menu des outils
3. L'interface de l'editeur s'ouvrira

### Etape 2 : Selectionner le type d'asset

Choisir le type d'asset a editer :
- Blocs
- Objets
- PNJ
- Autres types disponibles

### Etape 3 : Trouver votre asset

Parcourir ou rechercher l'asset :
- Utiliser le navigateur d'assets
- Rechercher par nom ou ID
- Filtrer par categorie

### Etape 4 : Editer les proprietes

Modifier les valeurs dans le panneau des proprietes :
- Valeurs numeriques via curseurs ou entree
- Texte via champs de texte
- Options via menus deroulants
- References via selecteurs d'assets

### Etape 5 : Tester les changements

Avec le hot reloading :
1. Faire votre changement
2. Basculer vers la fenetre du jeu
3. Voir le changement applique immediatement
4. Iterer selon les besoins

## Taches d'edition courantes

### Changer les proprietes d'un bloc

Exemple : Modifier la durete d'un bloc

1. Ouvrir l'editeur d'assets
2. Naviguer vers Blocs
3. Selectionner le bloc
4. Trouver la propriete "hardness"
5. Ajuster la valeur
6. Tester en jeu

### Modifier les stats d'un objet

Exemple : Changer les degats d'un objet

1. Ouvrir l'editeur d'assets
2. Naviguer vers Objets
3. Selectionner l'objet
4. Trouver les proprietes liees aux degats
5. Modifier les valeurs
6. Tester avec le hot reload

### Configurer des PNJ

Exemple : Changer le modele d'un PNJ

1. Ouvrir l'editeur d'assets
2. Naviguer vers PNJ
3. Selectionner le PNJ
4. Trouver la reference du modele
5. Selectionner un modele different
6. Voir le changement en jeu

## Travailler avec les Packs

### Editer le contenu des Packs

L'editeur d'assets fonctionne avec les Packs :
- Editer les assets de Pack existants
- Creer de nouveaux assets pour votre Pack
- Remplacer le contenu du jeu de base

### Organisation des Packs

Garder votre Pack organise :
- Structure de dossiers logique
- Nommage coherent
- Categories d'assets claires

## Bonnes pratiques

1. **Faire des sauvegardes** - Avant les editions majeures, faire des copies
2. **Documenter les changements** - Garder des notes sur ce que vous avez modifie
3. **Tester incrementalement** - Petits changements, tests frequents
4. **Apprendre des valeurs par defaut** - Etudier les assets existants
5. **Valider souvent** - Verifier les erreurs avant de tester

## Depannage

### Changements non visibles

Si le hot reload ne fonctionne pas :
- Verifier que l'asset est sauvegarde
- Verifier que vous editez le bon asset
- S'assurer que le Pack est charge
- Essayer de recharger l'asset manuellement

### Erreurs de validation

Si vous voyez des erreurs de validation :
- Verifier que les champs requis sont remplis
- Verifier que les references pointent vers des assets valides
- S'assurer que les valeurs sont dans les plages valides

### Asset introuvable

Si vous ne trouvez pas un asset :
- Verifier la bonne categorie
- Utiliser la fonction de recherche
- Verifier que l'asset existe dans votre Pack

## Sujets avances

### Referencer des modeles

Quand votre asset a besoin d'un modele personnalise :
1. Creer le modele dans Blockbench
2. Exporter en `.blockymodel`
3. Placer dans le dossier des modeles de votre Pack
4. Referencer dans l'editeur d'assets

### Utiliser le Node Editor

Pour les systemes complexes au-dela de l'editeur d'assets :
- Regles de generation de monde
- Comportements de PNJ
- Pinceaux scriptes

Le Node Editor fournit une edition visuelle par graphe pour ces fonctionnalites avancees.

## Documentation associee

- [Apercu de l'editeur d'assets](/docs/tools/asset-editor/overview) - Introduction a l'editeur
- [Blockbench](/docs/tools/blockbench/installation) - Creer des modeles
- [Mode creatif](/docs/tools/creative-mode) - Tester votre contenu
