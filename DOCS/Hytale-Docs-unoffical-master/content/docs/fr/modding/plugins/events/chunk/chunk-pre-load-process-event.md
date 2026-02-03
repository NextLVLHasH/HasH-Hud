---
id: chunk-pre-load-process-event
title: ChunkPreLoadProcessEvent
sidebar_label: ChunkPreLoadProcessEvent
description: Evenement déclenché pendant le processus de chargement d'un chunk, avant qu'il soit complètement charge
---

# ChunkPreLoadProcessEvent

L'événement `ChunkPreLoadProcessEvent` est déclenché pendant le processus de chargement d'un chunk, specifiquement avant que le chunk soit complètement charge et pret a l'utilisation. Cet événement implemente `IProcessedEvent`, permettant le suivi des handlers qui ont traite l'événement. Il fournit des informations sur si le chunk est nouvellement généré ou charge depuis le stockage.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.ChunkPreLoadProcessEvent` |
| **Classe parente** | `ChunkEvent` |
| **Implemente** | `IProcessedEvent` |
| **Annulable** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/ChunkPreLoadProcessEvent.java:12` |

## Declaration

```java
public class ChunkPreLoadProcessEvent extends ChunkEvent implements IProcessedEvent {
   private final boolean newlyGenerated;
   private long lastDispatchNanos;
   private boolean didLog;
   @Nonnull
   private final Holder<ChunkStore> holder;

   public ChunkPreLoadProcessEvent(@Nonnull Holder<ChunkStore> holder, @Nonnull WorldChunk chunk,
                                    boolean newlyGenerated, long lastDispatchNanos) {
      super(chunk);
      this.newlyGenerated = newlyGenerated;
      this.lastDispatchNanos = lastDispatchNanos;
      this.holder = holder;
   }

   public boolean isNewlyGenerated() {
      return this.newlyGenerated;
   }

   public boolean didLog() {
      return this.didLog;
   }

   @Nonnull
   public Holder<ChunkStore> getHolder() {
      return this.holder;
   }

   @Override
   public void processEvent(@Nonnull String hookName) {
      // Suivi des performances - journalise si le handler prend plus de temps que le tick step
   }

   @Nonnull
   @Override
   public String toString() {
      return "ChunkPreLoadProcessEvent{newlyGenerated=" + this.newlyGenerated
         + ", lastDispatchNanos=" + this.lastDispatchNanos
         + ", didLog=" + this.didLog + "} " + super.toString();
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `newlyGenerated` | `boolean` | `isNewlyGenerated()` | Si le chunk a ete nouvellement généré (vs charge depuis le stockage) |
| `lastDispatchNanos` | `long` | N/A | Champ de timing interne pour le suivi des performances |
| `didLog` | `boolean` | `didLog()` | Si la journalisation a eu lieu pour cet événement |
| `holder` | `Holder<ChunkStore>` | `getHolder()` | Le holder ECS pour le stockage des composants du chunk |

## Champs herites

De `ChunkEvent` :

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `chunk` | `WorldChunk` | `getChunk()` | Le chunk en cours de chargement |

## Méthodes

### isNewlyGenerated()

```java
public boolean isNewlyGenerated()
```

Retourne si le chunk est nouvellement généré ou charge depuis des donnees existantes.

**Retourne :** `boolean` - `true` si le chunk vient d'etre généré, `false` s'il est charge depuis le stockage

### didLog()

```java
public boolean didLog()
```

Retourne si la journalisation a ete effectuee pour cet événement.

**Retourne :** `boolean` - `true` si l'événement a ete journalise, `false` sinon

### getHolder()

```java
@Nonnull
public Holder<ChunkStore> getHolder()
```

Retourne le holder ECS contenant le stockage des composants du chunk.

**Retourne :** `Holder<ChunkStore>` - Le holder pour acceder aux composants du chunk

### getChunk()

```java
public WorldChunk getChunk()
```

Hérité de `ChunkEvent`. Retourne le chunk qui est en cours de chargement.

**Retourne :** `WorldChunk` - L'instance du chunk en cours de traitement

### processEvent(String)

```java
@Override
public void processEvent(@Nonnull String handlerName)
```

Implementation de `IProcessedEvent`. Appelee apres que chaque handler d'événement traite l'événement. Cela permet le suivi du traitement des handlers pour le debogage et la surveillance des performances.

**Parametres :**
- `handlerName` - Le nom du handler qui vient de traiter l'événement

## Interface IProcessedEvent

Cet événement implemente `IProcessedEvent`, qui fournit le suivi post-traitement :

```java
public interface IProcessedEvent {
   void processEvent(@Nonnull String var1);
}
```

La methode `processEvent` est appelee automatiquement par le systeme d'événements apres que chaque handler termine le traitement. Cela permet :
- Le suivi des performances par handler
- Le debogage pour savoir quels handlers traitent les chunks
- La journalisation des handlers lents pendant le chargement des chunks

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.events.ChunkPreLoadProcessEvent;
import com.hypixel.hytale.event.EventPriority;

// Enregistrer un listener pour traiter les chunks avant qu'ils soient complètement charges
eventBus.register(EventPriority.NORMAL, ChunkPreLoadProcessEvent.class, event -> {
    WorldChunk chunk = event.getChunk();
    boolean isNew = event.isNewlyGenerated();
    Holder<ChunkStore> holder = event.getHolder();

    // Journaliser le chargement du chunk
    if (isNew) {
        System.out.println("Traitement du chunk nouvellement généré a : " +
                           chunk.getX() + ", " + chunk.getZ());
    } else {
        System.out.println("Traitement du chunk charge a : " +
                           chunk.getX() + ", " + chunk.getZ());
    }

    // Exemple : Effectuer un traitement different pour les nouveaux chunks vs existants
    if (isNew) {
        // Traiter les chunks nouvellement générés
        processNewChunk(chunk, holder);
    } else {
        // Traiter les chunks charges depuis le stockage
        processExistingChunk(chunk, holder);
    }
});

private void processNewChunk(WorldChunk chunk, Holder<ChunkStore> holder) {
    // Ajouter des structures personnalisees aux chunks nouvellement générés
    // Initialiser les donnees de chunk personnalisees
    // Generer les entites initiales
}

private void processExistingChunk(WorldChunk chunk, Holder<ChunkStore> holder) {
    // Valider l'integrite des donnees du chunk
    // Migrer les anciens formats de chunk si necessaire
    // Restaurer l'etat du chunk
}
```

## Quand cet événement se déclenché

L'événement `ChunkPreLoadProcessEvent` est dispatche lorsque :

1. Un chunk est en cours de chargement depuis le stockage (chunk existant)
2. Un chunk vient d'etre généré par le generateur de monde (nouveau chunk)
3. Le chunk est dans la phase de pre-chargement avant de devenir complètement actif
4. Lorsqu'un joueur entre dans la portee d'une zone de chunks non charges

L'événement se déclenché **pendant** le processus de chargement du chunk, permettant des modifications aux donnees du chunk avant que le chunk devienne complètement actif.

## Considerations de performance

Puisque `ChunkPreLoadProcessEvent` implemente `IProcessedEvent` :

- Le temps de traitement de chaque handler peut etre suivi
- Les handlers de longue duree peuvent etre identifies et journalises
- Le champ `lastDispatchNanos` suit le timing entre les dispatches
- Considerez les performances des handlers car les chunks se chargent frequemment pendant le jeu

## Événements associes

- [ChunkSaveEvent](./chunk-save-event) - Déclenché lorsqu'un chunk est en cours de sauvegarde
- [ChunkUnloadEvent](./chunk-unload-event) - Déclenché lorsqu'un chunk est en cours de dechargement
- [MoonPhaseChangeEvent](./moon-phase-change-event) - Déclenché lorsque la phase lunaire change

## Cas d'utilisation courants

### Generation de chunk personnalisee

```java
eventBus.register(ChunkPreLoadProcessEvent.class, event -> {
    if (event.isNewlyGenerated()) {
        WorldChunk chunk = event.getChunk();

        // Ajouter la generation de minerais personnalises
        if (shouldGenerateCustomOres(chunk)) {
            generateCustomOres(chunk);
        }

        // Ajouter des structures personnalisees
        if (shouldPlaceStructure(chunk)) {
            placeCustomStructure(chunk);
        }
    }
});
```

### Migration des donnees de chunk

```java
eventBus.register(ChunkPreLoadProcessEvent.class, event -> {
    if (!event.isNewlyGenerated()) {
        WorldChunk chunk = event.getChunk();
        Holder<ChunkStore> holder = event.getHolder();

        // Verifier si le chunk necessite une migration
        int chunkVersion = getChunkVersion(holder);
        if (chunkVersion < CURRENT_VERSION) {
            migrateChunkData(chunk, holder, chunkVersion);
        }
    }
});
```

### Statistiques de chargement des chunks

```java
eventBus.register(EventPriority.LAST, ChunkPreLoadProcessEvent.class, event -> {
    // Suivre les statistiques de chargement des chunks
    if (event.isNewlyGenerated()) {
        metrics.incrementGeneratedChunks();
    } else {
        metrics.incrementLoadedChunks();
    }
});
```

## Référence source

- **Definition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/ChunkPreLoadProcessEvent.java`
- **Classe parente :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/ChunkEvent.java`
- **Interface IProcessedEvent :** `decompiled/com/hypixel/hytale/event/IProcessedEvent.java`
