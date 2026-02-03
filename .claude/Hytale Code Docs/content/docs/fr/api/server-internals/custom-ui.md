---
id: custom-ui
title: Systeme d'UI Personnalisee
sidebar_label: UI Personnalisee
sidebar_position: 7
description: Guide pas a pas pour creer des pages UI personnalisees avec le DSL Hytale
---

# Systeme d'UI Personnalisee

Ce guide vous apprend a creer des pages UI personnalisees pour les plugins Hytale. Vous apprendrez la syntaxe des fichiers UI, les composants disponibles et comment creer des pages interactives.

## Fonctionnement des UI Personnalisees

Hytale utilise une **architecture client-serveur** pour les UI personnalisees :

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  resources/Common/UI/Custom/VotrePlugin/                     │   │
│  │  └── VotrePage.ui  (charge quand le joueur se connecte)      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ▲                    │
                              │ Commandes          │ Evenements
                              │ (definir valeurs)  │ (clics boutons)
                              │                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVEUR                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  InteractiveCustomUIPage                                      │   │
│  │  - build(): charger layout, definir valeurs, lier evenements │   │
│  │  - handleDataEvent(): reagir aux interactions utilisateur    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Points cles :**
- Les fichiers `.ui` sont **telecharges sur le client** quand le joueur se connecte
- Le serveur **ne peut pas creer de fichiers UI dynamiquement** - ils doivent exister au prealable
- Toute erreur de syntaxe dans un fichier `.ui` **deconnectera le joueur**
- Le serveur envoie des **commandes** pour manipuler les elements UI
- Le client renvoie des **evenements** quand le joueur interagit

---

## Tutoriel : Creer votre premiere UI personnalisee

### Etape 1 : Structure du projet

Votre plugin a besoin de ces fichiers :

```
votre-plugin/
├── build.gradle
├── src/main/
│   ├── java/com/votrenom/plugin/
│   │   ├── VotrePlugin.java
│   │   ├── commands/
│   │   │   └── OuvrirUICommand.java
│   │   └── ui/
│   │       └── MaPage.java
│   └── resources/
│       ├── manifest.json
│       └── Common/
│           └── UI/
│               └── Custom/
│                   └── VotrePlugin/
│                       └── MaPage.ui
```

### Etape 2 : Configurer manifest.json

Votre manifest doit inclure `IncludesAssetPack: true` :

```json
{
  "Identifier": "votre-plugin",
  "Name": "Votre Plugin",
  "Version": "1.0.0",
  "EntryPoint": "com.votrenom.plugin.VotrePlugin",
  "IncludesAssetPack": true
}
```

### Etape 3 : Creer le fichier UI

Creez `src/main/resources/Common/UI/Custom/VotrePlugin/MaPage.ui` :

```
$C = "../Common.ui";

Group {
  Anchor: (Width: 400, Height: 300);
  Background: #141c26(0.95);
  LayoutMode: Top;
  Padding: (Full: 20);

  Label {
    Text: "Bonjour le monde !";
    Anchor: (Height: 40);
    Style: (FontSize: 24, TextColor: #ffffff, HorizontalAlignment: Center, RenderBold: true);
  }

  Group { Anchor: (Height: 20); }

  $C.@TextButton #MonBouton {
    @Text = "Cliquez-moi";
    Anchor: (Width: 150, Height: 44);
  }
}
```

### Etape 4 : Creer le gestionnaire Java

Creez `src/main/java/com/votrenom/plugin/ui/MaPage.java` :

```java
package com.votrenom.plugin.ui;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.util.NotificationUtil;
import com.hypixel.hytale.protocol.packets.interface_.NotificationStyle;
import com.hypixel.hytale.server.core.Message;

import javax.annotation.Nonnull;

public class MaPage extends InteractiveCustomUIPage<MaPage.EventData> {

    // Chemin relatif a Common/UI/Custom/
    public static final String LAYOUT = "VotrePlugin/MaPage.ui";

    private final PlayerRef playerRef;

    public MaPage(@Nonnull PlayerRef playerRef) {
        super(playerRef, CustomPageLifetime.CanDismiss, EventData.CODEC);
        this.playerRef = playerRef;
    }

    @Override
    public void build(
            @Nonnull Ref<EntityStore> ref,
            @Nonnull UICommandBuilder cmd,
            @Nonnull UIEventBuilder evt,
            @Nonnull Store<EntityStore> store
    ) {
        // Charger le layout
        cmd.append(LAYOUT);

        // Lier l'evenement de clic du bouton
        evt.addEventBinding(
            CustomUIEventBindingType.Activating,
            "#MonBouton",
            new EventData().append("Action", "clic"),
            false
        );
    }

    @Override
    public void handleDataEvent(
            @Nonnull Ref<EntityStore> ref,
            @Nonnull Store<EntityStore> store,
            @Nonnull EventData data
    ) {
        if ("clic".equals(data.action)) {
            NotificationUtil.sendNotification(
                playerRef.getPacketHandler(),
                Message.raw("Bouton clique !"),
                Message.raw("Vous avez clique sur le bouton."),
                NotificationStyle.Success
            );
        }
    }

    // Classe de donnees d'evenement avec codec
    public static class EventData {
        public static final BuilderCodec<EventData> CODEC = BuilderCodec.builder(
                EventData.class, EventData::new
        )
        .append(new KeyedCodec<>("Action", Codec.STRING), (e, v) -> e.action = v, e -> e.action)
        .add()
        .build();

        private String action;

        public EventData() {}
    }
}
```

### Etape 5 : Creer la commande

Creez `src/main/java/com/votrenom/plugin/commands/OuvrirUICommand.java` :

```java
package com.votrenom.plugin.commands;

import com.votrenom.plugin.ui.MaPage;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import javax.annotation.Nonnull;

public class OuvrirUICommand extends AbstractPlayerCommand {

    public OuvrirUICommand() {
        super("monui", "Ouvre l'UI personnalisee");
    }

    @Override
    protected boolean canGeneratePermission() {
        return false;
    }

    @Override
    protected void execute(
            @Nonnull CommandContext context,
            @Nonnull Store<EntityStore> store,
            @Nonnull Ref<EntityStore> ref,
            @Nonnull PlayerRef playerRef,
            @Nonnull World world
    ) {
        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            context.sendMessage(Message.raw("Erreur: Impossible d'obtenir le joueur"));
            return;
        }

        MaPage page = new MaPage(playerRef);
        player.getPageManager().openCustomPage(ref, store, page);
    }
}
```

### Etape 6 : Enregistrer dans le plugin

```java
package com.votrenom.plugin;

import com.votrenom.plugin.commands.OuvrirUICommand;
import com.hytaledocs.server.plugin.JavaPlugin;

public class VotrePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        getCommandRegistry().register(new OuvrirUICommand());
        getLogger().info("Plugin active !");
    }
}
```

### Etape 7 : Compiler et tester

```bash
./gradlew build
```

Copiez le JAR dans le dossier `plugins/` de votre serveur, redemarrez et executez `/monui`.

---

## Reference de syntaxe des fichiers UI

Hytale utilise un **DSL personnalise** (Domain Specific Language) pour les fichiers UI. Ce n'est **PAS** du XAML, XML ou tout autre format standard.

### Structure de base

```
// Les commentaires commencent par //

// Importer Common.ui pour les composants reutilisables
$C = "../Common.ui";

// Definir des styles personnalises (optionnel)
@MonStyle = LabelStyle(FontSize: 16, TextColor: #ffffff);

// Element racine
Group {
  // Proprietes
  Anchor: (Width: 400, Height: 300);
  Background: #1a1a2e;

  // Elements enfants
  Label {
    Text: "Bonjour";
    Style: @MonStyle;
  }
}
```

### Regles de syntaxe critiques

| Regle | Correct | Incorrect |
|-------|---------|-----------|
| Les textes doivent etre entre guillemets | `Text: "Bonjour";` | `Text: Bonjour;` |
| Les proprietes finissent par point-virgule | `Anchor: (Width: 100);` | `Anchor: (Width: 100)` |
| Les couleurs en format hex | `#ffffff` ou `#fff` | `white` ou `rgb(255,255,255)` |
| Alpha dans les couleurs | `#141c26(0.95)` | `#141c26cc` |
| Les IDs d'elements commencent par # | `Label #Titre { }` | `Label Titre { }` |

### Proprietes de layout

| Propriete | Description | Exemple |
|-----------|-------------|---------|
| `Anchor` | Taille et position | `Anchor: (Width: 200, Height: 50);` |
| `Background` | Couleur de fond | `Background: #1a1a2e;` |
| `LayoutMode` | Arrangement des enfants | `LayoutMode: Top;` ou `Center;` ou `Left;` |
| `Padding` | Espacement interne | `Padding: (Full: 20);` ou `(Left: 10, Right: 10);` |
| `FlexWeight` | Taille flexible | `FlexWeight: 1;` |

### Valeurs de LayoutMode

| Mode | Description |
|------|-------------|
| `Top` | Empiler les enfants verticalement depuis le haut |
| `Left` | Empiler les enfants horizontalement depuis la gauche |
| `Center` | Centrer les enfants |

### Elements de base

#### Label (Affichage de texte)

```
Label {
  Text: "Mon texte";
  Anchor: (Height: 30);
  Style: (FontSize: 16, TextColor: #ffffff, HorizontalAlignment: Center);
}
```

#### Label avec ID

```
Label #Titre {
  Text: "Titre par defaut";
  Anchor: (Height: 40);
  Style: (FontSize: 24, TextColor: #ffffff, RenderBold: true);
}
```

#### Group (Conteneur)

```
Group {
  Anchor: (Height: 100);
  LayoutMode: Left;
  Background: #2a2a3e;

  // Les enfants vont ici
}
```

#### Espaceur

```
// Espaceur vertical
Group { Anchor: (Height: 20); }

// Espaceur horizontal (dans LayoutMode: Left)
Group { Anchor: (Width: 20); }

// Ligne de separation
Group { Anchor: (Height: 1); Background: #333333; }
```

#### TextButton (Style personnalise)

```
@MonStyleBouton = TextButtonStyle(
  Default: (Background: #3a7bd5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Hovered: (Background: #4a8be5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Pressed: (Background: #2a6bc5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center))
);

TextButton #MonBouton {
  Text: "Cliquez-moi";
  Anchor: (Width: 120, Height: 44);
  Style: @MonStyleBouton;
}
```

---

## Composants Common.ui

Le jeu fournit des composants reutilisables dans `Common.ui`. Importez-les avec :

```
$C = "../Common.ui";
```

Puis utilisez-les avec la syntaxe `$C.@NomComposant`.

### Composants disponibles

| Composant | Description | Parametres |
|-----------|-------------|------------|
| `$C.@TextButton` | Bouton principal (bleu) | `@Text` |
| `$C.@SecondaryTextButton` | Bouton secondaire (gris) | `@Text` |
| `$C.@CancelTextButton` | Bouton annuler/danger (rouge) | `@Text` |
| `$C.@TextField` | Champ de saisie texte | `PlaceholderText`, `FlexWeight` |
| `$C.@NumberField` | Champ de saisie numerique | `Value`, `Anchor` |
| `$C.@CheckBox` | Case a cocher seule | - |
| `$C.@CheckBoxWithLabel` | Case a cocher avec texte | `@Text`, `@Checked` |
| `$C.@DropdownBox` | Selecteur deroulant | `Anchor` |
| `$C.@ContentSeparator` | Separateur horizontal | `Anchor` |
| `$C.@Container` | Conteneur style | `Anchor` |
| `$C.@DecoratedContainer` | Conteneur avec bordure | `Anchor` |
| `$C.@DefaultSpinner` | Indicateur de chargement | `Anchor` |

### Exemples de composants

#### Boutons

```
$C = "../Common.ui";

Group {
  LayoutMode: Left;
  Anchor: (Height: 50);

  $C.@TextButton #BtnSauver {
    @Text = "Sauvegarder";
    Anchor: (Width: 120, Height: 40);
  }

  Group { Anchor: (Width: 10); }

  $C.@SecondaryTextButton #BtnAnnuler {
    @Text = "Annuler";
    Anchor: (Width: 100, Height: 40);
  }

  Group { Anchor: (Width: 10); }

  $C.@CancelTextButton #BtnSupprimer {
    @Text = "Supprimer";
    Anchor: (Width: 100, Height: 40);
  }
}
```

#### Champ de texte

```
Group {
  LayoutMode: Left;
  Anchor: (Height: 44);

  Label {
    Text: "Nom d'utilisateur";
    Anchor: (Width: 140);
    Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
  }

  $C.@TextField #ChampNom {
    FlexWeight: 1;
    PlaceholderText: "Entrez le nom...";
  }
}
```

#### Champ numerique

```
Group {
  LayoutMode: Left;
  Anchor: (Height: 44);

  Label {
    Text: "Quantite";
    Anchor: (Width: 100);
    Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
  }

  $C.@NumberField #ChampQuantite {
    Anchor: (Width: 80);
    Value: 100;
  }
}
```

#### Cases a cocher

```
$C.@CheckBoxWithLabel #OptionActiver {
  @Text = "Activer cette fonctionnalite";
  @Checked = true;
  Anchor: (Height: 28);
}

Group { Anchor: (Height: 8); }

$C.@CheckBoxWithLabel #OptionDesactive {
  @Text = "Desactive par defaut";
  @Checked = false;
  Anchor: (Height: 28);
}
```

#### Menu deroulant

```
Group {
  LayoutMode: Left;
  Anchor: (Height: 44);

  Label {
    Text: "Selectionner:";
    Anchor: (Width: 100);
    Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
  }

  $C.@DropdownBox #MonMenu {
    Anchor: (Width: 200, Height: 36);
  }
}
```

---

## Exemple complet : Page de parametres

Voici une page de parametres complete utilisant plusieurs composants :

### ParametresPage.ui

```
$C = "../Common.ui";

@BoutonPrincipal = TextButtonStyle(
  Default: (Background: #3a7bd5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Hovered: (Background: #4a8be5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Pressed: (Background: #2a6bc5, LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center))
);

@BoutonSecondaire = TextButtonStyle(
  Default: (Background: #2b3542, LabelStyle: (FontSize: 14, TextColor: #96a9be, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Hovered: (Background: #3b4552, LabelStyle: (FontSize: 14, TextColor: #b6c9de, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)),
  Pressed: (Background: #1b2532, LabelStyle: (FontSize: 14, TextColor: #96a9be, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center))
);

Group {
  Anchor: (Width: 450, Height: 400);
  Background: #141c26(0.98);
  LayoutMode: Top;
  Padding: (Full: 20);

  // Titre
  Label {
    Text: "Parametres";
    Anchor: (Height: 40);
    Style: (FontSize: 24, TextColor: #ffffff, HorizontalAlignment: Center, RenderBold: true);
  }

  // Separateur
  Group { Anchor: (Height: 1); Background: #2b3542; }
  Group { Anchor: (Height: 16); }

  // Champ nom d'utilisateur
  Group {
    LayoutMode: Left;
    Anchor: (Height: 44);

    Label {
      Text: "Nom d'utilisateur";
      Anchor: (Width: 140);
      Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
    }

    $C.@TextField #ChampNom {
      FlexWeight: 1;
      PlaceholderText: "Entrez le nom...";
    }
  }

  Group { Anchor: (Height: 12); }

  // Champ volume
  Group {
    LayoutMode: Left;
    Anchor: (Height: 44);

    Label {
      Text: "Volume";
      Anchor: (Width: 140);
      Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
    }

    $C.@NumberField #ChampVolume {
      Anchor: (Width: 80);
      Value: 75;
    }

    Label {
      Text: "%";
      Anchor: (Width: 30);
      Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
    }
  }

  Group { Anchor: (Height: 16); }

  // Cases a cocher
  $C.@CheckBoxWithLabel #OptionNotifications {
    @Text = "Activer les notifications";
    @Checked = true;
    Anchor: (Height: 28);
  }

  Group { Anchor: (Height: 8); }

  $C.@CheckBoxWithLabel #OptionSon {
    @Text = "Activer les sons";
    @Checked = true;
    Anchor: (Height: 28);
  }

  Group { Anchor: (Height: 8); }

  $C.@CheckBoxWithLabel #OptionSauvegardeAuto {
    @Text = "Sauvegarde automatique";
    @Checked = false;
    Anchor: (Height: 28);
  }

  // Espaceur pour pousser les boutons en bas
  Group { FlexWeight: 1; }

  // Boutons
  Group {
    LayoutMode: Center;
    Anchor: (Height: 50);

    TextButton #BoutonSauver {
      Text: "Sauvegarder";
      Anchor: (Width: 120, Height: 44);
      Style: @BoutonPrincipal;
    }

    Group { Anchor: (Width: 16); }

    TextButton #BoutonFermer {
      Text: "Fermer";
      Anchor: (Width: 100, Height: 44);
      Style: @BoutonSecondaire;
    }
  }

  // Pied de page
  Group { Anchor: (Height: 8); }
  Label {
    Text: "Appuyez sur ECHAP pour fermer";
    Anchor: (Height: 16);
    Style: (FontSize: 11, TextColor: #555555, HorizontalAlignment: Center);
  }
}
```

### ParametresPage.java

```java
package com.votreplugin.ui;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.util.NotificationUtil;
import com.hypixel.hytale.protocol.packets.interface_.NotificationStyle;
import com.hypixel.hytale.server.core.Message;

import javax.annotation.Nonnull;

public class ParametresPage extends InteractiveCustomUIPage<ParametresPage.ParametresEventData> {

    public static final String LAYOUT = "VotrePlugin/ParametresPage.ui";

    private final PlayerRef playerRef;

    public ParametresPage(@Nonnull PlayerRef playerRef) {
        super(playerRef, CustomPageLifetime.CanDismiss, ParametresEventData.CODEC);
        this.playerRef = playerRef;
    }

    @Override
    public void build(
            @Nonnull Ref<EntityStore> ref,
            @Nonnull UICommandBuilder cmd,
            @Nonnull UIEventBuilder evt,
            @Nonnull Store<EntityStore> store
    ) {
        cmd.append(LAYOUT);

        // Lier le bouton Sauvegarder
        evt.addEventBinding(
            CustomUIEventBindingType.Activating,
            "#BoutonSauver",
            new EventData().append("Action", "sauver"),
            false
        );

        // Lier le bouton Fermer
        evt.addEventBinding(
            CustomUIEventBindingType.Activating,
            "#BoutonFermer",
            new EventData().append("Action", "fermer"),
            false
        );
    }

    @Override
    public void handleDataEvent(
            @Nonnull Ref<EntityStore> ref,
            @Nonnull Store<EntityStore> store,
            @Nonnull ParametresEventData data
    ) {
        if ("fermer".equals(data.action)) {
            this.close();
        } else if ("sauver".equals(data.action)) {
            NotificationUtil.sendNotification(
                playerRef.getPacketHandler(),
                Message.raw("Parametres sauvegardes"),
                Message.raw("Vos parametres ont ete sauvegardes."),
                NotificationStyle.Success
            );
        }
    }

    public static class ParametresEventData {
        public static final BuilderCodec<ParametresEventData> CODEC = BuilderCodec.builder(
                ParametresEventData.class, ParametresEventData::new
        )
        .append(new KeyedCodec<>("Action", Codec.STRING), (e, v) -> e.action = v, e -> e.action)
        .add()
        .build();

        private String action;

        public ParametresEventData() {}
    }
}
```

---

## Reference API cote serveur

### InteractiveCustomUIPage

Classe de base pour les pages UI interactives.

```java
public class MaPage extends InteractiveCustomUIPage<MesEventData> {

    public MaPage(PlayerRef playerRef) {
        super(
            playerRef,                    // Reference du joueur
            CustomPageLifetime.CanDismiss, // Comment la page peut etre fermee
            MesEventData.CODEC             // Codec des donnees d'evenement
        );
    }

    @Override
    public void build(
        Ref<EntityStore> ref,
        UICommandBuilder cmd,
        UIEventBuilder evt,
        Store<EntityStore> store
    ) {
        // Appele quand la page s'ouvre
    }

    @Override
    public void handleDataEvent(
        Ref<EntityStore> ref,
        Store<EntityStore> store,
        MesEventData data
    ) {
        // Appele quand le joueur interagit
    }
}
```

### CustomPageLifetime

| Valeur | Description |
|--------|-------------|
| `CantClose` | Ne peut pas etre fermee par l'utilisateur |
| `CanDismiss` | Peut appuyer sur ECHAP pour fermer |
| `CanDismissOrCloseThroughInteraction` | ECHAP ou clic sur bouton |

### UICommandBuilder

```java
// Charger le layout
cmd.append("VotrePlugin/MaPage.ui");

// Definir le texte
cmd.set("#Titre.Text", "Bonjour le monde");

// Definir la visibilite
cmd.set("#Panneau.Visible", false);

// Definir une valeur numerique
cmd.set("#Slider.Value", 0.5f);

// Vider un conteneur
cmd.clear("#ListeItems");

// Ajouter a un conteneur
cmd.append("#ListeItems", "VotrePlugin/ElementListe.ui");
```

### UIEventBuilder

```java
// Evenement simple de bouton
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    "#MonBouton",
    new EventData().append("Action", "clic"),
    false  // locksInterface
);

// Capturer la valeur d'un input
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    "#BoutonSoumettre",
    new EventData()
        .append("Action", "soumettre")
        .append("@NomUtilisateur", "#ChampNom.Value"),  // Le prefixe @ capture la valeur
    false
);
```

### CustomUIEventBindingType

| Type | Quand declenche |
|------|-----------------|
| `Activating` | Clic ou Entree |
| `ValueChanged` | Changement de valeur (inputs, sliders) |
| `RightClicking` | Clic droit |
| `DoubleClicking` | Double clic |
| `MouseEntered` | Souris entre dans l'element |
| `MouseExited` | Souris quitte l'element |
| `FocusGained` | L'element gagne le focus |
| `FocusLost` | L'element perd le focus |

### Mettre a jour l'UI

```java
@Override
public void handleDataEvent(...) {
    UICommandBuilder cmd = new UICommandBuilder();
    cmd.set("#TexteStatut.Text", "Mis a jour !");
    this.sendUpdate(cmd, false);
}
```

### Fermer la page

```java
this.close();
```

### NotificationUtil

Pour des messages simples sans page complete :

```java
NotificationUtil.sendNotification(
    playerRef.getPacketHandler(),
    Message.raw("Titre"),
    Message.raw("Message"),
    NotificationStyle.Success  // ou Warning, Error, Default
);
```

---

## Codec de donnees d'evenement

Pour recevoir des donnees des evenements UI, creez une classe avec `BuilderCodec` :

```java
public static class MesEventData {
    public static final BuilderCodec<MesEventData> CODEC = BuilderCodec.builder(
            MesEventData.class, MesEventData::new
    )
    // Champ String
    .append(new KeyedCodec<>("Action", Codec.STRING),
        (e, v) -> e.action = v,
        e -> e.action)
    .add()
    // Autre champ
    .append(new KeyedCodec<>("ItemId", Codec.STRING),
        (e, v) -> e.itemId = v,
        e -> e.itemId)
    .add()
    .build();

    private String action;
    private String itemId;

    public MesEventData() {}  // Constructeur sans argument requis
}
```

Les noms de champs dans le codec **doivent correspondre** aux cles dans `EventData.append()`.

---

## Patterns d'UI Dynamique

Cette section couvre comment creer des listes dynamiques, mettre a jour l'UI en temps reel et travailler avec les templates.

### Creer une liste dynamique

**Fichier template** (`VotrePlugin/ElementListe.ui`) :
```
$C = "../Common.ui";

$C.@SecondaryTextButton {
  @Text = "Element";
  Anchor: (Height: 40);
}
```

**Fichier layout** (`VotrePlugin/MaPage.ui`) :
```
$C = "../Common.ui";

Group {
  Anchor: (Width: 400, Height: 300);
  Background: #141c26(0.98);
  LayoutMode: Top;
  Padding: (Full: 20);

  Label {
    Text: "Selectionnez un element:";
    Anchor: (Height: 30);
    Style: (FontSize: 16, TextColor: #ffffff);
  }

  Group #ListeElements {
    FlexWeight: 1;
    LayoutMode: Top;
    Background: #0d1218(0.5);
    Padding: (Full: 8);
  }
}
```

**Code Java** :
```java
@Override
public void build(...) {
    cmd.append(LAYOUT);

    String[] elements = {"Pomme", "Banane", "Cerise"};

    for (int i = 0; i < elements.length; i++) {
        // Ajouter le template - ceci cree l'element a l'index i
        cmd.append("#ListeElements", "VotrePlugin/ElementListe.ui");

        // Le template EST l'element a l'index i
        String selecteur = "#ListeElements[" + i + "]";

        // Definir le texte directement sur l'element
        cmd.set(selecteur + ".Text", elements[i]);

        // Lier l'evenement directement a l'element
        evt.addEventBinding(
            CustomUIEventBindingType.Activating,
            selecteur,
            new EventData().append("Action", "selectionner").append("Index", String.valueOf(i)),
            false
        );
    }
}
```

### Regles cles pour les templates dynamiques

1. **Template ajoute = element a l'index**
   ```java
   cmd.append("#Conteneur", "template.ui");
   // Cree #Conteneur[0], puis #Conteneur[1], etc.
   ```

2. **Acceder aux proprietes directement**
   ```java
   cmd.set("#Conteneur[0].Text", "valeur");    // CORRECT
   cmd.set("#Conteneur[0] #ID.Text", "valeur"); // INCORRECT (sauf si le template a des IDs imbriques)
   ```

3. **Les liaisons d'evenements ciblent l'element**
   ```java
   evt.addEventBinding(..., "#Conteneur[0]", ...);  // CORRECT
   ```

4. **Vider avant de reconstruire**
   ```java
   cmd.clear("#Conteneur");  // Supprime tous les enfants
   // Puis re-ajouter
   ```

### Mettre a jour l'UI sans reconstruire

Vous pouvez envoyer des mises a jour incrementales :

```java
@Override
public void handleDataEvent(...) {
    UICommandBuilder cmd = new UICommandBuilder();

    // Mettre a jour des elements specifiques
    cmd.set("#LabelStatut.Text", "Mis a jour !");
    cmd.set("#Compteur.Text", String.valueOf(compteur++));

    // Envoyer la mise a jour sans effacer
    this.sendUpdate(cmd, false);
}
```

### Vider et rafraichir

```java
// Vider un conteneur
cmd.clear("#ListeElements");

// Ou reconstruire toute la page
this.rebuild();
```

---

## Reference complete Common.ui

Cette section documente **tous** les composants et styles disponibles dans le fichier `Common.ui` du jeu.

### Constantes de style

```
@PrimaryButtonHeight = 44;
@SmallButtonHeight = 32;
@BigButtonHeight = 48;
@ButtonPadding = 24;
@DefaultButtonMinWidth = 172;
@ButtonBorder = 12;
@DropdownBoxHeight = 32;
@TitleHeight = 38;
@InnerPaddingValue = 8;
@FullPaddingValue = 17;  // @InnerPaddingValue + 9
```

### Composants bouton

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@TextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton principal (bleu) avec texte |
| `@SecondaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton secondaire (gris) avec texte |
| `@TertiaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton tertiaire avec texte |
| `@CancelTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton destructif/annuler (rouge) |
| `@SmallSecondaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Petit bouton secondaire |
| `@SmallTertiaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Petit bouton tertiaire |
| `@Button` | `@Anchor`, `@Sounds` | Bouton carre sans texte |
| `@SecondaryButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton carre secondaire |
| `@TertiaryButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton carre tertiaire |
| `@CancelButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton carre annuler |
| `@CloseButton` | - | Bouton fermer pre-positionne (32x32) |

### Composants input

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@TextField` | `@Anchor` | Champ de saisie texte (hauteur: 38) |
| `@NumberField` | `@Anchor` | Champ numerique uniquement (hauteur: 38) |
| `@DropdownBox` | `@Anchor` | Selecteur deroulant (defaut 330x32) |
| `@CheckBox` | - | Case a cocher seule (22x22) |
| `@CheckBoxWithLabel` | `@Text`, `@Checked` | Case a cocher avec texte |

### Composants conteneur

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@Container` | `@ContentPadding`, `@CloseButton` | Conteneur style avec zone titre |
| `@DecoratedContainer` | `@ContentPadding`, `@CloseButton` | Conteneur avec bordures decoratives |
| `@Panel` | - | Panneau simple avec bordure |
| `@PageOverlay` | - | Fond semi-transparent |

### Composants layout

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@ContentSeparator` | `@Anchor` | Separateur ligne horizontale (hauteur: 1) |
| `@VerticalSeparator` | - | Separateur vertical (largeur: 6) |
| `@HeaderSeparator` | - | Separateur de section header (5x34) |
| `@PanelSeparatorFancy` | `@Anchor` | Separateur de panneau decoratif |

### Composants texte

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@Title` | `@Text`, `@Alignment` | Label titre style |
| `@Subtitle` | `@Text` | Label sous-titre style |
| `@TitleLabel` | - | Grand titre centre (FontSize: 40) |
| `@PanelTitle` | `@Text`, `@Alignment` | Titre de section panneau |

### Composants utilitaires

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@DefaultSpinner` | `@Anchor` | Animation de chargement (32x32) |
| `@HeaderSearch` | `@MarginRight` | Input de recherche avec icone |
| `@BackButton` | - | Bouton retour pre-positionne |

### Styles disponibles

#### Styles de bouton

| Style | Description |
|-------|-------------|
| `@DefaultTextButtonStyle` | Style bouton principal |
| `@SecondaryTextButtonStyle` | Style bouton secondaire |
| `@TertiaryTextButtonStyle` | Style bouton tertiaire |
| `@CancelTextButtonStyle` | Style bouton destructif/annuler |
| `@SmallDefaultTextButtonStyle` | Style petit bouton principal |
| `@SmallSecondaryTextButtonStyle` | Style petit bouton secondaire |

#### Styles de label

| Style | Proprietes |
|-------|------------|
| `@DefaultLabelStyle` | FontSize: 16, TextColor: #96a9be |
| `@DefaultButtonLabelStyle` | FontSize: 17, TextColor: #bfcdd5, Bold, Uppercase, Center |
| `@TitleStyle` | FontSize: 15, Bold, Uppercase, TextColor: #b4c8c9, Police secondaire |
| `@SubtitleStyle` | FontSize: 15, Uppercase, TextColor: #96a9be |
| `@PopupTitleStyle` | FontSize: 38, Bold, Uppercase, Center, LetterSpacing: 2 |

### Proprietes LabelStyle

```
LabelStyle(
  FontSize: 16,
  TextColor: #ffffff,
  RenderBold: true,
  RenderUppercase: true,
  HorizontalAlignment: Center,  // Start, Center, End
  VerticalAlignment: Center,    // Top, Center, Bottom
  FontName: "Default",          // ou "Secondary"
  LetterSpacing: 0,
  Wrap: true                    // Retour a la ligne
)
```

### Structure TextButtonStyle

```
@MonStyleBouton = TextButtonStyle(
  Default: (
    Background: PatchStyle(TexturePath: "chemin.png", Border: 12),
    LabelStyle: @UnLabelStyle
  ),
  Hovered: (
    Background: PatchStyle(TexturePath: "survol.png", Border: 12),
    LabelStyle: @UnLabelStyle
  ),
  Pressed: (
    Background: PatchStyle(TexturePath: "presse.png", Border: 12),
    LabelStyle: @UnLabelStyle
  ),
  Disabled: (
    Background: PatchStyle(TexturePath: "desactive.png", Border: 12),
    LabelStyle: @LabelStyleDesactive
  ),
  Sounds: @SonsBouton
);
```

### Proprietes Anchor

```
Anchor: (
  Width: 100,
  Height: 50,
  Top: 10,
  Bottom: 10,
  Left: 10,
  Right: 10,
  Horizontal: 10,  // Left + Right
  Vertical: 10     // Top + Bottom
);
```

### Proprietes Padding

```
Padding: (
  Full: 20,           // Tous les cotes
  Horizontal: 10,     // Left + Right
  Vertical: 10,       // Top + Bottom
  Top: 10,
  Bottom: 10,
  Left: 10,
  Right: 10
);
```

---

## Depannage

### "Failed to load CustomUI documents"

**Cause** : Erreur de syntaxe dans votre fichier `.ui`.

**Solutions** :
1. Assurez-vous que tous les textes sont entre guillemets : `Text: "Bonjour";` pas `Text: Bonjour;`
2. Verifiez que toutes les proprietes finissent par point-virgule
3. Verifiez le format des couleurs : `#ffffff` ou `#fff`
4. Assurez-vous que l'import Common.ui est correct : `$C = "../Common.ui";`

### "Failed to apply CustomUI event bindings"

**Cause** : L'ID d'element dans Java ne correspond pas au fichier `.ui`.

**Solutions** :
1. Verifiez que l'ID d'element existe dans votre fichier `.ui`
2. Verifiez l'orthographe : `#MonBouton` dans Java doit correspondre a `#MonBouton` dans `.ui`
3. Pour les composants Common.ui, l'ID va apres le composant : `$C.@TextButton #MonBouton`

### "Selected element in CustomUI command was not found"

**Cause** : Pattern de selecteur incorrect pour les templates ajoutes dynamiquement.

**Comprendre** : Quand vous ajoutez un template a un conteneur, le template lui-meme **devient** l'element a cet index. Vous ne naviguez pas vers un enfant a l'interieur.

**Incorrect :**
```java
// Ceci cherche #Button A L'INTERIEUR de l'element a l'index 0
cmd.set("#Conteneur[0] #Button.Text", "Bonjour");  // INCORRECT !
```

**Correct :**
```java
// L'element a l'index 0 EST le bouton
cmd.set("#Conteneur[0].Text", "Bonjour");  // CORRECT !
```

**Pattern complet :**
```java
// Ajouter le template
cmd.append("#ConteneurBoutons", "VotrePlugin/BoutonMonde.ui");

// Le template ajoute EST #ConteneurBoutons[0]
String selecteur = "#ConteneurBoutons[0]";
cmd.set(selecteur + ".Text", "Nom du monde");

// La liaison d'evenement cible l'element directement
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    selecteur,  // PAS selecteur + " #Button"
    new EventData().append("Action", "clic"),
    false
);
```

### Parametres de template vs Proprietes

Les **parametres de template** (`@Text`) sont definis lors de l'instanciation d'un composant et definissent les valeurs initiales.

Les **proprietes** (`.Text`) sont les proprietes reelles a l'execution que vous modifiez depuis Java.

| Contexte | Syntaxe | Exemple |
|----------|---------|---------|
| Dans le fichier `.ui` | `@Parametre` | `@Text = "Defaut";` |
| En Java (definir valeur) | `.Propriete` | `cmd.set("#Bouton.Text", "Nouveau");` |

**Important** : Vous ne pouvez pas utiliser `@Text` dans les selecteurs Java. Utilisez toujours `.Text` :
```java
// INCORRECT
cmd.set("#Bouton.@Text", "Bonjour");

// CORRECT
cmd.set("#Bouton.Text", "Bonjour");
```

### Le joueur se deconnecte a l'ouverture de la page

**Cause** : Le fichier `.ui` a une erreur de parsing ou n'existe pas.

**Solutions** :
1. Verifiez que le chemin correspond : `"VotrePlugin/MaPage.ui"` correspond a `Common/UI/Custom/VotrePlugin/MaPage.ui`
2. Revoyez attentivement la syntaxe du fichier UI
3. Commencez avec un exemple minimal fonctionnel et ajoutez la complexite progressivement

### L'UI s'ouvre mais les boutons ne fonctionnent pas

**Cause** : Les liaisons d'evenements ne sont pas configurees correctement.

**Solutions** :
1. Assurez-vous que `evt.addEventBinding()` est appele dans `build()`
2. Verifiez que le selecteur correspond a l'ID de l'element : `"#MonBouton"`
3. Verifiez que `handleDataEvent()` gere la valeur de l'action

---

## Imports requis

```java
// UI de base
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;

// Codec
import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;

// ECS
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

// Joueur & Commandes
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.Message;

// Notifications
import com.hypixel.hytale.server.core.util.NotificationUtil;
import com.hypixel.hytale.protocol.packets.interface_.NotificationStyle;
```
