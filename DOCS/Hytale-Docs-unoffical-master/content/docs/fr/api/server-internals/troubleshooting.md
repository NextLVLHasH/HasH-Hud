---
id: ui-troubleshooting
title: Dépannage UI
sidebar_label: Dépannage
sidebar_position: 9
description: Guide de débogage pour les erreurs Custom UI Hytale (Red X, crashs de parser, etc.)
---

# Guide de Dépannage UI Hytale

Ce guide couvre le débogage avancé pour le développement de Custom UI, en se concentrant sur les particularités du moteur et les scénarios de crash courants.

## 1. Le Crash "Unknown Node Type"
**Log d'erreur :**
`HytaleClient.Interface.UI.Markup.TextParser+TextParserException: Failed to parse file ... – Unknown node type: Image`

**Pourquoi cela arrive :**
Le parser client Hytale dans certaines versions ne supporte pas la balise `<Image>` comme élément autonome, ou ne la supporte que dans des conteneurs parents spécifiques.

**La Solution :**
Standardisez votre UI pour utiliser des **Groups avec Backgrounds** au lieu de nodes Image. C'est fonctionnellement identique mais compatible avec le parser.

*   ❌ **Éviter :** `Image { TexturePath: "..."; }`
*   ✅ **Utiliser :** `Group { Background: ( TexturePath: "..." ); }`

## 2. La Boucle de Crash "Failed to Apply CustomUI"
**Symptômes :**
*   Le jeu saccade toutes les X secondes.
*   Le client finit par se déconnecter avec "Failed to load CustomUI documents".
*   Spam de messages d'erreur de packets dans la console.

**Pourquoi cela arrive :**
Votre code Java renvoie l'intégralité du fichier UI (`builder.append(...)`) à chaque tick de mise à jour (ex: dans une tâche planifiée). Recharger le DOM de manière répétée corrompt l'état UI du client.

**La Solution :**
Implémentez le **Pattern de Séparation Load-Update** :
1.  **Initialisation :** Envoyez la structure une seule fois.
2.  **Mise à jour :** Envoyez uniquement les changements de variables avec `update(false, builder)`.

## 3. Le "Red X" (Échec de Résolution d'Asset)
**Symptômes :**
*   L'UI se charge physiquement mais toutes les textures sont remplacées par de grandes croix rouges.

**Pourquoi cela arrive :**
Le client ne trouve pas le fichier au chemin spécifié. C'est généralement un problème de contexte de chemin.

**La Solution :**
1.  **Localité :** Déplacez les assets dans un sous-dossier (ex: `Assets/`) **directement à l'intérieur** du dossier contenant votre fichier `.ui`.
2.  **Chemin Relatif :** Référencez-les simplement comme `"Assets/MyTexture.png"`.
3.  **Manifest :** Assurez-vous que `manifest.json` contient `"IncludesAssetPack": true`.

## 4. Texte qui ne se Met Pas à Jour
**Symptômes :**
*   Vous appelez `builder.set("#ID.Text", "Nouvelle Valeur")` mais rien ne change à l'écran.

**Pourquoi cela arrive :**
*   ID incorrect dans le fichier `.ui` (les IDs sont sensibles à la casse !).
*   Vous ré-ajoutez le fichier (ce qui réinitialise les valeurs) au lieu de le mettre à jour.

**La Solution :**
*   Vérifiez la correspondance exacte de l'ID (`#Name` vs `#name`).
*   Assurez-vous d'appeler `this.update(false, builder)`.
