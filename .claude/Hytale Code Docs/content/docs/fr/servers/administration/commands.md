---
id: commands
title: Commandes du serveur
sidebar_label: Commandes
sidebar_position: 1
---

# Commandes du serveur

Commandes console et en jeu pour l'administration du serveur Hytale.

---

## Commandes Joueur

Commandes pour gerer les joueurs, leurs modes de jeu, statistiques, effets et camera.

### gamemode

Change le mode de jeu d'un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/gamemode <gamemode> [joueur]` |
| **Alias** | `gm` |
| **Permission** | `gamemode.self`, `gamemode.other` |

**Parametres :**
- `gamemode` - Le mode de jeu a definir (ex: Creative, Adventure, Survival)
- `joueur` (optionnel) - Joueur cible (necessite la permission `gamemode.other`)

**Exemples :**
```
/gamemode creative
/gamemode adventure NomJoueur
/gm survival
```

---

### kill

Tue instantanement un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/kill [joueur]` |
| **Permission** | `kill.self`, `kill.other` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (necessite la permission `kill.other`)

**Exemples :**
```
/kill
/kill NomJoueur
```

---

### damage

Inflige des degats a un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/damage [montant] [--silent] [joueur]` |
| **Alias** | `hurt` |
| **Permission** | `damage.self`, `damage.other` |

**Parametres :**
- `montant` (optionnel) - Quantite de degats a infliger (defaut: 1.0)
- `--silent` (drapeau) - Supprime le message de notification de degats
- `joueur` (optionnel) - Joueur cible (necessite la permission `damage.other`)

**Exemples :**
```
/damage
/damage 5.0
/damage 10 --silent NomJoueur
/hurt 3.5
```

---

### hide

Cache un joueur aux autres joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hide <joueur> [cible]` |
| **Sous-commandes** | `show`, `all`, `showall` |

**Parametres :**
- `joueur` - Le joueur a cacher
- `cible` (optionnel) - Cacher uniquement d'un joueur specifique (cache de tous si non specifie)

**Sous-commandes :**
- `/hide show <joueur> [cible]` - Rendre un joueur visible a nouveau
- `/hide all` - Cacher tous les joueurs les uns des autres
- `/hide showall` - Rendre tous les joueurs visibles les uns aux autres

**Exemples :**
```
/hide NomJoueur
/hide NomJoueur JoueurCible
/hide show NomJoueur
/hide all
/hide showall
```

---

### whereami

Affiche la position actuelle et les informations du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whereami [joueur]` |
| **Permission** | `whereami.self`, `whereami.other` |
| **Mode de jeu** | Creative |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (necessite la permission `whereami.other`)

**Informations affichees :**
- Nom du monde
- Coordonnees du chunk (X, Y, Z)
- Coordonnees de position (X, Y, Z)
- Rotation de la tete (lacet, tangage, roulis)
- Informations de direction et d'axe
- Statut de sauvegarde du chunk

**Exemples :**
```
/whereami
/whereami NomJoueur
```

---

### whoami

Affiche les informations d'identite du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whoami [joueur]` |
| **Alias** | `uuid` |
| **Mode de jeu** | Adventure |

**Parametres :**
- `joueur` (optionnel) - Joueur cible

**Informations affichees :**
- UUID du joueur
- Nom d'utilisateur
- Preference de langue

**Exemples :**
```
/whoami
/uuid
/whoami NomJoueur
```

---

### player stats

Gere les statistiques du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player stats <sous-commande>` |
| **Alias** | `stat` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `get` | `/player stats get <nomStat> [joueur]` | Obtenir la valeur d'une stat |
| `set` | `/player stats set <nomStat> <valeur> [joueur]` | Definir une stat a une valeur specifique |
| `add` | `/player stats add <nomStat> <valeur> [joueur]` | Ajouter a une valeur de stat |
| `reset` | `/player stats reset [joueur]` | Reinitialiser toutes les stats |
| `settomax` | `/player stats settomax <nomStat> [joueur]` | Definir une stat a sa valeur maximale |
| `dump` | `/player stats dump [joueur]` | Afficher toutes les stats |

**Exemples :**
```
/player stats get health
/player stats set health 100
/player stats add stamina 50
/player stats settomax health
/player stats dump
```

---

### player effect

Appliquer ou effacer des effets sur les joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player effect <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `apply` | `/player effect apply <effet> [duree] [joueur]` | Appliquer un effet |
| `clear` | `/player effect clear [joueur]` | Effacer tous les effets |

**Parametres :**
- `effet` - L'ID de l'asset d'effet a appliquer
- `duree` (optionnel) - Duree en ticks (defaut: 100)
- `joueur` (optionnel) - Joueur cible

**Permissions :**
- `player.effect.apply.self`, `player.effect.apply.other`
- `player.effect.clear.self`, `player.effect.clear.other`

**Exemples :**
```
/player effect apply speed_boost
/player effect apply regeneration 200
/player effect apply strength 150 NomJoueur
/player effect clear
```

---

### player camera

Controle les modes de camera du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player camera <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `reset` | `/player camera reset [joueur]` | Reinitialiser la camera par defaut |
| `topdown` | `/player camera topdown [joueur]` | Definir la vue camera du dessus |
| `sidescroller` | `/player camera sidescroller [joueur]` | Definir la vue camera side-scroller |
| `demo` | `/player camera demo <activate\|deactivate>` | Mode camera demo |

**Exemples :**
```
/player camera reset
/player camera topdown
/player camera sidescroller NomJoueur
/player camera demo activate
```

---

## Commandes Entite

Commandes pour gerer les entites dans le monde.

### entity clone

Clone une entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity clone [entite] [nombre]` |

**Parametres :**
- `entite` (optionnel) - ID de l'entite a cloner (utilise l'entite regardee si non specifie)
- `nombre` (optionnel) - Nombre de clones a creer (defaut: 1)

**Exemples :**
```
/entity clone
/entity clone 12345
/entity clone 12345 5
```

---

### entity remove

Supprime une entite du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity remove [entite] [--others]` |

**Parametres :**
- `entite` (optionnel) - ID de l'entite a supprimer (utilise l'entite regardee si non specifie)
- `--others` (drapeau) - Supprimer toutes les autres entites non-joueur sauf celle specifiee

**Exemples :**
```
/entity remove
/entity remove 12345
/entity remove 12345 --others
```

---

### entity dump

Exporte les donnees de l'entite dans le journal du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity dump [entite]` |

**Parametres :**
- `entite` (optionnel) - ID de l'entite a exporter (utilise l'entite regardee si non specifie)

**Exemples :**
```
/entity dump
/entity dump 12345
```

---

### entity clean

Supprime toutes les entites non-joueur du monde actuel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity clean` |

**Attention :** C'est une commande destructive qui supprime toutes les entites sauf les joueurs.

**Exemples :**
```
/entity clean
```

---

### entity count

Affiche le nombre total d'entites dans le monde actuel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity count` |

**Exemples :**
```
/entity count
```

---

### entity stats

Gere les statistiques des entites.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity stats <sous-commande>` |
| **Alias** | `stat` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `get` | `/entity stats get <nomStat> [entite]` | Obtenir la valeur d'une stat |
| `set` | `/entity stats set <nomStat> <valeur> [entite]` | Definir une valeur de stat |
| `add` | `/entity stats add <nomStat> <valeur> [entite]` | Ajouter a une valeur de stat |
| `reset` | `/entity stats reset [entite]` | Reinitialiser toutes les stats |
| `settomax` | `/entity stats settomax <nomStat> [entite]` | Definir une stat au maximum |
| `dump` | `/entity stats dump [entite]` | Afficher toutes les stats |

**Exemples :**
```
/entity stats get health
/entity stats set health 50
/entity stats dump
```

---

### entity effect

Appliquer un effet aux entites.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity effect <effet> [duree] [entite]` |

**Parametres :**
- `effet` - L'ID de l'asset d'effet a appliquer
- `duree` (optionnel) - Duree en ticks (defaut: 100)
- `entite` (optionnel) - Entite cible

**Exemples :**
```
/entity effect poison
/entity effect slow 200
```

---

### entity intangible

Rend une entite intangible (sans collision).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity intangible [--remove] [entite]` |

**Parametres :**
- `--remove` (drapeau) - Retirer le statut intangible au lieu de l'ajouter
- `entite` (optionnel) - Entite cible

**Exemples :**
```
/entity intangible
/entity intangible --remove
/entity intangible 12345
```

---

### entity invulnerable

Rend une entite invulnerable aux degats.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity invulnerable [--remove] [entite]` |

**Parametres :**
- `--remove` (drapeau) - Retirer le statut invulnerable au lieu de l'ajouter
- `entite` (optionnel) - Entite cible

**Exemples :**
```
/entity invulnerable
/entity invulnerable --remove
/entity invulnerable 12345
```

---

## Commandes Monde

Commandes pour gerer les chunks et les cartes du monde.

### chunk info

Affiche des informations detaillees sur un chunk.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk info <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Informations affichees :**
- Statut d'initialisation
- Statut de generation
- Statut de tick
- Statut de sauvegarde
- Details des sections

**Exemples :**
```
/chunk info 0 0
/chunk info ~ ~
/chunk info ~5 ~-3
```

---

### chunk load

Charge un chunk en memoire.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk load <x> <z> [--markdirty]` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)
- `--markdirty` (drapeau) - Marquer le chunk comme necessitant une sauvegarde

**Exemples :**
```
/chunk load 0 0
/chunk load ~ ~
/chunk load 10 10 --markdirty
```

---

### chunk unload

Decharge un chunk de la memoire.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk unload <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Exemples :**
```
/chunk unload 0 0
/chunk unload ~ ~
```

---

### chunk regenerate

Regenere un chunk (ATTENTION : destructif).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk regenerate <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Attention :** Cela regenerera le chunk, perdant toutes les modifications des joueurs.

**Exemples :**
```
/chunk regenerate 0 0
/chunk regenerate ~ ~
```

---

### worldmap discover

Decouvre des zones sur la carte du monde pour un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldmap discover [zone]` |
| **Alias** | `disc` |

**Parametres :**
- `zone` (optionnel) - Nom de la zone a decouvrir, ou "all" pour decouvrir toutes les zones. Si non specifie, liste les zones disponibles.

**Exemples :**
```
/worldmap discover
/worldmap discover all
/worldmap discover ForestZone
/map disc all
```

---

### worldmap undiscover

Retire les zones decouvertes de la carte du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldmap undiscover [zone]` |

**Parametres :**
- `zone` (optionnel) - Nom de la zone a retirer, ou "all" pour retirer toutes les zones. Si non specifie, liste les zones decouvertes.

**Exemples :**
```
/worldmap undiscover
/worldmap undiscover all
/worldmap undiscover ForestZone
```

---

## Commandes Serveur

Commandes pour l'administration du serveur.

### stop

Arrete le serveur proprement.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/stop [--crash]` |
| **Alias** | `shutdown` |

**Parametres :**
- `--crash` (drapeau) - Simuler un arret par crash au lieu d'un arret propre

**Exemples :**
```
/stop
/shutdown
/stop --crash
```

---

### kick

Expulse un joueur du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/kick <joueur>` |

**Parametres :**
- `joueur` - Le joueur a expulser

**Exemples :**
```
/kick NomJoueur
```

---

### who

Liste tous les joueurs en ligne par monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/who` |
| **Mode de jeu** | Adventure |

**Informations affichees :**
- Joueurs organises par monde
- Noms d'affichage (si definis) et noms d'utilisateur

**Exemples :**
```
/who
```

---

### maxplayers

Obtient ou definit le nombre maximum de joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/maxplayers [montant]` |

**Parametres :**
- `montant` (optionnel) - Nouveau nombre maximum de joueurs. Si non specifie, affiche la valeur actuelle.

**Exemples :**
```
/maxplayers
/maxplayers 50
```

---

### auth

Commandes de gestion d'authentification.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/auth <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Description |
|---------------|-------------|
| `status` | Verifier le statut d'authentification |
| `login` | Se connecter au service d'authentification |
| `select` | Selectionner un compte d'authentification |
| `logout` | Se deconnecter de l'authentification |
| `cancel` | Annuler l'authentification en cours |
| `persistence` | Gerer la persistance de l'authentification |

**Exemples :**
```
/auth status
/auth login
/auth logout
```

---

## Commandes Utilitaires

Commandes utilitaires generales.

### help

Affiche les informations d'aide pour les commandes.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/help [commande]` |
| **Alias** | `?` |
| **Mode de jeu** | Adventure |

**Parametres :**
- `commande` (optionnel) - Nom de la commande pour obtenir de l'aide. Ouvre l'interface de liste de commandes si non specifie.

**Exemples :**
```
/help
/?
/help gamemode
```

---

### backup

Cree une sauvegarde des donnees du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/backup` |

**Prerequis :**
- Le serveur doit etre completement demarre
- Le repertoire de sauvegarde doit etre configure dans les options du serveur

**Exemples :**
```
/backup
```

---

### notify

Envoie une notification a tous les joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/notify [style] <message>` |

**Parametres :**
- `style` (optionnel) - Style de notification (Default, Warning, Error, etc.)
- `message` - Le message a envoyer (supporte les messages formates avec `{...}`)

**Exemples :**
```
/notify Bonjour a tous !
/notify Warning Redemarrage du serveur dans 5 minutes
/notify {"text": "Message formate", "color": "red"}
```

---

### sound 2d

Joue un effet sonore 2D.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/sound 2d <son> [categorie] [--all] [joueur]` |
| **Alias** | `play` |

**Parametres :**
- `son` - ID de l'asset d'evenement sonore
- `categorie` (optionnel) - Categorie de son (defaut: SFX)
- `--all` (drapeau) - Jouer pour tous les joueurs dans le monde
- `joueur` (optionnel) - Joueur cible

**Exemples :**
```
/sound 2d ui_click
/sound play notification SFX
/sound 2d alert --all
```

---

### sound 3d

Joue un effet sonore 3D positionnel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/sound 3d <son> [categorie] <x> <y> <z> [--all] [joueur]` |
| **Alias** | `play3d` |

**Parametres :**
- `son` - ID de l'asset d'evenement sonore
- `categorie` (optionnel) - Categorie de son (defaut: SFX)
- `x y z` - Coordonnees de position (supporte les coordonnees relatives avec ~)
- `--all` (drapeau) - Jouer pour tous les joueurs dans le monde
- `joueur` (optionnel) - Joueur cible

**Exemples :**
```
/sound 3d explosion SFX 100 64 200
/sound play3d ambient ~ ~ ~
/sound 3d alert SFX ~ ~10 ~ --all
```

---

## Commandes de Debogage

Commandes pour le debogage et la surveillance.

### ping

Affiche les informations de ping/latence.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/ping [--detail] [joueur]` |
| **Sous-commandes** | `clear`, `graph` |
| **Mode de jeu** | Adventure |

**Parametres :**
- `--detail` (drapeau) - Afficher les informations de ping detaillees
- `joueur` (optionnel) - Joueur cible

**Sous-commandes :**
- `/ping clear [joueur]` - Effacer l'historique de ping
- `/ping graph [largeur] [hauteur] [joueur]` - Afficher le graphique de ping

**Exemples :**
```
/ping
/ping --detail
/ping NomJoueur
/ping clear
/ping graph 80 15
```

---

### version

Affiche les informations de version du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/version` |

**Informations affichees :**
- Version du serveur
- Patchline
- Environnement (si pas release)

**Exemples :**
```
/version
```

---

### log

Gere les niveaux de journalisation.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/log <logger> [niveau] [--save] [--reset]` |

**Parametres :**
- `logger` - Nom du logger (ou "global" pour le logger global)
- `niveau` (optionnel) - Niveau de log (OFF, SEVERE, WARNING, INFO, CONFIG, FINE, FINER, FINEST, ALL)
- `--save` (drapeau) - Sauvegarder le niveau de log dans la config du serveur
- `--reset` (drapeau) - Reinitialiser le logger au niveau par defaut

**Exemples :**
```
/log global
/log global INFO
/log global FINE --save
/log network WARNING
/log network --reset
```

---

### server stats memory

Affiche les statistiques de memoire du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/server stats memory` |
| **Alias** | `mem` |

**Informations affichees :**
- Memoire physique totale et libre
- Memoire swap totale et libre
- Utilisation de la memoire heap (init, utilise, commis, max, libre)
- Utilisation de la memoire non-heap
- Objets en attente de finalisation

**Exemples :**
```
/server stats memory
/server stats mem
```

---

### server stats cpu

Affiche les statistiques CPU du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/server stats cpu` |

**Informations affichees :**
- Charge CPU systeme
- Charge CPU processus
- Moyenne de charge systeme
- Temps de fonctionnement du processus

**Exemples :**
```
/server stats cpu
```

---

## Commandes Inventaire

Commandes pour gerer les inventaires des joueurs, objets et equipements.

### give

Donne des objets a un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/give <objet> [quantite] [metadonnees]` |
| **Permission** | `give.self`, `give.other` |

**Parametres :**
- `objet` - L'ID de l'asset de l'objet a donner
- `quantite` (optionnel) - Nombre d'objets a donner (defaut: 1)
- `metadonnees` (optionnel) - Chaine JSON de metadonnees pour l'objet

**Variantes d'utilisation :**
- `/give <joueur> <objet> [quantite] [metadonnees]` - Donner des objets a un autre joueur (necessite la permission `give.other`)

**Exemples :**
```
/give Sword_Iron
/give Sword_Iron 5
/give NomJoueur Pickaxe_Diamond 1
/give Potion_Health 3 {"durability": 100}
```

---

### give armor

Donne un ensemble complet d'armure correspondant a un motif de recherche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/give armor <recherche> [--set] [joueur]` |

**Parametres :**
- `recherche` - Chaine de recherche pour correspondre aux types d'armure (ex: "Iron", "Diamond")
- `--set` (drapeau) - Effacer l'armure existante avant d'ajouter la nouvelle
- `joueur` (optionnel) - Joueur cible (utiliser "*" pour tous les joueurs)

**Exemples :**
```
/give armor Iron
/give armor Diamond --set
/give armor Gold NomJoueur
/give armor Iron *
```

---

### inventory

Commande parente pour les sous-commandes de gestion d'inventaire.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/inventory <sous-commande>` |
| **Alias** | `inv` |

**Sous-commandes :**
- `clear` - Vider l'inventaire
- `see` - Voir l'inventaire d'un autre joueur
- `item` - Ouvrir le conteneur d'objet
- `backpack` - Gerer la taille du sac a dos

---

### inventory clear

Vide l'inventaire entier du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/inventory clear` |
| **Alias** | `/inv clear` |
| **Mode de jeu** | Creative |

**Exemples :**
```
/inventory clear
/inv clear
```

---

### inventory see

Ouvre et visualise l'inventaire d'un autre joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/inventory see <joueur>` |
| **Permission** | `invsee.modify` (pour modification) |

**Parametres :**
- `joueur` - Joueur cible dont visualiser l'inventaire

**Notes :**
- Sans permission `invsee.modify`, l'inventaire est en lecture seule
- Ouvre l'inventaire du joueur cible dans une interface de banc

**Exemples :**
```
/inventory see NomJoueur
/inv see NomJoueur
```

---

### inventory item

Ouvre le conteneur de l'objet actuellement tenu (ex: sac a dos, bourse).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/inventory item` |

**Prerequis :**
- Doit avoir un objet en main
- L'objet doit avoir un composant conteneur

**Exemples :**
```
/inventory item
/inv item
```

---

### inventory backpack

Obtient ou definit la capacite du sac a dos.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/inventory backpack [taille]` |

**Parametres :**
- `taille` (optionnel) - Nouvelle capacite du sac a dos. Si non specifie, affiche la capacite actuelle.

**Notes :**
- Les objets qui ne rentrent plus apres redimensionnement sont jetes au sol

**Exemples :**
```
/inventory backpack
/inventory backpack 20
/inv backpack 30
```

---

### itemstate

Definit l'etat de l'objet actuellement tenu.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/itemstate <etat>` |
| **Mode de jeu** | Creative |

**Parametres :**
- `etat` - La chaine d'etat a appliquer a l'objet

**Prerequis :**
- Doit avoir un objet dans l'emplacement actif de la barre rapide

**Exemples :**
```
/itemstate charged
/itemstate broken
/itemstate enchanted
```

---

## Commandes Eclairage

Commandes pour gerer les calculs d'eclairage et les donnees du monde.

### lighting

Commande parente pour les sous-commandes d'eclairage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting <sous-commande>` |
| **Alias** | `light` |

**Sous-commandes :**
- `get` - Obtenir les valeurs de lumiere a une position
- `send` - Activer/desactiver l'envoi des donnees d'eclairage
- `info` - Afficher les informations du systeme d'eclairage
- `calculation` - Definir le mode de calcul d'eclairage
- `invalidate` - Invalider les donnees d'eclairage

---

### lighting get

Obtient les valeurs de lumiere a une position specifique.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting get <x> <y> <z> [--hex]` |

**Parametres :**
- `x y z` - Coordonnees de bloc (supporte les coordonnees relatives avec ~)
- `--hex` (drapeau) - Afficher la valeur de lumiere en format hexadecimal

**Informations affichees :**
- Valeur de lumiere rouge (0-15)
- Valeur de lumiere verte (0-15)
- Valeur de lumiere bleue (0-15)
- Valeur de lumiere du ciel (0-15)

**Exemples :**
```
/lighting get 0 64 0
/lighting get ~ ~ ~
/lighting get ~ ~1 ~ --hex
/light get 100 50 200
```

---

### lighting send

Controle si les donnees d'eclairage sont envoyees aux clients.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting send <local\|global> [active]` |

**Sous-commandes :**
- `local` - Activer/desactiver l'envoi des donnees d'eclairage local
- `global` - Activer/desactiver l'envoi des donnees d'eclairage global

**Parametres :**
- `active` (optionnel) - Valeur booleenne. Bascule si non specifie.

**Exemples :**
```
/lighting send local
/lighting send local true
/lighting send global false
```

---

### lighting info

Affiche des informations sur le systeme d'eclairage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting info [--detail]` |

**Parametres :**
- `--detail` (drapeau) - Afficher les statistiques detaillees d'eclairage des chunks

**Informations affichees :**
- Taille de la file d'attente d'eclairage
- Type de calcul de lumiere
- (Avec --detail) Sections de chunks totales, sections avec lumiere locale/globale

**Exemples :**
```
/lighting info
/lighting info --detail
```

---

### lighting calculation

Definit le mode de calcul d'eclairage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting calculation <type> [--invalidate]` |

**Parametres :**
- `type` - Type de calcul : `FLOOD` ou `FULLBRIGHT`
- `--invalidate` (drapeau) - Invalider tous les chunks charges apres le changement

**Types de calcul :**
- `FLOOD` - Calcul d'eclairage standard par remplissage
- `FULLBRIGHT` - Luminosite maximale (sans ombres)

**Exemples :**
```
/lighting calculation FLOOD
/lighting calculation FULLBRIGHT
/lighting calculation FLOOD --invalidate
```

---

### lighting invalidate

Invalide les donnees d'eclairage, forcant le recalcul.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/lighting invalidate [--one]` |

**Parametres :**
- `--one` (drapeau) - Invalider uniquement la section de chunk a la position du joueur

**Notes :**
- Sans `--one`, invalide tous les chunks charges
- Necessite un contexte joueur lors de l'utilisation de `--one`

**Exemples :**
```
/lighting invalidate
/lighting invalidate --one
```

---

## Commandes Generation de Monde

Commandes pour la gestion et le benchmarking de la generation de monde.

### worldgen

Commande parente pour les sous-commandes de generation de monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldgen <sous-commande>` |
| **Alias** | `wg` |

**Sous-commandes :**
- `reload` - Recharger les parametres de generation de monde
- `benchmark` - Tester les performances de generation de monde

---

### worldgen reload

Recharge la configuration de generation de monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldgen reload [--clear]` |

**Parametres :**
- `--clear` (drapeau) - Supprimer tous les chunks sauvegardes et regenerer les chunks charges

**Attention :** L'utilisation de `--clear` supprimera toutes les donnees de chunks et regenerera le monde.

**Exemples :**
```
/worldgen reload
/wg reload
/worldgen reload --clear
```

---

### worldgen benchmark

Teste les performances de generation de monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldgen benchmark <pos1> <pos2> [monde] [graine]` |

**Parametres :**
- `pos1` - Coordonnees du premier coin (X, Z)
- `pos2` - Coordonnees du second coin (X, Z)
- `monde` (optionnel) - Monde cible
- `graine` (optionnel) - Graine de generation (utilise la graine du monde si non specifie)

**Notes :**
- Genere les chunks dans la zone specifiee pour le benchmarking
- Les resultats sont sauvegardes dans le dossier `quantification/`
- Fonctionne uniquement avec les generateurs de monde supportant le benchmarking

**Exemples :**
```
/worldgen benchmark 0,0 1000,1000
/wg benchmark -500,-500 500,500
/worldgen benchmark 0,0 2000,2000 MonMonde 12345
```

---

## Commandes d'Apparition

Commandes pour faire apparaitre des entites dans le monde.

### spawnblock

Fait apparaitre une entite de bloc a une position specifiee.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/spawnblock <bloc> <x> <y> <z> [rotation]` |

**Parametres :**
- `bloc` - Cle du type de bloc a faire apparaitre
- `x y z` - Coordonnees de position (supporte les coordonnees relatives avec ~)
- `rotation` (optionnel) - Vecteur de rotation (lacet, tangage, roulis)

**Exemples :**
```
/spawnblock Chest ~ ~ ~
/spawnblock Torch 100 64 200
/spawnblock Lantern ~ ~2 ~ 0,45,0
```

---

## Commandes Joueur Supplementaires

Commandes etendues de gestion des joueurs.

### player respawn

Force un joueur a reapparaitre.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player respawn [joueur]` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Notes :**
- Supprime le composant de mort, permettant au joueur de reapparaitre

**Exemples :**
```
/player respawn
/player respawn NomJoueur
```

---

### player reset

Reinitialise completement les donnees d'un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player reset [joueur]` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Attention :** Cela reinitialise toutes les donnees du joueur incluant l'inventaire, les statistiques et la progression.

**Exemples :**
```
/player reset
/player reset NomJoueur
```

---

### player zone

Affiche les informations de zone et de biome actuels.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player zone [joueur]` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Informations affichees :**
- Nom de la zone actuelle
- Nom du biome actuel

**Exemples :**
```
/player zone
/player zone NomJoueur
```

---

### player viewradius

Gere les parametres de rayon de vue du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/player viewradius <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `get` | `/player viewradius get [joueur]` | Obtenir le rayon de vue actuel |
| `set` | `/player viewradius set <rayon> [--blocks] [--bypass] [joueur]` | Definir le rayon de vue |

**Parametres de set :**
- `rayon` - Rayon de vue en chunks (ou "default" pour 32)
- `--blocks` (drapeau) - Interpreter le rayon en blocs au lieu de chunks
- `--bypass` (drapeau) - Permettre de depasser le maximum du serveur

**Exemples :**
```
/player viewradius get
/player viewradius set 16
/player viewradius set 512 --blocks
/player viewradius set default
```

---

### sudo

Execute une commande en tant qu'un autre joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/sudo <joueur> <commande>` |
| **Alias** | `su` |

**Parametres :**
- `joueur` - Joueur cible (ou "*" pour tous les joueurs)
- `commande` - Commande a executer (avec ou sans / initial)

**Exemples :**
```
/sudo NomJoueur gamemode creative
/sudo * notify Bonjour a tous !
/su NomJoueur /whereami
```

---

### refer

Transfere un joueur vers un autre serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/refer <hote> <port> [joueur]` |
| **Alias** | `transfer` |
| **Permission** | `refer.self`, `refer.other` |

**Parametres :**
- `hote` - Nom d'hote ou IP du serveur cible
- `port` - Port du serveur cible (1-65535)
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Exemples :**
```
/refer play.example.com 25565
/refer 192.168.1.100 25565 NomJoueur
/transfer server.example.net 25566
```

---

### toggleBlockPlacementOverride

Bascule le contournement des restrictions de placement de blocs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/toggleBlockPlacementOverride` |
| **Alias** | `tbpo`, `togglePlacement` |

**Notes :**
- Lorsqu'active, permet de placer des blocs dans les zones restreintes
- Utile pour construire dans les zones protegees

**Exemples :**
```
/toggleBlockPlacementOverride
/tbpo
/togglePlacement
```

---

## Commandes Entite Supplementaires

Commandes etendues de gestion des entites.

### entity nameplate

Definit ou supprime les plaques nominatives des entites.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity nameplate <texte> [entite]` |

**Parametres :**
- `texte` - Le texte a afficher sur la plaque nominative
- `entite` (optionnel) - ID de l'entite (utilise l'entite regardee si non specifie)

**Variantes d'utilisation :**
- `/entity nameplate <texte> [entite]` - Definir le texte de la plaque nominative
- `/entity nameplate [entite]` - Supprimer la plaque nominative

**Exemples :**
```
/entity nameplate "Boss Monstre"
/entity nameplate "Marchand" 12345
/entity nameplate
```

---

### entity resend

Force le renvoi de toutes les donnees d'entite a un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity resend <joueur>` |

**Parametres :**
- `joueur` - Joueur cible pour le renvoi des entites

**Notes :**
- Fait disparaitre toutes les entites pour le joueur, provoquant leur renvoi

**Exemples :**
```
/entity resend NomJoueur
```

---

### entity tracker

Affiche les statistiques du traqueur d'entites pour un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity tracker <joueur>` |

**Parametres :**
- `joueur` - Joueur cible

**Informations affichees :**
- Nombre d'entites visibles
- Nombre exclu par LOD
- Nombre d'entites cachees
- Total d'entites suivies
- Total d'entites du monde
- Informations de rayon de vue

**Exemples :**
```
/entity tracker NomJoueur
```

---

### entity lod

Definit le ratio de culling LOD (Level of Detail) des entites.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity lod <ratio>` |

**Parametres :**
- `ratio` - Valeur du ratio LOD (ex: 0.000035)

**Sous-commandes :**
- `/entity lod default` - Reinitialiser au ratio LOD par defaut (0.000035)

**Exemples :**
```
/entity lod 0.00005
/entity lod 0.00002
/entity lod default
```

---

### entity interactable

Rend une entite interactive ou supprime l'interactivite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity interactable [--disable] [entite]` |

**Parametres :**
- `--disable` (drapeau) - Supprimer l'interactivite au lieu de l'ajouter
- `entite` (optionnel) - ID de l'entite (utilise l'entite regardee si non specifie)

**Exemples :**
```
/entity interactable
/entity interactable --disable
/entity interactable 12345
```

---

### entity hidefromadventureplayers

Cache une entite des joueurs en mode Aventure.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity hidefromadventureplayers [--remove] [entite]` |

**Parametres :**
- `--remove` (drapeau) - Supprimer le masquage au lieu de l'ajouter
- `entite` (optionnel) - ID de l'entite (utilise l'entite regardee si non specifie)

**Exemples :**
```
/entity hidefromadventureplayers
/entity hidefromadventureplayers --remove
/entity hidefromadventureplayers 12345
```

---

## Commandes Chunk Supplementaires

Commandes etendues de gestion des chunks.

### chunk fixheight

Corrige la carte de hauteur d'un chunk et recalcule l'eclairage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk fixheight <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Notes :**
- Recalcule la carte de hauteur du chunk
- Invalide et recalcule l'eclairage
- Utile pour corriger les bugs d'eclairage

**Exemples :**
```
/chunk fixheight 0 0
/chunk fixheight ~ ~
```

---

### chunk forcetick

Force tous les blocs d'un chunk a ticker.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk forcetick <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Notes :**
- Met tous les blocs du chunk en etat de tick
- Le chunk doit etre charge

**Exemples :**
```
/chunk forcetick 0 0
/chunk forcetick ~ ~
```

---

### chunk loaded

Affiche les informations des chunks charges pour un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk loaded [joueur]` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Exemples :**
```
/chunk loaded
/chunk loaded NomJoueur
```

---

### chunk resend

Force le renvoi de tous les chunks a un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk resend [--clearcache] [joueur]` |

**Parametres :**
- `--clearcache` (drapeau) - Invalider aussi les caches de section de chunk
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Exemples :**
```
/chunk resend
/chunk resend --clearcache
/chunk resend NomJoueur
```

---

### chunk tracker

Affiche les statistiques du traqueur de chunks pour un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk tracker [joueur]` |

**Parametres :**
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Informations affichees :**
- Max chunks par seconde/tick
- Rayon min/max de chunks charges
- Chunks joueur charges/en chargement
- Chunks du monde charges

**Exemples :**
```
/chunk tracker
/chunk tracker NomJoueur
```

---

### chunk maxsendrate

Obtient ou definit les limites de taux d'envoi de chunks.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk maxsendrate [--sec=<valeur>] [--tick=<valeur>] [joueur]` |

**Parametres :**
- `--sec` (optionnel) - Maximum de chunks par seconde
- `--tick` (optionnel) - Maximum de chunks par tick
- `joueur` (optionnel) - Joueur cible (soi-meme si non specifie)

**Exemples :**
```
/chunk maxsendrate
/chunk maxsendrate --sec=50
/chunk maxsendrate --tick=5
/chunk maxsendrate --sec=100 --tick=10 NomJoueur
```

---

### chunk marksave

Marque un chunk comme necessitant une sauvegarde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk marksave <x> <z>` |

**Parametres :**
- `x z` - Coordonnees du chunk (supporte les coordonnees relatives avec ~)

**Notes :**
- Si le chunk n'est pas charge, il sera charge d'abord

**Exemples :**
```
/chunk marksave 0 0
/chunk marksave ~ ~
```

---

### chunk tint

Definit la couleur de teinte pour un chunk.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk tint <couleur> [--blur] [--radius=<valeur>] [--sigma=<valeur>]` |

**Parametres :**
- `couleur` - Valeur couleur hexadecimale (ex: #FF0000)
- `--blur` (drapeau) - Appliquer un flou gaussien a la teinte
- `--radius` (optionnel) - Rayon de flou (defaut: 5)
- `--sigma` (optionnel) - Valeur sigma du flou (defaut: 1.5)

**Variantes d'utilisation :**
- `/chunk tint` - Ouvre l'interface de selection de couleur de teinte

**Exemples :**
```
/chunk tint #FF0000
/chunk tint #00FF00 --blur
/chunk tint #0000FF --blur --radius=10 --sigma=2.0
```

---

## Commandes Carte du Monde Supplementaires

Commandes etendues de gestion de la carte du monde.

### worldmap reload

Recharge la configuration de la carte du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldmap reload` |

**Exemples :**
```
/worldmap reload
/map reload
```

---

### worldmap clearmarkers

Efface tous les marqueurs de carte du monde pour le joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldmap clearmarkers` |

**Exemples :**
```
/worldmap clearmarkers
/map clearmarkers
```

---

### worldmap viewradius

Gere les parametres de rayon de vue de la carte du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/worldmap viewradius <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `get` | `/worldmap viewradius get [joueur]` | Obtenir le rayon de vue actuel |
| `set` | `/worldmap viewradius set <rayon> [--bypass] [joueur]` | Definir le rayon de vue |
| `remove` | `/worldmap viewradius remove [joueur]` | Supprimer le rayon de vue personnalise |

**Parametres de set :**
- `rayon` - Valeur du rayon de vue (max 512 sans bypass)
- `--bypass` (drapeau) - Permettre de depasser la limite maximale

**Exemples :**
```
/worldmap viewradius get
/worldmap viewradius set 256
/worldmap viewradius set 1024 --bypass
/worldmap viewradius remove
```

---

## Commandes NPC

Commandes pour faire apparaitre et gerer les NPCs (Personnages Non-Joueurs) et entites IA.

### npc spawn

Fait apparaitre une entite NPC avec un role specifie.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc spawn <role> [nombre] [rayon] [drapeaux] [options...]` |

**Parametres :**
- `role` - Le modele de role NPC a faire apparaitre
- `nombre` (optionnel) - Nombre de NPCs a faire apparaitre (defaut: 1)
- `rayon` (optionnel) - Rayon d'apparition autour du joueur (defaut: 8.0)
- `drapeaux` (optionnel) - Drapeaux de debogage separes par virgules
- `speed` (optionnel) - Vitesse de velocite initiale
- `position` (optionnel) - Position exacte d'apparition (format x,y,z)
- `posOffset` (optionnel) - Decalage de position (format x,y,z)
- `headRotation` (optionnel) - Rotation de la tete (format lacet,tangage,roulis)
- `bodyRotation` (optionnel) - Rotation du corps (format lacet,tangage,roulis)
- `flock` (optionnel) - Taille du groupe ou nom de l'asset de groupe
- `scale` (optionnel) - Facteur d'echelle du modele

**Drapeaux :**
- `--nonrandom` - Utiliser un positionnement deterministe
- `--randomRotation` - Appliquer une rotation aleatoire aux NPCs
- `--facingRotation` - Faire face au joueur
- `--test` - Tester la validite de l'emplacement d'apparition
- `--spawnOnGround` - Forcer l'apparition au niveau du sol
- `--frozen` - Faire apparaitre le NPC en etat gele
- `--randomModel` - Appliquer un skin/modele aleatoire
- `--bypassScaleLimits` - Permettre de depasser les limites d'echelle

**Exemples :**
```
/npc spawn Trork
/npc spawn Kweebec 5 10
/npc spawn Trork --frozen
/npc spawn Kweebec --position=100,64,200
/npc spawn Trork --scale=1.5 --bypassScaleLimits
```

---

### npc freeze

Gele les entites NPC, arretant leur comportement IA.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc freeze [--all] [--toggle] [entite]` |

**Parametres :**
- `--all` (drapeau) - Geler tous les NPCs et objets dans le monde
- `--toggle` (drapeau) - Basculer l'etat de gel au lieu de toujours geler
- `entite` (optionnel) - ID de l'entite cible (utilise l'entite regardee si non specifie)

**Exemples :**
```
/npc freeze
/npc freeze --all
/npc freeze --toggle
/npc freeze 12345
```

---

### npc thaw

Degele les entites NPC, reprenant leur comportement IA.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc thaw [--all] [entite]` |
| **Alias** | `unfreeze` |

**Parametres :**
- `--all` (drapeau) - Degeler tous les NPCs dans le monde
- `entite` (optionnel) - ID de l'entite cible (utilise l'entite regardee si non specifie)

**Exemples :**
```
/npc thaw
/npc thaw --all
/npc thaw 12345
```

---

### npc clean

Supprime toutes les entites NPC du monde actuel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc clean` |

**Attention :** C'est une commande destructive qui supprime tous les NPCs.

**Exemples :**
```
/npc clean
```

---

### npc dump

Exporte la hierarchie des composants de role NPC dans le journal du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc dump [--json] [entite]` |

**Parametres :**
- `--json` (drapeau) - Sortie au format JSON
- `entite` (optionnel) - ID de l'entite cible (utilise l'entite regardee si non specifie)

**Exemples :**
```
/npc dump
/npc dump --json
```

---

### npc give

Donne un objet a une entite NPC.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc give <objet> [entite]` |

**Parametres :**
- `objet` - ID de l'asset d'objet a donner (defini comme arme ou armure)
- `entite` (optionnel) - ID de l'entite cible

**Sous-commandes :**
- `/npc give nothing [entite]` - Retirer l'objet tenu du NPC

**Exemples :**
```
/npc give Sword_Iron
/npc give Armor_Trork_Chainmail
/npc give nothing
```

---

### npc role

Obtient ou definit le role d'une entite NPC.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc role [role] [entite]` |

**Parametres :**
- `role` (optionnel) - Nouveau role a assigner. Si non specifie, affiche le role actuel.
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/npc role
/npc role Trork_Warrior
/npc role Kweebec 12345
```

---

### npc path

Definit un chemin de deplacement pour un NPC.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc path <instructions> [entite]` |

**Parametres :**
- `instructions` - Paires rotation,distance separees par virgules (ex: "90,5,0,10" = tourner 90deg marcher 5, aller droit 10)

**Sous-commandes :**
- `/npc path polygon <cotes> [longueur] [entite]` - Creer un chemin polygonal

**Exemples :**
```
/npc path 90,5,0,10,-90,3
/npc path polygon 4
/npc path polygon 6 10
```

---

### npc attack

Definit ou efface les surcharges de sequence d'attaque pour un NPC.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc attack [attaque...] [entite]` |

**Sous-commandes :**
- `/npc attack clear [entite]` - Effacer les surcharges d'attaque

**Parametres :**
- `attaque` (optionnel) - Liste des IDs d'assets d'interaction pour la sequence d'attaque

**Exemples :**
```
/npc attack Slash_Light Slash_Heavy
/npc attack clear
```

---

### npc debug

Gere les drapeaux de visualisation de debogage NPC.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc debug <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `show` | `/npc debug show [entite]` | Afficher les drapeaux de debogage actuels |
| `set` | `/npc debug set <drapeaux> [entite]` | Definir les drapeaux de debogage |
| `toggle` | `/npc debug toggle <drapeaux> [entite]` | Basculer les drapeaux de debogage |
| `defaults` | `/npc debug defaults [entite]` | Reinitialiser aux drapeaux par defaut |
| `clear` | `/npc debug clear [entite]` | Effacer tous les drapeaux de debogage |
| `presets` | `/npc debug presets [preset]` | Lister les presets ou afficher les infos d'un preset |

**Exemples :**
```
/npc debug show
/npc debug set pathfinding,combat
/npc debug toggle sensors
/npc debug presets
/npc debug defaults
```

---

### npc step

Avance la simulation NPC d'un tick pendant le gel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc step [--all] [dt] [entite]` |

**Parametres :**
- `--all` (drapeau) - Faire avancer tous les NPCs
- `dt` (optionnel) - Temps delta pour l'avancement (defaut: 1/TPS)
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/npc step
/npc step --all
/npc step 0.05
```

---

### npc blackboard

Gere les donnees du tableau noir NPC (connaissances IA partagees).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc blackboard <sous-commande>` |

**Sous-commandes :**
- `chunks` - Lister les chunks suivis
- `chunk <x> <z>` - Afficher les donnees du chunk
- `drop` - Supprimer les donnees du tableau noir
- `views` - Lister les vues enregistrees
- `view <type>` - Afficher les donnees d'une vue
- `blockevents` - Afficher les abonnements aux evenements de blocs
- `entityevents` - Afficher les abonnements aux evenements d'entites
- `resourceviews` - Lister les vues de ressources
- `resourceview <type>` - Afficher les donnees d'une vue de ressources
- `reserve <position>` - Reserver une interaction a une position
- `reservation <position>` - Verifier le statut de reservation

**Exemples :**
```
/npc blackboard chunks
/npc blackboard views
/npc blackboard blockevents
```

---

### npc flock

Gere le comportement de groupe des NPCs (mouvement de groupe).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/npc flock <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `grab` | `/npc flock grab` | Ajouter les NPCs en vue a votre groupe |
| `join` | `/npc flock join` | Rejoindre le groupe d'un NPC en vue |
| `leave` | `/npc flock leave` | Retirer les NPCs en vue des groupes |
| `playerleave` | `/npc flock playerleave` | Quitter votre groupe actuel |

**Exemples :**
```
/npc flock grab
/npc flock join
/npc flock leave
/npc flock playerleave
```

---

## Commandes Reseau

Commandes pour le debogage reseau et la simulation de latence.

### network latencysimulation

Simule la latence reseau a des fins de test.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/network latencysimulation <sous-commande>` |
| **Alias** | `net`, `latsim` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `set` | `/network latencysimulation set <delai> [joueur]` | Definir la latence en millisecondes |
| `reset` | `/network latencysimulation reset [joueur]` | Effacer la latence simulee |

**Exemples :**
```
/network latencysimulation set 100
/net latsim set 200 NomJoueur
/network latencysimulation reset
```

---

### network serverknockback

Bascule la prediction de knockback cote serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/network serverknockback` |

**Exemples :**
```
/network serverknockback
```

---

### network debugknockback

Bascule le debogage de position de knockback.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/network debugknockback` |

**Exemples :**
```
/network debugknockback
```

---

## Commandes Prefab

Commandes pour gerer et convertir les structures prefabriquees.

### convertprefabs

Convertit et met a jour les fichiers prefab.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/convertprefabs [--blocks] [--filler] [--relative] [--entities] [--destructive] [chemin] [store]` |

**Parametres :**
- `--blocks` (drapeau) - Reserialiser les etats de blocs
- `--filler` (drapeau) - Corriger les donnees de blocs de remplissage
- `--relative` (drapeau) - Convertir en coordonnees relatives
- `--entities` (drapeau) - Reserialiser les donnees d'entites
- `--destructive` (drapeau) - Permettre les modifications destructives
- `chemin` (optionnel) - Chemin specifique a convertir
- `store` (optionnel) - Depot de prefab : "asset", "server", "worldgen", ou "all" (defaut: "asset")

**Exemples :**
```
/convertprefabs
/convertprefabs --blocks --entities
/convertprefabs --filler --destructive
/convertprefabs store=worldgen
```

---

## Commandes Assets

Commandes pour gerer et deboguer les assets du jeu.

### assets

Commande parente pour les sous-commandes de gestion des assets.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/assets <sous-commande>` |

**Sous-commandes :**
- `tags` - Gestion des tags d'assets
- `duplicates` - Trouver les assets en double
- `longest` - Trouver les noms d'assets les plus longs par type

**Exemples :**
```
/assets tags
/assets duplicates
/assets longest
```

---

## Commandes de Debogage Serveur

Commandes etendues de debogage et surveillance du serveur.

### server gc

Force un cycle de ramasse-miettes.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/server gc` |

**Informations affichees :**
- Memoire liberee (ou augmentee) par le GC

**Exemples :**
```
/server gc
```

---

### server dump

Cree un dump d'etat du serveur pour le debogage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/server dump [--json]` |

**Parametres :**
- `--json` (drapeau) - Exporter au format JSON

**Exemples :**
```
/server dump
/server dump --json
```

---

## Commandes Sleep

Commandes pour tester et configurer le timing des ticks du serveur.

### sleep offset

Obtient ou definit le decalage de timing de sommeil.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/sleep offset [decalage] [--percent]` |

**Parametres :**
- `decalage` (optionnel) - Nouvelle valeur de decalage. Si non specifie, affiche la valeur actuelle.
- `--percent` (drapeau) - Afficher/definir en pourcentage

**Exemples :**
```
/sleep offset
/sleep offset 1000
/sleep offset --percent
```

---

### sleep test

Teste la precision du sommeil systeme.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/sleep test [sommeil] [nombre]` |

**Parametres :**
- `sommeil` (optionnel) - Duree de sommeil en millisecondes (defaut: 10)
- `nombre` (optionnel) - Nombre d'iterations (defaut: 1000)

**Informations affichees :**
- Temps delta (min, max, moyenne)
- Decalage par rapport a l'attendu (min, max, moyenne)

**Exemples :**
```
/sleep test
/sleep test 20 500
```

---

## Commandes Statistiques de Paquets

Commandes pour analyser les donnees de paquets reseau.

### packetstats

Affiche des statistiques detaillees pour un type de paquet specifique.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/packetstats <paquet> [joueur]` |

**Parametres :**
- `paquet` - Nom du type de paquet a analyser
- `joueur` (optionnel) - Joueur cible

**Informations affichees :**
- ID du paquet
- Statistiques d'envoi (nombre, taille, compresse/non compresse, moy, min, max)
- Statistiques de reception
- Donnees de trafic recent

**Exemples :**
```
/packetstats ChunkData
/packetstats EntityPosition NomJoueur
```

---

## Commandes Pack

Commandes pour gerer les packs d'assets charges.

### packs list

Liste tous les packs d'assets charges.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/packs list` |
| **Alias** | `ls` |

**Informations affichees :**
- Nom du pack
- Repertoire racine du pack

**Exemples :**
```
/packs list
/packs ls
```

---

## Commandes Test de Charge

Commandes pour les tests de performance du serveur.

### stresstest start

Demarre un test de charge en faisant apparaitre des clients bots.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/stresstest start [options...]` |

**Parametres :**
- `name` (optionnel) - Nom du test pour les fichiers de sortie
- `initcount` (optionnel) - Nombre initial de bots (defaut: 0)
- `interval` (optionnel) - Secondes entre l'ajout de bots (defaut: 30)
- `dumptype` (optionnel) - Quand exporter les metriques : NEW_BOT, INTERVAL, FINISH, NEVER
- `dumpinterval` (optionnel) - Secondes entre les exports (defaut: 300)
- `threshold` (optionnel) - Seuil de temps de tick en ms
- `percentile` (optionnel) - Percentile pour le seuil (defaut: 0.95)
- `viewradius` (optionnel) - Rayon de vue des bots (defaut: 192)
- `radius` (optionnel) - Rayon de mouvement des bots (defaut: 384)
- `yheight` (optionnel) - Coordonnee Y des bots (defaut: 125)
- `flySpeed` (optionnel) - Vitesse de mouvement des bots (defaut: 8.0)
- `--shutdown` (drapeau) - Arreter le serveur quand le seuil est depasse

**Exemples :**
```
/stresstest start
/stresstest start --initcount=10 --interval=60
/stresstest start --name=test1 --threshold=50
```

---

### stresstest stop

Arrete le test de charge en cours.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/stresstest stop` |

**Exemples :**
```
/stresstest stop
```

---

## Commandes Conteneur

Commandes pour gerer les blocs conteneurs et inventaires.

### stash

Obtient ou definit la liste de butin pour un bloc conteneur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/stash [definir]` |

**Parametres :**
- `definir` (optionnel) - Nom de la liste de butin a assigner au conteneur cible

**Prerequis :**
- Doit regarder un bloc conteneur a moins de 10 blocs

**Exemples :**
```
/stash
/stash MaListeDeButin
```

---

## Commandes Evenement

Commandes pour afficher les notifications d'evenements.

### eventtitle

Affiche un titre d'evenement a tous les joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/eventtitle [--major] [--secondary=<texte>] <titre>` |

**Parametres :**
- `titre` - Texte du titre principal a afficher
- `--major` (drapeau) - Afficher comme evenement majeur (plus grand)
- `--secondary` (optionnel) - Texte du sous-titre secondaire (defaut: "Event")

**Exemples :**
```
/eventtitle Boss Vaincu !
/eventtitle --major Victoire !
/eventtitle --secondary="Evenement Mondial" Le Dragon S'eveille
```

---

## Commandes de Debogage Supplementaires

Commandes avancees de debogage et de test.

### debugplayerposition

Affiche des informations detaillees de position et rotation pour le debogage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/debugplayerposition` |

**Informations affichees :**
- Position du corps (X, Y, Z)
- Rotation du corps (Tangage, Lacet, Roulis)
- Rotation de la tete (Tangage, Lacet, Roulis)
- Statut de teleportation en attente
- Sphere de debogage visuelle a la position du joueur

**Exemples :**
```
/debugplayerposition
```

---

### hitdetection

Bascule le debogage visuel pour la detection des coups.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hitdetection` |

**Notes :**
- Active/desactive l'affichage de debogage visuel pour les interactions de selection
- Utile pour deboguer les hitbox de combat et d'interaction

**Exemples :**
```
/hitdetection
```

---

### hudtest

Teste l'affichage et le masquage des composants HUD.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hudtest [--reset] [joueur]` |

**Parametres :**
- `--reset` (drapeau) - Afficher la barre rapide au lieu de la cacher
- `joueur` (optionnel) - Joueur cible

**Notes :**
- Sans `--reset`, cache le composant HUD de la barre rapide
- Avec `--reset`, affiche le composant HUD de la barre rapide

**Exemples :**
```
/hudtest
/hudtest --reset
/hudtest NomJoueur
```

---

### messagetest

Teste l'envoi de messages avec des parametres de message traduits imbriques.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/messagetest` |
| **Alias** | `msgtest` |

**Notes :**
- Commande developpeur pour tester le systeme de traduction de messages
- Affiche un exemple de message traduit imbrique

**Exemples :**
```
/messagetest
/msgtest
```

---

### builderToolsLegend

Affiche ou cache la legende HUD des outils de construction.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/builderToolsLegend [--hide]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `--hide` (drapeau) - Cacher la legende des outils de construction au lieu de l'afficher

**Notes :**
- Affiche toujours le selecteur d'emplacement de materiau
- Affiche/cache le panneau de legende des outils de construction

**Exemples :**
```
/builderToolsLegend
/builderToolsLegend --hide
```

---

### networkChunkSending

Controle si les chunks sont envoyes sur le reseau au joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/networkChunkSending <active>` |

**Parametres :**
- `active` - Valeur booleenne (true/false) pour activer ou desactiver l'envoi de chunks

**Notes :**
- Utile pour deboguer la transmission reseau des chunks
- La desactivation empeche l'envoi de nouveaux chunks au joueur

**Exemples :**
```
/networkChunkSending true
/networkChunkSending false
```

---

### pidcheck

Verifie si un ID de processus est en cours d'execution.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/pidcheck [--singleplayer] [pid]` |

**Parametres :**
- `--singleplayer` (drapeau) - Verifier le PID client en mode solo
- `pid` (optionnel) - ID de processus a verifier

**Notes :**
- En mode solo, verifie si le processus client est toujours en cours
- Utile pour deboguer la gestion des processus et le cycle de vie du serveur

**Exemples :**
```
/pidcheck 12345
/pidcheck --singleplayer
```

---

### validatecpb

Valide et teste le chargement des fichiers prefab.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/validatecpb [chemin]` |

**Parametres :**
- `chemin` (optionnel) - Chemin specifique a valider. Si non fourni, valide tous les packs d'assets.

**Notes :**
- Charge et valide de maniere asynchrone tous les fichiers `.prefab.json`
- Signale les erreurs pour les blocs ou modeles d'entites manquants
- Les resultats sont enregistres dans la console

**Exemples :**
```
/validatecpb
/validatecpb C:/chemin/vers/assets
```

---

## Commandes Collision Hitbox

Commandes pour gerer les composants de collision hitbox sur les entites.

### hitboxcollision

Commande parente pour la gestion des collisions hitbox.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hitboxcollision <sous-commande>` |

**Sous-commandes :**
- `add` - Ajouter une collision hitbox a une entite
- `remove` - Retirer une collision hitbox d'une entite

---

### hitboxcollision add

Ajoute un composant de collision hitbox a une entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hitboxcollision add <entity\|self> <hitboxCollisionConfig> [entite]` |

**Sous-commandes :**
- `entity` - Ajouter une collision hitbox a une entite specifique
- `self` - Ajouter une collision hitbox a soi-meme ou au joueur cible

**Parametres :**
- `hitboxCollisionConfig` - L'asset de configuration de collision hitbox
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/hitboxcollision add entity Player_Hitbox 12345
/hitboxcollision add self Player_Hitbox
```

---

### hitboxcollision remove

Retire le composant de collision hitbox d'une entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hitboxcollision remove <entity\|self> [entite]` |

**Sous-commandes :**
- `entity` - Retirer la collision hitbox d'une entite specifique
- `self` - Retirer la collision hitbox de soi-meme ou du joueur cible

**Parametres :**
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/hitboxcollision remove entity 12345
/hitboxcollision remove self
```

---

## Commandes Repulsion

Commandes pour gerer les composants de repulsion des entites (effets de recul).

### repulsion

Commande parente pour la gestion de la repulsion.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/repulsion <sous-commande>` |

**Sous-commandes :**
- `add` - Ajouter une repulsion a une entite
- `remove` - Retirer une repulsion d'une entite

---

### repulsion add

Ajoute un composant de repulsion a une entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/repulsion add <entity\|self> <repulsionConfig> [entite]` |

**Sous-commandes :**
- `entity` - Ajouter une repulsion a une entite specifique
- `self` - Ajouter une repulsion a soi-meme ou au joueur cible

**Parametres :**
- `repulsionConfig` - L'asset de configuration de repulsion
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/repulsion add entity Standard_Repulsion 12345
/repulsion add self Player_Repulsion
```

---

### repulsion remove

Retire le composant de repulsion d'une entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/repulsion remove <entity\|self> [entite]` |

**Sous-commandes :**
- `entity` - Retirer la repulsion d'une entite specifique
- `self` - Retirer la repulsion de soi-meme ou du joueur cible

**Parametres :**
- `entite` (optionnel) - ID de l'entite cible

**Exemples :**
```
/repulsion remove entity 12345
/repulsion remove self
```

---

## Commandes de Mise a Jour Git

Commandes pour gerer les assets et prefabs via les operations Git.

### update

Commande parente pour les operations de mise a jour Git.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/update <sous-commande>` |

**Sous-commandes :**
- `assets` - Gerer le depot d'assets
- `prefabs` - Gerer le depot de prefabs

---

### update assets

Operations Git pour le depot d'assets.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/update assets <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `status` | `/update assets status` | Executer git status sur les assets |
| `reset` | `/update assets reset` | Reinitialiser les assets au HEAD (git reset --hard head) |
| `pull` | `/update assets pull` | Tirer les derniers changements d'assets |

**Exemples :**
```
/update assets status
/update assets pull
/update assets reset
```

---

### update prefabs

Operations Git pour le depot de prefabs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/update prefabs <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `status` | `/update prefabs status` | Executer git status sur les prefabs |
| `commit` | `/update prefabs commit` | Valider les changements de prefabs |
| `pull` | `/update prefabs pull` | Tirer les derniers changements de prefabs |
| `push` | `/update prefabs push` | Pousser les changements de prefabs vers le distant |
| `all` | `/update prefabs all` | Valider, tirer et pousser tous les changements |

**Notes :**
- Les messages de commit incluent automatiquement le nom d'affichage de l'expediteur
- Les operations sont effectuees sur le depot principal et les sous-modules

**Exemples :**
```
/update prefabs status
/update prefabs commit
/update prefabs pull
/update prefabs push
/update prefabs all
```

---

## Meta Commandes

Commandes pour inspecter et exporter les informations du systeme de commandes.

### commands dump

Exporte toutes les commandes enregistrees vers un fichier JSON.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/commands dump` |

**Notes :**
- Cree un fichier JSON a `dumps/commands.dump.json`
- Contient les noms de commandes, noms de classes, proprietaires et permissions
- Utile pour le debogage et la documentation

**Exemples :**
```
/commands dump
```

---

## Commandes Instantane d'Entite

Commandes pour gerer l'historique des instantanes d'entites (utilise pour la compensation de latence et le replay).

### entity snapshot

Commande parente pour les operations d'instantane d'entite.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity snapshot <sous-commande>` |
| **Alias** | `snap` |

**Sous-commandes :**
- `length` - Definir la longueur de l'historique des instantanes
- `history` - Visualiser l'historique des instantanes

---

### entity snapshot length

Definit la longueur de l'historique des instantanes d'entites.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity snapshot length <longueur>` |

**Parametres :**
- `longueur` - Longueur de l'historique en millisecondes

**Notes :**
- Controle jusqu'ou les positions des entites sont tracees
- Utilise pour la compensation de latence cote serveur

**Exemples :**
```
/entity snapshot length 500
/entity snapshot length 1000
```

---

### entity snapshot history

Visualise l'historique des instantanes d'entites avec des effets de particules.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/entity snapshot history` |

**Notes :**
- Fait apparaitre des effets de particules aux positions historiques des entites
- Affiche toutes les positions tracees du tick le plus ancien au tick actuel
- Utile pour deboguer le suivi de position des entites

**Exemples :**
```
/entity snapshot history
```

---

## Commandes Chunk Supplementaires

### chunk lighting

Exporte les donnees d'octree d'eclairage du chunk dans le journal du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/chunk lighting <x> <y> <z>` |

**Parametres :**
- `x y z` - Coordonnees de bloc (supporte les coordonnees relatives avec ~)

**Notes :**
- Exporte la structure d'octree d'eclairage dans le journal du serveur
- Le chunk doit etre charge
- Utile pour deboguer les problemes d'eclairage

**Exemples :**
```
/chunk lighting 0 64 0
/chunk lighting ~ ~ ~
```

---

## Commandes Stats Serveur Supplementaires

### server stats gc

Affiche les statistiques du ramasse-miettes.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/server stats gc` |

**Informations affichees :**
- Nom du collecteur GC
- Noms des pools de memoire
- Nombre de collections
- Temps total de collection

**Exemples :**
```
/server stats gc
```

---

## Commandes Teleportation

Commandes pour teleporter les joueurs vers differents emplacements et mondes.

### tp

Teleporte les joueurs vers des coordonnees ou d'autres joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp <x> <y> <z> [lacet] [tangage] [roulis]` |
| **Alias** | `teleport` |
| **Permission** | `teleport.*` |
| **Mode de jeu** | Creative |

**Variantes d'utilisation :**
- `/tp <x> <y> <z>` - Se teleporter vers des coordonnees
- `/tp <joueur> <x> <y> <z>` - Teleporter un joueur vers des coordonnees
- `/tp <joueur>` - Se teleporter vers un joueur
- `/tp <joueur1> <joueur2>` - Teleporter joueur1 vers joueur2

**Parametres :**
- `x y z` - Coordonnees cibles (supporte les coordonnees relatives avec ~)
- `lacet` (optionnel) - Angle de rotation horizontale
- `tangage` (optionnel) - Angle de rotation verticale
- `roulis` (optionnel) - Angle de rotation de roulis

**Exemples :**
```
/tp 100 64 200
/tp ~ ~10 ~
/tp NomJoueur
/tp NomJoueur 0 100 0
```

---

### tp all

Teleporte tous les joueurs d'un monde vers des coordonnees specifiees.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp all <x> <y> <z> [lacet] [tangage] [roulis] [monde]` |
| **Permission** | `teleport.all` |

**Parametres :**
- `x y z` - Coordonnees cibles (supporte les coordonnees relatives avec ~)
- `lacet` (optionnel) - Angle de rotation horizontale
- `tangage` (optionnel) - Angle de rotation verticale
- `roulis` (optionnel) - Angle de rotation de roulis
- `monde` (optionnel) - Monde cible (utilise le monde de l'expediteur si non specifie)

**Exemples :**
```
/tp all 0 100 0
/tp all ~ ~ ~ 90 0 0
/tp all 100 64 200 0 0 0 MonMonde
```

---

### tp home

Teleporte le joueur vers son point d'apparition.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp home` |
| **Permission** | `teleport.home` |

**Exemples :**
```
/tp home
```

---

### tp top

Teleporte le joueur vers le bloc le plus haut a sa position actuelle.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp top` |
| **Permission** | `teleport.top` |

**Notes :**
- Utile pour s'echapper des zones souterraines
- Le chunk doit etre charge a la position du joueur

**Exemples :**
```
/tp top
```

---

### tp back

Ramene le joueur a sa position precedente.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp back [nombre]` |
| **Permission** | `teleport.back` |

**Parametres :**
- `nombre` (optionnel) - Nombre de positions a remonter dans l'historique (defaut: 1)

**Exemples :**
```
/tp back
/tp back 3
```

---

### tp forward

Avance le joueur dans son historique de teleportation.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp forward [nombre]` |
| **Permission** | `teleport.forward` |

**Parametres :**
- `nombre` (optionnel) - Nombre de positions a avancer dans l'historique (defaut: 1)

**Exemples :**
```
/tp forward
/tp forward 2
```

---

### tp history

Affiche l'historique de teleportation du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp history` |
| **Permission** | `teleport.history` |

**Exemples :**
```
/tp history
```

---

### tp world

Teleporte le joueur vers le point d'apparition d'un autre monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/tp world <nomMonde>` |
| **Permission** | `teleport.world` |

**Parametres :**
- `nomMonde` - Nom du monde cible

**Exemples :**
```
/tp world Nether
/tp world MonMondePersonnalise
```

---

## Commandes Warp

Commandes pour gerer et utiliser les points de warp (emplacements sauvegardes).

### warp

Teleporte vers un emplacement warp sauvegarde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/warp <nom>` |

**Parametres :**
- `nom` - Nom du point de warp

**Sous-commandes :**
- `go` - Aller vers un point de warp
- `set` - Creer un nouveau point de warp
- `list` - Lister tous les points de warp
- `remove` - Supprimer un point de warp
- `reload` - Recharger la configuration des warps

**Exemples :**
```
/warp spawn
/warp centre_ville
```

---

### warp set

Cree un nouveau point de warp a l'emplacement actuel.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/warp set <nom>` |
| **Permission** | `warp.set` |

**Parametres :**
- `nom` - Nom du nouveau point de warp

**Notes :**
- Les mots-cles reserves (reload, remove, set, list, go) ne peuvent pas etre utilises comme noms de warp

**Exemples :**
```
/warp set spawn
/warp set arene
```

---

### warp list

Liste tous les points de warp disponibles.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/warp list` |

**Exemples :**
```
/warp list
```

---

### warp remove

Supprime un point de warp.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/warp remove <nom>` |
| **Permission** | `warp.remove` |

**Parametres :**
- `nom` - Nom du point de warp a supprimer

**Exemples :**
```
/warp remove ancien_spawn
```

---

### warp reload

Recharge la configuration des warps depuis le disque.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/warp reload` |

**Exemples :**
```
/warp reload
```

---

## Commandes Temps

Commandes pour gerer le temps du monde.

### time

Affiche ou definit le temps actuel du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/time [heures]` |
| **Alias** | `daytime` |
| **Mode de jeu** | Creative |

**Parametres :**
- `heures` (optionnel) - Heure du jour en heures (0-24). Si non specifie, affiche le temps actuel.

**Sous-commandes :**
- `set` - Definir le temps a une valeur specifique
- `Dawn` / `day` / `morning` - Definir le temps a l'aube
- `Midday` / `noon` - Definir le temps a midi
- `Dusk` / `night` - Definir le temps au crepuscule
- `Midnight` - Definir le temps a minuit
- `pause` / `stop` - Mettre en pause la progression du temps
- `dilation` - Definir le facteur de dilatation du temps

**Exemples :**
```
/time
/time 12
/time set 6
/time Dawn
/time Midnight
```

---

### time pause

Met en pause ou reprend la progression du temps.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/time pause` |
| **Alias** | `stop` |

**Exemples :**
```
/time pause
/time stop
```

---

### time dilation

Definit le facteur de dilatation du temps (vitesse de passage du temps).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/time dilation <facteur>` |

**Parametres :**
- `facteur` - Multiplicateur de dilatation du temps (0.01 a 4.0)

**Notes :**
- Les valeurs superieures a 1.0 font passer le temps plus vite
- Les valeurs inferieures a 1.0 font passer le temps plus lentement

**Exemples :**
```
/time dilation 2.0
/time dilation 0.5
```

---

## Commandes Meteo

Commandes pour gerer la meteo du monde.

### weather

Commande parente pour la gestion de la meteo.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/weather <sous-commande>` |

**Sous-commandes :**
- `set` - Definir la meteo actuelle
- `get` - Obtenir la meteo actuelle
- `reset` - Reinitialiser la meteo a la progression naturelle

---

### weather set

Definit la meteo forcee pour le monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/weather set <meteo>` |

**Parametres :**
- `meteo` - ID d'asset de meteo a definir

**Exemples :**
```
/weather set Clear
/weather set Rain
/weather set Storm
```

---

### weather get

Affiche la meteo forcee actuelle.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/weather get` |

**Informations affichees :**
- Meteo forcee actuelle (ou "not locked" si la meteo est naturelle)

**Exemples :**
```
/weather get
```

---

### weather reset

Reinitialise la meteo a la progression naturelle.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/weather reset` |

**Exemples :**
```
/weather reset
```

---

## Commandes Gestion des Mondes

Commandes pour gerer les mondes et leur configuration.

### world

Commande parente pour la gestion des mondes.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world <sous-commande>` |
| **Alias** | `worlds` |

**Sous-commandes :**
- `list` - Lister tous les mondes
- `add` - Creer un nouveau monde
- `remove` - Supprimer un monde
- `load` - Charger un monde
- `save` - Sauvegarder un monde
- `setdefault` - Definir le monde par defaut
- `pause` - Mettre en pause la simulation du monde
- `config` - Configurer les parametres du monde
- `settings` - Voir/modifier les parametres du monde
- `perf` - Statistiques de performance
- `tps` - Definir le taux de tick
- `prune` - Supprimer les chunks inutilises

---

### world list

Liste tous les mondes charges.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world list` |
| **Alias** | `ls` |

**Exemples :**
```
/world list
/world ls
```

---

### world save

Sauvegarde les donnees du monde sur le disque.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world save [monde] [--all]` |

**Parametres :**
- `monde` (optionnel) - Monde specifique a sauvegarder
- `--all` (drapeau) - Sauvegarder tous les mondes

**Exemples :**
```
/world save MonMonde
/world save --all
```

---

### world tps

Obtient ou definit le taux de tick du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world tps <taux>` |
| **Alias** | `tickrate` |

**Parametres :**
- `taux` - Taux de tick en ticks par seconde (1-2048)

**Sous-commandes :**
- `reset` - Reinitialiser le taux de tick par defaut

**Exemples :**
```
/world tps 20
/world tps 60
/world tps reset
```

---

### world config setspawn

Definit le point d'apparition du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world config setspawn [position] [rotation]` |

**Parametres :**
- `position` (optionnel) - Coordonnees d'apparition (utilise la position du joueur si non specifie)
- `rotation` (optionnel) - Rotation d'apparition (utilise la rotation du joueur si non specifie)

**Sous-commandes :**
- `default` - Reinitialiser au fournisseur d'apparition par defaut

**Exemples :**
```
/world config setspawn
/world config setspawn 0 100 0
/world config setspawn 0 100 0 0,0,0
```

---

### world config pvp

Active ou desactive le PvP dans le monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/world config pvp <active>` |

**Parametres :**
- `active` - Valeur booleenne (true/false)

**Exemples :**
```
/world config pvp true
/world config pvp false
```

---

## Commandes Controle d'Acces

Commandes pour gerer les bans et listes blanches des joueurs.

### ban

Bannit un joueur du serveur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/ban <nomUtilisateur> [raison]` |

**Parametres :**
- `nomUtilisateur` - Nom d'utilisateur du joueur a bannir
- `raison` (optionnel) - Raison du ban (defaut: "No reason.")

**Notes :**
- Non disponible en mode solo
- Si le joueur est en ligne, il sera deconnecte immediatement

**Exemples :**
```
/ban NomJoueur
/ban NomJoueur Grief de la zone de spawn
```

---

### unban

Retire un ban d'un joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/unban <nomUtilisateur>` |

**Parametres :**
- `nomUtilisateur` - Nom d'utilisateur du joueur a debannir

**Notes :**
- Non disponible en mode solo

**Exemples :**
```
/unban NomJoueur
```

---

### whitelist

Commande parente pour la gestion de la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist <sous-commande>` |

**Sous-commandes :**
- `add` - Ajouter un joueur a la liste blanche
- `remove` - Retirer un joueur de la liste blanche
- `enable` - Activer la liste blanche
- `disable` - Desactiver la liste blanche
- `clear` - Vider la liste blanche
- `status` - Verifier le statut de la liste blanche
- `list` - Lister les joueurs sur liste blanche

---

### whitelist add

Ajoute un joueur a la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist add <nomUtilisateur>` |

**Parametres :**
- `nomUtilisateur` - Nom d'utilisateur du joueur a ajouter

**Exemples :**
```
/whitelist add NomJoueur
```

---

### whitelist remove

Retire un joueur de la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist remove <nomUtilisateur>` |

**Parametres :**
- `nomUtilisateur` - Nom d'utilisateur du joueur a retirer

**Exemples :**
```
/whitelist remove NomJoueur
```

---

### whitelist enable

Active la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist enable` |

**Exemples :**
```
/whitelist enable
```

---

### whitelist disable

Desactive la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist disable` |

**Exemples :**
```
/whitelist disable
```

---

### whitelist status

Affiche le statut actuel de la liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist status` |

**Exemples :**
```
/whitelist status
```

---

### whitelist list

Liste tous les joueurs sur liste blanche.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/whitelist list` |

**Exemples :**
```
/whitelist list
```

---

## Commandes Bloc

Commandes pour manipuler les blocs dans le monde.

### block

Commande parente pour la manipulation des blocs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/block <sous-commande>` |
| **Alias** | `blocks` |
| **Mode de jeu** | Creative |

**Sous-commandes :**
- `set` - Placer un bloc a une position
- `get` - Obtenir les informations d'un bloc a une position
- `getstate` - Obtenir l'etat d'un bloc a une position
- `setstate` - Definir l'etat d'un bloc a une position
- `setticking` - Definir l'etat de tick d'un bloc
- `row` - Placer une rangee de blocs
- `bulk` - Operations de blocs en masse
- `inspectphysics` - Inspecter la physique des blocs
- `inspectfiller` - Inspecter les blocs de remplissage
- `inspectrotation` - Inspecter la rotation des blocs

---

### block set

Place un bloc a une position.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/block set <bloc> <x> <y> <z>` |

**Parametres :**
- `bloc` - Type de bloc a placer
- `x y z` - Coordonnees du bloc (supporte les coordonnees relatives avec ~)

**Exemples :**
```
/block set Stone 100 64 200
/block set Glass ~ ~1 ~
```

---

### block get

Obtient des informations sur un bloc a une position.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/block get <x> <y> <z>` |

**Parametres :**
- `x y z` - Coordonnees du bloc (supporte les coordonnees relatives avec ~)

**Exemples :**
```
/block get 100 64 200
/block get ~ ~-1 ~
```

---

## Commandes Particule

Commandes pour faire apparaitre des effets de particules.

### particle spawn

Fait apparaitre un effet de particules a l'emplacement du joueur.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/particle spawn <particule> [joueur]` |

**Parametres :**
- `particule` - ID d'asset du systeme de particules
- `joueur` (optionnel) - Joueur cible

**Notes :**
- Sans argument de particule, ouvre la page d'interface d'apparition de particules

**Exemples :**
```
/particle spawn Fire_Burst
/particle spawn Smoke_Puff NomJoueur
```

---

## Commandes Plugin

Commandes pour gerer les plugins du serveur.

### plugin

Commande parente pour la gestion des plugins.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/plugin <sous-commande>` |
| **Alias** | `plugins`, `pl` |

**Sous-commandes :**
- `list` - Lister tous les plugins charges
- `load` - Charger un plugin
- `unload` - Decharger un plugin
- `reload` - Recharger un plugin
- `manage` - Ouvrir l'interface de gestion des plugins

---

### plugin list

Liste tous les plugins charges.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/plugin list` |
| **Alias** | `ls` |

**Exemples :**
```
/plugin list
/plugin ls
```

---

### plugin load

Charge un plugin.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/plugin load <nomPlugin> [--boot]` |
| **Alias** | `l` |

**Parametres :**
- `nomPlugin` - Identifiant du plugin a charger
- `--boot` (drapeau) - Ajouter uniquement a la liste de demarrage sans charger immediatement

**Exemples :**
```
/plugin load com.example.monplugin
/plugin load mon-plugin --boot
```

---

### plugin unload

Decharge un plugin.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/plugin unload <nomPlugin> [--boot]` |
| **Alias** | `u` |

**Parametres :**
- `nomPlugin` - Identifiant du plugin a decharger
- `--boot` (drapeau) - Retirer uniquement de la liste de demarrage sans decharger immediatement

**Exemples :**
```
/plugin unload com.example.monplugin
```

---

### plugin reload

Recharge un plugin.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/plugin reload <nomPlugin>` |
| **Alias** | `r` |

**Parametres :**
- `nomPlugin` - Identifiant du plugin a recharger

**Exemples :**
```
/plugin reload com.example.monplugin
```

---

## Commandes Communication

Commandes pour la communication a l'echelle du serveur.

### say

Diffuse un message a tous les joueurs.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/say <message>` |
| **Alias** | `broadcast` |

**Parametres :**
- `message` - Message a diffuser (supporte les messages formates avec `{...}`)

**Exemples :**
```
/say Bonjour a tous !
/say Redemarrage du serveur dans 5 minutes
/say {"text": "Message formate", "color": "red"}
```

---

## Commandes Emote

Commandes pour les emotes des joueurs.

### emote

Joue une animation d'emote.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/emote <emote>` |
| **Mode de jeu** | Adventure |

**Parametres :**
- `emote` - ID de l'emote a jouer

**Exemples :**
```
/emote wave
/emote dance
```

---

## Commandes Forme de Debogage

Commandes pour dessiner des formes de debogage dans le monde.

### debug shape

Commande parente pour la visualisation des formes de debogage.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/debug shape <sous-commande>` |

**Sous-commandes :**
- `sphere` - Dessiner une sphere de debogage
- `cube` - Dessiner un cube de debogage
- `cylinder` - Dessiner un cylindre de debogage
- `cone` - Dessiner un cone de debogage
- `arrow` - Dessiner une fleche de debogage
- `showforce` - Afficher la visualisation de force de debogage
- `clear` - Effacer toutes les formes de debogage

---

## Commandes Apparition d'Objet

Commandes pour faire apparaitre des entites d'objet dans le monde.

### spawnitem

Fait apparaitre des entites d'objet dans le monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/spawnitem <objet> [qte] [--n=<nombre>] [--x=<force>]` |
| **Permission** | `spawnitem` |

**Parametres :**
- `objet` - ID d'asset de l'objet a faire apparaitre
- `qte` (optionnel) - Quantite par pile d'objets (defaut: 1)
- `--n` / `nombre` (optionnel) - Nombre d'entites d'objet a faire apparaitre
- `--x` / `force` (optionnel) - Multiplicateur de force de lancer (defaut: 1.0)

**Exemples :**
```
/spawnitem Sword_Iron
/spawnitem Apple 10
/spawnitem Gold_Ingot 5 --n=10
/spawnitem Arrow 64 --x=2.0
```

---

## Commandes Interaction

Commandes pour gerer les interactions des joueurs.

### interaction

Commande parente pour la gestion des interactions.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/interaction <sous-commande>` |
| **Alias** | `interact` |

**Sous-commandes :**
- `run` - Executer une interaction
- `snapshotsource` - Definir la source d'instantane pour les interactions
- `clear` - Effacer l'interaction actuelle

---

## Commandes Outils de Construction

Commandes pour la construction creative et l'edition du monde. Ces commandes necessitent le mode Creatif.

### pos1

Definit la premiere position de coin pour une region de selection.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/pos1 [x] [y] [z]` |
| **Permission** | `hytale.editor.selection.use` |
| **Mode de jeu** | Creative |

**Parametres :**
- `x y z` (optionnel) - Coordonnees specifiques. Si non fourni, utilise la position actuelle du joueur.

**Exemples :**
```
/pos1
/pos1 100 64 200
```

---

### pos2

Definit la deuxieme position de coin pour une region de selection.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/pos2 [x] [y] [z]` |
| **Permission** | `hytale.editor.selection.use` |
| **Mode de jeu** | Creative |

**Parametres :**
- `x y z` (optionnel) - Coordonnees specifiques. Si non fourni, utilise la position actuelle du joueur.

**Exemples :**
```
/pos2
/pos2 150 80 250
```

---

### copy

Copie la region selectionnee dans le presse-papiers.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/copy [--noEntities] [--onlyEntities] [--empty] [--keepanchors]` |
| **Permission** | `hytale.editor.selection.clipboard` |
| **Mode de jeu** | Creative |

**Parametres :**
- `--noEntities` (drapeau) - Exclure les entites de la copie
- `--onlyEntities` (drapeau) - Copier uniquement les entites, pas les blocs
- `--empty` (drapeau) - Copier les blocs vides/air
- `--keepanchors` (drapeau) - Preserver les points d'ancrage

**Syntaxe alternative :**
`/copy <xMin> <yMin> <zMin> <xMax> <yMax> <zMax> [drapeaux]` - Copier une region specifique par coordonnees.

**Exemples :**
```
/copy
/copy --noEntities
/copy --onlyEntities
/copy 0 0 0 50 50 50
```

---

### cut

Coupe la region selectionnee vers le presse-papiers (copier et supprimer).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/cut [--noEntities] [--onlyEntities] [--empty] [--keepanchors]` |
| **Permission** | `hytale.editor.selection.clipboard` |
| **Mode de jeu** | Creative |

**Parametres :**
- `--noEntities` (drapeau) - Exclure les entites de la coupe
- `--onlyEntities` (drapeau) - Couper uniquement les entites, pas les blocs
- `--empty` (drapeau) - Inclure les blocs vides/air
- `--keepanchors` (drapeau) - Preserver les points d'ancrage

**Exemples :**
```
/cut
/cut --noEntities
/cut 0 0 0 50 50 50
```

---

### paste

Colle le contenu du presse-papiers a la position actuelle ou aux coordonnees specifiees.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/paste [position]` |
| **Permission** | `hytale.editor.selection.clipboard` |
| **Mode de jeu** | Creative |

**Parametres :**
- `position` (optionnel) - Position cible (supporte les coordonnees relatives avec ~). Si non fourni, colle a la position du joueur.

**Exemples :**
```
/paste
/paste 100 64 200
/paste ~ ~10 ~
```

---

### set

Definit tous les blocs de la selection a un motif de bloc specifique.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/set <motif>` |
| **Alias** | `setBlocks` |
| **Permission** | `hytale.editor.selection.modify` |
| **Mode de jeu** | Creative |

**Parametres :**
- `motif` - Motif de bloc a remplir (ex: type de bloc ou motif pondere)

**Exemples :**
```
/set Stone
/set Dirt
/set 50%Stone,50%Dirt
```

---

### fill

Remplit la selection avec un motif de bloc (similaire a set).

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/fill <motif>` |
| **Alias** | `fillBlocks` |
| **Mode de jeu** | Creative |

**Parametres :**
- `motif` - Motif de bloc a remplir

**Exemples :**
```
/fill Stone
/fill Water
```

---

### replace

Remplace les blocs dans la selection d'un type a un autre.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/replace [de] <vers> [--substringSwap] [--regex]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `de` (optionnel) - Type ou motif de bloc source a remplacer. Si omis, remplace tous les blocs non-air.
- `vers` - Motif de bloc de destination
- `--substringSwap` (drapeau) - Remplacer les blocs par correspondance de sous-chaine dans leurs IDs
- `--regex` (drapeau) - Utiliser la correspondance de motif regex pour le parametre `de`

**Exemples :**
```
/replace Stone
/replace Stone Dirt
/replace Grass Flower --substringSwap
/replace ".*_Wood" Oak_Planks --regex
```

---

### undo

Annule la derniere operation des outils de construction.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/undo [nombre]` |
| **Alias** | `u` |
| **Permission** | `hytale.editor.history` |
| **Mode de jeu** | Creative |

**Parametres :**
- `nombre` (optionnel) - Nombre d'operations a annuler (defaut: 1)

**Exemples :**
```
/undo
/undo 5
/u
```

---

### redo

Refait une operation des outils de construction precedemment annulee.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/redo [nombre]` |
| **Alias** | `r` |
| **Permission** | `hytale.editor.history` |
| **Mode de jeu** | Creative |

**Parametres :**
- `nombre` (optionnel) - Nombre d'operations a refaire (defaut: 1)

**Exemples :**
```
/redo
/redo 3
/r
```

---

### rotate

Fait pivoter la selection ou le presse-papiers autour d'un axe.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/rotate <angle> [axe]` ou `/rotate <lacet> <tangage> <roulis>` |
| **Mode de jeu** | Creative |

**Parametres :**
- `angle` - Angle de rotation en degres (doit etre un multiple de 90 pour une rotation simple)
- `axe` (optionnel) - Axe de rotation: X, Y ou Z (defaut: Y)
- `lacet tangage roulis` - Angles de rotation arbitraires pour une rotation complexe

**Exemples :**
```
/rotate 90
/rotate 180 Y
/rotate 90 X
/rotate 45 30 0
```

---

### flip

Retourne la selection le long d'un axe.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/flip [direction]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `direction` (optionnel) - Direction de retournement (north, south, east, west, up, down). Si non specifie, utilise la direction dans laquelle le joueur regarde.

**Exemples :**
```
/flip
/flip north
/flip up
```

---

### stack

Empile/repete la selection plusieurs fois dans une direction.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/stack [nombre] [direction] [--empty] [--spacing=<n>]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `nombre` (optionnel) - Nombre de fois a empiler (defaut: 1)
- `direction` (optionnel) - Direction d'empilement. Si non specifie, utilise la direction dans laquelle le joueur regarde.
- `--empty` (drapeau) - Inclure les blocs vides/air
- `--spacing` (optionnel) - Ecart entre les copies empilees

**Exemples :**
```
/stack
/stack 5
/stack 3 up
/stack 10 north --spacing=2
```

---

### move

Deplace le contenu de la selection dans une direction.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/move [distance] [direction] [--empty] [--entities]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `distance` (optionnel) - Distance a deplacer (defaut: 1)
- `direction` (optionnel) - Direction de deplacement. Si non specifie, utilise la direction dans laquelle le joueur regarde.
- `--empty` (drapeau) - Laisser un espace vide derriere
- `--entities` (drapeau) - Deplacer aussi les entites dans la selection

**Exemples :**
```
/move
/move 10
/move 5 up
/move 20 north --entities
```

---

### expand

Etend la selection dans une direction.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/expand [distance] [axe]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `distance` (optionnel) - Distance d'extension (defaut: 1)
- `axe` (optionnel) - Axe d'extension (X, Y, Z). Si non specifie, utilise la direction dans laquelle le joueur regarde.

**Exemples :**
```
/expand
/expand 10
/expand 5 Y
```

---

### hollow

Creuse la selection, ne laissant que la coque exterieure.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/hollow [typeBloc] [epaisseur] [--floor] [--roof] [--perimeter]` |
| **Mode de jeu** | Creative |

**Parametres :**
- `typeBloc` (optionnel) - Bloc pour remplir le creux (defaut: Air/Vide)
- `epaisseur` (optionnel) - Epaisseur de la coque (defaut: 1, max: 128)
- `--floor` / `--bottom` (drapeau) - Inclure le sol dans le creux
- `--roof` / `--ceiling` / `--top` (drapeau) - Inclure le toit dans le creux
- `--perimeter` / `--all` (drapeau) - Inclure le sol et le toit

**Exemples :**
```
/hollow
/hollow Air 2
/hollow Stone 1 --perimeter
```

---

### walls

Cree des murs autour de la selection.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/walls <motif> [epaisseur] [--floor] [--roof] [--perimeter]` |
| **Alias** | `wall`, `side`, `sides` |
| **Mode de jeu** | Creative |

**Parametres :**
- `motif` - Motif de bloc pour les murs
- `epaisseur` (optionnel) - Epaisseur du mur (defaut: 1, max: 128)
- `--floor` / `--bottom` (drapeau) - Inclure le sol
- `--roof` / `--ceiling` / `--top` (drapeau) - Inclure le toit/plafond
- `--perimeter` / `--all` (drapeau) - Inclure le sol et le toit

**Exemples :**
```
/walls Stone
/walls Brick 2
/walls Glass 1 --perimeter
```

---

### deselect

Efface la selection actuelle.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/deselect` |
| **Alias** | `clearselection` |
| **Mode de jeu** | Creative |

**Exemples :**
```
/deselect
/clearselection
```

---

## Commandes Aventure

Commandes pour gerer les mecaniques de jeu d'aventure.

### objective

Gere les objectifs pour le gameplay d'aventure.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/objective <sous-commande>` |
| **Alias** | `obj` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `start objective` | `/objective start objective <objectiveId>` | Demarrer un objectif specifique |
| `start line` | `/objective start line <objectiveLineId>` | Demarrer une ligne d'objectif |
| `complete` | `/objective complete` | Completer l'objectif actuel |
| `panel` | `/objective panel` | Afficher le panneau d'objectifs |
| `history` | `/objective history` | Afficher l'historique des objectifs |
| `locationmarker` | `/objective locationmarker` | Gerer les marqueurs de lieu |
| `reachlocationmarker` | `/objective reachlocationmarker` | Declencher l'atteinte d'un marqueur |

**Exemples :**
```
/objective start objective Tutorial_Quest
/objective start line MainStory_Chapter1
/objective complete
/obj panel
```

---

### reputation

Gere la reputation du joueur avec les factions.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/reputation <sous-commande>` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `add` | `/reputation add <faction> <montant>` | Ajouter de la reputation avec une faction |
| `set` | `/reputation set <faction> <valeur>` | Definir la reputation a une valeur specifique |
| `rank` | `/reputation rank <faction>` | Obtenir le rang actuel avec une faction |
| `value` | `/reputation value <faction>` | Obtenir la valeur de reputation actuelle |

**Exemples :**
```
/reputation add Kweebecs 100
/reputation set Trorks -50
/reputation rank Kweebecs
/reputation value Trorks
```

---

## Commandes Instance

Commandes pour gerer les instances de jeu.

### instance

Gere les instances de jeu pour le contenu instance.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/instance <sous-commande>` |
| **Alias** | `instances`, `inst` |

**Sous-commandes :**

| Sous-commande | Syntaxe | Description |
|---------------|---------|-------------|
| `spawn` | `/instance spawn <instanceId>` | Apparaitre dans une instance |
| `exit` | `/instance exit` | Quitter l'instance actuelle |
| `migrate` | `/instance migrate` | Migrer les donnees d'instance |
| `edit new` | `/instance edit new <nom>` | Creer une nouvelle instance |
| `edit copy` | `/instance edit copy <source> <dest>` | Copier une instance |
| `edit load` | `/instance edit load <instanceId>` | Charger une instance pour edition |
| `edit list` | `/instance edit list` | Lister les instances disponibles |

**Exemples :**
```
/instance spawn Dungeon_Forest
/instance exit
/inst edit list
/instance edit new MyDungeon
```

---

## Commandes Spawn

Commandes pour se teleporter aux points d'apparition.

### spawn

Teleporte un joueur au point d'apparition du monde.

| Propriete | Valeur |
|-----------|--------|
| **Syntaxe** | `/spawn [indexSpawn] [joueur]` |
| **Permission** | `spawn.self`, `spawn.other` |

**Parametres :**
- `indexSpawn` (optionnel) - Index du point d'apparition si plusieurs existent
- `joueur` (optionnel) - Joueur cible (necessite la permission `spawn.other`)

**Sous-commandes :**
- `/spawn set` - Definir un nouveau point d'apparition
- `/spawn setdefault` - Definir le point d'apparition par defaut

**Exemples :**
```
/spawn
/spawn 0
/spawn NomJoueur
/spawn set
```
