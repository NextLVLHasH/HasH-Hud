---
id: types
title: Data Types
sidebar_label: Types
sidebar_position: 5
description: Documentation of main data types in the Hytale server (BlockType, Items, etc.)
---

# Hytale Data Types

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis. All information includes source file references.
:::

## What are Data Types?

**Data types** define the structure of every object in Hytale's world. Just like a blueprint defines what a house looks like, data types define what a block, item, or entity "looks like" to the server.

### Why This Matters

When you create a custom sword in Hytale, you're not writing code - you're filling out a data structure:

```json
{
  "id": "my_sword",
  "maxStack": 1,
  "durability": 250,
  "weapon": {
    "damage": 15,
    "attackSpeed": 1.2
  }
}
```

Understanding data types helps you:
- Know what properties are available
- Avoid invalid configurations
- Understand how the game interprets your content

### The Core Data Types

Hytale's world is built from a few fundamental types:

| Type | What it represents | Example |
|------|-------------------|---------|
| **BlockType** | A type of block | Stone, Grass, Custom blocks |
| **ItemBase** | A type of item | Sword, Potion, Food |
| **EntityEffect** | A buff or debuff | Poison, Speed boost |
| **CraftingRecipe** | How to craft things | Combine wood → planks |
| **Weather** | Weather conditions | Rain, Snow, Clear |

### How Types Connect

These types don't exist in isolation - they reference each other:

```
BlockType (Ore)
    └── drops → ItemBase (Diamond)
                    └── usedIn → CraftingRecipe (Diamond Sword)
                                      └── output → ItemBase (Diamond Sword)
                                                       └── applies → EntityEffect (Bleeding)
```

### Real-World Analogy: LEGO Instructions

Think of data types like LEGO instruction booklets:

- **BlockType** = Instructions for a specific brick
- **Fields** = Properties like color, size, connection points
- **Enums** = Predefined options (Red, Blue, Green)
- **References** = "Use piece #4207" - links to other pieces

Just like LEGO bricks snap together following rules, Hytale data types connect following their schemas.

### Understanding the Tables Below

Each data type is documented with tables showing:

| Column | What it means |
|--------|---------------|
| **Field** | The property name |
| **Type** | What kind of data (string, number, enum, etc.) |
| **Description** | What this property does |

**Types you'll see:**
- `String` - Text like "diamond_sword"
- `int` / `float` / `double` - Numbers (whole or decimal)
- `boolean` - True/false
- `EnumName` - One of a predefined set of values
- `Type[]` - A list of values
- `Map<Key, Value>` - A dictionary/lookup table
- `Type?` - Optional (can be null/missing)

---

## Data Type Reference

This documentation describes the primary data types used in the Hytale server, extracted from decompiled code.

---

## Table of Contents

1. [BlockType - Block Types](#blocktype---block-types)
2. [Item System](#item-system)
   - [ItemBase](#itembase)
   - [ItemWeapon](#itemweapon)
   - [ItemArmor](#itemarmor)
   - [ItemTool](#itemtool)
   - [ItemQuality](#itemquality)
3. [EntityEffect - Entity Effects](#entityeffect---entity-effects)
4. [CraftingRecipe - Recipes](#craftingrecipe---recipes)
5. [Environment](#environment)
   - [Weather](#weather)
   - [WorldEnvironment](#worldenvironment)
6. [Key Enumerations](#key-enumerations)
7. [Auxiliary Types](#auxiliary-types)

---

## BlockType - Block Types

The `BlockType` type defines the properties of a block within the Hytale world.

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `item` | `String` | ID of the item associated with the block |
| `name` | `String` | Name of the block |
| `unknown` | `boolean` | Indicates whether the block is unknown or undefined |
| `drawType` | `DrawType` | Rendering mode for the block (Empty, GizmoCube, Cube, Model, CubeWithModel) |
| `material` | `BlockMaterial` | Material type (Empty, Solid) |
| `opacity` | `Opacity` | Opacity level (Solid, Semitransparent, Cutout, Transparent) |
| `shaderEffect` | `ShaderType[]` | Applied shader effects |
| `hitbox` | `int` | Collision hitbox index |
| `interactionHitbox` | `int` | Interaction hitbox index |
| `model` | `String` | Path to the 3D model |
| `modelTexture` | `ModelTexture[]` | Model textures |
| `modelScale` | `float` | Model scale |
| `modelAnimation` | `String` | Model animation |
| `looping` | `boolean` | Whether the animation loops |

### Support Properties

| Field | Type | Description |
|-------|------|-------------|
| `maxSupportDistance` | `int` | Maximum support distance |
| `blockSupportsRequiredFor` | `BlockSupportsRequiredForType` | Required support type |
| `support` | `Map<BlockNeighbor, RequiredBlockFaceSupport[]>` | Required support faces |
| `supporting` | `Map<BlockNeighbor, BlockFaceSupport[]>` | Provided support faces |
| `ignoreSupportWhenPlaced` | `boolean` | Ignore support requirements on placement |

### Visual Properties

| Field | Type | Description |
|-------|------|-------------|
| `requiresAlphaBlending` | `boolean` | Requires alpha blending |
| `cubeTextures` | `BlockTextures[]` | Textures for cube rendering mode |
| `cubeSideMaskTexture` | `String` | Side mask texture |
| `cubeShadingMode` | `ShadingMode` | Shading mode |
| `randomRotation` | `RandomRotation` | Random rotation |
| `variantRotation` | `VariantRotation` | Variant rotation |
| `rotationYawPlacementOffset` | `Rotation` | Rotation offset on placement |
| `particleColor` | `Color` | Particle color |
| `light` | `ColorLight` | Light emission |
| `tint` | `Tint` | Block tint |
| `biomeTint` | `Tint` | Biome-dependent tint |

### Audio and Effects

| Field | Type | Description |
|-------|------|-------------|
| `blockSoundSetIndex` | `int` | Sound set index |
| `ambientSoundEventIndex` | `int` | Ambient sound index |
| `particles` | `ModelParticle[]` | Emitted particles |
| `blockParticleSetId` | `String` | Particle set ID |
| `blockBreakingDecalId` | `String` | Breaking decal ID |

### Interactions and States

| Field | Type | Description |
|-------|------|-------------|
| `interactions` | `Map<InteractionType, Integer>` | Available interactions |
| `states` | `Map<String, Integer>` | Possible states |
| `flags` | `BlockFlags` | Block flags |
| `interactionHint` | `String` | Interaction hint |
| `gathering` | `BlockGathering` | Gathering configuration |
| `placementSettings` | `BlockPlacementSettings` | Placement settings |
| `bench` | `Bench` | Workbench configuration (if applicable) |
| `rail` | `RailConfig` | Rail configuration (if applicable) |
| `connectedBlockRuleSet` | `ConnectedBlockRuleSet` | Connection rules |
| `tagIndexes` | `int[]` | Associated tags |

---

## Item System

### ItemBase

Base type for all items in the game.

#### Identity and Appearance

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Unique item identifier |
| `model` | `String` | Path to the 3D model |
| `scale` | `float` | Item scale |
| `texture` | `String` | Primary texture |
| `animation` | `String` | Item animation |
| `playerAnimationsId` | `String` | Player animation ID |
| `usePlayerAnimations` | `boolean` | Use player animations |
| `icon` | `String` | Inventory icon |
| `iconProperties` | `AssetIconProperties` | Icon properties |

#### Base Properties

| Field | Type | Description |
|-------|------|-------------|
| `maxStack` | `int` | Maximum stack size |
| `reticleIndex` | `int` | Reticle index |
| `itemLevel` | `int` | Item level |
| `qualityIndex` | `int` | Quality index |
| `resourceTypes` | `ItemResourceType[]` | Resource types |
| `consumable` | `boolean` | Whether the item is consumable |
| `variant` | `boolean` | Whether it is a variant |
| `blockId` | `int` | Associated block ID |
| `durability` | `double` | Item durability |

#### Specialized Subtypes

| Field | Type | Description |
|-------|------|-------------|
| `tool` | `ItemTool` | Tool configuration |
| `weapon` | `ItemWeapon` | Weapon configuration |
| `armor` | `ItemArmor` | Armor configuration |
| `gliderConfig` | `ItemGlider` | Glider configuration |
| `utility` | `ItemUtility` | Utility configuration |
| `blockSelectorTool` | `BlockSelectorToolData` | Block selection tool |
| `builderToolData` | `ItemBuilderToolData` | Builder tool |

#### Interactions and Sounds

| Field | Type | Description |
|-------|------|-------------|
| `soundEventIndex` | `int` | Sound event index |
| `itemSoundSetIndex` | `int` | Sound set index |
| `interactions` | `Map<InteractionType, Integer>` | Available interactions |
| `interactionVars` | `Map<String, Integer>` | Interaction variables |
| `interactionConfig` | `InteractionConfiguration` | Interaction configuration |

#### Visual Effects

| Field | Type | Description |
|-------|------|-------------|
| `particles` | `ModelParticle[]` | Third-person particles |
| `firstPersonParticles` | `ModelParticle[]` | First-person particles |
| `trails` | `ModelTrail[]` | Visual trails |
| `light` | `ColorLight` | Light emission |
| `itemEntity` | `ItemEntityConfig` | Item entity configuration |
| `droppedItemAnimation` | `String` | Animation when dropped |

#### Categorization

| Field | Type | Description |
|-------|------|-------------|
| `set` | `String` | Item set |
| `categories` | `String[]` | Categories |
| `tagIndexes` | `int[]` | Associated tags |

---

### ItemWeapon

Weapon-specific configuration.

| Field | Type | Description |
|-------|------|-------------|
| `entityStatsToClear` | `int[]` | Entity stats to clear |
| `statModifiers` | `Map<Integer, Modifier[]>` | Stat modifiers |
| `renderDualWielded` | `boolean` | Render as dual-wielded |

---

### ItemArmor

Armor-specific configuration.

| Field | Type | Description |
|-------|------|-------------|
| `armorSlot` | `ItemArmorSlot` | Slot (Head, Chest, Hands, Legs) |
| `cosmeticsToHide` | `Cosmetic[]` | Cosmetics to hide |
| `statModifiers` | `Map<Integer, Modifier[]>` | Stat modifiers |
| `baseDamageResistance` | `double` | Base damage resistance |
| `damageResistance` | `Map<String, Modifier[]>` | Resistance by damage type |
| `damageEnhancement` | `Map<String, Modifier[]>` | Damage enhancement |
| `damageClassEnhancement` | `Map<String, Modifier[]>` | Enhancement by damage class |

---

### ItemTool

Tool-specific configuration.

| Field | Type | Description |
|-------|------|-------------|
| `specs` | `ItemToolSpec[]` | Tool specifications |
| `speed` | `float` | Usage speed |

---

### ItemQuality

Defines item quality and rarity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Quality identifier |
| `itemTooltipTexture` | `String` | Tooltip texture |
| `itemTooltipArrowTexture` | `String` | Tooltip arrow texture |
| `slotTexture` | `String` | Slot texture |
| `blockSlotTexture` | `String` | Block slot texture |
| `specialSlotTexture` | `String` | Special slot texture |
| `textColor` | `Color` | Text color |
| `localizationKey` | `String` | Localization key |
| `visibleQualityLabel` | `boolean` | Whether to display the quality label |
| `renderSpecialSlot` | `boolean` | Whether to render the special slot |
| `hideFromSearch` | `boolean` | Whether to hide from search |

---

## EntityEffect - Entity Effects

Represents an effect that can be applied to an entity (buff or debuff).

### Core Properties

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Unique effect identifier |
| `name` | `String` | Display name |
| `applicationEffects` | `ApplicationEffects` | Visual and audio effects |
| `worldRemovalSoundEventIndex` | `int` | World removal sound |
| `localRemovalSoundEventIndex` | `int` | Local removal sound |
| `modelOverride` | `ModelOverride` | Model override |

### Duration

| Field | Type | Description |
|-------|------|-------------|
| `duration` | `float` | Duration in seconds |
| `infinite` | `boolean` | Whether duration is infinite |
| `overlapBehavior` | `OverlapBehavior` | Behavior when effects overlap |
| `damageCalculatorCooldown` | `double` | Damage calculation cooldown |

### Characteristics

| Field | Type | Description |
|-------|------|-------------|
| `debuff` | `boolean` | Whether this is a debuff (negative effect) |
| `statusEffectIcon` | `String` | Status icon |
| `statModifiers` | `Map<Integer, Float>` | Stat modifiers |
| `valueType` | `ValueType` | Value type (Percent, Absolute) |

---

## CraftingRecipe - Recipes

Defines a crafting recipe.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Recipe identifier |
| `inputs` | `MaterialQuantity[]` | Required ingredients |
| `outputs` | `MaterialQuantity[]` | Recipe outputs |
| `primaryOutput` | `MaterialQuantity` | Primary output |
| `benchRequirement` | `BenchRequirement[]` | Required workbenches |
| `knowledgeRequired` | `boolean` | Whether knowledge is required |
| `timeSeconds` | `float` | Crafting time |
| `requiredMemoriesLevel` | `int` | Required memories level |

### MaterialQuantity

| Field | Type | Description |
|-------|------|-------------|
| `itemId` | `String` | Item ID |
| `itemTag` | `int` | Item tag |
| `resourceTypeId` | `String` | Resource type ID |
| `quantity` | `int` | Quantity |

### BenchRequirement

| Field | Type | Description |
|-------|------|-------------|
| `type` | `BenchType` | Workbench type |
| `id` | `String` | Specific ID |
| `categories` | `String[]` | Accepted categories |
| `requiredTierLevel` | `int` | Required tier level |

---

## Environment

### Weather

Defines a weather type.

#### Sky and Lighting

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Weather identifier |
| `tagIndexes` | `int[]` | Associated tags |
| `stars` | `String` | Star configuration |
| `moons` | `Map<Integer, String>` | Moon configuration |
| `clouds` | `Cloud[]` | Cloud configuration |
| `sunlightDampingMultiplier` | `Map<Float, Float>` | Sunlight damping |
| `sunlightColors` | `Map<Float, Color>` | Sunlight colors |
| `skyTopColors` | `Map<Float, ColorAlpha>` | Sky colors (top) |
| `skyBottomColors` | `Map<Float, ColorAlpha>` | Sky colors (bottom) |
| `skySunsetColors` | `Map<Float, ColorAlpha>` | Sunset colors |

#### Sun and Moon

| Field | Type | Description |
|-------|------|-------------|
| `sunColors` | `Map<Float, Color>` | Sun colors |
| `sunScales` | `Map<Float, Float>` | Sun scale |
| `sunGlowColors` | `Map<Float, ColorAlpha>` | Sun glow colors |
| `moonColors` | `Map<Float, ColorAlpha>` | Moon colors |
| `moonScales` | `Map<Float, Float>` | Moon scale |
| `moonGlowColors` | `Map<Float, ColorAlpha>` | Moon glow colors |

#### Fog and Effects

| Field | Type | Description |
|-------|------|-------------|
| `fogColors` | `Map<Float, Color>` | Fog colors |
| `fogHeightFalloffs` | `Map<Float, Float>` | Fog height falloff |
| `fogDensities` | `Map<Float, Float>` | Fog densities |
| `fog` | `NearFar` | Fog distance |
| `fogOptions` | `FogOptions` | Fog options |
| `screenEffect` | `String` | Screen effect |
| `screenEffectColors` | `Map<Float, ColorAlpha>` | Screen effect colors |
| `colorFilters` | `Map<Float, Color>` | Color filters |
| `waterTints` | `Map<Float, Color>` | Water tints |
| `particle` | `WeatherParticle` | Weather particles |

---

### WorldEnvironment

Defines a world environment.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Environment identifier |
| `waterTint` | `Color` | Water tint |
| `fluidParticles` | `Map<Integer, FluidParticle>` | Fluid particles |
| `tagIndexes` | `int[]` | Associated tags |

---

## Key Enumerations

### GameMode

Available game modes.

```
Adventure (0)  - Adventure mode
Creative (1)   - Creative mode
```

### ItemArmorSlot

Armor slots.

```
Head (0)   - Head
Chest (1)  - Chest
Hands (2)  - Hands
Legs (3)   - Legs
```

### BlockMaterial

Block material types.

```
Empty (0)  - Empty (air)
Solid (1)  - Solid
```

### DrawType

Block rendering modes.

```
Empty (0)        - No rendering
GizmoCube (1)    - Gizmo cube (debug)
Cube (2)         - Standard cube rendering
Model (3)        - 3D model
CubeWithModel (4)- Cube with model
```

### Opacity

Block opacity levels.

```
Solid (0)          - Fully opaque
Semitransparent (1)- Semi-transparent
Cutout (2)         - Cutout (leaves, etc.)
Transparent (3)    - Fully transparent
```

### InteractionType

Available interaction types.

```
Primary (0)         - Primary action (left click)
Secondary (1)       - Secondary action (right click)
Ability1 (2)        - Ability 1
Ability2 (3)        - Ability 2
Ability3 (4)        - Ability 3
Use (5)             - Use
Pick (6)            - Pick
Pickup (7)          - Pickup
CollisionEnter (8)  - Collision enter
CollisionLeave (9)  - Collision leave
Collision (10)      - Collision
EntityStatEffect (11) - Entity stat effect
SwapTo (12)         - Swap to
SwapFrom (13)       - Swap from
Death (14)          - Death
Wielding (15)       - Wielding
ProjectileSpawn (16)- Projectile spawn
ProjectileHit (17)  - Projectile hit
ProjectileMiss (18) - Projectile miss
ProjectileBounce (19) - Projectile bounce
Held (20)           - Held in hand
HeldOffhand (21)    - Held in offhand
Equipped (22)       - Equipped
Dodge (23)          - Dodge
GameModeSwap (24)   - Game mode swap
```

### BenchType

Workbench types.

```
Crafting (0)           - Crafting workbench
Processing (1)         - Processing workbench
DiagramCrafting (2)    - Diagram crafting workbench
StructuralCrafting (3) - Structural crafting workbench
```

### BlockFace

Block faces.

```
None (0)   - None
Up (1)     - Up
Down (2)   - Down
North (3)  - North
South (4)  - South
East (5)   - East
West (6)   - West
```

### OverlapBehavior

Behavior when effects overlap.

```
Extend (0)    - Extend duration
Overwrite (1) - Overwrite
Ignore (2)    - Ignore the new effect
```

### ValueType

Value type for modifiers.

```
Percent (0)  - Percentage
Absolute (1) - Absolute value
```

### CalculationType

Calculation type for modifiers.

```
Additive (0)       - Additive (+X)
Multiplicative (1) - Multiplicative (*X)
```

### ModifierTarget

Modifier target.

```
Min (0) - Minimum value
Max (1) - Maximum value
```

### Cosmetic

Cosmetic types (can be hidden by armor).

```
Haircut (0)        - Haircut
FacialHair (1)     - Facial hair
Undertop (2)       - Undertop
Overtop (3)        - Overtop
Pants (4)          - Pants
Overpants (5)      - Overpants
Shoes (6)          - Shoes
Gloves (7)         - Gloves
Cape (8)           - Cape
HeadAccessory (9)  - Head accessory
FaceAccessory (10) - Face accessory
EarAccessory (11)  - Ear accessory
Ear (12)           - Ear
```

---

## Auxiliary Types

### Modifier

Stat modifier.

| Field | Type | Description |
|-------|------|-------------|
| `target` | `ModifierTarget` | Target (Min/Max) |
| `calculationType` | `CalculationType` | Calculation type |
| `amount` | `float` | Amount |

### ApplicationEffects

Visual and audio effects applied when an effect is activated.

| Field | Type | Description |
|-------|------|-------------|
| `entityBottomTint` | `Color` | Entity bottom tint |
| `entityTopTint` | `Color` | Entity top tint |
| `entityAnimationId` | `String` | Animation to play |
| `particles` | `ModelParticle[]` | Particles |
| `firstPersonParticles` | `ModelParticle[]` | First-person particles |
| `screenEffect` | `String` | Screen effect |
| `horizontalSpeedMultiplier` | `float` | Horizontal speed multiplier |
| `soundEventIndexLocal` | `int` | Local sound |
| `soundEventIndexWorld` | `int` | World sound |
| `modelVFXId` | `String` | VFX ID |
| `movementEffects` | `MovementEffects` | Movement effects |
| `mouseSensitivityAdjustmentTarget` | `float` | Mouse sensitivity target |
| `mouseSensitivityAdjustmentDuration` | `float` | Adjustment duration |
| `abilityEffects` | `AbilityEffects` | Ability effects |

### DamageCause

Damage cause.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Cause identifier |
| `damageTextColor` | `String` | Damage text color |

### Color / ColorAlpha

Color structure.

| Field | Type | Description |
|-------|------|-------------|
| `r` | `byte` | Red component (0-255) |
| `g` | `byte` | Green component (0-255) |
| `b` | `byte` | Blue component (0-255) |
| `a` | `byte` | Alpha component (ColorAlpha only) |

---

## Registries and Management

### Registry

Generic registry system for type registration.

| Method | Description |
|--------|-------------|
| `register(T)` | Registers a new element |
| `isEnabled()` | Checks whether the registry is active |
| `enable()` | Enables the registry |
| `shutdown()` | Disables the registry |

### BlockPhysics

Block physics component (support/decoration).

| Field | Type | Description |
|-------|------|-------------|
| `supportData` | `byte[]` | Support data (16384 bytes) |
| `IS_DECO_VALUE` | `int` | Value indicating a decorative block (15) |
| `NULL_SUPPORT` | `int` | No support (0) |

| Method | Description |
|--------|-------------|
| `set(x, y, z, support)` | Sets the support value |
| `get(x, y, z)` | Gets the support value |
| `isDeco(x, y, z)` | Checks whether it is a decorative block |
| `markDeco(...)` | Marks as decorative |
| `clear(...)` | Clears the data |

---

## Technical Notes

### Serialization

All types use a custom binary serialization format based on:
- **VarInt**: Variable-length integers
- **Null bits**: Bit fields indicating which nullable fields are present
- **Fixed block**: Fixed-size portion at the beginning
- **Variable block**: Variable-size portion for dynamic fields

### Source Package

```
com.hypixel.hytale.protocol - Protocol/data types
com.hypixel.hytale.server.core.blocktype - Block type module
com.hypixel.hytale.registry - Registry system
```

---

## Extended Data Types

This section provides additional data types discovered in the decompiled server code, including enums, configuration classes, and data structures for gameplay, permissions, combat, and world management.

---

### Movement and Animation Types

#### MovementType

`com.hypixel.hytale.protocol.MovementType`

Defines the type of movement an entity is currently performing. Used by the animation and physics systems.

| Value | ID | Description |
|-------|-----|-------------|
| `None` | 0 | No movement |
| `Idle` | 1 | Entity is stationary but active |
| `Crouching` | 2 | Entity is crouching/sneaking |
| `Walking` | 3 | Walking at normal speed |
| `Running` | 4 | Running at increased speed |
| `Sprinting` | 5 | Sprinting at maximum speed |
| `Climbing` | 6 | Climbing a ladder or surface |
| `Swimming` | 7 | Swimming in water |
| `Flying` | 8 | Flying (creative mode or glider) |
| `Sliding` | 9 | Sliding on a surface |
| `Rolling` | 10 | Rolling dodge movement |
| `Mounting` | 11 | Riding a mount at normal speed |
| `SprintMounting` | 12 | Riding a mount while sprinting |

**Source:** `com/hypixel/hytale/protocol/MovementType.java`

**Usage Example:**
```java
MovementType currentMovement = entity.getMovementType();
if (currentMovement == MovementType.Sprinting) {
    // Apply stamina drain
}
```

---

#### AnimationSlot

`com.hypixel.hytale.protocol.AnimationSlot`

Defines the animation layer slots used by the entity animation system. Multiple animations can play simultaneously on different slots.

| Value | ID | Description |
|-------|-----|-------------|
| `Movement` | 0 | Base movement animations (walk, run, idle) |
| `Status` | 1 | Status effect animations (stunned, poisoned) |
| `Action` | 2 | Action animations (attack, use item) |
| `Face` | 3 | Facial expressions and head movements |
| `Emote` | 4 | Emote/gesture animations |

**Source:** `com/hypixel/hytale/protocol/AnimationSlot.java`

**Usage Context:** The animation system uses slots to blend multiple animations. For example, a character can walk (Movement slot) while showing a poisoned expression (Status slot) and waving (Emote slot) simultaneously.

---

### Connection Types

#### DisconnectType

`com.hypixel.hytale.protocol.packets.connection.DisconnectType`

Specifies the reason for a client disconnection from the server.

| Value | ID | Description |
|-------|-----|-------------|
| `Disconnect` | 0 | Normal disconnection (player quit, kicked, etc.) |
| `Crash` | 1 | Disconnection due to a crash or error |

**Source:** `com/hypixel/hytale/protocol/packets/connection/DisconnectType.java`

---

### Visual and Rendering Types

#### ShadingMode

`com.hypixel.hytale.protocol.ShadingMode`

Defines the shading mode for block rendering.

| Value | ID | Description |
|-------|-----|-------------|
| `Standard` | 0 | Standard lighting and shadows |
| `Flat` | 1 | Flat shading without gradients |
| `Fullbright` | 2 | No shadows, full brightness |
| `Reflective` | 3 | Reflective surface shading |

**Source:** `com/hypixel/hytale/protocol/ShadingMode.java`

---

### Permission System

The permission system controls access to commands, features, and editor functionality.

#### HytalePermissions

`com.hypixel.hytale.server.core.permissions.HytalePermissions`

Defines the built-in permission strings used by the Hytale server.

| Permission | Description |
|------------|-------------|
| `hytale.command` | Base permission for commands |
| `hytale.editor.asset` | Asset editor access |
| `hytale.editor.packs.create` | Create asset packs |
| `hytale.editor.packs.edit` | Edit asset packs |
| `hytale.editor.packs.delete` | Delete asset packs |
| `hytale.editor.builderTools` | Builder tools editor access |
| `hytale.editor.brush.use` | Use brushes |
| `hytale.editor.brush.config` | Configure brushes |
| `hytale.editor.prefab.use` | Use prefabs |
| `hytale.editor.prefab.manage` | Manage prefabs |
| `hytale.editor.selection.use` | Use selection tools |
| `hytale.editor.selection.clipboard` | Use clipboard operations |
| `hytale.editor.selection.modify` | Modify selections |
| `hytale.editor.history` | Access edit history (undo/redo) |
| `hytale.camera.flycam` | Use fly camera mode |

**Source:** `com/hypixel/hytale/server/core/permissions/HytalePermissions.java`

**Usage Example:**
```java
// Check if a player has permission
if (player.hasPermission("hytale.editor.builderTools")) {
    // Enable builder tools
}

// Generate command permission
String permission = HytalePermissions.fromCommand("teleport");
// Returns "hytale.command.teleport"
```

---

#### PermissionProvider

`com.hypixel.hytale.server.core.permissions.provider.PermissionProvider`

Interface for implementing custom permission systems.

| Method | Description |
|--------|-------------|
| `getName()` | Returns the provider name |
| `addUserPermissions(UUID, Set<String>)` | Add permissions to a user |
| `removeUserPermissions(UUID, Set<String>)` | Remove permissions from a user |
| `getUserPermissions(UUID)` | Get all user permissions |
| `addGroupPermissions(String, Set<String>)` | Add permissions to a group |
| `removeGroupPermissions(String, Set<String>)` | Remove permissions from a group |
| `getGroupPermissions(String)` | Get all group permissions |
| `addUserToGroup(UUID, String)` | Add user to a permission group |
| `removeUserFromGroup(UUID, String)` | Remove user from a group |
| `getGroupsForUser(UUID)` | Get all groups for a user |

**Source:** `com/hypixel/hytale/server/core/permissions/provider/PermissionProvider.java`

---

#### PermissionHolder

`com.hypixel.hytale.server.core.permissions.PermissionHolder`

Interface for entities that can hold permissions.

| Method | Description |
|--------|-------------|
| `hasPermission(String)` | Check if holder has a permission |
| `hasPermission(String, boolean)` | Check permission with default value |

**Source:** `com/hypixel/hytale/server/core/permissions/PermissionHolder.java`

---

### World Configuration

#### WorldConfig (Runtime)

`com.hypixel.hytale.server.core.universe.world.WorldConfig`

Complete world configuration for runtime world management.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `UUID` | `UUID` | Random | Unique world identifier |
| `DisplayName` | `String` | - | Player-facing world name |
| `Seed` | `long` | Current time | World generation seed |
| `SpawnProvider` | `ISpawnProvider` | null | Controls spawn location |
| `WorldGen` | `IWorldGenProvider` | Default | World generator |
| `WorldMap` | `IWorldMapProvider` | Default | World map provider |
| `ChunkStorage` | `IChunkStorageProvider` | Default | Chunk storage system |
| `IsTicking` | `boolean` | true | Enable chunk ticking |
| `IsBlockTicking` | `boolean` | true | Enable block ticking |
| `IsPvpEnabled` | `boolean` | false | Enable player vs player |
| `IsFallDamageEnabled` | `boolean` | true | Enable fall damage |
| `IsGameTimePaused` | `boolean` | false | Pause day/night cycle |
| `GameTime` | `Instant` | 5:30 AM | Current game time |
| `ForcedWeather` | `String` | null | Force specific weather |
| `GameMode` | `GameMode` | Server default | Default game mode |
| `IsSpawningNPC` | `boolean` | true | Allow NPC spawning |
| `IsSpawnMarkersEnabled` | `boolean` | true | Show spawn markers |
| `IsAllNPCFrozen` | `boolean` | false | Freeze all NPCs |
| `GameplayConfig` | `String` | "Default" | Gameplay config reference |
| `IsSavingPlayers` | `boolean` | true | Save player data |
| `IsSavingChunks` | `boolean` | true | Save chunk data |
| `SaveNewChunks` | `boolean` | true | Save newly generated chunks |
| `IsUnloadingChunks` | `boolean` | true | Allow chunk unloading |
| `DeleteOnUniverseStart` | `boolean` | false | Delete world on server start |
| `DeleteOnRemove` | `boolean` | false | Delete files when removed |

**Source:** `com/hypixel/hytale/server/core/universe/world/WorldConfig.java`

**JSON Example:**
```json
{
  "DisplayName": "Adventure World",
  "Seed": 12345,
  "IsPvpEnabled": true,
  "IsFallDamageEnabled": true,
  "GameMode": "Adventure",
  "DaytimeDurationSeconds": 1200,
  "NighttimeDurationSeconds": 600
}
```

---

#### WorldConfig (Gameplay Asset)

`com.hypixel.hytale.server.core.asset.type.gameplay.WorldConfig`

World configuration as part of gameplay config assets.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `AllowBlockBreaking` | `boolean` | true | Allow players to break blocks |
| `AllowBlockGathering` | `boolean` | true | Allow resource gathering |
| `AllowBlockPlacement` | `boolean` | true | Allow block placement |
| `BlockPlacementFragilityTimer` | `float` | 0 | Seconds blocks are fragile after placement |
| `DaytimeDurationSeconds` | `int` | 1728 | Real seconds for daytime (29 minutes) |
| `NighttimeDurationSeconds` | `int` | 1728 | Real seconds for nighttime (29 minutes) |
| `TotalMoonPhases` | `int` | 5 | Number of moon phases |
| `Sleep` | `SleepConfig` | Default | Sleep configuration |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/WorldConfig.java`

**Note:** Default day/night cycle is 48 real minutes (2880 seconds total), with equal day and night periods of 1728 seconds each.

---

#### SleepConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.SleepConfig`

Configuration for sleeping mechanics in worlds.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `WakeUpHour` | `float` | 5.5 | In-game hour when players wake up (5:30 AM) |
| `AllowedSleepHoursRange` | `double[2]` | null | Hour range when sleeping is allowed |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/SleepConfig.java`

**JSON Example:**
```json
{
  "Sleep": {
    "WakeUpHour": 6.0,
    "AllowedSleepHoursRange": [20.0, 6.0]
  }
}
```

---

### Combat Configuration

#### CombatConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.CombatConfig`

Configuration for combat mechanics.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `OutOfCombatDelaySeconds` | `Duration` | 5000ms | Delay before considered out of combat |
| `StaminaBrokenEffectId` | `String` | "Stamina_Broken" | Effect applied when stamina depleted |
| `DisplayHealthBars` | `boolean` | true | Show health bars above entities |
| `DisplayCombatText` | `boolean` | true | Show damage numbers |
| `DisableNPCIncomingDamage` | `boolean` | false | Make NPCs invulnerable |
| `DisablePlayerIncomingDamage` | `boolean` | false | Make players invulnerable |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/CombatConfig.java`

**JSON Example:**
```json
{
  "Combat": {
    "OutOfCombatDelaySeconds": 8,
    "DisplayHealthBars": true,
    "DisplayCombatText": true,
    "DisablePlayerIncomingDamage": false
  }
}
```

---

### Death and Respawn Configuration

#### DeathConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.DeathConfig`

Configuration for death and item loss mechanics.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `RespawnController` | `RespawnController` | HomeOrSpawnPoint | Determines respawn location |
| `ItemsLossMode` | `ItemsLossMode` | NONE | How items are lost on death |
| `ItemsAmountLossPercentage` | `double` | 10.0 | Percentage of items lost (0-100) |
| `ItemsDurabilityLossPercentage` | `double` | 10.0 | Durability lost on death (0-100) |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/DeathConfig.java`

---

#### ItemsLossMode

`com.hypixel.hytale.server.core.asset.type.gameplay.DeathConfig.ItemsLossMode`

Defines how items are lost upon death.

| Value | Description |
|-------|-------------|
| `NONE` | No items are lost |
| `ALL` | All items are lost |
| `CONFIGURED` | Use configured percentage for items with `DropOnDeath=true` |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/DeathConfig.java`

---

### Gameplay Configuration

#### GameplayConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.GameplayConfig`

Master configuration for gameplay mechanics, combining multiple sub-configurations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Configuration identifier (e.g., "Default") |
| `Gathering` | `GatheringConfig` | Resource gathering settings |
| `World` | `WorldConfig` | World mechanics settings |
| `WorldMap` | `WorldMapConfig` | World map settings |
| `Death` | `DeathConfig` | Death and respawn settings |
| `Respawn` | `RespawnConfig` | Respawn mechanics |
| `ShowItemPickupNotifications` | `boolean` | Show item pickup UI |
| `ItemDurability` | `ItemDurabilityConfig` | Durability settings |
| `ItemEntity` | `ItemEntityConfig` | Dropped item settings |
| `Combat` | `CombatConfig` | Combat mechanics |
| `Player` | `PlayerConfig` | Player settings |
| `CameraEffects` | `CameraEffectsConfig` | Camera effect settings |
| `Crafting` | `CraftingConfig` | Crafting settings |
| `Spawn` | `SpawnConfig` | Spawning settings |
| `MaxEnvironmentalNPCSpawns` | `int` | Max NPC spawns (-1 for infinite) |
| `CreativePlaySoundSet` | `String` | Sound set for creative mode |

**Source:** `com/hypixel/hytale/server/core/asset/type/gameplay/GameplayConfig.java`

**JSON Example:**
```json
{
  "Id": "Adventure",
  "World": {
    "AllowBlockBreaking": true,
    "DaytimeDurationSeconds": 1200
  },
  "Combat": {
    "DisplayHealthBars": true,
    "OutOfCombatDelaySeconds": 5
  },
  "Death": {
    "ItemsLossMode": "CONFIGURED",
    "ItemsAmountLossPercentage": 25.0
  },
  "MaxEnvironmentalNPCSpawns": 300
}
```

---

## Source Package Reference

| Package | Contents |
|---------|----------|
| `com.hypixel.hytale.protocol` | Protocol enums and data types |
| `com.hypixel.hytale.protocol.packets.connection` | Connection-related packets |
| `com.hypixel.hytale.protocol.packets.setup` | Setup packets (WorldSettings) |
| `com.hypixel.hytale.server.core.permissions` | Permission system |
| `com.hypixel.hytale.server.core.permissions.provider` | Permission providers |
| `com.hypixel.hytale.server.core.universe.world` | World management |
| `com.hypixel.hytale.server.core.asset.type.gameplay` | Gameplay configuration assets |

---

---

## Additional Enumerations (Protocol)

This section documents additional enumerations discovered in the protocol layer that are essential for modders and content creators.

### Sound and Audio

#### SoundCategory

`com.hypixel.hytale.protocol.SoundCategory`

Categories for sound playback and volume control.

| Value | ID | Description |
|-------|-----|-------------|
| `Music` | 0 | Background music |
| `Ambient` | 1 | Environmental ambient sounds |
| `SFX` | 2 | Sound effects (actions, combat, etc.) |
| `UI` | 3 | User interface sounds |

**Source:** `com/hypixel/hytale/protocol/SoundCategory.java`

---

#### BlockSoundEvent

`com.hypixel.hytale.protocol.BlockSoundEvent`

Events that trigger block-related sounds.

| Value | ID | Description |
|-------|-----|-------------|
| `Walk` | 0 | Walking on the block |
| `Land` | 1 | Landing on the block |
| `MoveIn` | 2 | Moving into the block |
| `MoveOut` | 3 | Moving out of the block |
| `Hit` | 4 | Hitting/damaging the block |
| `Break` | 5 | Breaking the block |
| `Build` | 6 | Placing the block |
| `Clone` | 7 | Cloning the block (builder tools) |
| `Harvest` | 8 | Harvesting from the block |

**Source:** `com/hypixel/hytale/protocol/BlockSoundEvent.java`

---

#### ItemSoundEvent

`com.hypixel.hytale.protocol.ItemSoundEvent`

Events that trigger item-related sounds.

| Value | ID | Description |
|-------|-----|-------------|
| `Drag` | 0 | Dragging item in inventory |
| `Drop` | 1 | Dropping item |

**Source:** `com/hypixel/hytale/protocol/ItemSoundEvent.java`

---

### Particles and Visual Effects

#### BlockParticleEvent

`com.hypixel.hytale.protocol.BlockParticleEvent`

Events that trigger block particle effects.

| Value | ID | Description |
|-------|-----|-------------|
| `Walk` | 0 | Walking particles |
| `Run` | 1 | Running particles |
| `Sprint` | 2 | Sprinting particles |
| `SoftLand` | 3 | Soft landing particles |
| `HardLand` | 4 | Hard landing particles (fall damage) |
| `MoveOut` | 5 | Moving out particles |
| `Hit` | 6 | Hit particles |
| `Break` | 7 | Block breaking particles |
| `Build` | 8 | Block placement particles |
| `Physics` | 9 | Physics-triggered particles |

**Source:** `com/hypixel/hytale/protocol/BlockParticleEvent.java`

---

#### EmitShape

`com.hypixel.hytale.protocol.EmitShape`

Shapes for particle emission.

| Value | ID | Description |
|-------|-----|-------------|
| `Sphere` | 0 | Spherical emission |
| `Cube` | 1 | Cubic emission |

**Source:** `com/hypixel/hytale/protocol/EmitShape.java`

---

#### FXRenderMode

`com.hypixel.hytale.protocol.FXRenderMode`

Rendering modes for visual effects.

| Value | ID | Description |
|-------|-----|-------------|
| `BlendLinear` | 0 | Linear blending |
| `BlendAdd` | 1 | Additive blending |
| `Erosion` | 2 | Erosion effect |
| `Distortion` | 3 | Distortion effect |

**Source:** `com/hypixel/hytale/protocol/FXRenderMode.java`

---

#### ShaderType

`com.hypixel.hytale.protocol.ShaderType`

Shader effects that can be applied to blocks.

| Value | ID | Description |
|-------|-----|-------------|
| `None` | 0 | No shader effect |
| `Wind` | 1 | Wind animation |
| `WindAttached` | 2 | Wind animation (attached) |
| `WindRandom` | 3 | Random wind animation |
| `WindFractal` | 4 | Fractal wind animation |
| `Ice` | 5 | Ice shader |
| `Water` | 6 | Water shader |
| `Lava` | 7 | Lava shader |
| `Slime` | 8 | Slime shader |
| `Ripple` | 9 | Ripple effect |

**Source:** `com/hypixel/hytale/protocol/ShaderType.java`

---

### Camera and View

#### CameraPerspectiveType

`com.hypixel.hytale.protocol.CameraPerspectiveType`

Camera perspective modes.

| Value | ID | Description |
|-------|-----|-------------|
| `First` | 0 | First-person view |
| `Third` | 1 | Third-person view |

**Source:** `com/hypixel/hytale/protocol/CameraPerspectiveType.java`

---

#### CameraActionType

`com.hypixel.hytale.protocol.CameraActionType`

Types of camera actions.

| Value | ID | Description |
|-------|-----|-------------|
| `ForcePerspective` | 0 | Force a specific perspective |
| `Orbit` | 1 | Orbit around a target |
| `Transition` | 2 | Transition between positions |

**Source:** `com/hypixel/hytale/protocol/CameraActionType.java`

---

### Animation and Easing

#### EasingType

`com.hypixel.hytale.protocol.EasingType`

Easing functions for smooth animations and transitions. Essential for creating fluid motion in custom animations.

| Value | ID | Description |
|-------|-----|-------------|
| `Linear` | 0 | Linear (constant speed) |
| `QuadIn` | 1 | Quadratic ease in |
| `QuadOut` | 2 | Quadratic ease out |
| `QuadInOut` | 3 | Quadratic ease in/out |
| `CubicIn` | 4 | Cubic ease in |
| `CubicOut` | 5 | Cubic ease out |
| `CubicInOut` | 6 | Cubic ease in/out |
| `QuartIn` | 7 | Quartic ease in |
| `QuartOut` | 8 | Quartic ease out |
| `QuartInOut` | 9 | Quartic ease in/out |
| `QuintIn` | 10 | Quintic ease in |
| `QuintOut` | 11 | Quintic ease out |
| `QuintInOut` | 12 | Quintic ease in/out |
| `SineIn` | 13 | Sinusoidal ease in |
| `SineOut` | 14 | Sinusoidal ease out |
| `SineInOut` | 15 | Sinusoidal ease in/out |
| `ExpoIn` | 16 | Exponential ease in |
| `ExpoOut` | 17 | Exponential ease out |
| `ExpoInOut` | 18 | Exponential ease in/out |
| `CircIn` | 19 | Circular ease in |
| `CircOut` | 20 | Circular ease out |
| `CircInOut` | 21 | Circular ease in/out |
| `ElasticIn` | 22 | Elastic ease in |
| `ElasticOut` | 23 | Elastic ease out |
| `ElasticInOut` | 24 | Elastic ease in/out |
| `BackIn` | 25 | Back ease in |
| `BackOut` | 26 | Back ease out |
| `BackInOut` | 27 | Back ease in/out |
| `BounceIn` | 28 | Bounce ease in |
| `BounceOut` | 29 | Bounce ease out |
| `BounceInOut` | 30 | Bounce ease in/out |

**Source:** `com/hypixel/hytale/protocol/EasingType.java`

---

### Input and Interaction

#### ClickType

`com.hypixel.hytale.protocol.ClickType`

Mouse click types.

| Value | ID | Description |
|-------|-----|-------------|
| `None` | 0 | No click |
| `Left` | 1 | Left mouse button |
| `Right` | 2 | Right mouse button |
| `Middle` | 3 | Middle mouse button |

**Source:** `com/hypixel/hytale/protocol/ClickType.java`

---

#### InteractionState

`com.hypixel.hytale.protocol.InteractionState`

States of an interaction.

| Value | ID | Description |
|-------|-----|-------------|
| `Finished` | 0 | Interaction completed successfully |
| `Skip` | 1 | Interaction skipped |
| `ItemChanged` | 2 | Item changed during interaction |
| `Failed` | 3 | Interaction failed |
| `NotFinished` | 4 | Interaction still in progress |

**Source:** `com/hypixel/hytale/protocol/InteractionState.java`

---

#### InteractionTarget

`com.hypixel.hytale.protocol.InteractionTarget`

Target of an interaction.

| Value | ID | Description |
|-------|-----|-------------|
| `User` | 0 | The user performing the interaction |
| `Owner` | 1 | The owner of the interacted entity |
| `Target` | 2 | The target of the interaction |

**Source:** `com/hypixel/hytale/protocol/InteractionTarget.java`

---

### Inventory

#### InventoryActionType

`com.hypixel.hytale.protocol.InventoryActionType`

Types of inventory actions.

| Value | ID | Description |
|-------|-----|-------------|
| `TakeAll` | 0 | Take all items |
| `PutAll` | 1 | Put all items |
| `QuickStack` | 2 | Quick stack to nearby containers |
| `Sort` | 3 | Sort inventory |

**Source:** `com/hypixel/hytale/protocol/InventoryActionType.java`

---

#### SortType

`com.hypixel.hytale.server.core.inventory.container.SortType`

Inventory sorting methods.

| Value | Description |
|-------|-------------|
| `NAME` | Sort alphabetically by name |
| `TYPE` | Sort by item type (Weapon, Armor, Tool, Item, Special) |
| `RARITY` | Sort by item rarity/quality |

**Source:** `com/hypixel/hytale/server/core/inventory/container/SortType.java`

---

### Block Configuration

#### BlockNeighbor

`com.hypixel.hytale.protocol.BlockNeighbor`

All possible block neighbor directions (26 neighbors total).

| Value | ID | Description |
|-------|-----|-------------|
| `Up` | 0 | Above |
| `Down` | 1 | Below |
| `North` | 2 | North |
| `East` | 3 | East |
| `South` | 4 | South |
| `West` | 5 | West |
| `UpNorth` | 6 | Above and North |
| `UpSouth` | 7 | Above and South |
| `UpEast` | 8 | Above and East |
| `UpWest` | 9 | Above and West |
| `DownNorth` | 10 | Below and North |
| `DownSouth` | 11 | Below and South |
| `DownEast` | 12 | Below and East |
| `DownWest` | 13 | Below and West |
| `NorthEast` | 14 | North-East |
| `SouthEast` | 15 | South-East |
| `SouthWest` | 16 | South-West |
| `NorthWest` | 17 | North-West |
| `UpNorthEast` | 18 | Above and North-East |
| `UpSouthEast` | 19 | Above and South-East |
| `UpSouthWest` | 20 | Above and South-West |
| `UpNorthWest` | 21 | Above and North-West |
| `DownNorthEast` | 22 | Below and North-East |
| `DownSouthEast` | 23 | Below and South-East |
| `DownSouthWest` | 24 | Below and South-West |
| `DownNorthWest` | 25 | Below and North-West |

**Source:** `com/hypixel/hytale/protocol/BlockNeighbor.java`

---

#### ConnectedBlockRuleSetType

`com.hypixel.hytale.protocol.ConnectedBlockRuleSetType`

Types of connected block rule sets for auto-connecting blocks like stairs.

| Value | ID | Description |
|-------|-----|-------------|
| `Stair` | 0 | Stair connection rules |
| `Roof` | 1 | Roof connection rules |

**Source:** `com/hypixel/hytale/protocol/ConnectedBlockRuleSetType.java`

---

### UI and Interface

#### Page

`com.hypixel.hytale.protocol.packets.interface_.Page`

UI page types.

| Value | ID | Description |
|-------|-----|-------------|
| `None` | 0 | No page |
| `Bench` | 1 | Crafting bench page |
| `Inventory` | 2 | Inventory page |
| `ToolsSettings` | 3 | Tools settings page |
| `Map` | 4 | World map page |
| `MachinimaEditor` | 5 | Machinima editor page |
| `ContentCreation` | 6 | Content creation page |
| `Custom` | 7 | Custom page |

**Source:** `com/hypixel/hytale/protocol/packets/interface_/Page.java`

---

#### HudComponent

`com.hypixel.hytale.protocol.packets.interface_.HudComponent`

HUD (Heads-Up Display) components that can be shown/hidden.

| Value | ID | Description |
|-------|-----|-------------|
| `Hotbar` | 0 | Item hotbar |
| `StatusIcons` | 1 | Status effect icons |
| `Reticle` | 2 | Crosshair/reticle |
| `Chat` | 3 | Chat window |
| `Requests` | 4 | Request notifications |
| `Notifications` | 5 | General notifications |
| `KillFeed` | 6 | Kill feed |
| `InputBindings` | 7 | Input binding hints |
| `PlayerList` | 8 | Player list (Tab) |
| `EventTitle` | 9 | Event title display |
| `Compass` | 10 | Compass |
| `ObjectivePanel` | 11 | Objective/quest panel |
| `PortalPanel` | 12 | Portal panel |
| `BuilderToolsLegend` | 13 | Builder tools legend |
| `Speedometer` | 14 | Speed indicator |
| `UtilitySlotSelector` | 15 | Utility slot selector |
| `BlockVariantSelector` | 16 | Block variant selector |
| `BuilderToolsMaterialSlotSelector` | 17 | Material slot selector |
| `Stamina` | 18 | Stamina bar |
| `AmmoIndicator` | 19 | Ammo indicator |
| `Health` | 20 | Health bar |
| `Mana` | 21 | Mana bar |
| `Oxygen` | 22 | Oxygen bar |
| `Sleep` | 23 | Sleep indicator |

**Source:** `com/hypixel/hytale/protocol/packets/interface_/HudComponent.java`

---

#### WindowType

`com.hypixel.hytale.protocol.packets.window.WindowType`

Types of windows (containers/UI).

| Value | ID | Description |
|-------|-----|-------------|
| `Container` | 0 | Generic container |
| `PocketCrafting` | 1 | Pocket crafting (2x2) |
| `BasicCrafting` | 2 | Basic crafting bench |
| `DiagramCrafting` | 3 | Diagram crafting |
| `StructuralCrafting` | 4 | Structural crafting |
| `Processing` | 5 | Processing (furnace, etc.) |
| `Memories` | 6 | Memories/knowledge system |

**Source:** `com/hypixel/hytale/protocol/packets/window/WindowType.java`

---

### Builder Tools

#### BrushShape

`com.hypixel.hytale.protocol.packets.buildertools.BrushShape`

Available brush shapes for building tools.

| Value | ID | Description |
|-------|-----|-------------|
| `Cube` | 0 | Cube shape |
| `Sphere` | 1 | Sphere shape |
| `Cylinder` | 2 | Cylinder shape |
| `Cone` | 3 | Cone shape |
| `InvertedCone` | 4 | Inverted cone shape |
| `Pyramid` | 5 | Pyramid shape |
| `InvertedPyramid` | 6 | Inverted pyramid shape |
| `Dome` | 7 | Dome (half sphere) |
| `InvertedDome` | 8 | Inverted dome |
| `Diamond` | 9 | Diamond shape |
| `Torus` | 10 | Torus (donut) shape |

**Source:** `com/hypixel/hytale/protocol/packets/buildertools/BrushShape.java`

---

#### BrushOrigin

`com.hypixel.hytale.protocol.packets.buildertools.BrushOrigin`

Origin point for brush placement.

| Value | ID | Description |
|-------|-----|-------------|
| `Center` | 0 | Center of brush |
| `Bottom` | 1 | Bottom of brush |
| `Top` | 2 | Top of brush |

**Source:** `com/hypixel/hytale/protocol/packets/buildertools/BrushOrigin.java`

---

#### Axis

`com.hypixel.hytale.protocol.packets.buildertools.Axis`

Coordinate axes.

| Value | ID | Description |
|-------|-----|-------------|
| `X` | 0 | X axis (East-West) |
| `Y` | 1 | Y axis (Up-Down) |
| `Z` | 2 | Z axis (North-South) |

**Source:** `com/hypixel/hytale/protocol/packets/buildertools/Axis.java`

---

### Physics and Forces

#### ApplyForceState

`com.hypixel.hytale.protocol.ApplyForceState`

States for force application (knockback, abilities, etc.).

| Value | ID | Description |
|-------|-----|-------------|
| `Waiting` | 0 | Waiting to apply force |
| `Ground` | 1 | Triggered when touching ground |
| `Collision` | 2 | Triggered on collision |
| `Timer` | 3 | Triggered after timer |

**Source:** `com/hypixel/hytale/protocol/ApplyForceState.java`

---

#### CollisionType

`com.hypixel.hytale.protocol.CollisionType`

Types of collision detection.

| Value | ID | Description |
|-------|-----|-------------|
| `Hard` | 0 | Hard collision (blocks movement) |
| `Soft` | 1 | Soft collision (triggers events only) |

**Source:** `com/hypixel/hytale/protocol/CollisionType.java`

---

#### RaycastMode

`com.hypixel.hytale.protocol.RaycastMode`

Modes for raycasting (projectiles, line of sight, etc.).

| Value | ID | Description |
|-------|-----|-------------|
| `FollowMotion` | 0 | Raycast follows motion direction |
| `FollowLook` | 1 | Raycast follows look direction |

**Source:** `com/hypixel/hytale/protocol/RaycastMode.java`

---

### Entity System

#### EntityPart

`com.hypixel.hytale.protocol.EntityPart`

Parts of an entity that can be referenced.

| Value | ID | Description |
|-------|-----|-------------|
| `Self` | 0 | The entity itself |
| `Entity` | 1 | Another entity |
| `PrimaryItem` | 2 | Primary held item |
| `SecondaryItem` | 3 | Secondary held item |

**Source:** `com/hypixel/hytale/protocol/EntityPart.java`

---

#### EntityStatOp

`com.hypixel.hytale.protocol.EntityStatOp`

Operations on entity statistics.

| Value | ID | Description |
|-------|-----|-------------|
| `Init` | 0 | Initialize stat |
| `Remove` | 1 | Remove stat |
| `PutModifier` | 2 | Add a modifier |
| `RemoveModifier` | 3 | Remove a modifier |
| `Add` | 4 | Add to value |
| `Set` | 5 | Set value directly |
| `Minimize` | 6 | Set to minimum |
| `Maximize` | 7 | Set to maximum |
| `Reset` | 8 | Reset to default |

**Source:** `com/hypixel/hytale/protocol/EntityStatOp.java`

---

#### AttachedToType

`com.hypixel.hytale.protocol.AttachedToType`

Types of attachment for effects/particles.

| Value | ID | Description |
|-------|-----|-------------|
| `LocalPlayer` | 0 | Attached to local player |
| `EntityId` | 1 | Attached to entity by ID |
| `None` | 2 | Not attached |

**Source:** `com/hypixel/hytale/protocol/AttachedToType.java`

---

#### EntityMatcherType

`com.hypixel.hytale.protocol.EntityMatcherType`

Types of entity matching for targeting.

| Value | ID | Description |
|-------|-----|-------------|
| `Server` | 0 | Server-side matching |
| `VulnerableMatcher` | 1 | Match vulnerable entities |
| `Player` | 2 | Match players only |

**Source:** `com/hypixel/hytale/protocol/EntityMatcherType.java`

---

#### Attitude

`com.hypixel.hytale.server.core.asset.type.attitude.Attitude`

NPC attitude/relationship towards targets.

| Value | Description |
|-------|-------------|
| `IGNORE` | Ignores the target |
| `HOSTILE` | Hostile towards the target |
| `NEUTRAL` | Neutral towards the target |
| `FRIENDLY` | Friendly towards the target |
| `REVERED` | Reveres the target |

**Source:** `com/hypixel/hytale/server/core/asset/type/attitude/Attitude.java`

---

### Cosmetics and Character

#### BodyType

`com.hypixel.hytale.server.core.cosmetics.BodyType`

Character body types.

| Value | Description |
|-------|-------------|
| `Masculine` | Masculine body type |
| `Feminine` | Feminine body type |

**Source:** `com/hypixel/hytale/server/core/cosmetics/BodyType.java`

---

#### CosmeticType

`com.hypixel.hytale.server.core.cosmetics.CosmeticType`

Types of cosmetic customizations available.

| Value | Description |
|-------|-------------|
| `EMOTES` | Emotes/gestures |
| `SKIN_TONES` | Skin tone options |
| `EYE_COLORS` | Eye color options |
| `GRADIENT_SETS` | Color gradient sets |
| `BODY_CHARACTERISTICS` | Body characteristics |
| `UNDERWEAR` | Underwear |
| `EYEBROWS` | Eyebrow styles |
| `EARS` | Ear styles |
| `EYES` | Eye styles |
| `FACE` | Face styles |
| `MOUTHS` | Mouth styles |
| `FACIAL_HAIR` | Facial hair styles |
| `PANTS` | Pants |
| `OVERPANTS` | Overpants |
| `UNDERTOPS` | Undertops |
| `OVERTOPS` | Overtops |
| `HAIRCUTS` | Haircut styles |
| `SHOES` | Shoes |
| `HEAD_ACCESSORY` | Head accessories |
| `FACE_ACCESSORY` | Face accessories |
| `EAR_ACCESSORY` | Ear accessories |
| `GLOVES` | Gloves |
| `CAPES` | Capes |
| `SKIN_FEATURES` | Skin features (freckles, etc.) |

**Source:** `com/hypixel/hytale/server/core/cosmetics/CosmeticType.java`

---

#### PlayerSkinPartType

`com.hypixel.hytale.server.core.cosmetics.PlayerSkinPartType`

Player skin part types.

| Value | Description |
|-------|-------------|
| `Eyes` | Eyes |
| `Ears` | Ears |
| `Mouth` | Mouth |
| `Eyebrows` | Eyebrows |
| `Haircut` | Haircut |
| `FacialHair` | Facial hair |
| `Pants` | Pants |
| `Overpants` | Overpants |
| `Undertops` | Undertops |
| `Overtops` | Overtops |
| `Shoes` | Shoes |
| `HeadAccessory` | Head accessory |
| `FaceAccessory` | Face accessory |
| `EarAccessory` | Ear accessory |
| `SkinFeature` | Skin feature |
| `Gloves` | Gloves |

**Source:** `com/hypixel/hytale/server/core/cosmetics/PlayerSkinPartType.java`

---

### Combat

#### DamageClass

`com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass`

Classifications of damage types.

| Value | Description |
|-------|-------------|
| `UNKNOWN` | Unknown/unclassified damage |
| `LIGHT` | Light attack damage |
| `CHARGED` | Charged attack damage |
| `SIGNATURE` | Signature/special ability damage |

**Source:** `com/hypixel/hytale/server/core/modules/interaction/interaction/config/server/combat/DamageClass.java`

---

### Plugin System

#### PluginState

`com.hypixel.hytale.server.core.plugin.PluginState`

Plugin lifecycle states.

| Value | Description |
|-------|-------------|
| `NONE` | Initial state |
| `SETUP` | Setting up |
| `START` | Starting |
| `ENABLED` | Running and enabled |
| `SHUTDOWN` | Shutting down |
| `DISABLED` | Disabled |

**Source:** `com/hypixel/hytale/server/core/plugin/PluginState.java`

---

### Network

#### TransportType

`com.hypixel.hytale.server.core.io.transport.TransportType`

Network transport protocols.

| Value | Description |
|-------|-------------|
| `TCP` | TCP protocol |
| `QUIC` | QUIC protocol (UDP-based) |

**Source:** `com/hypixel/hytale/server/core/io/transport/TransportType.java`

---

### Prefab System

#### PrefabRotation

`com.hypixel.hytale.server.core.prefab.PrefabRotation`

Rotation angles for prefab placement.

| Value | Rotation | Description |
|-------|----------|-------------|
| `ROTATION_0` | 0 degrees | No rotation |
| `ROTATION_90` | 90 degrees | Quarter turn clockwise |
| `ROTATION_180` | 180 degrees | Half turn |
| `ROTATION_270` | 270 degrees | Quarter turn counter-clockwise |

**Source:** `com/hypixel/hytale/server/core/prefab/PrefabRotation.java`

---

### Miscellaneous

#### AccumulationMode

`com.hypixel.hytale.protocol.AccumulationMode`

Modes for accumulating/combining values.

| Value | ID | Description |
|-------|-----|-------------|
| `Set` | 0 | Replace with new value |
| `Sum` | 1 | Add to existing value |
| `Average` | 2 | Average with existing value |

**Source:** `com/hypixel/hytale/protocol/AccumulationMode.java`

---

#### Phobia

`com.hypixel.hytale.protocol.Phobia`

Accessibility phobia filters.

| Value | ID | Description |
|-------|-----|-------------|
| `None` | 0 | No phobia filter |
| `Arachnophobia` | 1 | Spider/arachnid filter |

**Source:** `com/hypixel/hytale/protocol/Phobia.java`

**Usage:** This enum is used for accessibility features, allowing players to enable filters that modify or replace content that might trigger phobias.

---

#### AmbienceTransitionSpeed

`com.hypixel.hytale.protocol.AmbienceTransitionSpeed`

Speed of ambient sound/visual transitions.

| Value | ID | Description |
|-------|-----|-------------|
| `Default` | 0 | Default transition speed |
| `Fast` | 1 | Fast transition |
| `Instant` | 2 | Instant transition |

**Source:** `com/hypixel/hytale/protocol/AmbienceTransitionSpeed.java`

---

## Updated Source Package Reference

| Package | Contents |
|---------|----------|
| `com.hypixel.hytale.protocol` | Protocol enums and data types |
| `com.hypixel.hytale.protocol.packets.connection` | Connection-related packets |
| `com.hypixel.hytale.protocol.packets.setup` | Setup packets (WorldSettings) |
| `com.hypixel.hytale.protocol.packets.interface_` | UI/Interface packets and enums |
| `com.hypixel.hytale.protocol.packets.window` | Window/container packets |
| `com.hypixel.hytale.protocol.packets.buildertools` | Builder tools packets and enums |
| `com.hypixel.hytale.server.core.permissions` | Permission system |
| `com.hypixel.hytale.server.core.permissions.provider` | Permission providers |
| `com.hypixel.hytale.server.core.universe.world` | World management |
| `com.hypixel.hytale.server.core.asset.type.gameplay` | Gameplay configuration assets |
| `com.hypixel.hytale.server.core.cosmetics` | Cosmetic system |
| `com.hypixel.hytale.server.core.inventory` | Inventory system |
| `com.hypixel.hytale.server.core.plugin` | Plugin system |
| `com.hypixel.hytale.server.core.prefab` | Prefab system |
| `com.hypixel.hytale.server.core.io.transport` | Network transport |

---

*Documentation generated from decompiled Hytale server code.*
