---
id: access-control
title: Access Control System
sidebar_label: Access Control
sidebar_position: 7
description: Complete documentation of the Hytale access control system for bans, whitelists, and custom access providers
---

# Access Control System

The Access Control system in Hytale provides a comprehensive way to manage server access through bans, whitelists, and custom access providers. This module is essential for server administrators to control who can join their servers.

## Overview

The `AccessControlModule` is a core plugin that manages player access to the server. It provides:

- **Ban System** - Temporary and permanent player bans
- **Whitelist System** - Restrict server access to approved players only
- **Custom Providers** - Extensible interface for custom access control logic

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.AccessControlModule`

## Module Architecture

```java
public class AccessControlModule extends JavaPlugin {
    public static final PluginManifest MANIFEST = PluginManifest.corePlugin(AccessControlModule.class).build();

    private final HytaleWhitelistProvider whitelistProvider = new HytaleWhitelistProvider();
    private final HytaleBanProvider banProvider = new HytaleBanProvider();
    private final List<AccessProvider> providerRegistry = new CopyOnWriteArrayList<>();
    private final Map<String, BanParser> parsers = new ConcurrentHashMap<>();

    public static AccessControlModule get() {
        return instance;
    }
}
```

## AccessProvider Interface

All access control providers implement the `AccessProvider` interface:

```java
public interface AccessProvider {
    @Nonnull
    CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid);
}
```

The method returns:
- `Optional.empty()` - Player is allowed to connect
- `Optional.of(message)` - Player is denied with the given message

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.AccessProvider`

## Ban System

### Ban Interface

The `Ban` interface defines the structure for all ban types:

```java
public interface Ban extends AccessProvider {
    UUID getTarget();           // Banned player's UUID
    UUID getBy();               // UUID of the banning admin
    Instant getTimestamp();     // When the ban was issued
    boolean isInEffect();       // Whether the ban is currently active
    Optional<String> getReason(); // Ban reason (optional)
    String getType();           // Ban type identifier
    JsonObject toJsonObject();  // Serialize to JSON
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.Ban`

### Ban Types

#### Infinite Ban (Permanent)

Permanent bans never expire:

```java
public class InfiniteBan extends AbstractBan {
    public InfiniteBan(UUID target, UUID by, Instant timestamp, String reason) {
        super(target, by, timestamp, reason);
    }

    @Override
    public boolean isInEffect() {
        return true;  // Always active
    }

    @Override
    public String getType() {
        return "infinite";
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        StringBuilder message = new StringBuilder("You are permanently banned!");
        this.reason.ifPresent(s -> message.append(" Reason: ").append(s));
        return CompletableFuture.completedFuture(Optional.of(message.toString()));
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.InfiniteBan`

#### Timed Ban (Temporary)

Temporary bans expire after a set duration:

```java
public class TimedBan extends AbstractBan {
    private final Instant expiresOn;

    public TimedBan(UUID target, UUID by, Instant timestamp, Instant expiresOn, String reason) {
        super(target, by, timestamp, reason);
        this.expiresOn = expiresOn;
    }

    @Override
    public boolean isInEffect() {
        return this.expiresOn.isAfter(Instant.now());
    }

    @Override
    public String getType() {
        return "timed";
    }

    public Instant getExpiresOn() {
        return this.expiresOn;
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        Duration timeRemaining = Duration.between(Instant.now(), this.expiresOn);
        StringBuilder message = new StringBuilder("You are temporarily banned for ")
            .append(StringUtil.humanizeTime(timeRemaining))
            .append('!');
        this.reason.ifPresent(s -> message.append(" Reason: ").append(s));
        return CompletableFuture.completedFuture(Optional.of(message.toString()));
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.TimedBan`

### HytaleBanProvider

The default ban provider manages bans stored in `bans.json`:

```java
public class HytaleBanProvider extends BlockingDiskFile implements AccessProvider {
    private final Map<UUID, Ban> bans = new Object2ObjectOpenHashMap<>();

    public HytaleBanProvider() {
        super(Paths.get("bans.json"));
    }

    public boolean hasBan(UUID uuid) {
        this.fileLock.readLock().lock();
        try {
            return this.bans.containsKey(uuid);
        } finally {
            this.fileLock.readLock().unlock();
        }
    }

    public boolean modify(@Nonnull Function<Map<UUID, Ban>, Boolean> function) {
        this.fileLock.writeLock().lock();
        boolean modified;
        try {
            modified = function.apply(this.bans);
        } finally {
            this.fileLock.writeLock().unlock();
        }
        if (modified) {
            this.syncSave();
        }
        return modified;
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleBanProvider`

### Custom Ban Parser

You can register custom ban types using the `BanParser` interface:

```java
@FunctionalInterface
public interface BanParser {
    Ban parse(JsonObject object) throws JsonParseException;
}
```

Register a custom ban parser:

```java
AccessControlModule.get().registerBanParser("myCustomBan", MyCustomBan::fromJsonObject);
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.BanParser`

## Whitelist System

### HytaleWhitelistProvider

The whitelist provider manages allowed players in `whitelist.json`:

```java
public class HytaleWhitelistProvider extends BlockingDiskFile implements AccessProvider {
    private final Set<UUID> whitelist = new HashSet<>();
    private boolean isEnabled;

    public HytaleWhitelistProvider() {
        super(Paths.get("whitelist.json"));
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        this.lock.readLock().lock();
        try {
            if (!this.isEnabled || this.whitelist.contains(uuid)) {
                return CompletableFuture.completedFuture(Optional.empty());
            }
            return CompletableFuture.completedFuture(Optional.of("You are not whitelisted!"));
        } finally {
            this.lock.readLock().unlock();
        }
    }

    public void setEnabled(boolean isEnabled) {
        this.lock.writeLock().lock();
        try {
            this.isEnabled = isEnabled;
        } finally {
            this.lock.writeLock().unlock();
        }
    }

    public boolean isEnabled() { ... }

    public Set<UUID> getList() {
        this.lock.readLock().lock();
        try {
            return Collections.unmodifiableSet(this.whitelist);
        } finally {
            this.lock.readLock().unlock();
        }
    }

    public boolean modify(@Nonnull Function<Set<UUID>, Boolean> consumer) {
        this.lock.writeLock().lock();
        boolean result;
        try {
            result = consumer.apply(this.whitelist);
        } finally {
            this.lock.writeLock().unlock();
        }
        if (result) {
            this.syncSave();
        }
        return result;
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleWhitelistProvider`

### Whitelist File Format

The `whitelist.json` file structure:

```json
{
    "enabled": false,
    "list": [
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
    ]
}
```

## Registering Custom Access Providers

You can add custom access providers to extend the system:

```java
public class MyCustomProvider implements AccessProvider {
    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        // Custom access logic here
        if (isPlayerBanned(uuid)) {
            return CompletableFuture.completedFuture(
                Optional.of("You have been banned by custom provider!")
            );
        }
        return CompletableFuture.completedFuture(Optional.empty());
    }
}

// Register the provider
AccessControlModule.get().registerAccessProvider(new MyCustomProvider());
```

## Console Commands

### Ban Commands

| Command | Description |
|---------|-------------|
| `/ban <username> [reason]` | Permanently ban a player |
| `/unban <username>` | Remove a player's ban |

**Ban Command Details:**

```java
public class BanCommand extends AbstractAsyncCommand {
    private final RequiredArg<String> usernameArg =
        this.withRequiredArg("username", "server.commands.ban.username.desc", ArgTypes.STRING);
    private final OptionalArg<String> reasonArg =
        this.withOptionalArg("reason", "server.commands.ban.reason.desc", ArgTypes.STRING);

    public BanCommand(@Nonnull HytaleBanProvider banProvider) {
        super("ban", "server.commands.ban.desc");
        this.setUnavailableInSingleplayer(true);
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.commands.BanCommand`

### Whitelist Commands

| Command | Description | Aliases |
|---------|-------------|---------|
| `/whitelist add <username>` | Add a player to the whitelist | - |
| `/whitelist remove <username>` | Remove a player from the whitelist | - |
| `/whitelist enable` | Enable the whitelist | `on` |
| `/whitelist disable` | Disable the whitelist | `off` |
| `/whitelist status` | Show whitelist enabled/disabled status | - |
| `/whitelist list` | List whitelisted players (up to 10) | - |
| `/whitelist clear` | Remove all players from the whitelist | - |

**Whitelist Command Structure:**

```java
public class WhitelistCommand extends AbstractCommandCollection {
    public WhitelistCommand(@Nonnull HytaleWhitelistProvider whitelistProvider) {
        super("whitelist", "server.commands.whitelist.desc");
        this.addSubCommand(new WhitelistAddCommand(whitelistProvider));
        this.addSubCommand(new WhitelistRemoveCommand(whitelistProvider));
        this.addSubCommand(new WhitelistEnableCommand(whitelistProvider));
        this.addSubCommand(new WhitelistDisableCommand(whitelistProvider));
        this.addSubCommand(new WhitelistClearCommand(whitelistProvider));
        this.addSubCommand(new WhitelistStatusCommand(whitelistProvider));
        this.addSubCommand(new WhitelistListCommand(whitelistProvider));
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.accesscontrol.commands.WhitelistCommand`

## Plugin Example

Here is a complete example of a plugin that implements custom access control:

```java
public class CustomAccessControlPlugin extends JavaPlugin {

    private final Set<UUID> vipPlayers = ConcurrentHashMap.newKeySet();

    public CustomAccessControlPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Register a custom access provider for VIP-only mode
        AccessControlModule.get().registerAccessProvider(new VipOnlyProvider());

        // Register a custom ban type
        AccessControlModule.get().registerBanParser("warning", WarningBan::fromJsonObject);
    }

    // Custom access provider for VIP-only mode
    private class VipOnlyProvider implements AccessProvider {
        private boolean vipOnlyMode = false;

        @Override
        public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
            if (vipOnlyMode && !vipPlayers.contains(uuid)) {
                return CompletableFuture.completedFuture(
                    Optional.of("Server is currently in VIP-only mode!")
                );
            }
            return CompletableFuture.completedFuture(Optional.empty());
        }

        public void setVipOnlyMode(boolean enabled) {
            this.vipOnlyMode = enabled;
        }
    }

    // Ban a player programmatically
    public void banPlayer(UUID target, UUID bannedBy, String reason) {
        AccessControlModule module = AccessControlModule.get();
        InfiniteBan ban = new InfiniteBan(target, bannedBy, Instant.now(), reason);

        // Get the ban provider and add the ban
        // Note: You would need to access the provider through reflection
        // or use the ban command
    }

    // Check if a player is banned
    public boolean isPlayerBanned(UUID uuid) {
        // Implementation would check the ban provider
        return false;
    }
}
```

## Data Storage

### bans.json Format

Bans are stored as a JSON array:

```json
[
    {
        "type": "infinite",
        "target": "550e8400-e29b-41d4-a716-446655440000",
        "by": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "timestamp": 1704067200000,
        "reason": "Cheating"
    },
    {
        "type": "timed",
        "target": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "by": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "timestamp": 1704067200000,
        "expiresOn": 1704153600000,
        "reason": "Spamming"
    }
]
```

### AbstractBan JSON Serialization

```java
public JsonObject toJsonObject() {
    JsonObject object = new JsonObject();
    object.addProperty("type", this.getType());
    object.addProperty("target", this.target.toString());
    object.addProperty("by", this.by.toString());
    object.addProperty("timestamp", this.timestamp.toEpochMilli());
    this.reason.ifPresent(s -> object.addProperty("reason", s));
    return object;
}
```

## Connection Flow

When a player attempts to connect, the `AccessControlModule` processes the connection:

```java
this.getEventRegistry().register(PlayerSetupConnectEvent.class, event -> {
    CompletableFuture<Optional<String>> completableFuture =
        this.getDisconnectReason(event.getUuid());
    Optional<String> disconnectReason = completableFuture.join();
    if (disconnectReason.isPresent()) {
        event.setReason(disconnectReason.get());
        event.setCancelled(true);
    }
});
```

The system checks all registered providers in order. If any provider returns a disconnect reason, the connection is rejected.

## Thread Safety

Both providers use `ReadWriteLock` for thread-safe access:

- **Read operations** - Multiple threads can read simultaneously
- **Write operations** - Exclusive access for modifications
- **Auto-save** - Changes are automatically persisted after modifications

## Source Files

| Class | Path |
|-------|------|
| `AccessControlModule` | `com.hypixel.hytale.server.core.modules.accesscontrol.AccessControlModule` |
| `AccessProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.AccessProvider` |
| `HytaleBanProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleBanProvider` |
| `HytaleWhitelistProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleWhitelistProvider` |
| `Ban` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.Ban` |
| `AbstractBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.AbstractBan` |
| `InfiniteBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.InfiniteBan` |
| `TimedBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.TimedBan` |
| `BanParser` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.BanParser` |
| `BanCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.BanCommand` |
| `UnbanCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.UnbanCommand` |
| `WhitelistCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.WhitelistCommand` |
