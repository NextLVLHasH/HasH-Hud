---
id: effects-system
title: Systeme d'Effets d'Entite
sidebar_label: Effets d'Entite
sidebar_position: 7
description: Documentation complete du systeme d'effets d'entite Hytale pour les buffs, debuffs et effets de statut
---

# Systeme d'Effets d'Entite

Le systeme d'Effets d'Entite dans Hytale fournit une maniere complete d'appliquer des effets de statut temporaires ou permanents aux entites. Ce systeme prend en charge les buffs, debuffs, effets visuels, modifications de stats, restrictions de mouvement et plus encore.

## Vue d'ensemble

Les effets d'entite sont geres par le composant `EffectControllerComponent`, qui est un composant ECS attache aux entites capables de recevoir des effets. Chaque effet possede des proprietes comme la duree, le comportement de chevauchement, les effets visuels et les modificateurs de stats.

## Classes Principales

| Classe | Package | Description |
|--------|---------|-------------|
| `EffectControllerComponent` | `com.hypixel.hytale.server.core.entity.effect` | Composant principal pour gerer les effets sur les entites |
| `ActiveEntityEffect` | `com.hypixel.hytale.server.core.entity.effect` | Represente une instance d'effet active |
| `EntityEffect` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config` | Definition/configuration d'effet |
| `LivingEntityEffectSystem` | `com.hypixel.hytale.server.core.modules.entity.livingentity` | Systeme qui traite les ticks d'effets |

## Proprietes d'EntityEffect

Chaque effet d'entite est defini avec les proprietes suivantes :

```java
public class EntityEffect {
    String id;                        // Identifiant unique
    String name;                      // Nom d'affichage
    float duration;                   // Duree de l'effet en secondes
    boolean infinite;                 // Si l'effet dure eternellement
    boolean debuff;                   // Vrai si effet negatif
    String statusEffectIcon;          // Icone pour l'interface
    OverlapBehavior overlapBehavior;  // Comment gerer la reapplication
    RemovalBehavior removalBehavior;  // Comment l'effet est supprime
    double damageCalculatorCooldown;  // Cooldown pour les degats sur la duree
    Map<Integer, Float> statModifiers;  // Modifications de stats
    ValueType valueType;              // Comment les modificateurs sont appliques
    ApplicationEffects applicationEffects;  // Effets visuels/audio
    boolean invulnerable;             // Accorde l'invulnerabilite
    String modelChange;               // Changement de modele pendant l'effet
}
```

**Source :** `com.hypixel.hytale.server.core.asset.type.entityeffect.config.EntityEffect`

## EffectControllerComponent

Le `EffectControllerComponent` gere tous les effets actifs sur une entite :

```java
// Obtenir le type de composant
ComponentType<EntityStore, EffectControllerComponent> componentType =
    EffectControllerComponent.getComponentType();

// Obtenir le controleur d'effets d'une entite
EffectControllerComponent effectController =
    store.getComponent(entityRef, componentType);
```

### Methodes Principales

```java
public class EffectControllerComponent {
    // Ajouter un effet avec les parametres par defaut
    boolean addEffect(Ref<EntityStore> ownerRef, EntityEffect entityEffect,
                      ComponentAccessor<EntityStore> componentAccessor);

    // Ajouter un effet avec duree et comportement personnalises
    boolean addEffect(Ref<EntityStore> ownerRef, EntityEffect entityEffect,
                      float duration, OverlapBehavior overlapBehavior,
                      ComponentAccessor<EntityStore> componentAccessor);

    // Ajouter un effet infini (permanent)
    boolean addInfiniteEffect(Ref<EntityStore> ownerRef, int entityEffectIndex,
                              EntityEffect entityEffect,
                              ComponentAccessor<EntityStore> componentAccessor);

    // Supprimer un effet specifique
    void removeEffect(Ref<EntityStore> ownerRef, int entityEffectIndex,
                      ComponentAccessor<EntityStore> componentAccessor);

    // Supprimer un effet avec un comportement specifique
    void removeEffect(Ref<EntityStore> ownerRef, int entityEffectIndex,
                      RemovalBehavior removalBehavior,
                      ComponentAccessor<EntityStore> componentAccessor);

    // Supprimer tous les effets
    void clearEffects(Ref<EntityStore> ownerRef,
                      ComponentAccessor<EntityStore> componentAccessor);

    // Obtenir tous les effets actifs
    Int2ObjectMap<ActiveEntityEffect> getActiveEffects();

    // Obtenir les index des effets actifs
    int[] getActiveEffectIndexes();

    // Verifier si l'entite est invulnerable grace aux effets
    boolean isInvulnerable();
}
```

**Source :** `com.hypixel.hytale.server.core.entity.effect.EffectControllerComponent`

## ActiveEntityEffect

Represente une instance d'un effet actuellement applique a une entite :

```java
public class ActiveEntityEffect {
    String entityEffectId;       // Identifiant de l'effet
    int entityEffectIndex;       // Index de l'effet dans la map d'assets
    float initialDuration;       // Duree originale
    float remainingDuration;     // Temps restant
    boolean infinite;            // Est permanent
    boolean debuff;              // Est un effet negatif
    String statusEffectIcon;     // Icone UI
    boolean invulnerable;        // Accorde l'invulnerabilite
}
```

### Methodes Principales

```java
// Obtenir la duree restante
float getRemainingDuration();

// Verifier si l'effet est infini
boolean isInfinite();

// Verifier si l'effet est un debuff
boolean isDebuff();

// Verifier si l'effet accorde l'invulnerabilite
boolean isInvulnerable();

// Obtenir l'index de l'effet
int getEntityEffectIndex();
```

**Source :** `com.hypixel.hytale.server.core.entity.effect.ActiveEntityEffect`

## Comportements de Chevauchement

Quand un effet est applique a une entite qui possede deja cet effet, l'`OverlapBehavior` determine ce qui se passe :

| Comportement | Description |
|--------------|-------------|
| `EXTEND` | Ajoute la nouvelle duree a la duree restante |
| `OVERWRITE` | Remplace l'effet actuel par le nouveau |
| `IGNORE` | Garde l'effet existant, ignore la nouvelle application |

```java
public enum OverlapBehavior {
    EXTEND,
    OVERWRITE,
    IGNORE
}
```

**Source :** `com.hypixel.hytale.server.core.asset.type.entityeffect.config.OverlapBehavior`

## Comportements de Suppression

Lors de la suppression d'un effet, `RemovalBehavior` determine comment c'est gere :

| Comportement | Description |
|--------------|-------------|
| `COMPLETE` | Supprime completement l'effet immediatement |
| `INFINITE` | Supprime seulement le flag infini, la duree continue |
| `DURATION` | Met la duree restante a zero |

```java
public enum RemovalBehavior {
    COMPLETE,
    INFINITE,
    DURATION
}
```

**Source :** `com.hypixel.hytale.server.core.asset.type.entityeffect.config.RemovalBehavior`

## ApplicationEffects

Effets visuels et audio appliques quand un effet est actif :

```java
public class ApplicationEffects {
    Color entityBottomTint;              // Teinte couleur bas
    Color entityTopTint;                 // Teinte couleur haut
    String entityAnimationId;            // Animation a jouer
    ModelParticle[] particles;           // Effets de particules
    ModelParticle[] firstPersonParticles; // Particules premiere personne
    String screenEffect;                 // Effet d'ecran en superposition
    float horizontalSpeedMultiplier;     // Modificateur de vitesse
    float knockbackMultiplier;           // Modificateur de recul
    String soundEventIdLocal;            // Son pour l'entite affectee
    String soundEventIdWorld;            // Son pour les autres joueurs
    String modelVFXId;                   // VFX de modele a appliquer
    MovementEffects movementEffects;     // Restrictions de mouvement
    AbilityEffects abilityEffects;       // Restrictions de capacites
}
```

**Source :** `com.hypixel.hytale.server.core.asset.type.entityeffect.config.ApplicationEffects`

## MovementEffects

Controle les restrictions de mouvement pendant un effet :

```java
public class MovementEffects {
    boolean disableAll;       // Desactiver tout mouvement
    boolean disableForward;   // Desactiver mouvement avant
    boolean disableBackward;  // Desactiver mouvement arriere
    boolean disableLeft;      // Desactiver deplacement gauche
    boolean disableRight;     // Desactiver deplacement droite
    boolean disableSprint;    // Desactiver le sprint
    boolean disableJump;      // Desactiver le saut
    boolean disableCrouch;    // Desactiver l'accroupissement
}
```

**Source :** `com.hypixel.hytale.server.core.asset.modifiers.MovementEffects`

## AbilityEffects

Controle les restrictions de capacites pendant un effet :

```java
public class AbilityEffects {
    Set<InteractionType> disabled;  // Types d'interactions a desactiver
}
```

**Source :** `com.hypixel.hytale.server.core.asset.type.entityeffect.config.AbilityEffects`

## Commandes Console

Hytale fournit des commandes console pour gerer les effets d'entite :

### Commandes d'Effets Joueur

| Commande | Description |
|----------|-------------|
| `/player effect apply <effet> [duree]` | Appliquer un effet a soi-meme |
| `/player effect apply <joueur> <effet> [duree]` | Appliquer un effet a un autre joueur |
| `/player effect clear` | Supprimer tous les effets de soi-meme |
| `/player effect clear <joueur>` | Supprimer tous les effets d'un autre joueur |

### Commandes d'Effets Entite

| Commande | Description |
|----------|-------------|
| `/entity effect <entite> <effet> [duree]` | Appliquer un effet a une entite |

**Duree par defaut :** 100 secondes

## Exemple de Plugin

Voici un exemple complet de gestion des effets d'entite dans un plugin :

```java
package com.example.effectsplugin;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.asset.type.entityeffect.config.EntityEffect;
import com.hypixel.hytale.server.core.asset.type.entityeffect.config.OverlapBehavior;
import com.hypixel.hytale.server.core.entity.effect.ActiveEntityEffect;
import com.hypixel.hytale.server.core.entity.effect.EffectControllerComponent;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.plugin.java.JavaPlugin;
import com.hypixel.hytale.server.plugin.java.JavaPluginInit;
import it.unimi.dsi.fastutil.ints.Int2ObjectMap;
import javax.annotation.Nonnull;

public class EffectsPlugin extends JavaPlugin {

    public EffectsPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer les ecouteurs d'evenements ici
        getLogger().info("Plugin d'effets charge !");
    }

    /**
     * Appliquer un effet a un joueur par ID d'effet
     */
    public boolean appliquerEffet(PlayerRef playerRef, String effectId, float duree) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return false;
        }

        Store<EntityStore> store = ref.getStore();

        // Obtenir l'effet depuis la map d'assets
        EntityEffect entityEffect = EntityEffect.getAssetMap().getAsset(effectId);
        if (entityEffect == null) {
            getLogger().warn("Effet non trouve : " + effectId);
            return false;
        }

        // Obtenir le composant controleur d'effets
        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            getLogger().warn("L'entite n'a pas de EffectControllerComponent");
            return false;
        }

        // Appliquer l'effet avec une duree personnalisee
        boolean succes = effectController.addEffect(
            ref,
            entityEffect,
            duree,
            OverlapBehavior.OVERWRITE,
            store
        );

        if (succes) {
            getLogger().info("Effet " + effectId + " applique pour " + duree + "s");
        }

        return succes;
    }

    /**
     * Appliquer un effet infini (permanent)
     */
    public boolean appliquerEffetInfini(PlayerRef playerRef, String effectId) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return false;
        }

        Store<EntityStore> store = ref.getStore();

        EntityEffect entityEffect = EntityEffect.getAssetMap().getAsset(effectId);
        if (entityEffect == null) {
            return false;
        }

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            return false;
        }

        int effectIndex = EntityEffect.getAssetMap().getIndex(effectId);
        return effectController.addInfiniteEffect(ref, effectIndex, entityEffect, store);
    }

    /**
     * Supprimer un effet specifique d'un joueur
     */
    public void supprimerEffet(PlayerRef playerRef, String effectId) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            return;
        }

        int effectIndex = EntityEffect.getAssetMap().getIndex(effectId);
        if (effectIndex != Integer.MIN_VALUE) {
            effectController.removeEffect(ref, effectIndex, store);
            getLogger().info("Effet supprime : " + effectId);
        }
    }

    /**
     * Supprimer tous les effets d'un joueur
     */
    public void supprimerTousLesEffets(PlayerRef playerRef) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController != null) {
            effectController.clearEffects(ref, store);
            getLogger().info("Tous les effets supprimes");
        }
    }

    /**
     * Verifier si un joueur a un effet specifique
     */
    public boolean aEffet(PlayerRef playerRef, String effectId) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return false;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            return false;
        }

        int effectIndex = EntityEffect.getAssetMap().getIndex(effectId);
        return effectController.getActiveEffects().containsKey(effectIndex);
    }

    /**
     * Obtenir la duree restante d'un effet
     */
    public float obtenirDureeRestante(PlayerRef playerRef, String effectId) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return 0f;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            return 0f;
        }

        int effectIndex = EntityEffect.getAssetMap().getIndex(effectId);
        ActiveEntityEffect activeEffect = effectController.getActiveEffects().get(effectIndex);

        if (activeEffect == null) {
            return 0f;
        }

        return activeEffect.isInfinite() ? Float.POSITIVE_INFINITY : activeEffect.getRemainingDuration();
    }

    /**
     * Lister tous les effets actifs sur un joueur
     */
    public void listerEffetsActifs(PlayerRef playerRef) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        if (effectController == null) {
            return;
        }

        Int2ObjectMap<ActiveEntityEffect> activeEffects = effectController.getActiveEffects();

        getLogger().info("Effets actifs (" + activeEffects.size() + ") :");
        for (ActiveEntityEffect effect : activeEffects.values()) {
            String duree = effect.isInfinite() ? "infini" :
                           String.format("%.1fs", effect.getRemainingDuration());
            String type = effect.isDebuff() ? "[Debuff]" : "[Buff]";
            getLogger().info("  - " + effect.getEntityEffectIndex() + " " + type + " Duree : " + duree);
        }
    }

    /**
     * Verifier si le joueur est invulnerable grace aux effets
     */
    public boolean estInvulnerableParEffets(PlayerRef playerRef) {
        Ref<EntityStore> ref = playerRef.getReference();
        if (ref == null || !ref.isValid()) {
            return false;
        }

        Store<EntityStore> store = ref.getStore();

        EffectControllerComponent effectController =
            store.getComponent(ref, EffectControllerComponent.getComponentType());

        return effectController != null && effectController.isInvulnerable();
    }
}
```

## Effets via le Systeme d'Interactions

### ApplyEffectInteraction

Appliquer des effets via le systeme d'interactions :

```java
public class ApplyEffectInteraction extends SimpleInstantInteraction {
    String effectId;                    // Effet a appliquer
    InteractionTarget entityTarget;     // Cible (USER, TARGET, etc.)
}
```

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.simple.ApplyEffectInteraction`

### ClearEntityEffectInteraction

Supprimer des effets via le systeme d'interactions :

```java
public class ClearEntityEffectInteraction extends SimpleInstantInteraction {
    String entityEffectId;              // Effet a supprimer
    InteractionTarget entityTarget;     // Entite cible
}
```

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.ClearEntityEffectInteraction`

### EffectConditionInteraction

Verifier la presence d'effets dans les chaines d'interactions :

```java
public class EffectConditionInteraction extends SimpleInstantInteraction {
    String[] entityEffectIds;           // Effets a verifier
    Match match;                        // ALL ou NONE
    InteractionTarget entityTarget;     // Cible a verifier
}
```

L'interaction reussit si :
- `Match.All` : La cible a TOUS les effets specifies
- `Match.None` : La cible n'a AUCUN des effets specifies

**Source :** `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.EffectConditionInteraction`

## Actions d'Effets NPC

Les NPCs peuvent appliquer des effets avec `ActionApplyEntityEffect` :

```java
public class ActionApplyEntityEffect extends ActionBase {
    int entityEffectId;    // Index de l'effet a appliquer
    boolean useTarget;     // Appliquer a la cible ou a soi-meme
}
```

**Source :** `com.hypixel.hytale.server.npc.corecomponents.combat.ActionApplyEntityEffect`

## Systeme de Traitement des Effets

Le `LivingEntityEffectSystem` gere le tick des effets a chaque frame :

```java
public class LivingEntityEffectSystem extends EntityTickingSystem<EntityStore> {
    // Traite toutes les entites avec EffectControllerComponent
    // - Decremente la duree pour les effets non-infinis
    // - Supprime les effets expires
    // - Applique les effets de degats sur la duree
    // - Met a jour les modificateurs de stats
    // - Gere les conditions speciales (ex: effet Brulure supprime par l'eau)
}
```

### Gestion Speciale des Effets

Certains effets ont un comportement special :

- **Burn (Brulure)** : Automatiquement supprime quand l'entite entre dans l'eau

```java
// Depuis LivingEntityEffectSystem.canApplyEffect()
if ("Burn".equals(entityEffect.getId())) {
    // Verifie si l'entite touche des blocs d'eau
    return !toucheEau;
}
```

**Source :** `com.hypixel.hytale.server.core.modules.entity.livingentity.LivingEntityEffectSystem`

## Synchronisation Reseau

Les effets sont synchronises aux clients via `EntityEffectUpdate` :

```java
public class EntityEffectUpdate {
    EffectOp op;           // Add ou Remove
    int effectIndex;       // Index de l'asset d'effet
    float duration;        // Duree restante
    boolean infinite;      // Est permanent
    boolean debuff;        // Est negatif
    String statusIcon;     // Chemin de l'icone UI
}
```

Operations :
- `EffectOp.Add` - Effet ajoute ou mis a jour
- `EffectOp.Remove` - Effet supprime

**Source :** `com.hypixel.hytale.protocol.EntityEffectUpdate`

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `EffectControllerComponent` | `com.hypixel.hytale.server.core.entity.effect.EffectControllerComponent` |
| `ActiveEntityEffect` | `com.hypixel.hytale.server.core.entity.effect.ActiveEntityEffect` |
| `EntityEffect` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config.EntityEffect` |
| `ApplicationEffects` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config.ApplicationEffects` |
| `MovementEffects` | `com.hypixel.hytale.server.core.asset.modifiers.MovementEffects` |
| `AbilityEffects` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config.AbilityEffects` |
| `OverlapBehavior` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config.OverlapBehavior` |
| `RemovalBehavior` | `com.hypixel.hytale.server.core.asset.type.entityeffect.config.RemovalBehavior` |
| `LivingEntityEffectSystem` | `com.hypixel.hytale.server.core.modules.entity.livingentity.LivingEntityEffectSystem` |
| `ApplyEffectInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.simple.ApplyEffectInteraction` |
| `ClearEntityEffectInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.ClearEntityEffectInteraction` |
| `EffectConditionInteraction` | `com.hypixel.hytale.server.core.modules.interaction.interaction.config.none.EffectConditionInteraction` |
| `ActionApplyEntityEffect` | `com.hypixel.hytale.server.npc.corecomponents.combat.ActionApplyEntityEffect` |
