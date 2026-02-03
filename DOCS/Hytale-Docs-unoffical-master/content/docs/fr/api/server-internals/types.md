---
id: types
title: Types de Donnees
sidebar_label: Types
sidebar_position: 5
description: Documentation des types de donnees principaux du serveur Hytale (BlockType, Items, etc.)
---

# Types de Données Hytale

:::info Documentation v2 - Vérifiée
Cette documentation a été vérifiée par rapport au code source décompilé du serveur en utilisant une analyse multi-agent. Toutes les informations incluent des références aux fichiers sources.
:::

## Que sont les types de donnees ?

Les **types de donnees** definissent la structure de chaque objet dans le monde d'Hytale. Tout comme un plan definit a quoi ressemble une maison, les types de donnees definissent a quoi "ressemble" un bloc, un item ou une entite pour le serveur.

### Pourquoi c'est important

Quand vous creez une epee personnalisee dans Hytale, vous n'ecrivez pas de code - vous remplissez une structure de donnees :

```json
{
  "id": "mon_epee",
  "maxStack": 1,
  "durability": 250,
  "weapon": {
    "damage": 15,
    "attackSpeed": 1.2
  }
}
```

Comprendre les types de donnees vous aide a :
- Savoir quelles proprietes sont disponibles
- Eviter les configurations invalides
- Comprendre comment le jeu interprete votre contenu

### Les types de donnees principaux

Le monde d'Hytale est construit a partir de quelques types fondamentaux :

| Type | Ce qu'il represente | Exemple |
|------|---------------------|---------|
| **BlockType** | Un type de bloc | Pierre, Herbe, Blocs personnalises |
| **ItemBase** | Un type d'item | Epee, Potion, Nourriture |
| **EntityEffect** | Un buff ou debuff | Poison, Boost de vitesse |
| **CraftingRecipe** | Comment fabriquer des choses | Combiner bois → planches |
| **Weather** | Conditions meteorologiques | Pluie, Neige, Clair |

### Comment les types se connectent

Ces types n'existent pas isolement - ils se referencent mutuellement :

```
BlockType (Minerai)
    └── drops → ItemBase (Diamant)
                    └── usedIn → CraftingRecipe (Epee en diamant)
                                      └── output → ItemBase (Epee en diamant)
                                                       └── applies → EntityEffect (Saignement)
```

### Analogie du monde reel : instructions LEGO

Pensez aux types de donnees comme des livrets d'instructions LEGO :

- **BlockType** = Instructions pour une brique specifique
- **Champs** = Proprietes comme couleur, taille, points de connexion
- **Enums** = Options predefinies (Rouge, Bleu, Vert)
- **References** = "Utilisez la piece #4207" - liens vers d'autres pieces

Tout comme les briques LEGO s'assemblent selon des regles, les types de donnees Hytale se connectent selon leurs schemas.

### Comprendre les tableaux ci-dessous

Chaque type de donnees est documente avec des tableaux montrant :

| Colonne | Ce que ca signifie |
|---------|-------------------|
| **Champ** | Le nom de la propriete |
| **Type** | Quel genre de donnees (string, number, enum, etc.) |
| **Description** | Ce que cette propriete fait |

**Types que vous verrez :**
- `String` - Texte comme "diamond_sword"
- `int` / `float` / `double` - Nombres (entiers ou decimaux)
- `boolean` - Vrai/faux
- `NomEnum` - Une valeur parmi un ensemble predefini
- `Type[]` - Une liste de valeurs
- `Map<Cle, Valeur>` - Un dictionnaire/table de recherche
- `Type?` - Optionnel (peut etre null/absent)

---

## Reference des types de donnees

Cette documentation décrit les types de données principaux utilisés dans le serveur Hytale, extraits du code décompilé.

---

## Table des Matières

1. [BlockType - Types de Blocs](#blocktype---types-de-blocs)
2. [Système d'Items](#système-ditems)
   - [ItemBase](#itembase)
   - [ItemWeapon](#itemweapon)
   - [ItemArmor](#itemarmor)
   - [ItemTool](#itemtool)
   - [ItemQuality](#itemquality)
3. [EntityEffect - Effets sur les Entités](#entityeffect---effets-sur-les-entités)
4. [CraftingRecipe - Recettes](#craftingrecipe---recettes)
5. [Environnement](#environnement)
   - [Weather](#weather)
   - [WorldEnvironment](#worldenvironment)
6. [Énumérations Importantes](#énumérations-importantes)
7. [Types Auxiliaires](#types-auxiliaires)

---

## BlockType - Types de Blocs

Le type `BlockType` définit les propriétés d'un bloc dans le monde Hytale.

### Champs Principaux

| Champ | Type | Description |
|-------|------|-------------|
| `item` | `String` | Identifiant de l'item associé au bloc |
| `name` | `String` | Nom du bloc |
| `unknown` | `boolean` | Indique si le bloc est inconnu ou non défini |
| `drawType` | `DrawType` | Mode de rendu du bloc (Empty, GizmoCube, Cube, Model, CubeWithModel) |
| `material` | `BlockMaterial` | Type de matériau (Empty, Solid) |
| `opacity` | `Opacity` | Opacité (Solid, Semitransparent, Cutout, Transparent) |
| `shaderEffect` | `ShaderType[]` | Effets de shader appliqués |
| `hitbox` | `int` | Index de la hitbox de collision |
| `interactionHitbox` | `int` | Index de la hitbox d'interaction |
| `model` | `String` | Chemin vers le modèle 3D |
| `modelTexture` | `ModelTexture[]` | Textures du modèle |
| `modelScale` | `float` | Échelle du modèle |
| `modelAnimation` | `String` | Animation du modèle |
| `looping` | `boolean` | Animation en boucle |

### Propriétés de Support

| Champ | Type | Description |
|-------|------|-------------|
| `maxSupportDistance` | `int` | Distance maximale de support |
| `blockSupportsRequiredFor` | `BlockSupportsRequiredForType` | Type de support requis |
| `support` | `Map<BlockNeighbor, RequiredBlockFaceSupport[]>` | Faces de support requises |
| `supporting` | `Map<BlockNeighbor, BlockFaceSupport[]>` | Faces de support fournies |
| `ignoreSupportWhenPlaced` | `boolean` | Ignorer le support lors du placement |

### Propriétés Visuelles

| Champ | Type | Description |
|-------|------|-------------|
| `requiresAlphaBlending` | `boolean` | Nécessite le mélange alpha |
| `cubeTextures` | `BlockTextures[]` | Textures pour le mode cube |
| `cubeSideMaskTexture` | `String` | Texture de masque latéral |
| `cubeShadingMode` | `ShadingMode` | Mode d'ombrage |
| `randomRotation` | `RandomRotation` | Rotation aléatoire |
| `variantRotation` | `VariantRotation` | Rotation de variante |
| `rotationYawPlacementOffset` | `Rotation` | Décalage de rotation lors du placement |
| `particleColor` | `Color` | Couleur des particules |
| `light` | `ColorLight` | Émission de lumière |
| `tint` | `Tint` | Teinte du bloc |
| `biomeTint` | `Tint` | Teinte dépendante du biome |

### Audio et Effets

| Champ | Type | Description |
|-------|------|-------------|
| `blockSoundSetIndex` | `int` | Index de l'ensemble de sons |
| `ambientSoundEventIndex` | `int` | Index du son ambiant |
| `particles` | `ModelParticle[]` | Particules émises |
| `blockParticleSetId` | `String` | Identifiant de l'ensemble de particules |
| `blockBreakingDecalId` | `String` | Identifiant du décal de cassure |

### Interactions et États

| Champ | Type | Description |
|-------|------|-------------|
| `interactions` | `Map<InteractionType, Integer>` | Interactions disponibles |
| `states` | `Map<String, Integer>` | États possibles |
| `flags` | `BlockFlags` | Drapeaux du bloc |
| `interactionHint` | `String` | Indication d'interaction |
| `gathering` | `BlockGathering` | Configuration de récolte |
| `placementSettings` | `BlockPlacementSettings` | Paramètres de placement |
| `bench` | `Bench` | Configuration d'établi (si applicable) |
| `rail` | `RailConfig` | Configuration de rail (si applicable) |
| `connectedBlockRuleSet` | `ConnectedBlockRuleSet` | Règles de connexion |
| `tagIndexes` | `int[]` | Tags associés |

---

## Système d'Items

### ItemBase

Type de base pour tous les items du jeu.

#### Identité et Apparence

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant unique de l'item |
| `model` | `String` | Chemin vers le modèle 3D |
| `scale` | `float` | Échelle de l'item |
| `texture` | `String` | Texture principale |
| `animation` | `String` | Animation de l'item |
| `playerAnimationsId` | `String` | Identifiant des animations du joueur |
| `usePlayerAnimations` | `boolean` | Utiliser les animations du joueur |
| `icon` | `String` | Icône dans l'inventaire |
| `iconProperties` | `AssetIconProperties` | Propriétés de l'icône |

#### Propriétés de Base

| Champ | Type | Description |
|-------|------|-------------|
| `maxStack` | `int` | Taille maximale de la pile |
| `reticleIndex` | `int` | Index du réticule |
| `itemLevel` | `int` | Niveau de l'item |
| `qualityIndex` | `int` | Index de qualité |
| `resourceTypes` | `ItemResourceType[]` | Types de ressource |
| `consumable` | `boolean` | Item consommable |
| `variant` | `boolean` | Est une variante |
| `blockId` | `int` | Identifiant du bloc associé |
| `durability` | `double` | Durabilité de l'item |

#### Sous-Types Spécialisés

| Champ | Type | Description |
|-------|------|-------------|
| `tool` | `ItemTool` | Configuration d'outil |
| `weapon` | `ItemWeapon` | Configuration d'arme |
| `armor` | `ItemArmor` | Configuration d'armure |
| `gliderConfig` | `ItemGlider` | Configuration de planeur |
| `utility` | `ItemUtility` | Configuration utilitaire |
| `blockSelectorTool` | `BlockSelectorToolData` | Outil de sélection |
| `builderToolData` | `ItemBuilderToolData` | Outil de construction |

#### Interactions et Sons

| Champ | Type | Description |
|-------|------|-------------|
| `soundEventIndex` | `int` | Index de l'événement sonore |
| `itemSoundSetIndex` | `int` | Index de l'ensemble de sons |
| `interactions` | `Map<InteractionType, Integer>` | Interactions disponibles |
| `interactionVars` | `Map<String, Integer>` | Variables d'interaction |
| `interactionConfig` | `InteractionConfiguration` | Configuration d'interaction |

#### Effets Visuels

| Champ | Type | Description |
|-------|------|-------------|
| `particles` | `ModelParticle[]` | Particules en troisième personne |
| `firstPersonParticles` | `ModelParticle[]` | Particules en première personne |
| `trails` | `ModelTrail[]` | Traînées visuelles |
| `light` | `ColorLight` | Émission de lumière |
| `itemEntity` | `ItemEntityConfig` | Configuration de l'entité item |
| `droppedItemAnimation` | `String` | Animation au sol |

#### Catégorisation

| Champ | Type | Description |
|-------|------|-------------|
| `set` | `String` | Ensemble d'items |
| `categories` | `String[]` | Catégories |
| `tagIndexes` | `int[]` | Tags associés |

---

### ItemWeapon

Configuration spécifique aux armes.

| Champ | Type | Description |
|-------|------|-------------|
| `entityStatsToClear` | `int[]` | Statistiques d'entité à effacer |
| `statModifiers` | `Map<Integer, Modifier[]>` | Modificateurs de statistiques |
| `renderDualWielded` | `boolean` | Afficher en double maniement |

---

### ItemArmor

Configuration spécifique aux armures.

| Champ | Type | Description |
|-------|------|-------------|
| `armorSlot` | `ItemArmorSlot` | Emplacement (Head, Chest, Hands, Legs) |
| `cosmeticsToHide` | `Cosmetic[]` | Cosmétiques à masquer |
| `statModifiers` | `Map<Integer, Modifier[]>` | Modificateurs de statistiques |
| `baseDamageResistance` | `double` | Résistance aux dégâts de base |
| `damageResistance` | `Map<String, Modifier[]>` | Résistances par type de dégât |
| `damageEnhancement` | `Map<String, Modifier[]>` | Amélioration des dégâts |
| `damageClassEnhancement` | `Map<String, Modifier[]>` | Amélioration par classe de dégât |

---

### ItemTool

Configuration spécifique aux outils.

| Champ | Type | Description |
|-------|------|-------------|
| `specs` | `ItemToolSpec[]` | Spécifications de l'outil |
| `speed` | `float` | Vitesse d'utilisation |

---

### ItemQuality

Définit la qualité et la rareté d'un item.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de qualité |
| `itemTooltipTexture` | `String` | Texture de l'infobulle |
| `itemTooltipArrowTexture` | `String` | Texture de la flèche de l'infobulle |
| `slotTexture` | `String` | Texture de l'emplacement |
| `blockSlotTexture` | `String` | Texture de l'emplacement de bloc |
| `specialSlotTexture` | `String` | Texture de l'emplacement spécial |
| `textColor` | `Color` | Couleur du texte |
| `localizationKey` | `String` | Clé de traduction |
| `visibleQualityLabel` | `boolean` | Afficher l'étiquette de qualité |
| `renderSpecialSlot` | `boolean` | Afficher l'emplacement spécial |
| `hideFromSearch` | `boolean` | Masquer de la recherche |

---

## EntityEffect - Effets sur les Entités

Représente un effet qui peut être appliqué à une entité (bonus ou malus).

### Propriétés Principales

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant unique de l'effet |
| `name` | `String` | Nom affiché |
| `applicationEffects` | `ApplicationEffects` | Effets visuels et audio |
| `worldRemovalSoundEventIndex` | `int` | Son de retrait (monde) |
| `localRemovalSoundEventIndex` | `int` | Son de retrait (local) |
| `modelOverride` | `ModelOverride` | Remplacement de modèle |

### Temporalité

| Champ | Type | Description |
|-------|------|-------------|
| `duration` | `float` | Durée en secondes |
| `infinite` | `boolean` | Durée infinie |
| `overlapBehavior` | `OverlapBehavior` | Comportement en cas de chevauchement |
| `damageCalculatorCooldown` | `double` | Temps de recharge du calcul de dégâts |

### Caractéristiques

| Champ | Type | Description |
|-------|------|-------------|
| `debuff` | `boolean` | Est un malus (effet négatif) |
| `statusEffectIcon` | `String` | Icône de statut |
| `statModifiers` | `Map<Integer, Float>` | Modificateurs de statistiques |
| `valueType` | `ValueType` | Type de valeur (Percent, Absolute) |

---

## CraftingRecipe - Recettes

Définit une recette de fabrication.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de la recette |
| `inputs` | `MaterialQuantity[]` | Ingrédients requis |
| `outputs` | `MaterialQuantity[]` | Résultats de la recette |
| `primaryOutput` | `MaterialQuantity` | Résultat principal |
| `benchRequirement` | `BenchRequirement[]` | Établis requis |
| `knowledgeRequired` | `boolean` | Connaissance requise |
| `timeSeconds` | `float` | Temps de fabrication |
| `requiredMemoriesLevel` | `int` | Niveau de souvenirs requis |

### MaterialQuantity

| Champ | Type | Description |
|-------|------|-------------|
| `itemId` | `String` | Identifiant de l'item |
| `itemTag` | `int` | Tag de l'item |
| `resourceTypeId` | `String` | Identifiant du type de ressource |
| `quantity` | `int` | Quantité |

### BenchRequirement

| Champ | Type | Description |
|-------|------|-------------|
| `type` | `BenchType` | Type d'établi |
| `id` | `String` | Identifiant spécifique |
| `categories` | `String[]` | Catégories acceptées |
| `requiredTierLevel` | `int` | Niveau requis |

---

## Environnement

### Weather

Définit un type de météo.

#### Ciel et Lumière

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de la météo |
| `tagIndexes` | `int[]` | Tags associés |
| `stars` | `String` | Configuration des étoiles |
| `moons` | `Map<Integer, String>` | Configuration des lunes |
| `clouds` | `Cloud[]` | Configuration des nuages |
| `sunlightDampingMultiplier` | `Map<Float, Float>` | Atténuation de la lumière solaire |
| `sunlightColors` | `Map<Float, Color>` | Couleurs du soleil |
| `skyTopColors` | `Map<Float, ColorAlpha>` | Couleurs du ciel (partie supérieure) |
| `skyBottomColors` | `Map<Float, ColorAlpha>` | Couleurs du ciel (partie inférieure) |
| `skySunsetColors` | `Map<Float, ColorAlpha>` | Couleurs du coucher de soleil |

#### Soleil et Lune

| Champ | Type | Description |
|-------|------|-------------|
| `sunColors` | `Map<Float, Color>` | Couleurs du soleil |
| `sunScales` | `Map<Float, Float>` | Échelle du soleil |
| `sunGlowColors` | `Map<Float, ColorAlpha>` | Couleurs du halo solaire |
| `moonColors` | `Map<Float, ColorAlpha>` | Couleurs de la lune |
| `moonScales` | `Map<Float, Float>` | Échelle de la lune |
| `moonGlowColors` | `Map<Float, ColorAlpha>` | Couleurs du halo lunaire |

#### Brouillard et Effets

| Champ | Type | Description |
|-------|------|-------------|
| `fogColors` | `Map<Float, Color>` | Couleurs du brouillard |
| `fogHeightFalloffs` | `Map<Float, Float>` | Atténuation du brouillard en hauteur |
| `fogDensities` | `Map<Float, Float>` | Densités du brouillard |
| `fog` | `NearFar` | Distance du brouillard |
| `fogOptions` | `FogOptions` | Options du brouillard |
| `screenEffect` | `String` | Effet d'écran |
| `screenEffectColors` | `Map<Float, ColorAlpha>` | Couleurs de l'effet d'écran |
| `colorFilters` | `Map<Float, Color>` | Filtres de couleur |
| `waterTints` | `Map<Float, Color>` | Teintes de l'eau |
| `particle` | `WeatherParticle` | Particules météorologiques |

---

### WorldEnvironment

Définit un environnement de monde.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de l'environnement |
| `waterTint` | `Color` | Teinte de l'eau |
| `fluidParticles` | `Map<Integer, FluidParticle>` | Particules des fluides |
| `tagIndexes` | `int[]` | Tags associés |

---

## Énumérations Importantes

### GameMode

Modes de jeu disponibles.

```
Adventure (0)  - Mode aventure
Creative (1)   - Mode créatif
```

### ItemArmorSlot

Emplacements d'armure.

```
Head (0)   - Tête
Chest (1)  - Torse
Hands (2)  - Mains
Legs (3)   - Jambes
```

### BlockMaterial

Types de matériaux de bloc.

```
Empty (0)  - Vide (air)
Solid (1)  - Solide
```

### DrawType

Modes de rendu des blocs.

```
Empty (0)        - Pas de rendu
GizmoCube (1)    - Cube gizmo (débogage)
Cube (2)         - Rendu cube standard
Model (3)        - Modèle 3D
CubeWithModel (4)- Cube avec modèle
```

### Opacity

Niveaux d'opacité des blocs.

```
Solid (0)          - Complètement opaque
Semitransparent (1)- Semi-transparent
Cutout (2)         - Découpage (feuilles, etc.)
Transparent (3)    - Complètement transparent
```

### InteractionType

Types d'interactions possibles.

```
Primary (0)         - Action principale (clic gauche)
Secondary (1)       - Action secondaire (clic droit)
Ability1 (2)        - Capacité 1
Ability2 (3)        - Capacité 2
Ability3 (4)        - Capacité 3
Use (5)             - Utiliser
Pick (6)            - Ramasser
Pickup (7)          - Collecter
CollisionEnter (8)  - Entrée en collision
CollisionLeave (9)  - Sortie de collision
Collision (10)      - Collision
EntityStatEffect (11) - Effet de statistique d'entité
SwapTo (12)         - Passage à
SwapFrom (13)       - Passage depuis
Death (14)          - Mort
Wielding (15)       - Équipement
ProjectileSpawn (16)- Création de projectile
ProjectileHit (17)  - Impact de projectile
ProjectileMiss (18) - Projectile raté
ProjectileBounce (19) - Rebond de projectile
Held (20)           - Tenu en main
HeldOffhand (21)    - Tenu en main secondaire
Equipped (22)       - Équipé
Dodge (23)          - Esquive
GameModeSwap (24)   - Changement de mode de jeu
```

### BenchType

Types d'établis.

```
Crafting (0)           - Établi de fabrication
Processing (1)         - Établi de traitement
DiagramCrafting (2)    - Établi à diagramme
StructuralCrafting (3) - Établi structural
```

### BlockFace

Faces d'un bloc.

```
None (0)   - Aucune
Up (1)     - Haut
Down (2)   - Bas
North (3)  - Nord
South (4)  - Sud
East (5)   - Est
West (6)   - Ouest
```

### OverlapBehavior

Comportement lors du chevauchement d'effets.

```
Extend (0)    - Prolonger la durée
Overwrite (1) - Remplacer
Ignore (2)    - Ignorer le nouvel effet
```

### ValueType

Type de valeur pour les modificateurs.

```
Percent (0)  - Pourcentage
Absolute (1) - Valeur absolue
```

### CalculationType

Type de calcul pour les modificateurs.

```
Additive (0)       - Additif (+X)
Multiplicative (1) - Multiplicatif (*X)
```

### ModifierTarget

Cible du modificateur.

```
Min (0) - Valeur minimale
Max (1) - Valeur maximale
```

### Cosmetic

Types de cosmétiques (masquables par l'armure).

```
Haircut (0)        - Coupe de cheveux
FacialHair (1)     - Pilosité faciale
Undertop (2)       - Sous-vêtement haut
Overtop (3)        - Sur-vêtement haut
Pants (4)          - Pantalon
Overpants (5)      - Sur-pantalon
Shoes (6)          - Chaussures
Gloves (7)         - Gants
Cape (8)           - Cape
HeadAccessory (9)  - Accessoire de tête
FaceAccessory (10) - Accessoire de visage
EarAccessory (11)  - Accessoire d'oreille
Ear (12)           - Oreille
```

---

## Types Auxiliaires

### Modifier

Modificateur de statistique.

| Champ | Type | Description |
|-------|------|-------------|
| `target` | `ModifierTarget` | Cible (Min/Max) |
| `calculationType` | `CalculationType` | Type de calcul |
| `amount` | `float` | Montant |

### ApplicationEffects

Effets visuels et audio lors de l'application d'un effet.

| Champ | Type | Description |
|-------|------|-------------|
| `entityBottomTint` | `Color` | Teinte du bas de l'entité |
| `entityTopTint` | `Color` | Teinte du haut de l'entité |
| `entityAnimationId` | `String` | Animation à jouer |
| `particles` | `ModelParticle[]` | Particules |
| `firstPersonParticles` | `ModelParticle[]` | Particules en première personne |
| `screenEffect` | `String` | Effet d'écran |
| `horizontalSpeedMultiplier` | `float` | Multiplicateur de vitesse horizontale |
| `soundEventIndexLocal` | `int` | Son local |
| `soundEventIndexWorld` | `int` | Son monde |
| `modelVFXId` | `String` | Identifiant des effets visuels |
| `movementEffects` | `MovementEffects` | Effets de mouvement |
| `mouseSensitivityAdjustmentTarget` | `float` | Cible d'ajustement de la sensibilité de la souris |
| `mouseSensitivityAdjustmentDuration` | `float` | Durée de l'ajustement |
| `abilityEffects` | `AbilityEffects` | Effets de capacité |

### DamageCause

Cause de dégâts.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de la cause |
| `damageTextColor` | `String` | Couleur du texte de dégâts |

### Color / ColorAlpha

Structure de couleur.

| Champ | Type | Description |
|-------|------|-------------|
| `r` | `byte` | Composante rouge (0-255) |
| `g` | `byte` | Composante verte (0-255) |
| `b` | `byte` | Composante bleue (0-255) |
| `a` | `byte` | Composante alpha (ColorAlpha uniquement) |

---

## Registres et Gestion

### Registry

Système de registre générique pour l'enregistrement des types.

| Méthode | Description |
|---------|-------------|
| `register(T)` | Enregistre un nouvel élément |
| `isEnabled()` | Vérifie si le registre est actif |
| `enable()` | Active le registre |
| `shutdown()` | Désactive le registre |

### BlockPhysics

Composant de physique de bloc (support et décoration).

| Champ | Type | Description |
|-------|------|-------------|
| `supportData` | `byte[]` | Données de support (16384 octets) |
| `IS_DECO_VALUE` | `int` | Valeur indiquant un bloc décoratif (15) |
| `NULL_SUPPORT` | `int` | Pas de support (0) |

| Méthode | Description |
|---------|-------------|
| `set(x, y, z, support)` | Définit la valeur de support |
| `get(x, y, z)` | Obtient la valeur de support |
| `isDeco(x, y, z)` | Vérifie si c'est un bloc décoratif |
| `markDeco(...)` | Marque comme décoratif |
| `clear(...)` | Efface les données |

---

## Notes Techniques

### Sérialisation

Tous les types utilisent un format de sérialisation binaire personnalisé basé sur :
- **VarInt** : Entiers de taille variable
- **Null bits** : Champs de bits indiquant les champs nullables présents
- **Fixed block** : Partie de taille fixe au début
- **Variable block** : Partie de taille variable pour les champs dynamiques

### Package Source

```
com.hypixel.hytale.protocol - Types de protocole et de données
com.hypixel.hytale.server.core.blocktype - Module de types de blocs
com.hypixel.hytale.registry - Système de registre
```

---

## Types de Donnees Etendus

Cette section fournit des types de donnees supplementaires decouverts dans le code decompile du serveur, incluant des enums, des classes de configuration et des structures de donnees pour le gameplay, les permissions, le combat et la gestion du monde.

---

### Types de Mouvement et d'Animation

#### MovementType

`com.hypixel.hytale.protocol.MovementType`

Definit le type de mouvement qu'une entite effectue actuellement. Utilise par les systemes d'animation et de physique.

| Valeur | ID | Description |
|--------|-----|-------------|
| `None` | 0 | Aucun mouvement |
| `Idle` | 1 | L'entite est immobile mais active |
| `Crouching` | 2 | L'entite est accroupie/furtive |
| `Walking` | 3 | Marche a vitesse normale |
| `Running` | 4 | Course a vitesse augmentee |
| `Sprinting` | 5 | Sprint a vitesse maximale |
| `Climbing` | 6 | Escalade d'une echelle ou surface |
| `Swimming` | 7 | Nage dans l'eau |
| `Flying` | 8 | Vol (mode creatif ou planeur) |
| `Sliding` | 9 | Glissade sur une surface |
| `Rolling` | 10 | Roulade d'esquive |
| `Mounting` | 11 | Chevaucher une monture a vitesse normale |
| `SprintMounting` | 12 | Chevaucher une monture en sprint |

**Source :** `com/hypixel/hytale/protocol/MovementType.java`

**Exemple d'utilisation :**
```java
MovementType currentMovement = entity.getMovementType();
if (currentMovement == MovementType.Sprinting) {
    // Appliquer la consommation d'endurance
}
```

---

#### AnimationSlot

`com.hypixel.hytale.protocol.AnimationSlot`

Definit les emplacements de couches d'animation utilises par le systeme d'animation des entites. Plusieurs animations peuvent jouer simultanement sur differents emplacements.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Movement` | 0 | Animations de mouvement de base (marche, course, repos) |
| `Status` | 1 | Animations d'effets de statut (etourdi, empoisonne) |
| `Action` | 2 | Animations d'actions (attaque, utilisation d'objet) |
| `Face` | 3 | Expressions faciales et mouvements de tete |
| `Emote` | 4 | Animations d'emotes/gestes |

**Source :** `com/hypixel/hytale/protocol/AnimationSlot.java`

**Contexte d'utilisation :** Le systeme d'animation utilise des emplacements pour melanger plusieurs animations. Par exemple, un personnage peut marcher (emplacement Movement) tout en montrant une expression empoisonnee (emplacement Status) et en saluant (emplacement Emote) simultanement.

---

### Types de Connexion

#### DisconnectType

`com.hypixel.hytale.protocol.packets.connection.DisconnectType`

Specifie la raison de la deconnexion d'un client du serveur.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Disconnect` | 0 | Deconnexion normale (joueur a quitte, expulse, etc.) |
| `Crash` | 1 | Deconnexion due a un crash ou une erreur |

**Source :** `com/hypixel/hytale/protocol/packets/connection/DisconnectType.java`

---

### Types Visuels et de Rendu

#### ShadingMode

`com.hypixel.hytale.protocol.ShadingMode`

Definit le mode d'ombrage pour le rendu des blocs.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Standard` | 0 | Eclairage et ombres standard |
| `Flat` | 1 | Ombrage plat sans degrades |
| `Fullbright` | 2 | Pas d'ombres, luminosite maximale |
| `Reflective` | 3 | Ombrage de surface reflechissante |

**Source :** `com/hypixel/hytale/protocol/ShadingMode.java`

---

### Systeme de Permissions

Le systeme de permissions controle l'acces aux commandes, fonctionnalites et outils de l'editeur.

#### HytalePermissions

`com.hypixel.hytale.server.core.permissions.HytalePermissions`

Definit les chaines de permissions integrees utilisees par le serveur Hytale.

| Permission | Description |
|------------|-------------|
| `hytale.command` | Permission de base pour les commandes |
| `hytale.editor.asset` | Acces a l'editeur d'assets |
| `hytale.editor.packs.create` | Creer des packs d'assets |
| `hytale.editor.packs.edit` | Modifier des packs d'assets |
| `hytale.editor.packs.delete` | Supprimer des packs d'assets |
| `hytale.editor.builderTools` | Acces aux outils de construction |
| `hytale.editor.brush.use` | Utiliser les pinceaux |
| `hytale.editor.brush.config` | Configurer les pinceaux |
| `hytale.editor.prefab.use` | Utiliser les prefabs |
| `hytale.editor.prefab.manage` | Gerer les prefabs |
| `hytale.editor.selection.use` | Utiliser les outils de selection |
| `hytale.editor.selection.clipboard` | Utiliser les operations du presse-papiers |
| `hytale.editor.selection.modify` | Modifier les selections |
| `hytale.editor.history` | Acces a l'historique (annuler/refaire) |
| `hytale.camera.flycam` | Utiliser le mode camera volante |

**Source :** `com/hypixel/hytale/server/core/permissions/HytalePermissions.java`

**Exemple d'utilisation :**
```java
// Verifier si un joueur a une permission
if (player.hasPermission("hytale.editor.builderTools")) {
    // Activer les outils de construction
}

// Generer une permission de commande
String permission = HytalePermissions.fromCommand("teleport");
// Retourne "hytale.command.teleport"
```

---

#### PermissionProvider

`com.hypixel.hytale.server.core.permissions.provider.PermissionProvider`

Interface pour implementer des systemes de permissions personnalises.

| Methode | Description |
|---------|-------------|
| `getName()` | Retourne le nom du fournisseur |
| `addUserPermissions(UUID, Set<String>)` | Ajouter des permissions a un utilisateur |
| `removeUserPermissions(UUID, Set<String>)` | Retirer des permissions d'un utilisateur |
| `getUserPermissions(UUID)` | Obtenir toutes les permissions d'un utilisateur |
| `addGroupPermissions(String, Set<String>)` | Ajouter des permissions a un groupe |
| `removeGroupPermissions(String, Set<String>)` | Retirer des permissions d'un groupe |
| `getGroupPermissions(String)` | Obtenir toutes les permissions d'un groupe |
| `addUserToGroup(UUID, String)` | Ajouter un utilisateur a un groupe |
| `removeUserFromGroup(UUID, String)` | Retirer un utilisateur d'un groupe |
| `getGroupsForUser(UUID)` | Obtenir tous les groupes d'un utilisateur |

**Source :** `com/hypixel/hytale/server/core/permissions/provider/PermissionProvider.java`

---

#### PermissionHolder

`com.hypixel.hytale.server.core.permissions.PermissionHolder`

Interface pour les entites pouvant detenir des permissions.

| Methode | Description |
|---------|-------------|
| `hasPermission(String)` | Verifier si le detenteur a une permission |
| `hasPermission(String, boolean)` | Verifier une permission avec valeur par defaut |

**Source :** `com/hypixel/hytale/server/core/permissions/PermissionHolder.java`

---

### Configuration du Monde

#### WorldConfig (Execution)

`com.hypixel.hytale.server.core.universe.world.WorldConfig`

Configuration complete du monde pour la gestion en temps d'execution.

| Champ | Type | Defaut | Description |
|-------|------|--------|-------------|
| `UUID` | `UUID` | Aleatoire | Identifiant unique du monde |
| `DisplayName` | `String` | - | Nom du monde affiche aux joueurs |
| `Seed` | `long` | Heure actuelle | Graine de generation du monde |
| `SpawnProvider` | `ISpawnProvider` | null | Controle le lieu d'apparition |
| `WorldGen` | `IWorldGenProvider` | Defaut | Generateur de monde |
| `WorldMap` | `IWorldMapProvider` | Defaut | Fournisseur de carte du monde |
| `ChunkStorage` | `IChunkStorageProvider` | Defaut | Systeme de stockage des chunks |
| `IsTicking` | `boolean` | true | Activer le tick des chunks |
| `IsBlockTicking` | `boolean` | true | Activer le tick des blocs |
| `IsPvpEnabled` | `boolean` | false | Activer le joueur contre joueur |
| `IsFallDamageEnabled` | `boolean` | true | Activer les degats de chute |
| `IsGameTimePaused` | `boolean` | false | Mettre en pause le cycle jour/nuit |
| `GameTime` | `Instant` | 5h30 | Heure actuelle du jeu |
| `ForcedWeather` | `String` | null | Forcer une meteo specifique |
| `GameMode` | `GameMode` | Defaut serveur | Mode de jeu par defaut |
| `IsSpawningNPC` | `boolean` | true | Autoriser l'apparition des PNJ |
| `IsSpawnMarkersEnabled` | `boolean` | true | Afficher les marqueurs d'apparition |
| `IsAllNPCFrozen` | `boolean` | false | Geler tous les PNJ |
| `GameplayConfig` | `String` | "Default" | Reference de configuration de gameplay |
| `IsSavingPlayers` | `boolean` | true | Sauvegarder les donnees des joueurs |
| `IsSavingChunks` | `boolean` | true | Sauvegarder les donnees des chunks |
| `SaveNewChunks` | `boolean` | true | Sauvegarder les nouveaux chunks generes |
| `IsUnloadingChunks` | `boolean` | true | Autoriser le dechargement des chunks |
| `DeleteOnUniverseStart` | `boolean` | false | Supprimer le monde au demarrage du serveur |
| `DeleteOnRemove` | `boolean` | false | Supprimer les fichiers lors de la suppression |

**Source :** `com/hypixel/hytale/server/core/universe/world/WorldConfig.java`

**Exemple JSON :**
```json
{
  "DisplayName": "Monde Aventure",
  "Seed": 12345,
  "IsPvpEnabled": true,
  "IsFallDamageEnabled": true,
  "GameMode": "Adventure",
  "DaytimeDurationSeconds": 1200,
  "NighttimeDurationSeconds": 600
}
```

---

#### WorldConfig (Asset de Gameplay)

`com.hypixel.hytale.server.core.asset.type.gameplay.WorldConfig`

Configuration du monde en tant que partie des assets de configuration de gameplay.

| Champ | Type | Defaut | Description |
|-------|------|--------|-------------|
| `AllowBlockBreaking` | `boolean` | true | Autoriser les joueurs a casser des blocs |
| `AllowBlockGathering` | `boolean` | true | Autoriser la recolte de ressources |
| `AllowBlockPlacement` | `boolean` | true | Autoriser le placement de blocs |
| `BlockPlacementFragilityTimer` | `float` | 0 | Secondes pendant lesquelles les blocs sont fragiles apres placement |
| `DaytimeDurationSeconds` | `int` | 1728 | Secondes reelles pour le jour (29 minutes) |
| `NighttimeDurationSeconds` | `int` | 1728 | Secondes reelles pour la nuit (29 minutes) |
| `TotalMoonPhases` | `int` | 5 | Nombre de phases lunaires |
| `Sleep` | `SleepConfig` | Defaut | Configuration du sommeil |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/WorldConfig.java`

**Note :** Le cycle jour/nuit par defaut est de 48 minutes reelles (2880 secondes au total), avec des periodes egales de jour et de nuit de 1728 secondes chacune.

---

#### SleepConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.SleepConfig`

Configuration des mecaniques de sommeil dans les mondes.

| Champ | Type | Defaut | Description |
|-------|------|--------|-------------|
| `WakeUpHour` | `float` | 5.5 | Heure du jeu au reveil (5h30) |
| `AllowedSleepHoursRange` | `double[2]` | null | Plage d'heures ou le sommeil est autorise |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/SleepConfig.java`

**Exemple JSON :**
```json
{
  "Sleep": {
    "WakeUpHour": 6.0,
    "AllowedSleepHoursRange": [20.0, 6.0]
  }
}
```

---

### Configuration du Combat

#### CombatConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.CombatConfig`

Configuration des mecaniques de combat.

| Champ | Type | Defaut | Description |
|-------|------|--------|-------------|
| `OutOfCombatDelaySeconds` | `Duration` | 5000ms | Delai avant d'etre considere hors combat |
| `StaminaBrokenEffectId` | `String` | "Stamina_Broken" | Effet applique quand l'endurance est epuisee |
| `DisplayHealthBars` | `boolean` | true | Afficher les barres de vie au-dessus des entites |
| `DisplayCombatText` | `boolean` | true | Afficher les nombres de degats |
| `DisableNPCIncomingDamage` | `boolean` | false | Rendre les PNJ invulnerables |
| `DisablePlayerIncomingDamage` | `boolean` | false | Rendre les joueurs invulnerables |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/CombatConfig.java`

**Exemple JSON :**
```json
{
  "Combat": {
    "OutOfCombatDelaySeconds": 8,
    "DisplayHealthBars": true,
    "DisplayCombatText": true,
    "DisablePlayerIncomingDamage": false
  }
}
```

---

### Configuration de Mort et Reapparition

#### DeathConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.DeathConfig`

Configuration des mecaniques de mort et de perte d'objets.

| Champ | Type | Defaut | Description |
|-------|------|--------|-------------|
| `RespawnController` | `RespawnController` | HomeOrSpawnPoint | Determine le lieu de reapparition |
| `ItemsLossMode` | `ItemsLossMode` | NONE | Comment les objets sont perdus a la mort |
| `ItemsAmountLossPercentage` | `double` | 10.0 | Pourcentage d'objets perdus (0-100) |
| `ItemsDurabilityLossPercentage` | `double` | 10.0 | Durabilite perdue a la mort (0-100) |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/DeathConfig.java`

---

#### ItemsLossMode

`com.hypixel.hytale.server.core.asset.type.gameplay.DeathConfig.ItemsLossMode`

Definit comment les objets sont perdus a la mort.

| Valeur | Description |
|--------|-------------|
| `NONE` | Aucun objet n'est perdu |
| `ALL` | Tous les objets sont perdus |
| `CONFIGURED` | Utilise le pourcentage configure pour les objets avec `DropOnDeath=true` |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/DeathConfig.java`

---

### Configuration de Gameplay

#### GameplayConfig

`com.hypixel.hytale.server.core.asset.type.gameplay.GameplayConfig`

Configuration principale des mecaniques de gameplay, combinant plusieurs sous-configurations.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `String` | Identifiant de configuration (ex: "Default") |
| `Gathering` | `GatheringConfig` | Parametres de recolte de ressources |
| `World` | `WorldConfig` | Parametres des mecaniques du monde |
| `WorldMap` | `WorldMapConfig` | Parametres de la carte du monde |
| `Death` | `DeathConfig` | Parametres de mort et reapparition |
| `Respawn` | `RespawnConfig` | Mecaniques de reapparition |
| `ShowItemPickupNotifications` | `boolean` | Afficher l'interface de ramassage d'objets |
| `ItemDurability` | `ItemDurabilityConfig` | Parametres de durabilite |
| `ItemEntity` | `ItemEntityConfig` | Parametres des objets au sol |
| `Combat` | `CombatConfig` | Mecaniques de combat |
| `Player` | `PlayerConfig` | Parametres du joueur |
| `CameraEffects` | `CameraEffectsConfig` | Parametres des effets de camera |
| `Crafting` | `CraftingConfig` | Parametres de fabrication |
| `Spawn` | `SpawnConfig` | Parametres d'apparition |
| `MaxEnvironmentalNPCSpawns` | `int` | Max d'apparitions de PNJ (-1 pour infini) |
| `CreativePlaySoundSet` | `String` | Ensemble de sons pour le mode creatif |

**Source :** `com/hypixel/hytale/server/core/asset/type/gameplay/GameplayConfig.java`

**Exemple JSON :**
```json
{
  "Id": "Adventure",
  "World": {
    "AllowBlockBreaking": true,
    "DaytimeDurationSeconds": 1200
  },
  "Combat": {
    "DisplayHealthBars": true,
    "OutOfCombatDelaySeconds": 5
  },
  "Death": {
    "ItemsLossMode": "CONFIGURED",
    "ItemsAmountLossPercentage": 25.0
  },
  "MaxEnvironmentalNPCSpawns": 300
}
```

---

## Reference des Packages Sources

| Package | Contenu |
|---------|---------|
| `com.hypixel.hytale.protocol` | Enums et types de donnees du protocole |
| `com.hypixel.hytale.protocol.packets.connection` | Paquets lies a la connexion |
| `com.hypixel.hytale.protocol.packets.setup` | Paquets de configuration (WorldSettings) |
| `com.hypixel.hytale.server.core.permissions` | Systeme de permissions |
| `com.hypixel.hytale.server.core.permissions.provider` | Fournisseurs de permissions |
| `com.hypixel.hytale.server.core.universe.world` | Gestion du monde |
| `com.hypixel.hytale.server.core.asset.type.gameplay` | Assets de configuration de gameplay |

---

---

## Enumerations Additionnelles (Protocole)

Cette section documente les enumerations additionnelles decouvertes dans la couche protocole, essentielles pour les moddeurs et createurs de contenu.

### Son et Audio

#### SoundCategory

`com.hypixel.hytale.protocol.SoundCategory`

Categories pour la lecture audio et le controle du volume.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Music` | 0 | Musique de fond |
| `Ambient` | 1 | Sons ambiants environnementaux |
| `SFX` | 2 | Effets sonores (actions, combat, etc.) |
| `UI` | 3 | Sons d'interface utilisateur |

**Source :** `com/hypixel/hytale/protocol/SoundCategory.java`

---

#### BlockSoundEvent

`com.hypixel.hytale.protocol.BlockSoundEvent`

Evenements declenchant les sons lies aux blocs.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Walk` | 0 | Marcher sur le bloc |
| `Land` | 1 | Atterrir sur le bloc |
| `MoveIn` | 2 | Entrer dans le bloc |
| `MoveOut` | 3 | Sortir du bloc |
| `Hit` | 4 | Frapper/endommager le bloc |
| `Break` | 5 | Casser le bloc |
| `Build` | 6 | Placer le bloc |
| `Clone` | 7 | Cloner le bloc (outils de construction) |
| `Harvest` | 8 | Recolter du bloc |

**Source :** `com/hypixel/hytale/protocol/BlockSoundEvent.java`

---

#### ItemSoundEvent

`com.hypixel.hytale.protocol.ItemSoundEvent`

Evenements declenchant les sons lies aux items.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Drag` | 0 | Glisser un item dans l'inventaire |
| `Drop` | 1 | Lacher un item |

**Source :** `com/hypixel/hytale/protocol/ItemSoundEvent.java`

---

### Particules et Effets Visuels

#### BlockParticleEvent

`com.hypixel.hytale.protocol.BlockParticleEvent`

Evenements declenchant les effets de particules de bloc.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Walk` | 0 | Particules de marche |
| `Run` | 1 | Particules de course |
| `Sprint` | 2 | Particules de sprint |
| `SoftLand` | 3 | Particules d'atterrissage douce |
| `HardLand` | 4 | Particules d'atterrissage dure (degats de chute) |
| `MoveOut` | 5 | Particules de sortie |
| `Hit` | 6 | Particules d'impact |
| `Break` | 7 | Particules de cassure de bloc |
| `Build` | 8 | Particules de placement de bloc |
| `Physics` | 9 | Particules declenchees par la physique |

**Source :** `com/hypixel/hytale/protocol/BlockParticleEvent.java`

---

#### EmitShape

`com.hypixel.hytale.protocol.EmitShape`

Formes d'emission de particules.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Sphere` | 0 | Emission spherique |
| `Cube` | 1 | Emission cubique |

**Source :** `com/hypixel/hytale/protocol/EmitShape.java`

---

#### FXRenderMode

`com.hypixel.hytale.protocol.FXRenderMode`

Modes de rendu pour les effets visuels.

| Valeur | ID | Description |
|--------|-----|-------------|
| `BlendLinear` | 0 | Melange lineaire |
| `BlendAdd` | 1 | Melange additif |
| `Erosion` | 2 | Effet d'erosion |
| `Distortion` | 3 | Effet de distorsion |

**Source :** `com/hypixel/hytale/protocol/FXRenderMode.java`

---

#### ShaderType

`com.hypixel.hytale.protocol.ShaderType`

Effets de shader applicables aux blocs.

| Valeur | ID | Description |
|--------|-----|-------------|
| `None` | 0 | Pas d'effet de shader |
| `Wind` | 1 | Animation de vent |
| `WindAttached` | 2 | Animation de vent (attachee) |
| `WindRandom` | 3 | Animation de vent aleatoire |
| `WindFractal` | 4 | Animation de vent fractale |
| `Ice` | 5 | Shader de glace |
| `Water` | 6 | Shader d'eau |
| `Lava` | 7 | Shader de lave |
| `Slime` | 8 | Shader de slime |
| `Ripple` | 9 | Effet d'ondulation |

**Source :** `com/hypixel/hytale/protocol/ShaderType.java`

---

### Camera et Vue

#### CameraPerspectiveType

`com.hypixel.hytale.protocol.CameraPerspectiveType`

Modes de perspective de la camera.

| Valeur | ID | Description |
|--------|-----|-------------|
| `First` | 0 | Vue a la premiere personne |
| `Third` | 1 | Vue a la troisieme personne |

**Source :** `com/hypixel/hytale/protocol/CameraPerspectiveType.java`

---

#### CameraActionType

`com.hypixel.hytale.protocol.CameraActionType`

Types d'actions de camera.

| Valeur | ID | Description |
|--------|-----|-------------|
| `ForcePerspective` | 0 | Forcer une perspective specifique |
| `Orbit` | 1 | Orbiter autour d'une cible |
| `Transition` | 2 | Transition entre positions |

**Source :** `com/hypixel/hytale/protocol/CameraActionType.java`

---

### Animation et Easing

#### EasingType

`com.hypixel.hytale.protocol.EasingType`

Fonctions d'easing pour des animations et transitions fluides. Essentiel pour creer des mouvements fluides dans les animations personnalisees.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Linear` | 0 | Lineaire (vitesse constante) |
| `QuadIn` | 1 | Quadratique entree |
| `QuadOut` | 2 | Quadratique sortie |
| `QuadInOut` | 3 | Quadratique entree/sortie |
| `CubicIn` | 4 | Cubique entree |
| `CubicOut` | 5 | Cubique sortie |
| `CubicInOut` | 6 | Cubique entree/sortie |
| `QuartIn` | 7 | Quartique entree |
| `QuartOut` | 8 | Quartique sortie |
| `QuartInOut` | 9 | Quartique entree/sortie |
| `QuintIn` | 10 | Quintique entree |
| `QuintOut` | 11 | Quintique sortie |
| `QuintInOut` | 12 | Quintique entree/sortie |
| `SineIn` | 13 | Sinusoidale entree |
| `SineOut` | 14 | Sinusoidale sortie |
| `SineInOut` | 15 | Sinusoidale entree/sortie |
| `ExpoIn` | 16 | Exponentielle entree |
| `ExpoOut` | 17 | Exponentielle sortie |
| `ExpoInOut` | 18 | Exponentielle entree/sortie |
| `CircIn` | 19 | Circulaire entree |
| `CircOut` | 20 | Circulaire sortie |
| `CircInOut` | 21 | Circulaire entree/sortie |
| `ElasticIn` | 22 | Elastique entree |
| `ElasticOut` | 23 | Elastique sortie |
| `ElasticInOut` | 24 | Elastique entree/sortie |
| `BackIn` | 25 | Back entree |
| `BackOut` | 26 | Back sortie |
| `BackInOut` | 27 | Back entree/sortie |
| `BounceIn` | 28 | Rebond entree |
| `BounceOut` | 29 | Rebond sortie |
| `BounceInOut` | 30 | Rebond entree/sortie |

**Source :** `com/hypixel/hytale/protocol/EasingType.java`

---

### Entree et Interaction

#### ClickType

`com.hypixel.hytale.protocol.ClickType`

Types de clic souris.

| Valeur | ID | Description |
|--------|-----|-------------|
| `None` | 0 | Pas de clic |
| `Left` | 1 | Bouton gauche de la souris |
| `Right` | 2 | Bouton droit de la souris |
| `Middle` | 3 | Bouton du milieu de la souris |

**Source :** `com/hypixel/hytale/protocol/ClickType.java`

---

#### InteractionState

`com.hypixel.hytale.protocol.InteractionState`

Etats d'une interaction.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Finished` | 0 | Interaction terminee avec succes |
| `Skip` | 1 | Interaction sautee |
| `ItemChanged` | 2 | Item change pendant l'interaction |
| `Failed` | 3 | Interaction echouee |
| `NotFinished` | 4 | Interaction encore en cours |

**Source :** `com/hypixel/hytale/protocol/InteractionState.java`

---

#### InteractionTarget

`com.hypixel.hytale.protocol.InteractionTarget`

Cible d'une interaction.

| Valeur | ID | Description |
|--------|-----|-------------|
| `User` | 0 | L'utilisateur effectuant l'interaction |
| `Owner` | 1 | Le proprietaire de l'entite interagie |
| `Target` | 2 | La cible de l'interaction |

**Source :** `com/hypixel/hytale/protocol/InteractionTarget.java`

---

### Inventaire

#### InventoryActionType

`com.hypixel.hytale.protocol.InventoryActionType`

Types d'actions d'inventaire.

| Valeur | ID | Description |
|--------|-----|-------------|
| `TakeAll` | 0 | Prendre tous les items |
| `PutAll` | 1 | Deposer tous les items |
| `QuickStack` | 2 | Rangement rapide vers les conteneurs proches |
| `Sort` | 3 | Trier l'inventaire |

**Source :** `com/hypixel/hytale/protocol/InventoryActionType.java`

---

#### SortType

`com.hypixel.hytale.server.core.inventory.container.SortType`

Methodes de tri d'inventaire.

| Valeur | Description |
|--------|-------------|
| `NAME` | Tri alphabetique par nom |
| `TYPE` | Tri par type d'item (Arme, Armure, Outil, Item, Special) |
| `RARITY` | Tri par rarete/qualite de l'item |

**Source :** `com/hypixel/hytale/server/core/inventory/container/SortType.java`

---

### Configuration des Blocs

#### BlockNeighbor

`com.hypixel.hytale.protocol.BlockNeighbor`

Toutes les directions de blocs voisins possibles (26 voisins au total).

| Valeur | ID | Description |
|--------|-----|-------------|
| `Up` | 0 | Au-dessus |
| `Down` | 1 | En-dessous |
| `North` | 2 | Nord |
| `East` | 3 | Est |
| `South` | 4 | Sud |
| `West` | 5 | Ouest |
| `UpNorth` | 6 | Au-dessus et Nord |
| `UpSouth` | 7 | Au-dessus et Sud |
| `UpEast` | 8 | Au-dessus et Est |
| `UpWest` | 9 | Au-dessus et Ouest |
| `DownNorth` | 10 | En-dessous et Nord |
| `DownSouth` | 11 | En-dessous et Sud |
| `DownEast` | 12 | En-dessous et Est |
| `DownWest` | 13 | En-dessous et Ouest |
| `NorthEast` | 14 | Nord-Est |
| `SouthEast` | 15 | Sud-Est |
| `SouthWest` | 16 | Sud-Ouest |
| `NorthWest` | 17 | Nord-Ouest |
| `UpNorthEast` | 18 | Au-dessus et Nord-Est |
| `UpSouthEast` | 19 | Au-dessus et Sud-Est |
| `UpSouthWest` | 20 | Au-dessus et Sud-Ouest |
| `UpNorthWest` | 21 | Au-dessus et Nord-Ouest |
| `DownNorthEast` | 22 | En-dessous et Nord-Est |
| `DownSouthEast` | 23 | En-dessous et Sud-Est |
| `DownSouthWest` | 24 | En-dessous et Sud-Ouest |
| `DownNorthWest` | 25 | En-dessous et Nord-Ouest |

**Source :** `com/hypixel/hytale/protocol/BlockNeighbor.java`

---

#### ConnectedBlockRuleSetType

`com.hypixel.hytale.protocol.ConnectedBlockRuleSetType`

Types d'ensembles de regles pour les blocs connectes comme les escaliers.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Stair` | 0 | Regles de connexion d'escaliers |
| `Roof` | 1 | Regles de connexion de toit |

**Source :** `com/hypixel/hytale/protocol/ConnectedBlockRuleSetType.java`

---

### UI et Interface

#### Page

`com.hypixel.hytale.protocol.packets.interface_.Page`

Types de pages d'interface.

| Valeur | ID | Description |
|--------|-----|-------------|
| `None` | 0 | Aucune page |
| `Bench` | 1 | Page d'etabli de fabrication |
| `Inventory` | 2 | Page d'inventaire |
| `ToolsSettings` | 3 | Page de parametres des outils |
| `Map` | 4 | Page de carte du monde |
| `MachinimaEditor` | 5 | Page de l'editeur machinima |
| `ContentCreation` | 6 | Page de creation de contenu |
| `Custom` | 7 | Page personnalisee |

**Source :** `com/hypixel/hytale/protocol/packets/interface_/Page.java`

---

#### HudComponent

`com.hypixel.hytale.protocol.packets.interface_.HudComponent`

Composants du HUD (Affichage Tete Haute) pouvant etre affiches/masques.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Hotbar` | 0 | Barre d'acces rapide |
| `StatusIcons` | 1 | Icones d'effets de statut |
| `Reticle` | 2 | Viseur/reticule |
| `Chat` | 3 | Fenetre de discussion |
| `Requests` | 4 | Notifications de demandes |
| `Notifications` | 5 | Notifications generales |
| `KillFeed` | 6 | Fil d'eliminations |
| `InputBindings` | 7 | Indices de raccourcis |
| `PlayerList` | 8 | Liste des joueurs (Tab) |
| `EventTitle` | 9 | Affichage de titre d'evenement |
| `Compass` | 10 | Boussole |
| `ObjectivePanel` | 11 | Panneau d'objectifs/quetes |
| `PortalPanel` | 12 | Panneau de portail |
| `BuilderToolsLegend` | 13 | Legende des outils de construction |
| `Speedometer` | 14 | Indicateur de vitesse |
| `UtilitySlotSelector` | 15 | Selecteur d'emplacement utilitaire |
| `BlockVariantSelector` | 16 | Selecteur de variante de bloc |
| `BuilderToolsMaterialSlotSelector` | 17 | Selecteur d'emplacement de materiau |
| `Stamina` | 18 | Barre d'endurance |
| `AmmoIndicator` | 19 | Indicateur de munitions |
| `Health` | 20 | Barre de vie |
| `Mana` | 21 | Barre de mana |
| `Oxygen` | 22 | Barre d'oxygene |
| `Sleep` | 23 | Indicateur de sommeil |

**Source :** `com/hypixel/hytale/protocol/packets/interface_/HudComponent.java`

---

#### WindowType

`com.hypixel.hytale.protocol.packets.window.WindowType`

Types de fenetres (conteneurs/UI).

| Valeur | ID | Description |
|--------|-----|-------------|
| `Container` | 0 | Conteneur generique |
| `PocketCrafting` | 1 | Fabrication de poche (2x2) |
| `BasicCrafting` | 2 | Etabli de fabrication basique |
| `DiagramCrafting` | 3 | Fabrication par diagramme |
| `StructuralCrafting` | 4 | Fabrication structurelle |
| `Processing` | 5 | Traitement (fourneau, etc.) |
| `Memories` | 6 | Systeme de memoires/connaissances |

**Source :** `com/hypixel/hytale/protocol/packets/window/WindowType.java`

---

### Outils de Construction

#### BrushShape

`com.hypixel.hytale.protocol.packets.buildertools.BrushShape`

Formes de pinceaux disponibles pour les outils de construction.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Cube` | 0 | Forme cubique |
| `Sphere` | 1 | Forme spherique |
| `Cylinder` | 2 | Forme cylindrique |
| `Cone` | 3 | Forme conique |
| `InvertedCone` | 4 | Forme conique inversee |
| `Pyramid` | 5 | Forme pyramidale |
| `InvertedPyramid` | 6 | Forme pyramidale inversee |
| `Dome` | 7 | Dome (demi-sphere) |
| `InvertedDome` | 8 | Dome inverse |
| `Diamond` | 9 | Forme losange |
| `Torus` | 10 | Forme tore (donut) |

**Source :** `com/hypixel/hytale/protocol/packets/buildertools/BrushShape.java`

---

#### BrushOrigin

`com.hypixel.hytale.protocol.packets.buildertools.BrushOrigin`

Point d'origine pour le placement du pinceau.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Center` | 0 | Centre du pinceau |
| `Bottom` | 1 | Bas du pinceau |
| `Top` | 2 | Haut du pinceau |

**Source :** `com/hypixel/hytale/protocol/packets/buildertools/BrushOrigin.java`

---

#### Axis

`com.hypixel.hytale.protocol.packets.buildertools.Axis`

Axes de coordonnees.

| Valeur | ID | Description |
|--------|-----|-------------|
| `X` | 0 | Axe X (Est-Ouest) |
| `Y` | 1 | Axe Y (Haut-Bas) |
| `Z` | 2 | Axe Z (Nord-Sud) |

**Source :** `com/hypixel/hytale/protocol/packets/buildertools/Axis.java`

---

### Physique et Forces

#### ApplyForceState

`com.hypixel.hytale.protocol.ApplyForceState`

Etats pour l'application de force (recul, capacites, etc.).

| Valeur | ID | Description |
|--------|-----|-------------|
| `Waiting` | 0 | En attente d'appliquer la force |
| `Ground` | 1 | Declenche au contact du sol |
| `Collision` | 2 | Declenche lors d'une collision |
| `Timer` | 3 | Declenche apres un delai |

**Source :** `com/hypixel/hytale/protocol/ApplyForceState.java`

---

#### CollisionType

`com.hypixel.hytale.protocol.CollisionType`

Types de detection de collision.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Hard` | 0 | Collision dure (bloque le mouvement) |
| `Soft` | 1 | Collision douce (declenche des evenements uniquement) |

**Source :** `com/hypixel/hytale/protocol/CollisionType.java`

---

#### RaycastMode

`com.hypixel.hytale.protocol.RaycastMode`

Modes de raycast (projectiles, ligne de vue, etc.).

| Valeur | ID | Description |
|--------|-----|-------------|
| `FollowMotion` | 0 | Le raycast suit la direction du mouvement |
| `FollowLook` | 1 | Le raycast suit la direction du regard |

**Source :** `com/hypixel/hytale/protocol/RaycastMode.java`

---

### Systeme d'Entites

#### EntityPart

`com.hypixel.hytale.protocol.EntityPart`

Parties d'une entite pouvant etre referencees.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Self` | 0 | L'entite elle-meme |
| `Entity` | 1 | Une autre entite |
| `PrimaryItem` | 2 | Item tenu principal |
| `SecondaryItem` | 3 | Item tenu secondaire |

**Source :** `com/hypixel/hytale/protocol/EntityPart.java`

---

#### EntityStatOp

`com.hypixel.hytale.protocol.EntityStatOp`

Operations sur les statistiques d'entite.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Init` | 0 | Initialiser la stat |
| `Remove` | 1 | Supprimer la stat |
| `PutModifier` | 2 | Ajouter un modificateur |
| `RemoveModifier` | 3 | Supprimer un modificateur |
| `Add` | 4 | Ajouter a la valeur |
| `Set` | 5 | Definir la valeur directement |
| `Minimize` | 6 | Definir au minimum |
| `Maximize` | 7 | Definir au maximum |
| `Reset` | 8 | Reinitialiser par defaut |

**Source :** `com/hypixel/hytale/protocol/EntityStatOp.java`

---

#### AttachedToType

`com.hypixel.hytale.protocol.AttachedToType`

Types d'attachement pour effets/particules.

| Valeur | ID | Description |
|--------|-----|-------------|
| `LocalPlayer` | 0 | Attache au joueur local |
| `EntityId` | 1 | Attache a une entite par ID |
| `None` | 2 | Non attache |

**Source :** `com/hypixel/hytale/protocol/AttachedToType.java`

---

#### EntityMatcherType

`com.hypixel.hytale.protocol.EntityMatcherType`

Types de correspondance d'entite pour le ciblage.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Server` | 0 | Correspondance cote serveur |
| `VulnerableMatcher` | 1 | Correspondre aux entites vulnerables |
| `Player` | 2 | Correspondre aux joueurs uniquement |

**Source :** `com/hypixel/hytale/protocol/EntityMatcherType.java`

---

#### Attitude

`com.hypixel.hytale.server.core.asset.type.attitude.Attitude`

Attitude/relation des PNJ envers les cibles.

| Valeur | Description |
|--------|-------------|
| `IGNORE` | Ignore la cible |
| `HOSTILE` | Hostile envers la cible |
| `NEUTRAL` | Neutre envers la cible |
| `FRIENDLY` | Amical envers la cible |
| `REVERED` | Venere la cible |

**Source :** `com/hypixel/hytale/server/core/asset/type/attitude/Attitude.java`

---

### Cosmetiques et Personnage

#### BodyType

`com.hypixel.hytale.server.core.cosmetics.BodyType`

Types de corps de personnage.

| Valeur | Description |
|--------|-------------|
| `Masculine` | Type de corps masculin |
| `Feminine` | Type de corps feminin |

**Source :** `com/hypixel/hytale/server/core/cosmetics/BodyType.java`

---

#### CosmeticType

`com.hypixel.hytale.server.core.cosmetics.CosmeticType`

Types de personnalisations cosmetiques disponibles.

| Valeur | Description |
|--------|-------------|
| `EMOTES` | Emotes/gestes |
| `SKIN_TONES` | Options de ton de peau |
| `EYE_COLORS` | Options de couleur des yeux |
| `GRADIENT_SETS` | Ensembles de degrades de couleur |
| `BODY_CHARACTERISTICS` | Caracteristiques corporelles |
| `UNDERWEAR` | Sous-vetements |
| `EYEBROWS` | Styles de sourcils |
| `EARS` | Styles d'oreilles |
| `EYES` | Styles d'yeux |
| `FACE` | Styles de visage |
| `MOUTHS` | Styles de bouche |
| `FACIAL_HAIR` | Styles de pilosite faciale |
| `PANTS` | Pantalons |
| `OVERPANTS` | Sur-pantalons |
| `UNDERTOPS` | Sous-vetements haut |
| `OVERTOPS` | Sur-vetements haut |
| `HAIRCUTS` | Styles de coupe de cheveux |
| `SHOES` | Chaussures |
| `HEAD_ACCESSORY` | Accessoires de tete |
| `FACE_ACCESSORY` | Accessoires de visage |
| `EAR_ACCESSORY` | Accessoires d'oreille |
| `GLOVES` | Gants |
| `CAPES` | Capes |
| `SKIN_FEATURES` | Caracteristiques de peau (taches de rousseur, etc.) |

**Source :** `com/hypixel/hytale/server/core/cosmetics/CosmeticType.java`

---

#### PlayerSkinPartType

`com.hypixel.hytale.server.core.cosmetics.PlayerSkinPartType`

Types de parties de skin du joueur.

| Valeur | Description |
|--------|-------------|
| `Eyes` | Yeux |
| `Ears` | Oreilles |
| `Mouth` | Bouche |
| `Eyebrows` | Sourcils |
| `Haircut` | Coupe de cheveux |
| `FacialHair` | Pilosite faciale |
| `Pants` | Pantalon |
| `Overpants` | Sur-pantalon |
| `Undertops` | Sous-vetement haut |
| `Overtops` | Sur-vetement haut |
| `Shoes` | Chaussures |
| `HeadAccessory` | Accessoire de tete |
| `FaceAccessory` | Accessoire de visage |
| `EarAccessory` | Accessoire d'oreille |
| `SkinFeature` | Caracteristique de peau |
| `Gloves` | Gants |

**Source :** `com/hypixel/hytale/server/core/cosmetics/PlayerSkinPartType.java`

---

### Combat

#### DamageClass

`com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.combat.DamageClass`

Classifications des types de degats.

| Valeur | Description |
|--------|-------------|
| `UNKNOWN` | Degats inconnus/non classes |
| `LIGHT` | Degats d'attaque legere |
| `CHARGED` | Degats d'attaque chargee |
| `SIGNATURE` | Degats de capacite signature/speciale |

**Source :** `com/hypixel/hytale/server/core/modules/interaction/interaction/config/server/combat/DamageClass.java`

---

### Systeme de Plugins

#### PluginState

`com.hypixel.hytale.server.core.plugin.PluginState`

Etats du cycle de vie des plugins.

| Valeur | Description |
|--------|-------------|
| `NONE` | Etat initial |
| `SETUP` | En configuration |
| `START` | En demarrage |
| `ENABLED` | En cours d'execution et active |
| `SHUTDOWN` | En arret |
| `DISABLED` | Desactive |

**Source :** `com/hypixel/hytale/server/core/plugin/PluginState.java`

---

### Reseau

#### TransportType

`com.hypixel.hytale.server.core.io.transport.TransportType`

Protocoles de transport reseau.

| Valeur | Description |
|--------|-------------|
| `TCP` | Protocole TCP |
| `QUIC` | Protocole QUIC (base UDP) |

**Source :** `com/hypixel/hytale/server/core/io/transport/TransportType.java`

---

### Systeme de Prefab

#### PrefabRotation

`com.hypixel.hytale.server.core.prefab.PrefabRotation`

Angles de rotation pour le placement de prefab.

| Valeur | Rotation | Description |
|--------|----------|-------------|
| `ROTATION_0` | 0 degres | Pas de rotation |
| `ROTATION_90` | 90 degres | Quart de tour horaire |
| `ROTATION_180` | 180 degres | Demi-tour |
| `ROTATION_270` | 270 degres | Quart de tour anti-horaire |

**Source :** `com/hypixel/hytale/server/core/prefab/PrefabRotation.java`

---

### Divers

#### AccumulationMode

`com.hypixel.hytale.protocol.AccumulationMode`

Modes d'accumulation/combinaison de valeurs.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Set` | 0 | Remplacer par la nouvelle valeur |
| `Sum` | 1 | Ajouter a la valeur existante |
| `Average` | 2 | Faire la moyenne avec la valeur existante |

**Source :** `com/hypixel/hytale/protocol/AccumulationMode.java`

---

#### Phobia

`com.hypixel.hytale.protocol.Phobia`

Filtres d'accessibilite pour les phobies.

| Valeur | ID | Description |
|--------|-----|-------------|
| `None` | 0 | Pas de filtre de phobie |
| `Arachnophobia` | 1 | Filtre araignee/arachnide |

**Source :** `com/hypixel/hytale/protocol/Phobia.java`

**Utilisation :** Cette enum est utilisee pour les fonctionnalites d'accessibilite, permettant aux joueurs d'activer des filtres qui modifient ou remplacent le contenu pouvant declencher des phobies.

---

#### AmbienceTransitionSpeed

`com.hypixel.hytale.protocol.AmbienceTransitionSpeed`

Vitesse des transitions de son/visuel ambiant.

| Valeur | ID | Description |
|--------|-----|-------------|
| `Default` | 0 | Vitesse de transition par defaut |
| `Fast` | 1 | Transition rapide |
| `Instant` | 2 | Transition instantanee |

**Source :** `com/hypixel/hytale/protocol/AmbienceTransitionSpeed.java`

---

## Reference des Packages Sources Mise a Jour

| Package | Contenu |
|---------|---------|
| `com.hypixel.hytale.protocol` | Enums et types de donnees du protocole |
| `com.hypixel.hytale.protocol.packets.connection` | Paquets lies a la connexion |
| `com.hypixel.hytale.protocol.packets.setup` | Paquets de configuration (WorldSettings) |
| `com.hypixel.hytale.protocol.packets.interface_` | Paquets et enums d'interface |
| `com.hypixel.hytale.protocol.packets.window` | Paquets de fenetres/conteneurs |
| `com.hypixel.hytale.protocol.packets.buildertools` | Paquets et enums des outils de construction |
| `com.hypixel.hytale.server.core.permissions` | Systeme de permissions |
| `com.hypixel.hytale.server.core.permissions.provider` | Fournisseurs de permissions |
| `com.hypixel.hytale.server.core.universe.world` | Gestion du monde |
| `com.hypixel.hytale.server.core.asset.type.gameplay` | Assets de configuration de gameplay |
| `com.hypixel.hytale.server.core.cosmetics` | Systeme de cosmetiques |
| `com.hypixel.hytale.server.core.inventory` | Systeme d'inventaire |
| `com.hypixel.hytale.server.core.plugin` | Systeme de plugins |
| `com.hypixel.hytale.server.core.prefab` | Systeme de prefab |
| `com.hypixel.hytale.server.core.io.transport` | Transport reseau |

---

*Documentation generee a partir du code decompile du serveur Hytale.*
