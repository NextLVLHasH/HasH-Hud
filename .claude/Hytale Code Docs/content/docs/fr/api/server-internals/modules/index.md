---
id: modules
title: Modules Serveur
sidebar_label: Modules
sidebar_position: 2
description: Documentation du systeme modulaire du serveur Hytale
---

# Modules Serveur

Le serveur Hytale est construit sur une architecture modulaire. Chaque module gere un domaine specifique de fonctionnalite de jeu et peut etre accede via l'API plugin.

## Modules Disponibles

| Module | Description |
|--------|-------------|
| [Entity Stats](/docs/api/server-internals/modules/entity-stats) | Gestion de la sante, mana et statistiques |
| [Access Control](/docs/api/server-internals/modules/access-control) | Permissions et restrictions d'acces |
| [Damage System](/docs/api/server-internals/modules/damage-system) | Calcul et traitement des degats de combat |
| [Interactions](/docs/api/server-internals/modules/interactions) | Gestion des interactions entite/bloc |
| [Time System](/docs/api/server-internals/modules/time-system) | Cycle jour/nuit et gestion du temps |
| [Projectiles](/docs/api/server-internals/modules/projectiles) | Physique et comportement des projectiles |
| [Block Health](/docs/api/server-internals/modules/block-health) | Degats et destruction des blocs |
| [Collision System](/docs/api/server-internals/modules/collision-system) | Physique et detection de collision |
| [Stamina System](/docs/api/server-internals/modules/stamina-system) | Endurance et fatigue du joueur |
| [Prefab System](/docs/api/server-internals/modules/prefab-system) | Spawn et gestion des structures |
| [Entity UI](/docs/api/server-internals/modules/entity-ui) | Elements UI in-world (barres de vie, noms) |
| [Effects System](/docs/api/server-internals/modules/effects-system) | Effets de statut et buffs/debuffs |
| [Audio System](/docs/api/server-internals/modules/audio-system) | Gestion du son et de la musique |
| [Entity Spawning](/docs/api/server-internals/modules/entity-spawning) | Regles et systemes de spawn des mobs |
| [Crafting System](/docs/api/server-internals/modules/crafting-system) | Recettes d'artisanat et etablis |
| [NPC System](/docs/api/server-internals/modules/npc-system) | Comportement et IA des PNJ |

## Architecture des Modules

Chaque module suit un pattern consistant:

```java
public interface Module {
    // Obtenir le type de composant du module pour l'acces ECS
    ComponentType<?> getComponentType();

    // Initialisation du module
    void onEnable();
    void onDisable();
}
```

## Acceder aux Modules

Les modules sont accedes via l'instance `Server`:

```java
@Override
public void onEnable(PluginContext context) {
    Server server = context.getServer();

    // Acceder au module de degats
    DamageModule damageModule = server.getModule(DamageModule.class);

    // Acceder au module de temps
    TimeModule timeModule = server.getModule(TimeModule.class);
}
```
