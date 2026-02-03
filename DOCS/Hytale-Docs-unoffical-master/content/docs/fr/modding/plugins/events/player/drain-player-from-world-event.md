---
id: drain-player-from-world-event
title: DrainPlayerFromWorldEvent
sidebar_label: DrainPlayerFromWorldEvent
---

# DrainPlayerFromWorldEvent

:::warning Important - Conditions de déclenchement (Vérifié)
Cet événement est **UNIQUEMENT** déclenché lorsqu'un monde est **SUPPRIMÉ/ARRÊTÉ** et que les joueurs sont "drainés" vers le monde par défaut. La téléportation normale entre mondes avec le composant `Teleport` ne déclenche **PAS** cet événement.
:::

Déclenché lorsqu'un joueur est forcé de quitter un monde parce que celui-ci est en cours d'arrêt. Cet événement permet aux plugins de modifier le monde de destination du joueur et sa transformation (position/rotation) quand il est drainé vers un autre monde.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.DrainPlayerFromWorldEvent` |
| **Classe parente** | `IEvent<String>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Vérifié** | ✅ Oui - Testé avec le plugin doc-test |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/DrainPlayerFromWorldEvent.java:10` |

## Declaration

```java
public class DrainPlayerFromWorldEvent implements IEvent<String> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `holder` | `Holder<EntityStore>` | `getHolder()` | Le conteneur d'entite contenant le magasin d'entite du joueur |
| `world` | `World` | `getWorld()` | Le monde duquel le joueur est retire |
| `transform` | `Transform` | `getTransform()` | La transformation du joueur (position/rotation) pour la destination |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getHolder` | `public Holder<EntityStore> getHolder()` | Retourne le conteneur d'entite du joueur |
| `getWorld` | `public World getWorld()` | Retourne le monde actuel (en cours de quitter) |
| `getTransform` | `public Transform getTransform()` | Retourne la transformation de destination |
| `setWorld` | `public void setWorld(World world)` | Definit le monde de destination |
| `setTransform` | `public void setTransform(Transform transform)` | Definit la transformation de destination |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour quand les joueurs quittent des mondes
eventBus.register(DrainPlayerFromWorldEvent.class, event -> {
    World currentWorld = event.getWorld();
    Holder<EntityStore> holder = event.getHolder();

    // Journaliser la sortie du monde
    logger.info("Player leaving world: " + currentWorld.getName());

    // Sauvegarder les donnees specifiques au monde avant de partir
    saveWorldProgress(holder, currentWorld);
});

// Rediriger les joueurs vers des points d'apparition specifiques
eventBus.register(DrainPlayerFromWorldEvent.class, event -> {
    World currentWorld = event.getWorld();

    // Verifier s'il quitte un donjon
    if (isDungeonWorld(currentWorld)) {
        // Renvoyer le joueur au hub
        World hubWorld = getHubWorld();
        Transform hubSpawn = getHubSpawnPoint();

        event.setWorld(hubWorld);
        event.setTransform(hubSpawn);
    }
});

// Gerer les sorties de mini-jeux
eventBus.register(DrainPlayerFromWorldEvent.class, event -> {
    World currentWorld = event.getWorld();
    Holder<EntityStore> holder = event.getHolder();

    if (isMinigameWorld(currentWorld)) {
        // Enregistrer les statistiques du mini-jeu
        recordMinigameStats(holder, currentWorld);

        // Retourner le joueur au lobby
        World lobbyWorld = getMinigameLobby();
        Transform lobbySpawn = getLobbySpawnForPlayer(holder);

        event.setWorld(lobbyWorld);
        event.setTransform(lobbySpawn);
    }
});

// Logique personnalisee de transfert de monde
eventBus.register(DrainPlayerFromWorldEvent.class, event -> {
    Holder<EntityStore> holder = event.getHolder();
    Transform currentTransform = event.getTransform();

    // Verifier si le joueur a une position sauvegardee dans le monde de destination
    World destinationWorld = getPlayerSavedWorld(holder);
    if (destinationWorld != null) {
        Transform savedPosition = getPlayerSavedPosition(holder, destinationWorld);
        if (savedPosition != null) {
            event.setWorld(destinationWorld);
            event.setTransform(savedPosition);
        }
    }
});

// Nettoyage et gestion des ressources
eventBus.register(EventPriority.LATE, DrainPlayerFromWorldEvent.class, event -> {
    World world = event.getWorld();
    Holder<EntityStore> holder = event.getHolder();

    // Retirer le joueur des systemes specifiques au monde
    removeFromWorldParty(holder, world);
    removeFromWorldTeam(holder, world);
    cleanupWorldResources(holder, world);

    // Mettre a jour le suivi de population du monde
    decrementWorldPopulation(world);
});
```

## Cas d'utilisation courants

- **Sauvegarde d'urgence des données** quand un monde est arrêté
- **Redirection des joueurs** vers un monde/emplacement spécifique quand leur monde est supprimé
- **Nettoyage de monde de mini-jeu** quand le mini-jeu se termine et que le monde est détruit
- **Donjons instanciés** où le monde du donjon est supprimé après complétion
- **Maintenance serveur** - sauvegarde des données joueur quand les mondes sont arrêtés
- **Nettoyage des ressources** - suppression des données spécifiques au monde retiré

## Événements lies

- [AddPlayerToWorldEvent](./add-player-to-world-event) - Déclenché quand le joueur est ajoute a un monde
- [PlayerDisconnectEvent](./player-disconnect-event) - Déclenché quand le joueur se deconnecte
- [RemoveWorldEvent](../world/remove-world-event) - Déclenché quand un monde est supprime

## Quand cet événement est déclenché

:::info Comportement vérifié
Cet événement est **UNIQUEMENT** déclenché dans le scénario suivant :
:::

**Lorsqu'un monde est supprimé/arrêté :**

1. **Suppression du monde initiée** via `Universe.get().removeWorld(worldName)`
2. **World.drainPlayersTo()** est appelé en interne
3. **DrainPlayerFromWorldEvent** - Déclenché pour chaque joueur drainé
4. **AddPlayerToWorldEvent** - Joueur ajouté au monde par défaut

## Quand cet événement n'est PAS déclenché

- Téléportation normale entre mondes (avec le composant `Teleport`)
- Déconnexion/reconnexion du joueur
- Commandes `/warp` ou de téléportation similaires

Pour les transferts de monde normaux, seul `AddPlayerToWorldEvent` est déclenché quand le joueur entre dans le nouveau monde.

## Comment tester cet événement

Pour déclencher `DrainPlayerFromWorldEvent` lors des tests :

1. Créez un monde secondaire (non par défaut)
2. Téléportez un joueur vers ce monde
3. Supprimez le monde avec `Universe.get().removeWorld(worldName)`
4. Le joueur sera "drainé" vers le monde par défaut et cet événement se déclenchera

```java
// Exemple : Déclencher DrainPlayerFromWorldEvent en supprimant un monde
World worldToRemove = Universe.get().getWorld("mon-monde-temp");
if (worldToRemove != null) {
    boolean removed = Universe.get().removeWorld("mon-monde-temp");
    // DrainPlayerFromWorldEvent se déclenche pour chaque joueur dans ce monde
}
```

## Notes

Cet événement ne peut pas être annulé, mais vous pouvez contrôler où le joueur va en utilisant `setWorld()` et `setTransform()`. La destination peut être :
- Un autre monde sur le serveur (s'il n'est pas en cours de suppression)
- Une position spécifique dans le monde de destination
- Un point d'apparition basé sur une logique personnalisée

La `transform` inclut les données de position et de rotation, vous permettant de contrôler exactement où et comment le joueur apparaît à sa destination.

Cet événement est spécifiquement conçu pour les scénarios d'arrêt de monde, permettant aux plugins de sauvegarder des données et de rediriger les joueurs de manière appropriée lorsqu'un monde est retiré du serveur.

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/DrainPlayerFromWorldEvent.java:10`
