---
id: chunk-unload-event
title: ChunkUnloadEvent
sidebar_label: ChunkUnloadEvent
description: Evenement déclenché lorsqu'un chunk est sur le point d'etre decharge de la memoire
---

# ChunkUnloadEvent

L'événement `ChunkUnloadEvent` est déclenché lorsqu'un chunk est sur le point d'etre decharge de la memoire. C'est un événement ECS (Entity Component System) qui etend `CancellableEcsEvent`, permettant aux plugins d'intercepter et d'empêcher le dechargement des chunks. Il offre egalement un controle sur l'etat de maintien en vie du chunk.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.ecs.ChunkUnloadEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Implemente** | `ICancellableEcsEvent` (via parent) |
| **Annulable** | Oui |
| **Type d'événement** | Evenement ECS |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/ChunkUnloadEvent.java:7` |

## Declaration

```java
public class ChunkUnloadEvent extends CancellableEcsEvent {
   @Nonnull
   private final WorldChunk chunk;
   private boolean resetKeepAlive = true;

   public ChunkUnloadEvent(@Nonnull WorldChunk chunk) {
      this.chunk = chunk;
   }

   @Nonnull
   public WorldChunk getChunk() {
      return this.chunk;
   }

   public void setResetKeepAlive(boolean willResetKeepAlive) {
      this.resetKeepAlive = willResetKeepAlive;
   }

   public boolean willResetKeepAlive() {
      return this.resetKeepAlive;
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `chunk` | `WorldChunk` | `getChunk()` | Le chunk en cours de dechargement |
| `resetKeepAlive` | `boolean` | `willResetKeepAlive()` | Si le timer de maintien en vie du chunk doit etre reinitialise |

## Champs hérités

De `CancellableEcsEvent` :

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'événement a ete annule |

## Méthodes

### getChunk()

```java
@Nonnull
public WorldChunk getChunk()
```

Retourne le chunk qui est en cours de dechargement.

**Retourne :** `WorldChunk` - L'instance du chunk en cours de dechargement de la memoire

### willResetKeepAlive()

```java
public boolean willResetKeepAlive()
```

Retourne si le timer de maintien en vie du chunk sera reinitialise apres la tentative de dechargement.

**Retourne :** `boolean` - `true` si le timer de maintien en vie sera reinitialise, `false` sinon

### setResetKeepAlive(boolean)

```java
public void setResetKeepAlive(boolean willResetKeepAlive)
```

Definit s'il faut reinitialiser le timer de maintien en vie du chunk. Lorsque defini a `true`, le chunk restera charge plus longtemps avant une autre tentative de dechargement.

**Parametres :**
- `willResetKeepAlive` - `true` pour reinitialiser le timer de maintien en vie, `false` pour le laisser inchange

### isCancelled()

```java
public boolean isCancelled()
```

Hérité de `CancellableEcsEvent`. Retourne si l'operation de dechargement a ete annulee.

**Retourne :** `boolean` - `true` si le dechargement du chunk a ete annule, `false` sinon

### setCancelled(boolean)

```java
public void setCancelled(boolean cancelled)
```

Hérité de `CancellableEcsEvent`. Definit si l'operation de dechargement doit etre annulee.

**Parametres :**
- `cancelled` - `true` pour annuler le dechargement du chunk, `false` pour l'autoriser

## Systeme d'événements ECS

Cet événement fait partie de l'architecture d'événements ECS (Entity Component System) de Hytale :

```java
public abstract class CancellableEcsEvent extends EcsEvent implements ICancellableEcsEvent {
   private boolean cancelled = false;

   public boolean isCancelled() {
      return this.cancelled;
   }

   public void setCancelled(boolean cancelled) {
      this.cancelled = cancelled;
   }
}
```

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.events.ecs.ChunkUnloadEvent;

// Enregistrer un listener d'événement ECS pour les dechargements de chunks
ecsEventManager.register(ChunkUnloadEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Journaliser les dechargements de chunks
    System.out.println("Tentative de dechargement du chunk a : " +
                       chunk.getX() + ", " + chunk.getZ());

    // Exemple : Empecher le dechargement des chunks avec des entites actives
    if (hasActiveEntities(chunk)) {
        event.setCancelled(true);
        event.setResetKeepAlive(true); // Garder le chunk charge plus longtemps
        System.out.println("Dechargement bloque - le chunk a des entites actives");
        return;
    }

    // Exemple : Empecher le dechargement des chunks de spawn
    if (isSpawnChunk(chunk)) {
        event.setCancelled(true);
        System.out.println("Dechargement bloque du chunk de spawn");
        return;
    }

    // Exemple : Prolonger le maintien en vie pour les chunks importants
    if (isImportantChunk(chunk)) {
        event.setResetKeepAlive(true);
    }
});

private boolean hasActiveEntities(WorldChunk chunk) {
    // Verifier si le chunk contient des entites qui devraient empêcher le dechargement
    return chunk.getEntityCount() > 0;
}

private boolean isSpawnChunk(WorldChunk chunk) {
    // Verifier si c'est un chunk de spawn qui devrait toujours etre charge
    int x = chunk.getX();
    int z = chunk.getZ();
    return Math.abs(x) <= 2 && Math.abs(z) <= 2;
}

private boolean isImportantChunk(WorldChunk chunk) {
    // Determiner si le chunk est important et devrait rester charge plus longtemps
    return chunk.hasStructures() || chunk.hasPlayers();
}
```

## Quand cet événement se déclenché

L'événement `ChunkUnloadEvent` est dispatche lorsque :

1. Le timer de maintien en vie d'un chunk expire et aucun joueur n'est a portee
2. La pression memoire déclenché le dechargement des chunks
3. Un monde est en cours d'arret et les chunks sont decharges
4. Des operations de dechargement manuel de chunks sont déclenchées
5. Les joueurs s'eloignent d'un chunk au-dela de la distance de vue

L'événement se déclenché **avant** que le chunk soit decharge, permettant l'annulation ou la modification du comportement de dechargement.

## Comportement de l'annulation

Lorsque l'événement est annule :
- Le chunk restera charge en memoire
- Les entites dans le chunk continuent de s'executer et de traiter
- Le chunk reste accessible aux joueurs et aux systemes
- Selon `resetKeepAlive`, le chunk peut etre programme pour un dechargement a nouveau bientot

## Mecanisme de maintien en vie

Le champ `resetKeepAlive` controle le timer de maintien en vie du chunk :

- **Lorsque `true` :** Le timer de maintien en vie du chunk est reinitialise, retardant les futures tentatives de dechargement
- **Lorsque `false` :** Le timer continue normalement, et une autre tentative de dechargement peut se produire bientot

Ceci est utile pour :
- Empecher temporairement les dechargements sans garder les chunks charges en permanence
- Donner plus de temps aux chunks avec un traitement actif avant d'etre decharges
- Gerer la memoire en controlant l'agressivite du dechargement des chunks

## Événements associes

- [ChunkPreLoadProcessEvent](./chunk-pre-load-process-event) - Déclenché lorsqu'un chunk est en cours de chargement
- [ChunkSaveEvent](./chunk-save-event) - Déclenché lorsqu'un chunk est en cours de sauvegarde
- [MoonPhaseChangeEvent](./moon-phase-change-event) - Déclenché lorsque la phase lunaire change

## Cas d'utilisation courants

### Protection des entites

```java
ecsEventManager.register(ChunkUnloadEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Empecher le dechargement des chunks avec des combats de boss
    if (hasBossFight(chunk)) {
        event.setCancelled(true);
        event.setResetKeepAlive(true);
        return;
    }

    // Empecher le dechargement des chunks avec des événements actifs
    if (hasActiveEvent(chunk)) {
        event.setCancelled(true);
        return;
    }
});
```

### Gestion intelligente des chunks

```java
ecsEventManager.register(ChunkUnloadEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Toujours garder certains chunks charges
    if (isPermanentChunk(chunk)) {
        event.setCancelled(true);
        return;
    }

    // Prolonger la duree de vie des chunks avec des operations en attente
    if (hasPendingOperations(chunk)) {
        event.setResetKeepAlive(true);
    }
});
```

### Journalisation et metriques de dechargement

```java
ecsEventManager.register(ChunkUnloadEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Suivre les statistiques de dechargement
    metrics.recordChunkUnload(chunk.getX(), chunk.getZ());

    // Journaliser l'etat du chunk avant le dechargement
    logger.debug("Dechargement du chunk [{}, {}] - {} entites, {} blocs modifies",
                 chunk.getX(), chunk.getZ(),
                 chunk.getEntityCount(),
                 chunk.getModifiedBlockCount());
});
```

### Dechargement gracieux avec nettoyage

```java
ecsEventManager.register(ChunkUnloadEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Effectuer le nettoyage avant le dechargement
    cleanupChunkData(chunk);

    // Sauvegarder les modifications en attente
    if (chunk.isDirty()) {
        saveChunkData(chunk);
    }

    // Notifier les systemes du dechargement imminent
    notifyChunkUnloading(chunk);
});
```

## Référence source

- **Definition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/ChunkUnloadEvent.java`
- **Classe parente :** `decompiled/com/hypixel/hytale/component/system/CancellableEcsEvent.java`
- **Base EcsEvent :** `decompiled/com/hypixel/hytale/component/system/EcsEvent.java`
- **Interface Cancellable :** `decompiled/com/hypixel/hytale/component/system/ICancellableEcsEvent.java`
