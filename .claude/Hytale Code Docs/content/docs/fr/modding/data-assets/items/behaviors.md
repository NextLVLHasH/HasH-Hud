---
id: item-behaviors
title: Comportements des Items
sidebar_label: Comportements
sidebar_position: 3
description: Ajouter des comportements et effets spéciaux à vos items dans Hytale
---

# Comportements des Items

Ajoutez des comportements et effets spéciaux pour rendre vos items uniques et interactifs.

## Qu'est-ce qu'un Comportement d'Item ?

Les comportements définissent comment un item interagit avec le monde au-delà de ses propriétés de base. Ils permettent des effets spéciaux, des capacités et des mécaniques uniques.

## Comportements Disponibles

### À l'Utilisation

Se déclenche quand le joueur utilise l'item (clic droit).

```json
{
  "behaviors": [
    {
      "type": "onUse",
      "action": "spawn_projectile",
      "projectile": "my_mod:magic_bolt",
      "cooldown": 20
    }
  ]
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `action` | string | Action à effectuer |
| `cooldown` | number | Ticks entre les utilisations |

### Au Toucher

Se déclenche quand on frappe une entité avec l'item.

```json
{
  "behaviors": [
    {
      "type": "onHit",
      "effects": [
        {
          "type": "poison",
          "duration": 100,
          "amplifier": 0,
          "chance": 0.3
        }
      ]
    }
  ]
}
```

### À la Destruction de Bloc

Se déclenche quand on casse un bloc avec l'item.

```json
{
  "behaviors": [
    {
      "type": "onBlockBreak",
      "action": "aoe_break",
      "radius": 1
    }
  ]
}
```

### À l'Équipement

Se déclenche quand l'item est équipé.

```json
{
  "behaviors": [
    {
      "type": "onEquip",
      "effects": [
        {
          "type": "speed",
          "amplifier": 1
        }
      ]
    }
  ]
}
```

### Passif

Effets constants en inventaire ou équipé.

```json
{
  "behaviors": [
    {
      "type": "passive",
      "condition": "equipped",
      "effects": [
        {
          "type": "night_vision"
        }
      ]
    }
  ]
}
```

### Lançable

Rend l'item lançable.

```json
{
  "behaviors": [
    {
      "type": "throwable",
      "velocity": 1.5,
      "gravity": 0.03,
      "damage": 5,
      "consumeOnThrow": true
    }
  ]
}
```

### Plaçable

Permet à l'item de placer un bloc.

```json
{
  "behaviors": [
    {
      "type": "placeable",
      "block": "my_mod:custom_block"
    }
  ]
}
```

### Combustible

Rend l'item utilisable comme combustible.

```json
{
  "behaviors": [
    {
      "type": "fuel",
      "burnTime": 200
    }
  ]
}
```

## Types d'Actions

| Action | Description |
|--------|-------------|
| `spawn_projectile` | Tirer un projectile |
| `teleport` | Téléporter le joueur |
| `heal` | Restaurer la santé |
| `aoe_break` | Casser plusieurs blocs |
| `summon` | Invoquer une entité |
| `play_sound` | Jouer un effet sonore |
| `spawn_particles` | Créer des effets de particules |

## Combiner les Comportements

Les items peuvent avoir plusieurs comportements :

```json
{
  "id": "my_mod:blazing_sword",
  "displayName": "Épée Ardente",
  "type": "weapon",
  "behaviors": [
    {
      "type": "onHit",
      "effects": [
        { "type": "fire", "duration": 60 }
      ]
    },
    {
      "type": "passive",
      "condition": "held",
      "action": "emit_light",
      "lightLevel": 10
    }
  ]
}
```

## Comportements Personnalisés

Pour le modding avancé, créez des comportements personnalisés avec l'API plugin :

```java
@ItemBehavior("my_mod:custom_ability")
public class CustomAbility implements IItemBehavior {
    @Override
    public void onUse(ItemUseEvent event) {
        // Logique personnalisée
    }
}
```

## Voir Aussi

- [Créer des Items](/docs/modding/data-assets/items/creating-items)
- [Propriétés des Items](/docs/modding/data-assets/items/properties)
- [Développement de Plugins](/docs/modding/plugins/overview)
