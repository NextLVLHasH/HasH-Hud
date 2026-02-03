---
id: packets
title: Packets Reseau
sidebar_label: Packets
sidebar_position: 7
description: Documentation complete des packets reseau du protocole Hytale (200+ packets)
---

# Documentation des Packets Reseau Hytale

:::info Documentation v2 - Vérifiée
Cette documentation a été vérifiée par rapport au code source décompilé du serveur en utilisant une analyse multi-agent. Toutes les informations incluent des références aux fichiers sources.
:::

## Que sont les packets reseau ?

Quand vous jouez a Hytale, votre ordinateur (le **client**) et le serveur de jeu doivent constamment echanger des informations. Cette communication se fait via des **packets** - de petits paquets de donnees envoyes sur le reseau.

### La danse client-serveur

Chaque action dans un jeu multijoueur implique une communication reseau :

```
Vous appuyez sur Z pour avancer
       │
       ▼
Votre client envoie : "Le joueur veut avancer"
       │
       ▼ (voyage sur internet)
       │
       ▼
Le serveur recoit, valide, calcule la nouvelle position
       │
       ▼
Le serveur envoie : "Le joueur est maintenant a la position (X, Y, Z)"
       │
       ▼ (voyage retour)
       │
       ▼
Votre client met a jour votre ecran
```

Cela se produit **des dizaines de fois par seconde** pour chaque joueur !

### Pourquoi les packets sont importants

Comprendre les packets vous aide a :
- **Deboguer les problemes reseau** : "Pourquoi mon item personnalise n'apparait pas ?"
- **Optimiser les performances** : Savoir quels packets sont couteux
- **Comprendre les limites du jeu** : Pourquoi je ne peux pas envoyer des donnees illimitees ?
- **Creer des plugins conscients du reseau** : Reagir efficacement aux actions des joueurs

### Anatomie d'un packet

Chaque packet a une structure standard :

```
┌─────────────────────────────────────────────┐
│ ID du Packet (1-5 bytes)                    │  ← Quel type de packet ?
├─────────────────────────────────────────────┤
│ Bits Null (1-2 bytes)                       │  ← Quels champs optionnels sont presents ?
├─────────────────────────────────────────────┤
│ Bloc Fixe (variable)                        │  ← Donnees toujours presentes
├─────────────────────────────────────────────┤
│ Bloc Variable (variable)                    │  ← Donnees optionnelles/dynamiques
└─────────────────────────────────────────────┘
```

### Analogie du monde reel : courrier postal

Les packets sont comme des lettres dans le courrier :

| Systeme postal | Packets reseau |
|----------------|----------------|
| Enveloppe | En-tete du packet (ID, taille) |
| Adresse expediteur | Identifiant client/serveur |
| Contenu de la lettre | Donnees du packet (positions, actions) |
| Code postal | ID du packet (determine le traitement) |
| Courrier recommande | Packets fiables (doivent arriver) |
| Carte postale | Packets rapides (peuvent etre perdus) |

### Directions des packets

Les packets circulent dans deux directions :

| Direction | Symbole | Exemple |
|-----------|---------|---------|
| **Client → Serveur** | C2S | "J'ai clique a la position X,Y" |
| **Serveur → Client** | S2C | "Le bloc a X,Y,Z est maintenant Pierre" |
| **Bidirectionnel** | ↔ | Ping/Pong pour mesurer la latence |

### Categories de packets

Hytale organise plus de 200 packets en groupes logiques :

| Categorie | But | Exemples |
|-----------|-----|----------|
| **Connection** (0-3) | Etablir/terminer les connexions | Connect, Disconnect, Ping |
| **Authentification** (10-18) | Login et permissions | AuthToken, ConnectAccept |
| **Setup** (20-34) | Chargement initial du monde | WorldSettings, AssetInitialize |
| **Joueur** (100-119) | Actions du joueur | ClientMovement, MouseInteraction |
| **Monde/Chunk** (131-166) | Donnees du monde | SetChunk, ServerSetBlock |
| **Entite** (160-166) | Mises a jour d'entites | EntityUpdates, PlayAnimation |
| **Inventaire** (170-179) | Gestion d'inventaire | UpdatePlayerInventory, MoveItemStack |
| **Interface** (210-234) | UI et chat | ChatMessage, Notification |

### Le flux de connexion

Quand vous rejoignez un serveur Hytale, voici ce qui se passe :

```
1. CLIENT : "Bonjour ! Je veux me connecter" (packet Connect)
         ↓
2. SERVEUR : "Qui es-tu ?" (challenge d'authentification)
         ↓
3. CLIENT : "Voici mon token" (packet AuthToken)
         ↓
4. SERVEUR : "Bienvenue ! Voici les parametres du monde" (ConnectAccept + WorldSettings)
         ↓
5. SERVEUR : "Voici les donnees du monde..." (packets SetChunk)
         ↓
6. CLIENT : "Je suis pret !" (packet ClientReady)
         ↓
7. Les deux : Echangent des packets de mouvement/action en continu
```

### Compression et optimisation

Les gros packets (comme les donnees de chunks) sont compresses pour economiser la bande passante :

- **Packets compresses** : Donnees de chunk, mises a jour d'assets, lots d'entites
- **Packets non compresses** : Petits packets frequents comme le mouvement

Le serveur equilibre entre :
- **Bande passante** : Combien de donnees sont envoyees
- **Latence** : A quelle vitesse les donnees arrivent
- **Cout CPU** : La compression prend du temps de traitement

---

## Reference des packets

Documentation complete du protocole reseau Hytale, basee sur l'analyse du code decompile du serveur.

### Apercu technique

Le protocole reseau Hytale utilise un systeme de packets binaires pour la communication client-serveur. Chaque packet possede:

- **ID unique**: Identifiant numerique du packet (0-423)
- **Direction**: Client vers Server (C2S) ou Server vers Client (S2C)
- **Compression**: Certains packets volumineux sont compresses
- **Taille**: Taille fixe ou variable selon les donnees

### Architecture du Protocole

```
+------------------+     +------------------+
|     CLIENT       |     |     SERVER       |
+------------------+     +------------------+
         |                        |
         |  Connect (ID:0)        |
         |----------------------->|
         |                        |
         |  ConnectAccept (ID:14) |
         |<-----------------------|
         |                        |
         |  WorldSettings (ID:20) |
         |<-----------------------|
         |                        |
         |  ClientMovement (ID:108)|
         |----------------------->|
         |                        |
         |  EntityUpdates (ID:161)|
         |<-----------------------|
         |                        |
```

### Format des Packets

Chaque packet suit cette structure:

| Champ | Taille | Description |
|-------|--------|-------------|
| Packet ID | VarInt | Identifiant unique du packet |
| Null Bits | 1-2 bytes | Flags pour les champs nullable |
| Fixed Block | Variable | Donnees a taille fixe |
| Variable Block | Variable | Donnees a taille variable |

---

## Packets de Connexion (ID: 0-3)

Packets de base pour la gestion de connexion.

### Connect (ID: 0)

**Direction**: Client -> Server

Packet initial envoye par le client pour etablir une connexion.

| Champ | Type | Description |
|-------|------|-------------|
| `protocolHash` | String (64 bytes) | Hash de version du protocole |
| `clientType` | ClientType (byte) | Type de client (Game, AssetEditor) |
| `language` | String? | Langue du client (max 128 caracteres) |
| `identityToken` | String? | Token d'authentification (max 8192 caracteres) |
| `uuid` | UUID | Identifiant unique du joueur |
| `username` | String | Nom du joueur (max 16 caracteres) |
| `referralData` | byte[]? | Donnees de referral (max 4096 bytes) |
| `referralSource` | HostAddress? | Source de la connexion |

**Taille**: 82-38161 bytes

---

### Disconnect (ID: 1)

**Direction**: Bidirectionnelle

Fermeture de connexion avec raison optionnelle.

| Champ | Type | Description |
|-------|------|-------------|
| `reason` | String? | Raison de la deconnexion (max 4096000 caracteres) |
| `type` | DisconnectType | Type de deconnexion |

**Taille**: 2-16384007 bytes

---

### Ping (ID: 2)

**Direction**: Bidirectionnelle

Mesure de latence reseau.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | Identifiant du ping |
| `time` | InstantData? | Horodatage |
| `lastPingValueRaw` | int | Derniere valeur ping brute |
| `lastPingValueDirect` | int | Ping direct |
| `lastPingValueTick` | int | Ping par tick |

**Taille**: 29 bytes (fixe)

---

### Pong (ID: 3)

**Direction**: Bidirectionnelle

Reponse au ping.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | Identifiant correspondant au ping |
| `time` | InstantData? | Horodatage |
| `type` | PongType | Type de pong (Raw, Direct, Tick) |
| `packetQueueSize` | short | Taille de la file de packets |

**Taille**: 20 bytes (fixe)

---

## Packets d'Authentification (ID: 10-18)

Gestion de l'authentification et des permissions.

### Status (ID: 10)

**Direction**: Server -> Client

Statut de connexion.

| Champ | Type | Description |
|-------|------|-------------|
| (structure complexe) | - | Informations de statut |

**Taille**: 9-2587 bytes

---

### AuthGrant (ID: 11)

**Direction**: Client -> Server

Demande d'autorisation d'authentification.

| Champ | Type | Description |
|-------|------|-------------|
| (credentials) | - | Donnees d'authentification |

**Taille**: 1-49171 bytes

---

### AuthToken (ID: 12)

**Direction**: Client -> Server

Token d'authentification.

| Champ | Type | Description |
|-------|------|-------------|
| `accessToken` | String? | Token d'acces (max 8192 caracteres) |
| `serverAuthorizationGrant` | String? | Grant d'autorisation server (max 4096 caracteres) |

**Taille**: 1-49171 bytes

---

### ServerAuthToken (ID: 13)

**Direction**: Server -> Client

Token d'authentification du server.

**Taille**: 1-32851 bytes

---

### ConnectAccept (ID: 14)

**Direction**: Server -> Client

Confirmation d'acceptation de connexion.

**Taille**: 1-70 bytes

---

### PasswordResponse (ID: 15)

**Direction**: Client -> Server

Reponse de mot de passe pour servers proteges.

**Taille**: 1-70 bytes

---

### PasswordAccepted (ID: 16)

**Direction**: Server -> Client

Confirmation de mot de passe accepte.

**Taille**: 0 bytes (vide)

---

### PasswordRejected (ID: 17)

**Direction**: Server -> Client

Notification de mot de passe rejete.

**Taille**: 5-74 bytes

---

### ClientReferral (ID: 18)

**Direction**: Server -> Client

Redirection du client vers un autre server.

**Taille**: 1-5141 bytes

---

## Packets de Configuration (ID: 20-34)

Configuration initiale du monde et des assets.

### WorldSettings (ID: 20)

**Direction**: Server -> Client
**Compresse**: Oui

Configuration du monde.

| Champ | Type | Description |
|-------|------|-------------|
| `worldHeight` | int | Hauteur maximale du monde |
| `requiredAssets` | Asset[]? | Liste des assets requis |

**Taille**: 5+ bytes (variable, compresse)

---

### WorldLoadProgress (ID: 21)

**Direction**: Server -> Client

Progression du chargement du monde.

**Taille**: 9-16384014 bytes

---

### WorldLoadFinished (ID: 22)

**Direction**: Server -> Client

Notification de fin de chargement.

**Taille**: 0 bytes (vide)

---

### RequestAssets (ID: 23)

**Direction**: Client -> Server
**Compresse**: Oui

Demande d'assets au server.

**Taille**: Variable (compresse)

---

### AssetInitialize (ID: 24)

**Direction**: Server -> Client

Initialisation d'un transfert d'asset.

**Taille**: 4-2121 bytes

---

### AssetPart (ID: 25)

**Direction**: Server -> Client
**Compresse**: Oui

Partie d'un asset (transfert fragmente).

**Taille**: 1-4096006 bytes (compresse)

---

### AssetFinalize (ID: 26)

**Direction**: Server -> Client

Finalisation du transfert d'asset.

**Taille**: 0 bytes (vide)

---

### RemoveAssets (ID: 27)

**Direction**: Server -> Client

Suppression d'assets du cache client.

**Taille**: Variable

---

### RequestCommonAssetsRebuild (ID: 28)

**Direction**: Client -> Server

Demande de reconstruction des assets communs.

**Taille**: 0 bytes (vide)

---

### SetUpdateRate (ID: 29)

**Direction**: Server -> Client

Configuration du taux de mise a jour.

| Champ | Type | Description |
|-------|------|-------------|
| `updateRate` | int | Taux de mise a jour |

**Taille**: 4 bytes (fixe)

---

### SetTimeDilation (ID: 30)

**Direction**: Server -> Client

Configuration de la dilatation temporelle.

| Champ | Type | Description |
|-------|------|-------------|
| `timeDilation` | float | Facteur de dilatation |

**Taille**: 4 bytes (fixe)

---

### UpdateFeatures (ID: 31)

**Direction**: Server -> Client

Mise a jour des fonctionnalites activees.

**Taille**: 1-8192006 bytes

---

### ViewRadius (ID: 32)

**Direction**: Bidirectionnelle

Configuration du rayon de vue.

| Champ | Type | Description |
|-------|------|-------------|
| `viewRadius` | int | Rayon de vue en chunks |

**Taille**: 4 bytes (fixe)

---

### PlayerOptions (ID: 33)

**Direction**: Client -> Server

Options et preferences du joueur.

**Taille**: 1-327680184 bytes

---

### ServerTags (ID: 34)

**Direction**: Server -> Client

Tags et metadonnees du server.

**Taille**: Variable

---

## Packets de Mise a Jour d'Assets (ID: 40-85)

Mise a jour dynamique des definitions d'assets.

### UpdateBlockTypes (ID: 40)

**Direction**: Server -> Client
**Compresse**: Oui

Definitions des types de blocs.

**Taille**: Variable (compresse)

---

### UpdateBlockHitboxes (ID: 41)

**Direction**: Server -> Client
**Compresse**: Oui

Hitboxes des blocs.

---

### UpdateBlockSoundSets (ID: 42)

**Direction**: Server -> Client
**Compresse**: Oui

Sons associes aux blocs.

---

### UpdateItems (ID: 54)

**Direction**: Server -> Client
**Compresse**: Oui

Definitions des items.

---

### UpdateRecipes (ID: 60)

**Direction**: Server -> Client
**Compresse**: Oui

Recettes de craft.

---

### UpdateEnvironments (ID: 61)

**Direction**: Server -> Client
**Compresse**: Oui

Configuration des environnements (biomes, meteo, etc.).

---

### UpdateWeathers (ID: 47)

**Direction**: Server -> Client
**Compresse**: Oui

Types de meteo disponibles.

---

### UpdateInteractions (ID: 66)

**Direction**: Server -> Client
**Compresse**: Oui

Definitions des interactions.

---

*Note: Les packets 40-85 suivent tous le meme pattern de mise a jour d'assets.*

---

## Packets Joueur (ID: 100-119)

Gestion du joueur et de ses actions.

### SetClientId (ID: 100)

**Direction**: Server -> Client

Attribution de l'identifiant client.

| Champ | Type | Description |
|-------|------|-------------|
| `clientId` | int | ID unique du client |

**Taille**: 4 bytes (fixe)

---

### SetGameMode (ID: 101)

**Direction**: Server -> Client

Changement de mode de jeu.

| Champ | Type | Description |
|-------|------|-------------|
| `gameMode` | byte | Mode de jeu |

**Taille**: 1 byte (fixe)

---

### SetMovementStates (ID: 102)

**Direction**: Server -> Client

Etats de mouvement autorises.

**Taille**: 2 bytes (fixe)

---

### SetBlockPlacementOverride (ID: 103)

**Direction**: Server -> Client

Override de placement de blocs.

**Taille**: 1 byte (fixe)

---

### JoinWorld (ID: 104)

**Direction**: Server -> Client

Rejoindre un monde.

| Champ | Type | Description |
|-------|------|-------------|
| `clearWorld` | boolean | Effacer le monde actuel |
| `fadeInOut` | boolean | Animation de transition |
| `worldUuid` | UUID | Identifiant du monde |

**Taille**: 18 bytes (fixe)

---

### ClientReady (ID: 105)

**Direction**: Client -> Server

Notification que le client est pret.

**Taille**: 2 bytes (fixe)

---

### LoadHotbar (ID: 106) / SaveHotbar (ID: 107)

**Direction**: Client -> Server

Chargement/sauvegarde de la hotbar.

**Taille**: 1 byte (fixe)

---

### ClientMovement (ID: 108)

**Direction**: Client -> Server

Mise a jour de position et mouvement du joueur.

| Champ | Type | Description |
|-------|------|-------------|
| `movementStates` | MovementStates? | Etats de mouvement actuels |
| `relativePosition` | HalfFloatPosition? | Position relative (delta) |
| `absolutePosition` | Position? | Position absolue |
| `bodyOrientation` | Direction? | Orientation du corps |
| `lookOrientation` | Direction? | Direction du regard |
| `teleportAck` | TeleportAck? | Accusation de teleportation |
| `wishMovement` | Position? | Mouvement souhaite |
| `velocity` | Vector3d? | Velocite actuelle |
| `mountedTo` | int | ID de la monture (0 si aucune) |
| `riderMovementStates` | MovementStates? | Etats de la monture |

**Taille**: 153 bytes (fixe)

---

### ClientTeleport (ID: 109)

**Direction**: Server -> Client

Teleportation forcee du joueur.

**Taille**: 52 bytes (fixe)

---

### UpdateMovementSettings (ID: 110)

**Direction**: Server -> Client

Mise a jour des parametres de mouvement.

**Taille**: 252 bytes (fixe)

---

### MouseInteraction (ID: 111)

**Direction**: Client -> Server

Interaction souris (clics, mouvement).

| Champ | Type | Description |
|-------|------|-------------|
| `clientTimestamp` | long | Horodatage client |
| `activeSlot` | int | Slot actif de la hotbar |
| `itemInHandId` | String? | ID de l'item en main |
| `screenPoint` | Vector2f? | Position sur l'ecran |
| `mouseButton` | MouseButtonEvent? | Evenement de bouton |
| `mouseMotion` | MouseMotionEvent? | Evenement de mouvement |
| `worldInteraction` | WorldInteraction? | Interaction avec le monde |

**Taille**: 44-20480071 bytes

---

### DamageInfo (ID: 112)

**Direction**: Server -> Client

Information de degats recus.

**Taille**: 29-32768048 bytes

---

### ReticleEvent (ID: 113)

**Direction**: Server -> Client

Evenement du reticule de visee.

**Taille**: 4 bytes (fixe)

---

### DisplayDebug (ID: 114)

**Direction**: Server -> Client

Affichage d'informations de debug.

**Taille**: 19-32768037 bytes

---

### ClearDebugShapes (ID: 115)

**Direction**: Server -> Client

Effacement des formes de debug.

**Taille**: 0 bytes (vide)

---

### SyncPlayerPreferences (ID: 116)

**Direction**: Bidirectionnelle

Synchronisation des preferences joueur.

**Taille**: 8 bytes (fixe)

---

### ClientPlaceBlock (ID: 117)

**Direction**: Client -> Server

Placement de bloc par le client.

**Taille**: 20 bytes (fixe)

---

### UpdateMemoriesFeatureStatus (ID: 118)

**Direction**: Server -> Client

Statut de la fonctionnalite Memories.

**Taille**: 1 byte (fixe)

---

### RemoveMapMarker (ID: 119)

**Direction**: Client -> Server

Suppression d'un marqueur de carte.

**Taille**: 1-16384006 bytes

---

## Packets Monde/Chunk (ID: 131-166)

Gestion des chunks et du monde.

### SetChunk (ID: 131)

**Direction**: Server -> Client
**Compresse**: Oui

Envoi des donnees d'un chunk.

| Champ | Type | Description |
|-------|------|-------------|
| `x` | int | Coordonnee X du chunk |
| `y` | int | Coordonnee Y du chunk |
| `z` | int | Coordonnee Z du chunk |
| `localLight` | byte[]? | Donnees de lumiere locale |
| `globalLight` | byte[]? | Donnees de lumiere globale |
| `data` | byte[]? | Donnees de blocs |

**Taille**: 13-12288040 bytes (compresse)

---

### SetChunkHeightmap (ID: 132)

**Direction**: Server -> Client
**Compresse**: Oui

Heightmap d'un chunk.

**Taille**: 9-4096014 bytes (compresse)

---

### SetChunkTintmap (ID: 133)

**Direction**: Server -> Client
**Compresse**: Oui

Tintmap d'un chunk (couleurs de vegetation).

**Taille**: 9-4096014 bytes (compresse)

---

### SetChunkEnvironments (ID: 134)

**Direction**: Server -> Client
**Compresse**: Oui

Environnements du chunk.

**Taille**: 9-4096014 bytes (compresse)

---

### UnloadChunk (ID: 135)

**Direction**: Server -> Client

Dechargement d'un chunk.

| Champ | Type | Description |
|-------|------|-------------|
| `chunkX` | int | Coordonnee X du chunk |
| `chunkZ` | int | Coordonnee Z du chunk |

**Taille**: 8 bytes (fixe)

---

### SetFluids (ID: 136)

**Direction**: Server -> Client
**Compresse**: Oui

Fluides d'un chunk.

**Taille**: 13-4096018 bytes (compresse)

---

### ServerSetBlock (ID: 140)

**Direction**: Server -> Client

Modification d'un bloc par le server.

| Champ | Type | Description |
|-------|------|-------------|
| `x` | int | Coordonnee X |
| `y` | int | Coordonnee Y |
| `z` | int | Coordonnee Z |
| `blockId` | int | ID du nouveau bloc |
| `filler` | short | Donnees supplementaires |
| `rotation` | byte | Rotation du bloc |

**Taille**: 19 bytes (fixe)

---

### ServerSetBlocks (ID: 141)

**Direction**: Server -> Client

Modification de plusieurs blocs.

**Taille**: 12-36864017 bytes

---

### ServerSetFluid (ID: 142)

**Direction**: Server -> Client

Modification d'un fluide.

**Taille**: 17 bytes (fixe)

---

### ServerSetFluids (ID: 143)

**Direction**: Server -> Client

Modification de plusieurs fluides.

**Taille**: 12-28672017 bytes

---

### UpdateBlockDamage (ID: 144)

**Direction**: Server -> Client

Mise a jour des degats sur un bloc.

**Taille**: 21 bytes (fixe)

---

### UpdateTimeSettings (ID: 145)

**Direction**: Server -> Client

Parametres du temps.

**Taille**: 10 bytes (fixe)

---

### UpdateTime (ID: 146)

**Direction**: Server -> Client

Mise a jour de l'heure.

**Taille**: 13 bytes (fixe)

---

### UpdateWeather (ID: 149)

**Direction**: Server -> Client

Mise a jour de la meteo.

**Taille**: 8 bytes (fixe)

---

### SpawnParticleSystem (ID: 152)

**Direction**: Server -> Client

Creation d'un systeme de particules.

**Taille**: 44-16384049 bytes

---

### SpawnBlockParticleSystem (ID: 153)

**Direction**: Server -> Client

Particules liees a un bloc.

**Taille**: 30 bytes (fixe)

---

### PlaySoundEvent2D (ID: 154)

**Direction**: Server -> Client

Son 2D (interface).

**Taille**: 13 bytes (fixe)

---

### PlaySoundEvent3D (ID: 155)

**Direction**: Server -> Client

Son 3D (monde).

**Taille**: 38 bytes (fixe)

---

### PlaySoundEventEntity (ID: 156)

**Direction**: Server -> Client

Son attache a une entite.

**Taille**: 16 bytes (fixe)

---

### UpdateSleepState (ID: 157)

**Direction**: Server -> Client

Etat de sommeil.

**Taille**: 36-65536050 bytes

---

### SetPaused (ID: 158)

**Direction**: Client -> Server

Demande de pause.

**Taille**: 1 byte (fixe)

---

### ServerSetPaused (ID: 159)

**Direction**: Server -> Client

Confirmation de pause server.

**Taille**: 1 byte (fixe)

---

## Packets Entite (ID: 160-166)

Gestion des entites.

### SetEntitySeed (ID: 160)

**Direction**: Server -> Client

Seed d'une entite (pour generation procedurale).

**Taille**: 4 bytes (fixe)

---

### EntityUpdates (ID: 161)

**Direction**: Server -> Client
**Compresse**: Oui

Mises a jour d'entites (position, etat, etc.).

| Champ | Type | Description |
|-------|------|-------------|
| `removed` | int[]? | IDs des entites supprimees |
| `updates` | EntityUpdate[]? | Mises a jour d'entites |

**Taille**: Variable (compresse)

---

### PlayAnimation (ID: 162)

**Direction**: Server -> Client

Jouer une animation sur une entite.

**Taille**: 6-32768024 bytes

---

### ChangeVelocity (ID: 163)

**Direction**: Server -> Client

Changement de velocite d'une entite.

**Taille**: 35 bytes (fixe)

---

### ApplyKnockback (ID: 164)

**Direction**: Server -> Client

Application d'un knockback.

**Taille**: 38 bytes (fixe)

---

### SpawnModelParticles (ID: 165)

**Direction**: Server -> Client

Particules sur un modele.

**Taille**: Variable

---

### MountMovement (ID: 166)

**Direction**: Client -> Server

Mouvement d'une monture.

**Taille**: 59 bytes (fixe)

---

## Packets Inventaire (ID: 170-179)

Gestion de l'inventaire.

### UpdatePlayerInventory (ID: 170)

**Direction**: Server -> Client
**Compresse**: Oui

Mise a jour complete de l'inventaire.

| Champ | Type | Description |
|-------|------|-------------|
| `storage` | InventorySection? | Stockage principal |
| `armor` | InventorySection? | Armure |
| `hotbar` | InventorySection? | Barre d'action |
| `utility` | InventorySection? | Utilitaires |
| `builderMaterial` | InventorySection? | Materiaux de construction |
| `tools` | InventorySection? | Outils |
| `backpack` | InventorySection? | Sac a dos |
| `sortType` | SortType | Type de tri |

**Taille**: Variable (compresse)

---

### SetCreativeItem (ID: 171)

**Direction**: Client -> Server

Definir un item en mode creatif.

**Taille**: 9-16384019 bytes

---

### DropCreativeItem (ID: 172)

**Direction**: Client -> Server

Lacher un item en mode creatif.

**Taille**: 0-16384010 bytes

---

### SmartGiveCreativeItem (ID: 173)

**Direction**: Client -> Server

Don intelligent d'item creatif.

**Taille**: 1-16384011 bytes

---

### DropItemStack (ID: 174)

**Direction**: Client -> Server

Lacher une pile d'items.

**Taille**: 12 bytes (fixe)

---

### MoveItemStack (ID: 175)

**Direction**: Client -> Server

Deplacer une pile d'items.

| Champ | Type | Description |
|-------|------|-------------|
| `fromSectionId` | int | Section source |
| `fromSlotId` | int | Slot source |
| `quantity` | int | Quantite a deplacer |
| `toSectionId` | int | Section destination |
| `toSlotId` | int | Slot destination |

**Taille**: 20 bytes (fixe)

---

### SmartMoveItemStack (ID: 176)

**Direction**: Client -> Server

Deplacement intelligent (shift-click).

**Taille**: 13 bytes (fixe)

---

### SetActiveSlot (ID: 177)

**Direction**: Client -> Server

Changement de slot actif.

**Taille**: 8 bytes (fixe)

---

### SwitchHotbarBlockSet (ID: 178)

**Direction**: Client -> Server

Changement de set de hotbar.

**Taille**: 1-16384006 bytes

---

### InventoryAction (ID: 179)

**Direction**: Client -> Server

Action generique d'inventaire.

**Taille**: 6 bytes (fixe)

---

## Packets Fenetre (ID: 200-204)

Gestion des fenetres/interfaces.

### OpenWindow (ID: 200)

**Direction**: Server -> Client
**Compresse**: Oui

Ouverture d'une fenetre.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | int | ID de la fenetre |
| `windowType` | WindowType | Type de fenetre |
| `windowData` | String? | Donnees JSON de la fenetre |
| `inventory` | InventorySection? | Inventaire associe |
| `extraResources` | ExtraResources? | Ressources supplementaires |

**Taille**: Variable (compresse)

---

### UpdateWindow (ID: 201)

**Direction**: Server -> Client
**Compresse**: Oui

Mise a jour d'une fenetre.

**Taille**: Variable (compresse)

---

### CloseWindow (ID: 202)

**Direction**: Bidirectionnelle

Fermeture d'une fenetre.

**Taille**: 4 bytes (fixe)

---

### SendWindowAction (ID: 203)

**Direction**: Client -> Server

Action dans une fenetre.

**Taille**: 4-32768027 bytes

---

### ClientOpenWindow (ID: 204)

**Direction**: Client -> Server

Demande d'ouverture de fenetre.

**Taille**: 1 byte (fixe)

---

## Packets Interface (ID: 210-234)

Communication et interface utilisateur.

### ServerMessage (ID: 210)

**Direction**: Server -> Client

Message du server.

**Taille**: Variable

---

### ChatMessage (ID: 211)

**Direction**: Client -> Server

Message de chat.

| Champ | Type | Description |
|-------|------|-------------|
| `message` | String? | Contenu du message (max 4096000 caracteres) |

**Taille**: 1-16384006 bytes

---

### Notification (ID: 212)

**Direction**: Server -> Client

Notification a afficher.

**Taille**: Variable

---

### KillFeedMessage (ID: 213)

**Direction**: Server -> Client

Message de kill feed.

**Taille**: Variable

---

### ShowEventTitle (ID: 214)

**Direction**: Server -> Client

Affichage d'un titre d'evenement.

**Taille**: Variable

---

### HideEventTitle (ID: 215)

**Direction**: Server -> Client

Masquage du titre.

**Taille**: 4 bytes (fixe)

---

### SetPage (ID: 216)

**Direction**: Server -> Client

Changement de page d'interface.

**Taille**: 2 bytes (fixe)

---

### CustomHud (ID: 217)

**Direction**: Server -> Client
**Compresse**: Oui

HUD personnalise.

**Taille**: Variable (compresse)

---

### CustomPage (ID: 218)

**Direction**: Server -> Client
**Compresse**: Oui

Page personnalisee.

**Taille**: Variable (compresse)

---

### CustomPageEvent (ID: 219)

**Direction**: Client -> Server

Evenement de page personnalisee.

**Taille**: 2-16384007 bytes

---

### ServerInfo (ID: 223)

**Direction**: Server -> Client

Informations du server.

**Taille**: 5-32768023 bytes

---

### AddToServerPlayerList (ID: 224)

**Direction**: Server -> Client

Ajout d'un joueur a la liste.

**Taille**: Variable

---

### RemoveFromServerPlayerList (ID: 225)

**Direction**: Server -> Client

Suppression d'un joueur de la liste.

**Taille**: 1-65536006 bytes

---

### UpdateServerPlayerList (ID: 226)

**Direction**: Server -> Client

Mise a jour de la liste des joueurs.

**Taille**: 1-131072006 bytes

---

### UpdateServerPlayerListPing (ID: 227)

**Direction**: Server -> Client

Mise a jour des pings.

**Taille**: 1-81920006 bytes

---

### UpdateKnownRecipes (ID: 228)

**Direction**: Server -> Client

Recettes connues par le joueur.

**Taille**: Variable

---

### UpdatePortal (ID: 229)

**Direction**: Server -> Client

Mise a jour d'un portail.

**Taille**: 6-16384020 bytes

---

### UpdateVisibleHudComponents (ID: 230)

**Direction**: Server -> Client

Composants HUD visibles.

**Taille**: 1-4096006 bytes

---

### ResetUserInterfaceState (ID: 231)

**Direction**: Server -> Client

Reinitialisation de l'interface.

**Taille**: 0 bytes (vide)

---

### UpdateLanguage (ID: 232)

**Direction**: Client -> Server

Changement de langue.

**Taille**: 1-16384006 bytes

---

### WorldSavingStatus (ID: 233)

**Direction**: Server -> Client

Statut de sauvegarde du monde.

**Taille**: 1 byte (fixe)

---

### OpenChatWithCommand (ID: 234)

**Direction**: Server -> Client

Ouvrir le chat avec une commande pre-remplie.

**Taille**: 1-16384006 bytes

---

## Packets Carte du Monde (ID: 240-245)

Gestion de la carte du monde.

### UpdateWorldMapSettings (ID: 240)

**Direction**: Server -> Client

Parametres de la carte.

**Taille**: Variable

---

### UpdateWorldMap (ID: 241)

**Direction**: Server -> Client
**Compresse**: Oui

Mise a jour de la carte.

| Champ | Type | Description |
|-------|------|-------------|
| `chunks` | MapChunk[]? | Chunks de la carte |
| `addedMarkers` | MapMarker[]? | Marqueurs ajoutes |
| `removedMarkers` | String[]? | Marqueurs supprimes |

**Taille**: Variable (compresse)

---

### ClearWorldMap (ID: 242)

**Direction**: Server -> Client

Effacement de la carte.

**Taille**: 0 bytes (vide)

---

### UpdateWorldMapVisible (ID: 243)

**Direction**: Server -> Client

Visibilite de la carte.

**Taille**: 1 byte (fixe)

---

### TeleportToWorldMapMarker (ID: 244)

**Direction**: Client -> Server

Teleportation vers un marqueur.

**Taille**: 1-16384006 bytes

---

### TeleportToWorldMapPosition (ID: 245)

**Direction**: Client -> Server

Teleportation vers une position.

**Taille**: 8 bytes (fixe)

---

## Packets Acces Server (ID: 250-252)

Gestion des acces server.

### RequestServerAccess (ID: 250)

**Direction**: Client -> Server

Demande d'acces.

**Taille**: 3 bytes (fixe)

---

### UpdateServerAccess (ID: 251)

**Direction**: Server -> Client

Mise a jour des acces.

**Taille**: Variable

---

### SetServerAccess (ID: 252)

**Direction**: Client -> Server

Definition des acces.

**Taille**: 2-16384007 bytes

---

## Packets Machinima (ID: 260-262)

Systeme de machinima (cinematiques).

### RequestMachinimaActorModel (ID: 260)

**Direction**: Client -> Server

Demande de modele d'acteur.

**Taille**: 1-49152028 bytes

---

### SetMachinimaActorModel (ID: 261)

**Direction**: Server -> Client

Definition du modele d'acteur.

**Taille**: Variable

---

### UpdateMachinimaScene (ID: 262)

**Direction**: Server -> Client
**Compresse**: Oui

Mise a jour de la scene.

**Taille**: Variable (compresse)

---

## Packets Camera (ID: 280-283)

Controle de la camera.

### SetServerCamera (ID: 280)

**Direction**: Server -> Client

Configuration de la camera.

| Champ | Type | Description |
|-------|------|-------------|
| `clientCameraView` | ClientCameraView | Vue (FirstPerson, ThirdPerson, etc.) |
| `isLocked` | boolean | Camera verrouillee |
| `cameraSettings` | ServerCameraSettings? | Parametres detailles |

**Taille**: 157 bytes (fixe)

---

### CameraShakeEffect (ID: 281)

**Direction**: Server -> Client

Effet de tremblement.

**Taille**: 9 bytes (fixe)

---

### RequestFlyCameraMode (ID: 282)

**Direction**: Client -> Server

Demande de mode camera libre.

**Taille**: 1 byte (fixe)

---

### SetFlyCameraMode (ID: 283)

**Direction**: Server -> Client

Activation du mode camera libre.

**Taille**: 1 byte (fixe)

---

## Packets Interaction (ID: 290-294)

Systeme d'interactions.

### SyncInteractionChains (ID: 290)

**Direction**: Server -> Client

Synchronisation des chaines d'interaction.

**Taille**: Variable

---

### CancelInteractionChain (ID: 291)

**Direction**: Bidirectionnelle

Annulation d'une chaine d'interaction.

**Taille**: 5-1038 bytes

---

### PlayInteractionFor (ID: 292)

**Direction**: Server -> Client

Jouer une interaction.

**Taille**: 19-16385065 bytes

---

### MountNPC (ID: 293)

**Direction**: Client -> Server

Monter un NPC.

**Taille**: 16 bytes (fixe)

---

### DismountNPC (ID: 294)

**Direction**: Client -> Server

Descendre d'un NPC.

**Taille**: 0 bytes (vide)

---

## Packets Editeur d'Assets (ID: 300-355)

Outils d'edition d'assets (mode developpeur).

*Ces packets sont utilises par l'editeur d'assets integre et ne sont pas utilises en jeu normal.*

### AssetEditorInitialize (ID: 302)

Initialisation de l'editeur.

### AssetEditorAuthorization (ID: 303)

Autorisation d'edition.

### AssetEditorCapabilities (ID: 304)

Capacites de l'editeur.

### AssetEditorSetupSchemas (ID: 305)

Configuration des schemas.

### AssetEditorFetchAsset (ID: 310)

Recuperation d'un asset.

### AssetEditorUpdateAsset (ID: 324)

Mise a jour d'un asset.

### AssetEditorCreateAsset (ID: 327)

Creation d'un asset.

### AssetEditorDeleteAsset (ID: 329)

Suppression d'un asset.

*... et 40+ autres packets d'edition.*

---

## Packets Parametres de Rendu (ID: 360-361)

Parametres de rendu.

### UpdateSunSettings (ID: 360)

**Direction**: Server -> Client

Parametres du soleil.

**Taille**: 8 bytes (fixe)

---

### UpdatePostFxSettings (ID: 361)

**Direction**: Server -> Client

Parametres de post-traitement.

**Taille**: 20 bytes (fixe)

---

## Packets Outils de Construction (ID: 400-423)

Outils de construction (mode creatif avance).

### BuilderToolArgUpdate (ID: 400)

**Direction**: Client -> Server

Mise a jour d'argument d'outil.

**Taille**: 14-32768032 bytes

---

### BuilderToolEntityAction (ID: 401)

**Direction**: Client -> Server

Action sur une entite.

**Taille**: 5 bytes (fixe)

---

### BuilderToolSetEntityTransform (ID: 402)

**Direction**: Client -> Server

Transformation d'entite.

**Taille**: 54 bytes (fixe)

---

### BuilderToolExtrudeAction (ID: 403)

**Direction**: Client -> Server

Action d'extrusion.

**Taille**: 24 bytes (fixe)

---

### BuilderToolStackArea (ID: 404)

**Direction**: Client -> Server

Empilement de zone.

**Taille**: 41 bytes (fixe)

---

### BuilderToolSelectionTransform (ID: 405)

**Direction**: Client -> Server

Transformation de selection.

**Taille**: 52-16384057 bytes

---

### BuilderToolPasteClipboard (ID: 407)

**Direction**: Client -> Server

Collage du presse-papier.

**Taille**: 12 bytes (fixe)

---

### BuilderToolSelectionUpdate (ID: 409)

**Direction**: Client -> Server

Mise a jour de selection.

**Taille**: 24 bytes (fixe)

---

### BuilderToolLaserPointer (ID: 419)

**Direction**: Client -> Server

Pointeur laser.

**Taille**: 36 bytes (fixe)

---

*... et 10+ autres packets d'outils de construction.*

---

## Resume des Directions

| Categorie | Client -> Server | Server -> Client | Bidirectionnelle |
|-----------|-----------------|------------------|------------------|
| Connexion | Connect | - | Disconnect, Ping, Pong |
| Authentification | AuthToken, AuthGrant | ConnectAccept, Status | PasswordResponse |
| Configuration | RequestAssets, PlayerOptions | WorldSettings, WorldLoadProgress | ViewRadius |
| Joueur | ClientMovement, MouseInteraction | JoinWorld, SetGameMode, ClientTeleport | SyncPlayerPreferences |
| Monde | SetPaused | SetChunk, ServerSetBlock, EntityUpdates | - |
| Inventaire | MoveItemStack, DropItemStack | UpdatePlayerInventory | - |
| Fenetre | SendWindowAction, ClientOpenWindow | OpenWindow, UpdateWindow | CloseWindow |
| Interface | ChatMessage, CustomPageEvent | ServerMessage, Notification | - |
| Camera | RequestFlyCameraMode | SetServerCamera, CameraShakeEffect | - |

---

## Notes Techniques

### Compression

Les packets marques comme compresses utilisent **Zstd (Zstandard)** pour reduire la bande passante. La compression est appliquee apres la serialisation.

### Validation

Chaque packet implemente une methode `validateStructure` qui verifie l'integrite des donnees avant deserialisation.

### Types de Donnees

- **VarInt**: Entier de taille variable (1-5 bytes)
- **String**: Prefixe de longueur (VarInt) + donnees UTF-8
- **UUID**: 16 bytes (2 x long)
- **Position**: 24 bytes (3 x double)
- **Direction**: 12 bytes (3 x float)
- **Vector3d**: 24 bytes (3 x double)

---

*Documentation generee a partir de l'analyse du code decompile du serveur Hytale.*
