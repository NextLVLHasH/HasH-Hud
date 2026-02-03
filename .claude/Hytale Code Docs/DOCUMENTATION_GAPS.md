# Hytale Documentation Gaps Analysis

> **Generated:** January 2026
> **Source:** Decompiled Hytale Server Code Analysis
> **Target:** wiki-next/content/docs/en/

---

## Executive Summary

This document identifies gaps between the decompiled Hytale server code and the current documentation in wiki-next. The analysis covers:

- **21 Server Modules** identified (7 undocumented)
- **168+ Commands** found (many subcategories undocumented)
- **65+ Events** discovered across packages (partial coverage)
- **100+ ECS Components** identified (many undocumented)
- **268 Network Packets** (documented at high level, details missing)

---

## Table of Contents

1. [Modules](#1-modules)
2. [Commands](#2-commands)
3. [Events](#3-events)
4. [ECS Components](#4-ecs-components)
5. [Protocol/Network](#5-protocolnetwork)
6. [Data Types](#6-data-types)
7. [Priority Matrix](#7-priority-matrix)

---

## 1. Modules

### Identified Modules in `server/core/modules/`

| Module | Source File | Documented | Priority |
|--------|-------------|------------|----------|
| AccessControlModule | `accesscontrol/AccessControlModule.java` | NO | HIGH |
| BlockModule | `block/BlockModule.java` | Partial (data-assets) | MEDIUM |
| BlockHealthModule | `blockhealth/BlockHealthModule.java` | NO | MEDIUM |
| BlockSetModule | `blockset/BlockSetModule.java` | NO | LOW |
| FlyCameraModule | `camera/FlyCameraModule.java` | NO | LOW |
| CollisionModule | `collision/CollisionModule.java` | NO | MEDIUM |
| EntityModule | `entity/EntityModule.java` | Partial (ECS doc) | HIGH |
| DamageModule | `entity/damage/DamageModule.java` | NO | HIGH |
| StaminaModule | `entity/stamina/StaminaModule.java` | NO | MEDIUM |
| EntityStatsModule | `entitystats/EntityStatsModule.java` | Partial (entity-stats.md) | MEDIUM |
| EntityUIModule | `entityui/EntityUIModule.java` | NO | MEDIUM |
| I18nModule | `i18n/I18nModule.java` | NO | LOW |
| InteractionModule | `interaction/InteractionModule.java` | NO | HIGH |
| ItemModule | `item/ItemModule.java` | Partial (data-assets) | MEDIUM |
| LegacyModule | `LegacyModule.java` | NO | LOW |
| MigrationModule | `migrations/MigrationModule.java` | NO | LOW |
| PrefabSpawnerModule | `prefabspawner/PrefabSpawnerModule.java` | NO | MEDIUM |
| ProjectileModule | `projectile/ProjectileModule.java` | NO | MEDIUM |
| ServerPlayerListModule | `serverplayerlist/ServerPlayerListModule.java` | NO | LOW |
| SingleplayerModule | `singleplayer/SingleplayerModule.java` | NO | LOW |
| TimeModule | `time/TimeModule.java` | NO | MEDIUM |

### Undocumented Modules - Details

#### AccessControlModule (HIGH Priority)
**Location:** `server/core/modules/accesscontrol/`

Handles player access control including:
- Ban system (timed and infinite bans)
- Whitelist management
- Custom ban parsers
- Access providers registry

**Commands provided:**
- `/ban`
- `/unban`
- `/whitelist`

**Missing Documentation:**
- Ban API for plugins
- Custom ban parser creation
- Access provider interface

---

#### DamageModule (HIGH Priority)
**Location:** `server/core/modules/entity/damage/`

Manages all damage-related functionality:
- Damage calculation
- Damage causes (fall, fire, etc.)
- Knockback system
- Damage effects

**Key Classes:**
- `DamageCause`
- `DamageCalculator`
- `DamageClass`
- `DamageEffects`
- `Knockback`, `DirectionalKnockback`, `ForceKnockback`

---

#### InteractionModule (HIGH Priority)
**Location:** `server/core/modules/interaction/`

Handles all player/entity interactions:
- Block interactions (break, place, use)
- Item interactions (wield, use, consume)
- Entity interactions (attack, use)
- Interaction chains
- Cooldowns and conditions

**Interaction Types Discovered:**
- `BreakBlockInteraction`
- `PlaceBlockInteraction`
- `UseBlockInteraction`
- `UseEntityInteraction`
- `LaunchProjectileInteraction`
- `EquipItemInteraction`
- `ApplyEffectInteraction`
- `ApplyForceInteraction`
- `ChargingInteraction`
- `ChainingInteraction`
- `SpawnPrefabInteraction`
- `OpenContainerInteraction`
- `DoorInteraction`
- And 40+ more...

---

#### BlockHealthModule (MEDIUM Priority)
**Location:** `server/core/modules/blockhealth/`

Manages block health/damage system for blocks that can be damaged but not instantly broken.

---

#### CollisionModule (MEDIUM Priority)
**Location:** `server/core/modules/collision/`

Physics collision detection and response system.

---

#### TimeModule (MEDIUM Priority)
**Location:** `server/core/modules/time/`

In-game time management, day/night cycle, tick synchronization.

---

## 2. Commands

### Current Documentation Coverage

The documentation in `servers/administration/commands.md` only covers 4 basic commands:
- `/stop`
- `/kick`
- `/ban`
- `/op`

The `api/server-internals/commands.md` documents the command system architecture well but doesn't list all available commands.

### Discovered Commands by Category (168+ Total)

#### Player Commands (`commands/player/`)
| Command | Documented | Description | Priority |
|---------|------------|-------------|----------|
| `gamemode` | YES | Change game mode | - |
| `kill` | YES | Kill player | - |
| `damage` | YES | Damage player | - |
| `hide` | NO | Toggle player visibility | MEDIUM |
| `whereami` | YES | Get location | - |
| `whoami` | YES | Player info | - |
| `refer` | NO | Referral command | LOW |
| `toggleblockplacementoverride` | NO | Builder mode toggle | LOW |

##### Player Stats Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `player stats get` | YES | - |
| `player stats set` | YES | - |
| `player stats add` | YES | - |
| `player stats reset` | YES | - |
| `player stats dump` | YES | - |
| `player stats settomax` | NO | LOW |

##### Player Effect Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `player effect apply` | YES | - |
| `player effect clear` | YES | - |

##### Player Camera Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `player camera reset` | NO | LOW |
| `player camera topdown` | NO | LOW |
| `player camera sidescroller` | NO | LOW |
| `player camera demo activate` | NO | LOW |
| `player camera demo deactivate` | NO | LOW |

##### Inventory Commands
| Command | Documented | Priority |
|---------|------------|----------|
| `give` | YES | - |
| `give armor` | NO | MEDIUM |
| `inventory clear` | YES | - |
| `inventory see` | NO | LOW |
| `inventory item` | NO | LOW |
| `inventory backpack` | NO | LOW |
| `itemstate` | NO | MEDIUM |

#### World Commands (`commands/world/`)

##### Entity Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `entity clone` | YES | - |
| `entity remove` | YES | - |
| `entity dump` | YES | - |
| `entity clean` | YES | - |
| `entity count` | YES | - |
| `entity nameplate` | YES | - |
| `entity tracker` | YES | - |
| `entity resend` | YES | - |
| `entity intangible` | YES | - |
| `entity invulnerable` | YES | - |
| `entity hidefromadventureplayers` | NO | LOW |
| `entity makeinteractable` | NO | LOW |
| `entity effect` | NO | MEDIUM |
| `entity lod` | NO | LOW |
| `entity snapshot length` | NO | LOW |
| `entity snapshot history` | NO | LOW |
| `entity stats get/set/add/reset/dump` | NO | MEDIUM |

##### Chunk Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `chunk info` | YES | - |
| `chunk load` | YES | - |
| `chunk unload` | YES | - |
| `chunk loaded` | YES | - |
| `chunk regenerate` | YES | - |
| `chunk resend` | YES | - |
| `chunk forcetick` | YES | - |
| `chunk fixheightmap` | NO | LOW |
| `chunk marksave` | NO | LOW |
| `chunk maxsendrate` | NO | LOW |
| `chunk tint` | NO | LOW |
| `chunk tracker` | NO | LOW |
| `chunk lighting *` | NO | LOW |

#### Utility Commands (`commands/utility/`)
| Command | Documented | Priority |
|---------|------------|----------|
| `help` | YES | - |
| `backup` | YES | - |
| `notify` | NO | LOW |
| `eventtitle` | NO | LOW |
| `stash` | NO | LOW |
| `convertprefabs` | NO | LOW |
| `validatecpb` | NO | LOW |
| `network` | NO | MEDIUM |
| `commands` | NO | LOW |

##### WorldMap Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `worldmap discover` | NO | MEDIUM |
| `worldmap undiscover` | NO | MEDIUM |
| `worldmap clearmarkers` | NO | LOW |
| `worldmap reload` | NO | LOW |
| `worldmap viewradius get/set/remove` | NO | LOW |

##### Sound Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `sound play2d` | NO | LOW |
| `sound play3d` | NO | LOW |

##### Lighting Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `lighting get` | NO | LOW |
| `lighting send` | NO | LOW |
| `lighting sendtoggle` | NO | LOW |
| `lighting info` | NO | LOW |
| `lighting calculation` | NO | LOW |
| `lighting invalidate` | NO | LOW |

##### Sleep Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `sleep offset` | NO | LOW |
| `sleep test` | NO | LOW |

##### Git/Update Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `update assets` | NO | LOW |
| `update prefabs` | NO | LOW |

#### Debug Commands (`commands/debug/`)
| Command | Documented | Priority |
|---------|------------|----------|
| `ping` | YES | - |
| `ping clear/reset` | NO | LOW |
| `ping graph` | NO | LOW |
| `version` | YES | - |
| `log` | NO | MEDIUM |
| `pidcheck` | NO | LOW |
| `packetstats` | NO | MEDIUM |
| `hitdetection` | NO | LOW |
| `debugplayerposition` | NO | LOW |
| `messagetranslationtest` | NO | LOW |
| `hudmanagertest` | NO | LOW |
| `stopnetworkchunksending` | NO | LOW |
| `showbuildertoolshud` | NO | LOW |
| `particle` | NO | MEDIUM |
| `tagpattern` | NO | LOW |

##### Server Debug Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `server stats memory` | NO | MEDIUM |
| `server stats cpu` | NO | MEDIUM |
| `server stats gc` | NO | LOW |
| `server gc` | NO | LOW |
| `server dump` | NO | LOW |

##### Stress Test Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `stresstest start` | NO | LOW |
| `stresstest stop` | NO | LOW |

##### Component Debug Subcommands
| Command | Documented | Priority |
|---------|------------|----------|
| `hitboxcollision add/remove` | NO | LOW |
| `repulsion add/remove` | NO | LOW |

#### Server Commands (`commands/server/`)
| Command | Documented | Priority |
|---------|------------|----------|
| `stop` | YES | - |
| `kick` | YES | - |
| `who` | NO | MEDIUM |
| `maxplayers` | NO | MEDIUM |
| `auth status` | NO | MEDIUM |
| `auth login` | NO | MEDIUM |
| `auth select` | NO | MEDIUM |
| `auth logout` | NO | MEDIUM |
| `auth cancel` | NO | LOW |
| `auth persistence` | NO | LOW |

---

## 3. Events

### Currently Documented Events

The documentation covers these events with dedicated pages:

**Server Events:**
- BootEvent
- ShutdownEvent
- PluginSetupEvent

**Player Events:**
- PlayerConnectEvent
- PlayerDisconnectEvent
- PlayerChatEvent
- PlayerInteractEvent
- PlayerMouseButtonEvent
- PlayerMouseMotionEvent
- PlayerSetupConnectEvent
- PlayerSetupDisconnectEvent
- PlayerReadyEvent
- PlayerCraftEvent
- AddPlayerToWorldEvent
- ChangeGameModeEvent
- DrainPlayerFromWorldEvent

**Block Events:**
- BreakBlockEvent
- PlaceBlockEvent
- DamageBlockEvent
- UseBlockEvent

**Inventory Events:**
- DropItemEvent
- SwitchActiveSlotEvent
- InteractivelyPickupItemEvent
- CraftRecipeEvent

**Entity Events:**
- EntityRemoveEvent
- LivingEntityInventoryChangeEvent

**Permission Events:**
- PlayerPermissionChangeEvent
- GroupPermissionChangeEvent
- PlayerGroupEvent

**World Events:**
- AddWorldEvent
- RemoveWorldEvent
- StartWorldEvent
- AllWorldsLoadedEvent
- MoonPhaseChangeEvent

**Chunk Events:**
- ChunkPreLoadProcessEvent
- ChunkSaveEvent
- ChunkUnloadEvent

### Undocumented Events

#### Server Core Events
| Event | Location | Priority |
|-------|----------|----------|
| `PrepareUniverseEvent` | `event/events/` | LOW |
| `KillFeedEvent` | `modules/entity/damage/event/` | MEDIUM |

#### I18n Events
| Event | Location | Priority |
|-------|----------|----------|
| `MessagesUpdated` | `modules/i18n/event/` | LOW |
| `GenerateDefaultLanguageEvent` | `modules/i18n/event/` | LOW |

#### Prefab Events
| Event | Location | Priority |
|-------|----------|----------|
| `PrefabPlaceEntityEvent` | `prefab/event/` | HIGH |
| `PrefabPasteEvent` | `prefab/event/` | HIGH |

#### Plugin Events
| Event | Location | Priority |
|-------|----------|----------|
| `PluginEvent` | `plugin/event/` | MEDIUM |

#### Asset Events
| Event | Location | Priority |
|-------|----------|----------|
| `AssetMonitorEvent` | `assetstore/event/` | LOW |
| `RegisterAssetStoreEvent` | `assetstore/event/` | MEDIUM |
| `GenerateAssetsEvent` | `assetstore/event/` | LOW |
| `LoadedAssetsEvent` | `assetstore/event/` | MEDIUM |
| `RemovedAssetsEvent` | `assetstore/event/` | LOW |
| `RemoveAssetStoreEvent` | `assetstore/event/` | LOW |

#### Asset Editor Events
| Event | Location | Priority |
|-------|----------|----------|
| `AssetEditorClientDisconnectEvent` | `builtin/asseteditor/event/` | LOW |
| `AssetEditorAssetCreatedEvent` | `builtin/asseteditor/event/` | LOW |
| `AssetEditorSelectAssetEvent` | `builtin/asseteditor/event/` | LOW |
| And 5+ more... | | LOW |

#### Instance Events
| Event | Location | Priority |
|-------|----------|----------|
| `DiscoverInstanceEvent` | `builtin/instances/event/` | MEDIUM |

#### ECS Events (Missing from Reference)
| Event | Location | Priority |
|-------|----------|----------|
| `DiscoverZoneEvent` | `event/events/ecs/` | MEDIUM |

#### NPC Blackboard Events
| Event | Location | Priority |
|-------|----------|----------|
| `EntityEventType` | `npc/blackboard/view/event/entity/` | HIGH |
| `BlockEventType` | `npc/blackboard/view/event/block/` | HIGH |

---

## 4. ECS Components

### Documented Components

The ECS documentation (`api/server-internals/ecs.md`) mentions:
- TransformComponent
- BoundingBox
- UUIDComponent
- NonTicking
- NonSerialized
- Velocity
- CollisionResultComponent
- ModelComponent
- DisplayNameComponent
- MovementStatesComponent
- KnockbackComponent
- DamageDataComponent
- ProjectileComponent
- EffectControllerComponent

### Undocumented Components (HIGH Priority)

#### Entity Module Components (`modules/entity/component/`)
| Component | Description | Priority |
|-----------|-------------|----------|
| `FromWorldGen` | Marks entity as spawned by world generation | MEDIUM |
| `WorldGenId` | World generation identifier | MEDIUM |
| `Intangible` | Makes entity non-collidable | HIGH |
| `PersistentModel` | Persistent model data | MEDIUM |
| `Invulnerable` | Makes entity invulnerable | HIGH |
| `PositionDataComponent` | Extended position data | MEDIUM |
| `PropComponent` | Prop/decoration entity data | MEDIUM |
| `EntityScaleComponent` | Entity scale modifier | MEDIUM |
| `FromPrefab` | Marks entity as from prefab | MEDIUM |
| `SnapshotBuffer` | Network snapshot buffer | LOW |
| `PersistentDynamicLight` | Persistent light source | LOW |
| `ActiveAnimationComponent` | Current animation state | MEDIUM |
| `HiddenFromAdventurePlayers` | Hidden in adventure mode | LOW |
| `Interactable` | Entity can be interacted with | HIGH |
| `DynamicLight` | Dynamic light emission | MEDIUM |
| `HeadRotation` | Head rotation tracking | LOW |
| `MovementAudioComponent` | Movement sounds | LOW |
| `NewSpawnComponent` | Newly spawned marker | LOW |
| `AudioComponent` | Entity audio configuration | LOW |
| `RespondToHit` | Hit response behavior | MEDIUM |
| `RotateObjectComponent` | Rotation behavior | LOW |

#### Physics Components (`modules/physics/component/`)
| Component | Description | Priority |
|-----------|-------------|----------|
| `Velocity` | Entity velocity (documented) | - |
| `PhysicsValues` | Physics parameters | MEDIUM |

#### Projectile Components (`modules/projectile/component/`)
| Component | Description | Priority |
|-----------|-------------|----------|
| `PredictedProjectile` | Client-predicted projectile | MEDIUM |
| `Projectile` | Projectile data | MEDIUM |

#### Item Components (`modules/entity/item/`)
| Component | Description | Priority |
|-----------|-------------|----------|
| `ItemComponent` | Item entity data | HIGH |
| `ItemPhysicsComponent` | Item physics | MEDIUM |
| `PickupItemComponent` | Item pickup behavior | MEDIUM |
| `PreventItemMerging` | Prevents item stacking | LOW |
| `PreventPickup` | Prevents item pickup | LOW |

#### Player Components
| Component | Description | Priority |
|-----------|-------------|----------|
| `PlayerSkinComponent` | Player skin data | MEDIUM |
| `PlayerInput` | Player input state | HIGH |
| `PlayerSettings` | Player settings | MEDIUM |
| `ChunkTracker` | Chunk tracking for player | MEDIUM |
| `KnockbackSimulation` | Knockback prediction | LOW |
| `ApplyRandomSkinPersistedComponent` | Random skin assignment | LOW |

#### Other Important Components
| Component | Description | Priority |
|-----------|-------------|----------|
| `HitboxCollision` | Hitbox collision data | MEDIUM |
| `Repulsion` | Entity repulsion | LOW |
| `Nameplate` | Entity nameplate | MEDIUM |
| `NetworkId` | Network entity ID | HIGH |
| `Teleport` | Teleport state | MEDIUM |
| `PendingTeleport` | Pending teleport | LOW |
| `Frozen` | Entity frozen state | MEDIUM |

---

## 5. Protocol/Network

### Current Documentation

The `servers/network-protocol.md` provides good coverage of:
- QUIC transport basics
- Protocol constants
- Packet interface
- Frame structure
- Connection flow
- Main packet categories with IDs

### Missing Protocol Details

#### Packet Structures (268 Total)
Only ~30 packets are documented with field details. Missing detailed documentation for:

| Category | Packets | Priority |
|----------|---------|----------|
| Entity Updates | ~20 packets | HIGH |
| Block Operations | ~15 packets | HIGH |
| Inventory | ~15 packets | MEDIUM |
| UI/Windows | ~20 packets | MEDIUM |
| World Data | ~30 packets | MEDIUM |
| Assets | ~40 packets | LOW |
| Machinima | ~10 packets | LOW |
| Debug | ~15 packets | LOW |

#### Protocol Data Structures (315 Total)
| Structure Type | Count | Documented | Priority |
|----------------|-------|------------|----------|
| Interaction Types | 50+ | NO | HIGH |
| Entity Data | 30+ | Partial | HIGH |
| Block Data | 20+ | Partial | MEDIUM |
| Item Data | 25+ | Partial | MEDIUM |
| UI/Window | 20+ | NO | MEDIUM |
| Animation | 15+ | NO | LOW |
| Particle | 20+ | NO | LOW |
| Camera | 10+ | NO | LOW |
| Misc | 100+ | NO | LOW |

#### Protocol Enums (136 Total)
Many enums are documented in `types.md`, but missing:
| Enum | Priority |
|------|----------|
| `DisconnectType` | MEDIUM |
| `PongType` | LOW |
| `ClientType` | LOW |
| `MovementType` | MEDIUM |
| `AnimationSlot` | MEDIUM |
| `ApplyForceState` | LOW |
| `ApplyMovementType` | LOW |
| And 50+ more... | - |

---

## 6. Data Types

### Well Documented
- BlockType
- ItemBase, ItemWeapon, ItemArmor, ItemTool
- EntityEffect
- CraftingRecipe
- Weather, WorldEnvironment
- Key enumerations

### Undocumented Data Types

#### Interaction System (HIGH Priority)
| Type | Description |
|------|-------------|
| `Interaction` | Base interaction type |
| `InteractionConfiguration` | Interaction config |
| `InteractionPriority` | Priority system |
| `InteractionRules` | Interaction rules |
| `InteractionEffects` | Effects triggered |
| `Selector` types | Target selection |

#### Combat System (HIGH Priority)
| Type | Description |
|------|-------------|
| `DamageCalculator` | Damage computation |
| `DamageClass` | Damage classification |
| `DamageEffects` | Damage visual effects |
| `TargetEntityEffect` | Target effects |
| `Knockback` types | Knockback variants |

#### Movement System (MEDIUM Priority)
| Type | Description |
|------|-------------|
| `MovementSettings` | Movement config |
| `MovementEffects` | Movement effects |
| `MovementConfig` | Per-entity config |

#### UI/Window System (MEDIUM Priority)
| Type | Description |
|------|-------------|
| `WindowManager` | Window management |
| `PageManager` | UI pages |
| `HudManager` | HUD elements |
| `HotbarManager` | Hotbar system |

---

## 7. Priority Matrix

### HIGH Priority Items

These should be documented first for plugin developers:

| Item | Type | Reason |
|------|------|--------|
| AccessControlModule | Module | Ban/whitelist API for plugins |
| DamageModule | Module | Combat customization |
| InteractionModule | Module | Core gameplay mechanics |
| PrefabPlaceEntityEvent | Event | World generation hooks |
| PrefabPasteEvent | Event | Building/prefab API |
| NetworkId component | Component | Entity networking |
| Intangible component | Component | Common plugin use |
| Invulnerable component | Component | Common plugin use |
| Interactable component | Component | NPC/entity interaction |
| ItemComponent | Component | Item entities |
| PlayerInput component | Component | Input handling |
| Interaction types | Protocol | Item/block behaviors |
| Combat types | Protocol | Damage system |

### MEDIUM Priority Items

Important for advanced modding:

| Item | Type | Reason |
|------|------|--------|
| BlockHealthModule | Module | Block damage system |
| CollisionModule | Module | Physics customization |
| TimeModule | Module | Day/night cycle |
| EntityUIModule | Module | Entity UI customization |
| PrefabSpawnerModule | Module | Spawning system |
| ProjectileModule | Module | Projectile customization |
| DiscoverInstanceEvent | Event | Instance discovery |
| Entity stats commands | Commands | Server administration |
| WorldMap commands | Commands | Map features |
| Server debug commands | Commands | Server monitoring |
| PhysicsValues component | Component | Physics tweaking |
| ItemPhysicsComponent | Component | Item physics |
| Movement types | Protocol | Movement system |

### LOW Priority Items

Nice to have but not critical:

| Item | Type | Reason |
|------|------|--------|
| I18nModule | Module | Localization |
| LegacyModule | Module | Deprecated |
| MigrationModule | Module | Internal |
| SingleplayerModule | Module | SP-specific |
| ServerPlayerListModule | Module | Tab list |
| FlyCameraModule | Module | Camera modes |
| BlockSetModule | Module | Block sets |
| Asset events | Events | Hot-reload |
| Editor events | Events | Editor-only |
| Debug commands | Commands | Development |
| Camera commands | Commands | Niche use |
| Snapshot components | Components | Internal |
| Audio components | Components | Sound system |

---

## Recommendations

### Immediate Actions (Week 1-2)

1. **Create Module Overview Page**
   - List all 21 modules with brief descriptions
   - Link to detailed pages for important ones

2. **Document AccessControlModule**
   - Ban system API
   - Whitelist API
   - Custom provider interface

3. **Document DamageModule**
   - Damage types and causes
   - Damage calculation
   - Knockback system

4. **Document InteractionModule**
   - Interaction types reference
   - Creating custom interactions
   - Interaction chains

### Short-term Actions (Week 3-4)

5. **Expand Command Reference**
   - Create comprehensive command list
   - Document all subcommands
   - Add usage examples

6. **Document Missing Events**
   - PrefabPlaceEntityEvent
   - PrefabPasteEvent
   - DiscoverInstanceEvent

7. **Expand Component Reference**
   - Document all entity components
   - Add code examples
   - Explain component relationships

### Medium-term Actions (Month 2)

8. **Protocol Deep Dive**
   - Document all packet structures
   - Create packet flow diagrams
   - Add serialization details

9. **Complete Data Types**
   - Interaction system types
   - Combat system types
   - UI/Window types

10. **Create Tutorials**
    - Custom damage source
    - Custom interaction
    - Custom entity component

---

## Appendix: Source File Locations

### Module Source Files
```
server-analyzer/decompiled/com/hypixel/hytale/server/core/modules/
  accesscontrol/AccessControlModule.java
  block/BlockModule.java
  blockhealth/BlockHealthModule.java
  blockset/BlockSetModule.java
  camera/FlyCameraModule.java
  collision/CollisionModule.java
  entity/EntityModule.java
  entity/damage/DamageModule.java
  entity/stamina/StaminaModule.java
  entitystats/EntityStatsModule.java
  entityui/EntityUIModule.java
  i18n/I18nModule.java
  interaction/InteractionModule.java
  item/ItemModule.java
  migrations/MigrationModule.java
  prefabspawner/PrefabSpawnerModule.java
  projectile/ProjectileModule.java
  serverplayerlist/ServerPlayerListModule.java
  singleplayer/SingleplayerModule.java
  time/TimeModule.java
  LegacyModule.java
```

### Event Source Files
```
server-analyzer/decompiled/com/hypixel/hytale/
  server/core/event/events/
  server/core/modules/*/event/
  server/core/prefab/event/
  server/core/plugin/event/
  assetstore/event/
  builtin/asseteditor/event/
  builtin/instances/event/
  event/
```

### Component Source Files
```
server-analyzer/decompiled/com/hypixel/hytale/
  server/core/modules/entity/component/
  server/core/modules/physics/component/
  server/core/modules/projectile/component/
  component/
```

### Protocol Source Files
```
server-analyzer/decompiled/com/hypixel/hytale/protocol/
  - 268 packet definitions
  - 315 data structures
  - 136 enums
```

---

*This analysis was generated by scanning the decompiled Hytale server code and comparing against the wiki-next documentation.*
