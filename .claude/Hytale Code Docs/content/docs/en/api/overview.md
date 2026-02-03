---
id: overview
title: API Reference Overview
sidebar_label: Overview
sidebar_position: 1
description: Hytale API documentation for developers
---

# API Reference Overview

This section documents the Hytale APIs available for developers.

## Server Internal Documentation

:::tip New - v2 Documentation
Version 2 of the server internal documentation is now available, featuring multi-agent verified documentation for improved accuracy and completeness.
:::

The documentation covers the internal systems of the Hytale server:

| Section | Description |
|---------|-------------|
| [**Plugin System**](/docs/api/server-internals/plugins) | Architecture, lifecycle, PluginManager |
| [**Event System**](/docs/api/server-internals/events) | EventBus, priorities, cancellable events |
| [**Command System**](/docs/api/server-internals/commands) | CommandManager, creating commands |
| [**ECS System**](/docs/api/server-internals/ecs) | Complete Entity Component System |
| [**Data Types**](/docs/api/server-internals/types) | BlockType, Items, EntityEffect |
| [**Network Packets**](/docs/api/server-internals/packets) | 200+ documented packets |

[Explore the internal documentation →](/docs/api/server-internals)

---

## Official Hytale API

The official Hytale API provides endpoints for accessing public game data.

### Base URL

```
https://hytale.com/api
```

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/blog/post/published` | GET | List published blog posts |
| `/blog/post/slug/:slug` | GET | Get post by slug |
| `/jobs` | GET | List job openings |

[Full Endpoint Reference →](/docs/api/official/endpoints)

## Community SDKs

- [Node.js SDK](/docs/api/sdks/javascript)
- [PHP SDK](/docs/api/sdks/php)

## Getting Started

Explore the server internal documentation to start developing Hytale plugins.
