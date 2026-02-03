---
id: loaded-npc-event
title: LoadedNPCEvent
sidebar_label: LoadedNPCEvent
---

# LoadedNPCEvent

Declenche lorsqu'une definition de PNJ individuelle est chargee depuis les fichiers d'assets. Cet evenement fournit un acces aux informations de construction du PNJ pour chaque type de PNJ spawnable au fur et a mesure qu'il devient disponible.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.spawning.LoadedNPCEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/spawning/LoadedNPCEvent.java` |

## Declaration

```java
public class LoadedNPCEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `builderInfo` | `BuilderInfo` | `getBuilderInfo()` | Les informations de construction pour le PNJ charge |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getBuilderInfo` | `public BuilderInfo getBuilderInfo()` | Retourne les informations de construction contenant les donnees de definition du PNJ |
| `toString` | `@Nonnull public String toString()` | Retourne une representation en chaine de l'evenement avec les informations du builder |

## Validation

Le constructeur de l'evenement valide que le `BuilderInfo` :
- Ne doit pas etre null
- Doit contenir un builder qui implemente `ISpawnableWithModel`

Si la validation echoue, une `IllegalArgumentException` est lancee.

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.spawning.LoadedNPCEvent;
import com.hypixel.hytale.server.npc.asset.builder.BuilderInfo;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class NPCLoadTrackerPlugin extends PluginBase {

    private final Set<String> trackedNPCs = new HashSet<>();

    @Override
    public void onEnable() {
        EventBus.register(LoadedNPCEvent.class, this::onNPCLoaded, EventPriority.NORMAL);
    }

    private void onNPCLoaded(LoadedNPCEvent event) {
        BuilderInfo builderInfo = event.getBuilderInfo();

        // Journaliser chaque PNJ au chargement
        getLogger().info("PNJ charge: " + builderInfo.toString());

        // Suivre des types de PNJ specifiques
        String npcIdentifier = builderInfo.getIdentifier();
        trackedNPCs.add(npcIdentifier);

        // Effectuer l'initialisation par PNJ
        initializeNPCExtensions(builderInfo);
    }

    private void initializeNPCExtensions(BuilderInfo builderInfo) {
        // Ajouter un comportement personnalise ou des donnees a la definition du PNJ
        // Ceci s'execute avant que le PNJ puisse etre spawn dans le monde
    }

    public Set<String> getTrackedNPCs() {
        return Collections.unmodifiableSet(trackedNPCs);
    }
}
```

## Quand cet evenement se declenche

Le `LoadedNPCEvent` est declenche lorsque :

1. **Chargement d'asset de PNJ individuel** - Quand chaque fichier de definition de PNJ est analyse et charge
2. **Pendant la sequence de demarrage** - Avant que `AllNPCsLoadedEvent` ne se declenche
3. **Rechargement a chaud d'asset** - Quand des definitions de PNJ individuelles sont rechargees

L'evenement se declenche **pour chaque type de PNJ** au fur et a mesure qu'il est charge, permettant aux gestionnaires de :
- Traiter les PNJ de maniere incrementale pendant le chargement
- Valider les definitions de PNJ individuelles
- Etendre les configurations de PNJ avec des donnees personnalisees
- Journaliser la progression du chargement

## Comprendre BuilderInfo

L'objet `BuilderInfo` contient :
- **Builder** : L'objet factory pour creer des instances de PNJ (doit implementer `ISpawnableWithModel`)
- **Identifier** : L'identifiant unique en chaine de caracteres pour ce type de PNJ
- **Configuration** : Toutes les donnees de configuration chargees depuis le fichier d'asset PNJ

## Cas d'utilisation

- **Chargement progressif** : Gerer les PNJ au fur et a mesure qu'ils se chargent plutot que d'attendre tous
- **Validation** : Verifier chaque definition de PNJ au chargement
- **Extension** : Attacher des donnees personnalisees de plugin aux types de PNJ
- **Debogage** : Suivre le chargement individuel des PNJ pour le depannage
- **Verification de dependances** : Verifier que certains PNJ se chargent avant d'autres

## Evenements lies

- [AllNPCsLoadedEvent](./all-npcs-loaded-event) - Declenche apres que tous les PNJ ont ete charges
- [LoadAssetEvent](../asset/load-asset-event) - Evenement general de chargement d'assets

## Reference source

`decompiled/com/hypixel/hytale/server/spawning/LoadedNPCEvent.java`
