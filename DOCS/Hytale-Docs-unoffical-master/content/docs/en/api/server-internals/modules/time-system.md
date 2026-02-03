---
id: time-system
title: Time System
sidebar_label: Time System
sidebar_position: 7
description: Complete documentation of the Hytale time system for day/night cycles, moon phases, time dilation, and time manipulation
---

# Time System

The Time System in Hytale provides comprehensive management of game time, including day/night cycles, moon phases, sunlight calculations, and network synchronization. This system is built as a core module using the ECS (Entity Component System) architecture.

## Overview

The Time Module manages two distinct time concepts:
- **TimeResource** - Real-time tracking with time dilation support
- **WorldTimeResource** - In-game time with day/night cycles and moon phases

## Time Constants

Hytale defines several important time constants in `WorldTimeResource`:

| Constant | Value | Description |
|----------|-------|-------------|
| `NANOS_PER_DAY` | Duration of one day in nanoseconds | Full day cycle length |
| `SECONDS_PER_DAY` | 86400 | Seconds in a day (24 hours) |
| `HOURS_PER_DAY` | 24 | Hours in a day |
| `DAYS_PER_YEAR` | 365 | Days in a year |
| `DAYTIME_PORTION_PERCENTAGE` | 0.6 (60%) | Portion of day that is daylight |
| `DAYTIME_SECONDS` | ~51840 | Seconds of daylight |
| `NIGHTTIME_SECONDS` | ~34560 | Seconds of nighttime |
| `SUNRISE_SECONDS` | ~17280 | Seconds from midnight to sunrise |

**Source:** `com.hypixel.hytale.server.core.modules.time.WorldTimeResource`

## TimeModule

The `TimeModule` is a core plugin that registers all time-related systems:

```java
public class TimeModule extends JavaPlugin {
   @Nonnull
   public static final PluginManifest MANIFEST = PluginManifest.corePlugin(TimeModule.class).build();
   private static TimeModule instance;
   private ResourceType<EntityStore, WorldTimeResource> worldTimeResourceType;
   private ResourceType<EntityStore, TimeResource> timeResourceType;

   public static TimeModule get() {
      return instance;
   }

   @Override
   protected void setup() {
      ComponentRegistryProxy<EntityStore> entityStoreRegistry = this.getEntityStoreRegistry();
      this.getCommandRegistry().registerCommand(new TimeCommand());
      this.worldTimeResourceType = entityStoreRegistry.registerResource(WorldTimeResource.class, WorldTimeResource::new);
      entityStoreRegistry.registerSystem(new WorldTimeSystems.Init(this.worldTimeResourceType));
      entityStoreRegistry.registerSystem(new WorldTimeSystems.Ticking(this.worldTimeResourceType));
      this.timeResourceType = entityStoreRegistry.registerResource(TimeResource.class, "Time", TimeResource.CODEC);
      entityStoreRegistry.registerSystem(new TimeSystem(this.timeResourceType));
      entityStoreRegistry.registerSystem(new TimePacketSystem(this.worldTimeResourceType));
   }

   @Nonnull
   public ResourceType<EntityStore, WorldTimeResource> getWorldTimeResourceType() {
      return this.worldTimeResourceType;
   }

   @Nonnull
   public ResourceType<EntityStore, TimeResource> getTimeResourceType() {
      return this.timeResourceType;
   }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.time.TimeModule`

## TimeResource

The `TimeResource` tracks real-time with time dilation support:

```java
public class TimeResource implements Resource<EntityStore> {
   @Nonnull
   private Instant now;
   private float timeDilationModifier = 1.0F;

   public float getTimeDilationModifier() {
      return this.timeDilationModifier;
   }

   public void setTimeDilationModifier(float timeDilationModifier) {
      this.timeDilationModifier = timeDilationModifier;
   }

   @Nonnull
   public Instant getNow() {
      return this.now;
   }

   public void setNow(@Nonnull Instant now) {
      this.now = now;
   }

   public void add(@Nonnull Duration duration) {
      this.now = this.now.plus(duration);
   }

   public void add(long time, @Nonnull TemporalUnit unit) {
      this.now = this.now.plus(time, unit);
   }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.time.TimeResource`

## WorldTimeResource

The `WorldTimeResource` manages in-game time, including day/night cycles, sunlight, and moon phases:

### Key Properties

```java
public class WorldTimeResource implements Resource<EntityStore> {
   private Instant gameTime;
   private LocalDateTime _gameTimeLocalDateTime;
   private int currentHour;
   private double sunlightFactor;
   private double scaledTime;
   private int moonPhase;
}
```

### Getting Time Information

```java
// Get game time as Instant
Instant gameTime = worldTimeResource.getGameTime();

// Get game time as LocalDateTime
LocalDateTime dateTime = worldTimeResource.getGameDateTime();

// Get current hour (0-23)
int hour = worldTimeResource.getCurrentHour();

// Get day progress (0.0 to 1.0)
float dayProgress = worldTimeResource.getDayProgress();

// Get sunlight factor (0.0 to 1.0)
double sunlight = worldTimeResource.getSunlightFactor();

// Get moon phase
int moonPhase = worldTimeResource.getMoonPhase();
```

### Setting Time

```java
// Set exact game time
worldTimeResource.setGameTime(Instant.parse("0001-06-15T12:00:00.00Z"), world, store);

// Set day time (0.0 = midnight, 0.5 = noon, 1.0 = next midnight)
worldTimeResource.setDayTime(0.5, world, store);  // Set to noon
```

**Source:** `com.hypixel.hytale.server.core.modules.time.WorldTimeResource`

## Day/Night Cycle

The day/night cycle is calculated based on configurable daytime and nighttime durations:

```java
public static double getSecondsPerTick(World world) {
   int daytimeDurationSeconds = world.getDaytimeDurationSeconds();
   int nighttimeDurationSeconds = world.getNighttimeDurationSeconds();
   int totalDurationSeconds = daytimeDurationSeconds + nighttimeDurationSeconds;
   return (double)SECONDS_PER_DAY / (double)totalDurationSeconds;
}
```

### Time of Day Periods

| Period | Calculation | Description |
|--------|-------------|-------------|
| Dawn | `(HOURS_PER_DAY - daylightHours) / 2` | Start of daylight |
| Midday | `HOURS_PER_DAY / 2` | Noon (12:00) |
| Dusk | `(HOURS_PER_DAY - daylightHours) / 2 + daylightHours` | End of daylight |
| Midnight | `0` | Start of night (00:00) |

### Time Range Checking

```java
// Check if current time is within a day time range
boolean isDayTime = worldTimeResource.isDayTimeWithinRange(0.25, 0.75);

// Check scaled time (adjusts for day/night duration differences)
boolean isInRange = worldTimeResource.isScaledDayTimeWithinRange(0.25, 0.75);
```

## Sunlight Calculation

The sunlight factor is calculated based on day progress:

```java
private void updateSunlightFactor(int dayProgress, float halfNight) {
   float dawnRelativeProgress = ((float)dayProgress - halfNight) / (float)SECONDS_PER_DAY;
   this.sunlightFactor = MathUtil.clamp(
      (double)TrigMathUtil.sin(6.2831855F * dawnRelativeProgress) + 0.2,
      0.0,
      1.0
   );
}
```

### Sun Direction

The system calculates the sun's direction for shadow mapping:

```java
@Nonnull
public Vector3f getSunDirection() {
   float dayTime = this.getDayProgress() * (float)HOURS_PER_DAY;
   float daylightDuration = 0.6F * (float)HOURS_PER_DAY;
   float nightDuration = (float)HOURS_PER_DAY - daylightDuration;
   // ... calculation continues
   Vector3f sunPosition = new Vector3f(
      TrigMathUtil.cos(sunAngle),
      TrigMathUtil.sin(sunAngle) * 2.0F,
      TrigMathUtil.sin(sunAngle)
   );
   sunPosition.normalize();
   return sunPosition;
}
```

## Moon Phases

Moon phases cycle based on the day of the year and total moon phases configured:

```java
public void updateMoonPhase(@Nonnull World world, @Nonnull ComponentAccessor<EntityStore> componentAccessor) {
   WorldConfig worldGameplayConfig = world.getGameplayConfig().getWorldConfig();
   int totalMoonPhases = worldGameplayConfig.getTotalMoonPhases();
   double dayProgress = (double)this.currentHour / (double)HOURS_PER_DAY;
   int currentDay = this._gameTimeLocalDateTime.getDayOfYear();
   int weekDay = (currentDay - 1) % totalMoonPhases;
   if (dayProgress < 0.5) {
      if (weekDay == 0) {
         this.setMoonPhase(totalMoonPhases - 1, componentAccessor);
      } else {
         this.setMoonPhase(weekDay - 1, componentAccessor);
      }
   } else {
      this.setMoonPhase(weekDay, componentAccessor);
   }
}
```

### Moon Phase Range Check

```java
// Check if moon phase is within a specific range
boolean isFullMoon = worldTimeResource.isMoonPhaseWithinRange(world, 4, 4);
boolean isNewToHalf = worldTimeResource.isMoonPhaseWithinRange(world, 0, 4);
```

### MoonPhaseChangeEvent

When the moon phase changes, a `MoonPhaseChangeEvent` is fired:

```java
public void setMoonPhase(int moonPhase, @Nonnull ComponentAccessor<EntityStore> componentAccessor) {
   if (moonPhase != this.moonPhase) {
      MoonPhaseChangeEvent event = new MoonPhaseChangeEvent(moonPhase);
      componentAccessor.invoke(event);
   }
   this.moonPhase = moonPhase;
}
```

**Source:** `com.hypixel.hytale.server.core.universe.world.events.ecs.MoonPhaseChangeEvent`

## Time Dilation

Time dilation allows speeding up or slowing down game time:

```java
public static void setTimeDilation(float timeDilationModifier, @Nonnull ComponentAccessor<EntityStore> componentAccessor) {
   World world = componentAccessor.getExternalData().getWorld();
   if (!((double)timeDilationModifier <= 0.01) && !(timeDilationModifier > 4.0F)) {
      TimeResource worldTimeResource = componentAccessor.getResource(TimeResource.getResourceType());
      worldTimeResource.setTimeDilationModifier(timeDilationModifier);
      SetTimeDilation setTimeDilationPacket = new SetTimeDilation(timeDilationModifier);

      for (PlayerRef playerRef : world.playerRefs) {
         playerRef.getPacketHandler().writeNoCache(setTimeDilationPacket);
      }
   } else {
      throw new IllegalArgumentException("TimeDilation is out of bounds (<=0.01 or >4)");
   }
}
```

**Constraints:**
- Minimum: `0.01` (1% speed)
- Maximum: `4.0` (400% speed)

## Network Synchronization

### Time Packets

The time system uses two main packets for synchronization:

#### UpdateTime Packet

```java
public class UpdateTime implements Packet {
   public static final int PACKET_ID = 146;
   @Nullable
   public InstantData gameTime;
}
```

#### UpdateTimeSettings Packet

```java
public class UpdateTimeSettings implements Packet {
   public static final int PACKET_ID = 145;
   public int daytimeDurationSeconds;
   public int nighttimeDurationSeconds;
   public byte totalMoonPhases;
   public boolean timePaused;
}
```

### TimePacketSystem

Broadcasts time updates every second:

```java
public class TimePacketSystem extends DelayedSystem<EntityStore> {
   private static final float BROADCAST_INTERVAL = 1.0F;

   @Override
   public void delayedTick(float dt, int systemIndex, @Nonnull Store<EntityStore> store) {
      World world = store.getExternalData().getWorld();
      if (!world.getWorldConfig().isGameTimePaused()) {
         WorldTimeResource worldTimeResource = store.getResource(this.worldTimeResourceType);
         worldTimeResource.broadcastTimePacket(store);
      }
   }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.time.TimePacketSystem`

## Weather Integration

The time system integrates with weather through time-based color and value configurations:

### TimeColor

Used for time-based color transitions (sunlight, fog, etc.):

```java
public class TimeColor {
   protected float hour;   // Hour of day (0-24)
   protected Color color;  // Color at this hour
}
```

### TimeFloat

Used for time-based float values (fog density, sunlight damping, etc.):

```java
public class TimeFloat {
   protected float hour;   // Hour of day (0-24)
   protected float value;  // Value at this hour
}
```

Weather systems use these to define:
- `SunlightColors` - Sun color throughout the day
- `SunlightDampingMultipliers` - Light intensity modifiers
- `FogColors` - Fog color changes
- `FogDensities` - Fog density throughout the day
- `SkyTopColors` / `SkyBottomColors` - Sky gradient colors
- `MoonColors` / `MoonGlowColors` - Moon appearance

**Source:** `com.hypixel.hytale.server.core.asset.type.weather.config.Weather`

## Console Commands

### Time Command

The main `/time` command provides several subcommands:

| Command | Description |
|---------|-------------|
| `/time` | Display current world time information |
| `/time <hour>` | Set time to specific hour (0-24) |
| `/time set <hour>` | Set time to specific hour |
| `/time Dawn` | Set time to dawn (aliases: `day`, `morning`) |
| `/time Midday` | Set time to noon (alias: `noon`) |
| `/time Dusk` | Set time to dusk (alias: `night`) |
| `/time Midnight` | Set time to midnight |
| `/time pause` | Toggle time pause (alias: `stop`) |
| `/time dilation <value>` | Set time dilation (0.01-4.0) |

**Permission:** Requires Creative mode permission group.

```java
public class TimeCommand extends AbstractWorldCommand {
   public TimeCommand() {
      super("time", "server.commands.time.get.desc");
      this.setPermissionGroup(GameMode.Creative);
      this.addAliases(new String[]{"daytime"});
      // ... subcommands
   }

   @Override
   public void execute(@Nonnull CommandContext context, @Nonnull World world, @Nonnull Store<EntityStore> store) {
      WorldTimeResource worldTimeResource = store.getResource(WorldTimeResource.getResourceType());
      LocalDateTime gameDateTime = worldTimeResource.getGameDateTime();
      // Display time info including day of week, week of month/year, moon phase
   }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.time.commands.TimeCommand`

### World Config Pause Time Command

```java
public static void pauseTime(@Nonnull CommandSender commandSender, @Nonnull World world, @Nonnull Store<EntityStore> store) {
   WorldTimeResource worldTimeResource = store.getResource(WorldTimeResource.getResourceType());
   boolean timePause = !world.getWorldConfig().isGameTimePaused();
   WorldConfig worldConfig = world.getWorldConfig();
   worldConfig.setGameTimePaused(timePause);
   worldConfig.markChanged();
   // Send feedback message
}
```

**Source:** `com.hypixel.hytale.server.core.universe.world.commands.worldconfig.WorldConfigPauseTimeCommand`

## Plugin Examples

### Basic Time Manipulation Plugin

```java
public class TimeManipulationPlugin extends JavaPlugin {

    public TimeManipulationPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Register moon phase change listener
        getEventRegistry().register(MoonPhaseChangeEvent.class, this::onMoonPhaseChange);
    }

    private void onMoonPhaseChange(MoonPhaseChangeEvent event) {
        int newPhase = event.getNewMoonPhase();
        getLogger().info("Moon phase changed to: " + newPhase);

        // Trigger special events on full moon
        if (newPhase == 4) {
            triggerFullMoonEvent();
        }
    }

    // Get current time information
    public void logTimeInfo(World world, Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        getLogger().info("Current Time: " + timeResource.getGameTime());
        getLogger().info("Current Hour: " + timeResource.getCurrentHour());
        getLogger().info("Day Progress: " + timeResource.getDayProgress());
        getLogger().info("Sunlight Factor: " + timeResource.getSunlightFactor());
        getLogger().info("Moon Phase: " + timeResource.getMoonPhase());
    }

    // Set time to specific hour
    public void setTimeToHour(World world, Store<EntityStore> store, int hour) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        double dayTime = (double) hour / 24.0;
        timeResource.setDayTime(dayTime, world, store);
    }

    // Check if it's nighttime
    public boolean isNightTime(Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        // Night is roughly from hour 18 to hour 6
        return timeResource.isDayTimeWithinRange(0.75, 0.25);
    }

    // Speed up time
    public void setFastForward(Store<EntityStore> store) {
        World.setTimeDilation(2.0f, store);
    }

    // Slow down time
    public void setSlowMotion(Store<EntityStore> store) {
        World.setTimeDilation(0.5f, store);
    }

    // Reset time speed to normal
    public void resetTimeSpeed(Store<EntityStore> store) {
        World.setTimeDilation(1.0f, store);
    }

    private void triggerFullMoonEvent() {
        // Implement full moon special events
    }
}
```

### Day/Night Event System

```java
public class DayNightEventsPlugin extends JavaPlugin {

    private boolean wasDay = true;

    public DayNightEventsPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Register tick listener to check day/night transitions
        getEventRegistry().register(WorldTickEvent.class, this::onWorldTick);
    }

    private void onWorldTick(WorldTickEvent event) {
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore().getStore();
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        double sunlight = timeResource.getSunlightFactor();
        boolean isDay = sunlight > 0.5;

        // Detect day/night transitions
        if (isDay && !wasDay) {
            onDawn(world, store);
        } else if (!isDay && wasDay) {
            onDusk(world, store);
        }

        wasDay = isDay;
    }

    private void onDawn(World world, Store<EntityStore> store) {
        getLogger().info("Dawn breaks in world: " + world.getName());
        // Despawn night creatures, end night events
    }

    private void onDusk(World world, Store<EntityStore> store) {
        getLogger().info("Night falls in world: " + world.getName());
        // Spawn night creatures, start night events
    }
}
```

### Time-Based Spawning

```java
public class TimeBasedSpawnerPlugin extends JavaPlugin {

    public TimeBasedSpawnerPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    public boolean canSpawnMob(World world, Store<EntityStore> store, String mobType) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        switch (mobType) {
            case "vampire":
                // Vampires only spawn at night (hours 20-4)
                return timeResource.isDayTimeWithinRange(0.833, 0.167);

            case "werewolf":
                // Werewolves only spawn during full moon nights
                int moonPhase = timeResource.getMoonPhase();
                boolean isNight = timeResource.getSunlightFactor() < 0.3;
                return isNight && (moonPhase == 3 || moonPhase == 4 || moonPhase == 5);

            case "phoenix":
                // Phoenix only spawns at dawn (hours 5-7)
                return timeResource.isDayTimeWithinRange(0.208, 0.292);

            default:
                return true;
        }
    }

    public float getMobSpawnMultiplier(Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        int moonPhase = timeResource.getMoonPhase();

        // More hostile mobs spawn during full moon
        // Full moon is typically phase 4 in an 8-phase system
        float moonMultiplier = 1.0f + (0.5f * (1.0f - Math.abs(moonPhase - 4) / 4.0f));

        return moonMultiplier;
    }
}
```

## Source Files

| Class | Path |
|-------|------|
| `TimeModule` | `com.hypixel.hytale.server.core.modules.time.TimeModule` |
| `TimeResource` | `com.hypixel.hytale.server.core.modules.time.TimeResource` |
| `WorldTimeResource` | `com.hypixel.hytale.server.core.modules.time.WorldTimeResource` |
| `TimeSystem` | `com.hypixel.hytale.server.core.modules.time.TimeSystem` |
| `WorldTimeSystems` | `com.hypixel.hytale.server.core.modules.time.WorldTimeSystems` |
| `TimePacketSystem` | `com.hypixel.hytale.server.core.modules.time.TimePacketSystem` |
| `TimeCommand` | `com.hypixel.hytale.server.core.modules.time.commands.TimeCommand` |
| `UpdateTime` | `com.hypixel.hytale.protocol.packets.world.UpdateTime` |
| `UpdateTimeSettings` | `com.hypixel.hytale.protocol.packets.world.UpdateTimeSettings` |
| `MoonPhaseChangeEvent` | `com.hypixel.hytale.server.core.universe.world.events.ecs.MoonPhaseChangeEvent` |
| `TimeColor` | `com.hypixel.hytale.server.core.asset.type.weather.config.TimeColor` |
| `TimeFloat` | `com.hypixel.hytale.server.core.asset.type.weather.config.TimeFloat` |
| `Weather` | `com.hypixel.hytale.server.core.asset.type.weather.config.Weather` |
