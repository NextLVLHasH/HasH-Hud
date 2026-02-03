---
id: generate-assets-event
title: GenerateAssetsEvent
sidebar_label: GenerateAssetsEvent
---

# GenerateAssetsEvent

Un evenement traite qui se declenche pour permettre aux plugins de generer des assets derives ou enfants a partir d'assets parents charges. Cet evenement puissant permet la creation dynamique d'assets, les relations parent-enfant et la generation de contenu procedural pendant la phase de chargement des assets.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.assetstore.event.GenerateAssetsEvent` |
| **Classe parente** | `AssetsEvent<K, T>` |
| **Implemente** | `IProcessedEvent` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/assetstore/event/GenerateAssetsEvent.java:20` |

## Declaration

```java
public class GenerateAssetsEvent<K, T extends JsonAssetWithMap<K, M>, M extends AssetMap<K, T>>
    extends AssetsEvent<K, T> implements IProcessedEvent {
   private final Class<T> tClass;
   private final M assetMap;
   @Nonnull
   private final Map<K, T> loadedAssets;
   private final Map<K, Set<K>> assetChildren;
   @Nonnull
   private final Map<K, T> unmodifiableLoadedAssets;
   private final Map<K, T> addedAssets = new ConcurrentHashMap<>();
```

## Parametres de type

| Parametre | Description |
|-----------|-------------|
| `K` | Le type de cle utilise pour identifier les assets |
| `T` | Le type d'asset, doit etendre `JsonAssetWithMap<K, M>` |
| `M` | Le type de map d'assets, doit etendre `AssetMap<K, T>` |

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `tClass` | `Class<T>` | `getAssetClass()` | Le type de classe des assets en cours de traitement |
| `assetMap` | `M` | `getAssetMap()` | La map d'assets pour ce type d'asset |
| `loadedAssets` | `Map<K, T>` | `getLoadedAssets()` | Map non modifiable des assets charges |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAssetClass` | `public Class<T> getAssetClass()` | Retourne le type de classe des assets |
| `getAssetMap` | `public M getAssetMap()` | Retourne la map d'assets |
| `getLoadedAssets` | `@Nonnull public Map<K, T> getLoadedAssets()` | Retourne une map non modifiable des assets charges |
| `addChildAsset` | `public void addChildAsset(K childKey, T asset, @Nonnull K parent)` | Ajoute un asset enfant avec un seul parent |
| `addChildAsset` | `public final void addChildAsset(K childKey, T asset, @Nonnull K... parents)` | Ajoute un asset enfant avec plusieurs parents |
| `addChildAssetWithReference` | `public <P, PK> void addChildAssetWithReference(...)` | Ajoute un asset enfant referencant un type d'asset different |
| `processEvent` | `public void processEvent(@Nonnull String hookName)` | Traite et finalise tous les assets ajoutes |

## Classes imbriquees

### ParentReference

Une classe d'aide pour specifier les references parentes entre differents types d'assets.

```java
public static class ParentReference<P extends JsonAssetWithMap<PK, ?>, PK> {
   private final Class<P> parentAssetClass;
   private final PK parentKey;

   public ParentReference(Class<P> parentAssetClass, PK parentKey);
   public Class<P> getParentAssetClass();
   public PK getParentKey();
}
```

## Exemple d'utilisation

```java
// Generer des variantes d'assets a partir d'assets de base
eventBus.register(GenerateAssetsEvent.class, event -> {
    if (event.getAssetClass() == BlockType.class) {
        @SuppressWarnings("unchecked")
        GenerateAssetsEvent<String, BlockType, BlockTypeMap> blockEvent =
            (GenerateAssetsEvent<String, BlockType, BlockTypeMap>) event;

        Map<String, BlockType> loaded = blockEvent.getLoadedAssets();

        // Generer des variantes colorees pour les blocs de base
        BlockType stoneBlock = loaded.get("stone");
        if (stoneBlock != null) {
            for (String color : COLORS) {
                String childKey = color + "_stone";
                BlockType coloredStone = createColoredVariant(stoneBlock, color);
                blockEvent.addChildAsset(childKey, coloredStone, "stone");
            }
        }
    }
});

// Generer des assets avec plusieurs parents
eventBus.register(GenerateAssetsEvent.class, event -> {
    if (event.getAssetClass() == RecipeType.class) {
        @SuppressWarnings("unchecked")
        GenerateAssetsEvent<String, RecipeType, RecipeTypeMap> recipeEvent =
            (GenerateAssetsEvent<String, RecipeType, RecipeTypeMap>) event;

        // Creer une recette qui combine plusieurs recettes de base
        RecipeType combinedRecipe = createCombinedRecipe();
        recipeEvent.addChildAsset("combined_recipe", combinedRecipe,
            "base_recipe_1", "base_recipe_2");
    }
});
```

## Cas d'utilisation courants

- Generer des variantes de couleur ou de materiau d'assets de base
- Creer des items derives a partir de types de blocs
- Construire des variations de recettes de maniere programmatique
- Implementer des systemes d'assets modulaires
- Creer des variantes d'assets localisees
- Generer des variantes de niveau de detail
- Construire des hierarchies d'heritage d'assets
- Generation de contenu procedural

## Evenements lies

- [LoadedAssetsEvent](./loaded-assets-event) - Declenche avant cet evenement lorsque les assets sont charges
- [RemovedAssetsEvent](./removed-assets-event) - Declenche lorsque des assets sont supprimes
- [RegisterAssetStoreEvent](./register-asset-store-event) - Declenche lorsqu'un magasin d'assets est enregistre

## Reference source

`decompiled/com/hypixel/hytale/assetstore/event/GenerateAssetsEvent.java:20`
