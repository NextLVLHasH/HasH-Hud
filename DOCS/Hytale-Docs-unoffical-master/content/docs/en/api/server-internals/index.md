---
id: server-internals
title: Hytale Server Internal Documentation
sidebar_label: Server Internals
sidebar_position: 10
description: Technical v2 documentation of the Hytale server - Architecture, API, Packets and Internal Systems
---

# Hytale Server Internal Documentation

<div className="version-badge">
  <span className="badge badge--warning">Version 2.0 - Experimental Documentation</span>
</div>

:::warning Documentation Accuracy Notice
This documentation is based on **decompiled source code** and may contain errors or inaccuracies. While we verify against the actual code, some information may be incomplete, outdated, or incorrectly interpreted. **Always test your implementations** and don't rely solely on this documentation. Found an error? [Report it on GitHub](https://github.com/timiliris/Hytale-Docs/issues) to help improve the quality!
:::

:::info Documentation v2 - Multi-Agent Verified

This documentation was generated using a multi-agent analysis system that:

- Extracts data directly from decompiled server source code
- Verifies all findings with source file references and line numbers
- Includes real code snippets from the actual codebase
- Uses anti-hallucination measures to prevent Minecraft/Bukkit pattern confusion

:::

## What is This Documentation?

This documentation reveals how the Hytale server works **under the hood**. While the official Hytale modding tools provide a user-friendly interface for creating content, understanding the server's internal systems gives you the power to create more sophisticated and performant modifications.

## What's New in v2

- **Accurate Event System**: 50+ events documented with real interfaces (IEvent, IAsyncEvent, ICancellable)
- **Complete Command System**: AbstractCommand hierarchy, argument types, registration methods
- **Network Protocol**: QUIC/UDP protocol, 268 packets, connection flow documentation
- **Plugin API**: Accurate lifecycle methods (preLoad, setup, start, shutdown), registries
- **Source References**: Every class and method includes source file paths and line numbers
- **Code Examples**: Real code from BlockTickPlugin, BlockSpawnerPlugin, and other builtin plugins

### Who is This For?

- **Plugin developers** who want to extend Hytale beyond what's possible with visual tools
- **Mod creators** who need fine-grained control over game mechanics
- **Technical enthusiasts** curious about how a modern game server is architected
- **Content creators** who want to understand the "why" behind game behaviors

### Why Learn Server Internals?

Think of the Hytale server as a car engine. You can drive a car without knowing how the engine works, but a mechanic who understands the engine can:
- Diagnose problems faster
- Optimize performance
- Add custom modifications
- Push the limits of what's possible

Similarly, understanding server internals allows you to:
- **Debug issues** by tracing exactly what happens when a player places a block or takes damage
- **Optimize performance** by knowing which systems are expensive and how to minimize their impact
- **Create unique gameplay** by hooking into systems that aren't exposed through normal APIs
- **Avoid common pitfalls** by understanding why certain patterns work and others don't

## About This Documentation

This section documents the **internal mechanisms** of the Hytale server, intended for advanced plugin developers who want to understand the server's inner workings.

### Sources

- Decompiled Hytale server source code (Early Access version)
- Automated analysis with manual verification
- Main package: `com.hypixel.hytale`

---

## Server Architecture

The Hytale server is built on a modular architecture based on:

| Component | Description |
|-----------|-------------|
| **ECS (Entity Component System)** | High-performance entity management system |
| **EventBus** | Synchronous and asynchronous event bus |
| **PluginManager** | Plugin manager with complete lifecycle |
| **QUIC Protocol** | Network communication via Netty + QUIC (port 5520) |

---

## Documentation Sections

### Plugin System

Everything you need to create Java plugins for Hytale.

| Guide | Description |
|-------|-------------|
| [**Plugin System**](./plugins) | Architecture, lifecycle, PluginManager |
| [**Event System**](./events) | EventBus, priorities, cancellable events |
| [**Command System**](./commands) | CommandManager, creating commands |

### Internal Architecture

Deep understanding of the server's internal systems.

| Guide | Description |
|-------|-------------|
| [**ECS System**](./ecs) | Entity Component System, Components, Queries |
| [**Data Types**](./types) | BlockType, Items, EntityEffect, enums |
| [**Network Packets**](./packets) | Protocol, 200+ documented packets |

---

## Documentation Statistics

| Metric | Value |
|--------|-------|
| Java files analyzed | 5,218 |
| Packets documented | 200+ |
| Commands documented | 50+ |
| Events documented | 30+ |
| ECS Components | 20+ |

---

## Technical Information

### Default Port

```
5520 (UDP - QUIC)
```

### Main Package

```
com.hypixel.hytale
```

### Main Class

```java
com.hypixel.hytale.server.core.HytaleServer
```

---

## Getting Started

<div className="doc-card-grid">
  <div className="doc-card">
    <h3>Create a Plugin</h3>
    <p>Learn how to create your first Java plugin for Hytale.</p>
    <a href="./plugins">View documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Listen to Events</h3>
    <p>React to player and server actions.</p>
    <a href="./events">View documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Create Commands</h3>
    <p>Add custom commands to your server.</p>
    <a href="./commands">View documentation →</a>
  </div>
  <div className="doc-card">
    <h3>Understand ECS</h3>
    <p>Master the component system for entities.</p>
    <a href="./ecs">View documentation →</a>
  </div>
</div>

---

## Contributing

This documentation is open source. If you find errors or want to improve the content:

- Open an issue on GitHub
- Submit a pull request
- Join the community Discord

---

:::info Code Verification
This documentation has been verified against the decompiled source code. See the [verification report](/docs/api/server-internals/verification) for details.
:::
