---
id: damage-system
title: Systeme de Degats
sidebar_label: Systeme de Degats
sidebar_position: 7
description: Documentation complete du systeme de degats Hytale pour appliquer des degats, du recul et des effets de combat via les plugins
---

# Systeme de Degats

Le Systeme de Degats dans Hytale fournit un cadre complet pour infliger des degats aux entites, appliquer des effets de recul et gerer les interactions de combat. Ce systeme est construit sur l'architecture ECS (Entity Component System) et s'integre au systeme de Stats d'Entite.

## Apercu

Le systeme de degats comprend plusieurs composants cles :

- **Damage** - La classe d'evenement principale representant les degats infliges
- **DamageCause** - Definit le type/source de degats (ex: chute, noyade, commande)
- **DamageCalculator** - Calcule les montants de degats avec modificateurs
- **DamageClass** - Categorise les types de degats pour les modificateurs d'equipement
- **DamageEffects** - Effets visuels et audio declenches par les degats
- **Knockback** - Force appliquee aux entites lorsqu'elles subissent des degats

## DamageModule

Le `DamageModule` est le plugin principal qui gere le systeme de degats :

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class DamageModule extends JavaPlugin {
    public static final PluginManifest MANIFEST = PluginManifest.corePlugin(DamageModule.class)
        .depends(EntityModule.class)
        .depends(EntityStatsModule.class)
        .depends(EntityUIModule.class)
        .build();

    // Obtenir l'instance singleton
    public static DamageModule get();

    // Groupes de systemes pour le pipeline de traitement des degats
    public SystemGroup<EntityStore> getGatherDamageGroup();
    public SystemGroup<EntityStore> getFilterDamageGroup();
    public SystemGroup<EntityStore> getInspectDamageGroup();
}
```

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageModule`

## Classe Damage

La classe `Damage` represente un evenement de degats qui peut etre applique aux entites :

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class Damage extends CancellableEcsEvent implements IMetaStore<Damage> {
    // Creer des degats avec une source, une cause et un montant
    public Damage(Damage.Source source, DamageCause damageCause, float amount);
    public Damage(Damage.Source source, int damageCauseIndex, float amount);

    // Obtenir/definir le montant des degats
    public float getAmount();
    public void setAmount(float amount);
    public float getInitialAmount();

    // Obtenir/definir la cause des degats
    public int getDamageCauseIndex();
    public void setDamageCauseIndex(int damageCauseIndex);
    public DamageCause getCause();

    // Obtenir/definir la source des degats
    public Damage.Source getSource();
    public void setSource(Damage.Source source);

    // Obtenir le message de mort pour ces degats
    public Message getDeathMessage(Ref<EntityStore> targetRef, ComponentAccessor<EntityStore> componentAccessor);
}
```

### Cles Meta de Damage

La classe `Damage` fournit plusieurs cles de metadonnees pour des informations supplementaires :

| Cle Meta | Type | Description |
|----------|------|-------------|
| `HIT_LOCATION` | `Vector4d` | La position monde ou le coup a eu lieu |
| `HIT_ANGLE` | `Float` | L'angle du coup en degres |
| `IMPACT_PARTICLES` | `Damage.Particles` | Particules a generer a l'impact |
| `IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Son a jouer a l'impact |
| `PLAYER_IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Son a jouer pour le joueur blesse |
| `CAMERA_EFFECT` | `Damage.CameraEffect` | Effet de tremblement de camera |
| `DEATH_ICON` | `String` | Icone a afficher dans le fil des morts |
| `BLOCKED` | `Boolean` | Si les degats ont ete bloques |
| `STAMINA_DRAIN_MULTIPLIER` | `Float` | Multiplicateur de drain d'endurance lors du blocage |
| `CAN_BE_PREDICTED` | `Boolean` | Si les degats peuvent etre predits cote client |
| `KNOCKBACK_COMPONENT` | `KnockbackComponent` | Recul a appliquer |

### Sources de Degats

Differents types de sources indiquent l'origine des degats :

```java
// Source nulle/inconnue
public static final Damage.Source NULL_SOURCE;

// Degats d'une entite (joueur, PNJ, etc.)
public class EntitySource implements Damage.Source {
    public EntitySource(Ref<EntityStore> sourceRef);
    public Ref<EntityStore> getRef();
}

// Degats d'un projectile avec un tireur
public class ProjectileSource extends EntitySource {
    public ProjectileSource(Ref<EntityStore> shooter, Ref<EntityStore> projectile);
    public Ref<EntityStore> getProjectile();
}

// Degats d'une commande
public class CommandSource implements Damage.Source {
    public CommandSource(CommandSender commandSender, AbstractCommand cmd);
    public CommandSource(CommandSender commandSender, String commandName);
}

// Degats environnementaux
public class EnvironmentSource implements Damage.Source {
    public EnvironmentSource(String type);
    public String getType();
}
```

## DamageCause

`DamageCause` definit le type de degats infliges. Hytale inclut plusieurs causes de degats integrees :

| Cause | Description | Constante |
|-------|-------------|-----------|
| `Command` | Degats des commandes | `DamageCause.COMMAND` |
| `Drowning` | Suffocation sous l'eau | `DamageCause.DROWNING` |
| `Fall` | Degats de chute | `DamageCause.FALL` |
| `OutOfWorld` | Sous les limites du monde | `DamageCause.OUT_OF_WORLD` |
| `Suffocation` | Coince dans des blocs | `DamageCause.SUFFOCATION` |

```java
package com.hypixel.hytale.server.core.modules.entity.damage;

public class DamageCause {
    // Causes de degats integrees (initialisees au runtime)
    public static DamageCause COMMAND;
    public static DamageCause DROWNING;
    public static DamageCause FALL;
    public static DamageCause OUT_OF_WORLD;
    public static DamageCause SUFFOCATION;

    // Obtenir la cause de degats par ID
    public static IndexedLookupTableAssetMap<String, DamageCause> getAssetMap();

    // Proprietes
    public String getId();
    public String getInherits();           // Cause parente pour l'heritage de resistance
    public boolean doesBypassResistances(); // Si ces degats ignorent l'armure
    public boolean isDurabilityLoss();      // Si cela cause une perte de durabilite
}
```

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageCause`

## DamageClass

`DamageClass` categorise les degats pour les modificateurs d'equipement :

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public enum DamageClass {
    UNKNOWN,    // Classe de degats par defaut/inconnue
    LIGHT,      // Degats d'attaque legere
    CHARGED,    // Degats d'attaque chargee/lourde
    SIGNATURE;  // Degats de capacite signature
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass`

## DamageCalculator

Le `DamageCalculator` calcule les valeurs de degats avec divers modificateurs :

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public class DamageCalculator {
    // Calculer les degats pour une duree donnee
    public Object2FloatMap<DamageCause> calculateDamage(double durationSeconds);

    // Proprietes
    public Type getType();                    // DPS ou ABSOLUTE
    public DamageClass getDamageClass();      // Classification des degats
    public float getSequentialModifierStep(); // Reduction de degats par coup consecutif
    public float getSequentialModifierMinimum(); // Multiplicateur de degats minimum

    public enum Type {
        DPS,      // Degats par seconde (mis a l'echelle par la duree)
        ABSOLUTE  // Montant de degats fixe
    }
}
```

### Configuration du DamageCalculator

En configuration JSON, un DamageCalculator ressemble a :

```json
{
    "Type": "ABSOLUTE",
    "Class": "LIGHT",
    "BaseDamage": {
        "Physical": 10.0,
        "Fire": 5.0
    },
    "SequentialModifierStep": 0.1,
    "SequentialModifierMinimum": 0.5,
    "RandomPercentageModifier": 0.1
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageCalculator`

## Systeme de Recul (Knockback)

Le systeme de recul applique des forces aux entites lorsqu'elles subissent des degats.

### KnockbackComponent

```java
package com.hypixel.hytale.server.core.entity.knockback;

public class KnockbackComponent implements Component<EntityStore> {
    public static ComponentType<EntityStore, KnockbackComponent> getComponentType();

    // Velocite a appliquer
    public Vector3d getVelocity();
    public void setVelocity(Vector3d velocity);

    // Comment la velocite est appliquee (Add ou Set)
    public ChangeVelocityType getVelocityType();
    public void setVelocityType(ChangeVelocityType velocityType);

    // Configuration de velocite optionnelle
    public VelocityConfig getVelocityConfig();
    public void setVelocityConfig(VelocityConfig velocityConfig);

    // Modificateurs (multiplicateurs appliques a la velocite)
    public void addModifier(double modifier);
    public void applyModifiers();

    // Duree pour le recul continu
    public float getDuration();
    public void setDuration(float duration);
    public float getTimer();
    public void incrementTimer(float time);
}
```

**Source:** `com.hypixel.hytale.server.core.entity.knockback.KnockbackComponent`

### Types de Recul

Hytale fournit plusieurs methodes de calcul de recul :

#### Knockback de Base

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public abstract class Knockback {
    protected float force;                    // Magnitude de la force de recul
    protected float duration;                 // Duree pour le recul continu
    protected ChangeVelocityType velocityType; // Ajouter ou Definir la velocite

    public abstract Vector3d calculateVector(Vector3d source, float yaw, Vector3d target);
}
```

#### DirectionalKnockback

Applique un recul loin de l'attaquant avec des decalages relatifs optionnels :

```java
public class DirectionalKnockback extends Knockback {
    protected float relativeX;   // Decalage X relatif a la direction de l'attaquant
    protected float velocityY;   // Velocite verticale
    protected float relativeZ;   // Decalage Z relatif a la direction de l'attaquant

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Calcule la direction de la source vers la cible, normalisee
        // Applique les decalages relatifs tournes par yaw
        // Retourne (direction.x * force, velocityY, direction.z * force)
    }
}
```

#### ForceKnockback

Applique un recul dans une direction fixe relative a l'attaquant :

```java
public class ForceKnockback extends Knockback {
    private Vector3d direction = Vector3d.UP;  // Direction (normalisee)

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Retourne la direction tournee par yaw, mise a l'echelle par force
    }
}
```

#### PointKnockback

Applique un recul depuis un point specifique avec des decalages :

```java
public class PointKnockback extends Knockback {
    protected float velocityY;   // Velocite verticale
    protected int rotateY;       // Decalage de rotation Y
    protected int offsetX;       // Decalage X depuis la source
    protected int offsetZ;       // Decalage Z depuis la source

    @Override
    public Vector3d calculateVector(Vector3d source, float yaw, Vector3d target) {
        // Cree un recul depuis le point de decalage vers la cible
    }
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.Knockback`

## DamageEffects

`DamageEffects` definit les retours visuels et audio lorsque des degats surviennent :

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat;

public class DamageEffects {
    protected ModelParticle[] modelParticles;      // Particules attachees au modele
    protected WorldParticle[] worldParticles;      // Particules dans l'espace monde
    protected String localSoundEventId;            // Son 2D pour l'attaquant
    protected String worldSoundEventId;            // Son 3D monde
    protected String playerSoundEventId;           // Son pour le joueur blesse
    protected double viewDistance = 75.0;          // Portee de visibilite des effets
    protected Knockback knockback;                  // Configuration du recul
    protected String cameraEffectId;               // Effet de tremblement de camera
    protected float staminaDrainMultiplier = 1.0F; // Modificateur de drain d'endurance

    // Appliquer les effets a un evenement de degats
    public void addToDamage(Damage damageEvent);

    // Generer les effets a la position de l'entite
    public void spawnAtEntity(CommandBuffer<EntityStore> commandBuffer, Ref<EntityStore> ref);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects`

## Application de Degats via Plugins

### Application Basique de Degats

```java
import com.hypixel.hytale.server.core.modules.entity.damage.Damage;
import com.hypixel.hytale.server.core.modules.entity.damage.DamageCause;
import com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems;

public class DamagePlugin extends JavaPlugin {

    public DamagePlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    // Appliquer des degats a une entite
    public void damageEntity(Ref<EntityStore> targetRef, Store<EntityStore> store, float amount) {
        // Creer des degats avec une source commande
        Damage damage = new Damage(Damage.NULL_SOURCE, DamageCause.COMMAND, amount);

        // Executer les degats
        DamageSystems.executeDamage(targetRef, store, damage);
    }

    // Appliquer des degats d'une entite a une autre
    public void entityDamageEntity(
        Ref<EntityStore> attackerRef,
        Ref<EntityStore> targetRef,
        CommandBuffer<EntityStore> commandBuffer,
        float amount
    ) {
        // Creer une source entite
        Damage.EntitySource source = new Damage.EntitySource(attackerRef);

        // Creer l'evenement de degats
        Damage damage = new Damage(source, DamageCause.COMMAND, amount);

        // Executer les degats
        DamageSystems.executeDamage(targetRef, commandBuffer, damage);
    }
}
```

### Degats avec Recul

```java
public void damageWithKnockback(
    Ref<EntityStore> attackerRef,
    Ref<EntityStore> targetRef,
    CommandBuffer<EntityStore> commandBuffer,
    float damageAmount,
    Vector3d knockbackVelocity
) {
    // Creer ou obtenir le composant de recul
    KnockbackComponent knockback = commandBuffer.getComponent(targetRef, KnockbackComponent.getComponentType());
    if (knockback == null) {
        knockback = new KnockbackComponent();
        commandBuffer.putComponent(targetRef, KnockbackComponent.getComponentType(), knockback);
    }

    // Configurer le recul
    knockback.setVelocity(knockbackVelocity);
    knockback.setVelocityType(ChangeVelocityType.Add);
    knockback.setDuration(0.0f);  // Recul instantane

    // Creer les degats
    Damage.EntitySource source = new Damage.EntitySource(attackerRef);
    Damage damage = new Damage(source, DamageCause.COMMAND, damageAmount);

    // Attacher le recul aux degats
    damage.putMetaObject(Damage.KNOCKBACK_COMPONENT, knockback);

    // Executer
    DamageSystems.executeDamage(targetRef, commandBuffer, damage);
}
```

### Degats avec Effets

```java
public void damageWithEffects(
    Ref<EntityStore> targetRef,
    CommandBuffer<EntityStore> commandBuffer,
    float amount,
    Vector4d hitLocation
) {
    Damage damage = new Damage(Damage.NULL_SOURCE, DamageCause.COMMAND, amount);

    // Ajouter la position de coup pour les effets de particules
    damage.putMetaObject(Damage.HIT_LOCATION, hitLocation);

    // Ajouter un effet sonore
    int soundIndex = SoundEvent.getAssetMap().getIndex("my_hit_sound");
    damage.putMetaObject(Damage.IMPACT_SOUND_EFFECT, new Damage.SoundEffect(soundIndex));

    // Executer
    DamageSystems.executeDamage(targetRef, commandBuffer, damage);
}
```

### Creation de Causes de Degats Personnalisees

Les causes de degats personnalisees sont definies dans des fichiers d'assets JSON et chargees au runtime :

```json
{
    "Id": "MyCustomDamage",
    "DamageTextColor": "#FF0000",
    "BypassResistances": false,
    "DurabilityLoss": true,
    "Inherits": "Physical"
}
```

Puis accedez-y dans le code :

```java
DamageCause customCause = DamageCause.getAssetMap().getAsset("MyCustomDamage");
int customCauseIndex = DamageCause.getAssetMap().getIndex("MyCustomDamage");

Damage damage = new Damage(Damage.NULL_SOURCE, customCause, 50.0f);
// ou
Damage damage = new Damage(Damage.NULL_SOURCE, customCauseIndex, 50.0f);
```

## Pipeline de Traitement des Degats

Le systeme de degats traite les degats a travers trois groupes de systemes :

1. **GatherDamageGroup** - Collecte et genere les evenements de degats
   - Calcul des degats de chute
   - Degats de noyade/suffocation
   - Degats hors du monde

2. **FilterDamageGroup** - Filtre et modifie les degats
   - Reduction de degats par l'armure
   - Reduction de degats par le blocage (Wielding)
   - Reduction du recul
   - Verifications d'invulnerabilite
   - Filtres PvP et configuration du monde

3. **InspectDamageGroup** - Reagit aux degats finalises
   - Appliquer les degats a la sante
   - Jouer les particules et sons
   - Appliquer le recul
   - Enregistrer les stats de combat
   - Mises a jour de l'interface

## Commandes Console

### Commande Damage

| Commande | Description |
|----------|-------------|
| `/damage [montant] [-silent]` | Se blesser soi-meme |
| `/damage <joueur> [montant] [-silent]` | Blesser un autre joueur |
| `/hurt` | Alias pour `/damage` |

Exemple :
```
/damage player123 50
/damage 25 -silent
```

## DamageSystems

La classe `DamageSystems` contient tous les systemes ECS lies aux degats :

| Systeme | Groupe | Description |
|---------|--------|-------------|
| `ApplyDamage` | Inspect | Applique les degats a la sante de l'entite |
| `CanBreathe` | Gather | Degats de noyade/suffocation |
| `OutOfWorldDamage` | Gather | Degats sous le monde |
| `FallDamagePlayers` | Gather | Degats de chute des joueurs |
| `FallDamageNPCs` | Gather | Degats de chute des PNJ |
| `FilterPlayerWorldConfig` | Filter | Parametres PvP du monde |
| `FilterNPCWorldConfig` | Filter | Parametres de degats PNJ |
| `FilterUnkillable` | Filter | Verification d'invulnerabilite |
| `ArmorDamageReduction` | Filter | Resistance de l'armure |
| `WieldingDamageReduction` | Filter | Reduction par blocage/bouclier |
| `ArmorKnockbackReduction` | Filter | Resistance au recul |
| `WieldingKnockbackReduction` | Filter | Reduction de recul par blocage |
| `ApplyParticles` | Inspect | Generer les particules de coup |
| `ApplySoundEffects` | Inspect | Jouer les sons de coup |
| `HitAnimation` | Inspect | Jouer l'animation de blessure |
| `PlayerHitIndicators` | Inspect | Afficher les indicateurs de degats |
| `RecordLastCombat` | Inspect | Suivre les horodatages de combat |
| `DamageArmor` | Inspect | Reduire la durabilite de l'armure |
| `DamageStamina` | Inspect | Drainer l'endurance lors du blocage |
| `DamageAttackerTool` | Inspect | Reduire la durabilite de l'arme |

**Source:** `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems`

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `DamageModule` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageModule` |
| `Damage` | `com.hypixel.hytale.server.core.modules.entity.damage.Damage` |
| `DamageCause` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageCause` |
| `DamageSystems` | `com.hypixel.hytale.server.core.modules.entity.damage.DamageSystems` |
| `DamageCalculator` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageCalculator` |
| `DamageClass` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass` |
| `DamageEffects` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageEffects` |
| `Knockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.Knockback` |
| `DirectionalKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DirectionalKnockback` |
| `ForceKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.ForceKnockback` |
| `PointKnockback` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.PointKnockback` |
| `KnockbackComponent` | `com.hypixel.hytale.server.core.entity.knockback.KnockbackComponent` |
| `KnockbackSystems` | `com.hypixel.hytale.server.core.entity.knockback.KnockbackSystems` |
| `DamageEntityInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.DamageEntityInteraction` |
| `DamageCommand` | `com.hypixel.hytale.server.core.command.commands.player.DamageCommand` |
