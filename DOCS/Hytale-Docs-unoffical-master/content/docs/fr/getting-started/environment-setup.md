---
id: environment-setup
title: Configuration de l'environnement
sidebar_label: Configuration de l'environnement
sidebar_position: 3
description: Configurez votre environnement de developpement pour Hytale
---

# Configuration de l'environnement

Ce guide vous accompagne dans la configuration de votre environnement de developpement.

## Configuration rapide

### 1. Installer Blockbench

```bash
# Telechargez depuis blockbench.net ou utilisez un gestionnaire de paquets
winget install JannisX11.Blockbench
```

### 2. Installer le plugin Hytale

1. Ouvrez Blockbench
2. Allez dans **File > Plugins**
3. Recherchez "Hytale"
4. Cliquez sur **Install**

### 3. Configurer un serveur local (Optionnel)

Pour les tests, lancez un serveur Hytale local :

```bash
# Creer le repertoire du serveur
mkdir hytale-dev-server
cd hytale-dev-server

# Telecharger et demarrer le serveur
java -Xms2G -Xmx4G -jar hytale-server.jar
```

## Configuration de l'IDE pour le developpement de plugins

### IntelliJ IDEA

1. Telechargez [IntelliJ IDEA](https://www.jetbrains.com/idea/)
2. Installez le SDK Java 25+
3. Creez un nouveau projet Gradle
4. Ajoutez la dependance Hytale API (bientot disponible)

### VS Code

Pour l'edition JSON et le developpement general :

```bash
# Installer les extensions recommandees
code --install-extension redhat.java
code --install-extension vscjava.vscode-java-pack
```

## Structure du projet

Structure de dossiers recommandee pour les mods :

```
my-hytale-mod/
├── src/
│   └── main/
│       ├── java/           # Code du plugin
│       └── resources/      # Assets
├── packs/
│   ├── blocks/            # Definitions de blocs
│   ├── items/             # Definitions d'objets
│   └── npcs/              # Definitions de PNJ
├── models/                # Modeles Blockbench
└── textures/              # Textures PNG
```

## Prochaines etapes

Votre environnement est pret ! Continuez vers :

- [Votre premier mod](/docs/getting-started/first-mod)
