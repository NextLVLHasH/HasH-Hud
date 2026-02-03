---
title: "Complete UI Reference"
description: "The ultimate comprehensive guide to Hytale's UI system - syntax, components, properties, styles, layouts, and Java API"
---

# Hytale UI System - Complete Reference

This is the ultimate comprehensive reference for Hytale's custom UI system. It covers everything from basic syntax to advanced patterns, extracted from decompiled server code and real-world examples.

## Table of Contents

1. [DSL Syntax Overview](#1-dsl-syntax-overview)
2. [Imports and Variables](#2-imports-and-variables)
3. [Component Types](#3-component-types)
4. [Property Reference](#4-property-reference)
5. [Anchor System (Positioning)](#5-anchor-system-positioning)
6. [Layout Modes](#6-layout-modes)
7. [Style System](#7-style-system)
8. [Color Formats](#8-color-formats)
9. [Value Types](#9-value-types)
10. [Templates and Inheritance](#10-templates-and-inheritance)
11. [Event Bindings](#11-event-bindings)
12. [Java API](#12-java-api)
13. [Common.ui Library](#13-commonui-library)
14. [Complete Examples](#14-complete-examples)

---

## 1. DSL Syntax Overview

Hytale uses a custom Domain-Specific Language (DSL) for UI definitions - **not XML, JSON, or XAML**.

### Basic Structure

```
// Imports
$C = "../Common.ui";

// Variables
@MyColor = #3a7bd5;

// Styles
@MyStyle = LabelStyle(FontSize: 14, TextColor: #ffffff);

// Components
Group #RootContainer {
  Anchor: (Width: 400, Height: 300);
  Background: #1a1a2e(0.95);

  Label #Title {
    Text: "Hello World";
  }
}
```

### Syntax Rules

| Element | Prefix | Example |
|---------|--------|---------|
| Import alias | `$` | `$C = "../Common.ui";` |
| Variable/Style | `@` | `@MyColor = #ff0000;` |
| Element ID | `#` | `Label #Title { }` |
| Color | `#` | `#3a7bd5` or `#3a7bd5(0.95)` |
| Template ref | `$Alias.@Name` | `$C.@TextButton` |
| Reference | `@Name` | `Style: @MyStyle;` |
| Spread | `...` | `...@BaseStyle` |
| Localized | `%` | `%server.customUI.key` |

---

## 2. Imports and Variables

### File Imports

```
$C = "../Common.ui";
$Sounds = "Sounds.ui";
$Styles = "../styles/Theme.ui";
```

Access imported content: `$C.@TextButton`, `$Sounds.@ButtonSounds`

### Variable Definitions

```
// Colors
@PrimaryColor = #3a7bd5;
@TextColor = #ffffff;
@DisabledColor = #6b7280(0.5);

// Numbers
@ButtonHeight = 44;
@DefaultPadding = 16;

// Booleans
@ShowHeader = true;

// Strings
@DefaultText = "Click here";

// Objects
@DefaultAnchor = (Width: 100, Height: 40);

// References to other variables
@SecondaryColor = @PrimaryColor;
```

---

## 3. Component Types

### Layout Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Group` | Primary container for organizing elements | `LayoutMode`, `Padding`, `Background` |
| `Container` | Generic container | `LayoutMode`, `Padding` |
| `Panel` | Panel container | `Background`, `BorderRadius` |
| `Box` | Flexible box | `FlexWeight` |
| `HorizontalGroup` | Horizontal layout group | `Gap`, `Alignment` |
| `VerticalGroup` | Vertical layout group | `Gap`, `Alignment` |
| `ScrollView` | Scrollable container | `ScrollbarStyle` |
| `ScrollPanel` | Scrollable panel | `ScrollbarStyle` |
| `Grid` | Grid layout | `Columns`, `Gap` |
| `Stack` | Z-index stacking | - |
| `Frame` | Frame container | `Background` |

### Text Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Label` | Text display | `Text`, `Style` (LabelStyle) |
| `Text` | Text element | `Text`, `Style` |
| `RichText` | Rich formatted text | `Text`, `Wrap` |

### Input Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `TextField` | Single-line text input | `PlaceholderText`, `Value`, `Style` |
| `TextInput` | Text input element | `PlaceholderText`, `MaxLength` |
| `TextArea` | Multi-line text input | `PlaceholderText`, `Wrap` |
| `NumberField` | Numeric input | `Min`, `Max`, `Step`, `Value`, `Format` |
| `CompactTextField` | Expandable text input | `CollapsedWidth`, `ExpandedWidth` |

### Button Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Button` | Basic button | `Style` (ButtonStyle) |
| `TextButton` | Button with text | `Text`, `Style` (TextButtonStyle) |
| `ImageButton` | Button with image | `Texture`, `Style` |
| `IconButton` | Icon-only button | `Icon`, `Style` |
| `ToggleButton` | Toggle button | `Checked`, `Style` |
| `CheckBox` | Checkbox | `Checked`, `Style` (CheckBoxStyle) |
| `CheckBoxWithLabel` | Checkbox with label | `Text`, `Checked` |
| `RadioButton` | Radio button | `Group`, `Checked` |
| `BackButton` | Navigation back button | `Style` |

### Selection Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Dropdown` | Dropdown menu | `Style` (DropdownStyle) |
| `DropdownBox` | Dropdown selection | `Entries`, `Style` (DropdownBoxStyle) |
| `ComboBox` | Editable dropdown | `Style` |
| `Select` | Selection dropdown | `Options` |
| `FileDropdownBox` | File selection dropdown | `Filter` |

### Slider Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Slider` | Value slider | `Min`, `Max`, `Value`, `Step`, `Style` |
| `FloatSlider` | Float value slider | `Min`, `Max`, `Value`, `Step` |
| `Scrollbar` | Scrollbar element | `Style` (ScrollbarStyle) |
| `ProgressBar` | Progress indicator | `Value`, `Max`, `Style` |

### Image Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Image` | Image display (**deprecated**) | Use `Group` with `Background` instead |
| `Icon` | Icon display | `TexturePath`, `Tint` |
| `Sprite` | Animated sprite | `TexturePath`, `Frame`, `FramesPerSecond` |
| `NineSlice` | 9-patch scalable image | `TexturePath`, `Border` |

### Game-Specific Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `ItemSlot` | Inventory slot | `Background`, `Overlay`, `Icon` |
| `ItemGrid` | Grid of item slots | `SlotsPerRow`, `Slots` |
| `ItemIcon` | Item icon display | `Item` |
| `Inventory` | Inventory container | `Slots` |
| `InventorySlot` | Single inventory slot | `Index` |
| `Hotbar` | Hotbar container | `Slots` |
| `HotbarSlot` | Single hotbar slot | `Index` |
| `Tooltip` | Tooltip popup | `Style` (TextTooltipStyle) |
| `TooltipPanel` | Tooltip panel | `Style` |

### Utility Components

| Component | Description | Key Properties |
|-----------|-------------|----------------|
| `Divider` | Horizontal divider | `Color`, `Thickness` |
| `Separator` | Visual separator | `Orientation` |
| `Spacer` | Empty space | `Width`, `Height` |
| `ColorPicker` | Color picker | `Value`, `Style` (ColorPickerStyle) |

---

## 4. Property Reference

### Anchor Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `Anchor` | Object | Container for positioning | `Anchor: (Width: 100, Height: 50)` |
| `Left` | Number | Distance from left edge | `Left: 10` |
| `Right` | Number | Distance from right edge | `Right: 10` |
| `Top` | Number | Distance from top edge | `Top: 20` |
| `Bottom` | Number | Distance from bottom edge | `Bottom: 20` |
| `Width` | Number | Explicit width | `Width: 100` |
| `Height` | Number | Explicit height | `Height: 50` |
| `MinWidth` | Number | Minimum width | `MinWidth: 50` |
| `MaxWidth` | Number | Maximum width | `MaxWidth: 500` |
| `MinHeight` | Number | Minimum height | `MinHeight: 30` |
| `MaxHeight` | Number | Maximum height | `MaxHeight: 100` |
| `Horizontal` | Number | Horizontal stretch | `Horizontal: 0` |
| `Vertical` | Number | Vertical stretch | `Vertical: 0` |
| `Full` | Number | Fill parent | `Full: 0` |

### Layout Properties

| Property | Type | Options | Description |
|----------|------|---------|-------------|
| `LayoutMode` | Enum | `Top`, `TopScrolling`, `Left`, `Right`, `Center`, `Bottom`, `Overlay`, `Absolute` | Child arrangement |
| `HorizontalAlignment` | Enum | `Left`, `Center`, `Right`, `Stretch` | Horizontal alignment |
| `VerticalAlignment` | Enum | `Top`, `Center`, `Bottom`, `Stretch` | Vertical alignment |
| `FlexWeight` | Number | - | Flex sizing weight |
| `Gap` | Number | - | Space between children |
| `Spacing` | Number | - | Element spacing |

### Padding Properties

| Property | Type | Description |
|----------|------|-------------|
| `Padding` | Object/Number | Inner spacing |
| `Padding.Full` | Number | All sides |
| `Padding.Horizontal` | Number | Left + Right |
| `Padding.Vertical` | Number | Top + Bottom |
| `Padding.Top` | Number | Top only |
| `Padding.Bottom` | Number | Bottom only |
| `Padding.Left` | Number | Left only |
| `Padding.Right` | Number | Right only |

### Visual Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `Background` | Color/PatchStyle | Background | `#1a1a2e` or `(TexturePath: "...", Border: 16)` |
| `Foreground` | Color | Foreground color | `#ffffff` |
| `Color` | Color | Element color | `#3a7bd5` |
| `Opacity` | Number | Transparency (0-1) | `0.95` |
| `Alpha` | Number | Alpha value (0-1) | `0.8` |
| `Visible` | Boolean | Visibility | `true` |
| `Enabled` | Boolean | Enabled state | `true` |
| `BorderColor` | Color | Border color | `#96a9be` |
| `BorderWidth` | Number | Border thickness | `2` |
| `CornerRadius` | Number | Corner rounding | `6` |
| `HitTestVisible` | Boolean | Clickable | `true` |

### Text Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `Text` | String | Text content | `"Hello"` |
| `TextColor` | Color | Text color | `#ffffff` |
| `FontSize` | Number | Font size (px) | `14` |
| `FontName` | String | Font name | `"Default"`, `"Secondary"` |
| `RenderBold` | Boolean | Bold text | `true` |
| `RenderItalic` | Boolean | Italic text | `false` |
| `RenderUppercase` | Boolean | Uppercase | `true` |
| `Wrap` | Boolean | Text wrapping | `true` |
| `LineHeight` | Number | Line height | `1.5` |
| `LetterSpacing` | Number | Letter spacing | `0.5` |
| `OutlineColor` | Color | Text outline | `#000000(0.5)` |

### Image Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `TexturePath` | String | Texture path | `"Common/Button.png"` |
| `Texture` | String | Texture reference | `"@ButtonTexture"` |
| `Border` | Number | 9-patch border | `16` |
| `HorizontalBorder` | Number | Horizontal border | `80` |
| `VerticalBorder` | Number | Vertical border | `20` |
| `Tint` | Color | Color tint | `#ff0000` |
| `Frame` | Object | Animation frame | `(Width: 32, Height: 32, PerRow: 8, Count: 72)` |
| `FramesPerSecond` | Number | Animation FPS | `30` |
| `Area` | Object | Texture region | `(X: 0, Y: 0, Width: 100, Height: 100)` |

### Input Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `PlaceholderText` | String | Placeholder | `"Enter text..."` |
| `PlaceholderStyle` | LabelStyle | Placeholder style | `@PlaceholderStyle` |
| `Value` | Number/String | Current value | `50` |
| `Min` | Number | Minimum value | `0` |
| `Max` | Number | Maximum value | `100` |
| `Step` | Number | Value step | `5` |
| `Format` | Object | Number format | `(MaxDecimalPlaces: 0)` |
| `MaxLength` | Number | Max text length | `100` |

---

## 5. Anchor System (Positioning)

Hytale uses an **edge-based positioning system** similar to CSS absolute positioning.

### Basic Positioning

```
// Fixed size at position
Anchor: (Left: 10, Top: 20, Width: 100, Height: 50);

// Size only (flow layout)
Anchor: (Width: 400, Height: 300);

// Position from edges
Anchor: (Left: 50, Top: 170);
```

### Stretch Modes

```
// Full width, fixed height
Anchor: (Left: 0, Right: 0, Height: 50);

// Full height, fixed width
Anchor: (Top: 0, Bottom: 0, Width: 200);

// Fill entire parent
Anchor: (Full: 0);

// Horizontal stretch
Anchor: (Horizontal: 0, Height: 50);

// Vertical stretch
Anchor: (Vertical: 0, Width: 100);
```

### Negative Offsets

```
// Position outside parent bounds
Anchor: (Width: 32, Height: 32, Top: -16, Right: -16);
```

### Size Constraints

```
Anchor: (
  Width: 200,
  Height: 100,
  MinWidth: 100,
  MaxWidth: 400,
  MinHeight: 50,
  MaxHeight: 200
);
```

---

## 6. Layout Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `Top` | Children stacked vertically from top | Vertical lists, forms |
| `TopScrolling` | Vertical with scrolling | Scrollable lists |
| `Bottom` | Children stacked from bottom | Bottom-aligned content |
| `Left` | Children arranged horizontally from left | Toolbars, button rows |
| `Right` | Children arranged from right | RTL layouts |
| `Center` | Children centered horizontally | Centered buttons |
| `Overlay` | Children overlaid (z-stacking) | Popups, modals |
| `Absolute` | Children use Anchor positioning | Free-form layouts |

### Example

```
Group {
  LayoutMode: Top;
  Gap: 12;
  Padding: (Full: 16);

  Label { Text: "Item 1"; }
  Label { Text: "Item 2"; }
  Label { Text: "Item 3"; }
}
```

---

## 7. Style System

### Style Types

| Style Type | Used By | States |
|-----------|---------|--------|
| `LabelStyle` | Label, Text | Default, Disabled |
| `TextButtonStyle` | TextButton | Default, Hovered, Pressed, Disabled |
| `ButtonStyle` | Button, ImageButton | Default, Hovered, Pressed, Disabled |
| `CheckBoxStyle` | CheckBox | Unchecked, Checked (with sub-states) |
| `DropdownBoxStyle` | DropdownBox | Multiple sub-styles |
| `SliderStyle` | Slider | Default, Hovered, Pressed |
| `ScrollbarStyle` | Scrollbar, ScrollView | Default, Hovered, Dragged |
| `InputFieldStyle` | TextField | Default, Focused, Disabled |
| `PatchStyle` | NineSlice backgrounds | - |
| `TextTooltipStyle` | Tooltip | Default |
| `ColorPickerStyle` | ColorPicker | - |
| `PopupMenuLayerStyle` | Menus | Multiple sub-styles |
| `TabNavigationStyle` | Tabs | Tab states, selected states |

### LabelStyle

```
@MyLabelStyle = LabelStyle(
  FontSize: 14,
  FontName: "Default",
  TextColor: #ffffff,
  OutlineColor: #000000(0.3),
  HorizontalAlignment: Center,
  VerticalAlignment: Center,
  RenderBold: true,
  RenderUppercase: false,
  LetterSpacing: 0,
  Wrap: true
);
```

### TextButtonStyle

```
@MyButtonStyle = TextButtonStyle(
  Default: (
    Background: #3a7bd5,
    LabelStyle: (FontSize: 14, TextColor: #ffffff, RenderBold: true)
  ),
  Hovered: (
    Background: #2563eb,
    LabelStyle: (TextColor: #ffffff)
  ),
  Pressed: (
    Background: #1e40af,
    LabelStyle: (TextColor: #e0e7ff)
  ),
  Disabled: (
    Background: #6b7280,
    LabelStyle: (TextColor: #9ca3af)
  ),
  Sounds: @ButtonSounds
);
```

### PatchStyle (9-Patch/NineSlice)

```
@MyBackground = PatchStyle(
  TexturePath: "Common/Panel.png",
  Border: 16
);

// With different horizontal/vertical borders
@MyButton = PatchStyle(
  TexturePath: "Common/Button.png",
  HorizontalBorder: 80,
  VerticalBorder: 12,
  Color: #ffffff(0.95)
);

// With texture region
@MyPatch = PatchStyle(
  TexturePath: "Common/Atlas.png",
  Border: 8,
  Area: (X: 0, Y: 0, Width: 64, Height: 64)
);
```

### CheckBoxStyle

```
@MyCheckBoxStyle = CheckBoxStyle(
  Unchecked: (
    DefaultBackground: (Color: #2b3542),
    HoveredBackground: (Color: #3a4556),
    PressedBackground: (Color: #1e2633),
    DisabledBackground: (Color: #1a1a1a),
    ChangedSound: (SoundPath: "Sounds/Click.ogg", Volume: 6)
  ),
  Checked: (
    DefaultBackground: (TexturePath: "Common/CheckMark.png"),
    HoveredBackground: (TexturePath: "Common/CheckMarkHover.png"),
    PressedBackground: (TexturePath: "Common/CheckMarkPressed.png"),
    ChangedSound: (SoundPath: "Sounds/Click.ogg", Volume: 6)
  )
);
```

### ScrollbarStyle

```
@MyScrollbarStyle = ScrollbarStyle(
  Spacing: 6,
  Size: 6,
  OnlyVisibleWhenHovered: true,
  Background: (TexturePath: "Common/ScrollbarBg.png", Border: 3),
  Handle: (TexturePath: "Common/ScrollbarHandle.png", Border: 3),
  HoveredHandle: (TexturePath: "Common/ScrollbarHandleHover.png", Border: 3),
  DraggedHandle: (TexturePath: "Common/ScrollbarHandleDrag.png", Border: 3)
);
```

### Style Inheritance (Spread)

```
// Base style
@BaseButtonStyle = TextButtonStyle(
  Default: (Background: #3a7bd5, LabelStyle: @DefaultLabel),
  Hovered: (Background: #2563eb),
  Pressed: (Background: #1e40af),
  Disabled: (Background: #6b7280)
);

// Extended style with overrides
@SecondaryButtonStyle = TextButtonStyle(
  ...@BaseButtonStyle,
  Default: (
    ...@BaseButtonStyle.Default,
    Background: #e94560
  )
);
```

---

## 8. Color Formats

### Basic Hex Color

```
Background: #3a7bd5;
TextColor: #ffffff;
BorderColor: #000000;
```

### Hex with Alpha

```
Background: #1a1a2e(0.95);    // 95% opacity
TextColor: #ffffff(0.6);       // 60% opacity
Overlay: #000000(0.5);         // 50% opacity (semi-transparent black)
OutlineColor: #000000(0.3);    // 30% opacity
```

### Alpha Values

- `0.0` = Fully transparent
- `0.5` = 50% opacity
- `1.0` = Fully opaque (default)

---

## 9. Value Types

| Type | Syntax | Example |
|------|--------|---------|
| String | `"text"` | `Text: "Hello"` |
| Number | `123` or `3.14` | `Width: 100`, `Opacity: 0.95` |
| Percentage | `50%` | `Width: 50%` |
| Boolean | `true`/`false` | `Visible: true` |
| Color | `#RRGGBB` or `#RRGGBB(alpha)` | `#3a7bd5(0.95)` |
| Enum | `EnumValue` | `LayoutMode: Top` |
| Object | `(key: value, ...)` | `Anchor: (Width: 100)` |
| Reference | `@Name` | `Style: @MyStyle` |
| Template | `$Alias.@Name` | `$C.@TextButton` |
| Spread | `...@Name` | `...@BaseStyle` |
| Localized | `%key.path` | `%server.customUI.title` |

---

## 10. Templates and Inheritance

### Using Templates

```
// Import file
$C = "../Common.ui";

// Use template with parameter overrides
$C.@TextButton #MyButton {
  @Text = "Click Me";           // Template parameter
  Anchor: (Width: 120);         // Component property
}

$C.@Container #MyContainer {
  @ContentPadding = (Full: 20);
  @CloseButton = true;

  Label { Text: "Content"; }
}
```

### Template Parameter vs Property

```
$C.@TextButton {
  @Text = "Label";         // @ = Template parameter (defined in template)
  Anchor: (Width: 100);    // No @ = Component property
}
```

### Spread Operator

```
// Merge and override styles
@ExtendedStyle = LabelStyle(
  ...@BaseStyle,          // Include all properties from BaseStyle
  FontSize: 18,           // Override FontSize
  TextColor: #ff0000      // Override TextColor
);

// Nested spreading
Style: (
  ...@DefaultStyle,
  Sounds: (
    ...$Sounds.@ButtonSounds,
    ...@CustomSounds
  )
);
```

---

## 11. Event Bindings

### Event Types

| Event | Description | Use Case |
|-------|-------------|----------|
| `Activating` | Component activated (click) | Button clicks |
| `RightClicking` | Right mouse click | Context menus |
| `DoubleClicking` | Double click | Quick actions |
| `MouseEntered` | Mouse hover start | Hover effects |
| `MouseExited` | Mouse hover end | Hover cleanup |
| `ValueChanged` | Input value changed | Form inputs |
| `ElementReordered` | Element reordered | Drag-and-drop lists |
| `Validating` | Validation event | Form validation |
| `Dismissing` | Component dismissal | Close dialogs |
| `FocusGained` | Input focused | Focus styling |
| `FocusLost` | Input blurred | Blur handling |
| `KeyDown` | Key pressed | Keyboard shortcuts |
| `MouseButtonReleased` | Mouse released | Drag end |
| `SlotClicking` | Inventory slot click | Inventory management |
| `SlotDoubleClicking` | Slot double click | Quick transfer |
| `SlotMouseEntered` | Slot hover start | Slot tooltips |
| `SlotMouseExited` | Slot hover end | Hide tooltips |
| `DragCancelled` | Drag cancelled | Drag cleanup |
| `Dropped` | Item dropped | Drop handling |
| `SlotMouseDragCompleted` | Slot drag complete | Slot transfers |
| `SelectedTabChanged` | Tab changed | Tab navigation |

### Event Binding in Java

```java
evt.addEventBinding(
    CustomUIEventBindingType.Activating,
    "#MyButton",
    new EventData().append("Action", "buttonClicked")
);

evt.addEventBinding(
    CustomUIEventBindingType.ValueChanged,
    "#MySlider",
    new EventData()
        .append("Action", "sliderChanged")
        .append("Value", "@Value")  // Capture current value
);
```

---

## 12. Java API

### Page Controller Base Class

```java
public class MyPageController extends InteractiveCustomUIPage<MyPageController.UIEventData> {

    public static final String LAYOUT = "MyPage.ui";

    public MyPageController(PlayerRef playerRef) {
        super(playerRef, CustomPageLifetime.CanDismiss, UIEventData.CODEC);
    }

    @Override
    public void build(
            Ref<EntityStore> ref,
            UICommandBuilder cmd,
            UIEventBuilder evt,
            Store<EntityStore> store
    ) {
        cmd.append(LAYOUT);
        // Set up UI
    }

    @Override
    public void handleDataEvent(
            Ref<EntityStore> ref,
            Store<EntityStore> store,
            UIEventData data
    ) {
        // Handle events
    }

    public static class UIEventData {
        public static final BuilderCodec<UIEventData> CODEC = /* ... */;
        private String action;
    }
}
```

### UICommandBuilder Methods

| Method | Description | Example |
|--------|-------------|---------|
| `append(path)` | Load UI from file | `cmd.append("MyPage.ui")` |
| `append(selector, path)` | Append to element | `cmd.append("#List", "Item.ui")` |
| `appendInline(selector, doc)` | Append inline UI | `cmd.appendInline("#List", "Label { Text: \"...\"; }")` |
| `insertBefore(selector, path)` | Insert before element | `cmd.insertBefore("#Item2", "Item.ui")` |
| `remove(selector)` | Remove element | `cmd.remove("#OldItem")` |
| `clear(selector)` | Clear children | `cmd.clear("#List")` |
| `set(selector, value)` | Set property | `cmd.set("#Title.Text", "Hello")` |
| `setNull(selector)` | Set null | `cmd.setNull("#Value")` |

### UIEventBuilder Methods

| Method | Description |
|--------|-------------|
| `addEventBinding(type, selector)` | Bind event to element |
| `addEventBinding(type, selector, data)` | Bind with data capture |
| `addEventBinding(type, selector, data, locksInterface)` | Bind with interface lock |

### Selectors

```java
// Element by ID
cmd.set("#Title.Text", "Hello");

// Indexed element
cmd.set("#List[0].Text", "First");
cmd.set("#List[1].Text", "Second");

// Nested property
cmd.set("#Button.Style.Background", "#ff0000");
```

### Page Lifetimes

| Lifetime | Description |
|----------|-------------|
| `CantClose` | Cannot be closed by user |
| `CanDismiss` | Can be dismissed (Escape) |
| `CanClose` | Can be closed (close button) |
| `CanCloseOrDismiss` | Either close or dismiss |

---

## 13. Common.ui Library

The `Common.ui` file provides pre-built templates and styles.

### Button Templates

```
$C.@TextButton #MyButton {
  @Text = "Primary Button";
  Anchor: (Width: 140, Height: 44);
}

$C.@SecondaryTextButton #Secondary {
  @Text = "Secondary";
}

$C.@CancelTextButton #Cancel {
  @Text = "Cancel";
}

$C.@TertiaryTextButton #Tertiary {
  @Text = "Link Style";
}
```

### Input Templates

```
$C.@TextField #NameInput {
  @PlaceholderText = "Enter name...";
  Anchor: (Width: 200, Height: 32);
}

$C.@NumberField #AgeInput {
  @Min = 0;
  @Max = 100;
  @Value = 18;
}

$C.@CheckBoxWithLabel #AgreeCheckbox {
  @Text = "I agree to terms";
  @Checked = false;
}

$C.@DropdownBox #CategorySelect {
  // Entries set via Java
}
```

### Container Templates

```
$C.@Container #Panel {
  @ContentPadding = (Full: 16);
  @CloseButton = true;

  // Content here
}

$C.@DecoratedContainer #FancyPanel {
  @Title = "Panel Title";
  // Content here
}
```

### Utility Templates

```
// Separators
$C.@ContentSeparator {}
$C.@VerticalSeparator {}

// Spinner/Loading
$C.@DefaultSpinner {}

// Back button
$C.@BackButton #BackBtn {}
```

---

## 14. Complete Examples

### Simple Dialog

```
$C = "../Common.ui";

@TitleStyle = LabelStyle(
  FontSize: 20,
  TextColor: #ffffff,
  RenderBold: true,
  HorizontalAlignment: Center
);

Group #DialogRoot {
  Anchor: (Width: 400, Height: 250);
  Background: #1a1a2e(0.98);
  LayoutMode: Top;
  Padding: (Full: 20);

  // Title
  Label #Title {
    Text: "Confirm Action";
    Anchor: (Height: 32);
    Style: @TitleStyle;
  }

  // Spacer
  Group { Anchor: (Height: 16); }

  // Message
  Label #Message {
    Text: "Are you sure you want to continue?";
    Anchor: (Height: 60);
    Style: (FontSize: 14, TextColor: #c0c0c0, Wrap: true, HorizontalAlignment: Center);
  }

  // Flex spacer
  Group { FlexWeight: 1; }

  // Buttons
  Group #Buttons {
    LayoutMode: Center;
    Anchor: (Height: 50);
    Gap: 16;

    $C.@CancelTextButton #CancelBtn {
      @Text = "Cancel";
      Anchor: (Width: 100, Height: 44);
    }

    $C.@TextButton #ConfirmBtn {
      @Text = "Confirm";
      Anchor: (Width: 100, Height: 44);
    }
  }
}
```

### Form with Inputs

```
$C = "../Common.ui";

Group #FormRoot {
  Anchor: (Width: 500, Height: 400);
  Background: #141c26(0.98);
  LayoutMode: Top;
  Padding: (Full: 24);

  // Header
  Label {
    Text: "User Registration";
    Anchor: (Height: 36);
    Style: (FontSize: 22, TextColor: #ffffff, RenderBold: true);
  }

  Group { Anchor: (Height: 20); }

  // Form fields
  Group #FormFields {
    LayoutMode: Top;
    Gap: 16;

    // Username
    Group {
      LayoutMode: Top;
      Gap: 4;

      Label { Text: "Username"; Style: (FontSize: 12, TextColor: #96a9be); }
      $C.@TextField #UsernameInput {
        @PlaceholderText = "Enter username";
        Anchor: (Width: 100%, Height: 36);
      }
    }

    // Email
    Group {
      LayoutMode: Top;
      Gap: 4;

      Label { Text: "Email"; Style: (FontSize: 12, TextColor: #96a9be); }
      $C.@TextField #EmailInput {
        @PlaceholderText = "Enter email";
        Anchor: (Width: 100%, Height: 36);
      }
    }

    // Age
    Group {
      LayoutMode: Top;
      Gap: 4;

      Label { Text: "Age"; Style: (FontSize: 12, TextColor: #96a9be); }
      $C.@NumberField #AgeInput {
        @Min = 13;
        @Max = 120;
        @Value = 18;
        Anchor: (Width: 120, Height: 36);
      }
    }

    // Terms
    $C.@CheckBoxWithLabel #TermsCheckbox {
      @Text = "I agree to the Terms of Service";
      @Checked = false;
    }
  }

  // Spacer
  Group { FlexWeight: 1; }

  // Submit
  Group {
    LayoutMode: Center;
    Anchor: (Height: 50);

    $C.@TextButton #SubmitBtn {
      @Text = "Register";
      Anchor: (Width: 160, Height: 44);
    }
  }
}
```

### Dynamic List

```
// ListPage.ui
$C = "../Common.ui";

Group #ListRoot {
  Anchor: (Width: 600, Height: 500);
  Background: #1a1a2e(0.98);
  LayoutMode: Top;
  Padding: (Full: 20);

  // Header
  Group {
    LayoutMode: Left;
    Anchor: (Height: 44);

    Label {
      Text: "World Selection";
      Style: (FontSize: 18, TextColor: #ffffff, RenderBold: true);
    }

    Group { FlexWeight: 1; }

    $C.@TextButton #RefreshBtn {
      @Text = "Refresh";
      Anchor: (Width: 100, Height: 36);
    }
  }

  Group { Anchor: (Height: 16); }

  // Scrollable list
  ScrollView {
    Anchor: (Full: 0);
    ScrollbarStyle: @DefaultScrollbarStyle;

    Group #WorldList {
      LayoutMode: Top;
      Gap: 8;
      // Items added dynamically via Java
    }
  }
}

// ListItem.ui (Template)
$C = "../Common.ui";

Group {
  Anchor: (Width: 100%, Height: 60);
  Background: #2b3542;
  LayoutMode: Left;
  Padding: (Horizontal: 16, Vertical: 12);

  Label #ItemName {
    Text: "World Name";
    FlexWeight: 1;
    Style: (FontSize: 14, TextColor: #ffffff);
  }

  $C.@SecondaryTextButton #SelectBtn {
    @Text = "Select";
    Anchor: (Width: 80, Height: 36);
  }
}
```

### Java Controller for Dynamic List

```java
public class WorldListController extends InteractiveCustomUIPage<WorldListController.EventData> {

    public static final String LAYOUT = "ListPage.ui";
    public static final String ITEM_TEMPLATE = "ListItem.ui";

    @Override
    public void build(Ref<EntityStore> ref, UICommandBuilder cmd, UIEventBuilder evt, Store<EntityStore> store) {
        cmd.append(LAYOUT);

        // Add event bindings
        evt.addEventBinding(CustomUIEventBindingType.Activating, "#RefreshBtn",
            new EventData().append("Action", "refresh"));

        // Load initial list
        loadWorldList(cmd, evt);
    }

    private void loadWorldList(UICommandBuilder cmd, UIEventBuilder evt) {
        List<WorldInfo> worlds = getWorlds();

        cmd.clear("#WorldList");

        for (int i = 0; i < worlds.size(); i++) {
            WorldInfo world = worlds.get(i);

            cmd.append("#WorldList", ITEM_TEMPLATE);
            cmd.set("#WorldList[" + i + "] #ItemName.Text", world.getName());

            evt.addEventBinding(CustomUIEventBindingType.Activating,
                "#WorldList[" + i + "] #SelectBtn",
                new EventData()
                    .append("Action", "select")
                    .append("WorldId", world.getId())
            );
        }
    }

    @Override
    public void handleDataEvent(Ref<EntityStore> ref, Store<EntityStore> store, EventData data) {
        switch (data.action) {
            case "refresh":
                UICommandBuilder cmd = new UICommandBuilder();
                UIEventBuilder evt = new UIEventBuilder();
                loadWorldList(cmd, evt);
                sendUpdate(cmd, evt);
                break;
            case "select":
                selectWorld(data.worldId);
                break;
        }
    }
}
```

---

## Quick Reference Card

### DSL Syntax Cheat Sheet

```
// IMPORTS
$Alias = "path/to/file.ui";

// VARIABLES
@Name = value;

// STYLES
@StyleName = StyleType(property: value, ...);

// COMPONENTS
ComponentType #ElementId {
  Property: value;
  NestedProp: (SubProp: value);

  ChildComponent { ... }
}

// TEMPLATE USAGE
$Alias.@TemplateName #Id {
  @TemplateParam = value;
  ComponentProp: value;
}

// INHERITANCE
@Extended = StyleType(
  ...@BaseStyle,
  override: value
);

// COLORS
#RRGGBB
#RRGGBB(alpha)

// LOCALIZATION
%server.customUI.key.path
```

### Common Patterns

```
// Full-width element
Anchor: (Left: 0, Right: 0, Height: 50);

// Centered fixed-size
Anchor: (Width: 400, Height: 300);

// Fill parent
Anchor: (Full: 0);

// Flex item
FlexWeight: 1;

// Vertical list with gap
LayoutMode: Top;
Gap: 12;

// Horizontal centered buttons
LayoutMode: Center;
Gap: 16;

// Semi-transparent background
Background: #1a1a2e(0.95);
```

---

*This documentation was compiled from decompiled Hytale server code, the HytaleDocs IntelliJ plugin, and community examples.*
