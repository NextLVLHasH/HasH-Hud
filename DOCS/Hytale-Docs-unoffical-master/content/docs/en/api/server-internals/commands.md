---
id: commands
title: Command System
sidebar_label: Commands
sidebar_position: 4
description: Complete documentation of the command system for the Hytale server
---

# Command System

:::info v2 Documentation - Verified
This documentation has been verified against decompiled server source code using multi-agent analysis. All information includes source file references.
:::

## What is a Command System?

A **command system** is the text-based interface that allows players and administrators to interact with the server. When you type `/gamemode creative` in chat, the command system parses your input, validates permissions, and executes the appropriate action.

### How Commands Work

Think of commands like ordering at a restaurant:

```
/give Steve diamond_sword --quantity=5 --enchanted
  │     │        │               │           │
  │     │        │               │           └── Flag (yes/no option)
  │     │        │               └── Optional argument
  │     │        └── Required argument
  │     └── Target (who receives it)
  └── Command name
```

The command system handles:
1. **Parsing**: Breaking the text into pieces
2. **Validation**: Checking if arguments are valid
3. **Permissions**: Verifying the sender has access
4. **Execution**: Running the actual logic

### Anatomy of a Command

Every command has these parts:

| Part | What it does | Example |
|------|--------------|---------|
| **Name** | How to call the command | `give`, `teleport`, `ban` |
| **Aliases** | Alternative names | `tp` for `teleport` |
| **Arguments** | Data the command needs | Player name, item ID |
| **Permission** | Who can use it | `hytale.command.give` |
| **Description** | Help text | "Gives items to players" |

### Sync vs Async Commands

Commands can run in two modes:

| Type | When to use | Example |
|------|-------------|---------|
| **Synchronous** | Quick operations that need immediate results | `/kill` - player dies instantly |
| **Asynchronous** | Slow operations that shouldn't freeze the server | `/backup` - saving world takes time |

**Rule of thumb**: If your command talks to a database, web API, or processes lots of data, make it async.

### Command Arguments Explained

Arguments are the data your command needs. Hytale provides a type-safe system:

```java
// The command: /heal <player> --amount=50 --fully
RequiredArg<PlayerRef> targetArg;   // Must provide a player
OptionalArg<Integer> amountArg;     // Can specify an amount
FlagArg fullyFlag;                  // Boolean: is --fully present?
```

| Argument Type | Syntax | When to use |
|---------------|--------|-------------|
| **Required** | `<name>` | Must be provided |
| **Optional** | `--name=value` | Can be omitted |
| **Default** | `--name=value` | Has a fallback value |
| **Flag** | `--name` | Yes/no toggle |

### The Permission Hierarchy

Permissions control who can run what:

```
hytale
├── command
│   ├── give          # /give permission
│   │   └── others    # /give to other players
│   ├── teleport
│   │   ├── self      # Teleport yourself
│   │   └── others    # Teleport other players
│   └── ban
│       └── permanent # Permanent bans
```

Players can have:
- Specific permissions: `hytale.command.give`
- Wildcard permissions: `hytale.command.*`
- Permission groups: `Admin` (which includes many permissions)

### Real-World Analogy: Voice Assistant

Commands work like talking to a voice assistant:

- **"Hey Siri, set a timer for 5 minutes"**
  - Command: `set timer`
  - Argument: `5 minutes`

- **"/give Steve diamond 64"**
  - Command: `give`
  - Arguments: `Steve`, `diamond`, `64`

Both need to:
1. Understand what you're asking (parsing)
2. Check if you're allowed (permissions)
3. Execute the action
4. Report back the result

---

## Technical Overview

The Hytale server implements a comprehensive command system located in `com.hypixel.hytale.server.core.command`. This system provides a flexible framework for creating, registering, and executing commands with full support for permissions, arguments, subcommands, and asynchronous execution.

---

## Architecture

### Core Components

| Class | Description |
|-------|-------------|
| `CommandManager` | Singleton responsible for managing command registration and execution |
| `AbstractCommand` | Base class from which all commands inherit |
| `CommandSender` | Interface representing entities capable of executing commands |
| `CommandContext` | Execution context containing the sender and parsed arguments |
| `CommandRegistry` | Registry for plugin-defined commands |
| `ParseResult` | Container for parsing results and error messages |
| `Tokenizer` | Parser that converts command input into tokens |

### Class Hierarchy

```
AbstractCommand
├── CommandBase                    # Synchronous commands
├── AbstractAsyncCommand           # Asynchronous commands
│   ├── AbstractPlayerCommand      # Commands restricted to players
│   ├── AbstractWorldCommand       # Commands requiring world context
│   ├── AbstractTargetPlayerCommand # Commands that target specific players
│   ├── AbstractTargetEntityCommand # Commands that target specific entities
│   ├── AbstractAsyncPlayerCommand  # Asynchronous player commands
│   └── AbstractAsyncWorldCommand   # Asynchronous world commands
└── AbstractCommandCollection      # Commands consisting only of subcommands
```

---

## CommandManager

The `CommandManager` serves as the central hub for all command management operations:

```java
public class CommandManager implements CommandOwner {
    private final Map<String, AbstractCommand> commandRegistration;
    private final Map<String, String> aliases;

    // Singleton access
    public static CommandManager get();

    // Register system commands
    public void registerSystemCommand(AbstractCommand command);

    // Register any command
    public CommandRegistration register(AbstractCommand command);

    // Execute a command
    public CompletableFuture<Void> handleCommand(CommandSender sender, String commandString);
    public CompletableFuture<Void> handleCommand(PlayerRef playerRef, String command);
}
```

### Command Execution Flow

1. The command string is tokenized by the `Tokenizer`
2. The command name is extracted and resolved (including alias resolution)
3. A parser context is created
4. The command's `acceptCall()` method is invoked
5. Arguments are processed and validated
6. The `execute()` method is called with the `CommandContext`

---

## Creating Custom Commands

### Basic Synchronous Command

```java
public class MyCommand extends CommandBase {
    public MyCommand() {
        super("mycommand", "server.commands.mycommand.desc");
        addAliases("mc", "mycmd");
    }

    @Override
    protected void executeSync(CommandContext context) {
        context.sendMessage(Message.raw("Hello!"));
    }
}
```

### Asynchronous Command

```java
public class MyAsyncCommand extends AbstractAsyncCommand {
    public MyAsyncCommand() {
        super("myasync", "server.commands.myasync.desc");
    }

    @Override
    protected CompletableFuture<Void> executeAsync(CommandContext context) {
        return CompletableFuture.runAsync(() -> {
            // Perform asynchronous work here
            context.sendMessage(Message.raw("Done!"));
        });
    }
}
```

### Player-Only Command

```java
public class MyPlayerCommand extends AbstractPlayerCommand {
    public MyPlayerCommand() {
        super("myplayercmd", "server.commands.myplayercmd.desc");
    }

    @Override
    protected void execute(
        CommandContext context,
        Store<EntityStore> store,
        Ref<EntityStore> ref,
        PlayerRef playerRef,
        World world
    ) {
        // Access to player store and world is available
        Player player = store.getComponent(ref, Player.getComponentType());
        context.sendMessage(Message.raw("Hello " + playerRef.getUsername()));
    }
}
```

### World Command

```java
public class MyWorldCommand extends AbstractWorldCommand {
    public MyWorldCommand() {
        super("myworldcmd", "server.commands.myworldcmd.desc");
    }

    @Override
    protected void execute(CommandContext context, World world, Store<EntityStore> store) {
        // Access to world context is available
        context.sendMessage(Message.raw("World: " + world.getName()));
    }
}
```

### Command Collection (Subcommands Only)

```java
public class MyCommandCollection extends AbstractCommandCollection {
    public MyCommandCollection() {
        super("mycollection", "server.commands.mycollection.desc");
        addSubCommand(new SubCommand1());
        addSubCommand(new SubCommand2());
    }
}
```

---

## Arguments System

### Argument Types

| Type | Description | Syntax |
|------|-------------|--------|
| `RequiredArg<T>` | Must be provided by the user | `<name:type>` |
| `OptionalArg<T>` | May be omitted | `--name=value` |
| `DefaultArg<T>` | Optional with a default value | `--name=value` (default is shown) |
| `FlagArg` | Boolean flag | `--name` |

### Registering Arguments

```java
public class MyCommandWithArgs extends CommandBase {
    // Required argument
    private final RequiredArg<String> nameArg =
        withRequiredArg("name", "description.key", ArgTypes.STRING);

    // Optional argument
    private final OptionalArg<Integer> countArg =
        withOptionalArg("count", "description.key", ArgTypes.INTEGER);

    // Default argument
    private final DefaultArg<Double> radiusArg =
        withDefaultArg("radius", "description.key", ArgTypes.DOUBLE, 10.0, "10");

    // Flag argument
    private final FlagArg verboseFlag =
        withFlagArg("verbose", "description.key");

    // List argument
    private final RequiredArg<List<String>> tagsArg =
        withListRequiredArg("tags", "description.key", ArgTypes.STRING);
}
```

### Using Arguments in Execute Methods

```java
@Override
protected void executeSync(CommandContext context) {
    // Retrieve required argument
    String name = nameArg.get(context);

    // Check whether an optional argument was provided
    if (countArg.provided(context)) {
        Integer count = countArg.get(context);
    }

    // Default arguments return their default value if not provided
    Double radius = radiusArg.get(context);

    // Flags return a Boolean value
    Boolean verbose = verboseFlag.get(context);
}
```

### Common Argument Types (ArgTypes)

| Type | Java Type | Description |
|------|-----------|-------------|
| `STRING` | `String` | Text value |
| `INTEGER` | `Integer` | Whole number |
| `DOUBLE` | `Double` | Decimal number |
| `BOOLEAN` | `Boolean` | true/false |
| `PLAYER_REF` | `PlayerRef` | Online player reference |
| `WORLD` | `World` | Loaded world reference |
| `ITEM_ASSET` | `Item` | Item asset reference |
| `BLOCK_TYPE_KEY` | `String` | Block type identifier |
| `GAME_MODE` | `GameMode` | Game mode enumeration |
| `RELATIVE_POSITION` | `RelativeDoublePosition` | Position (supports ~ for relative coordinates) |
| `ROTATION` | `Vector3f` | Rotation vector |
| `ENTITY_ID` | `EntityWrappedArg` | Entity reference |

### Argument Validation

```java
private final OptionalArg<Double> radiusArg =
    withOptionalArg("radius", "desc", ArgTypes.DOUBLE)
        .addValidator(Validators.greaterThan(0.0));
```

### Argument Dependencies

```java
// Required if another argument is provided
optionalArg.requiredIf(otherArg);

// Required if another argument is absent
optionalArg.requiredIfAbsent(otherArg);

// Available only if another argument is provided
optionalArg.availableOnlyIfAll(otherArg);

// Available only if another argument is absent
optionalArg.availableOnlyIfAllAbsent(otherArg);
```

---

## Permission System

### Setting Permissions

```java
public class MyCommand extends CommandBase {
    public MyCommand() {
        super("mycommand", "description");

        // Explicit permission
        requirePermission("hytale.custom.mycommand");

        // Alternatively, use the helper for standard format
        requirePermission(HytalePermissions.fromCommand("mycommand"));
    }
}
```

### Permission Generation

If no permission is explicitly set, permissions are automatically generated:
- System commands: `hytale.system.command.<name>`
- Plugin commands: `<plugin.basepermission>.command.<name>`
- Subcommands: `<parent.permission>.<name>`

### Permission Groups

```java
// Assign to a game mode permission group
setPermissionGroup(GameMode.Adventure);
setPermissionGroup(GameMode.Creative);

// Assign to multiple groups
setPermissionGroups("Adventure", "Creative");
```

### Argument-Level Permissions

```java
private final OptionalArg<PlayerRef> playerArg =
    withOptionalArg("player", "desc", ArgTypes.PLAYER_REF)
        .setPermission("mycommand.target.other");
```

### Checking Permissions

```java
// During command execution
if (context.sender().hasPermission("some.permission")) {
    // Permission granted
}

// Utility method (throws NoPermissionException if permission is denied)
CommandUtil.requirePermission(context.sender(), "some.permission");
```

---

## CommandContext API

The `CommandContext` object provides access to command execution context and sender information.

### Available Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `sender()` | `CommandSender` | Returns the command sender |
| `isPlayer()` | `boolean` | Returns true if sender is a player |
| `senderAs(Class<T>)` | `T` | Casts the sender to the specified type |
| `senderAsPlayerRef()` | `Ref<EntityStore>` | Returns the player's entity reference |
| `sendMessage(Message)` | `void` | Sends a message to the sender |
| `getInputString()` | `String` | Returns the raw command input string |
| `hasPermission(String)` | `boolean` | Checks if sender has a permission |

### Getting Raw Command Input

The `getInputString()` method returns the full raw input string that the user typed:

```java
@Override
protected void executeSync(CommandContext context) {
    // Get the raw input: "/mycommand arg1 arg2 arg3"
    String rawInput = context.getInputString();

    // Split into arguments
    String[] args = rawInput.split("\\s+");
    // args[0] = "mycommand" (or "/mycommand")
    // args[1] = "arg1"
    // args[2] = "arg2"
    // ...
}
```

### Sending Messages

```java
// Send a raw text message
context.sendMessage(Message.raw("Hello, world!"));

// Send a translated message
context.sendMessage(Message.translation("server.commands.welcome"));

// Send a formatted message with parameters
context.sendMessage(Message.translation("server.commands.greeting")
    .param("name", playerName));
```

---

## CommandSender Interface

```java
public interface CommandSender extends IMessageReceiver, PermissionHolder {
    String getDisplayName();
    UUID getUuid();
}
```

### ConsoleSender vs PlayerSender

| Feature | ConsoleSender | Player (PlayerSender) |
|---------|---------------|----------------------|
| `getDisplayName()` | "Console" | Player username |
| `getUuid()` | Null or fixed UUID | Player UUID |
| `hasPermission()` | Typically always returns true | Checked against permission system |
| `sendMessage()` | Logs to console | Sends to player chat |
| World context | None | Player's current world |

### Detecting Sender Type

```java
@Override
protected void executeSync(CommandContext context) {
    if (context.isPlayer()) {
        // Sender is a player
        Player player = context.senderAs(Player.class);
        Ref<EntityStore> ref = context.senderAsPlayerRef();
    } else {
        // Sender is console or another type
        CommandSender sender = context.sender();
    }
}
```

---

## Subcommands and Variants

### Adding Subcommands

```java
public class ParentCommand extends AbstractCommandCollection {
    public ParentCommand() {
        super("parent", "description");
        addSubCommand(new ChildCommand1());
        addSubCommand(new ChildCommand2());
    }
}

// Usage: /parent child1 ...
// Usage: /parent child2 ...
```

### Usage Variants

Variants allow different argument patterns for the same command:

```java
public class GameModeCommand extends AbstractPlayerCommand {
    private final RequiredArg<GameMode> gameModeArg =
        withRequiredArg("gamemode", "desc", ArgTypes.GAME_MODE);

    public GameModeCommand() {
        super("gamemode", "description");
        addUsageVariant(new GameModeOtherCommand()); // Two-argument variant
    }

    // One required argument: /gamemode <mode>
    @Override
    protected void execute(...) { }

    private static class GameModeOtherCommand extends CommandBase {
        private final RequiredArg<GameMode> gameModeArg = ...;
        private final RequiredArg<PlayerRef> playerArg = ...;

        // Two required arguments: /gamemode <mode> <player>
        @Override
        protected void executeSync(...) { }
    }
}
```

---

## Command Input Syntax

### Basic Syntax

```
/command <required> [--optional=value] [--flag]
```

### Tokenizer Features

| Syntax | Description |
|--------|-------------|
| `word` | Single token |
| `"quoted string"` | String containing spaces |
| `'single quotes'` | Alternative quoting style |
| `[a,b,c]` | List argument |
| `\,` `\"` `\'` | Escaped characters |
| `--arg=value` | Optional argument |
| `--flag` | Boolean flag |

### Special Arguments

```
--help     # Display command help
--confirm  # Confirm dangerous operations
```

---

## Built-in Commands Reference

### Server Commands

| Command | Description | Aliases | Arguments |
|---------|-------------|---------|-----------|
| `stop` | Shut down the server | `shutdown` | `--crash` (flag) |
| `kick` | Kick a player from the server | - | `<player>` |
| `who` | List all online players | - | - |
| `maxplayers` | Get or set the maximum player count | - | `--amount` |
| `auth` | Authentication commands | - | Subcommands |

#### Auth Subcommands
- `auth status` - Check authentication status
- `auth login` - Login commands
- `auth select` - Select an account
- `auth logout` - Log out
- `auth cancel` - Cancel the login process
- `auth persistence` - Persistence settings

---

### Player Commands

| Command | Description | Aliases | Arguments |
|---------|-------------|---------|-----------|
| `gamemode` | Change the game mode | `gm` | `<gamemode>` `[player]` |
| `kill` | Kill a player | - | `[player]` |
| `damage` | Inflict damage on a player | - | `<amount>` `[player]` |
| `give` | Give items to a player | - | `<item>` `--quantity` `--metadata` |
| `inventory` | Inventory management | - | Subcommands |
| `sudo` | Execute a command as another player | `su` | `<player>` `<command...>` |
| `whereami` | Display location information | - | `[player]` |
| `whoami` | Display player information | - | - |
| `hide` | Toggle player visibility | - | - |
| `refer` | Reference command | - | - |
| `player` | Player management | - | Subcommands |

#### Player Subcommands
- `player reset` - Reset a player
- `player stats` - Statistics management (get/set/add/reset/dump/settomax)
- `player effect` - Effect management (apply/clear)
- `player respawn` - Respawn a player
- `player camera` - Camera controls (reset/topdown/sidescroller/demo)
- `player viewradius` - View radius (get/set)
- `player zone` - Zone information

#### Inventory Subcommands
- `inventory clear` - Clear inventory
- `inventory see` - View inventory
- `inventory item` - Item management
- `inventory backpack` - Backpack management
- `give armor` - Give an armor set

#### ItemState Command
- `itemstate` - Item state management

---

### World Commands

| Command | Description | Aliases | Arguments |
|---------|-------------|---------|-----------|
| `spawnblock` | Spawn a block entity | - | `<block>` `<position>` `--rotation` |
| `chunk` | Chunk management | `chunks` | Subcommands |
| `entity` | Entity management | `entities` | Subcommands |
| `worldgen` | World generation | `wg` | Subcommands |

#### Chunk Subcommands
| Subcommand | Description |
|------------|-------------|
| `chunk fixheightmap` | Fix chunk height map |
| `chunk forcetick` | Force a chunk tick |
| `chunk info` | Display chunk information |
| `chunk lighting` | Lighting management |
| `chunk load` | Load a chunk |
| `chunk loaded` | List all loaded chunks |
| `chunk marksave` | Mark a chunk for saving |
| `chunk maxsendrate` | Set maximum send rate |
| `chunk regenerate` | Regenerate a chunk |
| `chunk resend` | Resend a chunk to clients |
| `chunk tint` | Chunk tint settings |
| `chunk tracker` | Chunk tracker information |
| `chunk unload` | Unload a chunk |

#### Entity Subcommands
| Subcommand | Description |
|------------|-------------|
| `entity clone` | Clone an entity |
| `entity remove` | Remove an entity |
| `entity dump` | Dump entity data |
| `entity clean` | Clean up entities |
| `entity lod` | Level of detail settings |
| `entity tracker` | Tracker information |
| `entity resend` | Resend an entity |
| `entity nameplate` | Nameplate management |
| `entity stats` | Entity statistics (get/set/add/reset/dump/settomax) |
| `entity snapshot` | Snapshot management (length/history) |
| `entity effect` | Entity effects |
| `entity makeinteractable` | Make an entity interactable |
| `entity intangible` | Toggle intangibility |
| `entity invulnerable` | Toggle invulnerability |
| `entity hidefromadventureplayers` | Hide from adventure mode players |
| `entity count` | Count entities |

#### WorldGen Subcommands
- `worldgen benchmark` - Run generation benchmark
- `worldgen reload` - Reload world generation configuration

---

### Debug Commands

| Command | Description | Aliases | Arguments |
|---------|-------------|---------|-----------|
| `ping` | Check player ping | - | `--player` `--detail` |
| `version` | Display server version | - | - |
| `log` | Manage logging | - | `<logger>` `--level` `--save` `--reset` |
| `pidcheck` | Check process ID | - | - |
| `packetstats` | Display packet statistics | - | - |
| `hitdetection` | Hit detection debugging | - | - |
| `assets` | Asset commands | - | Subcommands |
| `packs` | Pack management | - | Subcommands |
| `server` | Server management | - | Subcommands |
| `stresstest` | Stress testing | - | Subcommands |
| `hitboxcollision` | Hitbox collision debugging | - | Subcommands |
| `repulsion` | Repulsion debugging | - | Subcommands |
| `debugplayerposition` | Debug player position | - | - |
| `messagetranslationtest` | Test message translations | - | - |
| `hudmanagertest` | HUD manager testing | - | - |
| `stopnetworkchunksending` | Stop network chunk sending | - | - |
| `showbuildertoolshud` | Display builder tools HUD | - | - |
| `particle` | Particle effects | - | - |
| `tagpattern` | Tag pattern debugging | - | - |

#### Server Subcommands
- `server stats` - Server statistics (memory/cpu/gc)
- `server gc` - Force garbage collection
- `server dump` - Dump server state

#### StressTest Subcommands
- `stresstest start` - Start a stress test
- `stresstest stop` - Stop the stress test

#### Ping Subcommands
- `ping clear` / `ping reset` - Clear ping history
- `ping graph` - Display ping graph (`--width` `--height`)

---

### Utility Commands

| Command | Description | Aliases | Arguments |
|---------|-------------|---------|-----------|
| `help` | Display help information | `?` | `[command]` |
| `backup` | Create a backup | - | - |
| `notify` | Send a notification | - | - |
| `eventtitle` | Display event title | - | - |
| `stash` | Stash management | - | - |
| `convertprefabs` | Convert prefabs | - | - |
| `validatecpb` | Validate CPB files | - | - |
| `worldmap` | World map commands | - | Subcommands |
| `sound` | Sound commands | - | Subcommands |
| `lighting` | Lighting commands | - | Subcommands |
| `sleep` | Sleep commands | - | Subcommands |
| `network` | Network commands | - | - |
| `commands` | List all commands | - | - |
| `update` | Update commands | - | Subcommands |

#### WorldMap Subcommands
- `worldmap discover` - Discover an area
- `worldmap undiscover` - Remove discovery of an area
- `worldmap clearmarkers` - Clear all markers
- `worldmap reload` - Reload the map
- `worldmap viewradius` - View radius (get/set/remove)

#### Sound Subcommands
- `sound play2d` - Play a 2D sound
- `sound play3d` - Play a 3D sound

#### Lighting Subcommands
- `lighting get` - Get lighting information
- `lighting send` - Send lighting data
- `lighting sendtoggle` - Toggle lighting send
- `lighting info` - Display lighting information
- `lighting calculation` - Calculate lighting
- `lighting invalidate` - Invalidate lighting cache

#### Sleep Subcommands
- `sleep offset` - Set sleep offset
- `sleep test` - Test sleep functionality

#### Update Subcommands
- `update assets` - Update assets
- `update prefabs` - Update prefabs

---

## Exception Handling

### Command Exceptions

```java
public abstract class CommandException extends RuntimeException {
    public abstract void sendTranslatedMessage(CommandSender sender);
}

// Specific exceptions
public class NoPermissionException extends CommandException
public class SenderTypeException extends CommandException
public class GeneralCommandException extends CommandException
```

### Throwing Exceptions

```java
// Permission check that throws an exception if denied
CommandUtil.requirePermission(sender, "permission.node");

// Custom exception
throw new GeneralCommandException(Message.translation("error.key"));
```

---

## Confirmation for Dangerous Commands

```java
public class DangerousCommand extends CommandBase {
    public DangerousCommand() {
        // The third parameter enables the --confirm requirement
        super("dangerous", "description", true);
    }
}

// Usage: /dangerous --confirm
```

---

## Registering Commands

### System Commands

```java
// During CommandManager initialization
CommandManager.get().registerSystemCommand(new MyCommand());
```

### Plugin Commands

```java
// Using CommandRegistry within a plugin
public class MyPlugin extends PluginBase {
    @Override
    protected void onEnable() {
        getCommandRegistry().registerCommand(new MyPluginCommand());
    }
}
```

---

## Best Practices

1. **Use the appropriate base class** - Choose `CommandBase` for synchronous operations, `AbstractAsyncCommand` for asynchronous operations, and `AbstractPlayerCommand` for player-only commands.

2. **Define permissions** - Always specify permissions for your commands.

3. **Use translation keys** - Use `Message.translation()` for all user-facing strings to support localization.

4. **Validate arguments** - Add validators for numeric ranges and other constraints.

5. **Handle errors gracefully** - Use `ParseResult.fail()` for user-facing errors.

6. **Document with descriptions** - Provide translation keys for commands and arguments.

7. **Group related commands** - Use `AbstractCommandCollection` to organize related commands.

8. **Consider the sender type** - Check `context.isPlayer()` when the sender type matters for your command logic.

---

## Source Files

Key source files in `com.hypixel.hytale.server.core.command`:

```
system/
├── CommandManager.java
├── AbstractCommand.java
├── CommandContext.java
├── CommandSender.java
├── CommandRegistry.java
├── CommandRegistration.java
├── ParseResult.java
├── Tokenizer.java
├── CommandUtil.java
├── ParserContext.java
├── AbbreviationMap.java
├── MatchResult.java
├── arguments/
│   ├── system/
│   │   ├── Argument.java
│   │   ├── RequiredArg.java
│   │   ├── OptionalArg.java
│   │   ├── DefaultArg.java
│   │   ├── FlagArg.java
│   │   └── AbstractOptionalArg.java
│   └── types/
│       ├── ArgumentType.java
│       ├── SingleArgumentType.java
│       ├── ArgTypes.java
│       └── ...
├── basecommands/
│   ├── CommandBase.java
│   ├── AbstractAsyncCommand.java
│   ├── AbstractPlayerCommand.java
│   ├── AbstractWorldCommand.java
│   ├── AbstractTargetPlayerCommand.java
│   ├── AbstractTargetEntityCommand.java
│   └── AbstractCommandCollection.java
├── exceptions/
│   ├── CommandException.java
│   ├── NoPermissionException.java
│   ├── SenderTypeException.java
│   └── GeneralCommandException.java
└── suggestion/
    ├── SuggestionProvider.java
    └── SuggestionResult.java

commands/
├── server/
│   ├── KickCommand.java
│   ├── StopCommand.java
│   ├── WhoCommand.java
│   ├── MaxPlayersCommand.java
│   └── auth/
├── player/
│   ├── GameModeCommand.java
│   ├── KillCommand.java
│   ├── DamageCommand.java
│   ├── GiveCommand.java
│   ├── SudoCommand.java
│   ├── WhereAmICommand.java
│   ├── inventory/
│   ├── stats/
│   ├── effect/
│   ├── camera/
│   └── viewradius/
├── world/
│   ├── SpawnBlockCommand.java
│   ├── chunk/
│   ├── entity/
│   └── worldgen/
├── debug/
│   ├── PingCommand.java
│   ├── VersionCommand.java
│   ├── LogCommand.java
│   ├── server/
│   ├── stresstest/
│   ├── packs/
│   └── component/
└── utility/
    ├── HelpCommand.java
    ├── BackupCommand.java
    ├── sound/
    ├── lighting/
    ├── sleep/
    ├── worldmap/
    └── git/
```
