---
id: plugins
title: Plugin System
sidebar_label: Plugins
sidebar_position: 2
description: Complete documentation of the Java plugin system for the Hytale server
---

# Plugin System

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis. All information includes source file references.
:::

## What is a Plugin?

A **plugin** is a self-contained piece of code that adds new features to the Hytale server without modifying its core source code. Think of plugins like apps on your smartphone - they extend functionality while the operating system remains unchanged.

### Why Use Plugins?

| Approach | Pros | Cons |
|----------|------|------|
| **Modify server code** | Full control | Breaks on updates, hard to share |
| **Use plugins** | Easy updates, shareable, isolated | Limited to what APIs expose |

Plugins are the recommended way to add custom functionality because:
- They survive server updates
- Multiple plugins can work together
- They can be enabled/disabled without restarting
- The community can share and reuse them

### Plugin Lifecycle: Birth to Death

Every plugin goes through a lifecycle, like a living organism:

```
NONE → SETUP → START → ENABLED → SHUTDOWN → DISABLED
  |       |       |        |          |          |
Born   Waking  Running  Fully    Going to    Asleep
       up      systems  active    sleep
```

| State | What happens | What you should do |
|-------|--------------|-------------------|
| **SETUP** | Plugin is waking up, dependencies are ready | Register commands, events, initialize resources |
| **START** | All plugins are set up | Load configurations, connect to databases |
| **ENABLED** | Plugin is fully running | Normal operation |
| **SHUTDOWN** | Server is stopping or plugin is being disabled | Save data, close connections, cleanup |
| **DISABLED** | Plugin is asleep | Nothing - you're done |

### Real-World Analogy: Restaurant Kitchen

Think of the Hytale server as a restaurant kitchen:

- **Server** = The kitchen with all its equipment
- **Plugin** = A specialty chef you hire
- **Manifest** = The chef's resume (name, skills, requirements)
- **Lifecycle** = Chef's work shift (arrive, prep, cook, clean, leave)
- **Registries** = The menu board where chefs post their dishes

Just like a chef:
- Must follow kitchen rules (use the provided registries)
- Can't modify the kitchen structure (server code)
- Must clean up when leaving (shutdown properly)
- Works alongside other chefs (other plugins)

### The Manifest: Your Plugin's ID Card

Every plugin needs a `manifest.json` file that tells the server:

```json
{
    "Group": "MyStudio",           // Who made it (your organization)
    "Name": "CoolFeature",         // What it's called
    "Version": "1.0.0",            // Which version
    "Main": "com.mystudio.Cool",   // Where to find the main class
    "Dependencies": {              // What it needs to work
        "Hytale:CorePlugin": ">=1.0.0"
    }
}
```

This is like a package label - the server knows what's inside without opening it.

### Why Use Registries Instead of Direct Access?

You might wonder why plugins use `getCommandRegistry()` instead of directly accessing `CommandManager`. Here's why:

```java
// BAD: Direct access
CommandManager.get().register(new MyCommand());
// Problem: When your plugin is disabled, the command stays registered!

// GOOD: Using registry
getCommandRegistry().registerCommand(new MyCommand());
// When your plugin is disabled, all your commands are automatically unregistered
```

Registries track everything your plugin creates and clean it up automatically. It's like a hotel checkout - you don't need to remember every towel you used; the staff knows your room and cleans everything.

---

## Technical Documentation

This documentation covers the Hytale Server Plugin System, which enables developers to extend server functionality through Java plugins.

## Table of Contents

1. [Overview](#overview)
2. [Creating a Plugin](#creating-a-plugin)
3. [Plugin Manifest](#plugin-manifest)
4. [Plugin Lifecycle](#plugin-lifecycle)
5. [PluginManager](#pluginmanager)
6. [Accessing Server Services](#accessing-server-services)
7. [Early Plugins and Class Transformers](#early-plugins-and-class-transformers)
8. [Plugin Commands](#plugin-commands)

---

## Overview

The Hytale plugin system is built on Java and enables developers to create server-side modifications. Plugins are loaded from JAR files placed in the `mods/` directory or from the server's classpath.

### Key Components

| Component | Description |
|-----------|-------------|
| `JavaPlugin` | Base class for all Java plugins |
| `PluginBase` | Abstract base class that provides common plugin functionality |
| `PluginManager` | Manages plugin lifecycle and loading |
| `PluginManifest` | JSON configuration file that describes the plugin |
| `PluginClassLoader` | Custom class loader for plugin isolation |

### Plugin Identifier Format

Plugins are identified by a combination of `Group` and `Name`:

```
Group:Name
```

Example: `MyCompany:MyPlugin`

---

## Creating a Plugin

### Basic Plugin Structure

To create a plugin, extend the `JavaPlugin` class:

```java
package com.example.myplugin;

import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import javax.annotation.Nonnull;

public class MyPlugin extends JavaPlugin {

    public MyPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Called during the plugin setup phase
        getLogger().info("MyPlugin is setting up!");
    }

    @Override
    protected void start() {
        // Called when the plugin starts
        getLogger().info("MyPlugin has started!");
    }

    @Override
    protected void shutdown() {
        // Called when the plugin is being disabled
        getLogger().info("MyPlugin is shutting down!");
    }
}
```

### Project Structure

```
my-plugin/
  src/
    main/
      java/
        com/example/myplugin/
          MyPlugin.java
      resources/
        manifest.json
  build.gradle
```

### Constructor Requirements

Your plugin class **must** have a constructor that accepts a `JavaPluginInit` parameter:

```java
public MyPlugin(@Nonnull JavaPluginInit init) {
    super(init);
}
```

The `JavaPluginInit` object provides access to the following:
- `getPluginManifest()` - Returns the plugin's manifest configuration
- `getDataDirectory()` - Returns the path to the plugin's data folder
- `getFile()` - Returns the path to the plugin JAR file
- `getClassLoader()` - Returns the plugin's class loader

---

## Plugin Manifest

Every plugin requires a `manifest.json` file located in the root of the JAR.

### Full Manifest Example

```json
{
    "Group": "MyCompany",
    "Name": "MyPlugin",
    "Version": "1.0.0",
    "Description": "An example plugin for Hytale",
    "Authors": [
        {
            "Name": "Developer Name",
            "Email": "dev@example.com",
            "Url": "https://example.com"
        }
    ],
    "Website": "https://myplugin.example.com",
    "Main": "com.example.myplugin.MyPlugin",
    "ServerVersion": ">=0.1.0",
    "Dependencies": {
        "Hytale:CorePlugin": ">=1.0.0"
    },
    "OptionalDependencies": {
        "OtherCompany:OptionalPlugin": ">=2.0.0"
    },
    "LoadBefore": {
        "Hytale:SomePlugin": "*"
    },
    "DisabledByDefault": false,
    "IncludesAssetPack": true
}
```

### Manifest Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Group` | String | Yes | Organisation or group identifier |
| `Name` | String | Yes | Unique plugin name |
| `Version` | Semver | Yes | Plugin version using semantic versioning |
| `Description` | String | No | Brief description of the plugin |
| `Authors` | Array | No | List of author information objects |
| `Website` | String | No | Plugin website URL |
| `Main` | String | Yes | Fully qualified main class name |
| `ServerVersion` | SemverRange | No | Required server version range |
| `Dependencies` | Object | No | Required plugin dependencies |
| `OptionalDependencies` | Object | No | Optional plugin dependencies |
| `LoadBefore` | Object | No | Plugins that this plugin should load before |
| `DisabledByDefault` | Boolean | No | When true, the plugin must be explicitly enabled |
| `IncludesAssetPack` | Boolean | No | When true, indicates the plugin contains an asset pack |
| `SubPlugins` | Array | No | Nested sub-plugin manifests |

### Author Information Structure

```json
{
    "Name": "Author Name",
    "Email": "author@example.com",
    "Url": "https://author-website.com"
}
```

### Version Ranges

Dependencies use semantic versioning ranges:

| Pattern | Description |
|---------|-------------|
| `*` | Any version |
| `1.0.0` | Exact version match |
| `>=1.0.0` | Version 1.0.0 or higher |
| `>=1.0.0 <2.0.0` | Between 1.0.0 (inclusive) and 2.0.0 (exclusive) |

### Sub-Plugins

A plugin can define nested sub-plugins that inherit properties from the parent:

```json
{
    "Group": "MyCompany",
    "Name": "MainPlugin",
    "Version": "1.0.0",
    "Main": "com.example.MainPlugin",
    "SubPlugins": [
        {
            "Name": "SubFeature",
            "Main": "com.example.SubFeaturePlugin"
        }
    ]
}
```

Sub-plugins automatically inherit `Group`, `Version`, `Authors`, and other fields from the parent manifest.

---

## Plugin Lifecycle

Plugins progress through a well-defined lifecycle managed by the `PluginManager`.

### Plugin States

```java
public enum PluginState {
    NONE,       // Initial state; not yet loaded
    SETUP,      // Setup phase in progress
    START,      // Start phase in progress
    ENABLED,    // Plugin is fully enabled and running
    SHUTDOWN,   // Shutdown in progress
    DISABLED    // Plugin is disabled
}
```

### Lifecycle Flow

```
NONE -> SETUP -> START -> ENABLED -> SHUTDOWN -> DISABLED
```

### Lifecycle Methods

Override these methods to handle lifecycle events:

```java
public class MyPlugin extends JavaPlugin {

    public MyPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    /**
     * Called during the setup phase.
     * Use this method to register commands, events, and initialise resources.
     * Dependencies are guaranteed to be in the SETUP state or later.
     */
    @Override
    protected void setup() {
        // Register commands
        getCommandRegistry().registerCommand(new MyCommand());

        // Register event handlers
        getEventRegistry().register(PlayerJoinEvent.class, this::onPlayerJoin);

        // Register tasks
        getTaskRegistry().registerTask(myAsyncTask());
    }

    /**
     * Called during the start phase.
     * Dependencies are guaranteed to be in the ENABLED state.
     * Asset packs should be registered here.
     */
    @Override
    protected void start() {
        getLogger().info("Plugin started successfully!");
    }

    /**
     * Called when the plugin is shutting down.
     * Use this method to clean up resources, save data, and perform other teardown operations.
     */
    @Override
    protected void shutdown() {
        getLogger().info("Cleaning up resources...");
    }
}
```

### Configuration Loading

Use `withConfig()` to define plugin configurations that are loaded before `setup()` is called:

```java
public class MyPlugin extends JavaPlugin {
    private final Config<MyConfig> config;

    public MyPlugin(@Nonnull JavaPluginInit init) {
        super(init);
        // This must be called before setup
        this.config = withConfig(MyConfig.CODEC);
    }

    @Override
    protected void setup() {
        MyConfig cfg = config.get();
        getLogger().info("Loaded config: " + cfg.getSomeSetting());
    }
}
```

### Pre-Load Phase

The `preLoad()` method is called before `setup()` to load configurations asynchronously:

```java
@Nullable
public CompletableFuture<Void> preLoad() {
    // Automatically handles configuration loading
    // Override only if you need custom pre-loading behaviour
}
```

---

## PluginManager

The `PluginManager` is the central component responsible for managing plugins.

### Obtaining the Instance

```java
PluginManager pluginManager = PluginManager.get();
```

### Key Methods

#### Listing Plugins

```java
// Retrieve all loaded plugins
List<PluginBase> plugins = pluginManager.getPlugins();

// Retrieve a specific plugin
PluginBase plugin = pluginManager.getPlugin(new PluginIdentifier("Group", "Name"));

// Check whether a plugin exists with a specific version
boolean exists = pluginManager.hasPlugin(identifier, SemverRange.fromString(">=1.0.0"));
```

#### Loading and Unloading

```java
// Load a plugin by identifier
boolean success = pluginManager.load(new PluginIdentifier("Group", "Name"));

// Unload a plugin
boolean success = pluginManager.unload(identifier);

// Reload a plugin (unload followed by load)
boolean success = pluginManager.reload(identifier);
```

#### Available Plugins

```java
// Retrieve all available plugins, including disabled ones
Map<PluginIdentifier, PluginManifest> available = pluginManager.getAvailablePlugins();
```

### Plugin Loading Sources

Plugins are loaded from multiple sources in the following order:

1. **Core Plugins** - Built-in server plugins
2. **Builtin Directory** - `<server>/builtin/*.jar`
3. **Classpath** - Plugins in the server classpath
4. **Mods Directory** - `mods/*.jar` (the default location)
5. **Additional Directories** - Specified via the `--mods-directories` argument

### Plugin Load Order

The `PluginManager` calculates the optimal load order based on the following criteria:

1. **Dependencies** - Required plugins are loaded first
2. **Optional Dependencies** - Considered when determining order
3. **LoadBefore** - Explicit ordering hints
4. **Classpath Priority** - Classpath plugins are loaded before external plugins

Cyclic dependencies are detected and will cause loading to fail.

---

## Accessing Server Services

Plugins have access to various server services through registries.

### Available Registries

```java
public class MyPlugin extends JavaPlugin {

    @Override
    protected void setup() {
        // Command registration
        CommandRegistry commands = getCommandRegistry();

        // Event handling
        EventRegistry events = getEventRegistry();

        // Scheduled tasks
        TaskRegistry tasks = getTaskRegistry();

        // Block state registration
        BlockStateRegistry blockStates = getBlockStateRegistry();

        // Entity registration
        EntityRegistry entities = getEntityRegistry();

        // Client features
        ClientFeatureRegistry clientFeatures = getClientFeatureRegistry();

        // Asset registration
        AssetRegistry assets = getAssetRegistry();

        // Entity store components
        ComponentRegistryProxy<EntityStore> entityStore = getEntityStoreRegistry();

        // Chunk store components
        ComponentRegistryProxy<ChunkStore> chunkStore = getChunkStoreRegistry();

        // Codec registration
        CodecMapRegistry codecRegistry = getCodecRegistry(someCodecMap);
    }
}
```

### Registering Commands

```java
@Override
protected void setup() {
    getCommandRegistry().registerCommand(new MyCommand());
}

public class MyCommand extends CommandBase {
    public MyCommand() {
        super("mycommand", "description.key");
        addAliases("mc", "mycmd");
    }

    @Override
    protected void executeSync(@Nonnull CommandContext context) {
        context.sendMessage(Message.raw("Hello from MyPlugin!"));
    }
}
```

### Registering Events

```java
@Override
protected void setup() {
    EventRegistry events = getEventRegistry();

    // Simple event handler
    events.register(PlayerJoinEvent.class, this::onPlayerJoin);

    // Event handler with priority
    events.register(EventPriority.HIGH, PlayerJoinEvent.class, this::onPlayerJoin);

    // Global handler that receives all keys
    events.registerGlobal(SomeKeyedEvent.class, this::onKeyedEvent);

    // Asynchronous event handler
    events.registerAsync(AsyncEvent.class, future ->
        future.thenApply(event -> {
            // Handle asynchronously
            return event;
        })
    );
}

private void onPlayerJoin(PlayerJoinEvent event) {
    getLogger().info("Player joined: " + event.getPlayer().getName());
}
```

### Registering Tasks

```java
@Override
protected void setup() {
    TaskRegistry tasks = getTaskRegistry();

    // Register a CompletableFuture task
    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
        // Perform asynchronous work
    });
    tasks.registerTask(future);

    // Register a scheduled task
    ScheduledFuture<Void> scheduled = scheduler.schedule(() -> {
        // Perform scheduled work
        return null;
    }, 5, TimeUnit.SECONDS);
    tasks.registerTask(scheduled);
}
```

### Accessing the Server

```java
// Obtain the server instance
HytaleServer server = HytaleServer.get();

// Obtain the event bus directly
IEventBus eventBus = server.getEventBus();

// Obtain the server configuration
HytaleServerConfig config = server.getConfig();
```

### Logging

Each plugin has its own logger:

```java
HytaleLogger logger = getLogger();
logger.info("Information message");
logger.warning("Warning message");
logger.severe("Error message");
logger.at(Level.FINE).log("Debug message with %s", "formatting");
logger.at(Level.SEVERE).withCause(exception).log("Error occurred");
```

### Plugin Data Directory

```java
// Obtain the plugin's data directory
Path dataDir = getDataDirectory();

// Typically located at: mods/Group_Name/
```

### Plugin Permissions

Plugins have a base permission string:

```java
String basePermission = getBasePermission();
// Format: "group.name" (lowercase)
```

---

## Early Plugins and Class Transformers

Early plugins are a special type that load **before** the main server starts, enabling bytecode transformation.

### Warning

Early plugins are **unsupported** and may cause stability issues. They require explicit user confirmation before they can run.

### Early Plugin Location

Place early plugin JAR files in the `earlyplugins/` directory or specify paths using command-line arguments:

```bash
java -jar server.jar --early-plugins=/path/to/plugins
java -jar server.jar --accept-early-plugins  # Skip the confirmation prompt
```

### Creating a Class Transformer

Implement the `ClassTransformer` interface:

```java
package com.example.earlyplugin;

import com.hypixel.hytale.plugin.early.ClassTransformer;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class MyTransformer implements ClassTransformer {

    /**
     * Higher priority transformers are executed first.
     */
    @Override
    public int priority() {
        return 100; // Default is 0
    }

    /**
     * Transforms a class's bytecode.
     *
     * @param className    The fully qualified class name (e.g., "com.example.MyClass")
     * @param internalName The internal class name (e.g., "com/example/MyClass")
     * @param classBytes   The original bytecode
     * @return The transformed bytecode, or null to retain the original
     */
    @Nullable
    @Override
    public byte[] transform(@Nonnull String className,
                           @Nonnull String internalName,
                           @Nonnull byte[] classBytes) {
        if (!className.equals("com.hypixel.hytale.SomeClass")) {
            return null; // Do not transform this class
        }

        // Use ASM or a similar library to modify the bytecode
        // Return the modified bytes
        return modifiedBytes;
    }
}
```

### Service Registration

Register your transformer using Java's ServiceLoader mechanism. Create the following file:

```
META-INF/services/com.hypixel.hytale.plugin.early.ClassTransformer
```

With the following content:

```
com.example.earlyplugin.MyTransformer
```

### Protected Classes

The following package prefixes cannot be transformed:

- `java.`, `javax.`, `jdk.`, `sun.`, `com.sun.`
- `org.bouncycastle.`
- `server.io.netty.`
- `org.objectweb.asm.`
- `com.google.gson.`
- `org.slf4j.`, `org.apache.logging.`, `ch.qos.logback.`
- `com.google.flogger.`
- `server.io.sentry.`
- `com.hypixel.protoplus.`
- `com.hypixel.fastutil.`
- `com.hypixel.hytale.plugin.early.`

---

## Plugin Commands

The server provides built-in commands for plugin management.

### `/plugin list` (or `/pl ls`)

Lists all loaded plugins.

### `/plugin load <Group:Name>` (or `/pl l`)

Loads a plugin. Available options:
- `--boot` - Adds the plugin to the boot list without loading it immediately

### `/plugin unload <Group:Name>` (or `/pl u`)

Unloads a plugin. Available options:
- `--boot` - Removes the plugin from the boot list without unloading it

### `/plugin reload <Group:Name>` (or `/pl r`)

Reloads a plugin by unloading and then loading it again.

### `/plugin manage` (or `/pl m`)

Opens the plugin management user interface (available to players only).

---

## Best Practices

### 1. Handle the Lifecycle Properly

```java
@Override
protected void setup() {
    // Initialise resources
    // Register commands, events, etc.
}

@Override
protected void shutdown() {
    // Clean up resources
    // Save data
    // Cancel tasks
}
```

### 2. Use Plugin Registries

Always use the provided registries instead of global registration. This ensures proper cleanup when the plugin is unloaded.

```java
// Correct: uses the plugin registry
getCommandRegistry().registerCommand(new MyCommand());

// Incorrect: bypasses cleanup
CommandManager.get().register(new MyCommand());
```

### 3. Check Plugin State

```java
if (isEnabled()) {
    // Safe to perform operations
}

if (isDisabled()) {
    // Plugin is not active
}
```

### 4. Handle Dependencies

```java
@Override
protected void setup() {
    PluginBase dependency = PluginManager.get()
        .getPlugin(new PluginIdentifier("Group", "RequiredPlugin"));

    if (dependency != null && dependency.isEnabled()) {
        // Use dependency features
    }
}
```

### 5. Follow Logging Best Practices

```java
// Use appropriate log levels
getLogger().at(Level.FINE).log("Debug info");     // Debugging
getLogger().at(Level.INFO).log("Normal info");    // Normal operation
getLogger().at(Level.WARNING).log("Warning");     // Recoverable issues
getLogger().at(Level.SEVERE).log("Error");        // Errors

// Include context in log messages
getLogger().at(Level.SEVERE)
    .withCause(exception)
    .log("Failed to load config for %s", getIdentifier());
```

---

## Example: Complete Plugin

```java
package com.example.greeting;

import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import com.hypixel.hytale.server.core.command.system.basecommands.CommandBase;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.Message;
import javax.annotation.Nonnull;

public class GreetingPlugin extends JavaPlugin {

    public GreetingPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        getLogger().info("Setting up GreetingPlugin...");

        // Register the command
        getCommandRegistry().registerCommand(new GreetCommand());

        // Register the event handler
        getEventRegistry().register(PlayerJoinEvent.class, event -> {
            event.getPlayer().sendMessage(
                Message.raw("Welcome to the server!")
            );
        });
    }

    @Override
    protected void start() {
        getLogger().info("GreetingPlugin started!");
    }

    @Override
    protected void shutdown() {
        getLogger().info("GreetingPlugin shutting down...");
    }

    private class GreetCommand extends CommandBase {
        public GreetCommand() {
            super("greet", "greeting.command.desc");
        }

        @Override
        protected void executeSync(@Nonnull CommandContext context) {
            context.sendMessage(Message.raw("Hello from GreetingPlugin!"));
        }
    }
}
```

**manifest.json:**

```json
{
    "Group": "Example",
    "Name": "GreetingPlugin",
    "Version": "1.0.0",
    "Description": "A simple greeting plugin",
    "Main": "com.example.greeting.GreetingPlugin",
    "Authors": [
        {
            "Name": "Example Developer"
        }
    ]
}
```

---

## Related Documentation

- [Events System](/docs/api/events) - Detailed event handling documentation
- [Commands System](/docs/api/commands) - Command creation guide
- [Asset Packs](/docs/api/assets) - Including assets with plugins
- [Configuration](/docs/api/configuration) - Plugin configuration system
