---
id: boot-event
title: BootEvent
sidebar_label: BootEvent
---

# BootEvent

L'événement `BootEvent` est déclenché lorsque le serveur Hytale commence sa sequence de demarrage. Cet événement offre aux plugins la possibilite d'effectuer des taches d'initialisation qui doivent se produire le plus tot possible dans le cycle de vie du serveur.

## Informations sur l'événement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.BootEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/BootEvent.java:6` |

## Declaration

```java
public class BootEvent implements IEvent<Void> {
    public BootEvent() {
    }

    @Nonnull
    @Override
    public String toString() {
        return "BootEvent{}";
    }
}
```

## Champs

Cet événement n'a pas de champs. Il sert de signal indiquant que le processus de demarrage du serveur a commence.

## Méthodes

Cet événement hérité des methodes standard de `IEvent<Void>` mais ne definit aucune methode supplementaire.

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.event.events.BootEvent;
import com.hypixel.hytale.event.EventBus;

public class MyPlugin extends PluginBase {

    @Override
    public void onEnable(EventBus eventBus) {
        // Register for the boot event
        eventBus.register(BootEvent.class, this::onServerBoot);
    }

    private void onServerBoot(BootEvent event) {
        // Perform early initialization
        getLogger().info("Server is booting up!");

        // Initialize configuration
        loadConfiguration();

        // Set up any required resources
        initializeResources();
    }

    private void loadConfiguration() {
        // Load plugin configuration files
    }

    private void initializeResources() {
        // Set up databases, caches, etc.
    }
}
```

## Quand cet événement est déclenché

Le `BootEvent` est déclenché au tout debut du processus de demarrage du serveur. Cela se produit :

1. Apres le demarrage de l'application serveur
2. Apres le chargement initial des classes et l'injection de dependances
3. Avant le chargement des mondes
4. Avant que les plugins recoivent leurs événements de configuration
5. Avant que les joueurs puissent se connecter

Cela le rend ideal pour :
- L'initialisation precoce des ressources
- Le chargement de la configuration
- L'etablissement des connexions a la base de donnees
- La mise en place des frameworks de journalisation
- L'enregistrement a d'autres événements

## Événements associes

| Événement | Description |
|-----------|-------------|
| [ShutdownEvent](./shutdown-event) | Declenche lorsque le serveur commence a s'arreter |
| [PluginSetupEvent](./plugin-setup-event) | Declenche lors de la configuration d'un plugin individuel |
| [AllWorldsLoadedEvent](/docs/fr/modding/plugins/events/world/all-worlds-loaded-event) | Declenche apres le chargement complet de tous les mondes |

## Reference source

- **Package** : `com.hypixel.hytale.server.core.event.events`
- **Hierarchie** : `BootEvent` -> `IEvent<Void>` -> `IBaseEvent<Void>`
- **Systeme d'événements** : Événement synchrone standard distribue via `EventBus`
