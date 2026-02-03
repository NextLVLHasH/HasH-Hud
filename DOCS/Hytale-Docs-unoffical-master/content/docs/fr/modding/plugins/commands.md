---
id: commands
title: Commandes
sidebar_label: Commandes
sidebar_position: 5
---

# Commandes

Creez des commandes personnalisees pour votre plugin Hytale en utilisant le systeme de commandes. Les commandes dans Hytale sont basees sur des classes, etendant `AbstractCommand` plutot que d'utiliser des annotations.

## Architecture des Commandes

### Hierarchie des Classes

Le systeme de commandes est construit autour d'une hierarchie de classes de base :

| Classe | Description |
|--------|-------------|
| `AbstractCommand` | Classe abstraite de base avec toute la logique de commande |
| `AbstractAsyncCommand` | Base pour les commandes asynchrones avec gestion des erreurs |
| `CommandBase` | Execution de commande synchrone simple |
| `AbstractPlayerCommand` | Commandes qui necessitent que l'expediteur soit un joueur |
| `AbstractWorldCommand` | Commandes qui operent dans un contexte de monde |
| `AbstractTargetPlayerCommand` | Commandes qui ciblent un autre joueur |
| `AbstractTargetEntityCommand` | Commandes qui ciblent une entite |
| `AbstractCommandCollection` | Conteneur pour les sous-commandes associees |

### Interfaces Principales

**CommandSender** - Represente l'entite executant une commande :

```java
public interface CommandSender extends IMessageReceiver, PermissionHolder {
    String getDisplayName();
    UUID getUuid();
}
```

**CommandOwner** - Identifie le proprietaire/enregistreur d'une commande (plugin ou serveur) :

```java
public interface CommandOwner {
    String getName();
}
```

## Creer une Commande Basique

Etendez `CommandBase` pour des commandes synchrones simples :

```java
public class HelloCommand extends CommandBase {

    public HelloCommand() {
        super("hello", "server.commands.hello.desc");
    }

    @Override
    protected CompletableFuture<Void> execute(@Nonnull CommandContext context) {
        context.getSender().sendMessage("Hello, World!");
        return CompletableFuture.completedFuture(null);
    }
}
```

Pour les commandes reservees aux joueurs, etendez `AbstractPlayerCommand` :

```java
public class HealCommand extends AbstractPlayerCommand {

    public HealCommand() {
        super("heal", "server.commands.heal.desc");
        this.requirePermission(HytalePermissions.fromCommand("heal.self"));
    }

    @Override
    protected CompletableFuture<Void> execute(@Nonnull CommandContext context) {
        // Le joueur est garanti d'exister lors de l'utilisation de AbstractPlayerCommand
        Player player = getPlayer(context);
        player.setHealth(player.getMaxHealth());
        return CompletableFuture.completedFuture(null);
    }
}
```

## Enregistrement des Commandes

### Commandes Systeme

Pour les commandes appartenant au serveur, utilisez `CommandManager.registerSystemCommand()` :

```java
CommandManager.get().registerSystemCommand(new HelloCommand());
```

### Commandes de Plugin

Pour les commandes appartenant a un plugin, utilisez `CommandRegistry.registerCommand()` :

```java
public class MyPlugin extends PluginBase {

    @Override
    public void onEnable() {
        getCommandRegistry().registerCommand(new HelloCommand());
    }
}
```

Le `CommandRegistry` definit automatiquement le plugin comme proprietaire de la commande.

## Systeme d'Arguments

Hytale fournit un systeme d'arguments flexible avec quatre types d'arguments :

### RequiredArg

Un argument positionnel qui doit etre fourni :

```java
public class GiveCommand extends AbstractPlayerCommand {
    private final RequiredArg<Item> itemArg = this.withRequiredArg(
        "item",
        "server.commands.give.item.desc",
        ArgTypes.ITEM_ASSET
    );

    @Override
    protected CompletableFuture<Void> execute(@Nonnull CommandContext context) {
        Item item = context.get(itemArg);
        // Utiliser l'objet...
        return CompletableFuture.completedFuture(null);
    }
}
```

### OptionalArg

Un argument nomme specifie avec la syntaxe `--nom=valeur` :

```java
private final OptionalArg<String> metadataArg = this.withOptionalArg(
    "metadata",
    "server.commands.give.metadata.desc",
    ArgTypes.STRING
);
```

Utilisation : `/give diamond --metadata=custom_data`

### DefaultArg

Un argument optionnel avec une valeur par defaut si non fourni :

```java
private final DefaultArg<Integer> quantityArg = this.withDefaultArg(
    "quantity",
    "server.commands.give.quantity.desc",
    ArgTypes.INTEGER,
    Integer.valueOf(1),  // Valeur par defaut
    "1"                  // Description de la valeur par defaut
);
```

Utilisation : `/give diamond` (utilise la valeur par defaut 1) ou `/give diamond --quantity=64`

### FlagArg

Un drapeau booleen (faux par defaut, vrai quand present) :

```java
private final FlagArg crashFlag = this.withFlagArg(
    "crash",
    "server.commands.stop.crash.desc"
);
```

Utilisation : `/stop` ou `/stop --crash`

### Dependances entre Arguments

Les arguments optionnels peuvent avoir des dependances avec d'autres arguments :

```java
// Requis si un autre argument est present
optionalArg.requiredIf(otherArg);

// Requis si un autre argument est absent
optionalArg.requiredIfAbsent(otherArg);

// Disponible uniquement si tous les arguments specifies sont presents
optionalArg.availableOnlyIfAll(arg1, arg2);

// Disponible uniquement si tous les arguments specifies sont absents
optionalArg.availableOnlyIfAllAbsent(arg1, arg2);
```

## Classes ArgumentType

La classe abstraite `ArgumentType` definit comment les arguments sont analyses et fournit la completion automatique :

```java
public abstract class ArgumentType<DataType> implements SuggestionProvider {
    // Analyser l'entree texte vers le type de donnees
    DataType parse(String[] input, ParseResult parseResult);

    // Fournir des suggestions de completion automatique
    void suggest(CommandSender sender, String textAlreadyEntered,
                 int numParametersTyped, SuggestionResult result);

    // Nombre de parametres texte que ce type consomme
    int getNumberOfParameters();
}
```

### Types d'Arguments Integres

Les types courants sont disponibles via `ArgTypes` :

- `ArgTypes.STRING` - Chaine de caracteres simple
- `ArgTypes.INTEGER` - Valeur entiere
- `ArgTypes.FLOAT` - Valeur flottante
- `ArgTypes.DOUBLE` - Valeur double
- `ArgTypes.BOOLEAN` - Valeur booleenne
- `ArgTypes.PLAYER_REF` - Reference de joueur
- `ArgTypes.ITEM_ASSET` - Reference d'asset d'objet
- `ArgTypes.GAME_MODE` - Enumeration GameMode

### Types d'Arguments Specialises

| Type | Description |
|------|-------------|
| `SingleArgumentType` | Base pour les types qui consomment un seul parametre |
| `MultiArgumentType` | Base pour les types qui consomment plusieurs parametres |
| `ListArgumentType` | Encapsule un autre type pour accepter des listes via la syntaxe `[element1,element2,...]` |
| `EnumArgumentType` | Pour les valeurs d'enumeration Java avec completion automatique |
| `AssetArgumentType` | Pour les references d'assets Hytale (objets, entites, etc.) |
| `GameModeArgumentType` | Pour les valeurs d'enumeration GameMode |

### Types de Coordonnees Relatives

Hytale supporte les coordonnees relatives de style Minecraft avec le prefixe `~` :

| Type | Description |
|------|-------------|
| `RelativeInteger` | Entier unique avec support du `~` (ex: `~10`) |
| `RelativeVector3i` | Vecteur 3D entier avec support relatif (ex: `~10 ~5 ~-3`) |
| `RelativeDoublePosition` | Position 3D double avec support relatif |

Exemple : `/teleport ~10 ~ ~-5` deplace de 10 blocs sur X, reste a la position Y actuelle, deplace de -5 sur Z.

### Creer des Types d'Arguments Personnalises

Etendez `SingleArgumentType` pour les types a parametre unique :

```java
public class PercentageArgumentType extends SingleArgumentType<Double> {

    public PercentageArgumentType() {
        super(
            Message.of("percentage"),
            "<0-100>",
            "50", "100", "0"  // Exemples de valeurs pour l'aide
        );
    }

    @Override
    public Double parse(String[] input, ParseResult parseResult) {
        try {
            double value = Double.parseDouble(input[0]);
            if (value < 0 || value > 100) {
                parseResult.setError("Le pourcentage doit etre entre 0 et 100");
                return null;
            }
            return value / 100.0;
        } catch (NumberFormatException e) {
            parseResult.setError("Format de nombre invalide");
            return null;
        }
    }

    @Override
    public void suggest(CommandSender sender, String textAlreadyEntered,
                        int numParametersTyped, SuggestionResult result) {
        result.suggest("0").suggest("25").suggest("50").suggest("75").suggest("100");
    }
}
```

## Completion Automatique

La completion automatique est fournie via l'interface `SuggestionProvider` :

```java
@FunctionalInterface
public interface SuggestionProvider {
    void suggest(CommandSender sender, String textAlreadyEntered,
                 int numParametersTyped, SuggestionResult result);
}
```

### SuggestionResult

La classe `SuggestionResult` collecte les suggestions :

```java
// Ajouter une seule suggestion
result.suggest("option1");

// Ajouter plusieurs suggestions
result.suggest("option1").suggest("option2").suggest("option3");

// Correspondance floue (retourne jusqu'a 5 meilleures correspondances)
result.fuzzySuggest(input, items, Item::getName);
```

### Fournisseur de Suggestions Personnalise

Attachez un fournisseur de suggestions personnalise a un argument :

```java
private final RequiredArg<String> worldArg = this.withRequiredArg(
    "world",
    "server.commands.teleport.world.desc",
    ArgTypes.STRING
).suggest((sender, text, paramCount, result) -> {
    // Fournir les noms de mondes comme suggestions
    for (World world : WorldManager.getWorlds()) {
        result.suggest(world.getName());
    }
});
```

## Fonctionnalites des Commandes

### Alias

Ajoutez des noms alternatifs pour une commande :

```java
public MyCommand() {
    super("mycommand", "description");
    this.addAliases(new String[]{"mc", "mycmd"});
}
```

### Sous-commandes

Utilisez `AbstractCommandCollection` pour les commandes avec sous-commandes :

```java
public class EntityCommand extends AbstractCommandCollection {

    public EntityCommand() {
        super("entity", "server.commands.entity.desc");
        this.addAliases(new String[]{"entities"});

        this.addSubCommand(new EntityCloneCommand());
        this.addSubCommand(new EntityRemoveCommand());
        this.addSubCommand(new EntityDumpCommand());
        // ... plus de sous-commandes
    }
}
```

### Variantes d'Utilisation

Ajoutez differentes configurations d'arguments pour la meme commande :

```java
public class KillCommand extends AbstractPlayerCommand {

    public KillCommand() {
        super("kill", "server.commands.kill.desc");
        this.requirePermission(HytalePermissions.fromCommand("kill.self"));

        // Ajouter une variante pour tuer d'autres joueurs
        this.addUsageVariant(new KillOtherCommand());
    }

    // Classe de variante pour /kill <joueur>
    private static class KillOtherCommand extends AbstractTargetPlayerCommand {
        public KillOtherCommand() {
            super("kill", "server.commands.kill.other.desc");
            this.requirePermission(HytalePermissions.fromCommand("kill.other"));
        }
    }
}
```

### Confirmation

Exigez un drapeau `--confirm` pour les operations dangereuses :

```java
public class DangerousCommand extends CommandBase {

    public DangerousCommand() {
        super("dangerous", "description", true);  // true = necessite confirmation
    }
}
```

### Arguments Supplementaires

Autorisez des arguments additionnels arbitraires :

```java
public class SudoCommand extends CommandBase {
    private final RequiredArg<String> playerArg = this.withRequiredArg(
        "player",
        "server.commands.sudo.player.desc",
        ArgTypes.STRING
    );

    public SudoCommand() {
        super("sudo", "server.commands.sudo.desc");
        this.addAliases(new String[]{"su"});
        this.setAllowsExtraArguments(true);  // Autorise /sudo joueur <n'importe quelle commande>
    }
}
```

## Systeme de Permissions

### Format des Permissions

Les permissions suivent le format `namespace.categorie.action` :

```java
// En utilisant l'assistant HytalePermissions
this.requirePermission(HytalePermissions.fromCommand("give.self"));
// Resulte en : "hytale.command.give.self"
```

### Groupes de Permissions

Assignez des commandes a des groupes de permissions selon le mode de jeu :

```java
public class WhereAmICommand extends AbstractPlayerCommand {

    public WhereAmICommand() {
        super("whereami", "server.commands.whereami.desc");
        this.setPermissionGroup(GameMode.Creative);  // Disponible uniquement en mode Creatif
        this.requirePermission(HytalePermissions.fromCommand("whereami.self"));
    }
}
```

### Verification des Permissions

L'interface `CommandSender` etend `PermissionHolder` :

```java
public interface PermissionHolder {
    boolean hasPermission(String permission);
    boolean hasPermission(String permission, boolean defaultValue);
}
```

## Reference des Commandes Integrees

| Commande | Utilisation | Description |
|----------|-------------|-------------|
| `/give` | `/give <objet> [quantite] [--metadata=?]` | Donne des objets a vous-meme (alias : `/give <joueur> <objet> [quantite] [--metadata=?]` pour les autres) |
| `/give armor` | `/give armor <recherche> [--player=?] [--set]` | Donne les armures correspondant a la recherche (utilisez `--set` pour remplacer l'armure existante) |
| `/gamemode` | `/gamemode <mode> [joueur]` | Change le mode de jeu (alias : `/gm`) |
| `/kill` | `/kill [joueur]` | Tue le(s) joueur(s) |
| `/kick` | `/kick <joueur>` | Expulse un joueur du serveur |
| `/stop` | `/stop [--crash]` | Arrete le serveur (alias : `/shutdown`) |
| `/help` | `/help [commande]` | Affiche l'aide des commandes (alias : `/?`) |
| `/sudo` | `/sudo <joueur> <commande...>` | Execute en tant qu'un autre joueur (alias : `/su`). Utilisez `*` comme joueur pour cibler tous les joueurs |
| `/whereami` | `/whereami [joueur]` | Affiche les informations de position du joueur |
| `/entity` | `/entity <sous-commande>` | Gestion des entites (alias : `/entities`) |
| `/worldmap` | `/worldmap <sous-commande>` | Operations sur la carte du monde (alias : `/map`) |

## Tokenisation de l'Entree

Le systeme de commandes supporte :

- **Chaines entre guillemets** : Guillemets simples (`'`) ou doubles (`"`) pour les arguments avec espaces
- **Arguments de liste** : Syntaxe `[element1,element2,element3]` pour les types de liste
- **Sequences d'echappement** : `\\`, `\'`, `\"`, `\[`, `\]`, `\,`

Exemple : `/say "Bonjour, le monde !"` ou `/give [sword,shield,potion]`

## Exemple Complet

Voici un exemple complet de commande qui demontre plusieurs fonctionnalites :

```java
public class TeleportCommand extends AbstractPlayerCommand {

    private final RequiredArg<RelativeVector3i> positionArg = this.withRequiredArg(
        "position",
        "server.commands.tp.position.desc",
        ArgTypes.RELATIVE_VECTOR3I
    );

    private final OptionalArg<String> worldArg = this.withOptionalArg(
        "world",
        "server.commands.tp.world.desc",
        ArgTypes.STRING
    ).suggest((sender, text, paramCount, result) -> {
        for (World world : WorldManager.getWorlds()) {
            result.suggest(world.getName());
        }
    });

    private final FlagArg safeFlag = this.withFlagArg(
        "safe",
        "server.commands.tp.safe.desc"
    );

    public TeleportCommand() {
        super("teleport", "server.commands.tp.desc");
        this.addAliases(new String[]{"tp"});
        this.requirePermission(HytalePermissions.fromCommand("teleport.self"));
        this.setPermissionGroup(GameMode.Creative);
    }

    @Override
    protected CompletableFuture<Void> execute(@Nonnull CommandContext context) {
        Player player = getPlayer(context);
        RelativeVector3i position = context.get(positionArg);
        String worldName = context.getOrDefault(worldArg, null);
        boolean safe = context.get(safeFlag);

        // Resoudre les coordonnees relatives basees sur la position du joueur
        Vector3i targetPos = position.resolve(player.getPosition());

        if (safe) {
            // Trouver un point d'atterrissage sur
            targetPos = findSafePosition(targetPos);
        }

        if (worldName != null) {
            World world = WorldManager.getWorld(worldName);
            player.teleport(world, targetPos);
        } else {
            player.teleport(targetPos);
        }

        return CompletableFuture.completedFuture(null);
    }
}
```

Exemples d'utilisation :
- `/teleport 100 64 200` - Teleportation aux coordonnees absolues
- `/tp ~10 ~ ~-5` - Deplace de 10 blocs sur X, reste sur Y, deplace de -5 blocs sur Z
- `/tp 0 100 0 --world=nether` - Teleportation aux coordonnees dans le nether
- `/tp ~0 ~50 ~0 --safe` - Monte de 50 blocs avec atterrissage securise
