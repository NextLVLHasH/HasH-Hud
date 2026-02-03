# Systeme de Fabrication

Le systeme de fabrication de Hytale est un framework complet pour definir des recettes, des stations de fabrication et les interactions de fabrication des joueurs. Cette documentation couvre la structure interne et comment travailler avec les recettes et les etablis via des plugins.

## Vue d'ensemble

Le systeme de fabrication est gere par la classe `CraftingPlugin` (`com.hypixel.hytale.builtin.crafting.CraftingPlugin`) qui gere :

- L'enregistrement et la gestion des recettes
- Les registres de recettes par etabli
- L'apprentissage/oubli des recettes pour les joueurs
- Les evenements et paquets de fabrication

## Types de Recettes et Structure

### CraftingRecipe

Les recettes sont definies avec la classe `CraftingRecipe` (`com.hypixel.hytale.server.core.asset.type.item.config.CraftingRecipe`).

#### Proprietes des Recettes

| Propriete | Type | Description |
|-----------|------|-------------|
| `id` | `String` | Identifiant unique de la recette |
| `Input` | `MaterialQuantity[]` | Tableau des materiaux requis en entree |
| `Output` | `MaterialQuantity[]` | Tableau des materiaux de sortie (sorties secondaires) |
| `PrimaryOutput` | `MaterialQuantity` | L'objet de sortie principal |
| `OutputQuantity` | `int` | Quantite de sortie principale (defaut : 1) |
| `BenchRequirement` | `BenchRequirement[]` | Tableau des exigences d'etabli |
| `TimeSeconds` | `float` | Temps de fabrication en secondes (min : 0) |
| `KnowledgeRequired` | `boolean` | Si le joueur doit connaitre la recette |
| `RequiredMemoriesLevel` | `int` | Niveau de memoires du monde requis (commence a 1) |

### MaterialQuantity

Les materiaux sont definis avec la classe `MaterialQuantity` (`com.hypixel.hytale.server.core.inventory.MaterialQuantity`).

| Propriete | Type | Description |
|-----------|------|-------------|
| `ItemId` | `String` | ID d'objet specifique (optionnel) |
| `ResourceTypeId` | `String` | Type de ressource pour correspondance generique (optionnel) |
| `ItemTag` | `String` | Tag d'objet pour correspondance par tag (optionnel) |
| `Quantity` | `int` | Quantite requise (doit etre > 0) |
| `Metadata` | `BsonDocument` | Metadonnees supplementaires de l'objet |

Au moins un parmi `ItemId`, `ResourceTypeId` ou `ItemTag` doit etre specifie.

### BenchRequirement

Definit quels types d'etablis peuvent fabriquer une recette :

| Propriete | Type | Description |
|-----------|------|-------------|
| `Type` | `BenchType` | Le type d'etabli requis |
| `Id` | `String` | L'ID specifique de l'etabli |
| `Categories` | `String[]` | Categories auxquelles cette recette appartient |
| `RequiredTierLevel` | `int` | Niveau minimum d'etabli requis |

## Types d'Etablis

L'enum `BenchType` (`com.hypixel.hytale.protocol.BenchType`) definit quatre types de stations de fabrication :

| Type | Valeur | Description |
|------|--------|-------------|
| `Crafting` | 0 | Etabli standard avec categories et sous-categories |
| `Processing` | 1 | Etabli de traitement avec systeme de carburant (fours, fonderies) |
| `DiagramCrafting` | 2 | Fabrication basee sur diagramme (limite a 1 sortie par recette) |
| `StructuralCrafting` | 3 | Fabrication de structures/batiments avec cycle de groupe de blocs |

### Configuration des Etablis

#### Proprietes de Base des Etablis

Tous les etablis heritent de la classe `Bench` :

| Propriete | Type | Description |
|-----------|------|-------------|
| `Id` | `String` | Identifiant unique de l'etabli |
| `DescriptiveLabel` | `String` | Nom d'affichage de l'etabli |
| `TierLevels` | `BenchTierLevel[]` | Tableau des configurations de niveau |
| `LocalOpenSoundEventId` | `String` | Son joue a l'ouverture |
| `LocalCloseSoundEventId` | `String` | Son joue a la fermeture |
| `CompletedSoundEventId` | `String` | Son joue a la fin de fabrication |
| `FailedSoundEventId` | `String` | Son joue en cas d'echec |
| `BenchUpgradeSoundEventId` | `String` | Son pendant l'amelioration |
| `BenchUpgradeCompletedSoundEventId` | `String` | Son a la fin de l'amelioration |

#### CraftingBench

Les etablis de fabrication standard supportent les categories :

```java
public class CraftingBench extends Bench {
    protected BenchCategory[] categories;
}
```

**Proprietes de BenchCategory :**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Id` | `String` | Identifiant de la categorie |
| `Name` | `String` | Nom d'affichage |
| `Icon` | `String` | Icone de la categorie |
| `ItemCategories` | `BenchItemCategory[]` | Sous-categories |

**Proprietes de BenchItemCategory :**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Id` | `String` | Identifiant de la sous-categorie |
| `Name` | `String` | Nom d'affichage |
| `Icon` | `String` | Chemin de l'icone |
| `Diagram` | `String` | Chemin du diagramme UI |
| `Slots` | `int` | Nombre d'emplacements (defaut : 1) |
| `SpecialSlot` | `boolean` | A un emplacement special (defaut : true) |

#### DiagramCraftingBench

Etend `CraftingBench` avec une UI de fabrication basee sur diagramme. Les recettes sont limitees a une seule sortie.

#### StructuralCraftingBench

Pour la fabrication de batiments/structures :

| Propriete | Type | Description |
|-----------|------|-------------|
| `Categories` | `String[]` | Liste des categories triees |
| `HeaderCategories` | `String[]` | Categories a afficher comme en-tetes |
| `AlwaysShowInventoryHints` | `boolean` | Toujours afficher les indices d'inventaire |
| `AllowBlockGroupCycling` | `boolean` | Activer le cycle de groupe de blocs |

## Systeme de Niveaux d'Etabli

Les etablis peuvent etre ameliores par niveaux, chacun fournissant des bonus.

### BenchTierLevel

| Propriete | Type | Description |
|-----------|------|-------------|
| `UpgradeRequirement` | `BenchUpgradeRequirement` | Materiaux necessaires pour ameliorer |
| `CraftingTimeReductionModifier` | `double` | Reduction de temps (0.0 - 1.0) |
| `ExtraInputSlot` | `int` | Emplacements d'entree supplementaires |
| `ExtraOutputSlot` | `int` | Emplacements de sortie supplementaires |

## Fieldcraft (Fabrication de Poche)

Le Fieldcraft est le systeme de fabrication portable accessible depuis l'inventaire. Il utilise l'ID d'etabli special `"Fieldcraft"` et `BenchType.Crafting`.

### FieldcraftCategory

Les categories pour le fieldcraft sont definies dans la classe `FieldcraftCategory` :

| Propriete | Type | Description |
|-----------|------|-------------|
| `Id` | `String` | Identifiant de la categorie |
| `Name` | `String` | Nom d'affichage |
| `Icon` | `String` | Chemin de l'icone |
| `Order` | `int` | Ordre de tri |

## Systeme de Deblocage des Recettes

Les recettes peuvent necessiter que les joueurs les apprennent avant de fabriquer.

### Apprendre des Recettes

Utilisez `CraftingPlugin.learnRecipe()` :

```java
// Apprendre une recette pour un joueur
boolean success = CraftingPlugin.learnRecipe(ref, recipeId, componentAccessor);
```

### Oublier des Recettes

Utilisez `CraftingPlugin.forgetRecipe()` :

```java
// Faire oublier une recette a un joueur
boolean success = CraftingPlugin.forgetRecipe(ref, itemId, componentAccessor);
```

### LearnRecipeInteraction

La classe `LearnRecipeInteraction` permet aux objets d'enseigner des recettes lors de leur utilisation :

| Propriete | Type | Description |
|-----------|------|-------------|
| `ItemId` | `String` | L'ID de la recette a apprendre |

Peut etre defini via les metadonnees de l'objet avec la cle `"ItemId"`.

## Types de Fenetres

L'enum `WindowType` definit les fenetres d'interface :

| Type | Valeur | Description |
|------|--------|-------------|
| `Container` | 0 | Conteneur generique |
| `PocketCrafting` | 1 | Fenetre de fieldcraft |
| `BasicCrafting` | 2 | Etabli de fabrication standard |
| `DiagramCrafting` | 3 | Etabli de fabrication par diagramme |
| `StructuralCrafting` | 4 | Etabli de fabrication structurelle |
| `Processing` | 5 | Etabli de traitement |
| `Memories` | 6 | Interface des memoires |

## Evenements

### CraftRecipeEvent

Un evenement ECS annulable declenche avant et apres la fabrication :

- `CraftRecipeEvent.Pre` - Declenche avant la fabrication, peut etre annule
- `CraftRecipeEvent.Post` - Declenche apres le retrait des entrees, avant la sortie

```java
// Ecouter les evenements de fabrication
eventRegistry.register(CraftRecipeEvent.Pre.class, filter, event -> {
    CraftingRecipe recipe = event.getCraftedRecipe();
    int quantity = event.getQuantity();
    // Annuler si necessaire
    event.cancel();
});
```

### PlayerCraftEvent (Obsolete)

Evenement legacy, utilisez `CraftRecipeEvent` a la place.

```java
PlayerCraftEvent event = new PlayerCraftEvent(ref, player, craftedRecipe, quantity);
```

## Paquets

### UpdateRecipes

Envoie les definitions de recettes aux clients :

| Propriete | Type | Description |
|-----------|------|-------------|
| `type` | `UpdateType` | Init ou Update |
| `recipes` | `Map<String, CraftingRecipe>` | Map des recettes |
| `removedRecipes` | `String[]` | IDs des recettes supprimees |

**ID du paquet :** 60

### UpdateKnownRecipes

Met a jour les recettes connues du joueur :

| Propriete | Type | Description |
|-----------|------|-------------|
| `known` | `Map<String, CraftingRecipe>` | Map des recettes connues |

**ID du paquet :** 228

### CraftRecipeAction

Demande du client pour fabriquer un objet :

| Propriete | Type | Description |
|-----------|------|-------------|
| `recipeId` | `String` | Recette a fabriquer |
| `quantity` | `int` | Quantite a fabriquer |

## Configuration de Fabrication

Parametres globaux de fabrication dans `CraftingConfig` :

| Propriete | Defaut | Description |
|-----------|--------|-------------|
| `BenchMaterialChestHorizontalSearchRadius` | 7 | Rayon de recherche horizontal pour les coffres proches |
| `BenchMaterialChestVerticalSearchRadius` | 3 | Rayon de recherche vertical pour les coffres proches |
| `BenchMaterialChestLimit` | 100 | Nombre maximum de coffres a rechercher pour les materiaux |

## Ajouter des Recettes Personnalisees

### Definition de Recette JSON

Les recettes sont definies au format JSON :

```json
{
    "Id": "MyMod:IronSword",
    "Input": [
        { "ItemId": "Hytale:IronIngot", "Quantity": 2 },
        { "ItemId": "Hytale:WoodPlank", "Quantity": 1 }
    ],
    "PrimaryOutput": {
        "ItemId": "MyMod:IronSword",
        "Quantity": 1
    },
    "BenchRequirement": [
        {
            "Type": "Crafting",
            "Id": "Hytale:Anvil",
            "Categories": ["Weapons"],
            "RequiredTierLevel": 1
        }
    ],
    "TimeSeconds": 2.5,
    "KnowledgeRequired": false,
    "RequiredMemoriesLevel": 1
}
```

### Enregistrement Programmatique des Recettes

Les recettes chargees via le systeme d'assets declenchent des evenements :

- `LoadedAssetsEvent<String, CraftingRecipe, ...>` - Quand les recettes sont chargees
- `RemovedAssetsEvent<String, CraftingRecipe, ...>` - Quand les recettes sont supprimees

Le `BenchRecipeRegistry` gere les recettes par etabli :

```java
BenchRecipeRegistry registry = registries.computeIfAbsent(benchId, BenchRecipeRegistry::new);
registry.addRecipe(benchRequirement, recipe);
```

## Composant CraftingManager

Le composant `CraftingManager` gere les sessions de fabrication actives pour les joueurs :

### Methodes Principales

```java
// Definir l'etabli actif
craftingManager.setBench(x, y, z, blockType);

// Fabriquer un objet instantanement
craftingManager.craftItem(ref, store, recipe, quantity, itemContainer);

// Mettre en file une fabrication minutee
craftingManager.queueCraft(ref, store, window, transactionId, recipe, quantity, inputContainer, inputRemovalType);

// Annuler toutes les fabrications en file
craftingManager.cancelAllCrafting(ref, store);
```

### Types de Retrait d'Entree

```java
public enum InputRemovalType {
    NORMAL,   // Retrait de materiel standard
    ORDERED   // Retrait ordonne des emplacements
}
```

## Bonnes Pratiques

1. **Utilisez les Types de Ressources** - Pour les materiaux generiques, utilisez `ResourceTypeId` au lieu de `ItemId` pour permettre plusieurs types d'objets
2. **Definissez des Temps Appropries** - Les recettes de fieldcraft doivent avoir `TimeSeconds: 0`
3. **Exigences de Connaissance** - N'utilisez `KnowledgeRequired` que pour les types d'etablis `Crafting` et `DiagramCrafting`
4. **Niveaux d'Etabli** - Concevez la progression des niveaux pour recompenser l'investissement du joueur
5. **Categories** - Organisez les recettes en categories logiques pour une meilleure experience utilisateur
