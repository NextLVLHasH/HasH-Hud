---
id: first-mod
title: Votre premier mod
sidebar_label: Votre premier mod
sidebar_position: 4
description: Creez votre premier mod Hytale etape par etape
---

# Votre premier mod

Creons un bloc personnalise simple pour commencer avec le modding Hytale.

## Apercu

Nous allons creer un "Ruby Block" qui :
- Apparait dans le jeu
- Possede des proprietes personnalisees
- Peut etre place et casse

## Etape 1 : Creer la structure de dossiers

```
my-first-mod/
├── packs/
│   └── blocks/
│       └── ruby_block.json
└── textures/
    └── blocks/
        └── ruby_block.png
```

## Etape 2 : Definir le bloc

Creez `packs/blocks/ruby_block.json` :

```json
{
  "id": "my_mod:ruby_block",
  "displayName": "Ruby Block",
  "properties": {
    "hardness": 3.0,
    "resistance": 5.0,
    "material": "stone"
  },
  "texture": "textures/blocks/ruby_block.png"
}
```

## Etape 3 : Creer la texture

Creez une texture PNG de 32x32 pixels pour votre bloc et enregistrez-la sous `textures/blocks/ruby_block.png`.

:::tip Consignes pour les textures

- Les textures doivent etre des multiples de 32 pixels
- Utilisez le style artistique peint a la main de Hytale
- Gardez des tailles de fichiers raisonnables
:::

## Etape 4 : Installer sur le serveur

1. Copiez votre dossier de mod dans le repertoire `/mods/` du serveur
2. Redemarrez le serveur
3. Rejoignez et testez !

## Etape 5 : Tester en jeu

Utilisez le mode creatif ou les commandes pour faire apparaitre votre bloc :

```
/give @s my_mod:ruby_block 64
```

## Depannage

| Probleme | Solution |
|----------|----------|
| Le bloc n'apparait pas | Verifiez la syntaxe JSON, verifiez les chemins de fichiers |
| Texture manquante | Assurez-vous que le PNG est en 32x32, verifiez le chemin dans le JSON |
| Le serveur ne demarre pas | Consultez les logs du serveur pour les erreurs |

## Prochaines etapes

Felicitations ! Vous avez cree votre premier mod. Continuez a apprendre :

- [Creating Items](/docs/modding/data-assets/items/creating-items)
- [Creating NPCs](/docs/modding/data-assets/npcs/creating-npcs)
- [Java Plugins](/docs/modding/plugins/overview)
