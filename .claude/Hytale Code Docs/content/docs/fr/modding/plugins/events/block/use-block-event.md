---
id: use-block-event
title: UseBlockEvent
sidebar_label: UseBlockEvent
---

# UseBlockEvent

> **Testé :** 17 janvier 2026 - Vérifié avec le plugin doc-test. Toutes les méthodes documentées fonctionnent correctement.

Un événement de base abstrait déclenché lorsqu'un bloc est utilise/interagi. Cet événement possede deux classes internes : `UseBlockEvent.Pre` (annulable, se déclenché avant l'interaction) et `UseBlockEvent.Post` (non annulable, se déclenché apres l'interaction). Utilisez cet événement pour gerer les interactions de blocs comme l'ouverture de conteneurs, l'activation de mecanismes, ou les comportements de blocs personnalises.

## Informations sur l'événement

| Propriété | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.event.events.ecs.UseBlockEvent` |
| **Classe parente** | `EcsEvent` |
| **Annulable** | Non (classe de base), Oui (classe interne Pre) |
| **Evenement ECS** | Oui |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/event/events/ecs/UseBlockEvent.java:11` |

## Declaration

```java
public abstract class UseBlockEvent extends EcsEvent {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `interactionType` | `@Nonnull InteractionType` | `getInteractionType()` | Le type d'interaction effectuee |
| `context` | `@Nonnull InteractionContext` | `getContext()` | Contexte supplementaire sur l'interaction |
| `targetBlock` | `@Nonnull Vector3i` | `getTargetBlock()` | La position du bloc avec lequel on interagit |
| `blockType` | `@Nonnull BlockType` | `getBlockType()` | Le type de bloc avec lequel on interagit |

## Méthodes

| Méthode | Signature | Description |
|---------|-----------|-------------|
| `getInteractionType` | `@Nonnull public InteractionType getInteractionType()` | Retourne le type d'interaction (ex: USE, ATTACK) |
| `getContext` | `@Nonnull public InteractionContext getContext()` | Retourne le contexte d'interaction avec des details supplementaires |
| `getTargetBlock` | `@Nonnull public Vector3i getTargetBlock()` | Retourne la position dans le monde du bloc cible |
| `getBlockType` | `@Nonnull public BlockType getBlockType()` | Retourne le type de bloc utilise |

## Classes internes

### UseBlockEvent.Pre

L'événement `Pre` se déclenché **avant** que l'interaction avec le bloc soit traitee. Cette variante est **annulable**.

| Propriété | Valeur |
|-----------|--------|
| **Numero de ligne** | 56 |
| **Annulable** | Oui |
| **Implemente** | `ICancellableEcsEvent` |

```java
public static final class Pre extends UseBlockEvent implements ICancellableEcsEvent {
    // Hérité de tous les champs de UseBlockEvent
    // Ajoute la capacite d'annulation

    public boolean isCancelled();
    public void setCancelled(boolean cancelled);
}
```

### UseBlockEvent.Post

L'événement `Post` se déclenché **apres** que l'interaction avec le bloc a ete traitee. Cette variante n'est **pas annulable**.

| Propriété | Valeur |
|-----------|--------|
| **Numero de ligne** | 50 |
| **Annulable** | Non |

```java
public static final class Post extends UseBlockEvent {
    // Hérité de tous les champs de UseBlockEvent
    // Se déclenché apres la completion de l'interaction
}
```

## Comprendre les événements ECS

**Important :** Les événements ECS (Entity Component System) fonctionnent différemment des événements `IEvent` classiques. Ils font partie de l'architecture basee sur les composants de Hytale et sont généralement envoyes et traites via le framework ECS plutot que via l'`EventBus` standard.

Differences cles :
- Les événements ECS etendent `EcsEvent` ou `CancellableEcsEvent` au lieu d'implementer `IEvent`
- Ils sont associes aux composants et systemes d'entites
- L'enregistrement et le traitement peuvent utiliser des mecanismes differents de l'event bus standard

## Exemple d'utilisation

```java
// Note: L'enregistrement des événements ECS peut differer de l'enregistrement standard IEvent
// Le mecanisme exact d'enregistrement depend de la facon dont votre plugin s'integre au systeme ECS

public class BlockInteractionPlugin extends PluginBase {

    @Override
    public void onEnable() {
        // S'enregistrer pour l'événement Pre afin d'intercepter/annuler les interactions
        registerEcsEventHandler(UseBlockEvent.Pre.class, this::onBlockUsePre);

        // S'enregistrer pour l'événement Post afin de reagir aux interactions completees
        registerEcsEventHandler(UseBlockEvent.Post.class, this::onBlockUsePost);
    }

    private void onBlockUsePre(UseBlockEvent.Pre event) {
        // Obtenir des informations sur l'interaction
        Vector3i position = event.getTargetBlock();
        BlockType blockType = event.getBlockType();
        InteractionType interactionType = event.getInteractionType();
        InteractionContext context = event.getContext();

        // Exemple: Empecher l'interaction avec les conteneurs verrouilles
        if (isLockedContainer(blockType, position)) {
            event.setCancelled(true);
            // Optionnellement envoyer un message au joueur
            return;
        }

        // Exemple: Restreindre certaines interactions selon les permissions
        if (!hasInteractionPermission(context, blockType)) {
            event.setCancelled(true);
            return;
        }

        // Exemple: Enregistrer les tentatives d'interaction
        logInteractionAttempt(position, blockType, interactionType);
    }

    private void onBlockUsePost(UseBlockEvent.Post event) {
        // Ceci se déclenché apres que l'interaction s'est terminee avec succès
        Vector3i position = event.getTargetBlock();
        BlockType blockType = event.getBlockType();
        InteractionType interactionType = event.getInteractionType();

        // Exemple: Suivre l'acces aux conteneurs
        if (isContainer(blockType)) {
            recordContainerAccess(position);
        }

        // Exemple: Declencher des effets personnalises apres l'utilisation de certains blocs
        if (isMagicalBlock(blockType)) {
            triggerMagicEffect(position);
        }

        // Exemple: Suivi des statistiques
        incrementBlockUseStatistic(blockType);
    }

    private boolean isLockedContainer(BlockType type, Vector3i position) {
        // Logique de verification de verrouillage
        return false;
    }

    private boolean hasInteractionPermission(InteractionContext ctx, BlockType type) {
        // Logique de verification des permissions
        return true;
    }

    private boolean isContainer(BlockType type) {
        // Verifier si le bloc est un conteneur (coffre, tonneau, etc.)
        return false;
    }

    private boolean isMagicalBlock(BlockType type) {
        // Verifier les types de blocs magiques
        return false;
    }

    private void logInteractionAttempt(Vector3i pos, BlockType type, InteractionType iType) {
        // Implementation de la journalisation
    }

    private void recordContainerAccess(Vector3i position) {
        // Suivi de l'acces aux conteneurs
    }

    private void triggerMagicEffect(Vector3i position) {
        // Implementation des effets personnalises
    }

    private void incrementBlockUseStatistic(BlockType type) {
        // Suivi des statistiques
    }
}
```

## Quand cet événement se déclenché

Le `UseBlockEvent` se déclenché lorsque :

1. **Un joueur fait un clic droit sur un bloc** - Interaction standard avec un bloc
2. **Une entite interagit avec un bloc** - Des mobs ou d'autres entites utilisant des blocs
3. **Interaction programmatique** - Utilisation de bloc déclenchée par le code

### Timing de l'événement Pre

`UseBlockEvent.Pre` se déclenché **avant** que toute logique d'interaction ne s'execute :
- Avant l'ouverture des interfaces de conteneurs
- Avant le basculement des leviers/boutons
- Avant l'ouverture/fermeture des portes
- Avant tout changement d'etat de bloc

### Timing de l'événement Post

`UseBlockEvent.Post` se déclenché **apres** que l'interaction est terminee :
- Apres que les interfaces de conteneurs ont ete affichees
- Apres que les etats des mecanismes ont change
- Apres tout effet lie au bloc déclenché

## Types d'interaction

L'enum `InteractionType` indique quel type d'interaction se produit :

- **USE** - Interaction standard par clic droit
- **ATTACK** - Interaction par clic gauche/attaque
- D'autres types peuvent etre definis pour des scenarios d'interaction spécifiques

## Contexte d'interaction

Le `InteractionContext` fournit des details supplementaires sur l'interaction :

- Informations sur l'entite qui interagit
- Main/objet utilise
- Emplacement du point d'impact sur la face du bloc
- Autres donnees contextuelles

## Comportement de l'annulation (événement Pre uniquement)

Lorsque `UseBlockEvent.Pre` est annule en appelant `setCancelled(true)` :

- L'interaction avec le bloc n'a **pas** lieu
- Les interfaces de conteneurs ne s'ouvrent pas
- Les etats des blocs ne changent pas
- L'événement `UseBlockEvent.Post` ne se déclenché **pas**
- Le joueur/l'entite recoit un retour indiquant que l'action a ete bloquee

Ceci est utile pour :
- Les systemes de verrouillage/protection pour les conteneurs
- Les restrictions d'interaction basees sur les permissions
- Les exigences d'interaction personnalisees
- Empecher l'utilisation de blocs spécifiques dans certains contextes

## Flux de l'événement

```
L'entite tente d'utiliser le bloc
          |
          v
   UseBlockEvent.Pre
          |
    [Annule?]
     /        \
   Oui        Non
    |           |
    v           v
 (arrete)  L'interaction
             s'execute
               |
               v
      UseBlockEvent.Post
               |
               v
          (termine)
```

## Événements lies

- [BreakBlockEvent](./break-block-event) - Declenche lorsqu'un bloc est casse
- [PlaceBlockEvent](./place-block-event) - Declenche lorsqu'un bloc est place
- [DamageBlockEvent](./damage-block-event) - Declenche lorsqu'un bloc subit des degats

## Détails internes

### Où l'événement est déclenché

Le `UseBlockEvent` est déclenché dans `UseBlockInteraction.doInteraction()` :

**Fichier :** `com/hypixel/hytale/server/core/modules/interaction/interaction/config/client/UseBlockInteraction.java`

```java
// Événement Pre (ligne 68-73)
UseBlockEvent.Pre event = new UseBlockEvent.Pre(type, context, targetBlock, blockType);
commandBuffer.invoke(ref, event);
if (event.isCancelled()) {
    context.getState().state = InteractionState.Failed;
    return;
}

// Événement Post (ligne 79-84)
UseBlockEvent.Post event = new UseBlockEvent.Post(type, context, targetBlock, blockType);
commandBuffer.invoke(ref, event);
```

### Implémentation de l'annulation

Lorsque `UseBlockEvent.Pre` est annulé :
1. L'état d'interaction est défini sur `InteractionState.Failed`
2. La méthode retourne immédiatement
3. La `RootInteraction` du bloc n'est **jamais exécutée**
4. `UseBlockEvent.Post` n'est **jamais déclenché**

### Hiérarchie de classes

```
EcsEvent (abstract)
└── UseBlockEvent (abstract)
    ├── UseBlockEvent.Pre (final, implements ICancellableEcsEvent)
    └── UseBlockEvent.Post (final)
```

## Test

Pour tester cet événement avec le plugin doc-test :

```
/doctest test-use-block-event
```

1. Exécutez la commande ci-dessus
2. Trouvez un bloc interactif (conteneur, levier, porte, etc.)
3. Faites un clic droit (utiliser) sur le bloc
4. Les détails de l'événement devraient apparaître dans le chat, confirmant que Pre et Post ont été déclenchés

## Référence source

`decompiled/com/hypixel/hytale/server/core/event/events/ecs/UseBlockEvent.java:11`

**Classes internes :**
- `UseBlockEvent.Post` - Ligne 50
- `UseBlockEvent.Pre` - Ligne 56
