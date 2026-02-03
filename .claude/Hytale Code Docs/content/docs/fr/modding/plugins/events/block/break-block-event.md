---
id: break-block-event
title: BreakBlockEvent
sidebar_label: BreakBlockEvent
---

# BreakBlockEvent

> **Dernière mise à jour :** 17 janvier 2026 - Ajout d'exemples pratiques et de détails d'implémentation internes.

Déclenché lorsqu'un bloc est sur le point d'être cassé (détruit) dans le monde. Cet événement permet aux plugins d'intercepter et d'annuler la destruction de blocs, de modifier le bloc cible, ou d'executer une logique personnalisee lorsque des blocs sont detruits.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.BreakBlockEvent` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |
| **Evenement ECS** | Oui |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/ecs/BreakBlockEvent.java:10` |

## Declaration

```java
public class BreakBlockEvent extends CancellableEcsEvent {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `itemInHand` | `@Nullable ItemStack` | `getItemInHand()` | L'objet que l'entite tient lorsqu'elle casse le bloc (null si aucun objet en main) |
| `targetBlock` | `@Nonnull Vector3i` | `getTargetBlock()` | La position du bloc en cours de destruction |
| `blockType` | `@Nonnull BlockType` | `getBlockType()` | Le type de bloc en cours de destruction |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getItemInHand` | `@Nullable public ItemStack getItemInHand()` | Retourne l'objet tenu par l'entite qui casse le bloc, ou null si aucun objet en main |
| `getTargetBlock` | `@Nonnull public Vector3i getTargetBlock()` | Retourne la position dans le monde du bloc cible |
| `setTargetBlock` | `public void setTargetBlock(@Nonnull Vector3i targetBlock)` | Change la position du bloc cible (ligne 39) |
| `getBlockType` | `@Nonnull public BlockType getBlockType()` | Retourne le type de bloc en cours de destruction |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'événement a ete annule (hérité) |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Definit l'etat d'annulation de l'événement (hérité) |

## Comprendre les événements ECS

**Important :** Les événements ECS (Entity Component System) fonctionnent différemment des événements `IEvent` classiques. Ils n'utilisent **pas** l'EventBus - ils nécessitent une classe `EntityEventSystem` dédiée enregistrée via `getEntityStoreRegistry().registerSystem()`.

Différences clés :
- Les événements ECS étendent `EcsEvent` ou `CancellableEcsEvent` au lieu d'implémenter `IEvent`
- Ils sont dispatchés via `entityStore.invoke()` dans le framework ECS
- Vous devez créer une sous-classe d'`EntityEventSystem` pour écouter ces événements
- Les systèmes sont enregistrés via `getEntityStoreRegistry().registerSystem()`

## Exemple d'utilisation

> **Testé** - Ce code a été vérifié avec un plugin fonctionnel.

### Étape 1 : Créer l'EntityEventSystem

Créez une classe qui étend `EntityEventSystem<EntityStore, BreakBlockEvent>` :

```java
package com.example.monplugin.systems;

import com.hypixel.hytale.component.Archetype;
import com.hypixel.hytale.component.ArchetypeChunk;
import com.hypixel.hytale.component.CommandBuffer;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.component.query.Query;
import com.hypixel.hytale.component.system.EntityEventSystem;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.event.events.ecs.BreakBlockEvent;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class BlockBreakSystem extends EntityEventSystem<EntityStore, BreakBlockEvent> {

    public BlockBreakSystem() {
        super(BreakBlockEvent.class);
    }

    @Override
    public void handle(
            int index,
            @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
            @Nonnull Store<EntityStore> store,
            @Nonnull CommandBuffer<EntityStore> commandBuffer,
            @Nonnull BreakBlockEvent event
    ) {
        // Obtenir des informations sur le bloc en cours de destruction
        int x = event.getTargetBlock().getX();
        int y = event.getTargetBlock().getY();
        int z = event.getTargetBlock().getZ();
        BlockType blockType = event.getBlockType();
        ItemStack toolUsed = event.getItemInHand();

        // Exemple : Empêcher la destruction de blocs protégés
        if (isProtectedBlock(blockType)) {
            event.setCancelled(true);
            return;
        }

        // Exemple : Logger la destruction du bloc
        System.out.println("Bloc cassé à [" + x + "," + y + "," + z + "] type=" + blockType);
    }

    @Nullable
    @Override
    public Query<EntityStore> getQuery() {
        return Archetype.empty(); // Attraper les événements de toutes les entités
    }

    private boolean isProtectedBlock(BlockType blockType) {
        // Logique de protection personnalisée
        return false;
    }
}
```

### Étape 2 : Enregistrer le système dans votre plugin

Dans la méthode `setup()` de votre plugin, enregistrez le système :

```java
public class MonPlugin extends JavaPlugin {

    public MonPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer le système d'événement ECS
        getEntityStoreRegistry().registerSystem(new BlockBreakSystem());
    }
}
```

### Notes importantes

- La méthode `getQuery()` détermine quelles entités ce système écoute. Retournez `Archetype.empty()` pour attraper les événements de toutes les entités.
- Les événements ECS ne sont **pas** enregistrés via `EventBus.register()` - cette approche ne fonctionnera pas pour ces événements.
- Chaque type d'événement ECS nécessite sa propre classe `EntityEventSystem`.

## Exemples pratiques

### Obtenir la position du bloc

Pour savoir où le bloc a été cassé :

```java
@Override
public void handle(..., @Nonnull BreakBlockEvent event) {
    Vector3i pos = event.getTargetBlock();

    int x = pos.getX();
    int y = pos.getY();
    int z = pos.getZ();

    System.out.println("Bloc cassé à X=" + x + " Y=" + y + " Z=" + z);
}
```

### Obtenir le type de bloc

Pour savoir quel bloc a été cassé :

```java
@Override
public void handle(..., @Nonnull BreakBlockEvent event) {
    BlockType blockType = event.getBlockType();

    // Obtenir l'identifiant du bloc (ex: "hytale:stone", "hytale:oak_log")
    String blockId = blockType.toString();

    // Ou obtenir la clé d'asset
    AssetKey<BlockType> assetKey = blockType.getAssetKey();

    System.out.println("Bloc cassé : " + blockId);
}
```

### Vérifier l'outil utilisé

Pour voir quel objet le joueur a utilisé pour casser le bloc :

```java
@Override
public void handle(..., @Nonnull BreakBlockEvent event) {
    ItemStack tool = event.getItemInHand();

    if (tool == null) {
        System.out.println("Bloc cassé à mains nues");
    } else {
        // Obtenir le type d'outil
        ItemType itemType = tool.getType();
        System.out.println("Outil utilisé : " + itemType.toString());

        // Vérifier la durabilité si applicable
        // tool.getDurability(), tool.getMaxDurability(), etc.
    }
}
```

### Exemple complet : Logger de destruction de blocs

Un exemple complet qui log toutes les destructions de blocs avec les détails :

```java
public class BlockBreakLoggerSystem extends EntityEventSystem<EntityStore, BreakBlockEvent> {

    private static final HytaleLogger LOGGER = HytaleLogger.forEnclosingClass();

    public BlockBreakLoggerSystem() {
        super(BreakBlockEvent.class);
    }

    @Override
    public void handle(
            int index,
            @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
            @Nonnull Store<EntityStore> store,
            @Nonnull CommandBuffer<EntityStore> commandBuffer,
            @Nonnull BreakBlockEvent event
    ) {
        // Obtenir la position du bloc
        Vector3i pos = event.getTargetBlock();

        // Obtenir le type de bloc
        BlockType blockType = event.getBlockType();

        // Obtenir l'outil (peut être null)
        ItemStack tool = event.getItemInHand();
        String toolName = (tool != null) ? tool.getType().toString() : "main";

        // Logger la destruction
        LOGGER.at(Level.INFO).log(
            "Bloc cassé : %s à [%d, %d, %d] avec %s",
            blockType,
            pos.getX(), pos.getY(), pos.getZ(),
            toolName
        );
    }

    @Nullable
    @Override
    public Query<EntityStore> getQuery() {
        return Archetype.empty();
    }
}
```

### Exemple : Protéger certains types de blocs

Empêcher la destruction de certains blocs :

```java
public class BlockProtectionSystem extends EntityEventSystem<EntityStore, BreakBlockEvent> {

    // Ensemble des IDs de blocs protégés
    private static final Set<String> PROTECTED_BLOCKS = Set.of(
        "hytale:bedrock",
        "hytale:spawner",
        "hytale:barrier"
    );

    public BlockProtectionSystem() {
        super(BreakBlockEvent.class);
    }

    @Override
    public void handle(..., @Nonnull BreakBlockEvent event) {
        String blockId = event.getBlockType().toString();

        if (PROTECTED_BLOCKS.contains(blockId)) {
            // Annuler l'événement - le bloc ne sera pas cassé
            event.setCancelled(true);
        }
    }

    @Nullable
    @Override
    public Query<EntityStore> getQuery() {
        return Archetype.empty();
    }
}
```

### Exemple : Rediriger la destruction de bloc

Changer quel bloc est cassé (ex: casser le bloc au-dessus à la place) :

```java
@Override
public void handle(..., @Nonnull BreakBlockEvent event) {
    Vector3i originalPos = event.getTargetBlock();

    // Rediriger vers le bloc au-dessus
    Vector3i newPos = new Vector3i(
        originalPos.getX(),
        originalPos.getY() + 1,  // Un bloc plus haut
        originalPos.getZ()
    );

    event.setTargetBlock(newPos);
}
```

## Quand cet événement se déclenche

Le `BreakBlockEvent` est déclenché lorsque :

1. **Un joueur casse un bloc** - Quand un joueur réussit à miner/casser un bloc après que le seuil de dégâts est atteint
2. **Une entité détruit un bloc** - Quand une entité (mob, projectile, etc.) provoque la destruction d'un bloc
3. **Suppression de bloc programmatique** - Quand les systèmes de jeu suppriment des blocs via les mécaniques de destruction normales

L'événement se déclenche **avant** que le bloc soit réellement retiré du monde, permettant aux gestionnaires de :
- Annuler complètement la destruction
- Modifier quel bloc est détruit
- Suivre la destruction des blocs à des fins de journalisation ou de gameplay

## Comportement de l'annulation

Lorsque l'événement est annulé en appelant `setCancelled(true)` :

- Le bloc ne sera **pas** retiré du monde
- Le bloc reste dans son état actuel
- Tout drop d'objet qui aurait eu lieu est empêché
- La perte de durabilité de l'outil peut toujours se produire (selon l'implémentation)
- Le joueur/l'entité reçoit un retour indiquant que l'action a été bloquée

Ceci est utile pour :
- Les systèmes de protection de blocs (claims, protection du spawn)
- Les restrictions de construction basées sur les permissions
- Les modes de jeu personnalisés où certains blocs ne peuvent pas être cassés
- Les mesures anti-grief

## Détails internes

> Cette section fournit des détails d'implémentation du code source décompilé pour les développeurs avancés.

### Chaîne de traitement de l'événement

Quand un bloc est cassé, la séquence suivante se produit :

```
BlockHarvestUtils.performBlockBreak()
    │
    ├─► BreakBlockEvent créé et invoqué via entityStore.invoke()
    │
    ├─► Si annulé : section du bloc invalidée, retour anticipé
    │
    ├─► BlackboardSystems.BreakBlockEventSystem gère l'événement
    │
    ├─► Blackboard.onEntityBreakBlock() traite la logique de jeu
    │
    └─► BlockEventView.onEntityBreakBlock() notifie les NPCs
```

### Où l'événement est déclenché

L'événement est créé dans `BlockHarvestUtils.performBlockBreak()` :

```java
// BlockHarvestUtils.java, ligne 572
BreakBlockEvent event = new BreakBlockEvent(heldItemStack, blockPosition, targetBlockTypeKey);
entityStore.invoke(ref, event);
```

### Implémentation de l'annulation

Quand annulé, le traitement interne ressemble à ceci :

```java
// BlockHarvestUtils.java, lignes 574-581
if (event.isCancelled()) {
    BlockChunk blockChunkComponent = chunkStore.getComponent(chunkReference, BlockChunk.getComponentType());
    BlockSection blockSection = blockChunkComponent.getSectionAtBlockY(blockPosition.getY());
    blockSection.invalidateBlock(blockPosition.getX(), blockPosition.getY(), blockPosition.getZ());
    return; // La destruction du bloc est annulée
}
```

### Hiérarchie de classes

```
EcsEvent (classe de base pour tous les événements ECS)
    └─► CancellableEcsEvent (ajoute isCancelled/setCancelled)
            └─► BreakBlockEvent
```

### Notes importantes

- **BlockType est immutable** : Le champ `blockType` est `final` et ne peut pas être modifié après la création de l'événement. Seul `targetBlock` peut être modifié via `setTargetBlock()`.
- **Timing de l'événement** : L'événement se déclenche APRÈS que les dégâts du bloc atteignent 100% mais AVANT que le bloc soit retiré et que les drops soient générés.
- **Conscience des NPCs** : L'événement est utilisé par le système de blackboard des NPCs pour les informer des destructions de blocs dans leur voisinage.

## Événements lies

- [PlaceBlockEvent](./place-block-event) - Déclenché lorsqu'un bloc est place
- [DamageBlockEvent](./damage-block-event) - Déclenché lorsqu'un bloc subit des degats (avant la destruction)
- [UseBlockEvent](./use-block-event) - Déclenché lorsqu'un bloc fait l'objet d'une interaction

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/ecs/BreakBlockEvent.java:10`
