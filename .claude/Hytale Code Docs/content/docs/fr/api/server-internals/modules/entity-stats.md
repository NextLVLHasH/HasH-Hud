---
id: entity-stats
title: Système de Stats d'Entité
sidebar_label: Stats d'Entité
sidebar_position: 6
description: Documentation complète du système de stats d'entité Hytale pour la santé, le mana, l'endurance et les stats personnalisées
---

# Système de Stats d'Entité

Le système de Stats d'Entité dans Hytale fournit une manière flexible de gérer les attributs des entités comme la santé, le mana, l'endurance et les stats personnalisées. Ce système est construit sur l'architecture ECS (Entity Component System).

## Types de Stats par Défaut

Hytale définit six types de stats d'entité par défaut :

| Nom de la Stat | Description | Méthode d'accès |
|----------------|-------------|-----------------|
| `Health` | Points de vie de l'entité | `DefaultEntityStatTypes.getHealth()` |
| `Oxygen` | Niveau d'oxygène (respiration sous-marine) | `DefaultEntityStatTypes.getOxygen()` |
| `Stamina` | Endurance pour les actions | `DefaultEntityStatTypes.getStamina()` |
| `Mana` | Énergie magique | `DefaultEntityStatTypes.getMana()` |
| `SignatureEnergy` | Énergie de capacité spéciale | `DefaultEntityStatTypes.getSignatureEnergy()` |
| `Ammo` | Nombre de munitions | `DefaultEntityStatTypes.getAmmo()` |

**Source:** `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes`

## Propriétés d'EntityStatType

Chaque type de stat est défini avec les propriétés suivantes :

```java
public class EntityStatType {
    String id;              // Identifiant unique (ex: "Health")
    float initialValue;     // Valeur de départ
    float min;              // Valeur minimum
    float max;              // Valeur maximum
    boolean shared;         // Si la stat est synchronisée aux autres joueurs
    Regenerating[] regenerating;  // Règles de régénération auto
    EntityStatEffects minValueEffects;  // Effets quand la stat atteint le min
    EntityStatEffects maxValueEffects;  // Effets quand la stat atteint le max
    EntityStatResetBehavior resetBehavior;  // Comment la stat se réinitialise
    boolean ignoreInvulnerability;  // Si les dégâts ignorent l'invulnérabilité
}
```

## Composant EntityStatMap

L'`EntityStatMap` est un composant ECS qui stocke toutes les stats d'une entité :

```java
// Obtenir le type de composant
ComponentType<EntityStore, EntityStatMap> componentType = EntityStatMap.getComponentType();

// Obtenir la map de stats d'une entité depuis le store
EntityStatMap statMap = store.getComponent(entityRef, componentType);
```

## Modifier les Stats

### Définir une Valeur de Stat

```java
// Définir la stat à une valeur spécifique
float previousValue = statMap.setStatValue(statIndex, newValue);

// Avec prédictabilité (pour la prédiction client)
statMap.setStatValue(EntityStatMap.Predictable.SELF, statIndex, newValue);
```

### Ajouter à une Stat

```java
// Ajouter un montant à la stat (peut être négatif)
float newValue = statMap.addStatValue(statIndex, amount);

// Soustraire de la stat
float newValue = statMap.subtractStatValue(statIndex, amount);
```

### Opérations Min/Max

```java
// Définir la stat à sa valeur minimum
statMap.minimizeStatValue(statIndex);

// Définir la stat à sa valeur maximum
statMap.maximizeStatValue(statIndex);

// Réinitialiser la stat selon son comportement de reset
statMap.resetStatValue(statIndex);
```

### Obtenir les Valeurs de Stats

```java
// Obtenir la valeur de stat par index
EntityStatValue statValue = statMap.get(statIndex);

// Obtenir la valeur actuelle
float current = statValue.get();

// Obtenir en pourcentage (0.0 à 1.0)
float percentage = statValue.asPercentage();

// Obtenir les bornes min/max
float min = statValue.getMin();
float max = statValue.getMax();
```

### Obtenir l'Index d'une Stat par Nom

```java
// Obtenir la map d'assets
IndexedLookupTableAssetMap<String, EntityStatType> assetMap = EntityStatType.getAssetMap();

// Obtenir l'index pour un nom de stat
int healthIndex = assetMap.getIndex("Health");
int manaIndex = assetMap.getIndex("Mana");

// Ou utiliser les accesseurs par défaut
int healthIndex = DefaultEntityStatTypes.getHealth();
```

## Modificateurs de Stats

Les modificateurs permettent des changements temporaires ou conditionnels aux stats :

```java
// Ajouter un modificateur
statMap.putModifier(statIndex, "myModifierKey", modifier);

// Supprimer un modificateur
Modifier removed = statMap.removeModifier(statIndex, "myModifierKey");

// Obtenir un modificateur
Modifier modifier = statMap.getModifier(statIndex, "myModifierKey");
```

### Types de Modificateurs

```java
public class StaticModifier implements Modifier {
    ModifierTarget target;     // MIN, MAX, ou VALUE
    CalculationType calculationType;  // ADDITIVE ou MULTIPLICATIVE
    float amount;
}
```

**Types de Calcul :**
- `ADDITIVE` - Ajoute le montant à la stat
- `MULTIPLICATIVE` - Multiplie la stat par (1 + montant)

**Cibles de Modificateur :**
- `MIN` - Modifie la borne minimum
- `MAX` - Modifie la borne maximum

## Système de Régénération

Les stats peuvent se régénérer automatiquement dans le temps :

```java
public class Regenerating {
    float interval;           // Temps entre les ticks de régénération
    float amount;            // Montant à régénérer
    boolean clampAtZero;     // Empêcher de descendre sous zéro
    RegenType regenType;     // ADDITIVE ou PERCENTAGE
    Condition[] conditions;  // Quand régénérer
    RegeneratingModifier[] modifiers;  // Modificateurs de régénération
}
```

## Commandes Console

Hytale fournit des commandes console pour gérer les stats :

### Commandes Stats Joueur

| Commande | Description |
|----------|-------------|
| `/player stats set <joueur> <nomStat> <valeur>` | Définir la stat d'un joueur |
| `/player stats get <joueur> <nomStat>` | Obtenir la valeur de stat d'un joueur |
| `/player stats add <joueur> <nomStat> <montant>` | Ajouter à la stat d'un joueur |
| `/player stats sub <joueur> <nomStat> <montant>` | Soustraire de la stat d'un joueur |
| `/player stats reset <joueur> <nomStat>` | Réinitialiser la stat d'un joueur |
| `/player stats settomax <joueur> <nomStat>` | Définir la stat au maximum |
| `/player stats dump <joueur>` | Afficher toutes les stats du joueur |

### Commandes Stats Entité

| Commande | Description |
|----------|-------------|
| `/entity stats set <entité> <nomStat> <valeur>` | Définir la stat d'une entité |
| `/entity stats get <entité> <nomStat>` | Obtenir la valeur de stat d'une entité |
| `/entity stats add <entité> <nomStat> <montant>` | Ajouter à la stat d'une entité |
| `/entity stats reset <entité> <nomStat>` | Réinitialiser la stat d'une entité |
| `/entity stats dump <entité>` | Afficher toutes les stats de l'entité |

## Exemple de Plugin

Voici un exemple complet de gestion de la santé d'un joueur dans un plugin :

```java
public class HealthPlugin extends JavaPlugin {

    public HealthPlugin(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Écouter les événements de dégâts joueur
        getEventRegistry().register(PlayerDamageEvent.class, this::onPlayerDamage);
    }

    private void onPlayerDamage(PlayerDamageEvent event) {
        PlayerRef playerRef = event.getPlayerRef();
        World world = event.getWorld();
        Store<EntityStore> store = world.getEntityStore();

        // Obtenir la map de stats du joueur
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            // Obtenir l'index de la stat de santé
            int healthIndex = DefaultEntityStatTypes.getHealth();

            // Obtenir la santé actuelle
            EntityStatValue health = statMap.get(healthIndex);
            float currentHealth = health.get();

            getLogger().info("Santé du joueur avant dégâts: " + currentHealth);

            // Exemple: Ajouter un modificateur de résistance aux dégâts
            StaticModifier damageResist = new StaticModifier(
                Modifier.ModifierTarget.MAX,
                StaticModifier.CalculationType.MULTIPLICATIVE,
                0.1f  // +10% santé max
            );
            statMap.putModifier(healthIndex, "damage_resist", damageResist);
        }
    }

    // Soigner un joueur à pleine santé
    public void healPlayer(PlayerRef playerRef, Store<EntityStore> store) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int healthIndex = DefaultEntityStatTypes.getHealth();
            statMap.maximizeStatValue(healthIndex);
        }
    }

    // Définir le mana d'un joueur à une valeur spécifique
    public void setMana(PlayerRef playerRef, Store<EntityStore> store, float value) {
        EntityStatMap statMap = store.getComponent(
            playerRef.getReference(),
            EntityStatMap.getComponentType()
        );

        if (statMap != null) {
            int manaIndex = DefaultEntityStatTypes.getMana();
            statMap.setStatValue(manaIndex, value);
        }
    }
}
```

## EntityStatEffects

Effets qui se déclenchent quand une stat atteint le min ou le max :

```java
public class EntityStatEffects {
    boolean triggerAtZero;      // Déclencher quand la stat atteint zéro
    String soundEventId;        // Son à jouer
    ModelParticle[] particles;  // Particules à générer
    String interactions;        // Interactions à exécuter
}
```

## Comportements de Reset

```java
public enum EntityStatResetBehavior {
    InitialValue,  // Réinitialiser à initialValue
    MaxValue       // Réinitialiser au max
}
```

## Synchronisation Réseau

Les stats peuvent être marquées comme `shared` pour être synchronisées sur le réseau :
- **Stats partagées** - Visibles par tous les joueurs (ex: barres de vie)
- **Stats non partagées** - Visibles uniquement par le joueur propriétaire

L'`EntityStatMap` suit les mises à jour avec :
- `selfUpdates` - Mises à jour pour le joueur propriétaire
- `otherUpdates` - Mises à jour pour les autres joueurs (stats partagées uniquement)

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `DefaultEntityStatTypes` | `com.hypixel.hytale.server.core.modules.entitystats.asset.DefaultEntityStatTypes` |
| `EntityStatType` | `com.hypixel.hytale.server.core.modules.entitystats.asset.EntityStatType` |
| `EntityStatMap` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatMap` |
| `EntityStatValue` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatValue` |
| `StaticModifier` | `com.hypixel.hytale.server.core.modules.entitystats.modifier.StaticModifier` |
| `EntityStatsModule` | `com.hypixel.hytale.server.core.modules.entitystats.EntityStatsModule` |
