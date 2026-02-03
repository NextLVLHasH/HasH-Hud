package com.nextlvlhash.storage;

import com.hypixel.hytale.codec.ExtraInfo;
import com.hypixel.hytale.codec.util.RawJsonReader;
import com.hypixel.hytale.logger.HytaleLogger;
import com.hypixel.hytale.server.core.util.BsonUtil;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointConfig;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages waypoint data persistence for all players.
 */
public class WaypointStorage {
    private static final HytaleLogger LOGGER = HytaleLogger.forEnclosingClass();

    private final Path waypointsDirectory;
    private final Path globalWaypointsDirectory;
    private final ConcurrentHashMap<UUID, WaypointConfig> configCache;
    private WaypointConfig globalWaypoints;

    public WaypointStorage(@Nonnull Path dataDirectory) {
        this.waypointsDirectory = dataDirectory.resolve("waypoints");
        this.globalWaypointsDirectory = dataDirectory.resolve("global-waypoints");
        this.configCache = new ConcurrentHashMap<>();
        this.globalWaypoints = null;
    }

    /**
     * Initializes storage directories.
     */
    public void init() {
        try {
            Files.createDirectories(waypointsDirectory);
            Files.createDirectories(globalWaypointsDirectory);
            LOGGER.atInfo().log("WaypointStorage initialized at: %s", waypointsDirectory);

            // Load global waypoints
            loadGlobalWaypoints();
        } catch (IOException e) {
            LOGGER.atSevere().log("Failed to create waypoints directory: %s", e.getMessage());
        }
    }

    /**
     * Gets waypoint config for a player (from cache or disk).
     */
    @SuppressWarnings("null")
    @Nonnull
    public WaypointConfig getWaypointConfig(@Nonnull UUID playerUuid) {
        WaypointConfig cached = configCache.get(playerUuid);
        if (cached != null) {
            return cached;
        }

        Path configFile = waypointsDirectory.resolve(playerUuid.toString() + ".json");
        WaypointConfig config;

        if (Files.exists(configFile)) {
            try {
                config = RawJsonReader.readSync(configFile, WaypointConfig.CODEC, LOGGER);
                if (config == null) {
                    LOGGER.atWarning().log("Failed to read waypoint config for %s, creating new", playerUuid);
                    config = new WaypointConfig(playerUuid.toString());
                }
            } catch (Exception e) {
                LOGGER.atSevere().log("Error loading waypoint config for %s: %s", playerUuid, e.getMessage());
                config = new WaypointConfig(playerUuid.toString());
            }
        } else {
            config = new WaypointConfig(playerUuid.toString());
        }

        configCache.put(playerUuid, config);
        return config;
    }

    /**
     * Saves waypoint config for a player (async).
     */
    @SuppressWarnings("null")
    @Nonnull
    public CompletableFuture<Void> saveWaypointConfig(@Nonnull UUID playerUuid, @Nonnull WaypointConfig config) {
        configCache.put(playerUuid, config);
        Path configFile = waypointsDirectory.resolve(playerUuid.toString() + ".json");

        return BsonUtil.writeDocument(configFile, WaypointConfig.CODEC.encode(config, new ExtraInfo()))
            .whenComplete((result, throwable) -> {
                if (throwable != null) {
                    LOGGER.atSevere().log("Failed to save waypoint config for %s: %s", playerUuid, throwable.getMessage());
                }
            });
    }

    /**
     * Adds a waypoint for a player.
     */
    @SuppressWarnings("null")
    @Nonnull
    public CompletableFuture<Boolean> addWaypoint(@Nonnull UUID playerUuid, @Nonnull Waypoint waypoint) {
        WaypointConfig config = getWaypointConfig(playerUuid);
        boolean added = config.addWaypoint(waypoint);
        if (added) {
            return saveWaypointConfig(playerUuid, config).thenApply(v -> true);
        }
        return CompletableFuture.completedFuture(false);
    }

    /**
     * Removes a waypoint for a player.
     */
    @SuppressWarnings("null")
    @Nonnull
    public CompletableFuture<Boolean> removeWaypoint(@Nonnull UUID playerUuid, @Nonnull String waypointId) {
        WaypointConfig config = getWaypointConfig(playerUuid);
        boolean removed = config.removeWaypoint(waypointId);
        if (removed) {
            return saveWaypointConfig(playerUuid, config).thenApply(v -> true);
        }
        return CompletableFuture.completedFuture(false);
    }

    /**
     * Updates a waypoint for a player.
     */
    @Nonnull
    public CompletableFuture<Void> updateWaypoint(@Nonnull UUID playerUuid, @Nonnull Waypoint waypoint) {
        WaypointConfig config = getWaypointConfig(playerUuid);
        // Remove old and add updated
        config.removeWaypoint(waypoint.getId());
        config.addWaypoint(waypoint);
        return saveWaypointConfig(playerUuid, config);
    }

    /**
     * Gets a specific waypoint for a player.
     */
    @Nullable
    public Waypoint getWaypoint(@Nonnull UUID playerUuid, @Nonnull String waypointId) {
        WaypointConfig config = getWaypointConfig(playerUuid);
        return config.getWaypoint(waypointId);
    }

    /**
     * Clears cache for a player (called on disconnect).
     */
    public void clearCache(@Nonnull UUID playerUuid) {
        configCache.remove(playerUuid);
    }

    /**
     * Loads global waypoints from disk.
     */
    @SuppressWarnings("null")
    private void loadGlobalWaypoints() {
        Path globalFile = globalWaypointsDirectory.resolve("global.json");

        if (Files.exists(globalFile)) {
            try {
                globalWaypoints = RawJsonReader.readSync(globalFile, WaypointConfig.CODEC, LOGGER);
                if (globalWaypoints == null) {
                    LOGGER.atWarning().log("Failed to read global waypoints, creating new");
                    globalWaypoints = new WaypointConfig("global");
                }
            } catch (Exception e) {
                LOGGER.atSevere().log("Error loading global waypoints: %s", e.getMessage());
                globalWaypoints = new WaypointConfig("global");
            }
        } else {
            globalWaypoints = new WaypointConfig("global");
        }
    }

    /**
     * Gets global waypoints visible to all players.
     */
    @SuppressWarnings("null")
    @Nonnull
    public WaypointConfig getGlobalWaypoints() {
        if (globalWaypoints == null) {
            loadGlobalWaypoints();
        }
        return globalWaypoints;
    }

    /**
     * Adds a global waypoint.
     */
    @SuppressWarnings("null")
    @Nonnull
    public CompletableFuture<Boolean> addGlobalWaypoint(@Nonnull Waypoint waypoint) {
        waypoint.setGlobal(true);
        WaypointConfig config = getGlobalWaypoints();
        boolean added = config.addWaypoint(waypoint);
        if (added) {
            return saveGlobalWaypoints().thenApply(v -> true);
        }
        return CompletableFuture.completedFuture(false);
    }

    /**
     * Removes a global waypoint.
     */
    @SuppressWarnings("null")
    @Nonnull
    public CompletableFuture<Boolean> removeGlobalWaypoint(@Nonnull String waypointId) {
        WaypointConfig config = getGlobalWaypoints();
        boolean removed = config.removeWaypoint(waypointId);
        if (removed) {
            return saveGlobalWaypoints().thenApply(v -> true);
        }
        return CompletableFuture.completedFuture(false);
    }

    /**
     * Saves global waypoints to disk.
     */
    @SuppressWarnings("null")
    @Nonnull
    private CompletableFuture<Void> saveGlobalWaypoints() {
        Path globalFile = globalWaypointsDirectory.resolve("global.json");

        return BsonUtil.writeDocument(globalFile, WaypointConfig.CODEC.encode(globalWaypoints, new ExtraInfo()))
            .whenComplete((result, throwable) -> {
                if (throwable != null) {
                    LOGGER.atSevere().log("Failed to save global waypoints: %s", throwable.getMessage());
                }
            });
    }
}
