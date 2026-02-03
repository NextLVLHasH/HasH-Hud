---
id: overview
title: Server Administration Overview
sidebar_label: Overview
sidebar_position: 1
description: Guide to setting up and managing Hytale servers
---

# Server Administration Overview

This section covers everything you need to know about hosting and managing Hytale servers. Running your own servers is supported from Early Access day one ([Source](https://hytale.com/news/2025/11/hytale-modding-strategy-and-status)).

## Architecture

Hytale uses a **server-first architecture** where all game content lives on the server:

- Even single-player runs through a local server
- Clients connect without installing mods
- Server streams all content automatically
- **All mods execute server-side** - no client-side mod installation needed
- **Native routing between servers** - no need for BungeeCord or similar proxies

> "Hypixel Studios chose Java for Hytale servers because their backend team is very comfortable writing high-performance Java, which has let them heavily optimize server code."
> — [Server Technology Overview](https://hytale.com/news/2019/1/an-overview-of-hytales-server-technology)

### Technical Details

| Specification | Value |
|--------------|-------|
| Server Language | Java |
| Client Language | C# |
| Protocol | **QUIC** (UDP-based) |
| Default Port | **UDP 5520** |
| Tick Rate | 30 TPS (default) |
| Java Version | **Java 25** required (Adoptium recommended) |
| Architectures | **x64 and arm64** supported |
| Gradle | 9.2.0 (for plugin development) |

:::info Network Protocol
Hytale uses the QUIC protocol over UDP port 5520. No TCP port forwarding is required.
:::

### Source Code Availability

The server is **not obfuscated**, allowing you to decompile it to understand internal systems. Hypixel Studios plans to release the full server source code **1-2 months after launch** ([Source](https://hytale.com/news/2025/11/hytale-modding-strategy-and-status)).

## System Requirements

### Performance Considerations

**View distance** is the biggest factor in both client and server performance. Doubling view distance (e.g., 192 to 384 blocks) quadruples the amount of data the server must handle.

- **Maximum recommended view distance**: 12 chunks (384 blocks)
- This is equivalent to 24 chunks in Minecraft

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| CPU | High single-thread performance (4.0GHz+) |
| RAM | **4 GB minimum** |
| Storage | 50 GB NVMe SSD |
| Java | **Java 25** (Adoptium recommended) |
| Network | UDP port 5520 open |

### Recommended by Player Count

| Players | RAM | CPU | Notes |
|---------|-----|-----|-------|
| 1-10 | 4 GB | 4.0GHz+ single-thread | Minimum specs sufficient |
| 25-50 | 8-12 GB | High single-thread frequency | Prioritize clock speed over cores |
| 50+ | 16 GB+ | High-performance | Adjust based on monitoring |

:::tip CPU Performance
Hytale servers benefit more from **high single-thread CPU performance** than from many cores. Prioritize clock speed over core count when selecting hardware.
:::

:::tip Storage Performance
World loading and generation depend heavily on disk speed. NVMe SSDs provide the best results and help prevent stutters when players explore new areas. Avoid traditional hard drives.
:::

## Quick Start

1. **Download** the server files from [hytale.com](https://hytale.com)
2. **Configure** your `server.properties` file
3. **Open port** UDP 5520 (QUIC protocol)
4. **Start** the server

```bash
java -Xms4G -Xmx8G -jar hytale-server.jar
```

[Detailed Installation Guide →](/docs/servers/setup/installation)

## Server Configuration

### Core Settings

```properties
# server.properties
server-name=My Hytale Server
port=5520
max-players=50
view-distance=12
```

[Full Configuration Reference →](/docs/servers/setup/configuration)

## Administration

### Key Tasks

- [**Commands**](/docs/servers/administration/commands) - Console and in-game commands
- [**Permissions**](/docs/servers/administration/permissions) - Player permission system
- [**Whitelist**](/docs/servers/administration/whitelist) - Access control

### Security Considerations

- Configure firewall rules (UDP 5520)
- Use whitelist for private servers
- Regular backups
- DDoS protection for public servers

## Modding & Plugins

Servers can run:

- **Java Plugins** (`.jar` files in `/plugins/`)
- **Data Packs** (JSON content in `/mods/`)
- **Art Assets** (models, textures, sounds)

```
/hytale-server/
├── plugins/        # Java plugins
├── mods/           # Content packs
├── config/         # Configuration
├── worlds/         # World data
└── logs/           # Server logs
```

[Plugin Development Guide →](/docs/modding/plugins/overview)

## Hosting Options

| Option | Pros | Cons |
|--------|------|------|
| **Self-Hosted** | Full control, cost-effective | Requires technical knowledge |
| **VPS** | Good balance of control/ease | Monthly cost |
| **Game Hosting** | Easy setup, managed | Less control, higher cost |

[Hosting Guide →](/docs/servers/hosting/self-hosting)

## Deployment with Docker

```yaml
version: '3.8'
services:
  hytale:
    image: hytale-server:latest
    ports:
      - "5520:5520/udp"
    volumes:
      - ./data:/server
    environment:
      - JAVA_OPTS=-Xms4G -Xmx8G
```

[Docker Deployment Guide →](/docs/servers/hosting/docker)

## EULA & Monetization

### Allowed

- Cosmetic purchases
- Donations
- Rank perks (non-gameplay)

### Prohibited

- Pay-to-win mechanics
- Selling gameplay advantages
- Distributing the client

:::warning
Violating the EULA may result in server blacklisting. Always review official guidelines.
:::

## Getting Started

<div className="doc-card-grid">
  <DocCard item={{
    type: 'link',
    label: 'Requirements',
    href: '/docs/servers/setup/requirements',
    description: 'Hardware and software requirements'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Installation',
    href: '/docs/servers/setup/installation',
    description: 'Step-by-step setup guide'
  }} />
  <DocCard item={{
    type: 'link',
    label: 'Configuration',
    href: '/docs/servers/setup/configuration',
    description: 'Configure your server'
  }} />
</div>
