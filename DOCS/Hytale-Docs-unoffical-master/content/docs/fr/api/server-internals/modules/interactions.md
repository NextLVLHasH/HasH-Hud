---
id: interactions
title: Systeme d'Interactions
sidebar_label: Interactions
sidebar_position: 7
description: Documentation complete du systeme d'interactions Hytale pour les objets, blocs, entites et interactions personnalisees
---

# Systeme d'Interactions

Le Systeme d'Interactions dans Hytale fournit un framework puissant pour definir comment les joueurs interagissent avec les objets, blocs et entites. Ce systeme est construit sur une architecture en chaine ou les interactions peuvent etre sequencees, conditionnees et composees ensemble.

## Vue d'ensemble

Le systeme d'interactions est gere par l'`InteractionModule`, un plugin central qui gere :
- Les evenements de bouton souris (clic gauche/droit)
- Les interactions de blocs (casser, placer, utiliser)
- Les interactions d'entites (utiliser, endommager)
- Les interactions d'objets (equiper, consommer, charger)
- Le lancement de projectiles
- L'application de forces et mouvements

**Source:** `com.hypixel.hytale.server.core.modules.interaction.InteractionModule`

## Types d'Interactions

Hytale definit plusieurs types d'interactions qui determinent comment et quand les interactions sont declenchees :

| Type | Description |
|------|-------------|
| `Primary` | Action du bouton gauche de la souris |
| `Secondary` | Action du bouton droit de la souris |
| `Use` | Action d'utilisation contextuelle |
| `Scroll` | Action de la molette de la souris |

## Classes d'Interactions Principales

### Classe Interaction de Base

Toutes les interactions heritent de la classe de base `Interaction` :

```java
public abstract class Interaction {
    String id;                    // Identifiant unique
    float runTime;               // Duree de l'interaction
    InteractionEffects effects;  // Effets visuels/audio
    InteractionRules rules;      // Regles de blocage/interruption

    // Methodes principales
    protected abstract void tick0(boolean firstRun, float time,
        InteractionType type, InteractionContext context,
        CooldownHandler cooldownHandler);

    public WaitForDataFrom getWaitForDataFrom();
    public void compile(OperationsBuilder builder);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.Interaction`

### SimpleInteraction

Une interaction basique qui peut enchainer vers des interactions suivantes/echouees :

```java
public class SimpleInteraction extends Interaction {
    String next;    // Interaction a executer en cas de succes
    String failed;  // Interaction a executer en cas d'echec
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.SimpleInteraction`

## Interactions de Blocs

### BreakBlockInteraction

Tente de casser le bloc cible :

```java
public class BreakBlockInteraction extends SimpleBlockInteraction {
    boolean harvest;      // Recolter vs casser
    String toolId;        // Type d'outil pour casser
    boolean matchTool;    // Exiger un outil correspondant
}
```

**Proprietes de Configuration :**
- `Harvest` - Si cela declenche une recolte vs un cassage
- `Tool` - Outil avec lequel casser
- `MatchTool` - Si un outil correspondant a `Tool` est requis

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.BreakBlockInteraction`

### PlaceBlockInteraction

Place le bloc actuel ou specifie :

```java
public class PlaceBlockInteraction extends SimpleInteraction {
    String blockTypeKey;           // Type de bloc a placer (override)
    boolean removeItemInHand;      // Retirer l'objet apres placement (defaut: true)
    boolean allowDragPlacement;    // Permettre le placement par glissement (defaut: true)
}
```

**Proprietes de Configuration :**
- `BlockTypeToPlace` - Remplace le type de bloc de l'objet tenu
- `RemoveItemInHand` - Si l'objet doit etre retire de la main de l'entite
- `AllowDragPlacement` - Si le placement par glissement est utilise quand le clic est maintenu

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.PlaceBlockInteraction`

### UseBlockInteraction

Tente d'utiliser le bloc cible en executant ses interactions :

```java
public class UseBlockInteraction extends SimpleBlockInteraction {
    // Execute les interactions enregistrees du bloc
}
```

Cette interaction recherche les interactions enregistrees du type de bloc et les execute, declenchant les evenements `UseBlockEvent.Pre` et `UseBlockEvent.Post`.

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.UseBlockInteraction`

### DoorInteraction

Ouvre/ferme les blocs de porte avec support intelligent des doubles portes :

```java
public class DoorInteraction extends SimpleBlockInteraction {
    boolean horizontal;  // Horizontal (portails) vs vertical (portes normales)
}
```

**Etats de Porte :**
- `CLOSED` - Porte fermee
- `OPENED_IN` - Porte ouverte vers l'interieur
- `OPENED_OUT` - Porte ouverte vers l'exterieur

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.DoorInteraction`

## Interactions d'Entites

### UseEntityInteraction

Tente d'utiliser l'entite cible :

```java
public class UseEntityInteraction extends SimpleInstantInteraction {
    // Recherche le composant Interactions de l'entite
    // Execute le type d'interaction correspondant
}
```

Cette interaction recupere le composant `Interactions` de l'entite cible et execute l'interaction appropriee.

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.UseEntityInteraction`

## Interactions de Combat

### ChargingInteraction

Une interaction qui charge pendant que la touche est maintenue :

```java
public class ChargingInteraction extends Interaction {
    boolean allowIndefiniteHold;              // Permettre maintien indefini
    boolean displayProgress;                  // Afficher progression (defaut: true)
    boolean cancelOnOtherClick;              // Annuler sur autre entree (defaut: true)
    boolean failOnDamage;                    // Annuler si blesse
    Float2ObjectMap<String> next;            // Carte temps de charge vers interaction
    Map<InteractionType, String> forks;      // Interactions fork pendant charge
    ChargingDelay chargingDelay;             // Configuration de delai sur degats
    float mouseSensitivityAdjustmentTarget;  // Modificateur de sensibilite souris
}
```

**Configuration de ChargingDelay :**
```java
public class ChargingDelay {
    float minDelay;       // Plus petit delai applique
    float maxDelay;       // Plus grand delai applique
    float maxTotalDelay;  // Delai total max avant ignore
    float minHealth;      // Seuil de sante pour delai
    float maxHealth;      // Seuil de sante pour delai max
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ChargingInteraction`

### ChainingInteraction

Execute differentes interactions basees sur le compteur de chaine :

```java
public class ChainingInteraction extends Interaction {
    String chainId;              // Identifiant de chaine optionnel
    float chainingAllowance;     // Fenetre de temps pour chaine (secondes)
    String[] next;               // Sequence d'interactions de chaine
    Map<String, String> flags;   // Interactions basees sur flags
}
```

Cela permet des systemes de combo ou des actions repetees dans une fenetre de temps progressent a travers une sequence.

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ChainingInteraction`

### LaunchProjectileInteraction

Lance un projectile :

```java
@Deprecated(forRemoval = true)
public class LaunchProjectileInteraction extends SimpleInstantInteraction
    implements BallisticDataProvider {
    String projectileId;  // ID du projectile a lancer
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.LaunchProjectileInteraction`

## Interactions de Mouvement

### ApplyForceInteraction

Applique une force a l'utilisateur avec verification de conditions :

```java
public class ApplyForceInteraction extends SimpleInteraction {
    ChangeVelocityType changeVelocityType;  // Definir ou Ajouter velocite
    Force[] forces;                          // Forces a appliquer
    float duration;                          // Duree d'application de la force
    boolean waitForGround;                   // Attendre contact au sol
    boolean waitForCollision;                // Attendre collision
    float groundCheckDelay;                  // Delai avant verification sol
    float collisionCheckDelay;               // Delai avant verification collision
    float raycastDistance;                   // Distance raycast collision
    RaycastMode raycastMode;                 // Mode de direction raycast
    FloatRange verticalClamp;                // Clamp d'angle vertical
    String groundInteraction;                // Executer au contact du sol
    String collisionInteraction;             // Executer a la collision
}
```

**Configuration de Force :**
```java
public class Force {
    Vector3d direction;      // Direction de la force (normalisee)
    boolean adjustVertical;  // Ajuster selon angle de regard
    double force;           // Magnitude de la force
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ApplyForceInteraction`

## Interactions d'Objets

### EquipItemInteraction

Equipe l'objet tenu :

```java
public class EquipItemInteraction extends SimpleInstantInteraction {
    // Deplace l'objet de la main vers l'emplacement d'armure approprie
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.EquipItemInteraction`

### ApplyEffectInteraction

Applique un effet d'entite :

```java
public class ApplyEffectInteraction extends SimpleInstantInteraction {
    String effectId;              // Effet a appliquer
    InteractionTarget entityTarget;  // Cible (USER, OWNER, TARGET)
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.simple.ApplyEffectInteraction`

## Interactions de Conteneurs

### OpenContainerInteraction

Ouvre l'inventaire d'un bloc conteneur :

```java
public class OpenContainerInteraction extends SimpleBlockInteraction {
    // Ouvre l'UI du conteneur pour les blocs ItemContainerState
    // Gere les fenetres et evenements sonores
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.OpenContainerInteraction`

## Interactions de Prefabs

### SpawnPrefabInteraction

Fait apparaitre un prefab a un emplacement :

```java
public class SpawnPrefabInteraction extends SimpleInstantInteraction {
    String prefabPath;       // Chemin vers le fichier prefab
    Vector3i offset;         // Decalage de position
    Rotation rotationYaw;    // Rotation yaw
    OriginSource originSource;  // Origine ENTITY ou BLOCK
    boolean force;           // Forcer le placement
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.SpawnPrefabInteraction`

## Systeme de Priorite d'Interaction

Le systeme de priorite determine quelle interaction a la preseance quand plusieurs objets sont equipes :

```java
public record InteractionPriority(Map<PrioritySlot, Integer> values) {
    public int getPriority(PrioritySlot slot) {
        // Retourne la priorite pour le slot, avec fallback sur Default
    }
}
```

**InteractionConfiguration :**
```java
public class InteractionConfiguration {
    boolean displayOutlines;           // Afficher les contours d'interaction
    boolean debugOutlines;             // Afficher les contours de debug
    Object2FloatMap<GameMode> useDistance;  // Distance d'utilisation par mode de jeu
    boolean allEntities;               // Cibler toutes les entites
    Map<InteractionType, InteractionPriority> priorities;  // Config de priorite
}
```

Distances d'utilisation par defaut :
- Mode `Adventure` : 5.0 blocs
- Mode `Creative` : 6.0 blocs

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionConfiguration`

## Regles d'Interaction

Les regles controlent comment les interactions se bloquent ou s'interrompent mutuellement :

```java
public class InteractionRules {
    Set<InteractionType> blockedBy;     // Types qui bloquent celle-ci
    Set<InteractionType> blocking;      // Types que celle-ci bloque
    Set<InteractionType> interruptedBy; // Types qui interrompent celle-ci
    Set<InteractionType> interrupting;  // Types que celle-ci interrompt

    // Tags de contournement pour chaque regle
    String blockedByBypass;
    String blockingBypass;
    String interruptedByBypass;
    String interruptingBypass;
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionRules`

## Effets d'Interaction

Effets visuels et audio pour les interactions :

```java
public class InteractionEffects {
    ModelParticle[] particles;              // Particules a generer
    ModelParticle[] firstPersonParticles;   // Particules premiere personne
    String worldSoundEventId;               // Son 3D dans le monde
    String localSoundEventId;               // Son local pour le joueur
    ModelTrail[] trails;                    // Trainees d'armes
    boolean waitForAnimationToFinish;       // Attendre fin d'animation
    String itemPlayerAnimationsId;          // ID du set d'animations
    String itemAnimationId;                 // Animation specifique
    boolean clearAnimationOnFinish;         // Effacer animation apres
    boolean clearSoundEventOnFinish;        // Effacer son apres
    String cameraEffectId;                  // Tremblement/effets camera
    MovementEffects movementEffects;        // Modifications de mouvement
    float startDelay;                       // Delai de debut d'effet
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionEffects`

## Cible d'Interaction

Specifie quelle entite une interaction cible :

```java
public enum InteractionTarget {
    USER,   // Entite qui a declenche l'interaction
    OWNER,  // Entite qui possede la chaine d'interaction
    TARGET  // Entite cible de l'interaction
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.interaction.util.InteractionTarget`

## Composant Interactions

Les entites peuvent avoir des interactions definies via le composant `Interactions` :

```java
public class Interactions implements Component<EntityStore> {
    Map<InteractionType, String> interactions;  // Type vers ID d'interaction
    String interactionHint;                     // Texte d'indication UI

    public String getInteractionId(InteractionType type);
    public void setInteractionId(InteractionType type, String interactionId);
}
```

**Source:** `com.hypixel.hytale.server.core.modules.interaction.Interactions`

## Commandes Console

Hytale fournit des commandes console pour gerer les interactions :

| Commande | Description |
|----------|-------------|
| `/interaction run <interactionId>` | Executer une interaction specifique |
| `/interaction clear` | Effacer les interactions en cours |

**Source:** `com.hypixel.hytale.server.core.modules.interaction.commands.InteractionCommand`

## Exemple de Plugin

Voici un exemple complet de creation d'un gestionnaire d'interactions personnalise dans un plugin :

```java
public class InteractionPlugin extends JavaPlugin {

    public InteractionPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // S'enregistrer pour les evenements d'utilisation de bloc
        getEventRegistry().register(UseBlockEvent.Pre.class, this::onUseBlockPre);
        getEventRegistry().register(UseBlockEvent.Post.class, this::onUseBlockPost);
    }

    private void onUseBlockPre(UseBlockEvent.Pre event) {
        InteractionContext context = event.getContext();
        BlockType blockType = event.getBlockType();
        Vector3i position = event.getPosition();

        getLogger().info("Joueur tentant d'utiliser bloc: " + blockType.getId()
            + " a " + position);

        // Annuler l'interaction si necessaire
        if (shouldCancel(blockType)) {
            event.setCancelled(true);
        }
    }

    private void onUseBlockPost(UseBlockEvent.Post event) {
        getLogger().info("Utilisation du bloc terminee pour: " + event.getBlockType().getId());
    }

    private boolean shouldCancel(BlockType blockType) {
        // Logique personnalisee pour determiner si l'interaction doit etre annulee
        return false;
    }
}
```

## Travailler avec les Interactions d'Entites

Pour configurer des interactions sur une entite :

```java
public void setupEntityInteractions(Ref<EntityStore> entityRef,
    CommandBuffer<EntityStore> commandBuffer) {

    // Obtenir ou creer le composant Interactions
    Interactions interactions = commandBuffer.getComponent(
        entityRef,
        Interactions.getComponentType()
    );

    if (interactions == null) {
        interactions = new Interactions();
        commandBuffer.putComponent(entityRef, Interactions.getComponentType(), interactions);
    }

    // Definir l'interaction pour le type "Use"
    interactions.setInteractionId(InteractionType.Use, "my_custom_interaction");

    // Definir l'indication d'interaction pour l'UI
    interactions.setInteractionHint("Appuyez sur E pour interagir");
}
```

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `InteractionModule` | `com.hypixel.hytale.server.core.modules.interaction.InteractionModule` |
| `Interaction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.Interaction` |
| `SimpleInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.SimpleInteraction` |
| `BreakBlockInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.BreakBlockInteraction` |
| `PlaceBlockInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.PlaceBlockInteraction` |
| `UseBlockInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.UseBlockInteraction` |
| `UseEntityInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.UseEntityInteraction` |
| `ChargingInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ChargingInteraction` |
| `ChainingInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ChainingInteraction` |
| `ApplyForceInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.client.ApplyForceInteraction` |
| `ApplyEffectInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.simple.ApplyEffectInteraction` |
| `EquipItemInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.EquipItemInteraction` |
| `LaunchProjectileInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.LaunchProjectileInteraction` |
| `SpawnPrefabInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.SpawnPrefabInteraction` |
| `OpenContainerInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.OpenContainerInteraction` |
| `DoorInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.DoorInteraction` |
| `InteractionConfiguration` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionConfiguration` |
| `InteractionPriority` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionPriority` |
| `InteractionRules` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionRules` |
| `InteractionEffects` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.InteractionEffects` |
| `InteractionTarget` | `com.hypixel.hytale.server.core.modules.interaction.interaction.util.InteractionTarget` |
| `Interactions` | `com.hypixel.hytale.server.core.modules.interaction.Interactions` |
