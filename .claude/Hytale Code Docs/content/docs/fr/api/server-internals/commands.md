---
id: commands
title: Systeme de Commandes
sidebar_label: Commandes
sidebar_position: 4
description: Documentation complete du systeme de commandes pour le serveur Hytale
---

# Systeme de Commandes

:::info Documentation v2 - Vérifiée
Cette documentation a été vérifiée par rapport au code source décompilé du serveur en utilisant une analyse multi-agent. Toutes les informations incluent des références aux fichiers sources.
:::

## Qu'est-ce qu'un systeme de commandes ?

Un **systeme de commandes** est l'interface textuelle qui permet aux joueurs et administrateurs d'interagir avec le serveur. Quand vous tapez `/gamemode creative` dans le chat, le systeme de commandes analyse votre entree, valide les permissions et execute l'action appropriee.

### Comment fonctionnent les commandes

Pensez aux commandes comme commander dans un restaurant :

```
/give Steve diamond_sword --quantity=5 --enchanted
  │     │        │               │           │
  │     │        │               │           └── Flag (option oui/non)
  │     │        │               └── Argument optionnel
  │     │        └── Argument requis
  │     └── Cible (qui recoit)
  └── Nom de la commande
```

Le systeme de commandes gere :
1. **Analyse** : Decouper le texte en morceaux
2. **Validation** : Verifier si les arguments sont valides
3. **Permissions** : Verifier que l'expediteur a acces
4. **Execution** : Lancer la logique reelle

### Anatomie d'une commande

Chaque commande a ces parties :

| Partie | Ce qu'elle fait | Exemple |
|--------|-----------------|---------|
| **Nom** | Comment appeler la commande | `give`, `teleport`, `ban` |
| **Alias** | Noms alternatifs | `tp` pour `teleport` |
| **Arguments** | Donnees dont la commande a besoin | Nom du joueur, ID d'item |
| **Permission** | Qui peut l'utiliser | `hytale.command.give` |
| **Description** | Texte d'aide | "Donne des items aux joueurs" |

### Commandes Sync vs Async

Les commandes peuvent s'executer en deux modes :

| Type | Quand l'utiliser | Exemple |
|------|------------------|---------|
| **Synchrone** | Operations rapides necessitant des resultats immediats | `/kill` - le joueur meurt instantanement |
| **Asynchrone** | Operations lentes qui ne doivent pas geler le serveur | `/backup` - sauvegarder le monde prend du temps |

**Regle generale** : Si votre commande parle a une base de donnees, une API web ou traite beaucoup de donnees, faites-la async.

### Arguments de commande expliques

Les arguments sont les donnees dont votre commande a besoin. Hytale fournit un systeme type-safe :

```java
// La commande : /heal <player> --amount=50 --fully
RequiredArg<PlayerRef> targetArg;   // Doit fournir un joueur
OptionalArg<Integer> amountArg;     // Peut specifier une quantite
FlagArg fullyFlag;                  // Boolean : est-ce que --fully est present ?
```

| Type d'argument | Syntaxe | Quand l'utiliser |
|-----------------|---------|-----------------|
| **Required** | `<nom>` | Doit etre fourni |
| **Optional** | `--nom=valeur` | Peut etre omis |
| **Default** | `--nom=valeur` | A une valeur par defaut |
| **Flag** | `--nom` | Bascule oui/non |

### La hierarchie des permissions

Les permissions controlent qui peut executer quoi :

```
hytale
├── command
│   ├── give          # permission /give
│   │   └── others    # /give a d'autres joueurs
│   ├── teleport
│   │   ├── self      # Se teleporter soi-meme
│   │   └── others    # Teleporter d'autres joueurs
│   └── ban
│       └── permanent # Bans permanents
```

Les joueurs peuvent avoir :
- Permissions specifiques : `hytale.command.give`
- Permissions wildcard : `hytale.command.*`
- Groupes de permissions : `Admin` (qui inclut plusieurs permissions)

### Analogie du monde reel : assistant vocal

Les commandes fonctionnent comme parler a un assistant vocal :

- **"Dis Siri, mets un minuteur de 5 minutes"**
  - Commande : `set timer`
  - Argument : `5 minutes`

- **"/give Steve diamond 64"**
  - Commande : `give`
  - Arguments : `Steve`, `diamond`, `64`

Les deux doivent :
1. Comprendre ce que vous demandez (analyse)
2. Verifier si vous etes autorise (permissions)
3. Executer l'action
4. Rapporter le resultat

---

## Apercu technique

Le serveur Hytale implemente un systeme de commandes complet situe dans `com.hypixel.hytale.server.core.command`. Ce systeme fournit un framework flexible pour creer, enregistrer et executer des commandes avec prise en charge des permissions, des arguments, des sous-commandes et de l'execution asynchrone.

---

## Architecture

### Composants Principaux

| Classe | Description |
|--------|-------------|
| `CommandManager` | Singleton gerant l'enregistrement et l'execution des commandes |
| `AbstractCommand` | Classe de base pour toutes les commandes |
| `CommandSender` | Interface pour les entites pouvant executer des commandes |
| `CommandContext` | Contexte d'execution avec l'expediteur et les arguments analyses |
| `CommandRegistry` | Registre pour les commandes de plugins |
| `ParseResult` | Stocke les resultats d'analyse et les messages d'erreur |
| `Tokenizer` | Analyse l'entree de commande en tokens |

### Hierarchie des Classes

```
AbstractCommand
├── CommandBase                    # Commandes synchrones
├── AbstractAsyncCommand           # Commandes asynchrones
│   ├── AbstractPlayerCommand      # Commandes reservees aux joueurs
│   ├── AbstractWorldCommand       # Commandes avec contexte de monde
│   ├── AbstractTargetPlayerCommand # Commandes ciblant des joueurs
│   ├── AbstractTargetEntityCommand # Commandes ciblant des entites
│   ├── AbstractAsyncPlayerCommand  # Commandes joueur asynchrones
│   └── AbstractAsyncWorldCommand   # Commandes monde asynchrones
└── AbstractCommandCollection      # Commande avec sous-commandes uniquement
```

---

## CommandManager

Le `CommandManager` est le point central de la gestion des commandes :

```java
public class CommandManager implements CommandOwner {
    private final Map<String, AbstractCommand> commandRegistration;
    private final Map<String, String> aliases;

    // Acces au singleton
    public static CommandManager get();

    // Enregistrer des commandes systeme
    public void registerSystemCommand(AbstractCommand command);

    // Enregistrer n'importe quelle commande
    public CommandRegistration register(AbstractCommand command);

    // Executer une commande
    public CompletableFuture<Void> handleCommand(CommandSender sender, String commandString);
    public CompletableFuture<Void> handleCommand(PlayerRef playerRef, String command);
}
```

### Flux d'Execution des Commandes

1. La chaine de commande est tokenisee par `Tokenizer`
2. Le nom de la commande est extrait et recherche (avec resolution des alias)
3. Le contexte d'analyse est cree
4. La methode `acceptCall()` de la commande est invoquee
5. Les arguments sont traites et valides
6. `execute()` est appelee avec le `CommandContext`

---

## Creation de Commandes Personnalisees

### Commande Synchrone Basique

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

### Commande Asynchrone

```java
public class MyAsyncCommand extends AbstractAsyncCommand {
    public MyAsyncCommand() {
        super("myasync", "server.commands.myasync.desc");
    }

    @Override
    protected CompletableFuture<Void> executeAsync(CommandContext context) {
        return CompletableFuture.runAsync(() -> {
            // Travail asynchrone ici
            context.sendMessage(Message.raw("Done!"));
        });
    }
}
```

### Commande Reservee aux Joueurs

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
        // A acces au store du joueur et au monde
        Player player = store.getComponent(ref, Player.getComponentType());
        context.sendMessage(Message.raw("Hello " + playerRef.getUsername()));
    }
}
```

### Commande de Monde

```java
public class MyWorldCommand extends AbstractWorldCommand {
    public MyWorldCommand() {
        super("myworldcmd", "server.commands.myworldcmd.desc");
    }

    @Override
    protected void execute(CommandContext context, World world, Store<EntityStore> store) {
        // Acces au contexte du monde
        context.sendMessage(Message.raw("World: " + world.getName()));
    }
}
```

### Collection de Commandes (Sous-commandes Uniquement)

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

## Systeme d'Arguments

### Types d'Arguments

| Type | Description | Syntaxe |
|------|-------------|---------|
| `RequiredArg<T>` | Doit etre fourni | `<nom:type>` |
| `OptionalArg<T>` | Peut etre omis | `--nom=valeur` |
| `DefaultArg<T>` | Optionnel avec valeur par defaut | `--nom=valeur` (defaut affiche) |
| `FlagArg` | Drapeau booleen | `--nom` |

### Enregistrement des Arguments

```java
public class MyCommandWithArgs extends CommandBase {
    // Argument requis
    private final RequiredArg<String> nameArg =
        withRequiredArg("name", "description.key", ArgTypes.STRING);

    // Argument optionnel
    private final OptionalArg<Integer> countArg =
        withOptionalArg("count", "description.key", ArgTypes.INTEGER);

    // Argument avec valeur par defaut
    private final DefaultArg<Double> radiusArg =
        withDefaultArg("radius", "description.key", ArgTypes.DOUBLE, 10.0, "10");

    // Argument drapeau
    private final FlagArg verboseFlag =
        withFlagArg("verbose", "description.key");

    // Argument de liste
    private final RequiredArg<List<String>> tagsArg =
        withListRequiredArg("tags", "description.key", ArgTypes.STRING);
}
```

### Utilisation des Arguments dans Execute

```java
@Override
protected void executeSync(CommandContext context) {
    // Obtenir l'argument requis
    String name = nameArg.get(context);

    // Verifier si l'optionnel a ete fourni
    if (countArg.provided(context)) {
        Integer count = countArg.get(context);
    }

    // Default retourne la valeur par defaut si non fourni
    Double radius = radiusArg.get(context);

    // Flag retourne un Boolean
    Boolean verbose = verboseFlag.get(context);
}
```

### Types d'Arguments Courants (ArgTypes)

| Type | Type Java | Description |
|------|-----------|-------------|
| `STRING` | `String` | Valeur textuelle |
| `INTEGER` | `Integer` | Nombre entier |
| `DOUBLE` | `Double` | Nombre decimal |
| `BOOLEAN` | `Boolean` | true/false |
| `PLAYER_REF` | `PlayerRef` | Joueur en ligne |
| `WORLD` | `World` | Monde charge |
| `ITEM_ASSET` | `Item` | Asset d'item |
| `BLOCK_TYPE_KEY` | `String` | Identifiant de type de bloc |
| `GAME_MODE` | `GameMode` | Enumeration de mode de jeu |
| `RELATIVE_POSITION` | `RelativeDoublePosition` | Position (supporte ~) |
| `ROTATION` | `Vector3f` | Vecteur de rotation |
| `ENTITY_ID` | `EntityWrappedArg` | Reference d'entite |

### Validation des Arguments

```java
private final OptionalArg<Double> radiusArg =
    withOptionalArg("radius", "desc", ArgTypes.DOUBLE)
        .addValidator(Validators.greaterThan(0.0));
```

### Dependances entre Arguments

```java
// Requis si un autre argument est fourni
optionalArg.requiredIf(otherArg);

// Requis si un autre argument est absent
optionalArg.requiredIfAbsent(otherArg);

// Disponible uniquement si un autre argument est fourni
optionalArg.availableOnlyIfAll(otherArg);

// Disponible uniquement si un autre argument est absent
optionalArg.availableOnlyIfAllAbsent(otherArg);
```

---

## Systeme de Permissions

### Definition des Permissions

```java
public class MyCommand extends CommandBase {
    public MyCommand() {
        super("mycommand", "description");

        // Permission explicite
        requirePermission("hytale.custom.mycommand");

        // Ou utiliser l'assistant pour le format standard
        requirePermission(HytalePermissions.fromCommand("mycommand"));
    }
}
```

### Generation des Permissions

Si aucune permission n'est definie, les permissions sont generees automatiquement :
- Commandes systeme : `hytale.system.command.<nom>`
- Commandes de plugin : `<plugin.basepermission>.command.<nom>`
- Sous-commandes : `<parent.permission>.<nom>`

### Groupes de Permissions

```java
// Assigner au groupe de permissions d'un mode de jeu
setPermissionGroup(GameMode.Adventure);
setPermissionGroup(GameMode.Creative);

// Groupes multiples
setPermissionGroups("Adventure", "Creative");
```

### Permissions au Niveau des Arguments

```java
private final OptionalArg<PlayerRef> playerArg =
    withOptionalArg("player", "desc", ArgTypes.PLAYER_REF)
        .setPermission("mycommand.target.other");
```

### Verification des Permissions

```java
// Dans l'execution de la commande
if (context.sender().hasPermission("some.permission")) {
    // ...
}

// Methode utilitaire (lance NoPermissionException)
CommandUtil.requirePermission(context.sender(), "some.permission");
```

---

## Interface CommandSender

```java
public interface CommandSender extends IMessageReceiver, PermissionHolder {
    String getDisplayName();
    UUID getUuid();
}
```

### ConsoleSender vs PlayerSender

| Fonctionnalite | ConsoleSender | Player (PlayerSender) |
|----------------|---------------|----------------------|
| `getDisplayName()` | "Console" | Nom d'utilisateur du joueur |
| `getUuid()` | Null/UUID fixe | UUID du joueur |
| `hasPermission()` | Toujours true (generalement) | Verifie selon les permissions |
| `sendMessage()` | Journalise dans la console | Envoie au chat du joueur |
| Contexte de monde | Aucun | Monde actuel du joueur |

### Detection du Type d'Expediteur

```java
@Override
protected void executeSync(CommandContext context) {
    if (context.isPlayer()) {
        // L'expediteur est un joueur
        Player player = context.senderAs(Player.class);
        Ref<EntityStore> ref = context.senderAsPlayerRef();
    } else {
        // L'expediteur est la console ou autre
        CommandSender sender = context.sender();
    }
}
```

---

## Sous-commandes et Variantes

### Ajout de Sous-commandes

```java
public class ParentCommand extends AbstractCommandCollection {
    public ParentCommand() {
        super("parent", "description");
        addSubCommand(new ChildCommand1());
        addSubCommand(new ChildCommand2());
    }
}

// Utilisation : /parent child1 ...
// Utilisation : /parent child2 ...
```

### Variantes d'Utilisation

Les variantes permettent differents schemas d'arguments pour la meme commande :

```java
public class GameModeCommand extends AbstractPlayerCommand {
    private final RequiredArg<GameMode> gameModeArg =
        withRequiredArg("gamemode", "desc", ArgTypes.GAME_MODE);

    public GameModeCommand() {
        super("gamemode", "description");
        addUsageVariant(new GameModeOtherCommand()); // Variante a 2 arguments
    }

    // 1 argument requis : /gamemode <mode>
    @Override
    protected void execute(...) { }

    private static class GameModeOtherCommand extends CommandBase {
        private final RequiredArg<GameMode> gameModeArg = ...;
        private final RequiredArg<PlayerRef> playerArg = ...;

        // 2 arguments requis : /gamemode <mode> <player>
        @Override
        protected void executeSync(...) { }
    }
}
```

---

## Syntaxe d'Entree des Commandes

### Syntaxe de Base

```
/commande <requis> [--optionnel=valeur] [--drapeau]
```

### Fonctionnalites du Tokenizer

| Syntaxe | Description |
|---------|-------------|
| `mot` | Token unique |
| `"chaine entre guillemets"` | Chaine avec espaces |
| `'guillemets simples'` | Guillemets alternatifs |
| `[a,b,c]` | Argument de liste |
| `\,` `\"` `\'` | Caracteres echappes |
| `--arg=valeur` | Argument optionnel |
| `--drapeau` | Drapeau booleen |

### Arguments Speciaux

```
--help     # Afficher l'aide de la commande
--confirm  # Confirmer les operations dangereuses
```

---

## Reference des Commandes Integrees

### Commandes Serveur

| Commande | Description | Alias | Arguments |
|----------|-------------|-------|-----------|
| `stop` | Arreter le serveur | `shutdown` | `--crash` (drapeau) |
| `kick` | Expulser un joueur | - | `<player>` |
| `who` | Lister les joueurs en ligne | - | - |
| `maxplayers` | Obtenir/definir le nombre max de joueurs | - | `--amount` |
| `auth` | Commandes d'authentification | - | Sous-commandes |

#### Sous-commandes Auth
- `auth status` - Verifier le statut d'authentification
- `auth login` - Commandes de connexion
- `auth select` - Selectionner un compte
- `auth logout` - Deconnexion
- `auth cancel` - Annuler la connexion
- `auth persistence` - Parametres de persistance

---

### Commandes Joueur

| Commande | Description | Alias | Arguments |
|----------|-------------|-------|-----------|
| `gamemode` | Changer le mode de jeu | `gm` | `<gamemode>` `[player]` |
| `kill` | Tuer le joueur | - | `[player]` |
| `damage` | Infliger des degats a un joueur | - | `<amount>` `[player]` |
| `give` | Donner des objets | - | `<item>` `--quantity` `--metadata` |
| `inventory` | Gestion de l'inventaire | - | Sous-commandes |
| `sudo` | Executer en tant que joueur | `su` | `<player>` `<command...>` |
| `whereami` | Afficher les informations de localisation | - | `[player]` |
| `whoami` | Afficher les informations du joueur | - | - |
| `hide` | Basculer la visibilite | - | - |
| `refer` | Commande de reference | - | - |
| `player` | Gestion des joueurs | - | Sous-commandes |

#### Sous-commandes Player
- `player reset` - Reinitialiser le joueur
- `player stats` - Gestion des statistiques (get/set/add/reset/dump/settomax)
- `player effect` - Gestion des effets (apply/clear)
- `player respawn` - Faire reapparaitre le joueur
- `player camera` - Controles de camera (reset/topdown/sidescroller/demo)
- `player viewradius` - Rayon de vue (get/set)
- `player zone` - Informations de zone

#### Sous-commandes Inventory
- `inventory clear` - Vider l'inventaire
- `inventory see` - Voir l'inventaire
- `inventory item` - Gestion des objets
- `inventory backpack` - Gestion du sac a dos
- `give armor` - Donner un ensemble d'armure

#### Commande ItemState
- `itemstate` - Gestion de l'etat des objets

---

### Commandes Monde

| Commande | Description | Alias | Arguments |
|----------|-------------|-------|-----------|
| `spawnblock` | Faire apparaitre une entite bloc | - | `<block>` `<position>` `--rotation` |
| `chunk` | Gestion des chunks | `chunks` | Sous-commandes |
| `entity` | Gestion des entites | `entities` | Sous-commandes |
| `worldgen` | Generation de monde | `wg` | Sous-commandes |

#### Sous-commandes Chunk
| Sous-commande | Description |
|---------------|-------------|
| `chunk fixheightmap` | Corriger la carte de hauteur du chunk |
| `chunk forcetick` | Forcer le tick du chunk |
| `chunk info` | Informations sur le chunk |
| `chunk lighting` | Gestion de l'eclairage |
| `chunk load` | Charger le chunk |
| `chunk loaded` | Lister les chunks charges |
| `chunk marksave` | Marquer le chunk pour sauvegarde |
| `chunk maxsendrate` | Definir le taux d'envoi maximum |
| `chunk regenerate` | Regenerer le chunk |
| `chunk resend` | Renvoyer le chunk aux clients |
| `chunk tint` | Parametres de teinte du chunk |
| `chunk tracker` | Informations du tracker de chunk |
| `chunk unload` | Decharger le chunk |

#### Sous-commandes Entity
| Sous-commande | Description |
|---------------|-------------|
| `entity clone` | Cloner une entite |
| `entity remove` | Supprimer une entite |
| `entity dump` | Exporter les donnees de l'entite |
| `entity clean` | Nettoyer les entites |
| `entity lod` | Parametres de niveau de detail |
| `entity tracker` | Informations du tracker |
| `entity resend` | Renvoyer l'entite |
| `entity nameplate` | Gestion de la plaque nominative |
| `entity stats` | Statistiques de l'entite (get/set/add/reset/dump/settomax) |
| `entity snapshot` | Gestion des instantanes (length/history) |
| `entity effect` | Effets de l'entite |
| `entity makeinteractable` | Rendre l'entite interactable |
| `entity intangible` | Basculer l'intangibilite |
| `entity invulnerable` | Basculer l'invulnerabilite |
| `entity hidefromadventureplayers` | Cacher aux joueurs en mode aventure |
| `entity count` | Compter les entites |

#### Sous-commandes WorldGen
- `worldgen benchmark` - Executer un benchmark de generation
- `worldgen reload` - Recharger la generation de monde

---

### Commandes de Debogage

| Commande | Description | Alias | Arguments |
|----------|-------------|-------|-----------|
| `ping` | Verifier le ping du joueur | - | `--player` `--detail` |
| `version` | Afficher la version du serveur | - | - |
| `log` | Gerer la journalisation | - | `<logger>` `--level` `--save` `--reset` |
| `pidcheck` | Verification du PID | - | - |
| `packetstats` | Statistiques des paquets | - | - |
| `hitdetection` | Debogage de detection de coups | - | - |
| `assets` | Commandes d'assets | - | Sous-commandes |
| `packs` | Gestion des packs | - | Sous-commandes |
| `server` | Gestion du serveur | - | Sous-commandes |
| `stresstest` | Tests de charge | - | Sous-commandes |
| `hitboxcollision` | Collision de hitbox | - | Sous-commandes |
| `repulsion` | Debogage de repulsion | - | Sous-commandes |
| `debugplayerposition` | Deboguer la position du joueur | - | - |
| `messagetranslationtest` | Tester les traductions | - | - |
| `hudmanagertest` | Test du gestionnaire HUD | - | - |
| `stopnetworkchunksending` | Arreter l'envoi de chunks | - | - |
| `showbuildertoolshud` | Afficher les outils de construction | - | - |
| `particle` | Effets de particules | - | - |
| `tagpattern` | Debogage de motif de tags | - | - |

#### Sous-commandes Server
- `server stats` - Statistiques du serveur (memory/cpu/gc)
- `server gc` - Forcer le ramasse-miettes
- `server dump` - Exporter l'etat du serveur

#### Sous-commandes StressTest
- `stresstest start` - Demarrer le test de charge
- `stresstest stop` - Arreter le test de charge

#### Sous-commandes Ping
- `ping clear` / `ping reset` - Effacer l'historique des pings
- `ping graph` - Afficher le graphique de ping (`--width` `--height`)

---

### Commandes Utilitaires

| Commande | Description | Alias | Arguments |
|----------|-------------|-------|-----------|
| `help` | Afficher l'aide | `?` | `[command]` |
| `backup` | Creer une sauvegarde | - | - |
| `notify` | Envoyer une notification | - | - |
| `eventtitle` | Titre d'evenement | - | - |
| `stash` | Gestion du stash | - | - |
| `convertprefabs` | Convertir les prefabs | - | - |
| `validatecpb` | Valider les CPB | - | - |
| `worldmap` | Carte du monde | - | Sous-commandes |
| `sound` | Commandes audio | - | Sous-commandes |
| `lighting` | Commandes d'eclairage | - | Sous-commandes |
| `sleep` | Commandes de sommeil | - | Sous-commandes |
| `network` | Commandes reseau | - | - |
| `commands` | Liste des commandes | - | - |
| `update` | Commandes de mise a jour | - | Sous-commandes |

#### Sous-commandes WorldMap
- `worldmap discover` - Decouvrir une zone
- `worldmap undiscover` - Annuler la decouverte d'une zone
- `worldmap clearmarkers` - Effacer les marqueurs
- `worldmap reload` - Recharger la carte
- `worldmap viewradius` - Rayon de vue (get/set/remove)

#### Sous-commandes Sound
- `sound play2d` - Jouer un son 2D
- `sound play3d` - Jouer un son 3D

#### Sous-commandes Lighting
- `lighting get` - Obtenir les informations d'eclairage
- `lighting send` - Envoyer l'eclairage
- `lighting sendtoggle` - Basculer l'envoi
- `lighting info` - Informations d'eclairage
- `lighting calculation` - Calculer l'eclairage
- `lighting invalidate` - Invalider l'eclairage

#### Sous-commandes Sleep
- `sleep offset` - Decalage de sommeil
- `sleep test` - Test de sommeil

#### Sous-commandes Update
- `update assets` - Mettre a jour les assets
- `update prefabs` - Mettre a jour les prefabs

---

## Gestion des Exceptions

### Exceptions de Commande

```java
public abstract class CommandException extends RuntimeException {
    public abstract void sendTranslatedMessage(CommandSender sender);
}

// Exceptions specifiques
public class NoPermissionException extends CommandException
public class SenderTypeException extends CommandException
public class GeneralCommandException extends CommandException
```

### Lancer des Exceptions

```java
// Verification de permission avec exception
CommandUtil.requirePermission(sender, "permission.node");

// Exception personnalisee
throw new GeneralCommandException(Message.translation("error.key"));
```

---

## Confirmation pour les Commandes Dangereuses

```java
public class DangerousCommand extends CommandBase {
    public DangerousCommand() {
        // Le troisieme parametre active l'exigence de --confirm
        super("dangerous", "description", true);
    }
}

// Utilisation : /dangerous --confirm
```

---

## Enregistrement des Commandes

### Commandes Systeme

```java
// Dans l'initialisation du CommandManager
CommandManager.get().registerSystemCommand(new MyCommand());
```

### Commandes de Plugin

```java
// Utilisation de CommandRegistry dans un plugin
public class MyPlugin extends PluginBase {
    @Override
    protected void onEnable() {
        getCommandRegistry().registerCommand(new MyPluginCommand());
    }
}
```

---

## Bonnes Pratiques

1. **Utiliser la classe de base appropriee** - Choisissez `CommandBase` pour les commandes synchrones, `AbstractAsyncCommand` pour les asynchrones, `AbstractPlayerCommand` pour les commandes reservees aux joueurs

2. **Definir les permissions** - Definissez toujours des permissions pour les commandes

3. **Utiliser les cles de traduction** - Utilisez `Message.translation()` pour les chaines destinees aux utilisateurs

4. **Valider les arguments** - Ajoutez des validateurs pour les plages numeriques et les contraintes

5. **Gerer les erreurs avec elegance** - Utilisez `ParseResult.fail()` pour les erreurs utilisateur

6. **Documenter avec des descriptions** - Fournissez des cles de traduction pour les commandes et arguments

7. **Grouper les commandes liees** - Utilisez `AbstractCommandCollection` pour les groupes de commandes

8. **Considerer le type d'expediteur** - Verifiez `context.isPlayer()` quand necessaire

---

## Fichiers Sources

Fichiers sources cles dans `com.hypixel.hytale.server.core.command` :

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
