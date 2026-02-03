---
id: installation
title: Installation du Serveur
sidebar_label: Installation
sidebar_position: 2
---

# Installation du Serveur

Guide complet pour installer votre serveur Hytale.

## Telecharger les Fichiers

Le serveur necessite deux fichiers pour fonctionner :
- `HytaleServer.jar` - L'executable principal du serveur
- `Assets.zip` - Les assets du jeu (textures, modeles, sons)

### Option A : Telechargement CDN (Recommande)

Telechargez directement depuis le CDN officiel :

```bash
# Telecharger le JAR du serveur
curl -L -o HytaleServer.jar https://cdn.hytale.com/HytaleServer.jar

# Telecharger les assets
curl -L -o Assets.zip https://cdn.hytale.com/Assets.zip
```

### Option B : Depuis le Launcher

Copiez depuis votre installation du launcher Hytale :

| Systeme | Chemin |
|---------|--------|
| **Windows** | `%appdata%\Hytale\install\release\package\game\latest` |
| **Linux** | `$XDG_DATA_HOME/Hytale/install/release/package/game/latest` |
| **macOS** | `~/Application Support/Hytale/install/release/package/game/latest` |

## Installer Java 25

Hytale necessite **Java 25** (OpenJDK Temurin recommande).

### Ubuntu/Debian

```bash
# Ajouter le depot Adoptium
sudo apt update
sudo apt install wget apt-transport-https gpg
wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo gpg --dearmor -o /etc/apt/keyrings/adoptium.gpg
echo "deb [signed-by=/etc/apt/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/adoptium.list

# Installer Java 25
sudo apt update
sudo apt install temurin-25-jdk

# Verifier
java -version
# Devrait afficher : openjdk 25.0.x
```

### Windows

Telechargez et installez depuis [Adoptium](https://adoptium.net/temurin/releases/?version=25).

:::tip OpenJDK vs Oracle
Nous recommandons **Eclipse Temurin** (OpenJDK) plutot qu'Oracle JDK. C'est gratuit, performant de maniere identique, et inclut toutes les options GC (notamment Shenandoah qui n'est pas disponible dans Oracle JDK).
:::

## Demarrage Rapide

```bash
# Creer le repertoire
mkdir hytale-server
cd hytale-server

# Telecharger les fichiers
curl -L -o HytaleServer.jar https://cdn.hytale.com/HytaleServer.jar
curl -L -o Assets.zip https://cdn.hytale.com/Assets.zip

# Demarrer le serveur (minimal)
java -Xms4G -Xmx4G -jar HytaleServer.jar --assets Assets.zip -b 0.0.0.0:5520
```

## Arguments de Ligne de Commande

| Argument | Description | Exemple |
|----------|-------------|---------|
| `--assets <chemin>` | **Requis.** Chemin vers Assets.zip | `--assets Assets.zip` |
| `-b <adresse:port>` | Adresse et port de liaison | `-b 0.0.0.0:5520` |
| `--auth-mode <mode>` | Mode d'authentification | `--auth-mode authenticated` |
| `--backup` | Activer les sauvegardes automatiques | `--backup` |
| `--backup-dir <chemin>` | Repertoire de sauvegarde | `--backup-dir backups` |
| `--backup-frequency <min>` | Intervalle de sauvegarde en minutes | `--backup-frequency 30` |
| `--allow-op` | Activer les commandes operateur | `--allow-op` |
| `--accept-early-plugins` | Autoriser les plugins experimentaux | `--accept-early-plugins` |

### Modes d'Authentification

| Mode | Description |
|------|-------------|
| `authenticated` | Les joueurs doivent avoir un compte Hytale valide (defaut) |
| `offline` | Permet les joueurs sans compte Hytale (LAN, tests) |

## Structure des Repertoires

Apres le premier lancement, votre repertoire ressemblera a :

```
hytale-server/
├── HytaleServer.jar      # Executable principal
├── Assets.zip            # Assets du jeu (requis)
├── server.log            # Fichier de log
├── config/
│   ├── server.properties # Configuration principale
│   ├── networking.json   # Parametres reseau (QUIC)
│   └── gameplay.json     # Parametres de jeu
├── worlds/
│   └── Orbis/            # Monde par defaut
│       ├── region/       # Donnees des chunks
│       ├── playerdata/   # Donnees des joueurs
│       └── level.dat     # Metadonnees du monde
├── plugins/              # Plugins serveur
├── mods/                 # Mods serveur
├── logs/                 # Fichiers de log
└── backups/              # Sauvegardes automatiques (si active)
```

## Scripts de Demarrage Recommandes

### Linux (start.sh)

```bash
#!/bin/bash

# Configuration memoire
MEMORY_MIN="8G"
MEMORY_MAX="8G"

# Arguments JVM pour Java 25 (G1GC optimise - recommande pour 4-12GB)
java -Xms${MEMORY_MIN} -Xmx${MEMORY_MAX} \
    -XX:+UseG1GC \
    -XX:+ParallelRefProcEnabled \
    -XX:MaxGCPauseMillis=200 \
    -XX:+DisableExplicitGC \
    -XX:+AlwaysPreTouch \
    -XX:G1NewSizePercent=30 \
    -XX:G1MaxNewSizePercent=40 \
    -XX:G1HeapRegionSize=8M \
    -XX:G1ReservePercent=20 \
    -XX:InitiatingHeapOccupancyPercent=15 \
    -XX:SurvivorRatio=32 \
    -XX:+PerfDisableSharedMem \
    -XX:MaxTenuringThreshold=1 \
    -XX:+UseCompactObjectHeaders \
    -Djava.net.preferIPv4Stack=true \
    -Dfile.encoding=UTF-8 \
    -jar HytaleServer.jar \
    --assets Assets.zip \
    -b 0.0.0.0:5520 \
    --auth-mode authenticated \
    --allow-op
```

### Windows (start.bat)

```batch
@echo off
java -Xms8G -Xmx8G ^
    -XX:+UseG1GC ^
    -XX:+ParallelRefProcEnabled ^
    -XX:MaxGCPauseMillis=200 ^
    -XX:+DisableExplicitGC ^
    -XX:+AlwaysPreTouch ^
    -XX:+UseCompactObjectHeaders ^
    -Djava.net.preferIPv4Stack=true ^
    -jar HytaleServer.jar ^
    --assets Assets.zip ^
    -b 0.0.0.0:5520 ^
    --auth-mode authenticated ^
    --allow-op
pause
```

## Configuration du Pare-feu

Hytale utilise le **port UDP 5520** (protocole QUIC). Assurez-vous d'ouvrir l'UDP, pas le TCP !

### Linux (ufw)

```bash
sudo ufw allow 5520/udp
sudo ufw reload
```

### Linux (iptables)

```bash
sudo iptables -A INPUT -p udp --dport 5520 -j ACCEPT
```

### Windows PowerShell

```powershell
New-NetFirewallRule -DisplayName "Hytale Server" -Direction Inbound -Protocol UDP -LocalPort 5520 -Action Allow
```

## Premier Lancement

Au premier demarrage, le serveur va :

1. Valider Assets.zip
2. Generer les fichiers de configuration dans `config/`
3. Creer le monde par defaut (Orbis)
4. Ecouter sur le port 5520/UDP (QUIC)

:::tip Rechargement a Chaud
Hytale supporte le **rechargement a chaud** - quand vous modifiez des scripts ou fichiers de config, ils se rechargent automatiquement sans redemarrer le serveur !
:::

## Depannage

### "Assets.zip not found"
Assurez-vous qu'Assets.zip est dans le meme repertoire que HytaleServer.jar, ou specifiez le chemin avec `--assets /chemin/vers/Assets.zip`.

### "Port already in use"
Une autre application utilise le port 5520. Arretez cette application ou utilisez un port different avec `-b 0.0.0.0:5521`.

### "Java version not supported"
Hytale necessite Java 25. Verifiez votre version avec `java -version` et installez Temurin 25 si necessaire.

## Prochaines Etapes

- [Configurer votre serveur](/docs/fr/servers/setup/configuration) - Presets JVM et optimisation des performances
- [Configurer l'hebergement Docker](/docs/fr/servers/hosting/docker)
- [Configurer les permissions](/docs/fr/servers/administration/permissions)
