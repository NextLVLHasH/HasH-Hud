---
id: faq
title: Questions Fréquentes
sidebar_label: FAQ
sidebar_position: 5
description: Questions et réponses courantes sur Hytale, le gameplay, les exigences techniques et le modding
---

# Questions Fréquentes

Trouvez les réponses aux questions les plus courantes sur Hytale, des informations générales aux détails techniques et au modding.

## Questions Générales

### Qu'est-ce que Hytale ?

Hytale est un jeu d'aventure sandbox développé par Hypixel Studios. Il combine la construction par blocs avec des éléments RPG, un combat avancé et des outils de modding puissants. Le jeu propose des mondes générés de manière procédurale, de multiples biomes et un écosystème riche de créatures et de personnages. Conçu dès le départ avec la création communautaire à l'esprit, Hytale offre aux joueurs les mêmes outils utilisés par les développeurs pour créer du contenu personnalisé.

### Quand Hytale est-il sorti ?

Hytale a été lancé en **Early Access le 13 janvier 2026**. Le jeu a été développé par Hypixel Studios, une équipe de plus de 50 développeurs dirigée par les fondateurs originaux Simon Collins-Laflamme et Philippe Touchette, qui ont racheté le projet auprès de Riot Games en novembre 2025.

### Combien coûte Hytale ?

Hytale est disponible en trois éditions :

| Édition | Prix | Contenu |
|---------|------|---------|
| **Standard** | 19,99 $ | Jeu de base |
| **Supporter** | 34,99 $ | Jeu de base + cosmétiques exclusifs |
| **Cursebreaker Founders** | 69,99 $ | Jeu de base + cosmétiques premium + reconnaissance early supporter |

Toutes les éditions donnent accès au jeu complet. Les éditions supérieures incluent des objets cosmétiques exclusifs et des avantages de supporter.

### Hytale est-il sur Steam ?

**Non.** Hytale est exclusivement disponible via le launcher officiel sur [hytale.com](https://hytale.com). Il n'y a actuellement aucun projet de sortie sur Steam ou d'autres plateformes tierces.

### Sur quelles plateformes Hytale est-il disponible ?

Hytale est disponible sur **Windows, macOS et Linux**. La version macOS nécessite une puce M1 ou plus récente avec macOS Tahoe. La version Linux est distribuée en Flatpak natif avec support Wayland complet.

### Hytale est-il free-to-play ?

**Non.** Hytale est un jeu à achat unique. Il n'y a pas de frais d'abonnement ni d'achats en jeu obligatoires pour jouer. Une fois le jeu acheté, vous le possédez définitivement.

---

## Questions sur le Gameplay

### Quels modes de jeu sont disponibles ?

Hytale propose actuellement les modes de jeu suivants :

- **Mode Exploration** - Explorez des mondes générés de manière procédurale, récoltez des ressources, construisez des structures et rencontrez des créatures dans divers biomes
- **Mode Créatif** - Ressources et outils illimités pour construire et créer sans contraintes de survie
- **Multijoueur** - Rejoignez des serveurs communautaires pour jouer avec d'autres sur des modes de jeu personnalisés

:::note Mode Aventure à venir
Le **Mode Aventure** narratif est prévu pour une future mise à jour et n'est pas disponible au lancement de l'Early Access. Ce mode proposera une campagne narrative complète se déroulant dans le monde d'Orbis.
:::

### Puis-je jouer en multijoueur ?

**Oui !** Le multijoueur est disponible dès le premier jour. Les serveurs communautaires sont supportés au lancement, et les joueurs peuvent rejoindre des serveurs créés par d'autres membres de la communauté. L'architecture server-first signifie que rejoindre un serveur moddé est transparent - aucun téléchargement de mod requis côté joueur.

### Y a-t-il une campagne/histoire ?

Le Mode Aventure, qui propose une campagne narrative, est **prévu pour une future mise à jour**. Au lancement de l'Early Access, les joueurs peuvent profiter du Mode Exploration, du Mode Créatif et des serveurs multijoueurs communautaires.

### Hytale est-il comme Minecraft ?

Bien que Hytale partage des similitudes avec Minecraft en tant que jeu sandbox basé sur des blocs, il se différencie avec :

- **Système de Combat Avancé** - Combat dynamique avec esquive, parade et mécaniques spécifiques aux armes
- **Modding Intégré** - Support natif des mods intégré au cœur de l'architecture du jeu
- **Exécution Côté Serveur** - Tous les mods s'exécutent sur les serveurs, sans installation client requise
- **Outils de Création Professionnels** - Les mêmes outils utilisés par les développeurs sont disponibles pour la communauté
- **Système d'Animation Riche** - Animations de personnages et créatures plus détaillées
- **Scripting Visuel** - Créez de la logique de gameplay sans connaissances en programmation

---

## Questions Techniques

### Quelle configuration PC pour Hytale ?

**Configuration Minimale :**

| Composant | Exigence |
|-----------|----------|
| **GPU** | NVIDIA GTX série 900 ou équivalent |
| **CPU** | Intel Core i5-7500 ou équivalent |
| **RAM** | 8 Go |
| **Stockage** | 20 Go d'espace disponible |
| **OS** | Windows 10 64-bit |

**Configuration Recommandée :**

| Composant | Exigence |
|-----------|----------|
| **GPU** | NVIDIA GTX 1660 ou mieux |
| **CPU** | Intel Core i7-8700 ou mieux |
| **RAM** | 16 Go |
| **Stockage** | 20 Go SSD |
| **OS** | Windows 10/11 64-bit |

### Puis-je héberger mon propre serveur ?

**Oui !** Hytale supporte les serveurs communautaires dédiés. Voici les exigences :

- **Java 25** ou supérieur requis
- **Port par défaut :** UDP 5520
- Logiciel serveur disponible sur le site officiel Hytale
- Documentation complète pour la configuration du serveur disponible dans la section [Administration Serveur](/docs/servers/administration)

### Les mods sont-ils supportés ?

**Oui !** Les mods sont supportés dès le premier jour. Fonctionnalités clés :

- Support natif des mods intégré au jeu
- Partenariat **CurseForge** pour la distribution des mods
- Exécution côté serveur (les joueurs n'ont pas besoin de télécharger les mods)
- Plusieurs types de mods : Packs, Java Plugins et Scripting Visuel

---

## Questions sur le Modding

### Comment créer des mods ?

Hytale propose plusieurs approches pour le modding :

#### 1. Packs (Sans Code)
Créez du contenu personnalisé en utilisant des fichiers de configuration JSON :
- Blocs, objets et PNJ personnalisés
- Nouvelles textures et modèles 3D
- Sons et effets personnalisés
- Tables de butin et recettes de craft

#### 2. Java Plugins (Code Requis)
Écrivez des plugins complets en Java pour des fonctionnalités complexes :
```java
@PluginInfo(name = "MyPlugin", version = "1.0.0")
public class MyPlugin extends Plugin {
    @Override
    public void onEnable() {
        getLogger().info("Plugin enabled!");
    }
}
```

#### 3. Scripting Visuel (Sans Code)
Utilisez le système de scripting visuel pour créer de la logique de jeu en connectant des nœuds dans une interface visuelle - aucune connaissance en programmation nécessaire.

### Faut-il savoir coder ?

**Pas nécessairement !** Voici un résumé :

| Type de Mod | Code Requis | Idéal Pour |
|-------------|-------------|------------|
| **Packs** | Non | Contenu personnalisé (blocs, objets, textures) |
| **Scripting Visuel** | Non | Logique de jeu, événements, déclencheurs |
| **Java Plugins** | Oui (Java) | Systèmes complexes, APIs, intégrations |

De nombreux mods puissants peuvent être créés en utilisant uniquement les Packs et le Scripting Visuel, sans écrire de code.

### Où télécharger des mods ?

**CurseForge** est le partenaire officiel pour la distribution des mods Hytale. Vous pouvez parcourir, télécharger et installer des mods directement via :

- [Section Hytale de CurseForge](https://www.curseforge.com/hytale)
- Le navigateur de mods en jeu (intégré avec CurseForge)

:::tip Pour les Créateurs de Mods
Pour publier vos mods, créez un compte CurseForge et suivez leurs directives de soumission. La plateforme gère automatiquement le versioning, les dépendances et les mises à jour.
:::

---

## Encore des Questions ?

Si votre question n'a pas trouvé de réponse ici, consultez ces ressources :

- [Blog Officiel Hytale](https://hytale.com/news) - Dernières annonces et mises à jour
- [Discord Hytale](https://discord.gg/hytale) - Discussions et support communautaire
- [HytaleModding.dev](https://hytalemodding.dev) - Documentation et tutoriels de modding
