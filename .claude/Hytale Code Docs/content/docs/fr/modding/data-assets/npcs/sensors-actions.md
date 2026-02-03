---
id: sensors-actions
title: Capteurs et Actions
sidebar_label: Capteurs et Actions
sidebar_position: 3
---

# Capteurs et Actions

L'IA des PNJ utilise des capteurs et des actions.

## Capteurs

Détectent les conditions environnementales :

```json
{
  "sensor": {
    "type": "player_detection",
    "range": 10
  }
}
```

## Actions

Répondent aux capteurs :

```json
{
  "action": {
    "type": "follow",
    "speed": 1.5
  }
}
```
