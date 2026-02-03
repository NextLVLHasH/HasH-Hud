---
id: contributing
title: Contribuer au Wiki
sidebar_label: Contribuer
sidebar_position: 1
description: Comment contribuer au Wiki des Développeurs Hytale
---

# Contribuer au Wiki

Merci pour votre intérêt à contribuer au Wiki des Développeurs Hytale ! C'est un projet communautaire et nous accueillons les contributions de toutes sortes.

## Façons de Contribuer

### 1. Corriger les Erreurs ou Fautes de Frappe

Vous avez trouvé une erreur ? Soumettez une correction rapide :

1. Cliquez sur "Modifier cette page" en bas de n'importe quelle documentation
2. Effectuez votre correction sur GitHub
3. Soumettez une Pull Request

### 2. Ajouter du Nouveau Contenu

Vous avez des connaissances à partager ? Rédigez une nouvelle documentation :

1. Forkez le dépôt
2. Créez votre contenu en suivant nos directives
3. Soumettez une Pull Request

### 3. Traduire

Aidez à rendre le wiki accessible dans plus de langues :

- Français (FR)
- Espagnol (ES)
- Allemand (DE)

### 4. Signaler des Problèmes

Vous avez trouvé un problème mais ne pouvez pas le corriger vous-même ?

[Ouvrir une Issue sur GitHub](https://github.com/hytale-community/hytale-wiki/issues)

## Pour Commencer

### Prérequis

- Node.js 20+
- Git
- Connaissances de base en Markdown

### Développement Local

```bash
# Cloner le dépôt
git clone https://github.com/hytale-community/hytale-wiki.git
cd hytale-wiki

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le site sera disponible à l'adresse `http://localhost:3000`

## Directives de Contenu

### Style d'Écriture

- **Voix** : Voix active, deuxième personne ("vous")
- **Ton** : Professionnel mais accessible
- **Langage** : Clair et concis

### Structure des Documents

Chaque document doit inclure :

```markdown
---
id: unique-id
title: Titre du Document
sidebar_label: Libellé Court
description: Brève description pour le SEO
---

# Titre du Document

Paragraphe d'introduction expliquant le sujet.

## Sections Principales

Contenu organisé avec des titres clairs.

## Exemples de Code

Inclure des exemples pratiques lorsque pertinent.

## Prochaines Étapes

Lien vers la documentation connexe.
```

### Exemples de Code

Toujours inclure le contexte avec le code :

````markdown
```java title="MyPlugin.java"
public class MyPlugin extends Plugin {
    // Votre code ici
}
```
````

### Images

- Format : PNG ou WebP
- Largeur maximale : 1200px
- Emplacement : `/static/img/docs/`
- Nommage : `section-description.png`

## Processus de Pull Request

1. **Créer une branche**
   ```bash
   git checkout -b docs/my-improvement
   ```

2. **Effectuer vos modifications**
   - Suivre les directives de style
   - Tester localement avec `npm start`

3. **Commiter avec des messages clairs**
   ```bash
   git commit -m "docs: add guide for custom blocks"
   ```

4. **Pousser et créer une PR**
   ```bash
   git push origin docs/my-improvement
   ```

5. **Attendre la revue**
   - Un mainteneur examinera votre PR
   - Répondre aux commentaires

### Format des Messages de Commit

```
type: description

Types:
- docs: Modifications de documentation
- fix: Corrections de bugs
- feat: Nouvelles fonctionnalités
- style: Modifications de formatage
```

## Organisation des Fichiers

```
docs/
├── getting-started/
├── modding/
│   ├── data-assets/
│   ├── plugins/
│   └── art-assets/
├── servers/
├── api/
├── tools/
├── guides/
└── community/
```

## Directives de Traduction

### Démarrer une Traduction

1. Copier le fichier anglais dans le dossier i18n approprié
2. Traduire le contenu
3. Garder l'`id` du frontmatter inchangé
4. Soumettre une PR

### Ce qu'il Faut Traduire

- Tout le texte en prose
- Les commentaires de code (optionnellement)

### Ce qu'il Ne Faut PAS Traduire

- Les blocs de code
- Les termes techniques
- Les URLs et chemins de fichiers
- Les IDs du frontmatter

## Reconnaissance

Les contributeurs sont reconnus dans :

- La [page des Contributeurs](https://github.com/hytale-community/hytale-wiki/graphs/contributors)
- Les notes de version lorsque significatif

## Code de Conduite

Veuillez lire notre [Code de Conduite](/docs/community/code-of-conduct) avant de contribuer.

## Des Questions ?

- Rejoignez notre [Discord](https://discord.gg/hytale)
- Posez vos questions dans les [Discussions GitHub](https://github.com/hytale-community/hytale-wiki/discussions)

---

Merci de contribuer à améliorer le Wiki des Développeurs Hytale !
