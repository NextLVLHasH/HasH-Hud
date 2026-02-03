---
id: docker
title: Déploiement Docker
sidebar_label: Docker
sidebar_position: 2
---

# Déploiement Docker

Exécutez le serveur dans Docker.

## docker-compose.yml

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

## Utilisation

```bash
docker-compose up -d
```
