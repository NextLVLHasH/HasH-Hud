---
id: time-system
title: Systeme de Temps
sidebar_label: Systeme de Temps
sidebar_position: 7
description: Documentation complete du systeme de temps Hytale pour les cycles jour/nuit, phases lunaires, dilatation temporelle et manipulation du temps
---

# Systeme de Temps

Le Systeme de Temps dans Hytale fournit une gestion complete du temps de jeu, incluant les cycles jour/nuit, les phases lunaires, les calculs de lumiere solaire et la synchronisation reseau. Ce systeme est construit comme un module central utilisant l'architecture ECS (Entity Component System).

## Apercu

Le Module de Temps gere deux concepts de temps distincts :
- **TimeResource** - Suivi du temps reel avec support de dilatation temporelle
- **WorldTimeResource** - Temps en jeu avec cycles jour/nuit et phases lunaires

## Constantes Temporelles

Hytale definit plusieurs constantes temporelles importantes dans `WorldTimeResource` :

| Constante | Valeur | Description |
|-----------|--------|-------------|
| `NANOS_PER_DAY` | Duree d'un jour en nanosecondes | Longueur du cycle journalier complet |
| `SECONDS_PER_DAY` | 86400 | Secondes dans une journee (24 heures) |
| `HOURS_PER_DAY` | 24 | Heures dans une journee |
| `DAYS_PER_YEAR` | 365 | Jours dans une annee |
| `DAYTIME_PORTION_PERCENTAGE` | 0.6 (60%) | Portion du jour qui est eclairee |
| `DAYTIME_SECONDS` | ~51840 | Secondes de jour |
| `NIGHTTIME_SECONDS` | ~34560 | Secondes de nuit |
| `SUNRISE_SECONDS` | ~17280 | Secondes de minuit au lever du soleil |

**Source:** `com.hypixel.hytale.server.core.modules.time.WorldTimeResource`

## TimeModule

Le `TimeModule` est un plugin central qui enregistre tous les systemes lies au temps :

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

Le `TimeResource` suit le temps reel avec support de dilatation temporelle :

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

Le `WorldTimeResource` gere le temps en jeu, incluant les cycles jour/nuit, la lumiere solaire et les phases lunaires :

### Proprietes Cles

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

### Obtenir les Informations Temporelles

```java
// Obtenir le temps de jeu en Instant
Instant gameTime = worldTimeResource.getGameTime();

// Obtenir le temps de jeu en LocalDateTime
LocalDateTime dateTime = worldTimeResource.getGameDateTime();

// Obtenir l'heure actuelle (0-23)
int hour = worldTimeResource.getCurrentHour();

// Obtenir la progression du jour (0.0 a 1.0)
float dayProgress = worldTimeResource.getDayProgress();

// Obtenir le facteur de lumiere solaire (0.0 a 1.0)
double sunlight = worldTimeResource.getSunlightFactor();

// Obtenir la phase lunaire
int moonPhase = worldTimeResource.getMoonPhase();
```

### Definir le Temps

```java
// Definir le temps de jeu exact
worldTimeResource.setGameTime(Instant.parse("0001-06-15T12:00:00.00Z"), world, store);

// Definir l'heure du jour (0.0 = minuit, 0.5 = midi, 1.0 = prochain minuit)
worldTimeResource.setDayTime(0.5, world, store);  // Definir a midi
```

**Source:** `com.hypixel.hytale.server.core.modules.time.WorldTimeResource`

## Cycle Jour/Nuit

Le cycle jour/nuit est calcule en fonction des durees configurables de jour et de nuit :

```java
public static double getSecondsPerTick(World world) {
   int daytimeDurationSeconds = world.getDaytimeDurationSeconds();
   int nighttimeDurationSeconds = world.getNighttimeDurationSeconds();
   int totalDurationSeconds = daytimeDurationSeconds + nighttimeDurationSeconds;
   return (double)SECONDS_PER_DAY / (double)totalDurationSeconds;
}
```

### Periodes de la Journee

| Periode | Calcul | Description |
|---------|--------|-------------|
| Aube | `(HOURS_PER_DAY - daylightHours) / 2` | Debut de la lumiere du jour |
| Midi | `HOURS_PER_DAY / 2` | Midi (12:00) |
| Crepuscule | `(HOURS_PER_DAY - daylightHours) / 2 + daylightHours` | Fin de la lumiere du jour |
| Minuit | `0` | Debut de la nuit (00:00) |

### Verification de Plage Temporelle

```java
// Verifier si l'heure actuelle est dans une plage horaire
boolean isDayTime = worldTimeResource.isDayTimeWithinRange(0.25, 0.75);

// Verifier le temps mis a l'echelle (s'ajuste aux differences de duree jour/nuit)
boolean isInRange = worldTimeResource.isScaledDayTimeWithinRange(0.25, 0.75);
```

## Calcul de la Lumiere Solaire

Le facteur de lumiere solaire est calcule en fonction de la progression du jour :

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

### Direction du Soleil

Le systeme calcule la direction du soleil pour le mapping des ombres :

```java
@Nonnull
public Vector3f getSunDirection() {
   float dayTime = this.getDayProgress() * (float)HOURS_PER_DAY;
   float daylightDuration = 0.6F * (float)HOURS_PER_DAY;
   float nightDuration = (float)HOURS_PER_DAY - daylightDuration;
   // ... le calcul continue
   Vector3f sunPosition = new Vector3f(
      TrigMathUtil.cos(sunAngle),
      TrigMathUtil.sin(sunAngle) * 2.0F,
      TrigMathUtil.sin(sunAngle)
   );
   sunPosition.normalize();
   return sunPosition;
}
```

## Phases Lunaires

Les phases lunaires cyclent en fonction du jour de l'annee et du nombre total de phases configurees :

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

### Verification de Plage de Phase Lunaire

```java
// Verifier si la phase lunaire est dans une plage specifique
boolean isFullMoon = worldTimeResource.isMoonPhaseWithinRange(world, 4, 4);
boolean isNewToHalf = worldTimeResource.isMoonPhaseWithinRange(world, 0, 4);
```

### MoonPhaseChangeEvent

Quand la phase lunaire change, un `MoonPhaseChangeEvent` est declenche :

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

## Dilatation Temporelle

La dilatation temporelle permet d'accelerer ou de ralentir le temps de jeu :

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

**Contraintes :**
- Minimum : `0.01` (1% de vitesse)
- Maximum : `4.0` (400% de vitesse)

## Synchronisation Reseau

### Paquets de Temps

Le systeme de temps utilise deux paquets principaux pour la synchronisation :

#### Paquet UpdateTime

```java
public class UpdateTime implements Packet {
   public static final int PACKET_ID = 146;
   @Nullable
   public InstantData gameTime;
}
```

#### Paquet UpdateTimeSettings

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

Diffuse les mises a jour de temps chaque seconde :

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

## Integration Meteo

Le systeme de temps s'integre avec la meteo via des configurations de couleurs et valeurs basees sur le temps :

### TimeColor

Utilise pour les transitions de couleurs basees sur le temps (lumiere solaire, brouillard, etc.) :

```java
public class TimeColor {
   protected float hour;   // Heure du jour (0-24)
   protected Color color;  // Couleur a cette heure
}
```

### TimeFloat

Utilise pour les valeurs flottantes basees sur le temps (densite du brouillard, attenuation de la lumiere, etc.) :

```java
public class TimeFloat {
   protected float hour;   // Heure du jour (0-24)
   protected float value;  // Valeur a cette heure
}
```

Les systemes meteo utilisent ceux-ci pour definir :
- `SunlightColors` - Couleur du soleil tout au long de la journee
- `SunlightDampingMultipliers` - Modificateurs d'intensite lumineuse
- `FogColors` - Changements de couleur du brouillard
- `FogDensities` - Densite du brouillard tout au long de la journee
- `SkyTopColors` / `SkyBottomColors` - Couleurs de gradient du ciel
- `MoonColors` / `MoonGlowColors` - Apparence de la lune

**Source:** `com.hypixel.hytale.server.core.asset.type.weather.config.Weather`

## Commandes Console

### Commande Time

La commande principale `/time` fournit plusieurs sous-commandes :

| Commande | Description |
|----------|-------------|
| `/time` | Afficher les informations temporelles actuelles du monde |
| `/time <heure>` | Definir l'heure a une heure specifique (0-24) |
| `/time set <heure>` | Definir l'heure a une heure specifique |
| `/time Dawn` | Definir l'heure a l'aube (alias : `day`, `morning`) |
| `/time Midday` | Definir l'heure a midi (alias : `noon`) |
| `/time Dusk` | Definir l'heure au crepuscule (alias : `night`) |
| `/time Midnight` | Definir l'heure a minuit |
| `/time pause` | Basculer la pause du temps (alias : `stop`) |
| `/time dilation <valeur>` | Definir la dilatation temporelle (0.01-4.0) |

**Permission :** Necessite le groupe de permissions du mode Creatif.

```java
public class TimeCommand extends AbstractWorldCommand {
   public TimeCommand() {
      super("time", "server.commands.time.get.desc");
      this.setPermissionGroup(GameMode.Creative);
      this.addAliases(new String[]{"daytime"});
      // ... sous-commandes
   }

   @Override
   public void execute(@Nonnull CommandContext context, @Nonnull World world, @Nonnull Store<EntityStore> store) {
      WorldTimeResource worldTimeResource = store.getResource(WorldTimeResource.getResourceType());
      LocalDateTime gameDateTime = worldTimeResource.getGameDateTime();
      // Afficher les infos de temps incluant jour de la semaine, semaine du mois/annee, phase lunaire
   }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.time.commands.TimeCommand`

### Commande World Config Pause Time

```java
public static void pauseTime(@Nonnull CommandSender commandSender, @Nonnull World world, @Nonnull Store<EntityStore> store) {
   WorldTimeResource worldTimeResource = store.getResource(WorldTimeResource.getResourceType());
   boolean timePause = !world.getWorldConfig().isGameTimePaused();
   WorldConfig worldConfig = world.getWorldConfig();
   worldConfig.setGameTimePaused(timePause);
   worldConfig.markChanged();
   // Envoyer message de retour
}
```

**Source:** `com.hypixel.hytale.server.core.universe.world.commands.worldconfig.WorldConfigPauseTimeCommand`

## Exemples de Plugins

### Plugin de Manipulation Temporelle Basique

```java
public class TimeManipulationPlugin extends JavaPlugin {

    public TimeManipulationPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer l'ecouteur de changement de phase lunaire
        getEventRegistry().register(MoonPhaseChangeEvent.class, this::onMoonPhaseChange);
    }

    private void onMoonPhaseChange(MoonPhaseChangeEvent event) {
        int newPhase = event.getNewMoonPhase();
        getLogger().info("Phase lunaire changee a : " + newPhase);

        // Declencher des evenements speciaux a la pleine lune
        if (newPhase == 4) {
            triggerFullMoonEvent();
        }
    }

    // Obtenir les informations temporelles actuelles
    public void logTimeInfo(World world, Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        getLogger().info("Temps Actuel : " + timeResource.getGameTime());
        getLogger().info("Heure Actuelle : " + timeResource.getCurrentHour());
        getLogger().info("Progression du Jour : " + timeResource.getDayProgress());
        getLogger().info("Facteur de Lumiere Solaire : " + timeResource.getSunlightFactor());
        getLogger().info("Phase Lunaire : " + timeResource.getMoonPhase());
    }

    // Definir l'heure a une heure specifique
    public void setTimeToHour(World world, Store<EntityStore> store, int hour) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        double dayTime = (double) hour / 24.0;
        timeResource.setDayTime(dayTime, world, store);
    }

    // Verifier si c'est la nuit
    public boolean isNightTime(Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        // La nuit est approximativement de l'heure 18 a l'heure 6
        return timeResource.isDayTimeWithinRange(0.75, 0.25);
    }

    // Accelerer le temps
    public void setFastForward(Store<EntityStore> store) {
        World.setTimeDilation(2.0f, store);
    }

    // Ralentir le temps
    public void setSlowMotion(Store<EntityStore> store) {
        World.setTimeDilation(0.5f, store);
    }

    // Reinitialiser la vitesse du temps a la normale
    public void resetTimeSpeed(Store<EntityStore> store) {
        World.setTimeDilation(1.0f, store);
    }

    private void triggerFullMoonEvent() {
        // Implementer les evenements speciaux de pleine lune
    }
}
```

### Systeme d'Evenements Jour/Nuit

```java
public class DayNightEventsPlugin extends JavaPlugin {

    private boolean wasDay = true;

    public DayNightEventsPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer l'ecouteur de tick pour verifier les transitions jour/nuit
        getEventRegistry().register(WorldTickEvent.class, this::onWorldTick);
    }

    private void onWorldTick(WorldTickEvent event) {
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore().getStore();
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        double sunlight = timeResource.getSunlightFactor();
        boolean isDay = sunlight > 0.5;

        // Detecter les transitions jour/nuit
        if (isDay && !wasDay) {
            onDawn(world, store);
        } else if (!isDay && wasDay) {
            onDusk(world, store);
        }

        wasDay = isDay;
    }

    private void onDawn(World world, Store<EntityStore> store) {
        getLogger().info("L'aube se leve dans le monde : " + world.getName());
        // Faire disparaitre les creatures nocturnes, terminer les evenements de nuit
    }

    private void onDusk(World world, Store<EntityStore> store) {
        getLogger().info("La nuit tombe dans le monde : " + world.getName());
        // Faire apparaitre les creatures nocturnes, demarrer les evenements de nuit
    }
}
```

### Apparition Basee sur le Temps

```java
public class TimeBasedSpawnerPlugin extends JavaPlugin {

    public TimeBasedSpawnerPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    public boolean canSpawnMob(World world, Store<EntityStore> store, String mobType) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());

        switch (mobType) {
            case "vampire":
                // Les vampires n'apparaissent que la nuit (heures 20-4)
                return timeResource.isDayTimeWithinRange(0.833, 0.167);

            case "werewolf":
                // Les loups-garous n'apparaissent que pendant les nuits de pleine lune
                int moonPhase = timeResource.getMoonPhase();
                boolean isNight = timeResource.getSunlightFactor() < 0.3;
                return isNight && (moonPhase == 3 || moonPhase == 4 || moonPhase == 5);

            case "phoenix":
                // Le phoenix n'apparait qu'a l'aube (heures 5-7)
                return timeResource.isDayTimeWithinRange(0.208, 0.292);

            default:
                return true;
        }
    }

    public float getMobSpawnMultiplier(Store<EntityStore> store) {
        WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
        int moonPhase = timeResource.getMoonPhase();

        // Plus de mobs hostiles apparaissent pendant la pleine lune
        // La pleine lune est typiquement la phase 4 dans un systeme a 8 phases
        float moonMultiplier = 1.0f + (0.5f * (1.0f - Math.abs(moonPhase - 4) / 4.0f));

        return moonMultiplier;
    }
}
```

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
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
