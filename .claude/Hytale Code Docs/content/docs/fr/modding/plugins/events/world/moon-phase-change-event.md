---
id: moon-phase-change-event
title: MoonPhaseChangeEvent
sidebar_label: MoonPhaseChangeEvent
description: Evenement déclenché lorsque la phase lunaire change dans le monde
---

# MoonPhaseChangeEvent

> **Testé :** 18 janvier 2026 - Vérifié avec le plugin doc-test

L'événement `MoonPhaseChangeEvent` est déclenché lorsque la phase lunaire change dans le monde. C'est un événement ECS (Entity Component System) qui etend `EcsEvent`, fournissant des informations sur la nouvelle phase lunaire. Cet événement n'est pas annulable.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.ecs.MoonPhaseChangeEvent` |
| **Classe parente** | `EcsEvent` |
| **Annulable** | Non |
| **Type d'événement** | Evenement ECS |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/MoonPhaseChangeEvent.java:5` |

## Declaration

```java
public class MoonPhaseChangeEvent extends EcsEvent {
   private final int newMoonPhase;

   public MoonPhaseChangeEvent(int newMoonPhase) {
      this.newMoonPhase = newMoonPhase;
   }

   public int getNewMoonPhase() {
      return this.newMoonPhase;
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `newMoonPhase` | `int` | `getNewMoonPhase()` | La nouvelle valeur de phase lunaire |

## Méthodes

### getNewMoonPhase()

```java
public int getNewMoonPhase()
```

Retourne la nouvelle valeur de phase lunaire. Les phases lunaires parcourent typiquement un nombre fixe de valeurs representant les differentes phases du cycle lunaire.

**Retourne :** `int` - L'index de la nouvelle phase lunaire

## Valeurs des phases lunaires

Bien que les valeurs exactes des phases lunaires dependent de l'implementation, les phases lunaires typiques dans les jeux suivent un schema similaire a :

| Valeur de phase | Nom de la phase | Description |
|-----------------|-----------------|-------------|
| 0 | Nouvelle lune | La lune n'est pas visible |
| 1 | Premier croissant | Petite partie visible a droite |
| 2 | Premier quartier | Moitie droite visible |
| 3 | Lune gibbeuse croissante | La majeure partie du cote droit est visible |
| 4 | Pleine lune | Lune entierement visible |
| 5 | Lune gibbeuse decroissante | La majeure partie du cote gauche est visible |
| 6 | Dernier quartier | Moitie gauche visible |
| 7 | Dernier croissant | Petite partie visible a gauche |

**Note :** Les valeurs reelles des phases et leurs significations peuvent varier. Consultez la documentation du jeu pour les valeurs exactes.

## Systeme d'événements ECS

Cet événement fait partie de l'architecture d'événements ECS (Entity Component System) de Hytale :

```java
public abstract class EcsEvent {
   public EcsEvent() {
   }
}
```

Contrairement a `CancellableEcsEvent`, cet événement ne peut pas etre annule car les changements de phase lunaire sont determines par le systeme de temps du jeu.

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.events.ecs.MoonPhaseChangeEvent;

// Enregistrer un listener d'événement ECS pour les changements de phase lunaire
ecsEventManager.register(MoonPhaseChangeEvent.class, event -> {
    int newPhase = event.getNewMoonPhase();

    // Journaliser le changement de phase
    System.out.println("Phase lunaire changee en : " + getMoonPhaseName(newPhase));

    // Exemple : Déclenchér des événements bases sur la phase lunaire
    switch (newPhase) {
        case 0: // Nouvelle lune
            triggerNewMoonEvents();
            break;
        case 4: // Pleine lune
            triggerFullMoonEvents();
            break;
    }

    // Exemple : Ajuster l'apparition des mobs selon la phase lunaire
    adjustMobSpawning(newPhase);

    // Exemple : Mettre a jour l'eclairage ambiant
    updateAmbientLighting(newPhase);
});

private String getMoonPhaseName(int phase) {
    String[] phases = {
        "Nouvelle lune", "Premier croissant", "Premier quartier", "Lune gibbeuse croissante",
        "Pleine lune", "Lune gibbeuse decroissante", "Dernier quartier", "Dernier croissant"
    };
    return phase >= 0 && phase < phases.length ? phases[phase] : "Inconnue";
}

private void triggerNewMoonEvents() {
    // Événements speciaux pendant la nouvelle lune
    // Exemple : Nuits plus sombres, apparitions de mobs speciales
}

private void triggerFullMoonEvents() {
    // Événements speciaux pendant la pleine lune
    // Exemple : Loups-garous, augmentation des apparitions de mobs, quetes speciales
}

private void adjustMobSpawning(int phase) {
    // Ajuster les taux d'apparition des mobs selon la phase lunaire
    // La pleine lune peut augmenter les apparitions de mobs hostiles
    // La nouvelle lune peut diminuer les apparitions dependant de la visibilite
}

private void updateAmbientLighting(int phase) {
    // Ajuster l'eclairage ambiant nocturne selon la luminosite de la lune
}
```

## Quand cet événement se déclenché

L'événement `MoonPhaseChangeEvent` est dispatche lorsque :

1. Le systeme de temps du jeu passe a un nouveau cycle jour/nuit
2. La phase lunaire progresse naturellement dans le cadre du cycle lunaire
3. Des commandes administratives forcent un changement de phase lunaire
4. Le temps du monde est modifie significativement, causant un saut de phase

L'événement se déclenché **apres** que la phase lunaire a change, permettant aux handlers de reagir au nouvel etat.

## Applications de gameplay

Les phases lunaires peuvent affecter divers systemes de gameplay :

### Comportement des mobs
- Les taux d'apparition des mobs hostiles peuvent augmenter pendant les pleines lunes
- Certaines creatures peuvent n'apparaitre que pendant des phases specifiques
- L'agressivite ou les comportements des mobs peuvent changer

### Effets environnementaux
- La luminosite nocturne varie avec la phase lunaire
- Effets visuels comme l'intensite du clair de lune
- Les conditions meteorologiques peuvent etre influencees

### Mecaniques de jeu
- Recettes d'artisanat necessitant des phases lunaires specifiques
- Quetes ou événements lies aux cycles lunaires
- Collecte de ressources affectee par la phase lunaire

### Effets sur les joueurs
- Buffs ou debuffs bases sur la phase lunaire
- Changements de visibilite pendant differentes phases
- Mecaniques de sommeil potentiellement affectees

## Événements associes

- [ChunkPreLoadProcessEvent](./chunk-pre-load-process-event) - Déclenché lorsqu'un chunk est en cours de chargement
- [ChunkSaveEvent](./chunk-save-event) - Déclenché lorsqu'un chunk est en cours de sauvegarde
- [ChunkUnloadEvent](./chunk-unload-event) - Déclenché lorsqu'un chunk est en cours de dechargement

## Cas d'utilisation courants

### Événements speciaux de pleine lune

```java
ecsEventManager.register(MoonPhaseChangeEvent.class, event -> {
    if (event.getNewMoonPhase() == FULL_MOON) {
        // Demarrer l'événement de pleine lune
        startFullMoonEvent();
        broadcastMessage("La pleine lune se leve... mefiez-vous des creatures de la nuit !");
    }
});
```

### Multiplicateur d'apparition de mobs

```java
ecsEventManager.register(MoonPhaseChangeEvent.class, event -> {
    int phase = event.getNewMoonPhase();

    // Calculer le multiplicateur d'apparition base sur la luminosite de la lune
    double multiplier = calculateMoonBrightness(phase);
    mobSpawner.setSpawnMultiplier(multiplier);
});

private double calculateMoonBrightness(int phase) {
    // Pleine lune (phase 4) = 1.0, Nouvelle lune (phase 0) = 0.0
    return Math.cos((phase * Math.PI) / 4.0) * 0.5 + 0.5;
}
```

### Systeme de calendrier lunaire

```java
ecsEventManager.register(MoonPhaseChangeEvent.class, event -> {
    int phase = event.getNewMoonPhase();

    // Suivre le calendrier lunaire pour les fonctionnalites basees sur le temps
    lunarCalendar.advancePhase(phase);

    // Notifier les joueurs de la nouvelle phase
    for (Player player : getOnlinePlayers()) {
        player.sendMessage("La lune entre dans sa phase de " + getMoonPhaseName(phase) + ".");
    }
});
```

### Déclenchéurs de succes/quetes

```java
ecsEventManager.register(MoonPhaseChangeEvent.class, event -> {
    int phase = event.getNewMoonPhase();

    // Verifier les succes specifiques a la phase
    for (Player player : getOnlinePlayers()) {
        checkMoonPhaseAchievements(player, phase);
        updateMoonPhaseQuests(player, phase);
    }
});
```

## Détails internes

### Où l'événement est déclenché

Le `MoonPhaseChangeEvent` est déclenché depuis `WorldTimeResource.setMoonPhase()` :

```java
// Depuis WorldTimeResource.java (lignes 122-129)
public void setMoonPhase(int moonPhase, @Nonnull ComponentAccessor<EntityStore> componentAccessor) {
   if (moonPhase != this.moonPhase) {
      MoonPhaseChangeEvent event = new MoonPhaseChangeEvent(moonPhase);
      componentAccessor.invoke(event);
   }
   this.moonPhase = moonPhase;
}
```

L'événement n'est déclenché que lorsque la nouvelle phase diffère de la phase actuelle.

### Chaîne de traitement de l'événement

1. `WorldTimeResource.tick()` est appelé à chaque tick du jeu
2. Si le temps n'est pas en pause, `updateMoonPhase()` est appelé
3. `updateMoonPhase()` calcule la nouvelle phase en fonction de la progression du jour
4. `setMoonPhase()` est appelé, ce qui déclenche l'événement si la phase a changé

### Hiérarchie de classes

```
MoonPhaseChangeEvent
    └── extends EcsEvent
            └── extends Object
```

### Écouter avec WorldEventSystem

C'est un **événement au niveau du monde**, pas un événement au niveau des entités. Pour l'écouter, utilisez `WorldEventSystem` :

```java
import com.hypixel.hytale.component.CommandBuffer;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.component.system.WorldEventSystem;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.universe.world.events.ecs.MoonPhaseChangeEvent;

public class MoonPhaseChangeSystem extends WorldEventSystem<EntityStore, MoonPhaseChangeEvent> {

    public MoonPhaseChangeSystem() {
        super(MoonPhaseChangeEvent.class);
    }

    @Override
    public void handle(
            @Nonnull Store<EntityStore> store,
            @Nonnull CommandBuffer<EntityStore> commandBuffer,
            @Nonnull MoonPhaseChangeEvent event
    ) {
        int newPhase = event.getNewMoonPhase();
        // Gérer le changement de phase lunaire
    }
}
```

Enregistrez le système dans votre plugin :

```java
getEntityStoreRegistry().registerSystem(new MoonPhaseChangeSystem());
```

## Test

Pour tester cet événement avec le plugin doc-test :

1. Exécutez `/doctest test-moon-phase-change-event`
2. La commande affichera la phase lunaire actuelle
3. Elle changera automatiquement vers la phase suivante
4. L'événement se déclenche et affiche les détails de la nouvelle phase

## Référence source

- **Définition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/ecs/MoonPhaseChangeEvent.java`
- **Base EcsEvent :** `decompiled/com/hypixel/hytale/component/system/EcsEvent.java`
- **Lieu de déclenchement :** `decompiled/com/hypixel/hytale/server/core/modules/time/WorldTimeResource.java:122`

---

> **Dernière mise à jour :** 18 janvier 2026 - Testé et vérifié. Ajout des détails internes et de l'exemple WorldEventSystem.
