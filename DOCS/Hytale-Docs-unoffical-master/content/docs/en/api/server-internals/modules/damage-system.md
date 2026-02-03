---
id: damage-system
title: Damage System
sidebar_label: Damage System
sidebar_position: 7
description: Complete documentation of the Hytale damage system for applying damage, knockback, and combat effects via plugins
---

# Damage System

The Damage System in Hytale provides a comprehensive framework for dealing damage to entities, applying knockback effects, and managing combat interactions. This system is built on the ECS (Entity Component System) architecture and integrates with the Entity Stats system.

## Overview

The damage system consists of several key components:

- **Damage** - The core event class representing damage being dealt
- **DamageCause** - Defines the type/source of damage (e.g., fall, drowning, command)
- **DamageCalculator** - Calculates damage amounts with modifiers
- **DamageClass** - Categorizes damage types for equipment modifiers
- **DamageEffects** - Visual and audio effects triggered by damage
- **Knockback** - Force applied to entities when damaged

## DamageModule

The `DamageModule` is the core plugin that manages the damage system:

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class DamageModule extends JavaPlugin {
    public static final PluginManifest MANIFEST = PluginManifest.corePlugin(DamageModule.class)
        .depends(EntityModule.class)
        .depends(EntityStatsModule.class)
        .depends(EntityUIModule.class)
        .build();

    // Get the singleton instance
    public static DamageModule get();

    // System groups for damage processing pipeline
    public SystemGroup<EntityStore> getGatherDamageGroup();
    public SystemGroup<EntityStore> getFilterDamageGroup();
    public SystemGroup<EntityStore> getInspectDamageGroup();
}
```

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageModule`

## Damage Class

The `Damage` class represents a damage event that can be applied to entities:

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class Damage extends CancellableEcsEvent implements IMetaStore<Damage> {
    // Create damage with a source, cause, and amount
    public Damage(Damage.Source source, DamageCause damageCause, float amount);
    public Damage(Damage.Source source, int damageCauseIndex, float amount);

    // Get/set damage amount
    public float getAmount();
    public void setAmount(float amount);
    public float getInitialAmount();

    // Get/set damage cause
    public int getDamageCauseIndex();
    public void setDamageCauseIndex(int damageCauseIndex);
    public DamageCause getCause();

    // Get/set damage source
    public Damage.Source getSource();
    public void setSource(Damage.Source source);

    // Get death message for this damage
    public Message getDeathMessage(Ref<EntityStore> targetRef, ComponentAccessor<EntityStore> componentAccessor);
}
```

### Damage Meta Keys

The `Damage` class provides several metadata keys for additional information:

| Meta Key | Type | Description |
|----------|------|-------------|
| `HIT_LOCATION` | `Vector4d` | The world position where the hit occurred |
| `HIT_ANGLE` | `Float` | The angle of the hit in degrees |
| `IMPACT_PARTICLES` | `Damage.Particles` | Particles to spawn on impact |
| `IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Sound to play on impact |
| `PLAYER_IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Sound to play to the damaged player |
| `CAMERA_EFFECT` | `Damage.CameraEffect` | Camera shake effect |
| `DEATH_ICON` | `String` | Icon to show in kill feed |
| `BLOCKED` | `Boolean` | Whether the damage was blocked |
| `STAMINA_DRAIN_MULTIPLIER` | `Float` | Multiplier for stamina drain when blocking |
| `CAN_BE_PREDICTED` | `Boolean` | Whether damage can be client-predicted |
| `KNOCKBACK_COMPONENT` | `KnockbackComponent` | Knockback to apply |

### Damage Sources

Different source types indicate how damage originated:

```java
// Null/unknown source
public static final Damage.Source NULL_SOURCE;

// Damage from an entity (player, NPC, etc.)
public class EntitySource implements Damage.Source {
    public EntitySource(Ref<EntityStore> sourceRef);
    public Ref<EntityStore> getRef();
}

// Damage from a projectile with a shooter
public class ProjectileSource extends EntitySource {
    public ProjectileSource(Ref<EntityStore> shooter, Ref<EntityStore> projectile);
    public Ref<EntityStore> getProjectile();
}

// Damage from a command
public class CommandSource implements Damage.Source {
    public CommandSource(CommandSender commandSender, AbstractCommand cmd);
    public CommandSource(CommandSender commandSender, String commandName);
}

// Environmental damage
public class EnvironmentSource implements Damage.Source {
    public EnvironmentSource(String type);
    public String getType();
}
```

## DamageCause

`DamageCause` defines the type of damage being dealt. Hytale includes several built-in damage causes:

| Cause | Description | Constant |
|-------|-------------|----------|
| `Command` | Damage from commands | `DamageCause.COMMAND` |
| `Drowning` | Underwater suffocation | `DamageCause.DROWNING` |
| `Fall` | Fall damage | `DamageCause.FALL` |
| `OutOfWorld` | Below world bounds | `DamageCause.OUT_OF_WORLD` |
| `Suffocation` | Stuck in blocks | `DamageCause.SUFFOCATION` |

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class DamageCause {
    // Built-in damage causes (initialized at runtime)
    public static DamageCause COMMAND;
    public static DamageCause DROWNING;
    public static DamageCause FALL;
    public static DamageCause OUT_OF_WORLD;
    public static DamageCause SUFFOCATION;

    // Get damage cause by ID
    public static IndexedLookupTableAssetMap<String, DamageCause> getAssetMap();

    // Properties
    public String getId();
    public String getInherits();           // Parent damage cause for resistance inheritance
    public boolean doesBypassResistances(); // Whether this damage ignores armor
    public boolean isDurabilityLoss();      // Whether this causes durability loss
}
```

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageCause`

## DamageClass

`DamageClass` categorizes damage for equipment modifier purposes:

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public enum DamageClass {
    UNKNOWN,    // Default/unknown damage class
    LIGHT,      // Light attack damage
    CHARGED,    // Charged/heavy attack damage
    SIGNATURE;  // Signature ability damage
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass`

## DamageCalculator

The `DamageCalculator` computes damage values with various modifiers:

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public class DamageCalculator {
    // Calculate damage for a given duration
    public Object2FloatMap<DamageCause> calculateDamage(double durationSeconds);

    // Properties
    public Type getType();                    // DPS or ABSOLUTE
    public DamageClass getDamageClass();      // Damage classification
    public float getSequentialModifierStep(); // Damage reduction per sequential hit
    public float getSequentialModifierMinimum(); // Minimum damage multiplier

    public enum Type {
        DPS,      // Damage per second (scaled by duration)
        ABSOLUTE  // Fixed damage amount
    }
}
```

### DamageCalculator Configuration

In JSON configuration, a DamageCalculator looks like:

```json
{
    "Type": "ABSOLUTE",
    "Class": "LIGHT",
    "BaseDamage": {
        "Physical": 10.0,
        "Fire": 5.0
    },
    "SequentialModifierStep": 0.1,
    "SequentialModifierMinimum": 0.5,
    "RandomPercentageModifier": 0.1
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageCalculator`

## Knockback System

The knockback system applies forces to entities when they take damage.

### KnockbackComponent

```java
package com.hypixel.hytale.server.core.entity.knockback;

public class KnockbackComponent implements Component<EntityStore> {
    public static ComponentType<EntityStore, KnockbackComponent> getComponentType();

    // Velocity to apply
    public Vector3d getVelocity();
    public void setVelocity(Vector3d velocity);

    // How velocity is applied (Add or Set)
    public ChangeVelocityType getVelocityType();
    public void setVelocityType(ChangeVelocityType velocityType);

    // Optional velocity configuration
    public VelocityConfig getVelocityConfig();
    public void setVelocityConfig(VelocityConfig velocityConfig);

    // Modifiers (multipliers applied to velocity)
    public void addModifier(double modifier);
    public void applyModifiers();

    // Duration for continuous knockback
    public float getDuration();
    public void setDuration(float duration);
    public float getTimer();
    public void incrementTimer(float time);
}
```

**Source:** `com.hypixel.hytale.server.core.entity.knockback.KnockbackComponent`

### Knockback Types

Hytale provides several knockback calculation methods:

#### Base Knockback

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public abstract class Knockback {
    protected float force;                    // Knockback force magnitude
    protected float duration;                 // Duration for continuous knockback
    protected ChangeVelocityType velocityType; // Add or Set velocity

    public abstract Vector3d calculateVector(Vector3d source, float yaw, Vector3d target);
}
```

#### DirectionalKnockback

Applies knockback away from the attacker with optional relative offsets:

```java
public class DirectionalKnockback extends Knockback {
    protected float relativeX;   // X offset relative to attacker facing
    protected float velocityY;   // Vertical velocity
    protected float relativeZ;   // Z offset relative to attacker facing

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Calculates direction from source to target, normalized
        // Applies relative offsets rotated by yaw
        // Returns (direction.x * force, velocityY, direction.z * force)
    }
}
```

#### ForceKnockback

Applies knockback in a fixed direction relative to the attacker:

```java
public class ForceKnockback extends Knockback {
    private Vector3d direction = Vector3d.UP;  // Direction (normalized)

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Returns direction rotated by yaw, scaled by force
    }
}
```

#### PointKnockback

Applies knockback from a specific point with offsets:

```java
public class PointKnockback extends Knockback {
    protected float velocityY;   // Vertical velocity
    protected int rotateY;       // Y rotation offset
    protected int offsetX;       // X offset from source
    protected int offsetZ;       // Z offset from source

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Creates knockback from offset point toward target
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.Knockback`

## DamageEffects

`DamageEffects` defines visual and audio feedback when damage occurs:

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public class DamageEffects {
    protected ModelParticle[] modelParticles;      // Particles attached to model
    protected WorldParticle[] worldParticles;      // World-space particles
    protected String localSoundEventId;            // 2D sound for attacker
    protected String worldSoundEventId;            // 3D world sound
    protected String playerSoundEventId;           // Sound for damaged player
    protected double viewDistance = 75.0;          // Effect visibility range
    protected Knockback knockback;                  // Knockback configuration
    protected String cameraEffectId;               // Camera shake effect
    protected float staminaDrainMultiplier = 1.0F; // Stamina drain modifier

    // Apply effects to a damage event
    public void addToDamage(Damage damageEvent);

    // Spawn effects at entity location
    public void spawnAtEntity(CommandBuffer<EntityStore> commandBuffer, Ref<EntityStore> ref);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects`

## Applying Damage via Plugins

### Basic Damage Application

```java
import com.hypixel.hytale.server.core.modules.entity.damage.Damage;
import com.hypixel.hytale.server.core.modules.entity.damage.DamageCause;
import com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems;

public class DamagePlugin extends JavaPlugin {

    public DamagePlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    // Apply damage to an entity
    public void damageEntity(Ref<EntityStore> targetRef, Store<EntityStore> store, float amount) {
        // Create damage with command source
        Damage damage = new Damage(Damage.NULL_SOURCE, DamageCause.COMMAND, amount);

        // Execute the damage
        DamageSystems.executeDamage(targetRef, store, damage);
    }

    // Apply damage from one entity to another
    public void entityDamageEntity(
        Ref<EntityStore> attackerRef,
        Ref<EntityStore> targetRef,
        CommandBuffer<EntityStore> commandBuffer,
        float amount
    ) {
        // Create entity source
        Damage.EntitySource source = new Damage.EntitySource(attackerRef);

        // Create damage event
        Damage damage = new Damage(source, DamageCause.COMMAND, amount);

        // Execute damage
        DamageSystems.executeDamage(targetRef, commandBuffer, damage);
    }
}
```

### Damage with Knockback

```java
public void damageWithKnockback(
    Ref<EntityStore> attackerRef,
    Ref<EntityStore> targetRef,
    CommandBuffer<EntityStore> commandBuffer,
    float damageAmount,
    Vector3d knockbackVelocity
) {
    // Create or get knockback component
    KnockbackComponent knockback = commandBuffer.getComponent(targetRef, KnockbackComponent.getComponentType());
    if (knockback == null) {
        knockback = new KnockbackComponent();
        commandBuffer.putComponent(targetRef, KnockbackComponent.getComponentType(), knockback);
    }

    // Configure knockback
    knockback.setVelocity(knockbackVelocity);
    knockback.setVelocityType(ChangeVelocityType.Add);
    knockback.setDuration(0.0f);  // Instant knockback

    // Create damage
    Damage.EntitySource source = new Damage.EntitySource(attackerRef);
    Damage damage = new Damage(source, DamageCause.COMMAND, damageAmount);

    // Attach knockback to damage
    damage.putMetaObject(Damage.KNOCKBACK_COMPONENT, knockback);

    // Execute
    DamageSystems.executeDamage(targetRef, commandBuffer, damage);
}
```

### Damage with Effects

```java
public void damageWithEffects(
    Ref<EntityStore> targetRef,
    CommandBuffer<EntityStore> commandBuffer,
    float amount,
    Vector4d hitLocation
) {
    Damage damage = new Damage(Damage.NULL_SOURCE, DamageCause.COMMAND, amount);

    // Add hit location for particle effects
    damage.putMetaObject(Damage.HIT_LOCATION, hitLocation);

    // Add sound effect
    int soundIndex = SoundEvent.getAssetMap().getIndex("my_hit_sound");
    damage.putMetaObject(Damage.IMPACT_SOUND_EFFECT, new Damage.SoundEffect(soundIndex));

    // Execute
    DamageSystems.executeDamage(targetRef, commandBuffer, damage);
}
```

### Creating Custom Damage Causes

Custom damage causes are defined in JSON asset files and loaded at runtime:

```json
{
    "Id": "MyCustomDamage",
    "DamageTextColor": "#FF0000",
    "BypassResistances": false,
    "DurabilityLoss": true,
    "Inherits": "Physical"
}
```

Then access it in code:

```java
DamageCause customCause = DamageCause.getAssetMap().getAsset("MyCustomDamage");
int customCauseIndex = DamageCause.getAssetMap().getIndex("MyCustomDamage");

Damage damage = new Damage(Damage.NULL_SOURCE, customCause, 50.0f);
// or
Damage damage = new Damage(Damage.NULL_SOURCE, customCauseIndex, 50.0f);
```

## Damage Processing Pipeline

The damage system processes damage through three system groups:

1. **GatherDamageGroup** - Collects and generates damage events
   - Fall damage calculation
   - Drowning/suffocation damage
   - Out-of-world damage

2. **FilterDamageGroup** - Filters and modifies damage
   - Armor damage reduction
   - Wielding (blocking) damage reduction
   - Knockback reduction
   - Invulnerability checks
   - PvP and world config filters

3. **InspectDamageGroup** - Reacts to finalized damage
   - Apply damage to health
   - Play particles and sounds
   - Apply knockback
   - Record combat stats
   - UI updates

## Console Commands

### Damage Command

| Command | Description |
|---------|-------------|
| `/damage [amount] [-silent]` | Damage yourself |
| `/damage <player> [amount] [-silent]` | Damage another player |
| `/hurt` | Alias for `/damage` |

Example:
```
/damage player123 50
/damage 25 -silent
```

## DamageSystems

The `DamageSystems` class contains all damage-related ECS systems:

| System | Group | Description |
|--------|-------|-------------|
| `ApplyDamage` | Inspect | Applies damage to entity health |
| `CanBreathe` | Gather | Drowning/suffocation damage |
| `OutOfWorldDamage` | Gather | Below-world damage |
| `FallDamagePlayers` | Gather | Player fall damage |
| `FallDamageNPCs` | Gather | NPC fall damage |
| `FilterPlayerWorldConfig` | Filter | World PvP settings |
| `FilterNPCWorldConfig` | Filter | NPC damage settings |
| `FilterUnkillable` | Filter | Invulnerability check |
| `ArmorDamageReduction` | Filter | Armor resistance |
| `WieldingDamageReduction` | Filter | Block/shield reduction |
| `ArmorKnockbackReduction` | Filter | Knockback resistance |
| `WieldingKnockbackReduction` | Filter | Block knockback reduction |
| `ApplyParticles` | Inspect | Spawn hit particles |
| `ApplySoundEffects` | Inspect | Play hit sounds |
| `HitAnimation` | Inspect | Play hurt animation |
| `PlayerHitIndicators` | Inspect | Show damage indicators |
| `RecordLastCombat` | Inspect | Track combat timestamps |
| `DamageArmor` | Inspect | Reduce armor durability |
| `DamageStamina` | Inspect | Drain stamina on block |
| `DamageAttackerTool` | Inspect | Reduce weapon durability |

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems`

## Source Files

| Class | Path |
|-------|------|
| `DamageModule` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageModule` |
| `Damage` | `com.hypixel.hytale.server.core.modules.entity.damage.Damage` |
| `DamageCause` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageCause` |
| `DamageSystems` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems` |
| `DamageCalculator` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageCalculator` |
| `DamageClass` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass` |
| `DamageEffects` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects` |
| `Knockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.Knockback` |
| `DirectionalKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DirectionalKnockback` |
| `ForceKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.ForceKnockback` |
| `PointKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.PointKnockback` |
| `KnockbackComponent` | `com.hypixel.hytale.server.core.entity.knockback.KnockbackComponent` |
| `KnockbackSystems` | `com.hypixel.hytale.server.core.entity.knockback.KnockbackSystems` |
| `DamageEntityInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.DamageEntityInteraction` |
| `DamageCommand` | `com.hypixel.hytale.server.core.command.commands.player.DamageCommand` |
