---
id: all-npcs-loaded-event
title: AllNPCsLoadedEvent
sidebar_label: AllNPCsLoadedEvent
---

# AllNPCsLoadedEvent

Declenche lorsque toutes les definitions de PNJ ont ete chargees depuis les fichiers d'assets. Cet evenement fournit un acces a la carte complete des informations de construction des PNJ, permettant aux plugins de modifier, etendre ou reagir aux donnees PNJ chargees.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.npc.AllNPCsLoadedEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/npc/AllNPCsLoadedEvent.java` |

## Declaration

```java
public class AllNPCsLoadedEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `allNPCs` | `Int2ObjectMap<BuilderInfo>` | `getAllNPCs()` | Carte non modifiable de toutes les definitions de PNJ enregistrees par leur ID entier |
| `loadedNPCs` | `Int2ObjectMap<BuilderInfo>` | `getLoadedNPCs()` | Carte non modifiable des PNJ charges dans ce cycle de chargement |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getAllNPCs` | `@Nonnull public Int2ObjectMap<BuilderInfo> getAllNPCs()` | Retourne une carte non modifiable contenant toutes les informations de construction de PNJ enregistrees |
| `getLoadedNPCs` | `@Nonnull public Int2ObjectMap<BuilderInfo> getLoadedNPCs()` | Retourne une carte non modifiable des PNJ charges dans cette operation de chargement specifique |
| `toString` | `@Nonnull public String toString()` | Retourne une representation en chaine de l'evenement avec les deux cartes de PNJ |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.npc.AllNPCsLoadedEvent;
import com.hypixel.hytale.server.npc.asset.builder.BuilderInfo;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;
import it.unimi.dsi.fastutil.ints.Int2ObjectMap;

public class NPCRegistryPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(AllNPCsLoadedEvent.class, this::onAllNPCsLoaded, EventPriority.NORMAL);
    }

    private void onAllNPCsLoaded(AllNPCsLoadedEvent event) {
        Int2ObjectMap<BuilderInfo> allNPCs = event.getAllNPCs();
        Int2ObjectMap<BuilderInfo> loadedNPCs = event.getLoadedNPCs();

        getLogger().info("Total de PNJ enregistres: " + allNPCs.size());
        getLogger().info("PNJ charges ce cycle: " + loadedNPCs.size());

        // Iterer a travers tous les PNJ charges
        for (Int2ObjectMap.Entry<BuilderInfo> entry : allNPCs.int2ObjectEntrySet()) {
            int npcId = entry.getIntKey();
            BuilderInfo builderInfo = entry.getValue();

            // Traiter chaque definition de PNJ
            processNPCDefinition(npcId, builderInfo);
        }

        // Valider les exigences de PNJ personnalises
        validateCustomNPCs(allNPCs);
    }

    private void processNPCDefinition(int npcId, BuilderInfo builderInfo) {
        // Logique de traitement de PNJ personnalisee
        getLogger().debug("Traitement du PNJ ID: " + npcId);
    }

    private void validateCustomNPCs(Int2ObjectMap<BuilderInfo> allNPCs) {
        // Verifier que tous les PNJ requis sont presents
        // Utile pour les modes de jeu qui necessitent des PNJ specifiques
    }
}
```

## Quand cet evenement se declenche

Le `AllNPCsLoadedEvent` est declenche lorsque :

1. **Demarrage du serveur** - Apres que tous les fichiers d'assets de PNJ ont ete analyses et charges
2. **Rechargement d'assets** - Quand les definitions de PNJ sont rechargees (comme lors du rechargement a chaud en developpement)

L'evenement se declenche **apres** que toutes les definitions de PNJ sont disponibles, permettant aux gestionnaires de :
- Acceder au registre complet des PNJ
- Valider que les PNJ requis existent
- Mettre en cache les informations des PNJ pour une recherche rapide
- Journaliser les statistiques sur les PNJ charges

## Comprendre BuilderInfo

La classe `BuilderInfo` contient les donnees de configuration pour un type de PNJ, incluant :
- Informations de pattern builder pour construire des instances de PNJ
- References aux modeles et animations
- Definitions d'arbres de comportement
- Configurations des composants

## Cas d'utilisation

- **Validation de PNJ** : S'assurer que tous les PNJ requis pour un mode de jeu sont charges
- **Spawn personnalise** : Construire des tables de spawn basees sur les types de PNJ charges
- **Statistiques** : Suivre et journaliser les informations du registre des PNJ
- **Integration** : Connecter des systemes externes qui ont besoin des donnees PNJ
- **Debogage** : Verifier les definitions de PNJ pendant le developpement

## Evenements lies

- [LoadedNPCEvent](./loaded-npc-event) - Declenche pour chaque PNJ individuel quand il est charge
- [AllWorldsLoadedEvent](../world/all-worlds-loaded-event) - Declenche quand tous les mondes ont ete charges

## Reference source

`decompiled/com/hypixel/hytale/server/npc/AllNPCsLoadedEvent.java`
