package com.nextlvlhash.waypoint;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.codec.codecs.array.ArrayCodec;
import com.hypixel.hytale.codec.function.FunctionCodec;
import com.nextlvlhash.hud.HudPosition;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Configuration for a player's waypoints.
 */
@SuppressWarnings({"deprecation"})
public class WaypointConfig {
    @SuppressWarnings("null")
    private static final Codec<List<Waypoint>> WAYPOINT_LIST_CODEC = new FunctionCodec<>(
        ArrayCodec.ofBuilderCodec(Waypoint.CODEC, Waypoint[]::new),
        waypoints -> waypoints == null ? new ArrayList<>() : new ArrayList<>(Arrays.asList(waypoints)),
        list -> list == null ? new Waypoint[0] : list.toArray(new Waypoint[0])
    );
    public static final BuilderCodec<WaypointConfig> CODEC;

    private String playerUuid;
    private List<Waypoint> waypoints;
    private int maxWaypoints;
    private boolean autoDeathWaypoint;
    private String hudPosition; // Stored as HudPosition enum name (e.g., "TOP_RIGHT")
    private int minimapZoom; // Zoom level for minimap (1-5)

    public WaypointConfig() {
        this.playerUuid = "";
        this.waypoints = new ArrayList<>();
        this.maxWaypoints = 50;
        this.autoDeathWaypoint = true;
        this.hudPosition = HudPosition.TOP_RIGHT.toStorageString();
        this.minimapZoom = 2; // Default zoom level
    }

    public WaypointConfig(@Nonnull String playerUuid) {
        this();
        this.playerUuid = playerUuid;
    }

    @Nonnull
    public String getPlayerUuid() {
        return playerUuid != null ? playerUuid : "";
    }

    public void setPlayerUuid(@Nonnull String playerUuid) {
        this.playerUuid = playerUuid;
    }

    @Nonnull
    public List<Waypoint> getWaypoints() {
        return waypoints != null ? waypoints : new ArrayList<>();
    }

    public void setWaypoints(@Nonnull List<Waypoint> waypoints) {
        this.waypoints = waypoints;
    }

    public int getMaxWaypoints() {
        return maxWaypoints;
    }

    public void setMaxWaypoints(int maxWaypoints) {
        this.maxWaypoints = maxWaypoints;
    }

    public boolean isAutoDeathWaypoint() {
        return autoDeathWaypoint;
    }

    public void setAutoDeathWaypoint(boolean autoDeathWaypoint) {
        this.autoDeathWaypoint = autoDeathWaypoint;
    }

    public int getMinimapZoom() {
        return minimapZoom > 0 ? minimapZoom : 2; // Default to 2 if not set
    }

    public void setMinimapZoom(int minimapZoom) {
        this.minimapZoom = Math.max(1, Math.min(5, minimapZoom)); // Clamp to 1-5
    }

    /**
     * Gets the raw HUD position string (for storage/codec).
     */
    @Nonnull
    public String getHudPositionString() {
        return hudPosition != null ? hudPosition : HudPosition.TOP_RIGHT.toStorageString();
    }

    /**
     * Gets the HUD position as an enum.
     */
    @Nonnull
    public HudPosition getHudPosition() {
        return HudPosition.fromString(getHudPositionString());
    }

    /**
     * Sets the HUD position from an enum.
     */
    public void setHudPosition(@Nonnull HudPosition position) {
        this.hudPosition = position.toStorageString();
    }

    /**
     * Sets the HUD position from a string (for backwards compatibility).
     */
    public void setHudPositionString(@Nonnull String hudPosition) {
        this.hudPosition = hudPosition;
    }

    /**
     * Checks if HUD is on the left side of the screen.
     */
    public boolean isHudOnLeft() {
        return getHudPosition().isLeftSide();
    }

    /**
     * Cycles to the next HUD position.
     */
    public void cycleHudPosition() {
        setHudPosition(getHudPosition().next());
    }

    /**
     * Adds a waypoint to the config.
     * @return true if added, false if max limit reached
     */
    public boolean addWaypoint(@Nonnull Waypoint waypoint) {
        if (getWaypoints().size() >= maxWaypoints) {
            return false;
        }
        getWaypoints().add(waypoint);
        return true;
    }

    /**
     * Removes a waypoint by ID.
     * @return true if removed, false if not found
     */
    public boolean removeWaypoint(@Nonnull String waypointId) {
        return getWaypoints().removeIf(wp -> wp.getId().equals(waypointId));
    }

    /**
     * Finds a waypoint by ID.
     */
    public Waypoint getWaypoint(@Nonnull String waypointId) {
        return getWaypoints().stream()
            .filter(wp -> wp.getId().equals(waypointId))
            .findFirst()
            .orElse(null);
    }

    /**
     * Gets all visible waypoints.
     */
    @SuppressWarnings("null")
    @Nonnull
    public List<Waypoint> getVisibleWaypoints() {
        return getWaypoints().stream()
            .filter(Waypoint::isVisible)
            .collect(Collectors.toList());
    }

    /**
     * Gets waypoints by category.
     */
    @SuppressWarnings("null")
    @Nonnull
    public List<Waypoint> getWaypointsByCategory(@Nonnull WaypointCategory category) {
        return getWaypoints().stream()
            .filter(wp -> wp.getCategory() == category)
            .collect(Collectors.toList());
    }

    static {
        CODEC = BuilderCodec.builder(WaypointConfig.class, WaypointConfig::new)
            .append(new KeyedCodec<>("PlayerUuid", Codec.STRING),
                    (o, i) -> o.playerUuid = i, (o) -> o.playerUuid).add()
            .append(new KeyedCodec<>("Waypoints", WAYPOINT_LIST_CODEC),
                    (o, i) -> o.waypoints = i, (o) -> o.waypoints).add()
            .append(new KeyedCodec<>("MaxWaypoints", Codec.INTEGER),
                    (o, i) -> o.maxWaypoints = i, (o) -> o.maxWaypoints).add()
            .append(new KeyedCodec<>("AutoDeathWaypoint", Codec.BOOLEAN),
                    (o, i) -> o.autoDeathWaypoint = i, (o) -> o.autoDeathWaypoint).add()
            .append(new KeyedCodec<>("HudPosition", Codec.STRING),
                    (o, i) -> o.hudPosition = i, (o) -> o.hudPosition).add()
            .append(new KeyedCodec<>("MinimapZoom", Codec.INTEGER),
                    (o, i) -> o.minimapZoom = i, (o) -> o.minimapZoom).add()
            .build();
    }
}
