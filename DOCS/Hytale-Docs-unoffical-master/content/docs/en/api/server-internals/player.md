---
id: player
title: Player API
sidebar_label: Player
sidebar_position: 5
description: Complete documentation of the Player class and related APIs
---

# Player API

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis.
:::

## Overview

The `Player` class represents a connected player entity in the game world. It extends `LivingEntity` and implements `CommandSender` and `PermissionHolder` interfaces.

**Source**: `com.hypixel.hytale.server.core.entity.entities.Player`

**Import**:
```java
import com.hypixel.hytale.server.core.entity.entities.Player;
```

## Getting a Player Reference

### From CommandContext

```java
@Override
protected void executeSync(CommandContext context) {
    if (context.isPlayer()) {
        Player player = context.senderAs(Player.class);
        // Work with player
    }
}
```

### From Entity Store

```java
// Using a Ref<EntityStore>
Player player = store.getComponent(ref, Player.getComponentType());
```

### From PlayerRef

```java
PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());
String username = playerRef.getUsername();
UUID uuid = playerRef.getUuid();
```

## Player Properties

### Basic Information

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getDisplayName()` | `String` | Returns the player's display name |
| `getUuid()` | `UUID` | Returns the player's UUID (deprecated, use PlayerRef) |
| `getReference()` | `Ref<EntityStore>` | Returns the player's entity reference |
| `getWorld()` | `World` | Returns the world the player is in |

### Game State

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getGameMode()` | `GameMode` | Returns the player's current game mode |
| `isFirstSpawn()` | `boolean` | Returns true if this is the player's first spawn |
| `hasSpawnProtection()` | `boolean` | Returns true if player has spawn protection |
| `isWaitingForClientReady()` | `boolean` | Returns true if waiting for client ready signal |

### Permissions

| Method | Return Type | Description |
|--------|-------------|-------------|
| `hasPermission(String id)` | `boolean` | Checks if player has the specified permission |
| `hasPermission(String id, boolean def)` | `boolean` | Checks permission with default value |

## Managers

The Player class provides access to several manager objects:

```java
Player player = context.senderAs(Player.class);

// Page manager - for custom UI pages
PageManager pageManager = player.getPageManager();

// Window manager - for inventory/container windows
WindowManager windowManager = player.getWindowManager();

// HUD manager - for heads-up display elements
HudManager hudManager = player.getHudManager();

// Hotbar manager - for hotbar slot management
HotbarManager hotbarManager = player.getHotbarManager();

// World map tracker
WorldMapTracker worldMapTracker = player.getWorldMapTracker();
```

## Sending Messages

```java
import com.hypixel.hytale.server.core.Message;

// Send a raw text message
player.sendMessage(Message.raw("Hello, player!"));

// Send a translated message
player.sendMessage(Message.translation("server.welcome.message"));

// Send a message with formatting
player.sendMessage(Message.translation("server.greeting")
    .param("name", player.getDisplayName())
    .bold(true));
```

## Inventory

```java
// Get the player's inventory
Inventory inventory = player.getInventory();

// Send inventory update to client
player.sendInventory();
```

## Movement and Position

```java
// Move player to a position
player.moveTo(ref, x, y, z, componentAccessor);

// Get view radius
int viewRadius = player.getViewRadius();
int clientViewRadius = player.getClientViewRadius();

// Set view radius
player.setClientViewRadius(viewRadius);
```

## Opening UI Pages

```java
import com.hypixel.hytale.server.core.entity.entities.player.pages.CustomUIPage;

// Get references
Ref<EntityStore> ref = player.getReference();
Store<EntityStore> store = ref.getStore();
PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());

// Create and open a custom page
MyCustomPage page = new MyCustomPage(playerRef);
player.getPageManager().openCustomPage(ref, store, page);

// Close the current page
player.getPageManager().setPage(ref, store, Page.None);
```

## Example: Complete Player Command

```java
public class PlayerInfoCommand extends CommandBase {
    public PlayerInfoCommand() {
        super("playerinfo", "Show player information");
    }

    @Override
    protected void executeSync(CommandContext context) {
        if (!context.isPlayer()) {
            context.sendMessage(Message.raw("This command requires a player."));
            return;
        }

        Player player = context.senderAs(Player.class);
        Ref<EntityStore> ref = player.getReference();
        Store<EntityStore> store = ref.getStore();
        PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());

        StringBuilder info = new StringBuilder();
        info.append("=== Player Info ===\n");
        info.append("Username: ").append(playerRef.getUsername()).append("\n");
        info.append("UUID: ").append(playerRef.getUuid()).append("\n");
        info.append("World: ").append(player.getWorld().getName()).append("\n");
        info.append("View Radius: ").append(player.getViewRadius()).append(" chunks\n");
        info.append("First Spawn: ").append(player.isFirstSpawn()).append("\n");

        context.sendMessage(Message.raw(info.toString()));
    }
}
```

## Related Classes

- [`PlayerRef`](/docs/en/api/server-internals/player#playerref) - Player reference component
- [`LivingEntity`](/docs/en/api/server-internals/entities) - Base class for living entities
- [`CommandSender`](/docs/en/api/server-internals/commands#commandsender-interface) - Interface for command senders
- [`PageManager`](/docs/en/api/server-internals/ui) - UI page management
- [`WindowManager`](/docs/en/api/server-internals/ui) - Window/container management

## PlayerRef

The `PlayerRef` class is a component that provides player identity and network information.

**Source**: `com.hypixel.hytale.server.core.universe.PlayerRef`

### Getting PlayerRef

```java
PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());
```

### PlayerRef Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getUuid()` | `UUID` | Returns the player's UUID |
| `getUsername()` | `String` | Returns the player's username |
| `getLanguage()` | `String` | Returns the player's language setting |
| `getReference()` | `Ref<EntityStore>` | Returns the entity reference |
| `getPacketHandler()` | `PacketHandler` | Returns the network packet handler |
| `getChunkTracker()` | `ChunkTracker` | Returns the chunk tracker |
| `isValid()` | `boolean` | Returns true if the player reference is valid |
| `sendMessage(Message)` | `void` | Sends a message to the player |

### Server Referral

```java
// Redirect player to another server
playerRef.referToServer("other.server.com", 5520);

// With referral data
byte[] data = createReferralData();
playerRef.referToServer("other.server.com", 5520, data);
```
