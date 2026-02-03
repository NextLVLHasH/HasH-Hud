---
id: npc-system
title: Systeme NPC et IA
sidebar_label: Systeme NPC et IA
sidebar_position: 16
description: Documentation complete du systeme NPC de Hytale incluant les comportements IA, la recherche de chemin, les actions, les capteurs et les machines a etats
---

# Systeme NPC et IA

Le systeme NPC (Personnage Non-Joueur) et IA de Hytale fournit un cadre complet base sur les comportements pour creer des entites intelligentes. Ce systeme utilise une architecture de machine a etats hierarchique combinee avec des capteurs, des actions et des mouvements pour controler le comportement des NPC.

## Vue d'ensemble

Le systeme NPC comprend plusieurs composants cles :

- **NPCPlugin** - Le plugin principal gerant toutes les fonctionnalites NPC
- **Role** - Definit le comportement, les etats et les capacites du NPC
- **NPCEntity** - Le composant d'entite qui relie une entite a son role
- **Sensors (Capteurs)** - Detectent les conditions et fournissent des informations
- **Actions** - Executent des comportements et des changements d'etat
- **Motions (Mouvements)** - Controlent le mouvement du corps et de la tete
- **Machine a etats** - Gere les transitions d'etat du NPC
- **Pathfinding** - Systeme de navigation base sur A*

## NPCPlugin

Le `NPCPlugin` est le plugin principal qui gere le systeme NPC :

```java
package com.hypixel.hytale.server.npc;

public class NPCPlugin extends JavaPlugin {
    // Obtenir l'instance singleton
    public static NPCPlugin get();

    // Obtenir l'index du role NPC par nom
    public int getIndex(String roleName);

    // Obtenir le role NPC par index
    public Role getRole(int roleIndex);

    // Faire apparaitre une entite NPC
    @Nullable
    public Pair<Ref<EntityStore>, NPCEntity> spawnEntity(
        Store<EntityStore> store,
        int roleIndex,
        Vector3d position,
        Vector3f rotation,
        Model spawnModel,
        TriConsumer<NPCEntity, Ref<EntityStore>, Store<EntityStore>> postSpawn
    );

    // Obtenir la fabrique de constructeurs pour enregistrer des composants personnalises
    public BuilderFactory getBuilderFactory();
}
```

**Source :** `com.hypixel.hytale.server.npc.NPCPlugin`

## Composant NPCEntity

Le composant `NPCEntity` relie une entite a son role de comportement :

```java
package com.hypixel.hytale.server.npc.entities;

public class NPCEntity implements Component<EntityStore>, INonPlayerCharacter {
    // Obtenir le type de composant
    public static ComponentType<EntityStore, NPCEntity> getComponentType();

    // Obtenir le role actuel
    public Role getRole();
    public String getRoleName();

    // Obtenir les informations d'apparition
    public Instant getSpawnInstant();
    public void setSpawnInstant(Instant instant);

    // Gestion des etats
    public void setState(Ref<EntityStore> ref, String state, String subState, Store<EntityStore> store);
    public void onFlockSetState(Ref<EntityStore> ref, String state, String subState, Store<EntityStore> store);

    // Cycle de vie
    public void onSpawned(Ref<EntityStore> ref, Store<EntityStore> store);
    public void onRemove(Ref<EntityStore> ref, Store<EntityStore> store);

    // Mise a jour
    public void tick(Ref<EntityStore> ref, double dt, Store<EntityStore> store);
}
```

**Source :** `com.hypixel.hytale.server.npc.entities.NPCEntity`

## Systeme de Roles

Un **Role** definit le profil comportemental complet d'un NPC incluant les etats, les capteurs, les actions et les mouvements.

### Classe Role

```java
package com.hypixel.hytale.server.npc.role;

public class Role {
    // Obtenir le nom du role
    public String getName();

    // Obtenir le support d'etat pour les operations de machine a etats
    public StateSupport getStateSupport();

    // Obtenir le support monde pour les requetes environnementales
    public WorldSupport getWorldSupport();

    // Obtenir le support de navigation pour la recherche de chemin
    public NavigationSupport getNavigationSupport();

    // Obtenir le controleur de mouvement
    public MotionController getMotionController();

    // Obtenir les emplacements d'entites (suivi de cibles)
    public EntitySlots getEntitySlots();

    // Obtenir les minuteries pour les actions planifiees
    public Timers getTimers();

    // Obtenir le tableau noir pour le partage de donnees
    public Blackboard getBlackboard();
}
```

### Configuration JSON du Role

Les roles sont definis dans des fichiers JSON dans `NPC/Roles/` :

```json
{
    "Id": "Example_NPC",
    "Model": "npc/example_npc",
    "NPCGroups": ["Friendly", "Villager"],
    "StartState": "Idle",
    "StartSubState": "Default",
    "EntitySlots": {
        "Target": {
            "UpdateRate": 0.5,
            "Range": 20.0,
            "MaxCount": 1
        }
    },
    "MotionControllers": {
        "Walk": {
            "MaxSpeed": 4.0,
            "Acceleration": 20.0,
            "TurnSpeed": 180.0
        }
    },
    "States": {
        "Idle": {
            "SubStates": {
                "Default": {
                    "Instructions": [
                        {
                            "Sensors": ["SensorPlayerNearby"],
                            "Actions": ["ActionGreet"],
                            "BodyMotion": "BodyMotionIdle"
                        }
                    ]
                }
            }
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.role.Role`

## Machine a Etats

La machine a etats est centrale au comportement des NPC, gerant les etats et sous-etats.

### Classe StateSupport

```java
package com.hypixel.hytale.server.npc.role.support;

public class StateSupport {
    public static final int NO_STATE = Integer.MIN_VALUE;

    // Verifier l'etat actuel
    public boolean inState(int state);
    public boolean inSubState(int subState);
    public boolean inState(int state, int subState);
    public boolean inState(String state, String subState);

    // Obtenir les informations d'etat
    public String getStateName();
    public int getStateIndex();
    public int getSubStateIndex();

    // Definir l'etat
    public void setState(int state, int subState, boolean clearOnce, boolean skipTransition);
    public void setState(Ref<EntityStore> ref, String state, String subState, ComponentAccessor<EntityStore> accessor);
    public void setSubState(String subState);

    // Machines a etats locales aux composants
    public boolean isComponentInState(int componentIndex, int targetState);
    public void setComponentState(int componentIndex, int targetState);

    // Etats occupes (empeche les interactions)
    public boolean isInBusyState();

    // Transitions d'etat
    public StateTransitionController getStateTransitionController();
    public boolean runTransitionActions(Ref<EntityStore> ref, Role role, double dt, Store<EntityStore> store);
}
```

### Configuration des Etats

Les etats sont definis dans les roles :

```json
{
    "States": {
        "Idle": {
            "BusySubStates": ["Interacting"],
            "SubStates": {
                "Default": {
                    "Instructions": []
                },
                "Interacting": {
                    "Instructions": []
                }
            }
        },
        "Chase": {
            "SubStates": {
                "Default": {
                    "Instructions": []
                }
            }
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.role.support.StateSupport`

## Instructions

Les instructions definissent la logique comportementale au sein des etats. Chaque instruction combine capteurs, actions et mouvements.

### Classe Instruction

```java
package com.hypixel.hytale.server.npc.instructions;

public class Instruction {
    // Obtenir le capteur qui declenche cette instruction
    public Sensor getSensor();

    // Obtenir les actions a executer
    public ActionList getActions();

    // Obtenir le mouvement du corps
    public BodyMotion getBodyMotion();

    // Obtenir le mouvement de la tete
    public HeadMotion getHeadMotion();

    // Executer cette instruction
    public boolean evaluate(Ref<EntityStore> ref, Role role, double dt, Store<EntityStore> store);
}
```

### Configuration JSON des Instructions

```json
{
    "Instructions": [
        {
            "Sensors": {
                "Type": "And",
                "Sensors": [
                    {"Type": "Player", "Range": 10.0, "Slot": "Target"},
                    {"Type": "Timer", "Name": "GreetCooldown", "Condition": "Finished"}
                ]
            },
            "Actions": [
                {"Type": "State", "State": "Greeting", "SubState": "Default"},
                {"Type": "TimerStart", "Name": "GreetCooldown", "Duration": 30.0}
            ],
            "BodyMotion": {"Type": "Nothing"},
            "HeadMotion": {"Type": "Watch", "Slot": "Target"}
        }
    ]
}
```

**Source :** `com.hypixel.hytale.server.npc.instructions.Instruction`

## Capteurs (Sensors)

Les capteurs detectent les conditions et declenchent les instructions. Ils peuvent aussi fournir des informations aux actions et mouvements.

### Interface Sensor

```java
package com.hypixel.hytale.server.npc.instructions;

public interface Sensor {
    // Verifier si la condition du capteur est remplie
    boolean matches(Ref<EntityStore> ref, Role role, double dt, Store<EntityStore> store);

    // Obtenir les informations de ce capteur
    InfoProvider getSensorInfo();

    // S'enregistrer aupres des systemes de support du role
    void registerWithSupport(Role role);
}
```

### Types de Capteurs Principaux

| Type de Capteur | Description | Parametres Cles |
|-----------------|-------------|-----------------|
| `Entity` | Detecte les entites a portee | `Range`, `Slot`, `Attitudes`, `NPCGroups` |
| `Player` | Detecte specifiquement les joueurs | `Range`, `Slot`, `Attitudes` |
| `Target` | Verifie si l'emplacement cible est occupe | `Slot`, `Condition` |
| `State` | Verifie l'etat actuel | `State`, `SubState` |
| `Timer` | Verifie le statut du minuteur | `Name`, `Condition` |
| `Alarm` | Verifie le statut de l'alarme | `Name` |
| `Flag` | Verifie la valeur du drapeau | `Name`, `Value` |
| `Nav` | Verifie le statut de navigation | `Condition` (AtDestination, HasPath, etc.) |
| `OnGround` | Verifie si au sol | - |
| `InAir` | Verifie si en l'air | - |
| `InWater` | Verifie si dans l'eau | `MinDepth` |
| `Light` | Verifie le niveau de lumiere | `Type`, `Min`, `Max` |
| `Time` | Verifie l'heure du monde | `DayTimeRange`, `MoonPhaseRange` |
| `Block` | Detecte les blocs a portee | `Range`, `BlockSet`, `Direction` |
| `Damage` | Detecte les degats recus | `DamageSlot` |
| `HasInteracted` | Verifie l'interaction du joueur | - |
| `CanInteract` | Verifie la possibilite d'interaction | `ViewCone`, `Attitudes` |
| `Age` | Verifie l'age du NPC | `MinAge`, `MaxAge` |
| `Kill` | Detecte les eliminations d'entites | `Slot` |

### Capteurs Composites

| Type de Capteur | Description |
|-----------------|-------------|
| `And` | Tous les capteurs enfants doivent correspondre |
| `Or` | N'importe quel capteur enfant doit correspondre |
| `Not` | Inverse le resultat du capteur enfant |
| `Any` | Correspond a toute cible passant le filtre |
| `Many` | Correspond a plusieurs cibles |
| `Switch` | Evalue les capteurs dans l'ordre, utilise le premier correspondant |
| `Random` | Chance aleatoire de correspondre |

### Configuration du Capteur Entity

```json
{
    "Type": "Entity",
    "Range": 15.0,
    "Slot": "Target",
    "GetPlayers": true,
    "GetNPCs": true,
    "ExcludeOwnType": false,
    "Attitudes": ["Hostile"],
    "Filter": {
        "Type": "And",
        "Filters": [
            {"Type": "LineOfSight"},
            {"Type": "ViewSector", "Angle": 120}
        ]
    },
    "Prioritiser": {
        "Type": "Attitude",
        "Priority": ["Hostile", "Neutral"]
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.instructions.Sensor`

## Actions

Les actions executent des comportements et modifient l'etat du NPC.

### Interface Action

```java
package com.hypixel.hytale.server.npc.instructions;

public interface Action {
    // Executer cette action
    boolean execute(Ref<EntityStore> ref, Role role, InfoProvider sensorInfo, double dt, Store<EntityStore> store);

    // Appele quand l'action s'active
    default void activate(Ref<EntityStore> ref, Role role, ComponentAccessor<EntityStore> accessor) {}

    // Appele quand l'action se desactive
    default void deactivate(Ref<EntityStore> ref, Role role, ComponentAccessor<EntityStore> accessor) {}
}
```

### Types d'Actions Principaux

#### Actions de Machine a Etats

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `State` | Changer d'etat | `State`, `SubState`, `ClearOnce` |
| `ParentState` | Retourner a l'etat parent | - |
| `ToggleStateEvaluator` | Activer/desactiver l'evaluateur d'etat | `Enable` |

#### Actions de Minuterie

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `TimerStart` | Demarrer une minuterie | `Name`, `Duration`, `DurationRange` |
| `TimerStop` | Arreter une minuterie | `Name` |
| `TimerPause` | Mettre en pause une minuterie | `Name` |
| `TimerContinue` | Reprendre une minuterie | `Name` |
| `TimerRestart` | Redemarrer une minuterie | `Name` |
| `TimerModify` | Modifier la duree de la minuterie | `Name`, `Amount` |
| `SetAlarm` | Definir une alarme de temps de jeu | `Name`, `GameTime`, `RealTime` |

#### Actions d'Entite

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `SetMarkedTarget` | Marquer une cible | `Slot`, `SourceSlot` |
| `ReleaseTarget` | Vider l'emplacement cible | `Slot` |
| `Notify` | Envoyer une notification aux entites | `Slot`, `Notification`, `Range` |
| `Beacon` | Activer/desactiver une balise | `BeaconName`, `Active` |
| `SetStat` | Modifier une statistique d'entite | `Stat`, `Value`, `Operation` |
| `OverrideAttitude` | Remplacer l'attitude envers l'entite | `Slot`, `Attitude`, `Duration` |
| `IgnoreForAvoidance` | Ignorer l'entite pour l'evitement | `Slot`, `Duration` |

#### Actions de Cycle de Vie

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `Spawn` | Faire apparaitre un autre NPC | `Role`, `Position`, `Rotation` |
| `Despawn` | Faire disparaitre ce NPC | - |
| `DelayDespawn` | Planifier la disparition | `Delay` |
| `Die` | Declencher la mort | `DamageCause` |
| `Remove` | Supprimer l'entite immediatement | - |
| `Role` | Changer de role | `NewRole` |

#### Actions de Mouvement

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `Crouch` | Basculer l'accroupissement | `Crouch` |
| `RecomputePath` | Forcer le recalcul du chemin | - |
| `OverrideAltitude` | Remplacer l'altitude de vol | `Altitude`, `Duration` |

#### Actions du Monde

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `PlaceBlock` | Placer un bloc | `Block`, `Position` |
| `SetBlockToPlace` | Definir le bloc a placer | `Block` |
| `SetLeashPosition` | Definir l'ancre de laisse | `Position`, `Radius` |
| `StorePosition` | Stocker une position pour plus tard | `Name`, `Position` |
| `MakePath` | Creer une definition de chemin | `PathName`, `Waypoints` |
| `ResetPath` | Effacer le chemin actuel | - |
| `TriggerSpawners` | Declencher les generateurs proches | `Range` |

#### Actions d'Interaction

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `SetInteractable` | Definir l'etat d'interaction | `Interactable`, `Hint`, `ShowPrompt` |
| `LockOnInteractionTarget` | Verrouiller sur le joueur en interaction | - |

#### Actions d'Objets

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `Inventory` | Modifier l'inventaire | `Operation`, `Item`, `Slot` |
| `DropItem` | Lacher un objet | `Item`, `Slot`, `Velocity` |
| `PickUpItem` | Ramasser un objet | `Slot` |

#### Actions de Combat

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `Attack` | Effectuer une attaque | `Slot`, `DamageCalculator`, `Knockback` |
| `ApplyEntityEffect` | Appliquer un effet a l'entite | `Slot`, `Effect`, `Duration` |

#### Actions Audio/Visuelles

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `PlayAnimation` | Jouer une animation | `Animation`, `BlendTime` |
| `PlaySound` | Jouer un effet sonore | `Sound`, `Volume`, `Pitch` |
| `SpawnParticles` | Generer des particules | `Particle`, `Count`, `Position` |
| `DisplayName` | Definir le nom affiche | `Name`, `Visible` |
| `Appearance` | Changer l'apparence | `Model`, `Skin` |
| `ModelAttachment` | Attacher un modele | `Attachment`, `Bone` |

#### Actions Utilitaires

| Type d'Action | Description | Parametres Cles |
|---------------|-------------|-----------------|
| `Nothing` | Ne rien faire | - |
| `Timeout` | Attendre une duree | `Duration`, `DurationRange` |
| `Sequence` | Executer des actions en sequence | `Actions` |
| `Random` | Executer une action aleatoire | `Actions`, `Weights` |
| `SetFlag` | Definir la valeur du drapeau | `Name`, `Value` |
| `ResetInstructions` | Reinitialiser l'etat des instructions | - |
| `Log` | Enregistrer un message de debogage | `Message`, `Level` |

### Configuration de Liste d'Actions

```json
{
    "Actions": [
        {"Type": "State", "State": "Combat", "SubState": "Engaging"},
        {"Type": "TimerStart", "Name": "CombatTimer", "Duration": 60.0},
        {"Type": "PlaySound", "Sound": "npc/battle_cry"}
    ]
}
```

**Source :** `com.hypixel.hytale.server.npc.instructions.Action`

## Mouvements (Motions)

Les mouvements controlent le deplacement des NPC, divises en mouvements du corps (locomotion) et mouvements de la tete (direction du regard).

### Interface Motion

```java
package com.hypixel.hytale.server.npc.instructions;

public interface Motion {
    // Calculer la direction pour ce mouvement
    boolean computeSteering(
        Ref<EntityStore> ref,
        Role role,
        InfoProvider provider,
        double dt,
        Steering steering,
        ComponentAccessor<EntityStore> accessor
    );

    // Appele avant le calcul de direction
    default void preComputeSteering(Ref<EntityStore> ref, Role role, InfoProvider provider, Store<EntityStore> store) {}

    // Cycle de vie
    default void activate(Ref<EntityStore> ref, Role role, ComponentAccessor<EntityStore> accessor) {}
    default void deactivate(Ref<EntityStore> ref, Role role, ComponentAccessor<EntityStore> accessor) {}
}
```

### Types de Mouvement du Corps

| Type de Mouvement | Description | Parametres Cles |
|-------------------|-------------|-----------------|
| `Nothing` | Pas de mouvement | - |
| `Find` | Naviguer vers la cible | `Slot`, `StopDistance`, `Speed` |
| `FindWithTarget` | Naviguer en suivant la cible | `Slot`, `TargetSlot` |
| `Wander` | Errance aleatoire | `Radius`, `Speed`, `Interval` |
| `WanderInCircle` | Errance circulaire | `Radius`, `Center` |
| `WanderInRect` | Errance rectangulaire | `Width`, `Height`, `Center` |
| `MoveAway` | S'eloigner de la cible | `Slot`, `Distance`, `Speed` |
| `MaintainDistance` | Garder la distance de la cible | `Slot`, `MinDistance`, `MaxDistance` |
| `Leave` | Quitter la zone actuelle | `Direction`, `Distance` |
| `Teleport` | Se teleporter a une position | `Position`, `Rotation` |
| `TakeOff` | Commencer a voler | `Altitude` |
| `Land` | Atterrir | - |
| `Path` | Suivre une definition de chemin | `PathName`, `Loop` |
| `MatchLook` | Correspondre a la direction du regard de la cible | `Slot` |
| `Timer` | Attendre avec mouvement optionnel | `Duration`, `Motion` |
| `Sequence` | Executer des mouvements en sequence | `Motions` |
| `AimCharge` | Viser et charger l'attaque | `Slot`, `ChargeTime` |

### Types de Mouvement de la Tete

| Type de Mouvement | Description | Parametres Cles |
|-------------------|-------------|-----------------|
| `Nothing` | Pas de mouvement de tete | - |
| `Watch` | Observer une cible | `Slot`, `Speed` |
| `Observe` | Regarder autour de l'environnement | `Speed`, `Interval` |
| `Aim` | Viser la cible | `Slot`, `LeadTarget` |
| `Timer` | Mouvement de tete temporise | `Duration`, `Motion` |
| `Sequence` | Sequence de mouvements de tete | `Motions` |

### Configuration des Mouvements

```json
{
    "BodyMotion": {
        "Type": "Find",
        "Slot": "Target",
        "StopDistance": 2.0,
        "Speed": 1.0,
        "PathSmoothing": 3
    },
    "HeadMotion": {
        "Type": "Watch",
        "Slot": "Target",
        "Speed": 180.0
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.instructions.Motion`

## Systeme de Recherche de Chemin (Pathfinding)

Le systeme NPC utilise la recherche de chemin A* pour la navigation.

### NavigationSupport

```java
package com.hypixel.hytale.server.npc.role.support;

public class NavigationSupport {
    // Etat de recherche de chemin
    public NavState getNavState();
    public boolean hasPath();
    public boolean isAtDestination();
    public boolean isMoving();
    public boolean isObstructed();

    // Gestion du chemin
    public void setPath(IWaypoint firstWaypoint, Vector3d startPosition);
    public void clearPath();
    public void setForceRecomputePath(boolean force);

    // Suiveur de chemin
    public PathFollower getPathFollower();

    // Destination
    public Vector3d getDestination();
    public double getDistanceToDestination();
}
```

### Classe PathFollower

```java
package com.hypixel.hytale.server.npc.navigation;

public class PathFollower {
    // Point de passage actuel
    public IWaypoint getCurrentWaypoint();
    public Vector3d getCurrentWaypointPosition();
    public IWaypoint getNextWaypoint();

    // Gestion du chemin
    public void setPath(IWaypoint firstWaypoint, Vector3d startPosition);
    public void clearPath();
    public boolean pathInFinalStage();

    // Execution du chemin
    public void executePath(Vector3d currentPosition, MotionController controller, Steering steering);
    public boolean updateCurrentTarget(Vector3d entityPosition, MotionController controller);

    // Lissage du chemin
    public void setPathSmoothing(int smoothing);
    public void smoothPath(Ref<EntityStore> ref, Vector3d position, MotionController controller,
                          ProbeMoveData probeData, ComponentAccessor<EntityStore> accessor);

    // Configuration
    public void setRelativeSpeed(double speed);
    public void setWaypointRadius(double radius);
    public void setBlendHeading(double blend);
}
```

### Enum NavState

```java
package com.hypixel.hytale.server.npc.movement;

public enum NavState {
    IDLE,           // Pas en navigation
    MOVING,         // En mouvement sur le chemin
    AT_DESTINATION, // Destination atteinte
    OBSTRUCTED,     // Chemin bloque
    NO_PATH         // Aucun chemin valide trouve
}
```

### Configuration de la Recherche de Chemin A*

Le systeme de recherche de chemin peut etre configure par controleur de mouvement :

```json
{
    "MotionControllers": {
        "Walk": {
            "MaxSpeed": 5.0,
            "PathSmoothing": 4,
            "MaxClimbAngle": 45.0,
            "MaxSinkAngle": 60.0,
            "WaypointRadius": 0.5
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.navigation.PathFollower`

## Controleurs de Mouvement

Les controleurs de mouvement gerent la physique du deplacement des NPC.

### Interface MotionController

```java
package com.hypixel.hytale.server.npc.movement.controllers;

public interface MotionController {
    // Identification du type
    String getType();

    // Cycle de vie
    void spawned();
    void activate();
    void deactivate();

    // Mouvement
    double steer(Ref<EntityStore> ref, Role role, Steering input, Steering output, double dt, ComponentAccessor<EntityStore> accessor);
    double probeMove(Ref<EntityStore> ref, Vector3d start, Vector3d end, ProbeMoveData data, ComponentAccessor<EntityStore> accessor);

    // Requetes d'etat
    boolean canAct(Ref<EntityStore> ref, ComponentAccessor<EntityStore> accessor);
    boolean isInProgress();
    boolean isObstructed();
    boolean inAir();
    boolean inWater();
    boolean onGround();

    // Vitesse et mouvement
    double getMaximumSpeed();
    double getCurrentSpeed();
    double getCurrentTurnRadius();

    // Configuration
    float getMaxClimbAngle();
    float getMaxSinkAngle();
    double getGravity();
}
```

### Types de Controleurs de Mouvement

| Type de Controleur | Description | Parametres Cles |
|--------------------|-------------|-----------------|
| `Walk` | Mouvement au sol | `MaxSpeed`, `Acceleration`, `TurnSpeed`, `JumpHeight` |
| `Fly` | Mouvement aerien | `MaxSpeed`, `Acceleration`, `AltitudeRange` |
| `Dive` | Mouvement sous-marin | `MaxSpeed`, `Acceleration`, `DiveSpeed` |

### Configuration du Controleur de Mouvement

```json
{
    "MotionControllers": {
        "Walk": {
            "Type": "Walk",
            "MaxSpeed": 5.0,
            "Acceleration": 25.0,
            "Deceleration": 30.0,
            "TurnSpeed": 360.0,
            "JumpHeight": 1.2,
            "StepHeight": 0.6,
            "Gravity": 32.0,
            "MaxClimbAngle": 50.0,
            "MaxSinkAngle": 70.0
        },
        "Fly": {
            "Type": "Fly",
            "MaxSpeed": 8.0,
            "Acceleration": 15.0,
            "MinAltitude": 3.0,
            "MaxAltitude": 20.0,
            "DesiredAltitude": 8.0
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.movement.controllers.MotionController`

## Emplacements d'Entites

Les emplacements d'entites suivent les cibles et autres entites d'interet.

### Classe EntitySlots

```java
package com.hypixel.hytale.server.npc.role.support;

public class EntitySlots {
    // Obtenir l'entite dans l'emplacement
    public Ref<EntityStore> getEntity(String slotName);
    public Ref<EntityStore> getEntity(int slotIndex);

    // Definir l'entite dans l'emplacement
    public void setEntity(String slotName, Ref<EntityStore> entity);
    public void setEntity(int slotIndex, Ref<EntityStore> entity);

    // Vider l'emplacement
    public void clearSlot(String slotName);
    public void clearSlot(int slotIndex);

    // Verifier l'emplacement
    public boolean hasEntity(String slotName);
    public boolean hasEntity(int slotIndex);
}
```

### Configuration des Emplacements d'Entites

```json
{
    "EntitySlots": {
        "Target": {
            "UpdateRate": 0.5,
            "Range": 20.0,
            "MaxCount": 1,
            "KeepDuration": 5.0
        },
        "Allies": {
            "UpdateRate": 1.0,
            "Range": 30.0,
            "MaxCount": 5,
            "Attitudes": ["Friendly"]
        },
        "DamageSource": {
            "UpdateRate": 0.0,
            "MaxCount": 1
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.role.support.EntitySlots`

## Filtres d'Entites

Les filtres d'entites reduisent les entites detectees selon des criteres.

### Types de Filtres

| Type de Filtre | Description | Parametres Cles |
|----------------|-------------|-----------------|
| `Attitude` | Filtrer par attitude | `Attitudes` |
| `NPCGroup` | Filtrer par groupe NPC | `Groups`, `Exclude` |
| `LineOfSight` | Exiger une ligne de vue | `MaxDistance` |
| `ViewSector` | Dans l'angle de vue | `Angle`, `Direction` |
| `HeightDifference` | Filtrer par hauteur | `MinDiff`, `MaxDiff` |
| `Altitude` | Filtrer par altitude | `MinAltitude`, `MaxAltitude` |
| `Stat` | Filtrer par valeur de stat | `Stat`, `Min`, `Max` |
| `MovementState` | Filtrer par mouvement | `State` |
| `Combat` | Filtrer par etat de combat | `InCombat` |
| `Inventory` | Filtrer par inventaire | `HasItem`, `Item` |
| `ItemInHand` | Filtrer par objet en main | `Item`, `ItemTag` |
| `StandingOnBlock` | Filtrer par bloc | `Block`, `BlockSet` |
| `InsideBlock` | Filtrer si dans un bloc | `Block`, `BlockSet` |
| `SpotsMe` | Filtrer si l'entite voit le NPC | - |
| `And` | Tous les filtres doivent passer | `Filters` |
| `Or` | N'importe quel filtre doit passer | `Filters` |
| `Not` | Inverser le resultat du filtre | `Filter` |

### Configuration des Filtres

```json
{
    "Filter": {
        "Type": "And",
        "Filters": [
            {"Type": "LineOfSight"},
            {"Type": "Attitude", "Attitudes": ["Hostile", "Neutral"]},
            {"Type": "Not", "Filter": {"Type": "MovementState", "State": "CROUCHING"}}
        ]
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.corecomponents.IEntityFilter`

## Systeme d'Interaction

Le systeme NPC supporte les interactions avec les joueurs via le systeme d'interaction.

### Capteurs d'Interaction

```json
{
    "Instructions": [
        {
            "Sensors": {
                "Type": "And",
                "Sensors": [
                    {"Type": "CanInteract", "ViewCone": 90, "Attitudes": ["Friendly"]},
                    {"Type": "HasInteracted"}
                ]
            },
            "Actions": [
                {"Type": "State", "State": "Talking"},
                {"Type": "LockOnInteractionTarget"}
            ]
        }
    ]
}
```

### Rendre les NPC Interactifs

```json
{
    "States": {
        "Idle": {
            "SubStates": {
                "Default": {
                    "Instructions": [
                        {
                            "Sensors": {"Type": "Player", "Range": 5.0, "Slot": "InteractionTarget"},
                            "Actions": [
                                {"Type": "SetInteractable", "Interactable": true, "Hint": "Parler", "ShowPrompt": true}
                            ],
                            "HeadMotion": {"Type": "Watch", "Slot": "InteractionTarget"}
                        }
                    ]
                }
            }
        }
    }
}
```

**Source :** `com.hypixel.hytale.server.npc.corecomponents.interaction`

## Minuteries et Alarmes

Les NPC peuvent utiliser des minuteries pour les actions differees et des alarmes pour les evenements planifies.

### Configuration des Minuteries

```json
{
    "Timers": {
        "AttackCooldown": {"Duration": 2.0},
        "WanderInterval": {"DurationRange": [5.0, 15.0]},
        "DespawnTimer": {"Duration": 300.0}
    }
}
```

### Actions de Minuterie

```json
{
    "Actions": [
        {"Type": "TimerStart", "Name": "AttackCooldown", "Duration": 2.0},
        {"Type": "TimerStart", "Name": "RandomTimer", "DurationRange": [1.0, 5.0]}
    ]
}
```

### Configuration des Alarmes (Temps de Jeu)

```json
{
    "Actions": [
        {"Type": "SetAlarm", "Name": "DawnAlarm", "GameTime": "PT6H"},
        {"Type": "SetAlarm", "Name": "NightAlarm", "GameTime": "PT20H"}
    ]
}
```

**Source :** `com.hypixel.hytale.server.npc.components.Timers`

## Faire Apparaitre des NPC par Programmation

### Apparition Basique

```java
import com.hypixel.hytale.server.npc.NPCPlugin;
import com.hypixel.hytale.server.npc.entities.NPCEntity;
import it.unimi.dsi.fastutil.Pair;

public class NPCSpawnExample {

    public Pair<Ref<EntityStore>, NPCEntity> spawnNPC(
        Store<EntityStore> store,
        String roleName,
        Vector3d position,
        Vector3f rotation
    ) {
        NPCPlugin npcPlugin = NPCPlugin.get();
        int roleIndex = npcPlugin.getIndex(roleName);

        return npcPlugin.spawnEntity(
            store,
            roleIndex,
            position,
            rotation,
            null,  // Utiliser le modele par defaut
            null   // Pas de callback post-apparition
        );
    }
}
```

### Apparition avec Configuration

```java
public Pair<Ref<EntityStore>, NPCEntity> spawnConfiguredNPC(
    Store<EntityStore> store,
    String roleName,
    Vector3d position,
    Vector3f rotation,
    String initialState
) {
    NPCPlugin npcPlugin = NPCPlugin.get();
    int roleIndex = npcPlugin.getIndex(roleName);

    return npcPlugin.spawnEntity(
        store,
        roleIndex,
        position,
        rotation,
        null,
        (npc, ref, componentStore) -> {
            // Definir l'etat initial apres l'apparition
            npc.getRole().getStateSupport().setState(
                ref, initialState, null, componentStore
            );

            // Demarrer une minuterie
            npc.getRole().getTimers().startTimer("SpawnProtection", 5.0);
        }
    );
}
```

### Controler l'Etat du NPC

```java
public void setNPCState(
    Ref<EntityStore> npcRef,
    Store<EntityStore> store,
    String state,
    String subState
) {
    NPCEntity npcComponent = store.getComponent(npcRef, NPCEntity.getComponentType());
    if (npcComponent != null) {
        npcComponent.setState(npcRef, state, subState, store);
    }
}
```

## Commandes Console

### Commandes NPC

| Commande | Description |
|----------|-------------|
| `/npc list` | Lister tous les roles NPC charges |
| `/npc spawn <role>` | Faire apparaitre un NPC |
| `/npc info` | Afficher les informations du NPC |
| `/npc state <state>` | Forcer un changement d'etat du NPC |
| `/npc kill` | Tuer le NPC cible |
| `/npc remove` | Supprimer le NPC cible |
| `/npc debug` | Basculer le mode debogage NPC |

## Exemple de Role Complet

Voici un exemple complet de configuration de role NPC :

```json
{
    "Id": "Village_Guard",
    "Model": "npc/village_guard",
    "NPCGroups": ["Friendly", "Humanoid", "Guard"],
    "StartState": "Patrol",
    "StartSubState": "Default",

    "EntitySlots": {
        "Target": {
            "UpdateRate": 0.25,
            "Range": 25.0,
            "MaxCount": 1
        },
        "Allies": {
            "UpdateRate": 1.0,
            "Range": 40.0,
            "MaxCount": 5
        }
    },

    "Timers": {
        "AttackCooldown": {"Duration": 1.5},
        "PatrolInterval": {"DurationRange": [10.0, 30.0]},
        "AlertCooldown": {"Duration": 60.0}
    },

    "MotionControllers": {
        "Walk": {
            "Type": "Walk",
            "MaxSpeed": 5.0,
            "Acceleration": 25.0,
            "TurnSpeed": 270.0,
            "JumpHeight": 1.2
        }
    },

    "States": {
        "Patrol": {
            "SubStates": {
                "Default": {
                    "Instructions": [
                        {
                            "Sensors": {
                                "Type": "Entity",
                                "Range": 20.0,
                                "Slot": "Target",
                                "Attitudes": ["Hostile"],
                                "Filter": {"Type": "LineOfSight"}
                            },
                            "Actions": [
                                {"Type": "State", "State": "Combat"},
                                {"Type": "Notify", "Range": 30.0, "Notification": "EnemySpotted"}
                            ]
                        },
                        {
                            "Sensors": {"Type": "Timer", "Name": "PatrolInterval", "Condition": "Finished"},
                            "Actions": [
                                {"Type": "TimerStart", "Name": "PatrolInterval"}
                            ],
                            "BodyMotion": {"Type": "Wander", "Radius": 15.0, "Speed": 0.5}
                        },
                        {
                            "Sensors": {"Type": "Always"},
                            "BodyMotion": {"Type": "Nothing"},
                            "HeadMotion": {"Type": "Observe", "Speed": 45.0}
                        }
                    ]
                }
            }
        },
        "Combat": {
            "BusySubStates": ["Attacking"],
            "SubStates": {
                "Default": {
                    "Instructions": [
                        {
                            "Sensors": {
                                "Type": "Not",
                                "Sensor": {"Type": "Target", "Slot": "Target", "Condition": "HasTarget"}
                            },
                            "Actions": [
                                {"Type": "State", "State": "Patrol"},
                                {"Type": "TimerStart", "Name": "AlertCooldown"}
                            ]
                        },
                        {
                            "Sensors": {
                                "Type": "And",
                                "Sensors": [
                                    {"Type": "Nav", "Condition": "AtDestination"},
                                    {"Type": "Timer", "Name": "AttackCooldown", "Condition": "Finished"}
                                ]
                            },
                            "Actions": [
                                {"Type": "State", "SubState": "Attacking"},
                                {"Type": "Attack", "Slot": "Target"},
                                {"Type": "TimerStart", "Name": "AttackCooldown"}
                            ]
                        },
                        {
                            "Sensors": {"Type": "Always"},
                            "BodyMotion": {"Type": "Find", "Slot": "Target", "StopDistance": 2.0, "Speed": 1.0},
                            "HeadMotion": {"Type": "Watch", "Slot": "Target"}
                        }
                    ]
                },
                "Attacking": {
                    "Instructions": [
                        {
                            "Sensors": {"Type": "Animation", "Condition": "Finished"},
                            "Actions": [{"Type": "State", "SubState": "Default"}]
                        }
                    ]
                }
            }
        }
    }
}
```

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `NPCPlugin` | `com.hypixel.hytale.server.npc.NPCPlugin` |
| `NPCEntity` | `com.hypixel.hytale.server.npc.entities.NPCEntity` |
| `Role` | `com.hypixel.hytale.server.npc.role.Role` |
| `StateSupport` | `com.hypixel.hytale.server.npc.role.support.StateSupport` |
| `Instruction` | `com.hypixel.hytale.server.npc.instructions.Instruction` |
| `Sensor` | `com.hypixel.hytale.server.npc.instructions.Sensor` |
| `Action` | `com.hypixel.hytale.server.npc.instructions.Action` |
| `Motion` | `com.hypixel.hytale.server.npc.instructions.Motion` |
| `BodyMotion` | `com.hypixel.hytale.server.npc.instructions.BodyMotion` |
| `HeadMotion` | `com.hypixel.hytale.server.npc.instructions.HeadMotion` |
| `PathFollower` | `com.hypixel.hytale.server.npc.navigation.PathFollower` |
| `MotionController` | `com.hypixel.hytale.server.npc.movement.controllers.MotionController` |
| `MotionControllerWalk` | `com.hypixel.hytale.server.npc.movement.controllers.MotionControllerWalk` |
| `MotionControllerFly` | `com.hypixel.hytale.server.npc.movement.controllers.MotionControllerFly` |
| `MotionControllerDive` | `com.hypixel.hytale.server.npc.movement.controllers.MotionControllerDive` |
| `BuilderRole` | `com.hypixel.hytale.server.npc.role.builders.BuilderRole` |
| `ActionState` | `com.hypixel.hytale.server.npc.corecomponents.statemachine.ActionState` |
| `SensorEntity` | `com.hypixel.hytale.server.npc.corecomponents.entity.SensorEntity` |
| `SensorCanInteract` | `com.hypixel.hytale.server.npc.corecomponents.interaction.SensorCanInteract` |
