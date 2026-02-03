---
id: block-health
title: Systeme de Sante des Blocs
sidebar_label: Sante des Blocs
sidebar_position: 7
description: Documentation complete du systeme de sante des blocs Hytale pour les degats, la regeneration, la fragilite et la progression de destruction
---

# Systeme de Sante des Blocs

Le systeme de Sante des Blocs dans Hytale gere l'etat d'endommagement des blocs dans le monde. Il suit les degats subis par chaque bloc, gere la regeneration automatique au fil du temps, et gere le mecanisme de "bloc fragile" pour les blocs recemment places.

## Vue d'Ensemble du Systeme

Le systeme de Sante des Blocs se compose de quatre classes principales :

| Classe | Description |
|--------|-------------|
| `BlockHealthModule` | Le module/plugin principal qui gere l'ensemble du systeme |
| `BlockHealth` | Represente l'etat de sante d'un bloc unique |
| `BlockHealthChunk` | Stocke les donnees de sante des blocs pour tous les blocs d'un chunk |
| `FragileBlock` | Suit les blocs qui sont dans un etat fragile temporaire |

**Source:** `com.hypixel.hytale.server.core.modules.blockhealth`

## Proprietes de Sante des Blocs

Chaque bloc endommage est suivi avec une instance `BlockHealth` :

```java
public class BlockHealth implements Cloneable {
    public static final BlockHealth NO_DAMAGE_INSTANCE = new BlockHealth(1.0F, Instant.MIN);

    private float health;                    // Sante actuelle (0.0 a 1.0)
    private Instant lastDamageGameTime;      // Quand le bloc a ete endommage pour la derniere fois

    public float getHealth();
    public void setHealth(float health);
    public Instant getLastDamageGameTime();
    public void setLastDamageGameTime(Instant lastDamageGameTime);
    public boolean isDestroyed();            // Retourne true si sante <= 0
    public boolean isFullHealth();           // Retourne true si sante >= 1.0
}
```

**Constantes Cles :**
- `NO_DAMAGE_INSTANCE` - Une instance immuable representant un bloc a pleine sante (1.0)

## Niveaux de Degats des Blocs

La sante des blocs est representee par une valeur float de 0.0 a 1.0 :

| Plage de Sante | Description | Etat Visuel |
|----------------|-------------|-------------|
| `1.0` | Pleine sante | Pas de fissures |
| `0.75 - 0.99` | Degats legers | Fissures mineures visibles |
| `0.50 - 0.74` | Degats moderes | Fissures moyennes visibles |
| `0.25 - 0.49` | Degats importants | Fissures majeures visibles |
| `0.01 - 0.24` | Degats critiques | Fissures severes visibles |
| `<= 0.0` | Detruit | Le bloc se casse |

La methode `isDestroyed()` verifie si la sante est a zero ou en dessous :

```java
public boolean isDestroyed() {
    return MathUtil.closeToZero(this.health) || this.health < 0.0F;
}
```

## Composant BlockHealthChunk

Le `BlockHealthChunk` est un composant ECS attache a chaque chunk qui stocke les donnees de sante pour tous les blocs endommages :

```java
public class BlockHealthChunk implements Component<ChunkStore> {
    private final Map<Vector3i, BlockHealth> blockHealthMap;      // Blocs endommages
    private final Map<Vector3i, FragileBlock> blockFragilityMap;  // Blocs fragiles
    private Instant lastRepairGameTime;                            // Dernier tick traite
}
```

### Methodes Principales

| Methode | Signature | Description |
|---------|-----------|-------------|
| `damageBlock` | `BlockHealth damageBlock(Instant currentUptime, World world, Vector3i block, float health)` | Appliquer des degats a un bloc |
| `repairBlock` | `BlockHealth repairBlock(World world, Vector3i block, float progress)` | Reparer la sante d'un bloc |
| `removeBlock` | `void removeBlock(World world, Vector3i block)` | Retirer un bloc du systeme de suivi de sante |
| `getBlockHealth` | `float getBlockHealth(Vector3i block)` | Obtenir la sante actuelle d'un bloc (retourne 1.0 si non endommage) |
| `makeBlockFragile` | `void makeBlockFragile(Vector3i blockLocation, float fragileDuration)` | Marquer un bloc comme fragile pour une duree |
| `isBlockFragile` | `boolean isBlockFragile(Vector3i block)` | Verifier si un bloc est actuellement fragile |
| `getBlockHealthMap` | `@Nonnull Map<Vector3i, BlockHealth> getBlockHealthMap()` | Obtenir un acces direct a la map interne des blocs endommages |
| `getBlockFragilityMap` | `@Nonnull Map<Vector3i, FragileBlock> getBlockFragilityMap()` | Obtenir un acces direct a la map interne des blocs fragiles |
| `createBlockDamagePackets` | `void createBlockDamagePackets(@Nonnull List<Packet> list)` | Generer des paquets UpdateBlockDamage pour tous les blocs endommages (utilise lors du chargement des chunks) |
| `clone` | `@Nonnull BlockHealthChunk clone()` | Creer une copie profonde de ce composant |

### Endommager des Blocs

```java
@Nonnull
public BlockHealth damageBlock(Instant currentUptime, @Nonnull World world, @Nonnull Vector3i block, float health) {
    BlockHealth blockHealth = this.blockHealthMap.compute(block, (key, value) -> {
        if (value == null) {
            value = new BlockHealth();
        }
        value.setHealth(value.getHealth() - health);
        value.setLastDamageGameTime(currentUptime);
        return (BlockHealth)((double)value.getHealth() < 1.0 ? value : null);
    });

    if (blockHealth != null && !blockHealth.isDestroyed()) {
        Predicate<PlayerRef> filter = player -> true;
        world.getNotificationHandler().updateBlockDamage(
            block.getX(), block.getY(), block.getZ(),
            blockHealth.getHealth(), -health, filter
        );
    }
    return Objects.requireNonNullElse(blockHealth, BlockHealth.NO_DAMAGE_INSTANCE);
}
```

### Reparer des Blocs

```java
@Nonnull
public BlockHealth repairBlock(@Nonnull World world, @Nonnull Vector3i block, float progress) {
    BlockHealth blockHealth = Objects.requireNonNullElse(
        this.blockHealthMap.computeIfPresent(block, (key, value) -> {
            value.setHealth(value.getHealth() + progress);
            return (BlockHealth)((double)value.getHealth() > 1.0 ? value : null);
        }),
        BlockHealth.NO_DAMAGE_INSTANCE
    );

    world.getNotificationHandler().updateBlockDamage(
        block.getX(), block.getY(), block.getZ(),
        blockHealth.getHealth(), progress
    );
    return blockHealth;
}
```

## Regeneration Automatique

Le `BlockHealthModule` implemente la regeneration automatique de sante pour les blocs endommages :

```java
private static final long SECONDS_UNTIL_REGENERATION = 5L;  // 5 secondes apres le dernier degat
private static final float HEALING_PER_SECOND = 0.1F;       // 10% par seconde
```

**Regles de Regeneration :**
1. Un bloc ne doit pas avoir subi de degats pendant 5 secondes avant que la regeneration commence
2. Une fois la regeneration commencee, les blocs guerissent a 10% de sante par seconde
3. Quand un bloc atteint la pleine sante (1.0), il est retire de la map de suivi
4. Les mises a jour de regeneration sont envoyees a tous les joueurs qui ont le chunk charge

### Logique de Regeneration

```java
// Depuis BlockHealthSystem.tick()
Instant startRegenerating = blockHealth.getLastDamageGameTime().plusSeconds(5L);
if (!currentGameTime.isBefore(startRegenerating)) {
    float healthDelta = 0.1F * deltaSeconds;
    float health = blockHealth.getHealth() + healthDelta;

    if (health < 1.0F) {
        blockHealth.setHealth(health);
    } else {
        iterator.remove();  // Bloc completement gueri
        health = BlockHealth.NO_DAMAGE_INSTANCE.getHealth();
        healthDelta = health - blockHealth.getHealth();
    }

    // Envoyer le paquet de mise a jour aux joueurs
    UpdateBlockDamage packet = new UpdateBlockDamage(
        new BlockPosition(position.getX(), position.getY(), position.getZ()),
        health, healthDelta
    );
    for (int i = 0; i < visibleTo.size(); i++) {
        visibleTo.get(i).getPacketHandler().writeNoCache(packet);
    }
}
```

## Blocs Fragiles

Quand un joueur place un bloc, il entre dans un etat "fragile" pour une duree configurable. Les blocs fragiles peuvent etre casses instantanement, peu importe leur temps de minage normal.

### Configuration

Le timer de fragilite est configure dans `WorldConfig` :

```java
// Depuis WorldConfig.java
protected float blockPlacementFragilityTimer;

public float getBlockPlacementFragilityTimer() {
    return this.blockPlacementFragilityTimer;
}
```

**Configuration JSON :**
```json
{
    "BlockPlacementFragilityTimer": 2.0
}
```

Cela definit la duree de fragilite en secondes apres le placement du bloc.

### Classe FragileBlock

```java
public class FragileBlock implements Cloneable {
    private float durationSeconds;

    public FragileBlock(float durationSeconds);
    public float getDurationSeconds();
    public void setDurationSeconds(float durationSeconds);
}
```

### Mecaniques de Fragilite

1. **Au Placement du Bloc :** Le `PlaceBlockEventSystem` marque le bloc comme fragile
2. **Decompte de la Duree :** A chaque tick, la duree de fragilite est decrementee
3. **Verification de Fragilite :** Lors des degats au bloc, si le bloc est fragile OU detruit, il se casse

```java
// Depuis PlaceBlockEventSystem.handle()
WorldConfig worldGameplayConfig = world.getGameplayConfig().getWorldConfig();
float blockPlacementFragilityTimer = worldGameplayConfig.getBlockPlacementFragilityTimer();
blockHealthComponent.makeBlockFragile(blockLocation, blockPlacementFragilityTimer);
```

```java
// Depuis BlockHarvestUtils.performBlockDamage()
if (blockHealthComponent.isBlockFragile(targetBlockPos) || blockDamage.isDestroyed()) {
    // Le bloc se casse immediatement
    performBlockBreak(...);
    brokeBlock = true;
}
```

## Protocole Reseau

Les mises a jour de degats des blocs sont envoyees aux clients via le paquet `UpdateBlockDamage` :

```java
public class UpdateBlockDamage implements Packet {
    public static final int PACKET_ID = 144;

    public BlockPosition blockPosition;  // Position du bloc endommage
    public float damage;                 // Valeur de sante actuelle (0.0 a 1.0)
    public float delta;                  // Changement de sante dans cette mise a jour
}
```

Le `WorldNotificationHandler` distribue ces paquets :

```java
public void updateBlockDamage(int x, int y, int z, float health, float healthDelta) {
    this.sendPacketIfChunkLoaded(this.getBlockDamagePacket(x, y, z, health, healthDelta), x, z);
}

public void updateBlockDamage(int x, int y, int z, float health, float healthDelta,
                               @Nullable Predicate<PlayerRef> filter) {
    this.sendPacketIfChunkLoaded(this.getBlockDamagePacket(x, y, z, health, healthDelta), x, z, filter);
}
```

## Evenements Lies

Le systeme de sante des blocs interagit avec ces evenements :

| Evenement | Description |
|-----------|-------------|
| `DamageBlockEvent` | Declenche quand un bloc subit des degats (peut modifier/annuler les degats) |
| `BreakBlockEvent` | Declenche quand un bloc est completement detruit |
| `PlaceBlockEvent` | Declenche quand un bloc est place (declenche la fragilite) |

### Integration de DamageBlockEvent

```java
// Depuis BlockHarvestUtils.performBlockDamage()
float current = blockHealthComponent.getBlockHealth(originBlock);
DamageBlockEvent event = new DamageBlockEvent(itemStack, originBlock, targetBlockType, current, damage);

if (ref != null) {
    entityStore.invoke(ref, event);
} else {
    entityStore.invoke(event);
}

if (event.isCancelled()) {
    targetSection.invalidateBlock(targetBlockPos.x, targetBlockPos.y, targetBlockPos.z);
    return false;
}

damage = event.getDamage();  // Permet aux plugins de modifier les degats
```

## Exemple de Plugin

Voici un exemple complet d'interaction avec le systeme de sante des blocs :

```java
public class BlockHealthPlugin extends JavaPlugin {

    public BlockHealthPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Ecouter les evenements de degats aux blocs
        getEventRegistry().register(DamageBlockEvent.class, this::onBlockDamage);
        getEventRegistry().register(PlaceBlockEvent.class, this::onBlockPlace);
    }

    private void onBlockDamage(DamageBlockEvent event) {
        Vector3i blockPos = event.getTargetBlock();
        BlockType blockType = event.getBlockType();
        float currentDamage = event.getCurrentDamage();
        float incomingDamage = event.getDamage();

        // Exemple: L'obsidienne subit la moitie des degats
        if (blockType.getId().equals("obsidian")) {
            event.setDamage(incomingDamage * 0.5f);
        }

        // Exemple: Empecher le bedrock d'etre endommage
        if (blockType.getId().equals("bedrock")) {
            event.setCancelled(true);
        }

        // Logger la progression des degats
        float remainingHealth = (1.0f - currentDamage) - event.getDamage();
        getLogger().info("Bloc a " + blockPos + " sante: " + remainingHealth);
    }

    private void onBlockPlace(PlaceBlockEvent event) {
        Vector3i blockPos = event.getTargetBlock();
        getLogger().info("Bloc place a " + blockPos + " - maintenant fragile");
    }

    // Acceder aux donnees de sante des blocs directement
    public float getBlockHealth(World world, Vector3i blockPos) {
        ChunkStore chunkStore = world.getChunkStore();
        long chunkIndex = ChunkUtil.indexChunkFromBlock(blockPos.x, blockPos.z);
        Ref<ChunkStore> chunkRef = chunkStore.getChunkReference(chunkIndex);

        if (chunkRef != null && chunkRef.isValid()) {
            ComponentType<ChunkStore, BlockHealthChunk> componentType =
                BlockHealthModule.get().getBlockHealthChunkComponentType();
            BlockHealthChunk blockHealthChunk =
                chunkStore.getStore().getComponent(chunkRef, componentType);

            if (blockHealthChunk != null) {
                return blockHealthChunk.getBlockHealth(blockPos);
            }
        }
        return 1.0f;  // Pleine sante si non trouve
    }

    // Verifier si un bloc est fragile
    public boolean isBlockFragile(World world, Vector3i blockPos) {
        ChunkStore chunkStore = world.getChunkStore();
        long chunkIndex = ChunkUtil.indexChunkFromBlock(blockPos.x, blockPos.z);
        Ref<ChunkStore> chunkRef = chunkStore.getChunkReference(chunkIndex);

        if (chunkRef != null && chunkRef.isValid()) {
            ComponentType<ChunkStore, BlockHealthChunk> componentType =
                BlockHealthModule.get().getBlockHealthChunkComponentType();
            BlockHealthChunk blockHealthChunk =
                chunkStore.getStore().getComponent(chunkRef, componentType);

            if (blockHealthChunk != null) {
                return blockHealthChunk.isBlockFragile(blockPos);
            }
        }
        return false;
    }
}
```

## Architecture du Module

Le `BlockHealthModule` enregistre plusieurs systemes internes :

```java
@Override
protected void setup() {
    ComponentRegistryProxy<ChunkStore> chunkStoreRegistry = this.getChunkStoreRegistry();

    // Enregistrer le type de composant BlockHealthChunk
    this.blockHealthChunkComponentType = chunkStoreRegistry.registerComponent(
        BlockHealthChunk.class, "BlockHealthChunk", BlockHealthChunk.CODEC
    );

    // Enregistrer le gestionnaire d'evenements pour le placement de blocs
    this.getEntityStoreRegistry().registerSystem(new PlaceBlockEventSystem());

    // S'assurer que chaque chunk a un composant BlockHealthChunk
    chunkStoreRegistry.registerSystem(new EnsureBlockHealthSystem(this.blockHealthChunkComponentType));

    // Gerer le ticking de regeneration
    chunkStoreRegistry.registerSystem(new BlockHealthSystem(this.blockHealthChunkComponentType));

    // Gerer la generation de paquets reseau pour le chargement des chunks
    chunkStoreRegistry.registerSystem(new BlockHealthPacketSystem(this.blockHealthChunkComponentType));
}
```

### Dependances du Systeme

Le module depend de :
- `LegacyModule` - Systemes legacy de base
- `TimeModule` - Pour le suivi du temps de jeu

```java
@Nonnull
public static final PluginManifest MANIFEST = PluginManifest.corePlugin(BlockHealthModule.class)
    .depends(LegacyModule.class)
    .depends(TimeModule.class)
    .build();
```

## Serialisation

Les donnees de sante des blocs sont persistees avec les chunks en utilisant un format binaire :

```java
// Version de serialisation pour la compatibilite
private static final byte SERIALIZATION_VERSION = 2;

public byte[] serialize() {
    ByteBuf buf = Unpooled.buffer();
    buf.writeByte(2);  // Version

    // Serialiser la map de sante
    buf.writeInt(this.blockHealthMap.size());
    for (Entry<Vector3i, BlockHealth> entry : this.blockHealthMap.entrySet()) {
        Vector3i vec = entry.getKey();
        buf.writeInt(vec.x);
        buf.writeInt(vec.y);
        buf.writeInt(vec.z);
        entry.getValue().serialize(buf);
    }

    // Serialiser la map de fragilite (version 2+)
    buf.writeInt(this.blockFragilityMap.size());
    for (Entry<Vector3i, FragileBlock> entry : this.blockFragilityMap.entrySet()) {
        Vector3i vec = entry.getKey();
        buf.writeInt(vec.x);
        buf.writeInt(vec.y);
        buf.writeInt(vec.z);
        entry.getValue().serialize(buf);
    }

    return ByteBufUtil.getBytesRelease(buf);
}
```

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `BlockHealthModule` | `com.hypixel.hytale.server.core.modules.blockhealth.BlockHealthModule` |
| `BlockHealth` | `com.hypixel.hytale.server.core.modules.blockhealth.BlockHealth` |
| `BlockHealthChunk` | `com.hypixel.hytale.server.core.modules.blockhealth.BlockHealthChunk` |
| `FragileBlock` | `com.hypixel.hytale.server.core.modules.blockhealth.FragileBlock` |
| `UpdateBlockDamage` | `com.hypixel.hytale.protocol.packets.world.UpdateBlockDamage` |
| `WorldNotificationHandler` | `com.hypixel.hytale.server.core.universe.world.WorldNotificationHandler` |
| `BlockHarvestUtils` | `com.hypixel.hytale.server.core.modules.interaction.BlockHarvestUtils` |
| `DamageBlockEvent` | `com.hypixel.hytale.server.core.event.events.ecs.DamageBlockEvent` |
| `BreakBlockEvent` | `com.hypixel.hytale.server.core.event.events.ecs.BreakBlockEvent` |
| `PlaceBlockEvent` | `com.hypixel.hytale.server.core.event.events.ecs.PlaceBlockEvent` |
