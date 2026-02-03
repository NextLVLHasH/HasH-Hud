---
id: ui-reference
title: Reference du Systeme UI
sidebar_label: Reference UI
sidebar_position: 8
description: Reference complete du systeme UI Hytale - syntaxe DSL, composants Common.ui, API Java et toutes les proprietes
---

# Reference du Systeme UI

Ceci est la reference technique complete du systeme UI de Hytale. Pour un guide tutoriel, voir [Systeme d'UI Personnalisee](./custom-ui).

---

## Syntaxe DSL UI

Hytale utilise un langage specifique (DSL) personnalise pour les fichiers `.ui`. Ce n'est **PAS** du XML, XAML ou JSON.

### Structure de fichier

```
// Les commentaires commencent par //

// Importer des fichiers UI externes
$C = "../Common.ui";
$Autre = "chemin/vers/Autre.ui";

// Definir des styles/constantes personnalises
@MaConstante = 100;
@MonStyle = LabelStyle(FontSize: 16, TextColor: #ffffff);

// Element racine (UN SEUL element racine par fichier)
Group {
  // Les proprietes utilisent : et finissent par ;
  NomPropriete: valeur;

  // Elements enfants
  ElementEnfant {
    // ...
  }
}
```

### Regles de syntaxe

| Regle | Correct | Incorrect |
|-------|---------|-----------|
| Les chaines doivent etre entre guillemets | `Text: "Bonjour";` | `Text: Bonjour;` |
| Les proprietes finissent par point-virgule | `Width: 100;` | `Width: 100` |
| Les couleurs en format hex | `#ffffff`, `#fff` | `white`, `rgb()` |
| Alpha dans les couleurs | `#141c26(0.95)` | `#141c26cc` |
| Les IDs d'elements commencent par # | `Label #Titre { }` | `Label Titre { }` |
| Un seul element racine par fichier | Un seul `Group { }` | Plusieurs racines |
| Syntaxe d'import | `$C = "../Common.ui";` | `import Common.ui` |

### Syntaxe d'import et de reference

```
// Importer un fichier UI et assigner a une variable
$C = "../Common.ui";

// Utiliser les composants importes avec @
$C.@TextButton #MonBouton {
  @Text = "Cliquer";  // Parametre de template
}

// Referencer un style depuis le fichier importe
Style: $C.@DefaultLabelStyle;

// Definir un style local
@StyleLocal = LabelStyle(FontSize: 20);
```

### Instanciation de template

```
// Utilisation basique de template
$VarImport.@NomTemplate #IDElement {
  @Parametre = valeur;      // Les parametres de template utilisent @
  ProprieteNormale: valeur;  // Les proprietes normales utilisent :
}

// Exemple avec bouton Common.ui
$C.@SecondaryTextButton #BtnSauver {
  @Text = "Sauvegarder";
  Anchor: (Width: 120, Height: 40);
}
```

---

## Types d'elements

### Group (Conteneur)

L'element conteneur principal pour les layouts.

```
Group {
  Anchor: (Width: 400, Height: 300);
  Background: #141c26;
  LayoutMode: Top;
  Padding: (Full: 20);
  FlexWeight: 1;
  Visible: true;

  // Les enfants vont ici
}
```

**Proprietes:**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Anchor` | Anchor | Contraintes de taille et position |
| `Background` | Color/PatchStyle | Couleur de fond ou image 9-slice |
| `LayoutMode` | Enum | Arrangement des enfants |
| `Padding` | Padding | Espacement interne |
| `FlexWeight` | Number | Poids de dimensionnement flexible |
| `Visible` | Boolean | Visibilite |
| `Enabled` | Boolean | Interaction activee |
| `Opacity` | Number (0-1) | Transparence |

### Label (Affichage de texte)

```
Label {
  Text: "Bonjour le monde";
  Anchor: (Height: 30);
  Style: (FontSize: 16, TextColor: #ffffff);
}

// Avec ID pour mises a jour dynamiques
Label #TexteStatut {
  Text: "Statut: Pret";
  Anchor: (Height: 24);
  Style: @MonStyleLabel;
}
```

**Proprietes:**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Text` | String | Texte affiche |
| `Style` | LabelStyle | Style du texte |
| `Anchor` | Anchor | Contraintes de taille |
| `Visible` | Boolean | Visibilite |

### TextButton

```
TextButton #MonBouton {
  Text: "Cliquez-moi";
  Anchor: (Width: 120, Height: 44);
  Style: @MonStyleBouton;
}
```

**Proprietes:**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Text` | String | Libelle du bouton |
| `Style` | TextButtonStyle | Style du bouton |
| `Anchor` | Anchor | Contraintes de taille |
| `Enabled` | Boolean | Peut etre clique |
| `Visible` | Boolean | Visibilite |

### Image

```
Image {
  TexturePath: "Common/MonImage.png";
  Anchor: (Width: 64, Height: 64);
  Tint: #ffffff;
}
```

**Proprietes:**

| Propriete | Type | Description |
|-----------|------|-------------|
| `TexturePath` | String | Chemin vers la texture |
| `Anchor` | Anchor | Contraintes de taille |
| `Tint` | Color | Teinte de couleur |
| `Opacity` | Number | Transparence |

### TextField (Champ de saisie)

```
TextField #ChampNom {
  PlaceholderText: "Entrez le nom...";
  Anchor: (Height: 38);
  Style: @DefaultInputFieldStyle;
  FlexWeight: 1;
}
```

**Proprietes:**

| Propriete | Type | Description |
|-----------|------|-------------|
| `Value` | String | Valeur texte actuelle |
| `PlaceholderText` | String | Texte indicatif quand vide |
| `Style` | InputFieldStyle | Style du champ |
| `Anchor` | Anchor | Contraintes de taille |
| `FlexWeight` | Number | Largeur flexible |

### NumberField

```
NumberField #ChampQuantite {
  Value: 100;
  Anchor: (Width: 80, Height: 38);
}
```

### CheckBox

```
CheckBox #MaCheckbox {
  Value: true;
  Anchor: (Width: 22, Height: 22);
  Style: @DefaultCheckBoxStyle;
}
```

### Slider

```
Slider #SliderVolume {
  Value: 0.75;
  MinValue: 0;
  MaxValue: 1;
  Anchor: (Height: 20);
  Style: @DefaultSliderStyle;
}
```

### DropdownBox

```
DropdownBox #MonDropdown {
  Anchor: (Width: 200, Height: 32);
  Style: @DefaultDropdownBoxStyle;
}
```

### ScrollView

```
ScrollView {
  Anchor: (Width: 300, Height: 200);
  Style: @DefaultScrollbarStyle;

  // Contenu defilable
  Group {
    LayoutMode: Top;
    // Elements...
  }
}
```

---

## Types de proprietes

### Anchor

Controle la taille et la position des elements.

```
Anchor: (
  Width: 200,        // Largeur fixe
  Height: 50,        // Hauteur fixe
  Top: 10,           // Marge haute
  Bottom: 10,        // Marge basse
  Left: 10,          // Marge gauche
  Right: 10,         // Marge droite
  Horizontal: 10,    // Gauche + Droite
  Vertical: 10       // Haut + Bas
);

// Forme courte
Anchor: (Width: 200, Height: 50);
Anchor: (Height: 40);
```

### Padding

Espacement interne dans les conteneurs.

```
Padding: (
  Full: 20,          // Tous les cotes
  Horizontal: 10,    // Gauche + Droite
  Vertical: 10,      // Haut + Bas
  Top: 10,
  Bottom: 10,
  Left: 10,
  Right: 10
);

// Forme courte
Padding: (Full: 20);
Padding: (Horizontal: 10, Vertical: 5);
```

### LayoutMode

Comment les enfants sont arranges dans un conteneur.

| Valeur | Description |
|--------|-------------|
| `Top` | Empiler verticalement depuis le haut |
| `Bottom` | Empiler verticalement depuis le bas |
| `Left` | Empiler horizontalement depuis la gauche |
| `Right` | Empiler horizontalement depuis la droite |
| `Center` | Centrer tous les enfants |
| `Overlay` | Empiler les uns sur les autres |

```
Group {
  LayoutMode: Top;
  // Les enfants s'empilent verticalement
}
```

### Color

```
// Couleurs hex
Background: #ffffff;      // Blanc
Background: #fff;         // Forme courte
Background: #141c26;      // Bleu fonce

// Avec alpha
Background: #141c26(0.95); // 95% opacite
Background: #000000(0.5);  // 50% noir transparent
```

### LabelStyle

Proprietes de style de texte.

```
@MonStyleLabel = LabelStyle(
  FontSize: 16,
  TextColor: #ffffff,
  RenderBold: true,
  RenderItalic: false,
  RenderUppercase: false,
  HorizontalAlignment: Center,  // Start, Center, End
  VerticalAlignment: Center,    // Top, Center, Bottom
  FontName: "Default",          // ou "Secondary"
  LetterSpacing: 0,
  LineSpacing: 1.0,
  Wrap: true,
  Overflow: Ellipsis            // ou Clip, Visible
);

// Style inline
Style: (FontSize: 14, TextColor: #96a9be, VerticalAlignment: Center);
```

### TextButtonStyle

Style des etats du bouton.

```
@MonStyleBouton = TextButtonStyle(
  Default: (
    Background: #3a7bd5,
    LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)
  ),
  Hovered: (
    Background: #4a8be5,
    LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)
  ),
  Pressed: (
    Background: #2a6bc5,
    LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)
  ),
  Disabled: (
    Background: #555555,
    LabelStyle: (FontSize: 14, TextColor: #888888, RenderBold: true, HorizontalAlignment: Center, VerticalAlignment: Center)
  ),
  Sounds: @SonsBouton
);
```

### PatchStyle (9-Slice)

Pour les fonds extensibles utilisant des images 9-slice.

```
PatchStyle(
  TexturePath: "Common/Bouton.png",
  Border: 12                    // Tous les cotes egaux
)

PatchStyle(
  TexturePath: "Common/Panneau.png",
  HorizontalBorder: 80,         // Bordures gauche/droite
  VerticalBorder: 12            // Bordures haut/bas
)
```

---

## Composants Common.ui

Importer avec: `$C = "../Common.ui";`

### Composants bouton

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@TextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton principal (bleu) |
| `@SecondaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton secondaire (gris) |
| `@TertiaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton tertiaire |
| `@CancelTextButton` | `@Text`, `@Anchor`, `@Sounds` | Bouton destructif (rouge) |
| `@SmallSecondaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Petit secondaire |
| `@SmallTertiaryTextButton` | `@Text`, `@Anchor`, `@Sounds` | Petit tertiaire |
| `@Button` | `@Anchor`, `@Sounds` | Bouton icone (sans texte) |
| `@SecondaryButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton icone secondaire |
| `@TertiaryButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton icone tertiaire |
| `@CancelButton` | `@Anchor`, `@Sounds`, `@Width` | Bouton icone annuler |
| `@CloseButton` | - | Bouton fermer pre-style (32x32) |
| `@BackButton` | - | Bouton retour pre-style |

**Utilisation:**
```
$C.@TextButton #BtnSauver {
  @Text = "Sauvegarder";
  Anchor: (Width: 120, Height: 44);
}

$C.@SecondaryTextButton #BtnAnnuler {
  @Text = "Annuler";
  Anchor: (Width: 100, Height: 44);
}

$C.@CancelTextButton #BtnSupprimer {
  @Text = "Supprimer";
  Anchor: (Width: 100, Height: 44);
}
```

### Composants input

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@TextField` | `@Anchor` | Champ texte (hauteur: 38) |
| `@NumberField` | `@Anchor` | Champ numerique (hauteur: 38) |
| `@DropdownBox` | `@Anchor` | Selecteur deroulant |
| `@CheckBox` | - | Case a cocher seule (22x22) |
| `@CheckBoxWithLabel` | `@Text`, `@Checked` | Case a cocher avec label |

**Utilisation:**
```
$C.@TextField #ChampNom {
  FlexWeight: 1;
  PlaceholderText: "Entrez le nom...";
}

$C.@NumberField #ChampQuantite {
  Anchor: (Width: 80);
  Value: 100;
}

$C.@CheckBoxWithLabel #OptionActiver {
  @Text = "Activer la fonctionnalite";
  @Checked = true;
  Anchor: (Height: 28);
}

$C.@DropdownBox #SelectCategorie {
  Anchor: (Width: 200, Height: 32);
}
```

### Composants conteneur

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@Container` | `@ContentPadding`, `@CloseButton` | Conteneur style avec titre |
| `@DecoratedContainer` | `@ContentPadding`, `@CloseButton` | Conteneur avec bordure decorative |
| `@Panel` | - | Panneau simple avec bordure |
| `@PageOverlay` | - | Fond semi-transparent |

### Composants layout

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@ContentSeparator` | `@Anchor` | Ligne horizontale (hauteur: 1) |
| `@VerticalSeparator` | - | Ligne verticale (largeur: 6) |
| `@HeaderSeparator` | - | Separateur de section header |
| `@PanelSeparatorFancy` | `@Anchor` | Separateur decoratif |
| `@ActionButtonContainer` | - | Conteneur pour boutons d'action |
| `@ActionButtonSeparator` | - | Espace entre boutons d'action |

### Composants texte

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@Title` | `@Text`, `@Alignment` | Label titre style |
| `@Subtitle` | `@Text` | Sous-titre style |
| `@TitleLabel` | - | Grand titre centre (40px) |
| `@PanelTitle` | `@Text`, `@Alignment` | Titre de section panneau |

### Composants utilitaires

| Composant | Parametres | Description |
|-----------|------------|-------------|
| `@DefaultSpinner` | `@Anchor` | Indicateur de chargement (32x32) |
| `@HeaderSearch` | `@MarginRight` | Champ recherche avec icone |

---

## Constantes de style Common.ui

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
@FullPaddingValue = 17;
@DisabledColor = #797b7c;
```

## Styles Common.ui

### Styles de bouton

| Style | Description |
|-------|-------------|
| `@DefaultTextButtonStyle` | Bouton principal |
| `@SecondaryTextButtonStyle` | Bouton secondaire |
| `@TertiaryTextButtonStyle` | Bouton tertiaire |
| `@CancelTextButtonStyle` | Destructif/annuler |
| `@SmallDefaultTextButtonStyle` | Petit principal |
| `@SmallSecondaryTextButtonStyle` | Petit secondaire |
| `@DefaultButtonStyle` | Bouton icone |
| `@SecondaryButtonStyle` | Icone secondaire |
| `@TertiaryButtonStyle` | Icone tertiaire |
| `@CancelButtonStyle` | Icone annuler |

### Styles de label

| Style | Proprietes |
|-------|------------|
| `@DefaultLabelStyle` | FontSize: 16, TextColor: #96a9be |
| `@DefaultButtonLabelStyle` | FontSize: 17, Bold, Uppercase, Center |
| `@TitleStyle` | FontSize: 15, Bold, Uppercase, #b4c8c9 |
| `@SubtitleStyle` | FontSize: 15, Uppercase, #96a9be |
| `@PopupTitleStyle` | FontSize: 38, Bold, Uppercase, Center |

### Styles d'input

| Style | Description |
|-------|-------------|
| `@DefaultInputFieldStyle` | Style champ texte |
| `@DefaultInputFieldPlaceholderStyle` | Texte placeholder (#6e7da1) |
| `@InputBoxBackground` | Fond du champ |
| `@InputBoxHoveredBackground` | Etat survol |
| `@InputBoxSelectedBackground` | Etat selectionne |

### Autres styles

| Style | Description |
|-------|-------------|
| `@DefaultScrollbarStyle` | Style barre de defilement |
| `@DefaultCheckBoxStyle` | Style case a cocher |
| `@DefaultDropdownBoxStyle` | Style dropdown |
| `@DefaultSliderStyle` | Style slider |
| `@DefaultTextTooltipStyle` | Style infobulle |
| `@DefaultColorPickerStyle` | Style selecteur couleur |

---

## Reference API Java

### UICommandBuilder

Construit des commandes pour manipuler les elements UI.

```java
UICommandBuilder cmd = new UICommandBuilder();
```

**Methodes:**

| Methode | Description |
|---------|-------------|
| `append(String documentPath)` | Charger un document UI |
| `append(String selector, String documentPath)` | Ajouter template au conteneur |
| `appendInline(String selector, String document)` | Ajouter definition UI inline |
| `insertBefore(String selector, String documentPath)` | Inserer avant element |
| `insertBeforeInline(String selector, String document)` | Inserer inline avant |
| `set(String selector, String value)` | Definir propriete string |
| `set(String selector, boolean value)` | Definir propriete boolean |
| `set(String selector, int value)` | Definir propriete int |
| `set(String selector, float value)` | Definir propriete float |
| `set(String selector, double value)` | Definir propriete double |
| `set(String selector, Message message)` | Definir message localise |
| `set(String selector, Value<T> ref)` | Definir reference document |
| `setNull(String selector)` | Definir a null |
| `setObject(String selector, Object data)` | Definir objet encodable |
| `set(String selector, T[] data)` | Definir tableau |
| `set(String selector, List<T> data)` | Definir liste |
| `clear(String selector)` | Supprimer tous les enfants |
| `remove(String selector)` | Supprimer element |
| `getCommands()` | Obtenir commandes compilees |

**Exemples:**
```java
// Charger le layout
cmd.append("VotrePlugin/MaPage.ui");

// Definir le texte
cmd.set("#Titre.Text", "Bonjour le monde");

// Definir la visibilite
cmd.set("#Panneau.Visible", false);

// Definir valeur numerique
cmd.set("#Slider.Value", 0.75f);

// Ajouter template au conteneur
cmd.append("#ListeItems", "VotrePlugin/ElementListe.ui");

// Vider le conteneur
cmd.clear("#ListeItems");

// Supprimer element specifique
cmd.remove("#AncienElement");
```

### UIEventBuilder

Construit les liaisons d'evenements pour les interactions UI.

```java
UIEventBuilder evt = new UIEventBuilder();
```

**Methodes:**

| Methode | Description |
|---------|-------------|
| `addEventBinding(type, selector)` | Liaison basique |
| `addEventBinding(type, selector, locksInterface)` | Avec verrou interface |
| `addEventBinding(type, selector, data)` | Avec donnees evenement |
| `addEventBinding(type, selector, data, locksInterface)` | Signature complete |
| `getEvents()` | Obtenir liaisons compilees |

**Exemples:**
```java
// Simple clic bouton
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    "#MonBouton",
    new EventData().append("Action", "clic"),
    false
);

// Capturer valeur input
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    "#BtnSoumettre",
    new EventData()
        .append("Action", "soumettre")
        .append("@NomUtilisateur", "#ChampNom.Value"),  // @ capture la valeur
    false
);

// Evenement changement valeur
evt.addEventBinding(
    CustomUIEventBindingType.ValueChanged,
    "#SliderVolume",
    new EventData().append("Action", "volume_change"),
    false
);
```

### CustomUIEventBindingType

Les 24 types d'evenements:

| Type | ID | Description |
|------|-----|-------------|
| `Activating` | 0 | Clic ou touche Entree |
| `RightClicking` | 1 | Clic droit souris |
| `DoubleClicking` | 2 | Double clic |
| `MouseEntered` | 3 | Souris entre dans element |
| `MouseExited` | 4 | Souris quitte element |
| `ValueChanged` | 5 | Valeur input/slider changee |
| `ElementReordered` | 6 | Element reordonne |
| `Validating` | 7 | Validation formulaire |
| `Dismissing` | 8 | Page en cours de fermeture |
| `FocusGained` | 9 | Element a gagne le focus |
| `FocusLost` | 10 | Element a perdu le focus |
| `KeyDown` | 11 | Touche enfoncee |
| `MouseButtonReleased` | 12 | Bouton souris relache |
| `SlotClicking` | 13 | Clic slot inventaire |
| `SlotDoubleClicking` | 14 | Double-clic slot inventaire |
| `SlotMouseEntered` | 15 | Souris entree dans slot |
| `SlotMouseExited` | 16 | Souris sortie du slot |
| `DragCancelled` | 17 | Glisser-deposer annule |
| `Dropped` | 18 | Element depose |
| `SlotMouseDragCompleted` | 19 | Glisser slot termine |
| `SlotMouseDragExited` | 20 | Glisser slot sorti |
| `SlotClickReleaseWhileDragging` | 21 | Clic relache pendant glisser |
| `SlotClickPressWhileDragging` | 22 | Clic appuye pendant glisser |
| `SelectedTabChanged` | 23 | Selection onglet changee |

### EventData

Conteneur pour les paires cle-valeur des evenements.

```java
// Creer avec donnees
EventData data = new EventData()
    .append("Action", "clic")
    .append("ItemId", "epee_01")
    .append("@Valeur", "#Input.Value");  // Prefixe @ capture la valeur UI

// Methode factory
EventData data = EventData.of("Action", "clic");

// Acceder aux donnees
Map<String, String> events = data.events();
```

### Value\<T\>

Referencer des valeurs depuis les documents UI.

```java
// Creer reference document
Value<String> styleRef = Value.ref("Pages/Styles.ui", "StyleSelectionne");

// Creer valeur directe
Value<String> valeurDirecte = Value.of("Bonjour");

// Utiliser dans commande
cmd.set("#Element.Style", styleRef);
```

### InteractiveCustomUIPage\<T\>

Classe de base pour les pages UI interactives.

```java
public class MaPage extends InteractiveCustomUIPage<MaPage.MesEventData> {

    public MaPage(PlayerRef playerRef) {
        super(
            playerRef,
            CustomPageLifetime.CanDismiss,
            MesEventData.CODEC
        );
    }

    @Override
    public void build(
        Ref<EntityStore> ref,
        UICommandBuilder cmd,
        UIEventBuilder evt,
        Store<EntityStore> store
    ) {
        // Construire l'UI
    }

    @Override
    public void handleDataEvent(
        Ref<EntityStore> ref,
        Store<EntityStore> store,
        MesEventData data
    ) {
        // Gerer les evenements
    }
}
```

**Methodes:**

| Methode | Description |
|---------|-------------|
| `build(ref, cmd, evt, store)` | Appele quand la page s'ouvre |
| `handleDataEvent(ref, store, data)` | Appele sur interaction utilisateur |
| `sendUpdate(cmd, clear)` | Envoyer mise a jour UI |
| `sendUpdate(cmd, evt, clear)` | Envoyer mise a jour avec nouvelles liaisons |
| `rebuild()` | Reconstruire completement la page |
| `close()` | Fermer la page |
| `onDismiss(ref, store)` | Appele quand la page se ferme |
| `setLifetime(lifetime)` | Changer la duree de vie |
| `getLifetime()` | Obtenir la duree de vie actuelle |

### CustomPageLifetime

| Valeur | Description |
|--------|-------------|
| `CantClose` | Ne peut pas etre fermee par l'utilisateur |
| `CanDismiss` | Touche ECHAP ferme la page |
| `CanDismissOrCloseThroughInteraction` | ECHAP ou clic bouton |

### BasicCustomUIPage

Classe de base simplifiee pour les pages non-interactives.

```java
public class PageStatique extends BasicCustomUIPage {

    @Override
    public void build(UICommandBuilder cmd) {
        cmd.append("VotrePlugin/PageStatique.ui");
    }
}
```

### BuilderCodec

Pour serialiser/deserialiser les donnees d'evenement.

```java
public static class MesEventData {
    public static final BuilderCodec<MesEventData> CODEC = BuilderCodec.builder(
            MesEventData.class, MesEventData::new
    )
    .append(new KeyedCodec<>("Action", Codec.STRING),
        (e, v) -> e.action = v,
        e -> e.action)
    .add()
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

### Codecs disponibles

| Codec | Type |
|-------|------|
| `Codec.STRING` | String |
| `Codec.INT` | Integer |
| `Codec.LONG` | Long |
| `Codec.FLOAT` | Float |
| `Codec.DOUBLE` | Double |
| `Codec.BOOL` | Boolean |

---

## Syntaxe des selecteurs

### Selecteurs basiques

```java
// Par ID
"#IDElement"

// Acces propriete
"#IDElement.NomPropriete"

// Element imbrique
"#Parent #Enfant"

// Propriete imbriquee
"#Parent #Enfant.NomPropriete"
```

### Selecteurs dynamiques (indexes)

Quand vous ajoutez des templates, ils deviennent des elements indexes:

```java
// Append cree des elements indexes
cmd.append("#Conteneur", "template.ui");  // Cree #Conteneur[0]
cmd.append("#Conteneur", "template.ui");  // Cree #Conteneur[1]

// Acces par index
"#Conteneur[0]"           // Premier element
"#Conteneur[1]"           // Deuxieme element
"#Conteneur[0].Text"      // Propriete du premier element
```

**Important:** Le template ajoute EST l'element a cet index. N'essayez PAS de naviguer a l'interieur:

```java
// CORRECT - l'element a l'index EST le template
cmd.set("#Conteneur[0].Text", "Bonjour");

// INCORRECT - chercher un enfant a l'interieur (echoue generalement)
cmd.set("#Conteneur[0] #Bouton.Text", "Bonjour");
```

### Noms de proprietes

| Dans fichier .ui | Dans selecteur Java |
|------------------|---------------------|
| `@Text` (param template) | `.Text` (propriete) |
| `@Checked` (param template) | `.Value` (propriete) |
| `Visible:` | `.Visible` |
| `Text:` | `.Text` |
| `Value:` | `.Value` |

**Parametres de template vs Proprietes:**
- `@Text` dans .ui = valeur initiale quand le template est instancie
- `.Text` en Java = propriete runtime que vous pouvez modifier

---

## Types CustomUICommand

Types de commandes internes (pour reference):

| Type | ID | Description |
|------|-----|-------------|
| `Append` | 0 | Ajouter depuis document |
| `AppendInline` | 1 | Ajouter definition inline |
| `InsertBefore` | 2 | Inserer avant element |
| `InsertBeforeInline` | 3 | Inserer inline avant |
| `Remove` | 4 | Supprimer element |
| `Set` | 5 | Definir valeur propriete |
| `Clear` | 6 | Supprimer tous les enfants |

---

## Types d'objets supportes

Objets qui peuvent etre passes a `setObject()`:

| Type | Description |
|------|-------------|
| `Area` | Zone rectangle |
| `ItemGridSlot` | Donnees slot inventaire |
| `ItemStack` | Item avec quantite/qualite |
| `LocalizableString` | Chaine traduite |
| `PatchStyle` | Fond 9-slice |
| `DropdownEntryInfo` | Option dropdown |
| `Anchor` | Contraintes taille/position |

---

## Imports requis

```java
// UI de base
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.entity.entities.player.pages.BasicCustomUIPage;
import com.hypixel.hytale.server.core.entity.entities.player.pages.CustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.Value;
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

// Joueur
import com.hypixel.hytale.server.core.entity.entities.Player;

// Notifications
import com.hypixel.hytale.server.core.util.NotificationUtil;
import com.hypixel.hytale.protocol.packets.interface_.NotificationStyle;
import com.hypixel.hytale.server.core.Message;
```

---

## Bonnes pratiques

### Organisation des fichiers UI

```
resources/Common/UI/Custom/VotrePlugin/
├── PagePrincipale.ui    # Layout principal
├── Composants/
│   ├── ElementListe.ui  # Element de liste reutilisable
│   └── Carte.ui         # Carte reutilisable
└── Styles/
    └── StylesPerso.ui   # Styles personnalises
```

### Performance

1. **Minimiser les mises a jour** - Grouper les changements dans un seul appel `sendUpdate()`
2. **Utiliser clear() sagement** - Seulement lors de la reconstruction de listes entieres
3. **Eviter rebuild()** - Utiliser des appels `set()` cibles a la place
4. **Indexer les elements** - Pre-calculer les selecteurs pour les listes dynamiques

### Prevention des erreurs

1. **Un seul element racine** - Chaque fichier .ui doit avoir exactement une racine
2. **Guillemets pour toutes les chaines** - `Text: "Bonjour";` pas `Text: Bonjour;`
3. **Finir par point-virgule** - Chaque propriete a besoin de `;`
4. **Correspondance exacte des IDs** - Sensible a la casse
5. **Tester incrementalement** - Ajouter la complexite progressivement
