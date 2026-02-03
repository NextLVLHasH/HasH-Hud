---
id: premier-mod-rapide
title: Votre Premier Mod en 10 Minutes
sidebar_label: Premier Mod Rapide
sidebar_position: 6
description: Creez votre premier mod Hytale en seulement 10 minutes - aucun code requis !
---

# Votre Premier Mod en 10 Minutes

Creer un mod Hytale est **FACILE** ! Vous n'avez pas besoin de savoir coder pour creer des packs de contenu. Dans ce tutoriel, vous allez creer un bloc decoratif personnalise en seulement 10 minutes.

:::tip Aucun Code Requis
Le systeme Data Assets de Hytale utilise de simples fichiers JSON que n'importe qui peut modifier. Si vous savez copier-coller, vous pouvez creer des mods !
:::

## Ce Que Nous Allons Creer

A la fin de ce tutoriel, vous aurez :

- Un bloc decoratif personnalise appele "Mon Premier Bloc"
- Une texture personnalisee pour votre bloc
- Un mod fonctionnel qui se charge dans Hytale

C'est parti !

---

## Prerequis (2 minutes)

Avant de commencer, assurez-vous d'avoir :

1. **Hytale installe** sur votre ordinateur
2. **Un editeur de texte** - Nous recommandons [VS Code](https://code.visualstudio.com/) (gratuit), mais le Bloc-notes fonctionne aussi
3. **Une image de 16x16 pixels** pour la texture de votre bloc (ou utilisez notre modele ci-dessous)

:::info Pas d'Editeur d'Image ?
Vous pouvez utiliser des outils en ligne gratuits comme [Piskel](https://www.piskelapp.com/) ou [Pixilart](https://www.pixilart.com/) pour creer votre texture 16x16. Ou telechargez simplement notre modele de depart !
:::

---

## Etape 1 : Creer la Structure du Mod (2 minutes)

D'abord, nous devons creer la structure de dossiers pour notre mod. Votre mod ressemblera a ceci :

```
mon-premier-mod/
├── pack.json
├── data/
│   └── blocks/
│       └── mon_bloc.json
└── assets/
    └── textures/
        └── blocks/
            └── mon_bloc.png
```

### Creation des Dossiers

**Sur Windows :**

Ouvrez l'Invite de commandes et executez :

```batch
cd %APPDATA%\Hytale\mods
mkdir mon-premier-mod
cd mon-premier-mod
mkdir data\blocks
mkdir assets\textures\blocks
```

**Sur macOS/Linux :**

Ouvrez le Terminal et executez :

```bash
cd ~/Library/Application Support/Hytale/mods  # macOS
# OU
cd ~/.local/share/Hytale/mods  # Linux

mkdir -p mon-premier-mod/data/blocks
mkdir -p mon-premier-mod/assets/textures/blocks
cd mon-premier-mod
```

:::tip Methode Rapide
Vous pouvez aussi creer ces dossiers manuellement avec l'Explorateur de fichiers (Windows) ou le Finder (macOS). Naviguez simplement vers le dossier mods de Hytale et creez la structure de dossiers indiquee ci-dessus.
:::

---

## Etape 2 : Creer pack.json (1 minute)

Le fichier `pack.json` indique a Hytale les informations sur votre mod. Creez un nouveau fichier appele `pack.json` dans votre dossier `mon-premier-mod` avec ce contenu :

```json
{
  "name": "Mon Premier Mod",
  "version": "1.0.0",
  "author": "VotreNom",
  "description": "Mon premier mod Hytale - un bloc personnalise !"
}
```

### Signification de Chaque Propriete

| Propriete | Description |
|-----------|-------------|
| `name` | Le nom d'affichage de votre mod |
| `version` | Le numero de version de votre mod (utilisez le [versionnage semantique](https://semver.org/lang/fr/)) |
| `author` | Votre nom ou pseudo |
| `description` | Une courte description affichee dans la liste des mods |

:::note
Remplacez `VotreNom` par votre vrai nom ou pseudo !
:::

---

## Etape 3 : Creer la Definition du Bloc (3 minutes)

Maintenant, la partie excitante - definir votre bloc personnalise ! Creez un fichier appele `mon_bloc.json` dans le dossier `data/blocks/` :

```json
{
  "id": "monpremiermod:mon_bloc",
  "displayName": "Mon Premier Bloc",
  "properties": {
    "hardness": 1.0,
    "resistance": 1.0,
    "tool": "pickaxe",
    "drops": "self"
  },
  "texture": "monpremiermod:blocks/mon_bloc"
}
```

### Comprendre Chaque Propriete

| Propriete | Valeur | Ce Qu'elle Fait |
|-----------|--------|-----------------|
| `id` | `"monpremiermod:mon_bloc"` | Identifiant unique de votre bloc. Format : `nomdumod:nomubloc` |
| `displayName` | `"Mon Premier Bloc"` | Le nom que les joueurs voient en jeu |
| `hardness` | `1.0` | Temps necessaire pour miner (plus eleve = plus lent) |
| `resistance` | `1.0` | Resistance aux explosions |
| `tool` | `"pickaxe"` | Le meilleur outil pour miner ce bloc |
| `drops` | `"self"` | Ce qui tombe quand on le mine (lui-meme) |
| `texture` | `"monpremiermod:blocks/mon_bloc"` | Chemin vers votre fichier de texture |

:::tip Idees de Personnalisation
- Mettez `hardness` a `0` pour un bloc qui se casse instantanement
- Mettez `hardness` a `50` pour un bloc extremement solide
- Changez `tool` en `"axe"` (hache), `"shovel"` (pelle), ou `"none"` (aucun)
:::

---

## Etape 4 : Ajouter Votre Texture (2 minutes)

Votre bloc a besoin d'une texture ! C'est une image PNG de 16x16 pixels.

### Option A : Creez la Votre

1. Ouvrez votre editeur d'image
2. Creez une nouvelle image de 16x16 pixels
3. Dessinez votre design (gardez-le simple pour votre premier essai !)
4. Enregistrez sous `mon_bloc.png` dans le dossier `assets/textures/blocks/`

### Option B : Utilisez une Texture de Depart

Creez une simple texture de couleur unie comme espace reserve. Voici ce que vous pouvez faire :

1. Utilisez n'importe quelle image PNG de 16x16
2. Une simple couleur unie ou un motif fonctionne tres bien
3. Vous pourrez toujours la remplacer plus tard !

### Conseils pour les Textures

- Gardez les designs simples et lisibles en petite taille
- Utilisez un eclairage coherent (lumiere venant du haut-gauche)
- Evitez trop de petits details
- Testez l'apparence quand les blocs sont cote a cote (effet de repetition)

---

## Etape 5 : Installer le Mod (1 minute)

Votre mod devrait deja etre au bon endroit si vous avez suivi l'Etape 1. Verifions :

### Emplacement du Mod

| Plateforme | Chemin |
|------------|--------|
| **Windows** | `%APPDATA%\Hytale\mods\mon-premier-mod\` |
| **macOS** | `~/Library/Application Support/Hytale/mods/mon-premier-mod/` |
| **Linux** | `~/.local/share/Hytale/mods/mon-premier-mod/` |

### Verification Finale de la Structure

Votre dossier devrait ressembler a ceci :

```
mon-premier-mod/
├── pack.json                          ✓
├── data/
│   └── blocks/
│       └── mon_bloc.json              ✓
└── assets/
    └── textures/
        └── blocks/
            └── mon_bloc.png           ✓
```

---

## Etape 6 : Testez Votre Mod ! (1 minute)

Il est temps de voir votre creation en action !

1. **Lancez Hytale**
2. **Demarrez un nouveau monde** en Mode Creatif
3. **Ouvrez votre inventaire** (appuyez sur `E`)
4. **Cherchez "Mon Premier Bloc"** dans la barre de recherche
5. **Placez-le dans le monde !**

:::success Felicitations !
Si vous pouvez voir et placer votre bloc, vous avez reussi a creer votre premier mod Hytale !
:::

---

## Felicitations !

Vous l'avez fait ! Vous avez cree votre premier mod Hytale. Voici ce que vous avez accompli :

- Cree une structure de dossiers pour un mod
- Defini un manifeste de pack
- Cree un bloc personnalise avec des proprietes
- Ajoute une texture personnalisee
- Installe et teste votre mod

### Ce Que Vous Avez Appris

- Les mods Hytale utilisent de simples fichiers JSON
- Le fichier `pack.json` decrit votre mod
- Les definitions de blocs specifient les proprietes comme la durete et la texture
- Les textures sont des images PNG de 16x16 pixels
- Les mods vont dans le dossier `mods` de votre installation Hytale

---

## Prochaines Etapes

Maintenant que vous avez cree votre premier bloc, voici quelques idees pour etendre votre mod :

### Ajouter Plus de Blocs

Dupliquez `mon_bloc.json`, renommez-le, et changez les proprietes pour creer des variantes :

```json
{
  "id": "monpremiermod:bloc_lumineux",
  "displayName": "Bloc Lumineux",
  "properties": {
    "hardness": 1.0,
    "resistance": 1.0,
    "lightLevel": 15
  },
  "texture": "monpremiermod:blocks/bloc_lumineux"
}
```

### Creer des Items

Ajoutez un dossier `items` et creez des items personnalises :

```json
{
  "id": "monpremiermod:gemme_magique",
  "displayName": "Gemme Magique",
  "maxStackSize": 64,
  "texture": "monpremiermod:items/gemme_magique"
}
```

### Ajouter des Recettes de Craft

Definissez comment les joueurs peuvent fabriquer vos items :

```json
{
  "type": "crafting_shaped",
  "pattern": [
    "AAA",
    "ABA",
    "AAA"
  ],
  "key": {
    "A": "minecraft:stone",
    "B": "minecraft:diamond"
  },
  "result": {
    "item": "monpremiermod:gemme_magique",
    "count": 1
  }
}
```

---

## Aller Plus Loin

Pret a en apprendre plus ? Consultez ces ressources :

- [Creer des Blocs](/docs/modding/data-assets/blocks/creating-blocks) - Documentation complete sur les blocs
- [Proprietes des Blocs](/docs/modding/data-assets/blocks/block-properties) - Toutes les proprietes disponibles
- [Creer des Items](/docs/modding/data-assets/items/creating-items) - Fabriquez des items personnalises
- [Recettes de Craft](/docs/modding/data-assets/items/crafting-recipes) - Ajoutez des recettes
- [Apercu des Art Assets](/docs/modding/art-assets/overview) - Creez des modeles personnalises

---

## Depannage

Des problemes ? Voici les solutions aux problemes courants :

### Le Bloc N'apparait Pas dans le Jeu

**Causes possibles :**
- Erreur de syntaxe JSON - Utilisez [JSONLint](https://jsonlint.com/) pour valider vos fichiers
- Mauvais emplacement du dossier - Verifiez que le mod est bien dans le dossier `mods`
- Faute de frappe dans l'ID du bloc - Assurez-vous que l'ID correspond exactement

**Solution :** Verifiez la console/les logs de Hytale pour les messages d'erreur indiquant le probleme.

### La Texture est Rose/Manquante

**Causes possibles :**
- Fichier de texture introuvable - Verifiez le chemin dans votre definition de bloc
- Mauvais format de fichier - Doit etre PNG
- Mauvais nom de fichier - Les noms sont sensibles a la casse !

**Solution :** Verifiez que le chemin de texture correspond exactement :
```
texture: "monpremiermod:blocks/mon_bloc"
         └── correspond a : assets/textures/blocks/mon_bloc.png
```

### Le Jeu Plante au Chargement

**Causes possibles :**
- Syntaxe JSON invalide (virgule manquante, crochet, etc.)
- Valeurs de proprietes invalides
- References circulaires

**Solution :**
1. Validez tous les fichiers JSON avec [JSONLint](https://jsonlint.com/)
2. Retirez votre mod et ajoutez les fichiers un par un
3. Verifiez le log de crash pour les erreurs specifiques

### Mod Non Reconnu

**Causes possibles :**
- `pack.json` manquant ou invalide
- Dossier du mod au mauvais endroit

**Solution :** Assurez-vous que `pack.json` existe et contient du JSON valide a la racine de votre dossier de mod.

---

## Reference Complete du Code

Voici tout le code de ce tutoriel en un seul endroit pour faciliter le copier-coller :

### pack.json

```json
{
  "name": "Mon Premier Mod",
  "version": "1.0.0",
  "author": "VotreNom",
  "description": "Mon premier mod Hytale - un bloc personnalise !"
}
```

### data/blocks/mon_bloc.json

```json
{
  "id": "monpremiermod:mon_bloc",
  "displayName": "Mon Premier Bloc",
  "properties": {
    "hardness": 1.0,
    "resistance": 1.0,
    "tool": "pickaxe",
    "drops": "self"
  },
  "texture": "monpremiermod:blocks/mon_bloc"
}
```

---

*Bon modding ! N'oubliez pas, chaque grand moddeur a commence par son premier bloc.*
