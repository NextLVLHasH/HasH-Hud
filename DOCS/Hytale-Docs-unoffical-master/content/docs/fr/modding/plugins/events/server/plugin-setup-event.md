---
id: plugin-setup-event
title: PluginSetupEvent
sidebar_label: PluginSetupEvent
---

# PluginSetupEvent

L'événement `PluginSetupEvent` est déclenché lorsqu'un plugin est en cours de configuration pendant le processus d'initialisation du serveur. Cet événement est distribue pour chaque plugin et fournit un acces a l'instance du plugin en cours d'initialisation.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.plugin.event.PluginSetupEvent` |
| **Classe parente** | `PluginEvent` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Type de cle** | `Class<? extends PluginBase>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/plugin/event/PluginSetupEvent.java:6` |

## Declaration

```java
public class PluginSetupEvent extends PluginEvent {
    public PluginSetupEvent(PluginBase plugin) {
        super(plugin);
    }
}
```

## Classe parente : PluginEvent

Le `PluginSetupEvent` etend `PluginEvent`, qui fournit un acces au plugin en cours d'initialisation :

```java
public abstract class PluginEvent implements IEvent<Class<? extends PluginBase>> {
    @Nonnull
    private final PluginBase plugin;

    public PluginEvent(@Nonnull PluginBase plugin) {
        this.plugin = plugin;
    }

    @Nonnull
    public PluginBase getPlugin() {
        return this.plugin;
    }

    @Nonnull
    @Override
    public String toString() {
        return "PluginEvent{}";
    }
}
```

## Champs

| Champ | Type | Description | Accesseur |
|-------|------|-------------|-----------|
| `plugin` | `PluginBase` | L'instance du plugin en cours de configuration | `getPlugin()` |

## Méthodes

### Héritées de PluginEvent

| Méthode | Type de retour | Description |
|---------|----------------|-------------|
| `getPlugin()` | `PluginBase` | Retourne l'instance du plugin en cours de configuration |

## Exemple d'utilisation

### Ecoute de la configuration des plugins

```java
import com.hypixel.hytale.server.core.plugin.event.PluginSetupEvent;
import com.hypixel.hytale.event.EventBus;

public class PluginManagerPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Listen for all plugin setup events (global registration)
        eventBus.registerGlobal(PluginSetupEvent.class, this::onPluginSetup);
    }

    private void onPluginSetup(PluginSetupEvent event) {
        PluginBase plugin = event.getPlugin();
        getLogger().info("Plugin being set up: " + plugin.getClass().getName());
    }
}
```

### Ecoute de la configuration d'un plugin spécifique

```java
import com.hypixel.hytale.server.core.plugin.event.PluginSetupEvent;
import com.hypixel.hytale.event.EventBus;

public class MyDependentPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Listen for a specific plugin's setup event using the key
        eventBus.register(
            PluginSetupEvent.class,
            MyDependencyPlugin.class,  // Key: the specific plugin class
            this::onDependencySetup
        );
    }

    private void onDependencySetup(PluginSetupEvent event) {
        // This only fires when MyDependencyPlugin is being set up
        MyDependencyPlugin dependency = (MyDependencyPlugin) event.getPlugin();
        getLogger().info("Dependency plugin is ready: " + dependency.getName());
    }
}
```

### Suivi des statistiques des plugins

```java
import com.hypixel.hytale.server.core.plugin.event.PluginSetupEvent;
import com.hypixel.hytale.event.EventBus;
import java.util.ArrayList;
import java.util.List;

public class PluginStatsPlugin extends PluginBase {

    private final List<String> loadedPlugins = new ArrayList<>();

    @Override
    public void onEnable(EventBus eventBus) {
        // Track all plugin setups
        eventBus.registerGlobal(PluginSetupEvent.class, this::trackPluginSetup);
    }

    private void trackPluginSetup(PluginSetupEvent event) {
        PluginBase plugin = event.getPlugin();
        String pluginName = plugin.getClass().getSimpleName();

        loadedPlugins.add(pluginName);
        getLogger().info("Loaded plugin #" + loadedPlugins.size() + ": " + pluginName);
    }

    public List<String> getLoadedPlugins() {
        return new ArrayList<>(loadedPlugins);
    }
}
```

### Configuration de la communication inter-plugins

```java
import com.hypixel.hytale.server.core.plugin.event.PluginSetupEvent;
import com.hypixel.hytale.event.EventBus;

public class APIConsumerPlugin extends PluginBase {

    private APIProviderPlugin apiProvider;

    @Override
    public void onEnable(EventBus eventBus) {
        // Wait for the API provider plugin to be set up
        eventBus.register(
            PluginSetupEvent.class,
            APIProviderPlugin.class,
            this::onAPIProviderReady
        );
    }

    private void onAPIProviderReady(PluginSetupEvent event) {
        // Store reference to the API provider
        apiProvider = (APIProviderPlugin) event.getPlugin();

        // Register with the API
        apiProvider.registerConsumer(this);

        getLogger().info("Successfully connected to API provider plugin");
    }

    public APIProviderPlugin getAPIProvider() {
        return apiProvider;
    }
}
```

## Quand cet événement est déclenché

Le `PluginSetupEvent` est déclenché pendant la phase d'initialisation des plugins du serveur :

1. Apres le debut du processus de demarrage du serveur
2. Apres la distribution de [BootEvent](./boot-event)
3. Lorsque chaque plugin individuel est en cours d'initialisation
4. Avant que les plugins soient complètement actives et operationnels
5. Avant le chargement des mondes

L'événement est indexe par le type de classe du plugin, permettant aux gestionnaires de :
- Ecouter toutes les configurations de plugins en utilisant `registerGlobal()`
- Ecouter les configurations de plugins spécifiques en fournissant la classe du plugin comme cle

## Systeme de cles d'événement

Cet événement utilise `Class<? extends PluginBase>` comme type de cle, ce qui permet une gestion ciblee des événements :

```java
// Global: receive events for ALL plugins
eventBus.registerGlobal(PluginSetupEvent.class, handler);

// Specific: receive events only for MyPlugin
eventBus.register(PluginSetupEvent.class, MyPlugin.class, handler);

// Unhandled: receive events for plugins with no specific handlers
eventBus.registerUnhandled(PluginSetupEvent.class, fallbackHandler);
```

## Bonnes pratiques

1. **Utilisez l'enregistrement base sur les cles** : Lorsque vous attendez un plugin spécifique, utilisez la classe du plugin comme cle plutot que de verifier dans un gestionnaire global.

2. **Evitez les operations bloquantes** : La configuration des plugins doit etre rapide pour garantir que le demarrage du serveur n'est pas retarde.

3. **Gerez les dependances manquantes gracieusement** : Si votre plugin depend d'un autre plugin, pensez a ce qui se passe si ce plugin n'est pas installe.

4. **Ne modifiez pas les autres plugins** : Utilisez cet événement pour l'observation et la coordination de l'initialisation, pas pour modifier le comportement des autres plugins.

## Événements associes

| Evenement | Description |
|-----------|-------------|
| [BootEvent](./boot-event) | Déclenché lorsque le serveur commence a demarrer |
| [ShutdownEvent](./shutdown-event) | Déclenché lorsque le serveur commence a s'arreter |
| [AllWorldsLoadedEvent](/docs/fr/modding/plugins/events/world/all-worlds-loaded-event) | Déclenché apres le chargement de tous les mondes |

## Référence source

- **Package** : `com.hypixel.hytale.server.core.plugin.event`
- **Hierarchie** : `PluginSetupEvent` -> `PluginEvent` -> `IEvent<Class<? extends PluginBase>>` -> `IBaseEvent<Class<? extends PluginBase>>`
- **Systeme d'événements** : Evenement synchrone standard distribue via `EventBus` avec la classe du plugin comme cle
