---
id: kill-feed-event
title: KillFeedEvent
sidebar_label: KillFeedEvent
---

# KillFeedEvent

Une classe conteneur pour les evenements lies au fil de morts. Cette classe contient trois types d'evenements imbriques qui gerent differents aspects du systeme de fil de morts : l'affichage des messages de mort au defunt, l'affichage des messages de kill au tueur, et la diffusion de l'affichage du fil de morts aux joueurs.

## Informations sur l'evenement

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.entity.damage.event.KillFeedEvent` |
| **Classe parente** | `Object` |
| **Fichier source** | `decompiled/com/hypixel/hytale/server/core/modules/entity/damage/event/KillFeedEvent.java:13` |

## Classes d'evenements imbriquees

### KillFeedEvent.DecedentMessage

Declenche lors de la generation du message de mort pour l'entite qui est morte. Cet evenement permet la personnalisation du message affiche au joueur decede.

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.entity.damage.event.KillFeedEvent.DecedentMessage` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |

#### Declaration

```java
public static final class DecedentMessage extends CancellableEcsEvent {
   @Nonnull
   private final Damage damage;
   @Nullable
   private Message message = null;
```

#### Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `damage` | `Damage` | `getDamage()` | L'instance de degats qui a cause la mort |
| `message` | `Message` | `getMessage()` / `setMessage()` | Le message de mort personnalisable (nullable) |

#### Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getDamage` | `public Damage getDamage()` | Retourne les degats qui ont cause la mort |
| `getMessage` | `@Nullable public Message getMessage()` | Retourne le message de mort actuel |
| `setMessage` | `public void setMessage(@Nullable Message message)` | Definit un message de mort personnalise |

---

### KillFeedEvent.KillerMessage

Declenche lors de la generation du message de kill pour l'entite qui a effectue le kill. Cet evenement permet la personnalisation du message affiche au tueur.

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.entity.damage.event.KillFeedEvent.KillerMessage` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |

#### Declaration

```java
public static final class KillerMessage extends CancellableEcsEvent {
   @Nonnull
   private final Damage damage;
   @Nonnull
   private final Ref<EntityStore> targetRef;
   @Nullable
   private Message message = null;
```

#### Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `damage` | `Damage` | `getDamage()` | L'instance de degats qui a cause la mort |
| `targetRef` | `Ref<EntityStore>` | `getTargetRef()` | Reference vers l'entite qui a ete tuee |
| `message` | `Message` | `getMessage()` / `setMessage()` | Le message de kill personnalisable (nullable) |

#### Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getDamage` | `@Nonnull public Damage getDamage()` | Retourne les degats qui ont cause la mort |
| `getTargetRef` | `@Nonnull public Ref<EntityStore> getTargetRef()` | Retourne la reference vers l'entite tuee |
| `getMessage` | `@Nullable public Message getMessage()` | Retourne le message de kill actuel |
| `setMessage` | `public void setMessage(@Nullable Message message)` | Definit un message de kill personnalise |

---

### KillFeedEvent.Display

Declenche lorsque le fil de morts est sur le point d'etre affiche aux joueurs. Cet evenement permet la personnalisation de l'icone du fil de morts et le controle des joueurs qui recoivent la diffusion.

| Propriete | Valeur |
|-----------|--------|
| **Nom complet de la classe** | `com.hypixel.hytale.server.core.modules.entity.damage.event.KillFeedEvent.Display` |
| **Classe parente** | `CancellableEcsEvent` |
| **Annulable** | Oui |

#### Declaration

```java
public static final class Display extends CancellableEcsEvent {
   @Nonnull
   private final Damage damage;
   @Nullable
   private String icon;
   @Nonnull
   private final List<PlayerRef> broadcastTargets;
```

#### Champs

| Champ | Type | Accesseur | Description |
|-------|------|-----------|-------------|
| `damage` | `Damage` | `getDamage()` | L'instance de degats qui a cause la mort |
| `icon` | `String` | `getIcon()` / `setIcon()` | L'icone a afficher dans le fil de morts (nullable) |
| `broadcastTargets` | `List<PlayerRef>` | `getBroadcastTargets()` | Liste des joueurs qui verront le fil de morts |

#### Methodes

| Methode | Signature | Description |
|---------|-----------|-------------|
| `getDamage` | `@Nonnull public Damage getDamage()` | Retourne les degats qui ont cause la mort |
| `getIcon` | `@Nullable public String getIcon()` | Retourne l'icone du fil de morts |
| `setIcon` | `public void setIcon(@Nullable String icon)` | Definit une icone personnalisee pour le fil de morts |
| `getBroadcastTargets` | `@Nonnull public List<PlayerRef> getBroadcastTargets()` | Retourne la liste des joueurs a qui diffuser |

## Exemple d'utilisation

```java
// Personnaliser les messages de mort pour le joueur decede
eventBus.register(KillFeedEvent.DecedentMessage.class, event -> {
    Damage damage = event.getDamage();

    // Definir un message de mort personnalise
    if (damage.getType().equals("fire")) {
        event.setMessage(Message.of("Vous avez ete reduit en cendres !"));
    }
});

// Personnaliser les messages de kill pour le tueur
eventBus.register(KillFeedEvent.KillerMessage.class, event -> {
    Damage damage = event.getDamage();
    Ref<EntityStore> targetRef = event.getTargetRef();

    // Definir un message de kill personnalise
    event.setMessage(Message.of("Vous avez elimine votre cible !"));
});

// Controler l'affichage du fil de morts et personnaliser les icones
eventBus.register(KillFeedEvent.Display.class, event -> {
    Damage damage = event.getDamage();

    // Definir une icone personnalisee basee sur le type de degats
    if (damage.getType().equals("headshot")) {
        event.setIcon("icons/headshot");
    }

    // Modifier les cibles de diffusion
    List<PlayerRef> targets = event.getBroadcastTargets();
    // Retirer les spectateurs du fil de morts
    targets.removeIf(player -> player.isSpectator());

    // Ou annuler completement l'affichage du fil de morts
    if (shouldHideKillFeed()) {
        event.setCancelled(true);
    }
});

// Suivre les kills pour les statistiques
eventBus.register(KillFeedEvent.Display.class, event -> {
    Damage damage = event.getDamage();
    // Enregistrer les statistiques de kill
    statsTracker.recordKill(damage.getAttacker(), damage.getVictim());
});
```

## Cas d'utilisation courants

- Personnaliser les messages de mort et de kill selon le type de degats
- Ajouter des icones speciales pour des types de kills specifiques (headshots, combos, etc.)
- Filtrer la visibilite du fil de morts pour des joueurs specifiques
- Implementer un fil de morts base sur les equipes (afficher les kills uniquement aux coequipiers)
- Suivre les statistiques de kills et les classements
- Creer des series de kills et des annonces personnalisees
- Masquer le fil de morts dans certains modes de jeu
- Ajouter des messages de mort localises ou thematiques

## Evenements lies

- [EntityRemoveEvent](../entity/entity-remove-event) - Declenche lorsqu'une entite est supprimee du monde
- [PlayerDisconnectEvent](../player/player-disconnect-event) - Declenche lorsqu'un joueur se deconnecte

## Reference source

`decompiled/com/hypixel/hytale/server/core/modules/entity/damage/event/KillFeedEvent.java:13`
