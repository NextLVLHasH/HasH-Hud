---
id: generate-schema-event
title: GenerateSchemaEvent
sidebar_label: GenerateSchemaEvent
---

# GenerateSchemaEvent

Declenche lorsque le serveur genere des schemas JSON pour la validation des assets. Cet evenement permet aux plugins de contribuer des schemas personnalises pour leurs fichiers de configuration, activant l'autocompletion et la validation dans l'IDE.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.asset.GenerateSchemaEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/asset/GenerateSchemaEvent.java` |

## Declaration

```java
public class GenerateSchemaEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `schemas` | `Map<String, Schema>` | N/A (protege) | Carte des noms de fichiers de schema vers leurs definitions |
| `context` | `SchemaContext` | `getContext()` | Le contexte de generation de schema |
| `vsCodeConfig` | `BsonDocument` | `getVsCodeConfig()` | Document de configuration VSCode pour les associations de schemas |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getContext` | `public SchemaContext getContext()` | Retourne le contexte de generation de schema |
| `getVsCodeConfig` | `public BsonDocument getVsCodeConfig()` | Retourne le document de configuration VSCode |
| `addSchemaLink` | `public void addSchemaLink(String name, List<String> paths, String extension)` | Lie un schema a des chemins de fichiers avec mappage d'extension optionnel |
| `addSchema` | `public void addSchema(String fileName, Schema schema)` | Ajoute une nouvelle definition de schema |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.asset.GenerateSchemaEvent;
import com.hypixel.hytale.codec.schema.config.Schema;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;
import java.util.Arrays;

public class CustomSchemaPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(GenerateSchemaEvent.class, this::onGenerateSchema, EventPriority.NORMAL);
    }

    private void onGenerateSchema(GenerateSchemaEvent event) {
        // Creer un schema personnalise pour la configuration du plugin
        Schema pluginConfigSchema = createPluginConfigSchema(event.getContext());

        // Ajouter le schema a la generation
        event.addSchema("my-plugin-config", pluginConfigSchema);

        // Lier le schema a des chemins de fichiers specifiques
        event.addSchemaLink(
            "my-plugin-config",
            Arrays.asList(
                "Plugins/MyPlugin/*.json",
                "Plugins/MyPlugin/config.json"
            ),
            ".json"
        );

        getLogger().info("Schema de plugin personnalise enregistre");
    }

    private Schema createPluginConfigSchema(SchemaContext context) {
        // Construire la definition du schema pour les fichiers de config du plugin
        // Ceci active l'autocompletion et la validation dans l'IDE

        // Exemple de structure de schema (l'implementation depend de l'API Schema)
        return Schema.builder()
            .property("enabled", Schema.Type.BOOLEAN)
            .property("maxPlayers", Schema.Type.INTEGER)
            .property("settings", Schema.Type.OBJECT)
            .build();
    }
}
```

## Quand cet evenement se declenche

Le `GenerateSchemaEvent` est declenche lorsque :

1. **Generation de schema** - Quand le serveur genere des schemas JSON pour le support IDE
2. **Mode developpement** - Typiquement pendant les operations de mode developpement/editeur
3. **Integration de l'editeur d'assets** - Lors de la preparation des schemas pour la validation des assets

L'evenement permet aux gestionnaires de :
- Ajouter des schemas JSON personnalises
- Lier des schemas a des patterns de fichiers specifiques
- Configurer les associations de fichiers VSCode
- Activer la validation pour des types d'assets personnalises

## Comprendre les liens de schema

La methode `addSchemaLink` configure l'integration IDE :

```java
// Lier le schema aux fichiers correspondant au pattern
event.addSchemaLink(
    "my-schema",                              // Nom du schema
    Arrays.asList("MyPlugin/**/*.json"),      // Patterns de chemin de fichier
    ".json"                                   // Extension de fichier
);
```

Ceci genere une configuration VSCode qui :
- Associe les fichiers correspondants au schema
- Mappe les extensions non-JSON au mode JSON si specifie
- Active l'autocompletion et la validation dans l'IDE

## Configuration VSCode

L'evenement construit une structure `settings.json` VSCode :

```json
{
    "json.schemas": [
        {
            "fileMatch": ["/Server/Plugins/MyPlugin/*.json"],
            "url": "./Schema/my-plugin-config.json"
        }
    ],
    "files.associations": {
        "*.myext": "json"
    }
}
```

## Cas d'utilisation

- **Configuration de plugin** : Definir des schemas pour les fichiers de config de plugin
- **Assets personnalises** : Valider des formats de fichiers d'assets personnalises
- **Support IDE** : Activer l'autocompletion pour les moddeurs utilisant votre plugin
- **Documentation** : Les schemas servent de documentation lisible par machine
- **Validation** : Detecter les erreurs de configuration avant l'execution

## Evenements lies

- [LoadAssetEvent](./load-asset-event) - Declenche pendant le chargement des assets
- [GenerateAssetsEvent](./generate-assets-event) - Declenche quand les assets sont generes

## Reference source

`decompiled/com/hypixel/hytale/server/core/asset/GenerateSchemaEvent.java`
