---
id: entity-stats
title: Entity Stats System
sidebar_label: Entity Stats
sidebar_position: 6
description: Complete documentation of the Hytale entity stats system for health, mana, stamina, and custom stats
---

# Entity Stats System

The Entity Stats system in Hytale provides a flexible way to manage entity attributes like health, mana, stamina, and custom stats. This system is built on top of the ECS (Entity Component System) architecture.

## Default Stat Types

Hytale defines six default entity stat types:

| Stat Name | Description | Accessor Method |
|-----------|-------------|-----------------|
| `Health` | Entity health points | `DefaultEntityStatTypes.getHealth()` |
| `Oxygen` | Oxygen level (underwater breathing) | `DefaultEntityStatTypes.getOxygen()` |
| `Stamina` | Stamina for actions | `DefaultEntityStatTypes.getStamina()` |
| `Mana` | Magical energy | `DefaultEntityStatTypes.getMana()` |
| `SignatureEnergy` | Special ability energy | `DefaultEntityStatTypes.getSignatureEnergy()` |
| `Ammo` | Ammunition count | `DefaultEntityStatTypes.getAmmo()` |

**Source:** `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes`

## EntityStatType Properties

Each stat type is defined with the following properties:

```java
public class EntityStatType {
    String id;              // Unique identifier (e.g., "Health")
    float initialValue;     // Starting value
    float min;              // Minimum value
    float max;              // Maximum value
    boolean shared;         // Whether stat is synced to other players
    Regenerating[] regenerating;  // Auto-regeneration rules
    EntityStatEffects minValueEffects;  // Effects when stat reaches min
    EntityStatEffects maxValueEffects;  // Effects when stat reaches max
    EntityStatResetBehavior resetBehavior;  // How stat resets
    boolean ignoreInvulnerability;  // Whether damage ignores invulnerability
}
```

## EntityStatMap Component

The `EntityStatMap` is an ECS component that stores all stats for an entity:

```java
// Get the component type
ComponentType<EntityStore, EntityStatMap> componentType = EntityStatMap.getComponentType();

// Get an entity's stat map from the store
EntityStatMap statMap = store.getComponent(entityRef, componentType);
```

## Modifying Stats

### Setting a Stat Value

```java
// Set stat to a specific value
float previousValue = statMap.setStatValue(statIndex, newValue);

// With predictability (for client prediction)
statMap.setStatValue(EntityStatMap.Predictable.SELF, statIndex, newValue);
```

### Adding to a Stat

```java
// Add amount to stat (can be negative)
float newValue = statMap.addStatValue(statIndex, amount);

// Subtract from stat
float newValue = statMap.subtractStatValue(statIndex, amount);
```

### Min/Max Operations

```java
// Set stat to its minimum value
statMap.minimizeStatValue(statIndex);

// Set stat to its maximum value
statMap.maximizeStatValue(statIndex);

// Reset stat based on its reset behavior
statMap.resetStatValue(statIndex);
```

### Getting Stat Values

```java
// Get stat value by index
EntityStatValue statValue = statMap.get(statIndex);

// Get current value
float current = statValue.get();

// Get as percentage (0.0 to 1.0)
float percentage = statValue.asPercentage();

// Get min/max bounds
float min = statValue.getMin();
float max = statValue.getMax();
```

### Getting Stat Index by Name

```java
// Get the asset map
IndexedLookupTableAssetMap<String, EntityStatType> assetMap = EntityStatType.getAssetMap();

// Get index for a stat name
int healthIndex = assetMap.getIndex("Health");
int manaIndex = assetMap.getIndex("Mana");

// Or use the default accessors
int healthIndex = DefaultEntityStatTypes.getHealth();
```

## Stat Modifiers

Modifiers allow temporary or conditional changes to stats:

```java
// Add a modifier
statMap.putModifier(statIndex, "myModifierKey", modifier);

// Remove a modifier
Modifier removed = statMap.removeModifier(statIndex, "myModifierKey");

// Get a modifier
Modifier modifier = statMap.getModifier(statIndex, "myModifierKey");
```

### Modifier Types

```java
public class StaticModifier implements Modifier {
    ModifierTarget target;     // MIN, MAX, or VALUE
    CalculationType calculationType;  // ADDITIVE or MULTIPLICATIVE
    float amount;
}
```

**Calculation Types:**
- `ADDITIVE` - Adds the amount to the stat
- `MULTIPLICATIVE` - Multiplies the stat by (1 + amount)

**Modifier Targets:**
- `MIN` - Modifies the minimum bound
- `MAX` - Modifies the maximum bound

## Regeneration System

Stats can auto-regenerate over time:

```java
public class Regenerating {
    float interval;           // Time between regeneration ticks
    float amount;            // Amount to regenerate
    boolean clampAtZero;     // Prevent going below zero
    RegenType regenType;     // ADDITIVE or PERCENTAGE
    Condition[] conditions;  // When to regenerate
    RegeneratingModifier[] modifiers;  // Modifiers to regeneration
}
```

## Console Commands

Hytale provides console commands for managing stats:

### Player Stats Commands

| Command | Description |
|---------|-------------|
| `/player stats set <player> <statName> <value>` | Set a player's stat |
| `/player stats get <player> <statName>` | Get a player's stat value |
| `/player stats add <player> <statName> <amount>` | Add to a player's stat |
| `/player stats sub <player> <statName> <amount>` | Subtract from a player's stat |
| `/player stats reset <player> <statName>` | Reset a player's stat |
| `/player stats settomax <player> <statName>` | Set stat to maximum |
| `/player stats dump <player>` | Dump all player stats |

### Entity Stats Commands

| Command | Description |
|---------|-------------|
| `/entity stats set <entity> <statName> <value>` | Set an entity's stat |
| `/entity stats get <entity> <statName>` | Get an entity's stat value |
| `/entity stats add <entity> <statName> <amount>` | Add to an entity's stat |
| `/entity stats reset <entity> <statName>` | Reset an entity's stat |
| `/entity stats dump <entity>` | Dump all entity stats |

## Plugin Example

Here's a complete example of managing player health in a plugin:

```java
public class HealthPlugin extends JavaPlugin {

    public HealthPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Listen for player damage events
        getEventRegistry().register(PlayerDamageEvent.class, this::onPlayerDamage);
    }

    private void onPlayerDamage(PlayerDamageEvent event) {
        PlayerRef playerRef = event.getPlayerRef();
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore();

        // Get the player's stat map
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            // Get health stat index
            int healthIndex = DefaultEntityStatTypes.getHealth();

            // Get current health
            EntityStatValue health = statMap.get(healthIndex);
            float currentHealth = health.get();

            getLogger().info("Player health before damage: " + currentHealth);

            // Example: Add a damage resistance modifier
            StaticModifier damageResist = new StaticModifier(
                Modifier.ModifierTarget.MAX,
                StaticModifier.CalculationType.MULTIPLICATIVE,
                0.1f  // +10% max health
            );
            statMap.putModifier(healthIndex, "damage_resist", damageResist);
        }
    }

    // Heal a player to full health
    public void healPlayer(PlayerRef playerRef, Store<EntityStore> store) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int healthIndex = DefaultEntityStatTypes.getHealth();
            statMap.maximizeStatValue(healthIndex);
        }
    }

    // Set player mana to a specific value
    public void setMana(PlayerRef playerRef, Store<EntityStore> store, float value) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int manaIndex = DefaultEntityStatTypes.getMana();
            statMap.setStatValue(manaIndex, value);
        }
    }
}
```

## EntityStatEffects

Effects that trigger when a stat reaches min or max value:

```java
public class EntityStatEffects {
    boolean triggerAtZero;      // Trigger when stat reaches zero
    String soundEventId;        // Sound to play
    ModelParticle[] particles;  // Particles to spawn
    String interactions;        // Interactions to execute
}
```

## Reset Behaviors

```java
public enum EntityStatResetBehavior {
    InitialValue,  // Reset to initialValue
    MaxValue       // Reset to max
}
```

## Network Synchronization

Stats can be marked as `shared` to sync across the network:
- **Shared stats** - Visible to all players (e.g., health bars)
- **Non-shared stats** - Only visible to the owning player

The `EntityStatMap` tracks updates with:
- `selfUpdates` - Updates for the owning player
- `otherUpdates` - Updates for other players (shared stats only)

## Source Files

| Class | Path |
|-------|------|
| `DefaultEntityStatTypes` | `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes` |
| `EntityStatType` | `com.hypixel.hytale.server.core.modules.entitystats.asset.EntityStatType` |
| `EntityStatMap` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatMap` |
| `EntityStatValue` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatValue` |
| `StaticModifier` | `com.hypixel.hytale.server.core.modules.entitystats.modifier.StaticModifier` |
| `EntityStatsModule` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatsModule` |
