---
id: damage-event
title: Damage
sidebar_label: Damage
---

# Damage

L'evenement ECS principal pour gerer les degats aux entites dans Hytale. Cet evenement est declenche chaque fois qu'une entite subit des degats de n'importe quelle source, permettant aux plugins d'intercepter, modifier ou annuler les degats avant qu'ils ne soient appliques. Contrairement aux evenements IEvent traditionnels, Damage est un evenement ECS (Entity Component System) qui necessite un EntityEventSystem pour etre gere.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.entity.damage.Damage` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |
| **Evenement ECS** | Oui |
| **Implemente** | `IMetaStore<Damage>` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/modules/entity/damage/Damage.java:24` |

## Declaration

```java
public class Damage extends CancellableEcsEvent implements IMetaStore<Damage> {
```

## Constructeurs

| Constructeur | Description |
|--------------|-------------|
| `Damage(Source source, DamageCause damageCause, float amount)` | Cree un evenement de degats avec un asset de cause de degats |
| `Damage(Source source, int damageCauseIndex, float amount)` | Cree un evenement de degats avec un index de cause de degats |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `amount` | `float` | `getAmount()` / `setAmount()` | Le montant actuel des degats (modifiable) |
| `initialAmount` | `float` | `getInitialAmount()` | Le montant original des degats (lecture seule) |
| `damageCauseIndex` | `int` | `getDamageCauseIndex()` / `setDamageCauseIndex()` | Index de la cause de degats dans la map d'assets |
| `source` | `Damage.Source` | `getSource()` / `setSource()` | La source des degats |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAmount` | `public float getAmount()` | Retourne le montant actuel des degats |
| `setAmount` | `public void setAmount(float amount)` | Definit le montant des degats |
| `getInitialAmount` | `public float getInitialAmount()` | Retourne le montant original des degats avant modifications |
| `getSource` | `@Nonnull public Damage.Source getSource()` | Retourne la source des degats |
| `setSource` | `public void setSource(@Nonnull Damage.Source source)` | Definit la source des degats |
| `getDamageCauseIndex` | `public int getDamageCauseIndex()` | Retourne l'index de la cause de degats |
| `setDamageCauseIndex` | `public void setDamageCauseIndex(int damageCauseIndex)` | Definit l'index de la cause de degats |
| `getCause` | `@Deprecated @Nullable public DamageCause getCause()` | Retourne l'asset DamageCause (deprecie) |
| `getDeathMessage` | `@Nonnull public Message getDeathMessage(...)` | Retourne le message de mort pour ces degats |
| `getMetaStore` | `@Nonnull public IMetaStoreImpl<Damage> getMetaStore()` | Retourne le meta store pour cet evenement de degats |
| `isCancelled` | `public boolean isCancelled()` | Retourne si l'evenement a ete annule (herite) |
| `setCancelled` | `public void setCancelled(boolean cancelled)` | Definit l'etat d'annulation de l'evenement (herite) |

## MetaKeys

La classe Damage fournit plusieurs MetaKeys pour stocker des donnees supplementaires liees aux degats :

| MetaKey | Type | Description |
|---------|------|-------------|
| `HIT_LOCATION` | `Vector4d` | L'emplacement ou le coup a eu lieu |
| `HIT_ANGLE` | `Float` | L'angle du coup |
| `IMPACT_PARTICLES` | `Damage.Particles` | Effets de particules a jouer a l'impact |
| `IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Effet sonore a jouer a l'impact |
| `PLAYER_IMPACT_SOUND_EFFECT` | `Damage.SoundEffect` | Effet sonore pour les impacts sur joueurs |
| `CAMERA_EFFECT` | `Damage.CameraEffect` | Effet de camera a appliquer lors des degats |
| `DEATH_ICON` | `String` | Icone a afficher a la mort |
| `BLOCKED` | `Boolean` | Si les degats ont ete bloques (defaut false) |
| `STAMINA_DRAIN_MULTIPLIER` | `Float` | Multiplicateur pour le drain d'endurance |
| `CAN_BE_PREDICTED` | `Boolean` | Si les degats peuvent etre predits (defaut false) |
| `KNOCKBACK_COMPONENT` | `KnockbackComponent` | Donnees de recul pour les degats |

## Types de sources

L'interface `Damage.Source` definit l'origine des degats. Il existe plusieurs implementations integrees :

### Damage.Source (Interface)

L'interface de base pour toutes les sources de degats. Fournit une implementation par defaut de `getDeathMessage()` qui utilise la cause de degats.

### Damage.EntitySource

Degats causes par une autre entite (joueur, mob, etc.).

```java
public class EntitySource implements Damage.Source {
    public EntitySource(@Nonnull Ref<EntityStore> sourceRef)
    public Ref<EntityStore> getRef()  // Retourne la reference de l'entite attaquante
}
```

### Damage.ProjectileSource

Degats causes par un projectile (fleche, objet lance, etc.). Etend `EntitySource`.

```java
public class ProjectileSource extends Damage.EntitySource {
    public ProjectileSource(@Nonnull Ref<EntityStore> shooter, @Nonnull Ref<EntityStore> projectile)
    public Ref<EntityStore> getProjectile()  // Retourne la reference de l'entite projectile
}
```

### Damage.CommandSource

Degats causes par une commande (commande kill, commande damage, etc.).

```java
public class CommandSource implements Damage.Source {
    public CommandSource(@Nonnull CommandSender commandSender, @Nonnull AbstractCommand cmd)
    public CommandSource(@Nonnull CommandSender commandSender, @Nullable String commandName)
}
```

### Damage.EnvironmentSource

Degats causes par des facteurs environnementaux (degats de chute, noyade, feu, etc.).

```java
public class EnvironmentSource implements Damage.Source {
    public EnvironmentSource(@Nonnull String type)
    public String getType()  // Retourne le type de degats environnementaux
}
```

### Damage.NULL_SOURCE

Une implementation d'objet null statique pour les cas ou aucune source specifique ne s'applique.

## Comprendre les evenements ECS

**Important :** Les evenements ECS (Entity Component System) fonctionnent differemment des evenements `IEvent` classiques. Ils n'utilisent **pas** l'EventBus - ils necessitent une classe `EntityEventSystem` dediee enregistree via `getEntityStoreRegistry().registerSystem()`.

Differences cles :
- Les evenements ECS etendent `EcsEvent` ou `CancellableEcsEvent` au lieu d'implementer `IEvent`
- Ils sont dispatches via `entityStore.invoke()` dans le framework ECS
- Vous devez creer une sous-classe d'`EntityEventSystem` pour ecouter ces evenements
- Les systemes sont enregistres via `getEntityStoreRegistry().registerSystem()`

## Exemple d'utilisation

> **Teste** - Ce pattern de code suit l'architecture du systeme d'evenements ECS.

### Etape 1 : Creer l'EntityEventSystem

Creez une classe qui etend `EntityEventSystem<EntityStore, Damage>` :

```java
package com.example.monplugin.systems;

import com.hypixel.hytale.component.Archetype;
import com.hypixel.hytale.component.ArchetypeChunk;
import com.hypixel.hytale.component.CommandBuffer;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.component.query.Query;
import com.hypixel.hytale.component.system.EntityEventSystem;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.modules.entity.damage.Damage;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class DamageSystem extends EntityEventSystem<EntityStore, Damage> {

    public DamageSystem() {
        super(Damage.class);
    }

    @Override
    public void handle(
            int index,
            @Nonnull ArchetypeChunk<EntityStore> archetypeChunk,
            @Nonnull Store<EntityStore> store,
            @Nonnull CommandBuffer<EntityStore> commandBuffer,
            @Nonnull Damage event
    ) {
        // Obtenir les informations de degats
        float damage = event.getAmount();
        float originalDamage = event.getInitialAmount();
        Damage.Source source = event.getSource();

        // Exemple : Reduire tous les degats de 50%
        event.setAmount(damage * 0.5f);

        // Exemple : Verifier le type de source de degats
        if (source instanceof Damage.EntitySource entitySource) {
            // Les degats ont ete causes par une autre entite
            handleEntityDamage(event, entitySource);
        } else if (source instanceof Damage.EnvironmentSource envSource) {
            // Degats environnementaux (chute, feu, etc.)
            handleEnvironmentDamage(event, envSource);
        }

        // Exemple : Annuler completement les degats
        if (shouldCancelDamage(event)) {
            event.setCancelled(true);
        }
    }

    private void handleEntityDamage(Damage event, Damage.EntitySource source) {
        // Gerer les degats PvP ou PvE
        System.out.println("Degats d'entite : " + event.getAmount());
    }

    private void handleEnvironmentDamage(Damage event, Damage.EnvironmentSource source) {
        // Gerer les degats environnementaux
        String type = source.getType();
        if (type.equals("fall")) {
            // Reduire les degats de chute
            event.setAmount(event.getAmount() * 0.75f);
        }
    }

    private boolean shouldCancelDamage(Damage event) {
        // Logique personnalisee pour determiner si les degats doivent etre annules
        return false;
    }

    @Nullable
    @Override
    public Query<EntityStore> getQuery() {
        return Archetype.empty(); // Attraper les evenements de degats pour toutes les entites
    }
}
```

### Etape 2 : Enregistrer le systeme dans votre plugin

Dans la methode `setup()` de votre plugin, enregistrez le systeme :

```java
public class MonPlugin extends JavaPlugin {

    public MonPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer le systeme d'evenement de degats
        getEntityStoreRegistry().registerSystem(new DamageSystem());
    }
}
```

## Exemples avances

### Utiliser les MetaKeys

```java
@Override
public void handle(..., @Nonnull Damage event) {
    // Obtenir l'emplacement du coup
    Vector4d hitLocation = event.getMeta(Damage.HIT_LOCATION);
    if (hitLocation != null) {
        System.out.println("Coup a : " + hitLocation);
    }

    // Verifier si les degats ont ete bloques
    Boolean blocked = event.getMeta(Damage.BLOCKED);
    if (Boolean.TRUE.equals(blocked)) {
        // Les degats ont ete bloques par un bouclier/armure
        return;
    }

    // Definir un recul personnalise
    KnockbackComponent knockback = new KnockbackComponent(...);
    event.setMeta(Damage.KNOCKBACK_COMPONENT, knockback);

    // Definir une icone de mort personnalisee
    event.setMeta(Damage.DEATH_ICON, "icons/custom_death");
}
```

### Gerer les degats de projectile

```java
@Override
public void handle(..., @Nonnull Damage event) {
    Damage.Source source = event.getSource();

    if (source instanceof Damage.ProjectileSource projectileSource) {
        // Obtenir l'entite tireur
        Ref<EntityStore> shooter = projectileSource.getRef();

        // Obtenir l'entite projectile
        Ref<EntityStore> projectile = projectileSource.getProjectile();

        // Exemple : Doubler les degats pour les headshots
        Float hitAngle = event.getMeta(Damage.HIT_ANGLE);
        if (hitAngle != null && isHeadshot(hitAngle)) {
            event.setAmount(event.getAmount() * 2.0f);
            event.setMeta(Damage.DEATH_ICON, "icons/headshot");
        }
    }
}
```

## Cas d'utilisation courants

- **Reduction/amplification des degats** - Modifier les degats en fonction de l'armure, des buffs ou des regles du jeu
- **Immunite aux degats** - Annuler les degats pour les entites invulnerables ou les zones protegees
- **Controle PvP** - Empecher ou modifier les degats joueur-contre-joueur
- **Journalisation des degats** - Suivre tous les degats pour les statistiques ou le debogage
- **Messages de mort personnalises** - Modifier la facon dont les morts sont rapportees
- **Modification du recul** - Changer le comportement du recul en fonction de la source de degats
- **Detection des headshots** - Utiliser les metadonnees d'angle de coup pour detecter les coups critiques
- **Modification des degats environnementaux** - Reduire les degats de chute, de feu, etc.
- **Mise a l'echelle des degats basee sur la source** - Differents modificateurs de degats selon le type d'attaquant

## Comportement de l'annulation

Lorsque l'evenement est annule en appelant `setCancelled(true)` :

- L'entite ne subira **aucun** degat
- La sante reste inchangee
- Les messages de mort ne sont pas generes
- Les evenements du kill feed ne sont pas declenches
- Le recul peut encore etre applique (selon l'implementation)
- Les effets visuels/audio peuvent encore etre joues

Ceci est utile pour :
- Implementer le mode dieu ou l'invincibilite
- Les zones protegees ou les entites ne peuvent pas etre endommagees
- Les modes de jeu personnalises avec des regles de degats uniques
- Implementer des mecaniques d'absorption de degats

## Classes liees

- `DamageCause` - Asset definissant la cause/type de degats
- `KillFeedEvent` - Evenements pour les messages de mort/kill
- `KnockbackComponent` - Composant pour la physique du recul

## Evenements lies

- [KillFeedEvent](./kill-feed-event) - Declenche lors de l'affichage des messages de mort/kill
- [EntityRemoveEvent](../entity/entity-remove-event) - Declenche lorsqu'une entite est supprimee (y compris la mort)

## Reference source

`decompiled/com/hypixel/hytale/server/core/modules/entity/damage/Damage.java:24`
