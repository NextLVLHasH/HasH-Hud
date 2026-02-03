package com.nextlvlhash.system;

import com.hypixel.hytale.protocol.Transform;
import com.hypixel.hytale.protocol.Position;
import com.hypixel.hytale.protocol.Direction;
import com.hypixel.hytale.protocol.packets.worldmap.MapMarker;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.data.PlayerConfigData;
import com.hypixel.hytale.server.core.entity.entities.player.data.PlayerWorldData;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * System to integrate HudMod waypoints with Hytale's native map system.
 * Waypoints will appear on BOTH the custom minimap HUD AND the native M-key world map.
 */
public class MapIntegrationSystem {

    /**
     * Syncs all HudMod waypoints to Hytale's native world map.
     * Call this when waypoints change or when the player joins.
     */
    @SuppressWarnings("removal")
    public static void syncWaypointsToMap(@Nonnull Player player, @Nonnull WaypointStorage storage) {
        World world = player.getWorld();
        if (world == null) return;

        PlayerRef playerRef = player.getPlayerRef();
        UUID playerUuid = playerRef.getUuid();

        // Get all visible waypoints for this player
        List<Waypoint> waypoints = storage.getWaypointConfig(playerUuid).getVisibleWaypoints();

        // Convert HudMod waypoints to native map markers
        List<MapMarker> markers = new ArrayList<>();
        for (Waypoint wp : waypoints) {
            @SuppressWarnings("null")
            MapMarker marker = createMapMarker(wp);
            markers.add(marker);
        }

        // Store markers in PlayerWorldData - this makes them appear on the map!
        PlayerConfigData configData = player.getPlayerConfigData();
        PlayerWorldData worldData = configData.getPerWorldData(world.getName());
        worldData.setWorldMapMarkers(markers.toArray(new MapMarker[0]));

        System.out.println("[HudMod MapIntegration] Synced " + markers.size() + " waypoints to native map");
    }

    /**
     * Adds a single waypoint to the native map.
     */
    public static void addWaypointToMap(@Nonnull Player player, @Nonnull Waypoint waypoint) {
        World world = player.getWorld();
        if (world == null) return;

        PlayerConfigData configData = player.getPlayerConfigData();
        PlayerWorldData worldData = configData.getPerWorldData(world.getName());
        
        // Get existing markers
        MapMarker[] existing = worldData.getWorldMapMarkers();
        List<MapMarker> markerList = existing != null ? new ArrayList<>(Arrays.asList(existing)) : new ArrayList<>();
        
        // Add new marker
        markerList.add(createMapMarker(waypoint));
        
        // Update
        worldData.setWorldMapMarkers(markerList.toArray(new MapMarker[0]));
        
        System.out.println("[HudMod MapIntegration] Added marker to map: " + waypoint.getName());
    }

    /**
     * Removes a waypoint marker from the native map.
     */
    @SuppressWarnings("null")
    public static void removeWaypointFromMap(@Nonnull Player player, @Nonnull String waypointId) {
        World world = player.getWorld();
        if (world == null) return;

        PlayerConfigData configData = player.getPlayerConfigData();
        PlayerWorldData worldData = configData.getPerWorldData(world.getName());
        
        MapMarker[] existing = worldData.getWorldMapMarkers();
        if (existing == null) return;
        
        // Filter out the marker to remove
        List<MapMarker> markerList = new ArrayList<>();
        for (MapMarker marker : existing) {
            if (!marker.id.equals(waypointId)) {
                markerList.add(marker);
            }
        }
        
        worldData.setWorldMapMarkers(markerList.toArray(new MapMarker[0]));
        
        System.out.println("[HudMod MapIntegration] Removed marker from map: " + waypointId);
    }

    /**
     * Updates a waypoint marker on the native map.
     */
    @SuppressWarnings("null")
    public static void updateWaypointOnMap(@Nonnull Player player, @Nonnull Waypoint waypoint) {
        World world = player.getWorld();
        if (world == null) return;

        PlayerConfigData configData = player.getPlayerConfigData();
        PlayerWorldData worldData = configData.getPerWorldData(world.getName());
        
        MapMarker[] existing = worldData.getWorldMapMarkers();
        if (existing == null) return;
        
        // Find and update the marker
        List<MapMarker> markerList = new ArrayList<>();
        boolean updated = false;
        for (MapMarker marker : existing) {
            if (marker.id.equals(waypoint.getId())) {
                markerList.add(createMapMarker(waypoint));
                updated = true;
            } else {
                markerList.add(marker);
            }
        }
        
        if (updated) {
            worldData.setWorldMapMarkers(markerList.toArray(new MapMarker[0]));
            System.out.println("[HudMod MapIntegration] Updated marker on map: " + waypoint.getName());
        }
    }

    /**
     * Converts a HudMod Waypoint to a native MapMarker.
     */
    private static MapMarker createMapMarker(@Nonnull Waypoint waypoint) {
        // Create Position and Transform for marker location
        Position position = new Position(
            waypoint.getX() + 0.5,
            waypoint.getY() + 0.5,
            waypoint.getZ() + 0.5
        );
        // Create default direction (no rotation)
        Direction direction = new Direction(0.0f, 0.0f, 0.0f);
        Transform transform = new Transform(position, direction);
        
        // Create marker with ID, label, icon, transform, and no context menu
        return new MapMarker(
                waypoint.getId(),           // Unique marker ID
                waypoint.getName(),         // Label text
                waypoint.getIcon().getIconPath(), // Use waypoint icon path (waypoints/waywhite.png, etc.)
                transform,                  // Position
                null                        // No context menu items
        );
    }

    @SuppressWarnings("unused")
    private static String normalizeIcon(String icon) {
        // Fallback for null icons
        if (icon == null || icon.isEmpty()) {
            return "waypoints/waywhite.png";
        }
        return icon;
    }
}
