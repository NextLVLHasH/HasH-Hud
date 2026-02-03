---
id: plugins
title: Systeme de Plugins
sidebar_label: Plugins
sidebar_position: 2
description: Documentation complete du systeme de plugins Java pour le serveur Hytale
---

# Systeme de Plugins

:::info Documentation v2 - Vérifiée
Cette documentation a été vérifiée par rapport au code source décompilé du serveur en utilisant une analyse multi-agent. Toutes les informations incluent des références aux fichiers sources.
:::

## Qu'est-ce qu'un plugin ?

Un **plugin** est un morceau de code autonome qui ajoute de nouvelles fonctionnalites au serveur Hytale sans modifier son code source. Pensez aux plugins comme des applications sur votre smartphone - ils etendent les fonctionnalites tandis que le systeme d'exploitation reste inchange.

### Pourquoi utiliser des plugins ?

| Approche | Avantages | Inconvenients |
|----------|-----------|---------------|
| **Modifier le code du serveur** | Controle total | Casse aux mises a jour, difficile a partager |
| **Utiliser des plugins** | Mises a jour faciles, partageables, isoles | Limite a ce que les APIs exposent |

Les plugins sont la methode recommandee pour ajouter des fonctionnalites personnalisees car :
- Ils survivent aux mises a jour du serveur
- Plusieurs plugins peuvent fonctionner ensemble
- Ils peuvent etre actives/desactives sans redemarrer
- La communaute peut les partager et les reutiliser

### Cycle de vie du plugin : de la naissance a la mort

Chaque plugin passe par un cycle de vie, comme un organisme vivant :

```
NONE → SETUP → START → ENABLED → SHUTDOWN → DISABLED
  |       |       |        |          |          |
Nait   Se      Lance    Pleinement  S'endort    Dort
       reveille systemes  actif
```

| Etat | Ce qui se passe | Ce que vous devez faire |
|------|-----------------|------------------------|
| **SETUP** | Le plugin se reveille, les dependances sont pretes | Enregistrer commandes, evenements, initialiser ressources |
| **START** | Tous les plugins sont configures | Charger configurations, connecter aux bases de donnees |
| **ENABLED** | Le plugin tourne completement | Operation normale |
| **SHUTDOWN** | Le serveur s'arrete ou le plugin est desactive | Sauvegarder donnees, fermer connexions, nettoyer |
| **DISABLED** | Le plugin dort | Rien - vous avez fini |

### Analogie du monde reel : cuisine de restaurant

Pensez au serveur Hytale comme une cuisine de restaurant :

- **Serveur** = La cuisine avec tout son equipement
- **Plugin** = Un chef specialise que vous embauchez
- **Manifeste** = Le CV du chef (nom, competences, exigences)
- **Cycle de vie** = Le service du chef (arriver, preparer, cuisiner, nettoyer, partir)
- **Registres** = Le tableau de menu ou les chefs affichent leurs plats

Comme un chef :
- Doit suivre les regles de la cuisine (utiliser les registres fournis)
- Ne peut pas modifier la structure de la cuisine (code du serveur)
- Doit nettoyer en partant (shutdown proprement)
- Travaille aux cotes d'autres chefs (autres plugins)

### Le manifeste : la carte d'identite de votre plugin

Chaque plugin a besoin d'un fichier `manifest.json` qui dit au serveur :

```json
{
    "Group": "MonStudio",           // Qui l'a fait (votre organisation)
    "Name": "SuperFonctionnalite",  // Comment il s'appelle
    "Version": "1.0.0",             // Quelle version
    "Main": "com.monstudio.Super",  // Ou trouver la classe principale
    "Dependencies": {               // Ce dont il a besoin pour fonctionner
        "Hytale:CorePlugin": ">=1.0.0"
    }
}
```

C'est comme une etiquette de colis - le serveur sait ce qu'il y a dedans sans l'ouvrir.

### Pourquoi utiliser les registres au lieu d'un acces direct ?

Vous vous demandez peut-etre pourquoi les plugins utilisent `getCommandRegistry()` au lieu d'acceder directement a `CommandManager`. Voici pourquoi :

```java
// MAUVAIS : Acces direct
CommandManager.get().register(new MyCommand());
// Probleme : Quand votre plugin est desactive, la commande reste enregistree !

// BON : Utiliser le registre
getCommandRegistry().registerCommand(new MyCommand());
// Quand votre plugin est desactive, toutes vos commandes sont automatiquement desenregistrees
```

Les registres suivent tout ce que votre plugin cree et le nettoient automatiquement. C'est comme le checkout d'un hotel - vous n'avez pas besoin de vous rappeler chaque serviette utilisee ; le personnel connait votre chambre et nettoie tout.

---

## Documentation technique

Cette documentation couvre le systeme de plugins du serveur Hytale, permettant aux developpeurs d'etendre les fonctionnalites du serveur via des plugins Java.

## Table des matieres

1. [Apercu general](#apercu-general)
2. [Creer un plugin](#creer-un-plugin)
3. [Manifeste du plugin](#manifeste-du-plugin)
4. [Cycle de vie du plugin](#cycle-de-vie-du-plugin)
5. [PluginManager](#pluginmanager)
6. [Acces aux services du serveur](#acces-aux-services-du-serveur)
7. [Plugins precoces et transformateurs de classes](#plugins-precoces-et-transformateurs-de-classes)
8. [Commandes de gestion des plugins](#commandes-de-gestion-des-plugins)

---

## Apercu general

Le systeme de plugins Hytale est base sur Java et permet aux developpeurs de creer des modifications cote serveur. Les plugins sont charges a partir de fichiers JAR places dans le repertoire `mods/` ou depuis le classpath du serveur.

### Composants principaux

| Composant | Description |
|-----------|-------------|
| `JavaPlugin` | Classe de base pour tous les plugins Java |
| `PluginBase` | Classe abstraite fournissant les fonctionnalites communes des plugins |
| `PluginManager` | Gere le cycle de vie et le chargement des plugins |
| `PluginManifest` | Fichier de configuration JSON decrivant le plugin |
| `PluginClassLoader` | Chargeur de classes personnalise pour l'isolation des plugins |

### Format d'identifiant de plugin

Les plugins sont identifies par une combinaison de `Group` et `Name` :

```
Group:Name
```

Exemple : `MyCompany:MyPlugin`

---

## Creer un plugin

### Structure de base d'un plugin

Pour creer un plugin, etendez la classe `JavaPlugin` :

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
        // Appele pendant la phase de configuration du plugin
        getLogger().info("MyPlugin est en cours de configuration !");
    }

    @Override
    protected void start() {
        // Appele lorsque le plugin demarre
        getLogger().info("MyPlugin a demarre !");
    }

    @Override
    protected void shutdown() {
        // Appele lorsque le plugin est desactive
        getLogger().info("MyPlugin s'arrete !");
    }
}
```

### Structure du projet

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

### Exigences du constructeur

Votre classe de plugin **doit** avoir un constructeur acceptant un parametre `JavaPluginInit` :

```java
public MyPlugin(@Nonnull JavaPluginInit init) {
    super(init);
}
```

L'objet `JavaPluginInit` fournit :
- `getPluginManifest()` - La configuration du manifeste du plugin
- `getDataDirectory()` - Chemin vers le dossier de donnees du plugin
- `getFile()` - Chemin vers le fichier JAR du plugin
- `getClassLoader()` - Le chargeur de classes du plugin

---

## Manifeste du plugin

Chaque plugin necessite un fichier `manifest.json` a la racine du JAR :

### Exemple complet de manifeste

```json
{
    "Group": "MyCompany",
    "Name": "MyPlugin",
    "Version": "1.0.0",
    "Description": "Un exemple de plugin pour Hytale",
    "Authors": [
        {
            "Name": "Nom du developpeur",
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

### Champs du manifeste

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `Group` | String | Oui | Identifiant de l'organisation/groupe |
| `Name` | String | Oui | Nom unique du plugin |
| `Version` | Semver | Oui | Version du plugin (versionnage semantique) |
| `Description` | String | Non | Breve description du plugin |
| `Authors` | Array | Non | Liste des objets d'information sur les auteurs |
| `Website` | String | Non | URL du site web du plugin |
| `Main` | String | Oui | Nom complet qualifie de la classe principale |
| `ServerVersion` | SemverRange | Non | Plage de versions du serveur requise |
| `Dependencies` | Object | Non | Dependances de plugins requises |
| `OptionalDependencies` | Object | Non | Dependances de plugins optionnelles |
| `LoadBefore` | Object | Non | Plugins avant lesquels celui-ci doit se charger |
| `DisabledByDefault` | Boolean | Non | Si vrai, le plugin doit etre explicitement active |
| `IncludesAssetPack` | Boolean | Non | Si vrai, le plugin contient un pack de ressources |
| `SubPlugins` | Array | Non | Manifestes de sous-plugins imbriques |

### Structure des informations auteur

```json
{
    "Name": "Nom de l'auteur",
    "Email": "auteur@example.com",
    "Url": "https://site-auteur.com"
}
```

### Plages de versions

Les dependances utilisent des plages de versionnage semantique :

| Motif | Description |
|-------|-------------|
| `*` | N'importe quelle version |
| `1.0.0` | Version exacte |
| `>=1.0.0` | Version 1.0.0 ou superieure |
| `>=1.0.0 <2.0.0` | Entre 1.0.0 et 2.0.0 |

### Sous-plugins

Un plugin peut definir des sous-plugins imbriques qui heritent du parent :

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

Les sous-plugins heritent automatiquement de `Group`, `Version`, `Authors` et d'autres champs du parent.

---

## Cycle de vie du plugin

Les plugins passent par un cycle de vie bien defini gere par le `PluginManager`.

### Etats du plugin

```java
public enum PluginState {
    NONE,       // Etat initial, pas encore charge
    SETUP,      // Phase de configuration en cours
    START,      // Phase de demarrage en cours
    ENABLED,    // Plugin entierement active et en cours d'execution
    SHUTDOWN,   // Arret en cours
    DISABLED    // Plugin desactive
}
```

### Flux du cycle de vie

```
NONE -> SETUP -> START -> ENABLED -> SHUTDOWN -> DISABLED
```

### Methodes du cycle de vie

Surchargez ces methodes pour gerer les evenements du cycle de vie :

```java
public class MyPlugin extends JavaPlugin {

    public MyPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    /**
     * Appele pendant la phase de configuration.
     * Enregistrez les commandes, evenements et initialisez les ressources.
     * Les dependances sont garanties d'etre en etat SETUP ou ulterieur.
     */
    @Override
    protected void setup() {
        // Enregistrer les commandes
        getCommandRegistry().registerCommand(new MyCommand());

        // Enregistrer les evenements
        getEventRegistry().register(PlayerJoinEvent.class, this::onPlayerJoin);

        // Enregistrer les taches
        getTaskRegistry().registerTask(myAsyncTask());
    }

    /**
     * Appele pendant la phase de demarrage.
     * Les dependances sont garanties d'etre en etat ENABLED.
     * Les packs de ressources sont enregistres ici.
     */
    @Override
    protected void start() {
        getLogger().info("Plugin demarre avec succes !");
    }

    /**
     * Appele lorsque le plugin s'arrete.
     * Nettoyez les ressources, sauvegardez les donnees, etc.
     */
    @Override
    protected void shutdown() {
        getLogger().info("Nettoyage des ressources...");
    }
}
```

### Chargement de la configuration

Utilisez `withConfig()` pour definir les configurations du plugin qui sont chargees avant `setup()` :

```java
public class MyPlugin extends JavaPlugin {
    private final Config<MyConfig> config;

    public MyPlugin(@Nonnull JavaPluginInit init) {
        super(init);
        // Doit etre appele avant setup
        this.config = withConfig(MyConfig.CODEC);
    }

    @Override
    protected void setup() {
        MyConfig cfg = config.get();
        getLogger().info("Configuration chargee : " + cfg.getSomeSetting());
    }
}
```

### Phase de pre-chargement

La methode `preLoad()` est appelee avant `setup()` pour charger les configurations de maniere asynchrone :

```java
@Nullable
public CompletableFuture<Void> preLoad() {
    // Gere automatiquement le chargement de la configuration
    // Surchargez uniquement si vous avez besoin d'un pre-chargement personnalise
}
```

---

## PluginManager

Le `PluginManager` est le composant central pour la gestion des plugins.

### Obtenir l'instance

```java
PluginManager pluginManager = PluginManager.get();
```

### Methodes principales

#### Lister les plugins

```java
// Obtenir tous les plugins charges
List<PluginBase> plugins = pluginManager.getPlugins();

// Obtenir un plugin specifique
PluginBase plugin = pluginManager.getPlugin(new PluginIdentifier("Group", "Name"));

// Verifier si un plugin existe avec une version
boolean exists = pluginManager.hasPlugin(identifier, SemverRange.fromString(">=1.0.0"));
```

#### Chargement et dechargement

```java
// Charger un plugin par identifiant
boolean success = pluginManager.load(new PluginIdentifier("Group", "Name"));

// Decharger un plugin
boolean success = pluginManager.unload(identifier);

// Recharger un plugin (dechargement + chargement)
boolean success = pluginManager.reload(identifier);
```

#### Plugins disponibles

```java
// Obtenir tous les plugins disponibles (y compris les desactives)
Map<PluginIdentifier, PluginManifest> available = pluginManager.getAvailablePlugins();
```

### Sources de chargement des plugins

Les plugins sont charges depuis plusieurs sources dans l'ordre :

1. **Core Plugins** - Plugins integres au serveur
2. **Repertoire Builtin** - `<serveur>/builtin/*.jar`
3. **Classpath** - Plugins dans le classpath du serveur
4. **Repertoire Mods** - `mods/*.jar` (emplacement par defaut)
5. **Repertoires supplementaires** - Via l'argument `--mods-directories`

### Ordre de chargement des plugins

Le `PluginManager` calcule l'ordre de chargement optimal base sur :

1. **Dependances** - Les plugins requis se chargent en premier
2. **Dependances optionnelles** - Prises en compte pour l'ordonnancement
3. **LoadBefore** - Indications d'ordonnancement explicites
4. **Priorite Classpath** - Les plugins du classpath se chargent avant les externes

Les dependances cycliques sont detectees et causeront un echec du chargement.

---

## Acces aux services du serveur

Les plugins ont acces a divers services du serveur via des registres.

### Registres disponibles

```java
public class MyPlugin extends JavaPlugin {

    @Override
    protected void setup() {
        // Enregistrement de commandes
        CommandRegistry commands = getCommandRegistry();

        // Gestion des evenements
        EventRegistry events = getEventRegistry();

        // Taches planifiees
        TaskRegistry tasks = getTaskRegistry();

        // Enregistrement d'etats de blocs
        BlockStateRegistry blockStates = getBlockStateRegistry();

        // Enregistrement d'entites
        EntityRegistry entities = getEntityRegistry();

        // Fonctionnalites client
        ClientFeatureRegistry clientFeatures = getClientFeatureRegistry();

        // Enregistrement de ressources
        AssetRegistry assets = getAssetRegistry();

        // Composants de stockage d'entites
        ComponentRegistryProxy<EntityStore> entityStore = getEntityStoreRegistry();

        // Composants de stockage de chunks
        ComponentRegistryProxy<ChunkStore> chunkStore = getChunkStoreRegistry();

        // Enregistrement de codecs
        CodecMapRegistry codecRegistry = getCodecRegistry(someCodecMap);
    }
}
```

### Enregistrement de commandes

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
        context.sendMessage(Message.raw("Bonjour depuis MyPlugin !"));
    }
}
```

### Enregistrement d'evenements

```java
@Override
protected void setup() {
    EventRegistry events = getEventRegistry();

    // Gestionnaire d'evenement simple
    events.register(PlayerJoinEvent.class, this::onPlayerJoin);

    // Avec priorite
    events.register(EventPriority.HIGH, PlayerJoinEvent.class, this::onPlayerJoin);

    // Gestionnaire global (recoit toutes les cles)
    events.registerGlobal(SomeKeyedEvent.class, this::onKeyedEvent);

    // Gestionnaire d'evenement asynchrone
    events.registerAsync(AsyncEvent.class, future ->
        future.thenApply(event -> {
            // Traitement asynchrone
            return event;
        })
    );
}

private void onPlayerJoin(PlayerJoinEvent event) {
    getLogger().info("Joueur connecte : " + event.getPlayer().getName());
}
```

### Enregistrement de taches

```java
@Override
protected void setup() {
    TaskRegistry tasks = getTaskRegistry();

    // Enregistrer une tache CompletableFuture
    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
        // Travail asynchrone
    });
    tasks.registerTask(future);

    // Enregistrer une tache planifiee
    ScheduledFuture<Void> scheduled = scheduler.schedule(() -> {
        // Travail planifie
        return null;
    }, 5, TimeUnit.SECONDS);
    tasks.registerTask(scheduled);
}
```

### Acces au serveur

```java
// Obtenir l'instance du serveur
HytaleServer server = HytaleServer.get();

// Obtenir le bus d'evenements directement
IEventBus eventBus = server.getEventBus();

// Obtenir la configuration du serveur
HytaleServerConfig config = server.getConfig();
```

### Journalisation

Chaque plugin a son propre logger :

```java
HytaleLogger logger = getLogger();
logger.info("Message d'information");
logger.warning("Message d'avertissement");
logger.severe("Message d'erreur");
logger.at(Level.FINE).log("Message de debug avec %s", "formatage");
logger.at(Level.SEVERE).withCause(exception).log("Une erreur s'est produite");
```

### Repertoire de donnees du plugin

```java
// Obtenir le repertoire de donnees du plugin
Path dataDir = getDataDirectory();

// Typiquement : mods/Group_Name/
```

### Permissions du plugin

Les plugins ont une chaine de permission de base :

```java
String basePermission = getBasePermission();
// Format : "group.name" (minuscules)
```

---

## Plugins precoces et transformateurs de classes

Les plugins precoces sont un type special qui se charge **avant** le demarrage du serveur principal, permettant la transformation de bytecode.

### Avertissement

Les plugins precoces sont **non supportes** et peuvent causer des problemes de stabilite. Ils necessitent une confirmation explicite de l'utilisateur pour s'executer.

### Emplacement des plugins precoces

Placez les fichiers JAR des plugins precoces dans le repertoire `earlyplugins/` ou specifiez les chemins via :

```bash
java -jar server.jar --early-plugins=/chemin/vers/plugins
java -jar server.jar --accept-early-plugins  # Ignorer l'invite de confirmation
```

### Creer un transformateur de classes

Implementez l'interface `ClassTransformer` :

```java
package com.example.earlyplugin;

import com.hypixel.hytale.plugin.early.ClassTransformer;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class MyTransformer implements ClassTransformer {

    /**
     * Les transformateurs de priorite superieure s'executent en premier.
     */
    @Override
    public int priority() {
        return 100; // Par defaut : 0
    }

    /**
     * Transforme le bytecode d'une classe.
     *
     * @param className    Nom complet qualifie de la classe (ex: "com.example.MyClass")
     * @param internalName Nom interne de la classe (ex: "com/example/MyClass")
     * @param classBytes   Bytecode original
     * @return Bytecode transforme, ou null pour conserver l'original
     */
    @Nullable
    @Override
    public byte[] transform(@Nonnull String className,
                           @Nonnull String internalName,
                           @Nonnull byte[] classBytes) {
        if (!className.equals("com.hypixel.hytale.SomeClass")) {
            return null; // Ne pas transformer
        }

        // Utiliser ASM ou similaire pour modifier le bytecode
        // Retourner les octets modifies
        return modifiedBytes;
    }
}
```

### Enregistrement du service

Enregistrez votre transformateur via le ServiceLoader de Java. Creez le fichier :

```
META-INF/services/com.hypixel.hytale.plugin.early.ClassTransformer
```

Avec le contenu :

```
com.example.earlyplugin.MyTransformer
```

### Classes protegees

Les prefixes de packages suivants ne peuvent pas etre transformes :

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

## Commandes de gestion des plugins

Le serveur fournit des commandes integrees pour la gestion des plugins :

### `/plugin list` (ou `/pl ls`)

Liste tous les plugins charges.

### `/plugin load <Group:Name>` (ou `/pl l`)

Charge un plugin. Options :
- `--boot` - Ajouter uniquement a la liste de demarrage sans charger immediatement

### `/plugin unload <Group:Name>` (ou `/pl u`)

Decharge un plugin. Options :
- `--boot` - Retirer uniquement de la liste de demarrage sans decharger

### `/plugin reload <Group:Name>` (ou `/pl r`)

Recharge un plugin (dechargement + chargement).

### `/plugin manage` (ou `/pl m`)

Ouvre l'interface de gestion des plugins (commande joueur uniquement).

---

## Bonnes pratiques

### 1. Gerer correctement le cycle de vie

```java
@Override
protected void setup() {
    // Initialiser les ressources
    // Enregistrer les commandes, evenements, etc.
}

@Override
protected void shutdown() {
    // Nettoyer les ressources
    // Sauvegarder les donnees
    // Annuler les taches
}
```

### 2. Utiliser les registres du plugin

Utilisez toujours les registres fournis au lieu de l'enregistrement global. Cela garantit un nettoyage correct lorsque le plugin est decharge.

```java
// Correct - utilise le registre du plugin
getCommandRegistry().registerCommand(new MyCommand());

// Incorrect - contourne le nettoyage
CommandManager.get().register(new MyCommand());
```

### 3. Verifier l'etat du plugin

```java
if (isEnabled()) {
    // Peut effectuer le travail en toute securite
}

if (isDisabled()) {
    // Le plugin n'est pas actif
}
```

### 4. Gerer les dependances

```java
@Override
protected void setup() {
    PluginBase dependency = PluginManager.get()
        .getPlugin(new PluginIdentifier("Group", "RequiredPlugin"));

    if (dependency != null && dependency.isEnabled()) {
        // Utiliser les fonctionnalites de la dependance
    }
}
```

### 5. Bonnes pratiques de journalisation

```java
// Utiliser les niveaux de log appropries
getLogger().at(Level.FINE).log("Info de debug");      // Debogage
getLogger().at(Level.INFO).log("Info normale");       // Operation normale
getLogger().at(Level.WARNING).log("Avertissement");   // Problemes recuperables
getLogger().at(Level.SEVERE).log("Erreur");           // Erreurs

// Inclure le contexte
getLogger().at(Level.SEVERE)
    .withCause(exception)
    .log("Echec du chargement de la config pour %s", getIdentifier());
```

---

## Exemple : Plugin complet

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
        getLogger().info("Configuration de GreetingPlugin...");

        // Enregistrer la commande
        getCommandRegistry().registerCommand(new GreetCommand());

        // Enregistrer l'evenement
        getEventRegistry().register(PlayerJoinEvent.class, event -> {
            event.getPlayer().sendMessage(
                Message.raw("Bienvenue sur le serveur !")
            );
        });
    }

    @Override
    protected void start() {
        getLogger().info("GreetingPlugin demarre !");
    }

    @Override
    protected void shutdown() {
        getLogger().info("GreetingPlugin s'arrete...");
    }

    private class GreetCommand extends CommandBase {
        public GreetCommand() {
            super("greet", "greeting.command.desc");
        }

        @Override
        protected void executeSync(@Nonnull CommandContext context) {
            context.sendMessage(Message.raw("Bonjour depuis GreetingPlugin !"));
        }
    }
}
```

**manifest.json :**

```json
{
    "Group": "Example",
    "Name": "GreetingPlugin",
    "Version": "1.0.0",
    "Description": "Un simple plugin de salutation",
    "Main": "com.example.greeting.GreetingPlugin",
    "Authors": [
        {
            "Name": "Developpeur Exemple"
        }
    ]
}
```

---

## Documentation connexe

- [Systeme d'evenements](/docs/api/events) - Documentation detaillee sur la gestion des evenements
- [Systeme de commandes](/docs/api/commands) - Guide de creation de commandes
- [Packs de ressources](/docs/api/assets) - Inclure des ressources avec les plugins
- [Configuration](/docs/api/configuration) - Systeme de configuration des plugins
