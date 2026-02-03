---
id: configuration
title: Configuration du Serveur
sidebar_label: Configuration
sidebar_position: 3
description: Guide complet pour configurer votre serveur Hytale avec les presets JVM Java 25
---

# Configuration du Serveur

Ce guide couvre toutes les options de configuration pour votre serveur Hytale, incluant les presets JVM optimises pour Java 25.

## server.properties

Le fichier de configuration principal de votre serveur.

```properties
# Identite du serveur
server-name=Mon Serveur Hytale

# Parametres reseau
port=5520

# Parametres joueurs
max-players=50

# Parametres monde
view-distance=12
```

## Configuration Reseau

### Details du Protocole

| Parametre | Valeur |
|-----------|--------|
| Protocole | **QUIC** |
| Port | **UDP 5520** |
| TCP Requis | Non |

:::info Protocole QUIC
Hytale utilise le protocole QUIC qui fonctionne entierement sur UDP. Vous n'avez qu'a ouvrir le port UDP 5520 - aucune redirection TCP n'est requise.
:::

## Parametres Cles

| Parametre | Description | Defaut | Notes |
|-----------|-------------|--------|-------|
| `server-name` | Nom affiche dans la liste des serveurs | My Server | |
| `port` | Port reseau (UDP) | 5520 | Protocole QUIC |
| `max-players` | Joueurs simultanes maximum | 50 | Ajuster selon le materiel |
| `view-distance` | Distance de rendu en chunks | 10 | Max recommande : 12 |

## Distance de Vue

La distance de vue impacte significativement les performances du serveur.

| Distance de Vue | Blocs | Impact Performance |
|-----------------|-------|-------------------|
| 6 chunks | 192 blocs | Faible |
| 10 chunks | 320 blocs | Moyen |
| **12 chunks** | **384 blocs** | **Max recommande** |

:::warning Impact sur les Performances
Doubler la distance de vue quadruple les donnees que le serveur doit gerer. Pour les serveurs avec beaucoup de joueurs, gardez la distance de vue a 12 ou moins.
:::

## Configuration JVM Java 25

Java 25 introduit des ameliorations de performance significatives. Choisissez le preset qui correspond a la RAM de votre serveur.

### Apercu des Presets JVM

| Preset | RAM Recommandee | Pauses GC | Ideal Pour |
|--------|-----------------|-----------|------------|
| **ZGC Haute Performance** | 16GB+ | Sub-milliseconde | Grands serveurs, latence critique |
| **Shenandoah Equilibre** | 8-16GB | 1-10ms | Serveurs moyens, bon equilibre |
| **G1GC Optimise** | 4-12GB | 50-200ms | La plupart des serveurs, flags style Aikar |
| **G1GC Minimal** | 2-4GB | Variable | Petits serveurs, tests |

### Preset 1 : ZGC Haute Performance (16GB+ RAM)

Ideal pour les serveurs puissants ou la latence est critique. ZGC offre des pauses GC sub-milliseconde.

```bash
java -Xms16G -Xmx16G \
    -XX:+UseZGC \
    -XX:+AlwaysPreTouch \
    -XX:+DisableExplicitGC \
    -XX:+PerfDisableSharedMem \
    -XX:+UseDynamicNumberOfGCThreads \
    -XX:+UseCompactObjectHeaders \
    -XX:SoftMaxHeapSize=12G \
    -XX:ReservedCodeCacheSize=512m \
    -XX:+UseCodeCacheFlushing \
    -Djava.net.preferIPv4Stack=true \
    -Dfile.encoding=UTF-8 \
    -jar HytaleServer.jar \
    --assets Assets.zip \
    -b 0.0.0.0:5520
```

:::tip SoftMaxHeapSize
Definissez `SoftMaxHeapSize` a environ **80% de votre valeur -Xmx**. Pour 16GB de heap max, utilisez 12G. Pour 32GB, utilisez 25G.
:::

### Preset 2 : Shenandoah Equilibre (8-16GB RAM)

Bon equilibre entre faible latence et debit. Necessite OpenJDK/Temurin (non disponible dans Oracle JDK).

```bash
java -Xms8G -Xmx8G \
    -XX:+UseShenandoahGC \
    -XX:ShenandoahGCMode=generational \
    -XX:+AlwaysPreTouch \
    -XX:+DisableExplicitGC \
    -XX:+PerfDisableSharedMem \
    -XX:+UseCompactObjectHeaders \
    -XX:ReservedCodeCacheSize=256m \
    -Djava.net.preferIPv4Stack=true \
    -Dfile.encoding=UTF-8 \
    -jar HytaleServer.jar \
    --assets Assets.zip \
    -b 0.0.0.0:5520
```

:::info Fonctionnalite Java 25
`ShenandoahGCMode=generational` est maintenant stable en production dans Java 25 (etait experimental dans les versions precedentes).
:::

### Preset 3 : G1GC Optimise (4-12GB RAM)

Flags style Aikar optimises pour les serveurs de jeu. Fonctionne avec n'importe quel JDK. Recommande pour la plupart des serveurs.

```bash
java -Xms8G -Xmx8G \
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
    -b 0.0.0.0:5520
```

### Preset 4 : G1GC Minimal (2-4GB RAM)

Configuration legere pour les petits serveurs ou environnements de test.

```bash
java -Xms4G -Xmx4G \
    -XX:+UseG1GC \
    -XX:+DisableExplicitGC \
    -XX:MaxGCPauseMillis=200 \
    -Djava.net.preferIPv4Stack=true \
    -Dfile.encoding=UTF-8 \
    -jar HytaleServer.jar \
    --assets Assets.zip \
    -b 0.0.0.0:5520
```

## Arguments JVM Expliques

### Ramasse-miettes (Garbage Collectors)

| Argument | Description |
|----------|-------------|
| `-XX:+UseZGC` | ZGC - GC ultra-faible latence (pauses sub-ms) |
| `-XX:+UseShenandoahGC` | Shenandoah - GC faible pause (pauses 1-10ms) |
| `-XX:+UseG1GC` | G1GC - GC equilibre (defaut depuis Java 9) |

### Memoire & Performance

| Argument | Description |
|----------|-------------|
| `-Xms` / `-Xmx` | Taille min/max du heap (mettre egal pour eviter le redimensionnement) |
| `-XX:+AlwaysPreTouch` | Pre-alloue la memoire au demarrage (reduit la latence runtime) |
| `-XX:+DisableExplicitGC` | Ignore les appels `System.gc()` (previent les pics de lag) |
| `-XX:+PerfDisableSharedMem` | Desactive la memoire partagee des compteurs perf |

### Specifique Java 25

| Argument | Description |
|----------|-------------|
| `-XX:+UseCompactObjectHeaders` | **Nouveau en Java 25.** Reduit la taille des headers d'objets de 96-128 bits a 64 bits, economisant ~4 octets par objet. |
| `-XX:ShenandoahGCMode=generational` | **Stable en Java 25.** Mode generationnel pour Shenandoah (meilleur debit). |

### Reglage G1GC (style Aikar)

| Argument | Description |
|----------|-------------|
| `-XX:G1NewSizePercent=30` | Taille minimale de la jeune generation (30% du heap) |
| `-XX:G1MaxNewSizePercent=40` | Taille maximale de la jeune generation (40% du heap) |
| `-XX:G1HeapRegionSize=8M` | Taille des regions G1 pour grands heaps |
| `-XX:G1ReservePercent=20` | Reserve 20% du heap pour l'evacuation |
| `-XX:InitiatingHeapOccupancyPercent=15` | Demarre le GC concurrent a 15% d'utilisation du heap |
| `-XX:MaxGCPauseMillis=200` | Temps de pause GC maximum cible |

## Guide d'Allocation Memoire

| Joueurs | RAM Min | Recommandee | Preset |
|---------|---------|-------------|--------|
| 1-10 | 4GB | 4GB | G1GC Minimal |
| 10-25 | 6GB | 8GB | G1GC Optimise |
| 25-50 | 8GB | 12GB | Shenandoah Equilibre |
| 50-100 | 12GB | 16GB | ZGC Haute Performance |
| 100+ | 16GB | 32GB+ | ZGC Haute Performance |

:::warning Conseils Memoire
- Toujours mettre `-Xms` egal a `-Xmx` pour eviter le redimensionnement du heap
- Laissez 1-2GB pour l'OS (n'allouez pas toute la RAM systeme)
- Plus de RAM n'est pas toujours mieux - ajustez d'abord la distance de vue
:::

## Flags JVM Deprecies/Supprimes

Ces flags ne doivent **PAS** etre utilises avec Java 25 :

| Flag | Statut | Notes |
|------|--------|-------|
| `-XX:+UseConcMarkSweepGC` | **Supprime** | Utilisez G1GC, ZGC ou Shenandoah |
| `-XX:+UnlockExperimentalVMOptions` | Non necessaire pour Shenandoah | Etait requis avant Java 25 |
| `-XX:+ZGenerational` | Non necessaire | Defaut depuis Java 23+ |
| `-Xverify:none` / `-noverify` | **Deprecie** | Ne pas utiliser |
| `-XX:+UseCompressedClassPointers` | **Deprecie** | Sera supprime en Java 27 |

## Configuration du Pare-feu

### Linux (UFW)

```bash
sudo ufw allow 5520/udp
```

### Linux (iptables)

```bash
sudo iptables -A INPUT -p udp --dport 5520 -j ACCEPT
```

### Pare-feu Windows

```powershell
New-NetFirewallRule -DisplayName "Hytale Server" -Direction Inbound -Protocol UDP -LocalPort 5520 -Action Allow
```

## Exemples de Configuration

### Petit Serveur Prive (1-10 joueurs)

```properties
server-name=Mon Serveur Prive
port=5520
max-players=10
view-distance=12
```

```bash
java -Xms4G -Xmx4G -XX:+UseG1GC -XX:+UseCompactObjectHeaders \
    -jar HytaleServer.jar --assets Assets.zip -b 0.0.0.0:5520
```

### Serveur Communautaire Moyen (25-50 joueurs)

```properties
server-name=Serveur Communautaire
port=5520
max-players=50
view-distance=10
```

```bash
java -Xms8G -Xmx8G -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational \
    -XX:+AlwaysPreTouch -XX:+UseCompactObjectHeaders \
    -jar HytaleServer.jar --assets Assets.zip -b 0.0.0.0:5520
```

### Grand Serveur Public (50+ joueurs)

```properties
server-name=Serveur Public
port=5520
max-players=100
view-distance=8
```

```bash
java -Xms16G -Xmx16G -XX:+UseZGC -XX:SoftMaxHeapSize=12G \
    -XX:+AlwaysPreTouch -XX:+UseCompactObjectHeaders \
    -jar HytaleServer.jar --assets Assets.zip -b 0.0.0.0:5520
```
