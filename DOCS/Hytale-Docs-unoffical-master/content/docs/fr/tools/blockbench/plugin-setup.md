---
id: plugin-setup
title: Configuration du plugin Hytale
sidebar_label: Configuration du plugin
sidebar_position: 2
description: Configurer le plugin Hytale pour Blockbench pour la creation de modeles
---

# Configuration du plugin Hytale

Configurer le plugin officiel Hytale pour Blockbench pour une creation de modeles optimale.

## Fonctionnalites du plugin

Le plugin Hytale fournit :

- **Format `.blockymodel`** - Format de modele natif Hytale
- **Animations `.blockyanim`** - Format d'animation Hytale
- **Parametres specifiques a Hytale** - Ratios de pixels et contraintes appropriees
- **Outils de hierarchie des os** - Support du systeme squelettique de Hytale
- **Export en direct** - Exporter directement vers des formats compatibles Hytale
- **Ameliorations de qualite de vie** - Workflow optimise pour le contenu Hytale

## Creer un nouveau modele

### Demarrer un projet Hytale Model

1. Ouvrir Blockbench
2. Aller dans **File > New**
3. Selectionner **Hytale Model**
4. Configurer les parametres du projet :
   - Nommer votre modele
   - Definir la resolution (taille de texture)
   - Choisir un template de base si disponible
5. Cliquer sur **Create**

### Parametres du projet

Lors de la creation d'un nouveau Hytale Model :

| Parametre | Description |
|---------|-------------|
| Name | Identifiant du modele |
| Resolution | Dimensions de texture (ex: 64x64) |
| Box UV | Style de mapping UV |

## Apercu de l'espace de travail

Apres avoir cree un projet, vous verrez :

- **Viewport 3D** - Editeur de modele visuel
- **Outliner** - Hierarchie des os et elements
- **Editeur UV** - Mapping de texture
- **Timeline** - Images cles d'animation (en mode animation)

## Parametres du plugin

Acceder aux parametres du plugin via **File > Preferences > Settings**

Parametres cles pour le workflow Hytale :
- Chemins d'export
- Textures par defaut
- Conventions de nommage des os

## Bonnes pratiques

1. **Utiliser un nommage coherent** - Suivre les conventions de nommage des os de Hytale
2. **Verifier les ratios de pixels** - S'assurer que les textures correspondent au style de Hytale
3. **Organiser la hierarchie** - Garder les os bien organises pour l'animation
4. **Tester frequemment** - Exporter et tester en jeu souvent

## Depannage

### Plugin non visible

Si l'option Hytale Model n'apparait pas :
1. Verifier que le plugin est active dans **File > Plugins**
2. Redemarrer Blockbench
3. Reinstaller le plugin

### Problemes d'export

Si les exports echouent :
1. Verifier que tous les champs requis sont remplis
2. Verifier que la hierarchie des os est valide
3. S'assurer que les textures sont correctement assignees

## Prochaines etapes

- [Guide de modelisation](/docs/tools/blockbench/modeling) - Creer des modeles 3D
- [Guide d'animation](/docs/tools/blockbench/animation) - Animer vos modeles
