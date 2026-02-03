---
id: generate-default-language-event
title: GenerateDefaultLanguageEvent
sidebar_label: GenerateDefaultLanguageEvent
---

# GenerateDefaultLanguageEvent

Declenche lorsque le serveur genere les fichiers de langue/traduction par defaut. Cet evenement permet aux plugins de contribuer leurs propres entrees de traduction au systeme d'internationalisation du jeu.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.i18n.event.GenerateDefaultLanguageEvent` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/modules/i18n/event/GenerateDefaultLanguageEvent.java` |

## Declaration

```java
public class GenerateDefaultLanguageEvent implements IEvent<Void> {
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `translationFiles` | `ConcurrentHashMap<String, TranslationMap>` | N/A (interne) | Carte thread-safe des noms de fichiers de traduction vers leurs traductions |

## Constructeur

| Signature | Description |
|-----------|-------------|
| `public GenerateDefaultLanguageEvent(ConcurrentHashMap<String, TranslationMap> translationFiles)` | Cree un nouvel evenement avec la carte de fichiers de traduction donnee |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `putTranslationFile` | `public void putTranslationFile(@Nonnull String filename, @Nonnull TranslationMap translations)` | Ajoute un fichier de traduction avec le nom et les traductions donnes |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.modules.i18n.event.GenerateDefaultLanguageEvent;
import com.hypixel.hytale.server.core.modules.i18n.generator.TranslationMap;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;

public class LocalizationPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(GenerateDefaultLanguageEvent.class, this::onGenerateLanguage, EventPriority.NORMAL);
    }

    private void onGenerateLanguage(GenerateDefaultLanguageEvent event) {
        // Creer une carte de traduction pour les chaines du plugin
        TranslationMap pluginTranslations = new TranslationMap();

        // Ajouter des traductions specifiques au plugin
        pluginTranslations.put("myplugin.welcome", "Bienvenue sur le serveur!");
        pluginTranslations.put("myplugin.goodbye", "Merci d'avoir joue!");
        pluginTranslations.put("myplugin.error.permission", "Vous n'avez pas la permission de faire cela.");
        pluginTranslations.put("myplugin.items.magic_sword", "Lame enchantee");
        pluginTranslations.put("myplugin.items.magic_sword.desc", "Une lame impregnee de magie ancienne.");

        // Enregistrer les traductions
        event.putTranslationFile("myplugin_strings", pluginTranslations);

        getLogger().info("Traductions du plugin enregistrees");
    }
}
```

## Quand cet evenement se declenche

Le `GenerateDefaultLanguageEvent` est declenche lorsque :

1. **Demarrage du serveur** - Pendant la phase d'initialisation de l'internationalisation
2. **Generation de langue** - Quand les fichiers de traduction par defaut sont crees
3. **Mode developpement** - Lors de la regeneration des fichiers de langue pour l'export d'assets

L'evenement permet aux gestionnaires de :
- Ajouter des chaines de traduction personnalisees
- Contribuer des donnees de localisation de plugin
- Enregistrer des noms d'objets/blocs pour la langue par defaut
- Fournir du texte d'interface pour des fonctionnalites personnalisees

## Comprendre les fichiers de traduction

Le systeme de traduction utilise une structure basee sur les fichiers :
- Chaque fichier contient des traductions liees (ex: objets, interface, messages)
- Les cles utilisent la notation par points pour l'organisation (ex: `myplugin.items.sword`)
- Les valeurs sont les chaines de langue par defaut (typiquement en anglais)

## Securite des threads

La `ConcurrentHashMap` interne assure que plusieurs plugins peuvent ajouter des traductions simultanement en toute securite depuis differents gestionnaires d'evenements.

## Bonnes pratiques

```java
// Utiliser des conventions de nommage coherentes
TranslationMap translations = new TranslationMap();

// Prefixer toutes les cles avec le nom de votre plugin
translations.put("myplugin.category.key", "Texte de traduction");

// Grouper les traductions liees
translations.put("myplugin.ui.button.start", "Demarrer le jeu");
translations.put("myplugin.ui.button.stop", "Arreter le jeu");
translations.put("myplugin.ui.title.main", "Menu principal");

// Fournir du contexte dans les noms de cles
translations.put("myplugin.error.item_not_found", "L'objet n'a pas pu etre trouve");
translations.put("myplugin.success.item_created", "Objet cree avec succes");
```

## Cas d'utilisation

- **Localisation de plugin** : Ajouter des chaines traduisibles pour les fonctionnalites du plugin
- **Objets personnalises** : Enregistrer les noms d'affichage pour les objets/blocs personnalises
- **Texte d'interface** : Fournir du texte pour les interfaces utilisateur personnalisees
- **Messages** : Ajouter des messages serveur traduisibles
- **Documentation** : Inclure du texte d'aide en jeu

## Evenements lies

- [BootEvent](../server/boot-event) - Declenche pendant le demarrage du serveur
- [LoadAssetEvent](../asset/load-asset-event) - Declenche pendant le chargement des assets

## Reference source

`decompiled/com/hypixel/hytale/server/core/modules/i18n/event/GenerateDefaultLanguageEvent.java`
