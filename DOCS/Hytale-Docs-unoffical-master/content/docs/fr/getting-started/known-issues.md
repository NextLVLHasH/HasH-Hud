---
id: problemes-connus
title: Problemes Connus et Solutions
sidebar_label: Depannage
sidebar_position: 7
description: Problemes courants de Hytale et comment les resoudre - launcher, performance, crashes, multijoueur et hebergement serveur
---

# Problemes Connus et Solutions

Vous rencontrez des problemes avec Hytale ? Ce guide couvre les problemes les plus courants et leurs solutions. Hytale etant en Early Access, certains bugs sont attendus - cette page sera mise a jour regulierement.

## Problemes de lancement

### Le launcher ne demarre pas

**Symptomes :** Le launcher Hytale ne s'ouvre pas, plante immediatement, ou n'affiche aucune fenetre.

**Solutions :**

1. **Verifier votre antivirus** - Ajoutez Hytale a la liste des exceptions de votre antivirus
2. **Executer en tant qu'administrateur** - Clic droit sur le launcher et selectionnez "Executer en tant qu'administrateur"
3. **Reinstaller Visual C++ Redistributables** - Telechargez depuis [Microsoft](https://learn.microsoft.com/fr-fr/cpp/windows/latest-supported-vc-redist)
4. **Verifier Windows Defender** - Allez dans Securite Windows > Protection contre les virus et menaces > Gerer les parametres > Ajouter une exclusion

```
Chemin d'installation par defaut de Hytale :
C:\Program Files\Hytale\
```

### Erreur de connexion

**Symptomes :** "Impossible de se connecter aux services Hytale" ou "Echec de l'authentification"

**Solutions :**

1. **Verifier votre connexion internet** - Essayez d'ouvrir [hytale.com](https://hytale.com) dans votre navigateur
2. **Verifier le statut des serveurs Hytale** - Visitez [status.hytale.com](https://status.hytale.com) ou le Discord officiel
3. **Desactiver le VPN** - Certains VPN peuvent interferer avec l'authentification
4. **Vider le cache DNS :**
   ```bash
   # Windows (Executer en tant qu'administrateur)
   ipconfig /flushdns
   ```

### Erreur "Java non trouve"

**Symptomes :** Message d'erreur indiquant que Java est manquant ou version incorrecte.

**Solutions :**

1. **Installer Java 25** - Telechargez depuis [Adoptium](https://adoptium.net) (distribution recommandee)
2. **Definir la variable d'environnement JAVA_HOME :**
   ```
   JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-25
   ```
3. **Verifier l'installation :**
   ```bash
   java -version
   # Doit afficher : openjdk version "25"
   ```

:::warning Version Java requise
Hytale necessite specifiquement **Java 25**. Les autres versions (8, 11, 17, 21) ne fonctionneront PAS.
:::

## Problemes de performance

### FPS bas

**Symptomes :** Le jeu tourne lentement, gameplay saccade, FPS en dessous de 30.

**Solutions :**

1. **Baisser les parametres graphiques :**
   - Reduire la distance de rendu (essayez 8-12 chunks)
   - Desactiver les ombres ou mettre sur Bas
   - Desactiver l'occlusion ambiante
   - Reduire les effets de particules

2. **Mettre a jour les pilotes GPU :**
   - [Pilotes NVIDIA](https://www.nvidia.com/drivers)
   - [Pilotes AMD](https://www.amd.com/fr/support)
   - [Pilotes Intel](https://www.intel.fr/content/www/fr/fr/download-center/home.html)

3. **Fermer les applications en arriere-plan** - Surtout les navigateurs avec beaucoup d'onglets, Discord, logiciels de streaming

4. **Desactiver V-Sync** si le taux de rafraichissement de votre ecran est bas

### Saccades / Pics de lag

**Symptomes :** Le jeu gele brievement toutes les quelques secondes, temps de frame inconsistants.

**Solutions :**

1. **Allouer plus de RAM a Hytale :**
   - Ouvrir le Launcher > Parametres > Arguments Java
   - Definir `-Xmx` a la moitie de votre RAM totale (ex: `-Xmx8G` pour un systeme de 16Go)

2. **Fermer les applications en arriere-plan** - Verifier le Gestionnaire des taches pour l'utilisation CPU/RAM elevee

3. **Desactiver l'acceleration materielle dans Discord** - Parametres > Avance > Acceleration materielle (OFF)

4. **Deplacer Hytale sur un SSD** - Les disques durs peuvent causer des saccades significatives pendant le chargement du monde

### Crash au chargement

**Symptomes :** Le jeu plante au demarrage, au chargement du monde, ou en rejoignant un serveur.

**Solutions :**

1. **Verifier les exigences minimales :**
   | Composant | Minimum |
   |-----------|---------|
   | RAM | 8 Go |
   | GPU | NVIDIA GTX serie 900 / AMD equivalent |
   | Stockage | 10 Go d'espace libre |
   | OS | Windows 10 64-bit |

2. **Verifier les fichiers du jeu** - Launcher > Parametres > Verifier les fichiers du jeu

3. **Consulter les logs de crash :**
   ```
   %APPDATA%\Hytale\logs\latest.log
   ```

4. **Mettre a jour Windows** - Assurez-vous d'avoir les dernieres mises a jour Windows

## Problemes graphiques

### Ecran noir

**Symptomes :** Le jeu se lance mais affiche seulement un ecran noir, aucun menu visible.

**Solutions :**

1. **Mettre a jour les pilotes GPU** (voir liens ci-dessus)
2. **Essayer le mode fenetre** - Modifier le fichier de config :
   ```
   %APPDATA%\Hytale\config\settings.json
   ```
   Definir `"fullscreen": false`
3. **Desactiver l'overclock GPU** si vous utilisez MSI Afterburner ou similaire
4. **Essayer la carte graphique integree** (pour les portables avec double GPU)

### Textures manquantes

**Symptomes :** Textures en damier violet/noir, blocs ou objets invisibles.

**Solutions :**

1. **Verifier les fichiers du jeu** - Launcher > Parametres > Verifier les fichiers du jeu
2. **Vider le cache des shaders :**
   ```
   Supprimer : %APPDATA%\Hytale\cache\shaders\
   ```
3. **Reinstaller le jeu** si la verification ne resout pas le probleme

### Artefacts visuels / Glitches

**Symptomes :** Couleurs etranges, scintillement, dechirure d'ecran, corruption.

**Solutions :**

1. **Desactiver les applications d'overlay :**
   - Overlay Discord : Parametres utilisateur > Overlay de jeu (OFF)
   - GeForce Experience : Parametres > Overlay en jeu (OFF)
   - Xbox Game Bar : Parametres Windows > Jeux > Xbox Game Bar (OFF)

2. **Desactiver l'anti-aliasing** dans les parametres graphiques de Hytale

3. **Verifier la temperature du GPU** - La surchauffe peut causer des artefacts (utilisez HWiNFO ou GPU-Z)

## Problemes multijoueur

### Impossible de rejoindre un serveur

**Symptomes :** "Connexion expriree", "Impossible de se connecter", serveur ne repond pas.

**Solutions :**

1. **Verifier les parametres du pare-feu :**
   - Autoriser Hytale a travers le pare-feu Windows
   - Ouvrir le port UDP **5520** (port par defaut de Hytale)

2. **Verifier l'adresse du serveur** - Assurez-vous que l'IP et le port sont corrects

3. **Essayer une connexion IP directe** au lieu du nom d'hote

4. **Verifier si le serveur est en ligne** - Contactez l'administrateur du serveur

```
Commande pare-feu Windows (Executer en tant qu'administrateur) :
netsh advfirewall firewall add rule name="Hytale" dir=in action=allow protocol=UDP localport=5520
```

### Deconnexions frequentes

**Symptomes :** Expulse aleatoirement des serveurs, messages "Connexion perdue".

**Solutions :**

1. **Verifier la stabilite de votre internet** - Executez un test de ping :
   ```bash
   ping -t google.com
   ```
   Recherchez les pertes de paquets ou les pics de latence eleves

2. **Utiliser une connexion filaire** au lieu du WiFi si possible

3. **Le serveur peut etre surcharge** - Reessayez plus tard ou contactez l'admin

4. **Desactiver les applications gourmandes en bande passante** - Streaming, telechargements, etc.

### Latence elevee en multijoueur

**Symptomes :** Actions retardees, rubber-banding, autres joueurs qui se teleportent.

**Solutions :**

1. **Choisir un serveur geographiquement plus proche** - Ping plus bas = meilleure experience

2. **Verifier le nombre de joueurs du serveur** - Les serveurs surcharges ont une latence plus elevee

3. **Fermer les applications consommatrices de bande passante**

4. **Contacter votre FAI** si la latence est constamment elevee sur tous les serveurs

## Problemes d'hebergement de serveur

### Le serveur ne demarre pas

**Symptomes :** L'executable du serveur plante, affiche des erreurs, ou se ferme immediatement.

**Solutions :**

1. **Verifier l'installation de Java 25 :**
   ```bash
   java -version
   ```

2. **Verifier la disponibilite du port :**
   ```bash
   # Windows
   netstat -an | findstr 5520
   ```

3. **Allouer suffisamment de RAM :**
   ```bash
   java -Xmx4G -Xms4G -jar hytale-server.jar
   ```

4. **Consulter les logs du serveur :**
   ```
   /server/logs/latest.log
   ```

### Les joueurs ne peuvent pas se connecter

**Symptomes :** Le serveur tourne mais les joueurs ont des erreurs de connexion.

**Solutions :**

1. **Configurer la redirection de port** sur votre routeur :
   - Protocole : UDP
   - Port : 5520 (ou votre port personnalise)
   - Rediriger vers : L'IP locale de votre serveur

2. **Verifier le pare-feu :**
   ```bash
   # Windows (Executer en tant qu'administrateur)
   netsh advfirewall firewall add rule name="Hytale Server" dir=in action=allow protocol=UDP localport=5520
   ```

3. **Partager la bonne IP externe** - Trouvez-la sur [whatismyip.com](https://whatismyip.com)

4. **Pour l'hebergement cloud** - Configurez les regles de groupe de securite/pare-feu

### Crash du serveur

**Symptomes :** Le serveur s'arrete de facon inattendue, erreurs de memoire insuffisante.

**Solutions :**

1. **Augmenter la RAM allouee :**
   ```bash
   java -Xmx8G -Xms4G -jar hytale-server.jar
   ```
   Minimum recommande : 4Go pour les petits serveurs

2. **Verifier les plugins problematiques** - Supprimez les plugins recemment ajoutes

3. **Surveiller l'utilisation des ressources** - Utilisez le Gestionnaire des taches ou htop

4. **Examiner les logs de crash** pour les messages d'erreur specifiques

## Problemes de mods / plugins

### Le mod ne fonctionne pas

**Symptomes :** Le contenu personnalise n'apparait pas, fonctionnalites du mod indisponibles.

**Solutions :**

1. **Verifier la compatibilite de version** - Le mod doit correspondre a la version du serveur
2. **Verifier l'emplacement du mod :**
   ```
   /server/mods/votre-mod.jar
   /server/packs/votre-pack/
   ```
3. **Consulter la console du serveur** pour les messages d'erreur
4. **Lire la documentation du mod** pour les exigences specifiques

### Crash avec des mods installes

**Symptomes :** Le serveur ou le jeu plante quand les mods sont charges.

**Solutions :**

1. **Identifier le mod problematique :**
   - Supprimez tous les mods
   - Rajoutez-les un par un
   - Testez apres chaque ajout

2. **Verifier les conflits de mods** - Certains mods sont incompatibles

3. **Mettre a jour les mods** vers les dernieres versions

4. **Signaler a l'auteur du mod** avec le log de crash

## Limitations de l'Early Access

:::info Attendu en Early Access
Les limitations suivantes sont connues et attendues pendant l'Early Access :
:::

| Limitation | Statut |
|------------|--------|
| **Mode Aventure** | Non disponible au lancement |
| **Support Mac / Linux** | A venir plus tard |
| **Documentation complete du modding** | En cours |
| **Quelques bugs visuels** | Attendus et en cours de correction |
| **Stabilite des serveurs** | Ameliorations en cours |
| **Lacunes de contenu** | Plus de contenu a venir dans les mises a jour |

## Comment signaler un bug

Si vous rencontrez un probleme non liste ici :

### Canaux de support officiels

1. **Portail de support officiel :** [support.hytale.com](https://support.hytale.com)
2. **Discord officiel Hytale :** [discord.gg/hytale](https://discord.gg/hytale) - salon #bug-reports
3. **Forums communautaires :** Verifiez si le probleme est deja signale

### Que inclure dans les rapports de bug

- Numero de version de Hytale
- Systeme d'exploitation et version
- Modele de GPU et version du pilote
- Etapes pour reproduire le probleme
- Logs de crash (si applicable)
- Captures d'ecran ou video

```
Emplacement du log de crash :
%APPDATA%\Hytale\logs\latest.log
```

## Ressources utiles

### Liens officiels

- [Site officiel Hytale](https://hytale.com)
- [Support Hytale](https://support.hytale.com)
- [Page de statut Hytale](https://status.hytale.com)
- [Discord officiel](https://discord.gg/hytale)

### Reference des configurations requises

| Composant | Minimum | Recommande |
|-----------|---------|------------|
| **OS** | Windows 10 64-bit | Windows 11 |
| **CPU** | Intel i5-4460 / AMD FX-6300 | Intel i7-8700 / AMD Ryzen 5 3600 |
| **RAM** | 8 Go | 16 Go |
| **GPU** | NVIDIA GTX 960 / AMD R9 280 | NVIDIA RTX 2060 / AMD RX 5700 |
| **Stockage** | 10 Go HDD | 50 Go SSD |
| **Reseau** | Connexion haut debit | Connexion faible latence |

### Checklist rapide

Avant de contacter le support, verifiez :

- [ ] Java 25 installe (pour serveurs/plugins)
- [ ] Pilotes GPU mis a jour
- [ ] Fichiers du jeu verifies
- [ ] Pare-feu configure (port UDP 5520)
- [ ] RAM suffisante allouee
- [ ] Pas de logiciel d'overlay en conflit
- [ ] Exceptions antivirus ajoutees
