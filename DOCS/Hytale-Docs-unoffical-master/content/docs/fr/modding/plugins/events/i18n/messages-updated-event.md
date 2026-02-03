---
id: messages-updated-event
title: MessagesUpdated
sidebar_label: MessagesUpdated
---

# MessagesUpdated

Declenche lorsque les messages de traduction sont mis a jour en temps reel. Cet evenement permet aux plugins de reagir aux changements dans le systeme d'internationalisation, permettant des mises a jour de localisation dynamiques sans redemarrage du serveur.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.i18n.event.MessagesUpdated` |
| **Classe parente** | `IEvent<Void>` |
| **Annulable** | Non |
| **Asynchrone** | Non |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/modules/i18n/event/MessagesUpdated.java` |

## Declaration

```java
public class MessagesUpdated implements IEvent<Void> {
   private final Map<String, Map<String, String>> changedMessages;
   private final Map<String, Map<String, String>> removedMessages;

   public MessagesUpdated(
      Map<String, Map<String, String>> changedMessages,
      Map<String, Map<String, String>> removedMessages
   )
```

## Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `changedMessages` | `Map<String, Map<String, String>>` | `getChangedMessages()` | Carte des codes de langue vers leurs paires cle-valeur de traduction modifiees |
| `removedMessages` | `Map<String, Map<String, String>>` | `getRemovedMessages()` | Carte des codes de langue vers leurs paires cle-valeur de traduction supprimees |

## Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getChangedMessages` | `public Map<String, Map<String, String>> getChangedMessages()` | Retourne la carte de toutes les traductions modifiees organisees par langue |
| `getRemovedMessages` | `public Map<String, Map<String, String>> getRemovedMessages()` | Retourne la carte de toutes les traductions supprimees organisees par langue |
| `toString` | `@Nonnull public String toString()` | Retourne une representation textuelle de l'evenement incluant les messages modifies et supprimes |

## Exemple d'utilisation

```java
import com.hypixel.hytale.server.core.modules.i18n.event.MessagesUpdated;
import com.hypixel.hytale.event.EventBus;
import com.hypixel.hytale.event.EventPriority;
import java.util.Map;

public class LocalizationListenerPlugin extends PluginBase {

    @Override
    public void onEnable() {
        EventBus.register(MessagesUpdated.class, this::onMessagesUpdated, EventPriority.NORMAL);
    }

    private void onMessagesUpdated(MessagesUpdated event) {
        // Obtenir les messages modifies pour chaque langue
        Map<String, Map<String, String>> changed = event.getChangedMessages();

        for (Map.Entry<String, Map<String, String>> langEntry : changed.entrySet()) {
            String languageCode = langEntry.getKey();
            Map<String, String> translations = langEntry.getValue();

            getLogger().info("Langue '" + languageCode + "' mise a jour avec "
                + translations.size() + " traductions modifiees");

            // Traiter chaque traduction modifiee
            for (Map.Entry<String, String> translation : translations.entrySet()) {
                String key = translation.getKey();
                String value = translation.getValue();
                getLogger().debug("  " + key + " = " + value);
            }
        }

        // Gerer les messages supprimes
        Map<String, Map<String, String>> removed = event.getRemovedMessages();

        for (Map.Entry<String, Map<String, String>> langEntry : removed.entrySet()) {
            String languageCode = langEntry.getKey();
            Map<String, String> removedTranslations = langEntry.getValue();

            getLogger().info("Langue '" + languageCode + "' a eu "
                + removedTranslations.size() + " traductions supprimees");
        }
    }
}
```

## Quand cet evenement se declenche

Le `MessagesUpdated` est declenche lorsque :

1. **Rechargement a chaud des fichiers de langue** - Quand les fichiers de traduction sont modifies et recharges en temps reel
2. **Mises a jour dynamiques de langue** - Quand le systeme de localisation detecte des changements dans les fichiers de messages
3. **Changements de pack d'assets** - Quand un pack d'assets avec des fichiers de langue est charge ou modifie

L'evenement permet aux gestionnaires de :
- Reagir aux changements de traduction en temps reel
- Mettre a jour les traductions en cache
- Rafraichir les elements d'interface avec le nouveau texte
- Journaliser les changements de localisation pour le debogage
- Notifier les joueurs des mises a jour de langue

## Comprendre la structure des messages

Les cartes de messages utilisent une structure imbriquee :
- **Cle de la carte externe** : Code de langue (ex: "en_US", "fr_FR", "de_DE")
- **Cle de la carte interne** : Cle de traduction (ex: "item.sword.name")
- **Valeur de la carte interne** : Texte traduit (ex: "Epee de fer")

```java
// Exemple de structure
// changedMessages = {
//   "en_US" -> {
//     "item.sword.name" -> "Iron Sword",
//     "item.sword.description" -> "A basic sword"
//   },
//   "fr_FR" -> {
//     "item.sword.name" -> "Epee de fer",
//     "item.sword.description" -> "Une epee basique"
//   }
// }
```

## Exemple d'invalidation de cache

```java
import com.hypixel.hytale.server.core.modules.i18n.event.MessagesUpdated;
import java.util.concurrent.ConcurrentHashMap;

public class TranslationCachePlugin extends PluginBase {

    private final ConcurrentHashMap<String, String> translationCache = new ConcurrentHashMap<>();

    @Override
    public void onEnable() {
        EventBus.register(MessagesUpdated.class, this::invalidateCache, EventPriority.EARLY);
    }

    private void invalidateCache(MessagesUpdated event) {
        // Invalider les entrees modifiees
        for (Map<String, String> translations : event.getChangedMessages().values()) {
            for (String key : translations.keySet()) {
                translationCache.remove(key);
            }
        }

        // Supprimer les entrees effacees
        for (Map<String, String> translations : event.getRemovedMessages().values()) {
            for (String key : translations.keySet()) {
                translationCache.remove(key);
            }
        }

        getLogger().info("Cache de traduction invalide");
    }
}
```

## Cas d'utilisation

- **Support du rechargement a chaud** : Mettre a jour les traductions sans redemarrer le serveur
- **Gestion du cache** : Invalider les traductions en cache quand les fichiers changent
- **Debogage** : Journaliser les changements de traduction pendant le developpement
- **Support multilingue** : Reagir aux installations de packs de langue
- **Rafraichissement d'interface** : Declencher des mises a jour d'interface quand le texte change
- **Validation** : Verifier la completude des traductions apres les mises a jour

## Evenements lies

- [GenerateDefaultLanguageEvent](./generate-default-language-event) - Declenche lors de la generation des fichiers de langue par defaut
- [AssetStoreMonitorEvent](../asset/asset-store-monitor-event) - Declenche quand les fichiers d'assets changent

## Reference source

`decompiled/com/hypixel/hytale/server/core/modules/i18n/event/MessagesUpdated.java`
