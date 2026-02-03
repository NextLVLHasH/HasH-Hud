---
id: behaviors
title: Comportements des Blocs
sidebar_label: Comportements
sidebar_position: 3
description: Ajouter des comportements interactifs à vos blocs dans Hytale
---

# Comportements des Blocs

Ajoutez des comportements interactifs pour rendre vos blocs dynamiques et engageants.

## Qu'est-ce qu'un Comportement ?

Les comportements sont des composants modulaires qui définissent comment un bloc interagit avec le monde. Plusieurs comportements peuvent être combinés sur un seul bloc.

## Comportements Disponibles

### Gravité

Fait tomber le bloc quand il n'est pas supporté, comme le sable ou le gravier.

```json
{
  "behaviors": [
    {
      "type": "gravity",
      "fallDelay": 2
    }
  ]
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `fallDelay` | number | Ticks avant la chute (défaut: 2) |

### Liquide

Fait couler le bloc comme l'eau ou la lave.

```json
{
  "behaviors": [
    {
      "type": "liquid",
      "flowSpeed": 4,
      "flowDistance": 7,
      "infinite": true
    }
  ]
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `flowSpeed` | number | Ticks entre les mises à jour |
| `flowDistance` | number | Distance de propagation maximale |
| `infinite` | boolean | Source auto-régénérante |

### Émissif

Fait produire de la lumière au bloc.

```json
{
  "behaviors": [
    {
      "type": "emissive",
      "lightLevel": 15,
      "color": "#FFD700"
    }
  ]
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `lightLevel` | number | Intensité lumineuse (0-15) |
| `color` | string | Couleur de lumière (hex) |

### Interactif

Répond aux clics droits du joueur.

```json
{
  "behaviors": [
    {
      "type": "interactive",
      "action": "open_gui",
      "gui": "my_mod:custom_menu"
    }
  ]
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `action` | string | Type d'action |
| `gui` | string | Identifiant GUI (si applicable) |

### Rotatif

Permet de placer le bloc dans différentes orientations.

```json
{
  "behaviors": [
    {
      "type": "rotatable",
      "axes": ["horizontal", "vertical"]
    }
  ]
}
```

### Connectable

Se connecte visuellement aux blocs adjacents du même type.

```json
{
  "behaviors": [
    {
      "type": "connectable",
      "connectTo": ["my_mod:fence", "my_mod:wall"]
    }
  ]
}
```

### Cassable

Comportement de destruction personnalisé.

```json
{
  "behaviors": [
    {
      "type": "breakable",
      "drops": [
        { "item": "my_mod:gem", "count": [1, 3] }
      ],
      "experience": 5
    }
  ]
}
```

## Combiner les Comportements

Les blocs peuvent avoir plusieurs comportements :

```json
{
  "id": "my_mod:glowing_sand",
  "displayName": "Sable Lumineux",
  "behaviors": [
    {
      "type": "gravity"
    },
    {
      "type": "emissive",
      "lightLevel": 10,
      "color": "#FFFF00"
    }
  ]
}
```

## Comportements Personnalisés

Pour le modding avancé, vous pouvez créer des comportements personnalisés avec l'API plugin.

```java
@BlockBehavior("my_mod:custom_behavior")
public class CustomBehavior implements IBlockBehavior {
    @Override
    public void onInteract(BlockInteractEvent event) {
        // Logique personnalisée
    }
}
```

## Voir Aussi

- [Créer des Blocs](/docs/modding/data-assets/blocks/creating-blocks)
- [Propriétés des Blocs](/docs/modding/data-assets/blocks/properties)
- [Développement de Plugins](/docs/modding/plugins/overview)
