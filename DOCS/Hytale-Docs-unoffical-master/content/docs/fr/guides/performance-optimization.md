---
id: optimisation-performances
title: "Guide d'Optimisation des Performances"
sidebar_label: Optimisation
sidebar_position: 5
description: Comment ameliorer les FPS et les performances dans Hytale
---

# Guide d'Optimisation des Performances

Bienvenue dans le guide complet d'optimisation des performances de Hytale. Que vous rencontriez des FPS faibles, des saccades, ou que vous souhaitiez simplement maximiser votre experience de jeu, ce guide couvre tout ce que vous devez savoir.

## Introduction

### Comprendre le Profil de Performance de Hytale

Hytale est un **jeu voxel**, ce qui signifie que ses caracteristiques de performance different des jeux traditionnels :

- **Le CPU est plus important que le GPU** - Le traitement des voxels, la generation du monde et la gestion des entites sont des taches gourmandes en CPU
- **L'utilisation de la RAM augmente avec la distance de vue** - Plus de chunks visibles = plus de memoire requise
- **Le SSD impacte significativement les temps de chargement** - Un stockage rapide reduit les saccades lors du chargement des chunks

:::info Point Cle
De nombreux problemes de performance dans les jeux voxel ne sont pas lies au GPU. Si vous avez des FPS faibles, concentrez-vous d'abord sur les optimisations CPU, RAM et stockage !
:::

Ce guide vous aidera a atteindre les meilleures performances possibles quelle que soit votre configuration materielle.

---

## Apercu des Parametres Graphiques

### Tableau d'Impact des Parametres

Comprendre quels parametres affectent le plus les performances vous aide a prendre des decisions eclairees :

| Parametre | Impact FPS | Recommandation (Bas de gamme) | Recommandation (Haut de gamme) |
|-----------|------------|-------------------------------|--------------------------------|
| **Distance de Vue** | TRES ELEVE | 6-8 chunks | 12+ chunks |
| **Qualite des Ombres** | ELEVE | Desactive / Bas | Moyen / Eleve |
| **Echelle de Rendu** | ELEVE | 75-100% | 100-150% |
| **Occlusion Ambiante** | MOYEN | Desactive | Active |
| **Anti-Aliasing** | MOYEN | Desactive / FXAA | TAA |
| **Effets de Particules** | MOYEN | Reduit | Complet |
| **Qualite des Textures** | FAIBLE | Eleve (impact minimal) | Eleve |
| **Filtrage Anisotrope** | FAIBLE | 4x | 16x |
| **V-Sync** | VARIABLE | Desactive (utiliser limiteur) | Active / Desactive |

---

## Distance de Vue - Le Parametre le Plus Important

La distance de vue est **le parametre le plus impactant** pour les performances et l'utilisation de la RAM.

### Tableau de Performance de la Distance de Vue

| Distance | Blocs Visibles | Utilisation RAM | Impact FPS Attendu |
|----------|----------------|-----------------|---------------------|
| 4 chunks | 128 blocs | ~2 Go | FPS Tres Eleves |
| 6 chunks | 192 blocs | ~3 Go | FPS Eleves |
| 8 chunks | 256 blocs | ~4 Go | Bons FPS |
| 10 chunks | 320 blocs | ~5 Go | FPS Moderes |
| 12 chunks | 384 blocs | ~6 Go | FPS Plus Faibles |
| 16 chunks | 512 blocs | ~8 Go+ | Exigeant |

### Comment Choisir Votre Distance de Vue

1. **Verifiez votre RAM disponible** - Laissez au moins 4 Go pour Windows et les autres applications
2. **Commencez bas, augmentez progressivement** - Debutez a 8 chunks, augmentez jusqu'a remarquer des baisses de performance
3. **Considerez votre style de jeu** :
   - Exploration : Distance plus elevee pour la navigation
   - Construction : Distance plus basse acceptable, meilleurs FPS pour les constructions complexes
   - Combat : Distance moyenne, FPS stables en priorite

:::warning Avertissement Memoire
Definir une distance de vue trop elevee peut causer des crashes par manque de memoire, surtout avec des mods installes. Surveillez votre utilisation RAM !
:::

---

## Allocation de RAM

Une allocation de RAM appropriee est cruciale pour les performances de Hytale.

### Allocation de RAM Recommandee

| Configuration | Minimum | Recommande | Maximum |
|---------------|---------|------------|---------|
| Hytale Vanilla | 4 Go | 6 Go | 8 Go |
| Mods Legers | 6 Go | 8 Go | 10 Go |
| Mods Lourds / Serveurs | 8 Go | 12 Go | 16 Go |

### Comment Allouer Plus de RAM

Via le Launcher Hytale :
1. Ouvrez le **Launcher Hytale**
2. Allez dans **Parametres** > **Parametres du Jeu**
3. Trouvez **Allocation Memoire** ou **RAM**
4. Ajustez le curseur a la quantite desiree
5. Cliquez sur **Appliquer** et redemarrez le jeu

### Arguments JVM pour Utilisateurs Avances

Si vous avez acces aux arguments JVM, ces parametres optimises peuvent ameliorer les performances :

```
-Xms4G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1
```

**Explication des arguments cles :**
- `-Xms4G` - Allocation RAM minimum (4 Go)
- `-Xmx8G` - Allocation RAM maximum (8 Go)
- `-XX:+UseG1GC` - Utilise le garbage collector G1 (optimise pour les jeux)

:::tip Adaptez a Votre Systeme
Changez les valeurs `-Xms` et `-Xmx` en fonction de votre RAM disponible. N'allouez jamais plus de 75% de votre RAM systeme totale.
:::

---

## Optimisations Windows

### Activer le Mode Jeu

Le Mode Jeu de Windows priorise les performances de jeu :

1. Appuyez sur **Win + I** pour ouvrir les Parametres
2. Allez dans **Jeux** > **Mode Jeu**
3. Activez le **Mode Jeu**

### Desactiver les Overlays

Les overlays consomment des ressources et peuvent causer des saccades :

#### Overlay Discord
1. Ouvrez les Parametres Discord
2. Allez dans **Activite de jeu** (ou Parametres d'application > Parametres d'activite)
3. Desactivez **Activer l'overlay en jeu**

#### Overlay NVIDIA GeForce Experience
1. Ouvrez GeForce Experience
2. Cliquez sur l'icone engrenage (Parametres)
3. Desactivez **Overlay en jeu**

#### Xbox Game Bar
1. Appuyez sur **Win + I** > **Jeux** > **Xbox Game Bar**
2. Desactivez-le

#### Overlay Steam
1. Ouvrez Steam > Parametres > En jeu
2. Decochez **Activer l'overlay Steam pendant le jeu**

### Fermer les Applications en Arriere-Plan

Les applications en arriere-plan consomment du CPU, de la RAM et peuvent causer des saccades :

**Coupables frequents :**
- Navigateurs web (surtout Chrome avec plusieurs onglets)
- Analyse antivirus en temps reel
- Applications de synchronisation cloud (OneDrive, Dropbox, Google Drive)
- Logiciels d'eclairage RGB
- Outils de monitoring systeme

:::tip Verification Rapide
Ouvrez le **Gestionnaire des taches** (Ctrl + Maj + Echap) et triez par utilisation CPU ou Memoire pour identifier les applications gourmandes en ressources.
:::

### Mettre a Jour les Pilotes GPU

Des pilotes obsoletes peuvent causer des problemes de performance et des crashes :

**NVIDIA :**
1. Ouvrez GeForce Experience
2. Allez dans l'onglet **Pilotes**
3. Cliquez sur **Rechercher des mises a jour**
4. Telechargez et installez le dernier pilote Game Ready

**AMD :**
1. Ouvrez AMD Radeon Software
2. Cliquez sur l'onglet **Systeme**
3. Verifiez les mises a jour de pilotes
4. Installez le dernier pilote recommande

**Intel :**
1. Telechargez Intel Driver & Support Assistant
2. Lancez l'analyse
3. Mettez a jour les pilotes graphiques

---

## Optimisations Materielles

### Stockage : SSD vs HDD

| Type de Stockage | Chargement Chunks | Sauvegarde Monde | Chargement Mods | Recommandation |
|------------------|-------------------|------------------|-----------------|----------------|
| HDD | Lent, saccades | Lent | Tres lent | Eviter si possible |
| SSD SATA | Bon | Bon | Bon | Minimum recommande |
| SSD NVMe | Excellent | Excellent | Excellent | Choix ideal |

**Impact du SSD :**
- Chargement du monde et generation des chunks plus rapides
- Saccades reduites lors de l'exploration de nouvelles zones
- Temps de chargement des mods plus rapides
- Demarrage du jeu plus rapide

:::info Fortement Recommande
Si vous utilisez encore un HDD, passer a un SSD est la meilleure mise a niveau materielle pour les performances de Hytale.
:::

### Configuration de la RAM

La **RAM en Dual-Channel** offre des performances significativement meilleures que le single-channel :

- Utilisez **deux barrettes de RAM identiques** au lieu d'une
- Installez-les dans les bons emplacements (generalement slots 2 et 4)
- Consultez le manuel de votre carte mere pour la configuration dual-channel

**Verifier le Dual-Channel :**
1. Ouvrez le **Gestionnaire des taches** > **Performance** > **Memoire**
2. Cherchez "Emplacements utilises : 2 sur 4" ou similaire
3. Ou utilisez CPU-Z et verifiez l'onglet Memoire pour "Dual" channel

### Surveillance des Temperatures

Des temperatures elevees causent le **thermal throttling**, qui reduit significativement les performances :

**Temperatures Maximales Recommandees :**
| Composant | Securite | Avertissement | Danger |
|-----------|----------|---------------|--------|
| CPU | < 75C | 75-85C | > 85C |
| GPU | < 80C | 80-90C | > 90C |

**Comment Surveiller :**
- Utilisez **MSI Afterburner** pour le GPU
- Utilisez **HWiNFO** ou **Core Temp** pour le CPU
- Verifiez les temperatures pendant le jeu

**Si les temperatures sont trop elevees :**
1. Nettoyez la poussiere des ventilateurs et dissipateurs
2. Ameliorez le flux d'air du boitier
3. Remplacez la pate thermique (avance)
4. Envisagez de meilleures solutions de refroidissement

---

## Presets de Performance par Configuration

### PC Budget (GTX 1050 / RX 560 / 8 Go RAM)

**Objectif :** 60 FPS en 1080p

| Parametre | Valeur |
|-----------|--------|
| Distance de Vue | 6 chunks |
| Qualite des Ombres | Desactive |
| Occlusion Ambiante | Desactive |
| Anti-Aliasing | Desactive |
| Effets de Particules | Reduit |
| Echelle de Rendu | 100% |
| Qualite des Textures | Moyen |

**Conseils Supplementaires :**
- Allouez 4 Go de RAM a Hytale
- Fermez toutes les applications en arriere-plan
- Envisagez le 720p si les performances sont toujours insuffisantes

### PC Milieu de Gamme (RTX 3060 / RX 6600 / 16 Go RAM)

**Objectif :** 60+ FPS en 1080p Parametres Eleves

| Parametre | Valeur |
|-----------|--------|
| Distance de Vue | 10 chunks |
| Qualite des Ombres | Moyen |
| Occlusion Ambiante | Active |
| Anti-Aliasing | FXAA |
| Effets de Particules | Complet |
| Echelle de Rendu | 100% |
| Qualite des Textures | Eleve |

**Conseils Supplementaires :**
- Allouez 8 Go de RAM a Hytale
- Activez le Mode Jeu
- Gardez les overlays desactives pour une meilleure stabilite

### PC Haut de Gamme (RTX 4070+ / RX 7800 XT+ / 32 Go RAM)

**Objectif :** 60+ FPS en 1440p Parametres Ultra

| Parametre | Valeur |
|-----------|--------|
| Distance de Vue | 16 chunks |
| Qualite des Ombres | Eleve |
| Occlusion Ambiante | Active |
| Anti-Aliasing | TAA |
| Effets de Particules | Complet |
| Echelle de Rendu | 100-150% |
| Qualite des Textures | Eleve |

**Conseils Supplementaires :**
- Allouez 12-16 Go de RAM a Hytale
- Activez tous les effets visuels
- Envisagez le 4K avec une distance de vue ajustee

---

## Optimisation pour le Streaming et l'Enregistrement

### Parametres OBS Recommandes

Si vous streamez ou enregistrez vos parties de Hytale, utilisez ces parametres optimises :

#### Pour les GPU NVIDIA (NVENC)

| Parametre | Valeur |
|-----------|--------|
| Encodeur | NVIDIA NVENC H.264 |
| Controle du Debit | CBR |
| Debit | 6000-8000 Kbps (streaming) / 20000+ Kbps (enregistrement) |
| Preset | Quality |
| Profil | High |

#### Pour les GPU AMD (AMF)

| Parametre | Valeur |
|-----------|--------|
| Encodeur | AMD HW H.264 (AVC) |
| Controle du Debit | CBR |
| Debit | 6000-8000 Kbps (streaming) / 20000+ Kbps (enregistrement) |
| Preset | Quality |

#### Pour le CPU (x264)

| Parametre | Valeur |
|-----------|--------|
| Encodeur | x264 |
| Controle du Debit | CBR |
| Debit | 6000 Kbps |
| Preset | veryfast (streaming) / medium (enregistrement) |

### Encodage GPU vs CPU

| Encodeur | Avantages | Inconvenients | Ideal Pour |
|----------|-----------|---------------|------------|
| GPU (NVENC/AMF) | Impact minimal sur les performances, qualite constante | Fichiers legerement plus gros | Streaming, la plupart des utilisateurs |
| CPU (x264) | Meilleure qualite a debits plus faibles | Utilisation CPU elevee, impacte les performances du jeu | CPUs haut de gamme, enregistrement hors-ligne |

:::tip Recommandation Streaming
Utilisez l'**encodage GPU** (NVENC ou AMF) pour Hytale. Comme Hytale est gourmand en CPU, utiliser l'encodage CPU impactera significativement vos FPS.
:::

### Parametres en Jeu Pendant le Streaming

Lors du streaming, reduisez legerement ces parametres :
- **Distance de Vue** : Reduisez de 2-4 chunks
- **Qualite des Ombres** : Descendez d'un niveau
- **Effets de Particules** : Mettez sur Reduit

---

## Problemes Courants et Solutions

### Probleme : Saccades / Micro-Freezes

**Causes Possibles et Solutions :**

1. **Navigateur Web en Cours d'Execution**
   - Fermez Chrome/Firefox/Edge
   - Les navigateurs peuvent facilement utiliser 2-4 Go de RAM

2. **Allocation RAM Insuffisante**
   - Augmentez la RAM allouee a Hytale
   - Fermez les applications en arriere-plan

3. **Pauses du Garbage Collection**
   - Utilisez des arguments JVM optimises
   - N'allouez pas trop de RAM (cause des pauses GC plus longues)

4. **Stockage sur HDD**
   - Deplacez Hytale sur un SSD
   - Critique pour le chargement des chunks

### Probleme : Baisses de FPS en Exploration

**Solutions :**
1. **Reduisez la Distance de Vue** - La solution la plus efficace
2. **Activez le pre-chargement des chunks** si disponible
3. **Verifiez l'espace SSD** - Un stockage faible peut causer des problemes
4. **Baissez la qualite des ombres** - Les ombres sont recalculees dans les nouvelles zones

### Probleme : FPS Faibles dans les Constructions Complexes

**Solutions :**
1. **Reduisez les effets de particules**
2. **Baissez l'occlusion ambiante**
3. **Diminuez temporairement la distance de vue**
4. **Verifiez les limites d'entites** - Trop d'objets/entites causent du lag

### Probleme : Lag en Multijoueur (Pas les FPS)

:::warning Ce N'est Generalement Pas Lie aux FPS
Si votre compteur FPS affiche de bons chiffres mais que le jeu semble laguer, le probleme est probablement **lie au reseau**, pas aux performances.
:::

**Solutions Reseau :**
1. Utilisez une **connexion filaire** au lieu du WiFi
2. Verifiez votre **ping** au serveur
3. Choisissez des serveurs **plus proches de votre localisation**
4. Fermez les applications gourmandes en bande passante (streaming, telechargements)

---

## Benchmarker Vos Performances

### Comment Verifier Vos FPS

1. **Compteur FPS en Jeu**
   - Verifiez Parametres > Affichage pour le compteur FPS integre
   - Generalement active avec F3 ou une touche de debug similaire

2. **FPS via l'Overlay Steam**
   - Steam > Parametres > En jeu
   - Activez le compteur FPS
   - Choisissez la position du coin

3. **MSI Afterburner**
   - Telechargez et installez MSI Afterburner
   - Activez l'OSD (On-Screen Display)
   - Affiche FPS, utilisation GPU/CPU, temperatures

### Ce Qu'il Faut Observer

| Metrique | Bon | Acceptable | Probleme |
|----------|-----|------------|----------|
| FPS Moyen | 60+ | 45-60 | < 45 |
| 1% Low FPS | 40+ | 30-40 | < 30 |
| Frame Time | < 16ms | 16-22ms | > 22ms |
| Utilisation CPU | < 80% | 80-95% | 100% |
| Utilisation GPU | 90-100% | 70-90% | < 70% |

**Comprendre les Resultats :**
- **CPU eleve, GPU bas** : Goulot d'etranglement CPU - reduisez distance de vue, entites
- **CPU bas, GPU eleve** : Comportement normal, le GPU est le facteur limitant
- **CPU bas, GPU bas** : Possible probleme de pilote ou V-Sync limitant
- **1% Low bien plus bas que la moyenne** : Probleme de saccades, verifiez les taches en arriere-plan

### Methodologie de Test

Pour des benchmarks precis :

1. **Meme endroit** - Testez dans un lieu constant
2. **Memes conditions** - Heure du jour, meteo, entites a proximite
3. **Plusieurs essais** - Moyennez 3-5 tests pour plus de precision
4. **Redemarrage frais** - Redemarrez le jeu avant de tester
5. **Notez vos parametres** - Documentez ce que vous avez change

---

## Reference Rapide

### Checklist de Priorite Performance

1. [ ] Definir une distance de vue appropriee pour votre RAM
2. [ ] Allouer la bonne quantite de RAM
3. [ ] Installer le jeu sur un SSD
4. [ ] Mettre a jour les pilotes GPU
5. [ ] Desactiver les overlays inutiles
6. [ ] Fermer les applications en arriere-plan
7. [ ] Activer le Mode Jeu Windows
8. [ ] Surveiller les temperatures

### Corrections Rapides pour Booster les FPS

Si vous avez besoin d'une amelioration immediate des FPS :

1. **Distance de Vue** : 6 chunks (impact le plus important)
2. **Ombres** : Desactive
3. **Anti-Aliasing** : Desactive
4. **Fermez Chrome** et autres navigateurs
5. **Redemarrez le jeu** (vide la memoire)

---

## Voir Aussi

- [Guide du Debutant](/docs/guides/guide-debutant)
- [Controles](/docs/gameplay/getting-started/controls)
- [Configuration Requise](/docs/gameplay/getting-started/interface)

---

*Des parametres optimises signifient plus de temps a profiter de Hytale et moins de temps a depanner. Bon jeu !*
