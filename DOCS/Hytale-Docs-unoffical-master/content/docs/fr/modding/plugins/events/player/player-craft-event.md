---
id: player-craft-event
title: PlayerCraftEvent
sidebar_label: PlayerCraftEvent
---

# PlayerCraftEvent

:::warning Obsolete
Cet événement est obsolete et marque pour suppression. Envisagez d'utiliser [CraftRecipeEvent](../ecs/craft-recipe-event) dans le systeme d'événements ECS a la place.
:::

Déclenché lorsqu'un joueur fabrique un objet. Cet événement fournit des informations sur la recette en cours de fabrication et la quantite d'objets produits.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.player.PlayerCraftEvent` |
| **Classe parente** | `PlayerEvent<String>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Obsolete** | Oui (marque pour suppression) |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerCraftEvent.java:12` |

## Declaration

```java
@Deprecated(
   forRemoval = true
)
public class PlayerCraftEvent extends PlayerEvent<String> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `playerRef` | `Ref<EntityStore>` | `getPlayerRef()` | Référence vers le magasin d'entite du joueur (hérité de PlayerEvent) |
| `player` | `Player` | `getPlayer()` | L'objet joueur (hérité de PlayerEvent) |
| `craftedRecipe` | `CraftingRecipe` | `getCraftedRecipe()` | La recette qui a ete fabriquee |
| `quantity` | `int` | `getQuantity()` | Le nombre d'objets fabriques |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getPlayerRef` | `@Nonnull public Ref<EntityStore> getPlayerRef()` | Retourne la reference du magasin d'entite du joueur (hérité) |
| `getPlayer` | `@Nonnull public Player getPlayer()` | Retourne l'objet joueur (hérité) |
| `getCraftedRecipe` | `public CraftingRecipe getCraftedRecipe()` | Retourne la recette qui a ete fabriquee |
| `getQuantity` | `public int getQuantity()` | Retourne le nombre d'objets produits |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de cet evenement |

## Exemple d'utilisation

```java
// Enregistrer un handler pour les événements de fabrication (approche obsolete)
eventBus.register(PlayerCraftEvent.class, event -> {
    Player player = event.getPlayer();
    CraftingRecipe recipe = event.getCraftedRecipe();
    int quantity = event.getQuantity();

    // Journaliser l'action de fabrication
    logger.info(player.getName() + " crafted " + quantity + "x " + recipe.getOutputItem());

    // Suivre les statistiques de fabrication
    incrementCraftingStats(player, recipe, quantity);

    // Accorder de l'experience de fabrication
    awardCraftingXP(player, recipe);

    // Verifier les succes de fabrication
    checkCraftingAchievements(player, recipe);
});

// Systeme de tutoriel de fabrication
eventBus.register(PlayerCraftEvent.class, event -> {
    Player player = event.getPlayer();
    CraftingRecipe recipe = event.getCraftedRecipe();

    // Suivre les premieres fabrications pour les tutoriels
    if (isFirstTimeCrafting(player, recipe)) {
        showCraftingTutorial(player, recipe);
        markRecipeAsLearned(player, recipe);
    }
});

// Suivi des quetes
eventBus.register(PlayerCraftEvent.class, event -> {
    Player player = event.getPlayer();
    CraftingRecipe recipe = event.getCraftedRecipe();
    int quantity = event.getQuantity();

    // Mettre a jour la progression des quetes
    updateQuestProgress(player, "craft", recipe.getId(), quantity);
});
```

## Cas d'utilisation courants

- Suivi des statistiques de fabrication
- Attribution de points d'experience de fabrication
- Verification des succes de fabrication
- Suivi de progression des quetes
- Journalisation de l'activite de fabrication
- Systemes de tutoriel pour les premieres fabrications

## Guide de migration

Cet événement est obsolete et sera supprime dans une version future. Migrez vers l'utilisation de `CraftRecipeEvent` du systeme d'événements ECS :

```java
// Ancienne approche (obsolete)
eventBus.register(PlayerCraftEvent.class, event -> {
    Player player = event.getPlayer();
    CraftingRecipe recipe = event.getCraftedRecipe();
    // Gerer la fabrication
});

// Nouvelle approche utilisant les événements ECS
// CraftRecipeEvent.Pre - annulable, se declenche avant la fabrication
// CraftRecipeEvent.Post - se declenche apres la fin de la fabrication
```

## Événements lies

- [CraftRecipeEvent](../ecs/craft-recipe-event) - L'événement de fabrication base sur ECS de remplacement
- [LivingEntityInventoryChangeEvent](../entity/living-entity-inventory-change-event) - Pour suivre les changements d'inventaire

## Notes

Comme cet événement n'est pas annulable, vous ne pouvez pas empêcher la fabrication via cet événement. Si vous devez empêcher ou modifier le comportement de fabrication, utilisez `CraftRecipeEvent.Pre` du systeme ECS a la place, qui implemente `ICancellableEcsEvent`.

L'annotation de deprecation inclut `forRemoval = true`, indiquant que cet événement sera supprime dans une version future. Planifiez votre migration en consequence.

## Test

:::tip Testé
**17 janvier 2026** - Vérifié avec le plugin doc-test. Toutes les méthodes documentées fonctionnent correctement.
:::

Pour tester cet événement :
1. Exécutez `/doctest test-player-craft-event`
2. Ouvrez une table de craft ou utilisez la grille de craft 2x2 de l'inventaire
3. Fabriquez n'importe quel objet (ex: une pioche rudimentaire avec des gravas, fibres et bâtons)
4. L'événement devrait se déclencher et afficher les détails dans le chat

## Détails internes

### Structure de CraftingRecipe

La méthode `getCraftedRecipe()` retourne un objet `CraftingRecipe` avec les propriétés suivantes (observées lors des tests) :

```java
CraftingRecipe {
    input: List<MaterialQuantity>     // Matériaux requis
    primaryOutput: MaterialQuantity   // Objet de sortie principal
    extraOutputs: List<MaterialQuantity>  // Sorties additionnelles
    outputQuantity: int               // Nombre d'objets produits
    benchRequirement: List<BenchRequirement>  // Station de craft requise
    timeSeconds: float                // Durée de fabrication (ex: 1.0)
    knowledgeRequired: boolean        // Si la connaissance de la recette est nécessaire
    requiredMemoriesLevel: int        // Niveau de mémoire requis
}
```

Chaque `MaterialQuantity` contient :
- `itemId` : ID d'objet spécifique (ex: `"Tool_Pickaxe_Crude"`, `"Ingredient_Fibre"`)
- `resourceTypeId` : Type de ressource (ex: `"Rubble"`) - utilisé quand itemId est null
- `tag` : Tag d'objet optionnel
- `quantity` : Nombre d'objets
- `metadata` : Métadonnées optionnelles

### Où l'événement est déclenché

L'événement est dispatché dans la méthode `CraftingManager.craftItem()` :

**Fichier :** `com/hypixel/hytale/builtin/crafting/component/CraftingManager.java:185-190`

```java
IEventDispatcher<PlayerCraftEvent, PlayerCraftEvent> dispatcher = HytaleServer.get()
    .getEventBus()
    .dispatchFor(PlayerCraftEvent.class, world.getName());
if (dispatcher.hasListener()) {
    dispatcher.dispatch(new PlayerCraftEvent(ref, playerComponent, recipe, quantity));
}
```

### Chaîne de traitement des événements

1. `CraftRecipeEvent.Pre` se déclenche (annulable) - peut empêcher le craft
2. Les matériaux et le banc sont validés
3. `CraftRecipeEvent.Post` se déclenche (annulable) - peut annuler après validation
4. Si non annulé, `giveOutput()` donne les objets au joueur
5. **`PlayerCraftEvent` se déclenche** (informationnel, non annulable)

### Hiérarchie de classes

```
PlayerCraftEvent
  └── extends PlayerEvent<String>
        └── implements IEvent<String>
              └── extends IBaseEvent<String>
```

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/player/PlayerCraftEvent.java:12`

---

> **Dernière mise à jour :** 17 janvier 2026 - Testé et vérifié. Ajout des détails internes et de la structure CraftingRecipe.
