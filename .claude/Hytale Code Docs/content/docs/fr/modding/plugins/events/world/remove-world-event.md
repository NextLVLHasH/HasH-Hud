---
id: remove-world-event
title: RemoveWorldEvent
sidebar_label: RemoveWorldEvent
description: Evenement déclenché lors de la suppression d'un monde du serveur
---

# RemoveWorldEvent

L'événement `RemoveWorldEvent` est déclenché lorsqu'un monde est en cours de suppression de l'univers du serveur. Cet événement fournit des informations sur la raison de la suppression du monde et permet une annulation conditionnelle basee sur cette raison.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.universe.world.events.RemoveWorldEvent` |
| **Classe parente** | `WorldEvent` |
| **Implemente** | `ICancellable` |
| **Annulable** | Oui (conditionnel selon RemovalReason) |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/universe/world/events/RemoveWorldEvent.java:7` |

## Declaration

```java
public class RemoveWorldEvent extends WorldEvent implements ICancellable {
   private boolean cancelled;
   @Nonnull
   private final RemoveWorldEvent.RemovalReason removalReason;

   public RemoveWorldEvent(@Nonnull World world, @Nonnull RemoveWorldEvent.RemovalReason removalReason) {
      super(world);
      this.removalReason = removalReason;
   }

   @Nonnull
   public RemoveWorldEvent.RemovalReason getRemovalReason() {
      return this.removalReason;
   }

   @Override
   public boolean isCancelled() {
      // Les suppressions EXCEPTIONAL ne peuvent pas etre annulees - retourne toujours false
      return this.removalReason == RemoveWorldEvent.RemovalReason.EXCEPTIONAL ? false : this.cancelled;
   }

   @Override
   public void setCancelled(boolean cancelled) {
      this.cancelled = cancelled;
   }

   @Nonnull
   @Override
   public String toString() {
      return "RemoveWorldEvent{cancelled=" + this.cancelled + "} " + super.toString();
   }

   public static enum RemovalReason {
      GENERAL,
      EXCEPTIONAL;

      private RemovalReason() {
      }
   }
}
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `cancelled` | `boolean` | `isCancelled()` | Indique si l'événement a ete annule |
| `removalReason` | `RemoveWorldEvent.RemovalReason` | `getRemovalReason()` | La raison pour laquelle le monde est supprime |

## Champs hérités

De `WorldEvent` :

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `world` | `World` | `getWorld()` | Le monde en cours de suppression du serveur |

## Méthodes

### isCancelled()

```java
public boolean isCancelled()
```

Retourne si l'événement a ete annule.

**Retourne :** `boolean` - `true` si la suppression du monde a ete annulee, `false` sinon

### setCancelled(boolean)

```java
public void setCancelled(boolean cancelled)
```

Definit si l'événement doit etre annule. Notez que l'annulation peut etre conditionnelle selon la `RemovalReason`. Les suppressions exceptionnelles peuvent ne pas etre annulables.

**Parametres :**
- `cancelled` - `true` pour tenter d'annuler la suppression du monde, `false` pour l'autoriser

### getRemovalReason()

```java
@Nonnull
public RemoveWorldEvent.RemovalReason getRemovalReason()
```

Retourne la raison pour laquelle le monde est supprime.

**Retourne :** `RemoveWorldEvent.RemovalReason` - La valeur enum de la raison de suppression

### getWorld()

```java
public World getWorld()
```

Hérité de `WorldEvent`. Retourne le monde qui est en cours de suppression.

**Retourne :** `World` - L'instance du monde en cours de suppression du serveur

## Classes internes

### RemovalReason (enum)

L'enum `RemovalReason` indique pourquoi le monde est supprime du serveur.

```java
public static enum RemovalReason {
   GENERAL,
   EXCEPTIONAL;
}
```

| Valeur | Description |
|--------|-------------|
| `GENERAL` | Suppression normale du monde, généralement initiee par des plugins ou des operations standard du serveur. Ce type de suppression peut généralement etre annule. |
| `EXCEPTIONAL` | Suppression due a une circonstance exceptionnelle comme une erreur ou une defaillance critique. Ce type de suppression peut ne pas etre annulable pour garantir la stabilite du serveur. |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.universe.world.events.RemoveWorldEvent;
import com.hypixel.hytale.event.EventPriority;

// Enregistrer un listener pour controler les suppressions de mondes
eventBus.register(EventPriority.NORMAL, RemoveWorldEvent.class, event -> {
    World world = event.getWorld();
    RemoveWorldEvent.RemovalReason reason = event.getRemovalReason();

    // Journaliser toutes les suppressions de mondes
    System.out.println("Suppression de monde demandee : " + world.getName() +
                       " (Raison : " + reason + ")");

    // Essayer d'annuler uniquement les suppressions GENERAL (EXCEPTIONAL peut ne pas etre annulable)
    if (reason == RemoveWorldEvent.RemovalReason.GENERAL) {
        // Exemple : Empecher la suppression des mondes proteges
        if (isProtectedWorld(world)) {
            event.setCancelled(true);
            System.out.println("Suppression bloquee du monde protege : " + world.getName());
            return;
        }

        // Exemple : Empecher la suppression si des joueurs sont encore dans le monde
        if (world.getPlayerCount() > 0) {
            event.setCancelled(true);
            System.out.println("Impossible de supprimer le monde avec des joueurs actifs : " + world.getName());
            return;
        }
    } else {
        // Suppressions EXCEPTIONAL - généralement ne peuvent pas etre empechees
        System.out.println("La suppression exceptionnelle du monde ne peut pas etre annulee");
    }
});

private boolean isProtectedWorld(World world) {
    // Logique personnalisee pour determiner si le monde est protege
    return world.getName().equals("spawn") || world.getName().equals("hub");
}
```

## Quand cet événement se déclenché

L'événement `RemoveWorldEvent` est dispatche lorsque :

1. Un monde est en cours de desenregistrement du systeme d'univers du serveur
2. Pendant l'arret du serveur lorsque les mondes sont nettoyes
3. Lorsque des plugins demandent programmatiquement la suppression d'un monde
4. Lorsqu'une erreur ou condition exceptionnelle necessite la suppression d'un monde (raison `EXCEPTIONAL`)
5. Lorsque la gestion dynamique des mondes supprime des mondes temporaires ou d'instance

L'événement se déclenché **avant** que le monde soit complètement supprime, permettant aux handlers de potentiellement annuler l'operation.

## Comportement de l'annulation

Lorsque l'événement est annule :
- Le monde restera charge et accessible (pour les suppressions `GENERAL`)
- Les joueurs peuvent continuer a interagir avec le monde
- Le monde restera dans la liste des mondes du serveur

**Important :** L'annulation des suppressions `EXCEPTIONAL` peut etre ignoree par le systeme pour garantir la stabilite du serveur. Verifiez toujours la `RemovalReason` avant de tenter d'annuler.

## Événements associes

- [AddWorldEvent](./add-world-event) - Déclenché lorsqu'un monde est en cours d'ajout
- [StartWorldEvent](./start-world-event) - Déclenché lorsqu'un monde demarre
- [AllWorldsLoadedEvent](./all-worlds-loaded-event) - Déclenché lorsque tous les mondes configures ont ete charges

## Exemples pratiques

### Ecouter la suppression de monde (Verifie fonctionnel)

```java
// Enregistrer un listener global pour RemoveWorldEvent
eventBus.registerGlobal(RemoveWorldEvent.class, event -> {
    String worldName = event.getWorld().getName();
    RemoveWorldEvent.RemovalReason reason = event.getRemovalReason();
    boolean cancelled = event.isCancelled();

    System.out.println("RemoveWorldEvent declenche !");
    System.out.println("  Monde : " + worldName);
    System.out.println("  Raison : " + reason.name());
    System.out.println("  Annule : " + cancelled);
});
```

### Declencher l'evenement programmatiquement

```java
// RemoveWorldEvent est declenche lors de l'appel a Universe.removeWorld()
Universe universe = Universe.get();

// Suppression GENERAL - peut etre annulee par les listeners
boolean removed = universe.removeWorld("nom_du_monde");
if (removed) {
    System.out.println("Monde supprime avec succes");
} else {
    System.out.println("La suppression du monde a ete annulee par un listener");
}

// Suppression EXCEPTIONAL - ne peut pas etre annulee, utilisee pour la recuperation d'erreurs
universe.removeWorldExceptionally("nom_du_monde");
```

### Ou l'evenement est declenche (Interne)

L'evenement est declenche a deux endroits dans `Universe.java` :

1. **`Universe.removeWorld(String name)`** (ligne ~537-561) - Declenche avec `RemovalReason.GENERAL`, verifie `isCancelled()` et retourne `false` si annule
2. **`Universe.removeWorldExceptionally(String name)`** (ligne ~563-583) - Declenche avec `RemovalReason.EXCEPTIONAL`, ignore l'annulation

## Test

> **Teste :** 18 janvier 2026 - Verifie avec le plugin doc-test

Pour tester cet evenement :

1. Creer d'abord un monde de test :
   ```
   /world create doctest_temp_world
   ```

2. Executer la commande de test :
   ```
   /doctest test-remove-world-event
   ```

3. La commande supprimera le monde de test et affichera les details de l'evenement

**Sortie attendue :**
- `[SUCCESS] RemoveWorldEvent detected!`
- Details de l'evenement incluant le nom du monde, removalReason (GENERAL), et l'etat isCancelled

## Référence source

- **Definition de l'événement :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/RemoveWorldEvent.java`
- **Classe parente :** `decompiled/com/hypixel/hytale/server/core/universe/world/events/WorldEvent.java`
- **Interface Cancellable :** `decompiled/com/hypixel/hytale/event/ICancellable.java`

> **Dernière mise a jour :** 18 janvier 2026 - Teste et verifie. Ajout d'exemples pratiques et instructions de test.
