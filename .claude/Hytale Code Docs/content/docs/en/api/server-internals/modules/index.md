---
id: modules
title: Server Modules
sidebar_label: Modules
sidebar_position: 2
description: Documentation of the Hytale server's internal modules system
---

# Server Modules

Hytale's server is built on a modular architecture. Each module handles a specific domain of game functionality and can be accessed through the plugin API.

## Available Modules

| Module | Description |
|--------|-------------|
| [Entity Stats](/docs/api/server-internals/modules/entity-stats) | Health, mana, and custom stat management |
| [Access Control](/docs/api/server-internals/modules/access-control) | Permissions and access restrictions |
| [Damage System](/docs/api/server-internals/modules/damage-system) | Combat damage calculation and processing |
| [Interactions](/docs/api/server-internals/modules/interactions) | Entity and block interaction handling |
| [Time System](/docs/api/server-internals/modules/time-system) | Day/night cycle and time management |
| [Projectiles](/docs/api/server-internals/modules/projectiles) | Projectile physics and behavior |
| [Block Health](/docs/api/server-internals/modules/block-health) | Block damage and destruction |
| [Collision System](/docs/api/server-internals/modules/collision-system) | Physics and collision detection |
| [Stamina System](/docs/api/server-internals/modules/stamina-system) | Player stamina and exhaustion |
| [Prefab System](/docs/api/server-internals/modules/prefab-system) | Structure spawning and management |
| [Entity UI](/docs/api/server-internals/modules/entity-ui) | In-world UI elements (health bars, names) |
| [Effects System](/docs/api/server-internals/modules/effects-system) | Status effects and buffs/debuffs |
| [Audio System](/docs/api/server-internals/modules/audio-system) | Sound and music management |
| [Entity Spawning](/docs/api/server-internals/modules/entity-spawning) | Mob spawning rules and systems |
| [Crafting System](/docs/api/server-internals/modules/crafting-system) | Crafting recipes and workbenches |
| [NPC System](/docs/api/server-internals/modules/npc-system) | NPC behavior and AI |

## Module Architecture

Each module follows a consistent pattern:

```java
public interface Module {
    // Get the module's component type for ECS access
    ComponentType<?> getComponentType();

    // Module initialization
    void onEnable();
    void onDisable();
}
```

## Accessing Modules

Modules are accessed through the `Server` instance:

```java
@Override
public void onEnable(PluginContext context) {
    Server server = context.getServer();

    // Access the damage module
    DamageModule damageModule = server.getModule(DamageModule.class);

    // Access the time module
    TimeModule timeModule = server.getModule(TimeModule.class);
}
```
