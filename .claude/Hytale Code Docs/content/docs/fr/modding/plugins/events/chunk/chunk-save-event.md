---
id: chunk-save-event
title: ChunkSaveEvent
sidebar_label: ChunkSaveEvent
description: Evenement déclenché lorsqu'un chunk est sur le point d'etre sauvegarde
---

# ChunkSaveEvent

:::danger Non écoutable par les plugins
**Cet événement ne peut actuellement pas etre ecoute par les plugins.** Bien que la classe de l'événement existe et soit dispatchee en interne, elle utilise `store.invoke()` au lieu de `commandBuffer.invoke()`, ce qui empeche les systemes ECS enregistres de recevoir l'événement. C'est une limitation cote serveur decouverte lors de tests en janvier 2026.

**Comparaison avec ChunkUnloadEvent :**
- `ChunkUnloadEvent` utilise `commandBuffer.invoke()` → Fonctionne avec les listeners de plugins
- `ChunkSaveEvent` utilise `store.invoke()` → Ne fonctionne PAS avec les listeners de plugins

Les exemples de code ci-dessous montrent comment l'API *fonctionnerait* si cette limitation est corrigee dans une future mise a jour.
:::

L'événement `ChunkSaveEvent` est déclenché lorsqu'un chunk est sur le point d'etre sauvegarde dans le stockage persistant. C'est un événement ECS (Entity Component System) qui etend `CancellableEcsEvent`, permettant aux plugins d'intercepter et d'empêcher les sauvegardes de chunks si necessaire.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.ecs.ChunkSaveEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Implemente** | `ICancellableEcsEvent` (via parent) |
| **Annulable** | Oui |
| **Type d'événement** | Evenement ECS (ChunkStore) |
| **Statut plugin** | Non ecoutable |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/ChunkSaveEvent.java:7` |
| **Teste** | Janvier 2026 - L'événement n'atteint pas les listeners de plugins |

## Declaration

```java
public class ChunkSaveEvent extends CancellableEcsEvent {
   @Nonnull
   private final WorldChunk chunk;

   public ChunkSaveEvent(@Nonnull WorldChunk chunk) {
      this.chunk = chunk;
   }

   @Nonnull
   public WorldChunk getChunk() {
      return this.chunk;
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `chunk` | `WorldChunk` | `getChunk()` | Le chunk en cours de sauvegarde |

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

Retourne le chunk qui est en cours de sauvegarde.

**Retourne :** `WorldChunk` - L'instance du chunk en cours de sauvegarde vers le stockage

### isCancelled()

```java
public boolean isCancelled()
```

Hérité de `CancellableEcsEvent`. Retourne si l'operation de sauvegarde a ete annulee.

**Retourne :** `boolean` - `true` si la sauvegarde du chunk a ete annulee, `false` sinon

### setCancelled(boolean)

```java
public void setCancelled(boolean cancelled)
```

Hérité de `CancellableEcsEvent`. Definit si l'operation de sauvegarde doit etre annulee.

**Parametres :**
- `cancelled` - `true` pour annuler la sauvegarde du chunk, `false` pour l'autoriser

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

Les événements ECS sont dispatches via le systeme de composants plutot que le bus d'événements standard, typiquement en reponse aux operations au niveau des composants.

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.events.ecs.ChunkSaveEvent;

// Enregistrer un listener d'événement ECS pour les sauvegardes de chunks
ecsEventManager.register(ChunkSaveEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Journaliser les sauvegardes de chunks
    System.out.println("Sauvegarde du chunk a : " + chunk.getX() + ", " + chunk.getZ());

    // Exemple : Empecher la sauvegarde des chunks dans une region specifique
    if (isReadOnlyRegion(chunk)) {
        event.setCancelled(true);
        System.out.println("Sauvegarde bloquee pour le chunk en lecture seule");
        return;
    }

    // Exemple : Effectuer une validation avant la sauvegarde
    if (!validateChunkData(chunk)) {
        event.setCancelled(true);
        System.out.println("Sauvegarde bloquee en raison de donnees de chunk invalides");
        return;
    }

    // Exemple : Ajouter des donnees personnalisees avant la sauvegarde
    addCustomSaveData(chunk);
});

private boolean isReadOnlyRegion(WorldChunk chunk) {
    // Verifier si le chunk est dans une region protegee/en lecture seule
    int x = chunk.getX();
    int z = chunk.getZ();
    return x >= -10 && x <= 10 && z >= -10 && z <= 10;
}

private boolean validateChunkData(WorldChunk chunk) {
    // Valider l'integrite du chunk avant d'autoriser la sauvegarde
    return chunk.isValid();
}

private void addCustomSaveData(WorldChunk chunk) {
    // Ajouter toutes les donnees personnalisees qui doivent etre persistees avec le chunk
}
```

## Quand cet événement se déclenché

L'événement `ChunkSaveEvent` est dispatche lorsque :

1. Un chunk est en cours de sauvegarde dans le cadre des operations de sauvegarde automatique regulieres
2. Le serveur s'arrete et sauvegarde tous les chunks charges
3. Un chunk est en cours de dechargement et doit sauvegarder son etat
4. Une operation de sauvegarde manuelle est déclenchée pour des chunks specifiques
5. Des commandes de sauvegarde de monde sont executees

L'événement se déclenché **avant** que les donnees du chunk soient ecrites dans le stockage, permettant des modifications ou l'annulation.

## Comportement de l'annulation

Lorsque l'événement est annule :
- Le chunk ne sera pas sauvegarde dans le stockage persistant
- Les modifications du chunk depuis la derniere sauvegarde resteront uniquement en memoire
- Au redemarrage du serveur, le chunk reviendra a son dernier etat sauvegarde
- A utiliser avec prudence car les modifications non sauvegardees seront perdues

**Avertissement :** L'annulation des sauvegardes de chunks peut entrainer une perte de donnees. N'annulez les sauvegardes que lorsque vous avez une raison specifique et comprenez les consequences.

## Événements associes

- [ChunkPreLoadProcessEvent](./chunk-pre-load-process-event) - Déclenché lorsqu'un chunk est en cours de chargement
- [ChunkUnloadEvent](./chunk-unload-event) - Déclenché lorsqu'un chunk est en cours de dechargement
- [MoonPhaseChangeEvent](./moon-phase-change-event) - Déclenché lorsque la phase lunaire change

## Cas d'utilisation courants

### Optimisation de la sauvegarde

```java
ecsEventManager.register(ChunkSaveEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Ignorer la sauvegarde des chunks qui n'ont pas ete modifies
    if (!chunk.isDirty()) {
        event.setCancelled(true);
        return;
    }
});
```

### Sauvegarde avant backup

```java
ecsEventManager.register(ChunkSaveEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Creer une sauvegarde des chunks importants avant d'ecraser
    if (isImportantChunk(chunk)) {
        createChunkBackup(chunk);
    }
});
```

### Journalisation et metriques de sauvegarde

```java
ecsEventManager.register(ChunkSaveEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Suivre les statistiques de sauvegarde
    metrics.recordChunkSave(chunk.getX(), chunk.getZ());

    // Journaliser les sauvegardes pour le debogage
    logger.debug("Sauvegarde du chunk [{}, {}] avec {} entites",
                 chunk.getX(), chunk.getZ(), chunk.getEntityCount());
});
```

### Prevention conditionnelle de la sauvegarde

```java
ecsEventManager.register(ChunkSaveEvent.class, event -> {
    WorldChunk chunk = event.getChunk();

    // Empecher la sauvegarde des chunks temporaires/d'instance
    if (chunk.getWorld().isTemporary()) {
        event.setCancelled(true);
        return;
    }

    // Empecher la sauvegarde pendant le mode maintenance
    if (serverInMaintenanceMode) {
        event.setCancelled(true);
        return;
    }
});
```

## Details techniques du dispatch

:::info Details techniques
Cette section explique pourquoi l'événement n'est pas ecoutable par les plugins.
:::

### Comment ChunkSaveEvent est dispatche

L'événement est dispatche dans `ChunkSavingSystems.java` en utilisant `store.invoke()` :

```java
// ChunkSavingSystems.java:81 (methode tryQueue)
ChunkSaveEvent event = new ChunkSaveEvent(worldChunkComponent);
store.invoke(chunkRef, event);  // Utilise Store.invoke() directement
if (!event.isCancelled()) {
    store.getResource(ChunkStore.SAVE_RESOURCE).push(chunkRef);
}
```

### Pourquoi ca ne fonctionne pas

En comparant avec `ChunkUnloadEvent` (qui fonctionne) :

```java
// ChunkUnloadingSystem.java:87 (methode tryUnload)
ChunkUnloadEvent event = new ChunkUnloadEvent(worldChunkComponent);
commandBuffer.invoke(chunkRef, event);  // Utilise CommandBuffer.invoke()
```

La difference cle :
- `commandBuffer.invoke()` route via `store.internal_invoke()` qui dispatche correctement vers les systemes ECS enregistres
- `store.invoke()` cree une pile d'execution isolee qui ne déclenché pas les listeners enregistres par les plugins

### Emplacements du dispatch

L'événement est cree et dispatche a deux endroits :

1. **ChunkSavingSystems.tryQueue()** (ligne 81) - Pendant les operations normales de sauvegarde de chunks
2. **ChunkSavingSystems.tryQueueSync()** (ligne 100) - Pendant les operations de sauvegarde synchrones (ex: arret du serveur)

Les deux utilisent `store.invoke()` au lieu de `commandBuffer.invoke()`.

## Référence source

- **Definition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/ChunkSaveEvent.java`
- **Classe parente :** `decompiled/com/hypixel/hytale/component/system/CancellableEcsEvent.java`
- **Base EcsEvent :** `decompiled/com/hypixel/hytale/component/system/EcsEvent.java`
- **Interface Cancellable :** `decompiled/com/hypixel/hytale/component/system/ICancellableEcsEvent.java`
- **Emplacement du dispatch :** `decompiled/com/hypixel/hytale/server/core/universe/world/storage/component/ChunkSavingSystems.java`
