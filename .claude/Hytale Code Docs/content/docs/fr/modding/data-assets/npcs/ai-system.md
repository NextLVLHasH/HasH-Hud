---
id: ai-system
title: Système IA
sidebar_label: Système IA
sidebar_position: 2
description: Comprendre et configurer le système IA des PNJs dans Hytale
---

# Système IA

Le système IA de Hytale utilise des arbres de comportement et des objectifs pour créer des PNJs intelligents et réactifs.

## Vue d'ensemble

Le système IA est construit sur plusieurs concepts fondamentaux :

| Concept | Description |
|---------|-------------|
| **Objectifs** | Buts de haut niveau (attaquer, fuir, errer) |
| **Capteurs** | Détecter l'état du monde (voir joueur, entendre son) |
| **Actions** | Comportements spécifiques (bouger, attaquer, idle) |
| **Arbres de comportement** | Logique de prise de décision |

## Arbres de Comportement

Les arbres de comportement définissent comment les PNJs prennent des décisions. Ils sont composés de nœuds évalués dans l'ordre.

```json
{
  "ai": {
    "behaviorTree": {
      "type": "selector",
      "children": [
        {
          "type": "sequence",
          "children": [
            { "type": "sensor", "sensor": "seeEnemy" },
            { "type": "action", "action": "attack" }
          ]
        },
        {
          "type": "action",
          "action": "wander"
        }
      ]
    }
  }
}
```

### Types de Nœuds

| Type | Description |
|------|-------------|
| `selector` | Exécute les enfants jusqu'à ce qu'un réussisse |
| `sequence` | Exécute les enfants jusqu'à ce qu'un échoue |
| `parallel` | Exécute tous les enfants simultanément |
| `decorator` | Modifie le comportement de l'enfant |

## Objectifs

Les objectifs sont des buts prioritaires que le PNJ essaie d'accomplir.

```json
{
  "ai": {
    "goals": [
      {
        "type": "attackTarget",
        "priority": 1,
        "targetTypes": ["player", "villager"]
      },
      {
        "type": "wander",
        "priority": 5,
        "radius": 10
      },
      {
        "type": "lookAround",
        "priority": 6
      }
    ]
  }
}
```

### Objectifs Courants

| Objectif | Description |
|----------|-------------|
| `attackTarget` | Attaquer les ennemis détectés |
| `flee` | Fuir les menaces |
| `wander` | Mouvement aléatoire |
| `follow` | Suivre une cible |
| `patrol` | Se déplacer entre points |
| `guard` | Protéger une zone |
| `idle` | Rester immobile |
| `lookAround` | Regarder autour |

## Capteurs

Les capteurs détectent des conditions dans le monde.

```json
{
  "ai": {
    "sensors": [
      {
        "type": "sight",
        "range": 16,
        "angle": 120
      },
      {
        "type": "hearing",
        "range": 10
      },
      {
        "type": "damage",
        "remember": 200
      }
    ]
  }
}
```

### Types de Capteurs

| Capteur | Description |
|---------|-------------|
| `sight` | Détecter les entités visibles |
| `hearing` | Détecter les sons |
| `damage` | Se souvenir des attaquants |
| `proximity` | Détecter les entités proches |
| `time` | Conscience jour/nuit |
| `health` | Détection de seuil de santé |

## Sélection de Cible

Configurez comment les PNJs choisissent leurs cibles.

```json
{
  "ai": {
    "targeting": {
      "types": ["player", "villager"],
      "range": 20,
      "priority": "nearest",
      "requireLineOfSight": true
    }
  }
}
```

### Modes de Priorité

| Mode | Description |
|------|-------------|
| `nearest` | Cible la plus proche |
| `lowest_health` | Cible la plus faible |
| `highest_threat` | Cible la plus dangereuse |
| `random` | Sélection aléatoire |

## Déplacement

Configurez le comportement de déplacement du PNJ.

```json
{
  "ai": {
    "movement": {
      "walkSpeed": 0.25,
      "runSpeed": 0.5,
      "swimSpeed": 0.15,
      "jumpHeight": 1.2,
      "canFly": false,
      "canSwim": true,
      "avoidsWater": true
    }
  }
}
```

## IA de Combat

Configurez le comportement au combat.

```json
{
  "ai": {
    "combat": {
      "attackRange": 2.0,
      "attackCooldown": 20,
      "strafeChance": 0.3,
      "blockChance": 0.2,
      "retreatHealthThreshold": 0.2
    }
  }
}
```

## Exemple Complet

```json
{
  "id": "my_mod:smart_zombie",
  "displayName": "Zombie Intelligent",
  "stats": {
    "health": 30,
    "damage": 6,
    "speed": 0.28
  },
  "ai": {
    "sensors": [
      { "type": "sight", "range": 20, "angle": 140 },
      { "type": "hearing", "range": 15 },
      { "type": "damage", "remember": 400 }
    ],
    "goals": [
      { "type": "attackTarget", "priority": 1 },
      { "type": "wander", "priority": 5, "radius": 15 },
      { "type": "lookAround", "priority": 6 }
    ],
    "targeting": {
      "types": ["player"],
      "range": 25,
      "priority": "nearest"
    },
    "combat": {
      "attackRange": 2.5,
      "attackCooldown": 15,
      "strafeChance": 0.4
    },
    "movement": {
      "walkSpeed": 0.2,
      "runSpeed": 0.35,
      "canSwim": false
    }
  }
}
```

## Voir Aussi

- [Créer des PNJs](/docs/modding/data-assets/npcs/creating-npcs)
- [Comportements](/docs/modding/data-assets/npcs/behaviors)
- [Capteurs & Actions](/docs/modding/data-assets/npcs/sensors-actions)
