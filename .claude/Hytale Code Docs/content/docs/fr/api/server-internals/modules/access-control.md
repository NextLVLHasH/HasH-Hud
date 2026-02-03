---
id: access-control
title: Systeme de Controle d'Acces
sidebar_label: Controle d'Acces
sidebar_position: 7
description: Documentation complete du systeme de controle d'acces Hytale pour les bannissements, listes blanches et fournisseurs d'acces personnalises
---

# Systeme de Controle d'Acces

Le systeme de Controle d'Acces dans Hytale fournit une maniere complete de gerer l'acces au serveur via les bannissements, les listes blanches et les fournisseurs d'acces personnalises. Ce module est essentiel pour les administrateurs de serveur pour controler qui peut rejoindre leurs serveurs.

## Apercu

L'`AccessControlModule` est un plugin principal qui gere l'acces des joueurs au serveur. Il fournit :

- **Systeme de Bannissement** - Bannissements temporaires et permanents des joueurs
- **Systeme de Liste Blanche** - Restreindre l'acces au serveur aux joueurs approuves uniquement
- **Fournisseurs Personnalises** - Interface extensible pour une logique de controle d'acces personnalisee

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.AccessControlModule`

## Architecture du Module

```java
public class AccessControlModule extends JavaPlugin {
    public static final PluginManifest MANIFEST = PluginManifest.corePlugin(AccessControlModule.class).build();

    private final HytaleWhitelistProvider whitelistProvider = new HytaleWhitelistProvider();
    private final HytaleBanProvider banProvider = new HytaleBanProvider();
    private final List<AccessProvider> providerRegistry = new CopyOnWriteArrayList<>();
    private final Map<String, BanParser> parsers = new ConcurrentHashMap<>();

    public static AccessControlModule get() {
        return instance;
    }
}
```

## Interface AccessProvider

Tous les fournisseurs de controle d'acces implementent l'interface `AccessProvider` :

```java
public interface AccessProvider {
    @Nonnull
    CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid);
}
```

La methode retourne :
- `Optional.empty()` - Le joueur est autorise a se connecter
- `Optional.of(message)` - Le joueur est refuse avec le message donne

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.AccessProvider`

## Systeme de Bannissement

### Interface Ban

L'interface `Ban` definit la structure pour tous les types de bannissements :

```java
public interface Ban extends AccessProvider {
    UUID getTarget();           // UUID du joueur banni
    UUID getBy();               // UUID de l'administrateur qui a banni
    Instant getTimestamp();     // Quand le bannissement a ete emis
    boolean isInEffect();       // Si le bannissement est actuellement actif
    Optional<String> getReason(); // Raison du bannissement (optionnel)
    String getType();           // Identifiant du type de bannissement
    JsonObject toJsonObject();  // Serialiser en JSON
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.Ban`

### Types de Bannissement

#### Bannissement Infini (Permanent)

Les bannissements permanents n'expirent jamais :

```java
public class InfiniteBan extends AbstractBan {
    public InfiniteBan(UUID target, UUID by, Instant timestamp, String reason) {
        super(target, by, timestamp, reason);
    }

    @Override
    public boolean isInEffect() {
        return true;  // Toujours actif
    }

    @Override
    public String getType() {
        return "infinite";
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        StringBuilder message = new StringBuilder("You are permanently banned!");
        this.reason.ifPresent(s -> message.append(" Reason: ").append(s));
        return CompletableFuture.completedFuture(Optional.of(message.toString()));
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.InfiniteBan`

#### Bannissement Temporaire

Les bannissements temporaires expirent apres une duree definie :

```java
public class TimedBan extends AbstractBan {
    private final Instant expiresOn;

    public TimedBan(UUID target, UUID by, Instant timestamp, Instant expiresOn, String reason) {
        super(target, by, timestamp, reason);
        this.expiresOn = expiresOn;
    }

    @Override
    public boolean isInEffect() {
        return this.expiresOn.isAfter(Instant.now());
    }

    @Override
    public String getType() {
        return "timed";
    }

    public Instant getExpiresOn() {
        return this.expiresOn;
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        Duration timeRemaining = Duration.between(Instant.now(), this.expiresOn);
        StringBuilder message = new StringBuilder("You are temporarily banned for ")
            .append(StringUtil.humanizeTime(timeRemaining))
            .append('!');
        this.reason.ifPresent(s -> message.append(" Reason: ").append(s));
        return CompletableFuture.completedFuture(Optional.of(message.toString()));
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.TimedBan`

### HytaleBanProvider

Le fournisseur de bannissements par defaut gere les bannissements stockes dans `bans.json` :

```java
public class HytaleBanProvider extends BlockingDiskFile implements AccessProvider {
    private final Map<UUID, Ban> bans = new Object2ObjectOpenHashMap<>();

    public HytaleBanProvider() {
        super(Paths.get("bans.json"));
    }

    public boolean hasBan(UUID uuid) {
        this.fileLock.readLock().lock();
        try {
            return this.bans.containsKey(uuid);
        } finally {
            this.fileLock.readLock().unlock();
        }
    }

    public boolean modify(@Nonnull Function<Map<UUID, Ban>, Boolean> function) {
        this.fileLock.writeLock().lock();
        boolean modified;
        try {
            modified = function.apply(this.bans);
        } finally {
            this.fileLock.writeLock().unlock();
        }
        if (modified) {
            this.syncSave();
        }
        return modified;
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleBanProvider`

### Analyseur de Bannissement Personnalise

Vous pouvez enregistrer des types de bannissements personnalises en utilisant l'interface `BanParser` :

```java
@FunctionalInterface
public interface BanParser {
    Ban parse(JsonObject object) throws JsonParseException;
}
```

Enregistrer un analyseur de bannissement personnalise :

```java
AccessControlModule.get().registerBanParser("monBanPersonnalise", MonBanPersonnalise::fromJsonObject);
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.ban.BanParser`

## Systeme de Liste Blanche

### HytaleWhitelistProvider

Le fournisseur de liste blanche gere les joueurs autorises dans `whitelist.json` :

```java
public class HytaleWhitelistProvider extends BlockingDiskFile implements AccessProvider {
    private final Set<UUID> whitelist = new HashSet<>();
    private boolean isEnabled;

    public HytaleWhitelistProvider() {
        super(Paths.get("whitelist.json"));
    }

    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        this.lock.readLock().lock();
        try {
            if (!this.isEnabled || this.whitelist.contains(uuid)) {
                return CompletableFuture.completedFuture(Optional.empty());
            }
            return CompletableFuture.completedFuture(Optional.of("You are not whitelisted!"));
        } finally {
            this.lock.readLock().unlock();
        }
    }

    public void setEnabled(boolean isEnabled) {
        this.lock.writeLock().lock();
        try {
            this.isEnabled = isEnabled;
        } finally {
            this.lock.writeLock().unlock();
        }
    }

    public boolean isEnabled() { ... }

    public Set<UUID> getList() {
        this.lock.readLock().lock();
        try {
            return Collections.unmodifiableSet(this.whitelist);
        } finally {
            this.lock.readLock().unlock();
        }
    }

    public boolean modify(@Nonnull Function<Set<UUID>, Boolean> consumer) {
        this.lock.writeLock().lock();
        boolean result;
        try {
            result = consumer.apply(this.whitelist);
        } finally {
            this.lock.writeLock().unlock();
        }
        if (result) {
            this.syncSave();
        }
        return result;
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleWhitelistProvider`

### Format du Fichier Liste Blanche

La structure du fichier `whitelist.json` :

```json
{
    "enabled": false,
    "list": [
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
    ]
}
```

## Enregistrement de Fournisseurs d'Acces Personnalises

Vous pouvez ajouter des fournisseurs d'acces personnalises pour etendre le systeme :

```java
public class MonFournisseurPersonnalise implements AccessProvider {
    @Override
    public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
        // Logique d'acces personnalisee ici
        if (estJoueurBanni(uuid)) {
            return CompletableFuture.completedFuture(
                Optional.of("Vous avez ete banni par le fournisseur personnalise!")
            );
        }
        return CompletableFuture.completedFuture(Optional.empty());
    }
}

// Enregistrer le fournisseur
AccessControlModule.get().registerAccessProvider(new MonFournisseurPersonnalise());
```

## Commandes Console

### Commandes de Bannissement

| Commande | Description |
|----------|-------------|
| `/ban <nom_utilisateur> [raison]` | Bannir un joueur de facon permanente |
| `/unban <nom_utilisateur>` | Supprimer le bannissement d'un joueur |

**Details de la Commande Ban :**

```java
public class BanCommand extends AbstractAsyncCommand {
    private final RequiredArg<String> usernameArg =
        this.withRequiredArg("username", "server.commands.ban.username.desc", ArgTypes.STRING);
    private final OptionalArg<String> reasonArg =
        this.withOptionalArg("reason", "server.commands.ban.reason.desc", ArgTypes.STRING);

    public BanCommand(@Nonnull HytaleBanProvider banProvider) {
        super("ban", "server.commands.ban.desc");
        this.setUnavailableInSingleplayer(true);
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.commands.BanCommand`

### Commandes de Liste Blanche

| Commande | Description | Alias |
|----------|-------------|-------|
| `/whitelist add <nom_utilisateur>` | Ajouter un joueur a la liste blanche | - |
| `/whitelist remove <nom_utilisateur>` | Retirer un joueur de la liste blanche | - |
| `/whitelist enable` | Activer la liste blanche | `on` |
| `/whitelist disable` | Desactiver la liste blanche | `off` |
| `/whitelist status` | Afficher le statut actif/inactif de la liste blanche | - |
| `/whitelist list` | Lister les joueurs en liste blanche (jusqu'a 10) | - |
| `/whitelist clear` | Retirer tous les joueurs de la liste blanche | - |

**Structure de la Commande Whitelist :**

```java
public class WhitelistCommand extends AbstractCommandCollection {
    public WhitelistCommand(@Nonnull HytaleWhitelistProvider whitelistProvider) {
        super("whitelist", "server.commands.whitelist.desc");
        this.addSubCommand(new WhitelistAddCommand(whitelistProvider));
        this.addSubCommand(new WhitelistRemoveCommand(whitelistProvider));
        this.addSubCommand(new WhitelistEnableCommand(whitelistProvider));
        this.addSubCommand(new WhitelistDisableCommand(whitelistProvider));
        this.addSubCommand(new WhitelistClearCommand(whitelistProvider));
        this.addSubCommand(new WhitelistStatusCommand(whitelistProvider));
        this.addSubCommand(new WhitelistListCommand(whitelistProvider));
    }
}
```

**Source :** `com.hypixel.hytale.server.core.modules.accesscontrol.commands.WhitelistCommand`

## Exemple de Plugin

Voici un exemple complet d'un plugin qui implemente un controle d'acces personnalise :

```java
public class PluginControleAccesPersonnalise extends JavaPlugin {

    private final Set<UUID> joueursVip = ConcurrentHashMap.newKeySet();

    public PluginControleAccesPersonnalise(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Enregistrer un fournisseur d'acces personnalise pour le mode VIP uniquement
        AccessControlModule.get().registerAccessProvider(new FournisseurVipUniquement());

        // Enregistrer un type de bannissement personnalise
        AccessControlModule.get().registerBanParser("avertissement", BanAvertissement::fromJsonObject);
    }

    // Fournisseur d'acces personnalise pour le mode VIP uniquement
    private class FournisseurVipUniquement implements AccessProvider {
        private boolean modeVipUniquement = false;

        @Override
        public CompletableFuture<Optional<String>> getDisconnectReason(UUID uuid) {
            if (modeVipUniquement && !joueursVip.contains(uuid)) {
                return CompletableFuture.completedFuture(
                    Optional.of("Le serveur est actuellement en mode VIP uniquement!")
                );
            }
            return CompletableFuture.completedFuture(Optional.empty());
        }

        public void setModeVipUniquement(boolean active) {
            this.modeVipUniquement = active;
        }
    }

    // Bannir un joueur programmatiquement
    public void bannirJoueur(UUID cible, UUID bannisseurUuid, String raison) {
        AccessControlModule module = AccessControlModule.get();
        InfiniteBan ban = new InfiniteBan(cible, bannisseurUuid, Instant.now(), raison);

        // Obtenir le fournisseur de ban et ajouter le bannissement
        // Note: Vous devriez acceder au fournisseur via reflection
        // ou utiliser la commande ban
    }

    // Verifier si un joueur est banni
    public boolean estJoueurBanni(UUID uuid) {
        // L'implementation verifierait le fournisseur de ban
        return false;
    }
}
```

## Stockage des Donnees

### Format bans.json

Les bannissements sont stockes sous forme de tableau JSON :

```json
[
    {
        "type": "infinite",
        "target": "550e8400-e29b-41d4-a716-446655440000",
        "by": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "timestamp": 1704067200000,
        "reason": "Triche"
    },
    {
        "type": "timed",
        "target": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "by": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "timestamp": 1704067200000,
        "expiresOn": 1704153600000,
        "reason": "Spam"
    }
]
```

### Serialisation JSON AbstractBan

```java
public JsonObject toJsonObject() {
    JsonObject object = new JsonObject();
    object.addProperty("type", this.getType());
    object.addProperty("target", this.target.toString());
    object.addProperty("by", this.by.toString());
    object.addProperty("timestamp", this.timestamp.toEpochMilli());
    this.reason.ifPresent(s -> object.addProperty("reason", s));
    return object;
}
```

## Flux de Connexion

Lorsqu'un joueur tente de se connecter, l'`AccessControlModule` traite la connexion :

```java
this.getEventRegistry().register(PlayerSetupConnectEvent.class, event -> {
    CompletableFuture<Optional<String>> completableFuture =
        this.getDisconnectReason(event.getUuid());
    Optional<String> disconnectReason = completableFuture.join();
    if (disconnectReason.isPresent()) {
        event.setReason(disconnectReason.get());
        event.setCancelled(true);
    }
});
```

Le systeme verifie tous les fournisseurs enregistres dans l'ordre. Si un fournisseur retourne une raison de deconnexion, la connexion est rejetee.

## Securite des Threads

Les deux fournisseurs utilisent `ReadWriteLock` pour un acces thread-safe :

- **Operations de lecture** - Plusieurs threads peuvent lire simultanement
- **Operations d'ecriture** - Acces exclusif pour les modifications
- **Sauvegarde automatique** - Les modifications sont automatiquement persistees apres les modifications

## Fichiers Sources

| Classe | Chemin |
|--------|--------|
| `AccessControlModule` | `com.hypixel.hytale.server.core.modules.accesscontrol.AccessControlModule` |
| `AccessProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.AccessProvider` |
| `HytaleBanProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleBanProvider` |
| `HytaleWhitelistProvider` | `com.hypixel.hytale.server.core.modules.accesscontrol.provider.HytaleWhitelistProvider` |
| `Ban` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.Ban` |
| `AbstractBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.AbstractBan` |
| `InfiniteBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.InfiniteBan` |
| `TimedBan` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.TimedBan` |
| `BanParser` | `com.hypixel.hytale.server.core.modules.accesscontrol.ban.BanParser` |
| `BanCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.BanCommand` |
| `UnbanCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.UnbanCommand` |
| `WhitelistCommand` | `com.hypixel.hytale.server.core.modules.accesscontrol.commands.WhitelistCommand` |
