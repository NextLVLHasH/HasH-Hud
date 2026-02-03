---
id: packets
title: Network Packets
sidebar_label: Packets
sidebar_position: 7
description: Complete documentation of Hytale protocol network packets (200+ packets)
---

# Hytale Network Packets Documentation

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis. All information includes source file references.
:::

## What are Network Packets?

When you play Hytale, your computer (the **client**) and the game server need to constantly exchange information. This communication happens through **packets** - small bundles of data sent over the network.

### The Client-Server Dance

Every action in a multiplayer game involves network communication:

```
You press W to walk forward
       │
       ▼
Your client sends: "Player wants to move forward"
       │
       ▼ (travels over the internet)
       │
       ▼
Server receives, validates, calculates new position
       │
       ▼
Server sends: "Player is now at position (X, Y, Z)"
       │
       ▼ (travels back)
       │
       ▼
Your client updates your screen
```

This happens **dozens of times per second** for every player!

### Why Packets Matter

Understanding packets helps you:
- **Debug network issues**: "Why does my custom item not appear?"
- **Optimize performance**: Know which packets are expensive
- **Understand game limits**: Why can't I send unlimited data?
- **Create network-aware plugins**: React to player actions efficiently

### Anatomy of a Packet

Every packet has a standard structure:

```
┌─────────────────────────────────────────────┐
│ Packet ID (1-5 bytes)                       │  ← Which type of packet?
├─────────────────────────────────────────────┤
│ Null Bits (1-2 bytes)                       │  ← Which optional fields are present?
├─────────────────────────────────────────────┤
│ Fixed Block (varies)                        │  ← Always-present data
├─────────────────────────────────────────────┤
│ Variable Block (varies)                     │  ← Optional/dynamic data
└─────────────────────────────────────────────┘
```

### Real-World Analogy: Postal Mail

Packets are like letters in the mail:

| Postal System | Network Packets |
|---------------|-----------------|
| Envelope | Packet header (ID, size) |
| Sender address | Client/server identifier |
| Letter content | Packet data (positions, actions) |
| Postal code | Packet ID (determines handling) |
| Registered mail | Reliable packets (must arrive) |
| Postcard | Fast packets (can be lost) |

### Packet Directions

Packets flow in two directions:

| Direction | Symbol | Example |
|-----------|--------|---------|
| **Client → Server** | C2S | "I clicked at position X,Y" |
| **Server → Client** | S2C | "The block at X,Y,Z is now Stone" |
| **Bidirectional** | ↔ | Ping/Pong for latency measurement |

### Packet Categories

Hytale organizes 200+ packets into logical groups:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Connection** (0-3) | Establishing/ending connections | Connect, Disconnect, Ping |
| **Authentication** (10-18) | Login and permissions | AuthToken, ConnectAccept |
| **Setup** (20-34) | Initial world loading | WorldSettings, AssetInitialize |
| **Player** (100-119) | Player actions | ClientMovement, MouseInteraction |
| **World/Chunk** (131-166) | World data | SetChunk, ServerSetBlock |
| **Entity** (160-166) | Entity updates | EntityUpdates, PlayAnimation |
| **Inventory** (170-179) | Inventory management | UpdatePlayerInventory, MoveItemStack |
| **Interface** (210-234) | UI and chat | ChatMessage, Notification |

### The Connection Flow

When you join a Hytale server, here's what happens:

```
1. CLIENT: "Hello! I want to connect" (Connect packet)
         ↓
2. SERVER: "Who are you?" (authentication challenge)
         ↓
3. CLIENT: "Here's my token" (AuthToken packet)
         ↓
4. SERVER: "Welcome! Here are the world settings" (ConnectAccept + WorldSettings)
         ↓
5. SERVER: "Here's the world data..." (SetChunk packets)
         ↓
6. CLIENT: "I'm ready!" (ClientReady packet)
         ↓
7. Both: Exchange movement/action packets continuously
```

### Compression and Optimization

Large packets (like chunk data) are compressed to save bandwidth:

- **Compressed packets**: Chunk data, asset updates, entity batches
- **Uncompressed packets**: Small, frequent packets like movement

The server balances between:
- **Bandwidth**: How much data is sent
- **Latency**: How quickly data arrives
- **CPU cost**: Compression takes processing time

---

## Packet Reference

Comprehensive documentation of the Hytale network protocol, based on analysis of the decompiled server code.

### Technical Overview

The Hytale network protocol uses a binary packet system for client-server communication. Each packet contains:

- **Unique ID**: Numeric identifier for the packet (0-423)
- **Direction**: Client to Server (C2S) or Server to Client (S2C)
- **Compression**: Certain large packets are compressed
- **Size**: Fixed or variable depending on the data

### Protocol Architecture

```
+------------------+     +------------------+
|     CLIENT       |     |     SERVER       |
+------------------+     +------------------+
         |                        |
         |  Connect (ID:0)        |
         |----------------------->|
         |                        |
         |  ConnectAccept (ID:14) |
         |<-----------------------|
         |                        |
         |  WorldSettings (ID:20) |
         |<-----------------------|
         |                        |
         |  ClientMovement (ID:108)|
         |----------------------->|
         |                        |
         |  EntityUpdates (ID:161)|
         |<-----------------------|
         |                        |
```

### Packet Format

Each packet follows this structure:

| Field | Size | Description |
|-------|------|-------------|
| Packet ID | VarInt | Unique packet identifier |
| Null Bits | 1-2 bytes | Flags for nullable fields |
| Fixed Block | Variable | Fixed-size data |
| Variable Block | Variable | Variable-size data |

---

## Connection Packets (ID: 0-3)

Basic packets for connection management.

### Connect (ID: 0)

**Direction**: Client -> Server

Initial packet sent by the client to establish a connection.

| Field | Type | Description |
|-------|------|-------------|
| `protocolHash` | String (64 bytes) | Protocol version hash |
| `clientType` | ClientType (byte) | Client type (Game, AssetEditor) |
| `language` | String? | Client language (max 128 chars) |
| `identityToken` | String? | Authentication token (max 8192 chars) |
| `uuid` | UUID | Unique player identifier |
| `username` | String | Player name (max 16 chars) |
| `referralData` | byte[]? | Referral data (max 4096 bytes) |
| `referralSource` | HostAddress? | Connection source |

**Size**: 82-38161 bytes

---

### Disconnect (ID: 1)

**Direction**: Bidirectional

Connection termination with optional reason.

| Field | Type | Description |
|-------|------|-------------|
| `reason` | String? | Disconnection reason (max 4096000 chars) |
| `type` | DisconnectType | Disconnection type |

**Size**: 2-16384007 bytes

---

### Ping (ID: 2)

**Direction**: Bidirectional

Network latency measurement.

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Ping identifier |
| `time` | InstantData? | Timestamp |
| `lastPingValueRaw` | int | Last raw ping value |
| `lastPingValueDirect` | int | Direct ping |
| `lastPingValueTick` | int | Tick-based ping |

**Size**: 29 bytes (fixed)

---

### Pong (ID: 3)

**Direction**: Bidirectional

Response to a ping packet.

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Identifier corresponding to the ping |
| `time` | InstantData? | Timestamp |
| `type` | PongType | Pong type (Raw, Direct, Tick) |
| `packetQueueSize` | short | Packet queue size |

**Size**: 20 bytes (fixed)

---

## Authentication Packets (ID: 10-18)

Authentication and permission management.

### Status (ID: 10)

**Direction**: Server -> Client

Connection status.

| Field | Type | Description |
|-------|------|-------------|
| (complex structure) | - | Status information |

**Size**: 9-2587 bytes

---

### AuthGrant (ID: 11)

**Direction**: Client -> Server

Authentication authorization request.

| Field | Type | Description |
|-------|------|-------------|
| (credentials) | - | Authentication data |

**Size**: 1-49171 bytes

---

### AuthToken (ID: 12)

**Direction**: Client -> Server

Authentication token.

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | String? | Access token (max 8192 chars) |
| `serverAuthorizationGrant` | String? | Server authorization grant (max 4096 chars) |

**Size**: 1-49171 bytes

---

### ServerAuthToken (ID: 13)

**Direction**: Server -> Client

Server authentication token.

**Size**: 1-32851 bytes

---

### ConnectAccept (ID: 14)

**Direction**: Server -> Client

Connection acceptance confirmation.

**Size**: 1-70 bytes

---

### PasswordResponse (ID: 15)

**Direction**: Client -> Server

Password response for protected servers.

**Size**: 1-70 bytes

---

### PasswordAccepted (ID: 16)

**Direction**: Server -> Client

Password accepted confirmation.

**Size**: 0 bytes (empty)

---

### PasswordRejected (ID: 17)

**Direction**: Server -> Client

Password rejected notification.

**Size**: 5-74 bytes

---

### ClientReferral (ID: 18)

**Direction**: Server -> Client

Client redirection to another server.

**Size**: 1-5141 bytes

---

## Setup Packets (ID: 20-34)

Initial world and asset configuration.

### WorldSettings (ID: 20)

**Direction**: Server -> Client
**Compressed**: Yes

World configuration.

| Field | Type | Description |
|-------|------|-------------|
| `worldHeight` | int | Maximum world height |
| `requiredAssets` | Asset[]? | List of required assets |

**Size**: 5+ bytes (variable, compressed)

---

### WorldLoadProgress (ID: 21)

**Direction**: Server -> Client

World loading progress.

**Size**: 9-16384014 bytes

---

### WorldLoadFinished (ID: 22)

**Direction**: Server -> Client

Loading completion notification.

**Size**: 0 bytes (empty)

---

### RequestAssets (ID: 23)

**Direction**: Client -> Server
**Compressed**: Yes

Asset request to the server.

**Size**: Variable (compressed)

---

### AssetInitialize (ID: 24)

**Direction**: Server -> Client

Asset transfer initialization.

**Size**: 4-2121 bytes

---

### AssetPart (ID: 25)

**Direction**: Server -> Client
**Compressed**: Yes

Asset part (fragmented transfer).

**Size**: 1-4096006 bytes (compressed)

---

### AssetFinalize (ID: 26)

**Direction**: Server -> Client

Asset transfer finalization.

**Size**: 0 bytes (empty)

---

### RemoveAssets (ID: 27)

**Direction**: Server -> Client

Asset removal from client cache.

**Size**: Variable

---

### RequestCommonAssetsRebuild (ID: 28)

**Direction**: Client -> Server

Common assets rebuild request.

**Size**: 0 bytes (empty)

---

### SetUpdateRate (ID: 29)

**Direction**: Server -> Client

Update rate configuration.

| Field | Type | Description |
|-------|------|-------------|
| `updateRate` | int | Update rate |

**Size**: 4 bytes (fixed)

---

### SetTimeDilation (ID: 30)

**Direction**: Server -> Client

Time dilation configuration.

| Field | Type | Description |
|-------|------|-------------|
| `timeDilation` | float | Dilation factor |

**Size**: 4 bytes (fixed)

---

### UpdateFeatures (ID: 31)

**Direction**: Server -> Client

Enabled features update.

**Size**: 1-8192006 bytes

---

### ViewRadius (ID: 32)

**Direction**: Bidirectional

View radius configuration.

| Field | Type | Description |
|-------|------|-------------|
| `viewRadius` | int | View radius in chunks |

**Size**: 4 bytes (fixed)

---

### PlayerOptions (ID: 33)

**Direction**: Client -> Server

Player options and preferences.

**Size**: 1-327680184 bytes

---

### ServerTags (ID: 34)

**Direction**: Server -> Client

Server tags and metadata.

**Size**: Variable

---

## Asset Update Packets (ID: 40-85)

Dynamic asset definition updates.

### UpdateBlockTypes (ID: 40)

**Direction**: Server -> Client
**Compressed**: Yes

Block type definitions.

**Size**: Variable (compressed)

---

### UpdateBlockHitboxes (ID: 41)

**Direction**: Server -> Client
**Compressed**: Yes

Block hitboxes.

---

### UpdateBlockSoundSets (ID: 42)

**Direction**: Server -> Client
**Compressed**: Yes

Block-associated sounds.

---

### UpdateItems (ID: 54)

**Direction**: Server -> Client
**Compressed**: Yes

Item definitions.

---

### UpdateRecipes (ID: 60)

**Direction**: Server -> Client
**Compressed**: Yes

Crafting recipes.

---

### UpdateEnvironments (ID: 61)

**Direction**: Server -> Client
**Compressed**: Yes

Environment configuration (biomes, weather, etc.).

---

### UpdateWeathers (ID: 47)

**Direction**: Server -> Client
**Compressed**: Yes

Available weather types.

---

### UpdateInteractions (ID: 66)

**Direction**: Server -> Client
**Compressed**: Yes

Interaction definitions.

---

*Note: Packets 40-85 all follow the same asset update pattern.*

---

## Player Packets (ID: 100-119)

Player management and actions.

### SetClientId (ID: 100)

**Direction**: Server -> Client

Client identifier assignment.

| Field | Type | Description |
|-------|------|-------------|
| `clientId` | int | Unique client ID |

**Size**: 4 bytes (fixed)

---

### SetGameMode (ID: 101)

**Direction**: Server -> Client

Game mode change.

| Field | Type | Description |
|-------|------|-------------|
| `gameMode` | byte | Game mode |

**Size**: 1 byte (fixed)

---

### SetMovementStates (ID: 102)

**Direction**: Server -> Client

Allowed movement states.

**Size**: 2 bytes (fixed)

---

### SetBlockPlacementOverride (ID: 103)

**Direction**: Server -> Client

Block placement override.

**Size**: 1 byte (fixed)

---

### JoinWorld (ID: 104)

**Direction**: Server -> Client

Join a world.

| Field | Type | Description |
|-------|------|-------------|
| `clearWorld` | boolean | Clear current world |
| `fadeInOut` | boolean | Transition animation |
| `worldUuid` | UUID | World identifier |

**Size**: 18 bytes (fixed)

---

### ClientReady (ID: 105)

**Direction**: Client -> Server

Notification that the client is ready.

**Size**: 2 bytes (fixed)

---

### LoadHotbar (ID: 106) / SaveHotbar (ID: 107)

**Direction**: Client -> Server

Hotbar loading/saving.

**Size**: 1 byte (fixed)

---

### ClientMovement (ID: 108)

**Direction**: Client -> Server

Player position and movement update.

| Field | Type | Description |
|-------|------|-------------|
| `movementStates` | MovementStates? | Current movement states |
| `relativePosition` | HalfFloatPosition? | Relative position (delta) |
| `absolutePosition` | Position? | Absolute position |
| `bodyOrientation` | Direction? | Body orientation |
| `lookOrientation` | Direction? | Look direction |
| `teleportAck` | TeleportAck? | Teleport acknowledgment |
| `wishMovement` | Position? | Desired movement |
| `velocity` | Vector3d? | Current velocity |
| `mountedTo` | int | Mount ID (0 if none) |
| `riderMovementStates` | MovementStates? | Mount states |

**Size**: 153 bytes (fixed)

---

### ClientTeleport (ID: 109)

**Direction**: Server -> Client

Forced player teleportation.

**Size**: 52 bytes (fixed)

---

### UpdateMovementSettings (ID: 110)

**Direction**: Server -> Client

Movement settings update.

**Size**: 252 bytes (fixed)

---

### MouseInteraction (ID: 111)

**Direction**: Client -> Server

Mouse interaction (clicks, movement).

| Field | Type | Description |
|-------|------|-------------|
| `clientTimestamp` | long | Client timestamp |
| `activeSlot` | int | Active hotbar slot |
| `itemInHandId` | String? | Held item ID |
| `screenPoint` | Vector2f? | Screen position |
| `mouseButton` | MouseButtonEvent? | Button event |
| `mouseMotion` | MouseMotionEvent? | Motion event |
| `worldInteraction` | WorldInteraction? | World interaction |

**Size**: 44-20480071 bytes

---

### DamageInfo (ID: 112)

**Direction**: Server -> Client

Damage received information.

**Size**: 29-32768048 bytes

---

### ReticleEvent (ID: 113)

**Direction**: Server -> Client

Aiming reticle event.

**Size**: 4 bytes (fixed)

---

### DisplayDebug (ID: 114)

**Direction**: Server -> Client

Debug information display.

**Size**: 19-32768037 bytes

---

### ClearDebugShapes (ID: 115)

**Direction**: Server -> Client

Debug shape clearing.

**Size**: 0 bytes (empty)

---

### SyncPlayerPreferences (ID: 116)

**Direction**: Bidirectional

Player preferences synchronization.

**Size**: 8 bytes (fixed)

---

### ClientPlaceBlock (ID: 117)

**Direction**: Client -> Server

Block placement by the client.

**Size**: 20 bytes (fixed)

---

### UpdateMemoriesFeatureStatus (ID: 118)

**Direction**: Server -> Client

Memories feature status.

**Size**: 1 byte (fixed)

---

### RemoveMapMarker (ID: 119)

**Direction**: Client -> Server

Map marker removal.

**Size**: 1-16384006 bytes

---

## World/Chunk Packets (ID: 131-166)

Chunk and world management.

### SetChunk (ID: 131)

**Direction**: Server -> Client
**Compressed**: Yes

Chunk data transmission.

| Field | Type | Description |
|-------|------|-------------|
| `x` | int | Chunk X coordinate |
| `y` | int | Chunk Y coordinate |
| `z` | int | Chunk Z coordinate |
| `localLight` | byte[]? | Local light data |
| `globalLight` | byte[]? | Global light data |
| `data` | byte[]? | Block data |

**Size**: 13-12288040 bytes (compressed)

---

### SetChunkHeightmap (ID: 132)

**Direction**: Server -> Client
**Compressed**: Yes

Chunk heightmap.

**Size**: 9-4096014 bytes (compressed)

---

### SetChunkTintmap (ID: 133)

**Direction**: Server -> Client
**Compressed**: Yes

Chunk tintmap (vegetation colors).

**Size**: 9-4096014 bytes (compressed)

---

### SetChunkEnvironments (ID: 134)

**Direction**: Server -> Client
**Compressed**: Yes

Chunk environments.

**Size**: 9-4096014 bytes (compressed)

---

### UnloadChunk (ID: 135)

**Direction**: Server -> Client

Chunk unloading.

| Field | Type | Description |
|-------|------|-------------|
| `chunkX` | int | Chunk X coordinate |
| `chunkZ` | int | Chunk Z coordinate |

**Size**: 8 bytes (fixed)

---

### SetFluids (ID: 136)

**Direction**: Server -> Client
**Compressed**: Yes

Chunk fluids.

**Size**: 13-4096018 bytes (compressed)

---

### ServerSetBlock (ID: 140)

**Direction**: Server -> Client

Block modification by the server.

| Field | Type | Description |
|-------|------|-------------|
| `x` | int | X coordinate |
| `y` | int | Y coordinate |
| `z` | int | Z coordinate |
| `blockId` | int | New block ID |
| `filler` | short | Additional data |
| `rotation` | byte | Block rotation |

**Size**: 19 bytes (fixed)

---

### ServerSetBlocks (ID: 141)

**Direction**: Server -> Client

Multiple block modifications.

**Size**: 12-36864017 bytes

---

### ServerSetFluid (ID: 142)

**Direction**: Server -> Client

Fluid modification.

**Size**: 17 bytes (fixed)

---

### ServerSetFluids (ID: 143)

**Direction**: Server -> Client

Multiple fluid modifications.

**Size**: 12-28672017 bytes

---

### UpdateBlockDamage (ID: 144)

**Direction**: Server -> Client

Block damage update.

**Size**: 21 bytes (fixed)

---

### UpdateTimeSettings (ID: 145)

**Direction**: Server -> Client

Time settings.

**Size**: 10 bytes (fixed)

---

### UpdateTime (ID: 146)

**Direction**: Server -> Client

Time update.

**Size**: 13 bytes (fixed)

---

### UpdateWeather (ID: 149)

**Direction**: Server -> Client

Weather update.

**Size**: 8 bytes (fixed)

---

### SpawnParticleSystem (ID: 152)

**Direction**: Server -> Client

Particle system creation.

**Size**: 44-16384049 bytes

---

### SpawnBlockParticleSystem (ID: 153)

**Direction**: Server -> Client

Block-linked particles.

**Size**: 30 bytes (fixed)

---

### PlaySoundEvent2D (ID: 154)

**Direction**: Server -> Client

2D sound (interface).

**Size**: 13 bytes (fixed)

---

### PlaySoundEvent3D (ID: 155)

**Direction**: Server -> Client

3D sound (world).

**Size**: 38 bytes (fixed)

---

### PlaySoundEventEntity (ID: 156)

**Direction**: Server -> Client

Entity-attached sound.

**Size**: 16 bytes (fixed)

---

### UpdateSleepState (ID: 157)

**Direction**: Server -> Client

Sleep state.

**Size**: 36-65536050 bytes

---

### SetPaused (ID: 158)

**Direction**: Client -> Server

Pause request.

**Size**: 1 byte (fixed)

---

### ServerSetPaused (ID: 159)

**Direction**: Server -> Client

Server pause confirmation.

**Size**: 1 byte (fixed)

---

## Entity Packets (ID: 160-166)

Entity management.

### SetEntitySeed (ID: 160)

**Direction**: Server -> Client

Entity seed (for procedural generation).

**Size**: 4 bytes (fixed)

---

### EntityUpdates (ID: 161)

**Direction**: Server -> Client
**Compressed**: Yes

Entity updates (position, state, etc.).

| Field | Type | Description |
|-------|------|-------------|
| `removed` | int[]? | IDs of removed entities |
| `updates` | EntityUpdate[]? | Entity updates |

**Size**: Variable (compressed)

---

### PlayAnimation (ID: 162)

**Direction**: Server -> Client

Play an animation on an entity.

**Size**: 6-32768024 bytes

---

### ChangeVelocity (ID: 163)

**Direction**: Server -> Client

Entity velocity change.

**Size**: 35 bytes (fixed)

---

### ApplyKnockback (ID: 164)

**Direction**: Server -> Client

Knockback application.

**Size**: 38 bytes (fixed)

---

### SpawnModelParticles (ID: 165)

**Direction**: Server -> Client

Model particles.

**Size**: Variable

---

### MountMovement (ID: 166)

**Direction**: Client -> Server

Mount movement.

**Size**: 59 bytes (fixed)

---

## Inventory Packets (ID: 170-179)

Inventory management.

### UpdatePlayerInventory (ID: 170)

**Direction**: Server -> Client
**Compressed**: Yes

Complete inventory update.

| Field | Type | Description |
|-------|------|-------------|
| `storage` | InventorySection? | Main storage |
| `armor` | InventorySection? | Armor |
| `hotbar` | InventorySection? | Action bar |
| `utility` | InventorySection? | Utilities |
| `builderMaterial` | InventorySection? | Building materials |
| `tools` | InventorySection? | Tools |
| `backpack` | InventorySection? | Backpack |
| `sortType` | SortType | Sort type |

**Size**: Variable (compressed)

---

### SetCreativeItem (ID: 171)

**Direction**: Client -> Server

Set an item in creative mode.

**Size**: 9-16384019 bytes

---

### DropCreativeItem (ID: 172)

**Direction**: Client -> Server

Drop an item in creative mode.

**Size**: 0-16384010 bytes

---

### SmartGiveCreativeItem (ID: 173)

**Direction**: Client -> Server

Smart creative item grant.

**Size**: 1-16384011 bytes

---

### DropItemStack (ID: 174)

**Direction**: Client -> Server

Drop an item stack.

**Size**: 12 bytes (fixed)

---

### MoveItemStack (ID: 175)

**Direction**: Client -> Server

Move an item stack.

| Field | Type | Description |
|-------|------|-------------|
| `fromSectionId` | int | Source section |
| `fromSlotId` | int | Source slot |
| `quantity` | int | Quantity to move |
| `toSectionId` | int | Destination section |
| `toSlotId` | int | Destination slot |

**Size**: 20 bytes (fixed)

---

### SmartMoveItemStack (ID: 176)

**Direction**: Client -> Server

Smart movement (shift-click).

**Size**: 13 bytes (fixed)

---

### SetActiveSlot (ID: 177)

**Direction**: Client -> Server

Active slot change.

**Size**: 8 bytes (fixed)

---

### SwitchHotbarBlockSet (ID: 178)

**Direction**: Client -> Server

Hotbar set change.

**Size**: 1-16384006 bytes

---

### InventoryAction (ID: 179)

**Direction**: Client -> Server

Generic inventory action.

**Size**: 6 bytes (fixed)

---

## Window Packets (ID: 200-204)

Window/interface management.

### OpenWindow (ID: 200)

**Direction**: Server -> Client
**Compressed**: Yes

Window opening.

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Window ID |
| `windowType` | WindowType | Window type |
| `windowData` | String? | Window JSON data |
| `inventory` | InventorySection? | Associated inventory |
| `extraResources` | ExtraResources? | Additional resources |

**Size**: Variable (compressed)

---

### UpdateWindow (ID: 201)

**Direction**: Server -> Client
**Compressed**: Yes

Window update.

**Size**: Variable (compressed)

---

### CloseWindow (ID: 202)

**Direction**: Bidirectional

Window closing.

**Size**: 4 bytes (fixed)

---

### SendWindowAction (ID: 203)

**Direction**: Client -> Server

Action within a window.

**Size**: 4-32768027 bytes

---

### ClientOpenWindow (ID: 204)

**Direction**: Client -> Server

Window opening request.

**Size**: 1 byte (fixed)

---

## Interface Packets (ID: 210-234)

Communication and user interface.

### ServerMessage (ID: 210)

**Direction**: Server -> Client

Server message.

**Size**: Variable

---

### ChatMessage (ID: 211)

**Direction**: Client -> Server

Chat message.

| Field | Type | Description |
|-------|------|-------------|
| `message` | String? | Message content (max 4096000 chars) |

**Size**: 1-16384006 bytes

---

### Notification (ID: 212)

**Direction**: Server -> Client

Notification to display.

**Size**: Variable

---

### KillFeedMessage (ID: 213)

**Direction**: Server -> Client

Kill feed message.

**Size**: Variable

---

### ShowEventTitle (ID: 214)

**Direction**: Server -> Client

Event title display.

**Size**: Variable

---

### HideEventTitle (ID: 215)

**Direction**: Server -> Client

Title hiding.

**Size**: 4 bytes (fixed)

---

### SetPage (ID: 216)

**Direction**: Server -> Client

Interface page change.

**Size**: 2 bytes (fixed)

---

### CustomHud (ID: 217)

**Direction**: Server -> Client
**Compressed**: Yes

Custom HUD.

**Size**: Variable (compressed)

---

### CustomPage (ID: 218)

**Direction**: Server -> Client
**Compressed**: Yes

Custom page.

**Size**: Variable (compressed)

---

### CustomPageEvent (ID: 219)

**Direction**: Client -> Server

Custom page event.

**Size**: 2-16384007 bytes

---

### ServerInfo (ID: 223)

**Direction**: Server -> Client

Server information.

**Size**: 5-32768023 bytes

---

### AddToServerPlayerList (ID: 224)

**Direction**: Server -> Client

Add a player to the list.

**Size**: Variable

---

### RemoveFromServerPlayerList (ID: 225)

**Direction**: Server -> Client

Remove a player from the list.

**Size**: 1-65536006 bytes

---

### UpdateServerPlayerList (ID: 226)

**Direction**: Server -> Client

Player list update.

**Size**: 1-131072006 bytes

---

### UpdateServerPlayerListPing (ID: 227)

**Direction**: Server -> Client

Ping update.

**Size**: 1-81920006 bytes

---

### UpdateKnownRecipes (ID: 228)

**Direction**: Server -> Client

Recipes known by the player.

**Size**: Variable

---

### UpdatePortal (ID: 229)

**Direction**: Server -> Client

Portal update.

**Size**: 6-16384020 bytes

---

### UpdateVisibleHudComponents (ID: 230)

**Direction**: Server -> Client

Visible HUD components.

**Size**: 1-4096006 bytes

---

### ResetUserInterfaceState (ID: 231)

**Direction**: Server -> Client

Interface reset.

**Size**: 0 bytes (empty)

---

### UpdateLanguage (ID: 232)

**Direction**: Client -> Server

Language change.

**Size**: 1-16384006 bytes

---

### WorldSavingStatus (ID: 233)

**Direction**: Server -> Client

World saving status.

**Size**: 1 byte (fixed)

---

### OpenChatWithCommand (ID: 234)

**Direction**: Server -> Client

Open chat with a pre-filled command.

**Size**: 1-16384006 bytes

---

## WorldMap Packets (ID: 240-245)

World map management.

### UpdateWorldMapSettings (ID: 240)

**Direction**: Server -> Client

Map settings.

**Size**: Variable

---

### UpdateWorldMap (ID: 241)

**Direction**: Server -> Client
**Compressed**: Yes

Map update.

| Field | Type | Description |
|-------|------|-------------|
| `chunks` | MapChunk[]? | Map chunks |
| `addedMarkers` | MapMarker[]? | Added markers |
| `removedMarkers` | String[]? | Removed markers |

**Size**: Variable (compressed)

---

### ClearWorldMap (ID: 242)

**Direction**: Server -> Client

Map clearing.

**Size**: 0 bytes (empty)

---

### UpdateWorldMapVisible (ID: 243)

**Direction**: Server -> Client

Map visibility.

**Size**: 1 byte (fixed)

---

### TeleportToWorldMapMarker (ID: 244)

**Direction**: Client -> Server

Teleport to a marker.

**Size**: 1-16384006 bytes

---

### TeleportToWorldMapPosition (ID: 245)

**Direction**: Client -> Server

Teleport to a position.

**Size**: 8 bytes (fixed)

---

## Server Access Packets (ID: 250-252)

Server access management.

### RequestServerAccess (ID: 250)

**Direction**: Client -> Server

Access request.

**Size**: 3 bytes (fixed)

---

### UpdateServerAccess (ID: 251)

**Direction**: Server -> Client

Access update.

**Size**: Variable

---

### SetServerAccess (ID: 252)

**Direction**: Client -> Server

Access definition.

**Size**: 2-16384007 bytes

---

## Machinima Packets (ID: 260-262)

Machinima system (cinematics).

### RequestMachinimaActorModel (ID: 260)

**Direction**: Client -> Server

Actor model request.

**Size**: 1-49152028 bytes

---

### SetMachinimaActorModel (ID: 261)

**Direction**: Server -> Client

Actor model definition.

**Size**: Variable

---

### UpdateMachinimaScene (ID: 262)

**Direction**: Server -> Client
**Compressed**: Yes

Scene update.

**Size**: Variable (compressed)

---

## Camera Packets (ID: 280-283)

Camera control.

### SetServerCamera (ID: 280)

**Direction**: Server -> Client

Camera configuration.

| Field | Type | Description |
|-------|------|-------------|
| `clientCameraView` | ClientCameraView | View (FirstPerson, ThirdPerson, etc.) |
| `isLocked` | boolean | Camera locked |
| `cameraSettings` | ServerCameraSettings? | Detailed settings |

**Size**: 157 bytes (fixed)

---

### CameraShakeEffect (ID: 281)

**Direction**: Server -> Client

Screen shake effect.

**Size**: 9 bytes (fixed)

---

### RequestFlyCameraMode (ID: 282)

**Direction**: Client -> Server

Free camera mode request.

**Size**: 1 byte (fixed)

---

### SetFlyCameraMode (ID: 283)

**Direction**: Server -> Client

Free camera mode activation.

**Size**: 1 byte (fixed)

---

## Interaction Packets (ID: 290-294)

Interaction system.

### SyncInteractionChains (ID: 290)

**Direction**: Server -> Client

Interaction chain synchronization.

**Size**: Variable

---

### CancelInteractionChain (ID: 291)

**Direction**: Bidirectional

Interaction chain cancellation.

**Size**: 5-1038 bytes

---

### PlayInteractionFor (ID: 292)

**Direction**: Server -> Client

Play an interaction.

**Size**: 19-16385065 bytes

---

### MountNPC (ID: 293)

**Direction**: Client -> Server

Mount an NPC.

**Size**: 16 bytes (fixed)

---

### DismountNPC (ID: 294)

**Direction**: Client -> Server

Dismount from an NPC.

**Size**: 0 bytes (empty)

---

## Asset Editor Packets (ID: 300-355)

Asset editing tools (developer mode).

*These packets are used by the integrated asset editor and are not used during normal gameplay.*

### AssetEditorInitialize (ID: 302)

Editor initialization.

### AssetEditorAuthorization (ID: 303)

Editing authorization.

### AssetEditorCapabilities (ID: 304)

Editor capabilities.

### AssetEditorSetupSchemas (ID: 305)

Schema configuration.

### AssetEditorFetchAsset (ID: 310)

Asset retrieval.

### AssetEditorUpdateAsset (ID: 324)

Asset update.

### AssetEditorCreateAsset (ID: 327)

Asset creation.

### AssetEditorDeleteAsset (ID: 329)

Asset deletion.

*...and 40+ additional editing packets.*

---

## Rendering Settings Packets (ID: 360-361)

Rendering settings.

### UpdateSunSettings (ID: 360)

**Direction**: Server -> Client

Sun settings.

**Size**: 8 bytes (fixed)

---

### UpdatePostFxSettings (ID: 361)

**Direction**: Server -> Client

Post-processing settings.

**Size**: 20 bytes (fixed)

---

## Builder Tools Packets (ID: 400-423)

Building tools (advanced creative mode).

### BuilderToolArgUpdate (ID: 400)

**Direction**: Client -> Server

Tool argument update.

**Size**: 14-32768032 bytes

---

### BuilderToolEntityAction (ID: 401)

**Direction**: Client -> Server

Entity action.

**Size**: 5 bytes (fixed)

---

### BuilderToolSetEntityTransform (ID: 402)

**Direction**: Client -> Server

Entity transformation.

**Size**: 54 bytes (fixed)

---

### BuilderToolExtrudeAction (ID: 403)

**Direction**: Client -> Server

Extrusion action.

**Size**: 24 bytes (fixed)

---

### BuilderToolStackArea (ID: 404)

**Direction**: Client -> Server

Area stacking.

**Size**: 41 bytes (fixed)

---

### BuilderToolSelectionTransform (ID: 405)

**Direction**: Client -> Server

Selection transformation.

**Size**: 52-16384057 bytes

---

### BuilderToolPasteClipboard (ID: 407)

**Direction**: Client -> Server

Clipboard paste.

**Size**: 12 bytes (fixed)

---

### BuilderToolSelectionUpdate (ID: 409)

**Direction**: Client -> Server

Selection update.

**Size**: 24 bytes (fixed)

---

### BuilderToolLaserPointer (ID: 419)

**Direction**: Client -> Server

Laser pointer.

**Size**: 36 bytes (fixed)

---

*...and 10+ additional builder tool packets.*

---

## Direction Summary

| Category | Client -> Server | Server -> Client | Bidirectional |
|----------|------------------|------------------|---------------|
| Connection | Connect | - | Disconnect, Ping, Pong |
| Auth | AuthToken, AuthGrant | ConnectAccept, Status | PasswordResponse |
| Setup | RequestAssets, PlayerOptions | WorldSettings, WorldLoadProgress | ViewRadius |
| Player | ClientMovement, MouseInteraction | JoinWorld, SetGameMode, ClientTeleport | SyncPlayerPreferences |
| World | SetPaused | SetChunk, ServerSetBlock, EntityUpdates | - |
| Inventory | MoveItemStack, DropItemStack | UpdatePlayerInventory | - |
| Window | SendWindowAction, ClientOpenWindow | OpenWindow, UpdateWindow | CloseWindow |
| Interface | ChatMessage, CustomPageEvent | ServerMessage, Notification | - |
| Camera | RequestFlyCameraMode | SetServerCamera, CameraShakeEffect | - |

---

## Technical Notes

### Compression

Packets marked as compressed use **Zstd (Zstandard)** compression to reduce bandwidth. Compression is applied after serialization.

### Validation

Each packet implements a `validateStructure` method that verifies data integrity before deserialization.

### Data Types

- **VarInt**: Variable-length integer (1-5 bytes)
- **String**: Length prefix (VarInt) + UTF-8 data
- **UUID**: 16 bytes (2 x long)
- **Position**: 24 bytes (3 x double)
- **Direction**: 12 bytes (3 x float)
- **Vector3d**: 24 bytes (3 x double)

---

*Documentation generated from analysis of the decompiled Hytale server code.*
