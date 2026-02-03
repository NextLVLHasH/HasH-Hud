package com.nextlvlhash.hud;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.math.vector.Vector3f;
import com.hypixel.hytale.protocol.packets.worldmap.MapImage;
import com.hypixel.hytale.server.core.modules.entity.component.HeadRotation;
import com.hypixel.hytale.server.core.modules.entity.component.TransformComponent;
import com.hypixel.hytale.server.core.ui.Anchor;
import com.hypixel.hytale.server.core.ui.Value;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.hypixel.hytale.server.core.universe.world.worldmap.WorldMapManager;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointEffects;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Manages minimap rendering logic.
 * Uses pre-computed visibility masks and color caching for performance.
 */
public class MinimapHud {

    private static final int GRID_SIZE = 25;
    private static final int HALF_GRID = GRID_SIZE / 2;
    private static final double GRID_CENTER = GRID_SIZE / 2.0;
    private static final double GRID_RADIUS = GRID_CENTER + 2.0;  // Expanded to show more of the square grid
    private static final double GRID_RADIUS_SQ = GRID_RADIUS * GRID_RADIUS;
    private int minimapZoom = 2;  // Configurable zoom level (1-5)
    private static final long MIN_UPDATE_MS = 500L;  // Faster updates (was 1000ms)
    private static final int DEFAULT_COLOR_INT = 0x52; // 9-bit: (1<<6)|(2<<3)|2 = dark green
    private static final String DEFAULT_COLOR = "#244924"; // 6-digit hex for UI compatibility
    private static final String PLAYER_MARKER_COLOR = "#ffffff";
    private static final int PLAYER_MARKER_COLOR_INT = 0x1ff; // 9-bit white (7,7,7)
    
    // Arrow patterns for 8 directions (N, NE, E, SE, S, SW, W, NW)
    // Each pattern draws 3 dots in a triangular shape pointing in that direction
    // Format: {dx, dy} offsets from center (0,0)
    // Note: -Y is up on minimap, +Y is down
    private static final int[][][] ARROW_PATTERNS = {
        // North (0) - tip up, base down
        //    *
        //   * *
        {{0, -1}, {-1, 1}, {1, 1}},
        // Northeast (1) - tip up-right
        //      *
        //    * *
        {{1, -1}, {-1, 0}, {-1, 1}},
        // East (2) - tip right, base left
        //   *
        //   * *
        {{1, 0}, {-1, -1}, {-1, 1}},
        // Southeast (3) - tip down-right
        //    * *
        //      *
        {{1, 1}, {-1, -1}, {-1, 0}},
        // South (4) - tip down, base up
        //   * *
        //    *
        {{0, 1}, {-1, -1}, {1, -1}},
        // Southwest (5) - tip down-left
        //   * *
        //   *
        {{-1, 1}, {1, -1}, {1, 0}},
        // West (6) - tip left, base right
        //   * *
        //     *
        {{-1, 0}, {1, -1}, {1, 1}},
        // Northwest (7) - tip up-left
        //   *
        //   * *
        {{-1, -1}, {1, 0}, {1, 1}}
    };
    private static final int COMPASS_RING_CENTER_X = 131;
    private static final int COMPASS_RING_CENTER_Y = 126;
    private static final int COMPASS_RING_RADIUS = 111;
    private static final int COMPASS_MARKER_SIZE = 6;
    private static final int MAX_COMPASS_MARKERS = 6;
    private static final long WAYPOINT_EFFECT_INTERVAL_MS = 2000L;
    private static final int MAX_EFFECT_WAYPOINTS = 3;
    private static final double WAYPOINT_EFFECT_RADIUS = 192.0;

    // Minimap container dimensions
    private static final int MINIMAP_WIDTH = 256;
    private static final int MINIMAP_HEIGHT = 296;
    private static final int EDGE_MARGIN = 20; // Distance from screen edge

    // Pre-computed visibility mask and pixel IDs
    private static final boolean[] VISIBLE_MASK = new boolean[GRID_SIZE * GRID_SIZE];
    
    // Cached rotation values
    private float lastYaw = Float.NaN;
    private double cachedCos = 0.0;
    private double cachedSin = 0.0;

    public int getMinimapZoom() {
        return minimapZoom;
    }

    public void setMinimapZoom(int zoom) {
        this.minimapZoom = Math.max(1, Math.min(5, zoom)); // Clamp to 1-5
    }
    private static final String[] PIXEL_SELECTORS = new String[GRID_SIZE * GRID_SIZE];
    private static final int VISIBLE_PIXEL_COUNT;
    private static final int[] VISIBLE_INDICES;
    static {
        int count = 0;
        for (int gridY = 0; gridY < GRID_SIZE; gridY++) {
            for (int gridX = 0; gridX < GRID_SIZE; gridX++) {
                double dx = Math.abs((gridX + 0.5) - GRID_CENTER) - 3;  // Expanded by 2 pixels to fill frame
                double dy = Math.abs((gridY + 0.5) - GRID_CENTER) - 3;  // Expanded by 2 pixels to fill frame
                if (dx < 0) dx = 0;
                if (dy < 0) dy = 0;

                int index = gridY * GRID_SIZE + gridX;
                boolean visible = dx * dx + dy * dy <= GRID_RADIUS_SQ;
                VISIBLE_MASK[index] = visible;

                if (visible) {
                    count++;
                    PIXEL_SELECTORS[index] = "#MinimapContainer #MapGrid #P" +
                        toBase36Pair(gridX) + toBase36Pair(gridY) + ".Background";
                }
            }
        }
        VISIBLE_PIXEL_COUNT = count;
        VISIBLE_INDICES = new int[count];
        int i = 0;
        for (int idx = 0; idx < GRID_SIZE * GRID_SIZE; idx++) {
            if (VISIBLE_MASK[idx]) {
                VISIBLE_INDICES[i++] = idx;
            }
        }
    }

    private final int[] lastColorInts = new int[GRID_SIZE * GRID_SIZE];
    private final String[] colorPalette = new String[512]; // 9-bit colors (8 levels per channel)
    private final WaypointStorage waypointStorage;
    private final java.util.UUID playerUuid;
    private final int[] lastCompassX = new int[MAX_COMPASS_MARKERS];
    private final int[] lastCompassY = new int[MAX_COMPASS_MARKERS];
    private final boolean[] lastCompassVisible = new boolean[MAX_COMPASS_MARKERS];
    private final String[] lastCompassColor = new String[MAX_COMPASS_MARKERS];

    private int lastBlockX = Integer.MIN_VALUE;
    private int lastBlockZ = Integer.MIN_VALUE;
    private long lastUpdateMillis = 0L;
    private int lastDay = -1;
    private int lastCoordX = Integer.MIN_VALUE;
    private int lastCoordY = Integer.MIN_VALUE;
    private int lastCoordZ = Integer.MIN_VALUE;
    private long lastEffectMillis = 0L;
    private int lastArrowDirection = -1; // Track arrow direction (0-7)
    private float lastYawDegrees = 0f; // Track player yaw for map rotation
    private java.util.Set<Integer> lastArrowIndices = new java.util.HashSet<>(); // Track previous arrow pixels

    public MinimapHud(@Nullable WaypointStorage waypointStorage, @Nullable java.util.UUID playerUuid) {
        Arrays.fill(lastColorInts, -1);
        Arrays.fill(lastCompassX, Integer.MIN_VALUE);
        Arrays.fill(lastCompassY, Integer.MIN_VALUE);
        Arrays.fill(lastCompassVisible, false);
        Arrays.fill(lastCompassColor, null);
        this.waypointStorage = waypointStorage;
        this.playerUuid = playerUuid;
        
        // Load zoom level from player config
        if (waypointStorage != null && playerUuid != null) {
            this.minimapZoom = waypointStorage.getWaypointConfig(playerUuid).getMinimapZoom();
        }
    }
@SuppressWarnings("null")
    public void build(@Nonnull UICommandBuilder builder) {
        HudPosition position = getHudPosition();
        
        // For left-side positions, use the left UI file
        // For right-side positions, use the right UI file
        // For center positions, use right UI file and override anchor
        if (position.isLeftSide()) {
            builder.append("hudisplay/minimap_left.ui");
        } else {
            builder.append("hudisplay/minimap_right.ui");
        }
        
        // For non-standard positions (center column or middle row), override the anchor
        if (position.isHorizontalCenter() || position.isVerticalCenter() || position.isBottom()) {
            Anchor containerAnchor = buildPositionAnchor(position);
            builder.setObject("#MinimapContainer.Anchor", containerAnchor);
        }
    }

    /**
     * Gets the current HUD position from player settings.
     * @return the configured HudPosition, or TOP_RIGHT as default
     */
    @Nonnull
    public HudPosition getHudPosition() {
        if (waypointStorage != null && playerUuid != null) {
            return waypointStorage.getWaypointConfig(playerUuid).getHudPosition();
        }
        return HudPosition.TOP_RIGHT; // Default
    }

    /**
     * Checks if the HUD should be on the left side based on player settings.
     * @return true if HUD should be on left side, false for right side or center
     */
    public boolean isHudOnLeft() {
        return getHudPosition().isLeftSide();
    }

    /**
     * Builds an anchor for the minimap container based on HudPosition.
     * Positions the minimap at one of 9 screen locations.
     * <pre>
     * 1 (TOP_LEFT)      2 (TOP_CENTER)      3 (TOP_RIGHT)
     * 4 (MIDDLE_LEFT)   5 (MIDDLE_CENTER)   6 (MIDDLE_RIGHT)
     * 7 (BOTTOM_LEFT)   8 (BOTTOM_CENTER)   9 (BOTTOM_RIGHT)
     * </pre>
     * 
     * For centered positions, we set both left and right (or top and bottom) to equal values,
     * which causes the UI system to center the element.
     */
    private static Anchor buildPositionAnchor(@Nonnull HudPosition position) {
        Anchor anchor = new Anchor();
        anchor.setWidth(Value.of(MINIMAP_WIDTH));
        anchor.setHeight(Value.of(MINIMAP_HEIGHT));

        // Horizontal positioning
        if (position.isLeftSide()) {
            anchor.setLeft(Value.of(EDGE_MARGIN));
        } else if (position.isRightSide()) {
            anchor.setRight(Value.of(EDGE_MARGIN));
        } else {
            // Horizontally centered - set equal left and right margins
            // This causes the UI system to center the fixed-width element
            anchor.setLeft(Value.of(-1)); // Use -1 as a sentinel for "center"
            anchor.setRight(Value.of(-1));
        }

        // Vertical positioning  
        if (position.isTop()) {
            anchor.setTop(Value.of(EDGE_MARGIN + 90)); // Account for game UI elements
        } else if (position.isBottom()) {
            anchor.setBottom(Value.of(EDGE_MARGIN + 90)); // Account for hotbar
        } else {
            // Vertically centered - set equal top and bottom margins
            anchor.setTop(Value.of(-1));
            anchor.setBottom(Value.of(-1));
        }

        return anchor;
    }

    /**
     * Applies date text update if the day has changed.
     * @return true if date was updated
     */
    public boolean applyDate(@Nonnull UICommandBuilder builder, @Nonnull LocalDateTime dateTime) {
        int day = dateTime.toLocalDate().getDayOfYear();
        if (day == lastDay) {
            return false;
        }
        lastDay = day;
        builder.set("#MinimapDate.Text", "Day " + day);
        return true;
    }

    /**
     * Updates minimap pixels and coordinates.
     * Adds changes to the provided UICommandBuilder.
     * @return true if any changes were made
     */
    public boolean updateMap(@Nonnull UICommandBuilder builder,
                             @Nonnull World world,
                             @Nonnull Ref<EntityStore> storeRef,
                             @Nonnull PlayerRef playerRef) {
        Store<EntityStore> store = storeRef.getStore();
        Ref<EntityStore> entityRef = playerRef.getReference();
        // Guard against player disconnection - entityRef becomes null when player leaves
        if (entityRef == null || !entityRef.isValid()) {
            return false;
        }
        @SuppressWarnings("null")
        TransformComponent transform = store.getComponent(entityRef, TransformComponent.getComponentType());
        if (transform == null) {
            return false;
        }

        boolean changed = false;

        Vector3d pos = transform.getPosition();
        
        // Get player head rotation (yaw) for facing direction
        @SuppressWarnings("null")
        HeadRotation headRotation = store.getComponent(entityRef, HeadRotation.getComponentType());
        float yaw = 0f;
        if (headRotation != null) {
            Vector3f headRot = headRotation.getRotation();
            yaw = headRot.getY(); // Y component is yaw (horizontal rotation)
        }
        
        int blockX = (int) Math.floor(pos.getX());
        int blockY = (int) Math.floor(pos.getY());
        int blockZ = (int) Math.floor(pos.getZ());
        long now = System.currentTimeMillis();

        // Convert yaw (radians) to degrees for map rotation
        // In Hytale: yaw is in radians, need to adjust for coordinate system
        float yawDegrees = (float) Math.toDegrees(yaw);
        float normalizedYaw = ((yawDegrees + 360) % 360);
        
        // Player marker always points north (fixed), map rotates instead
        int arrowDirection = 0; // Always north

        boolean positionChanged = blockX != lastBlockX || blockZ != lastBlockZ;
        // Track rotation changes for map redraw
        boolean rotationChanged = Math.abs(normalizedYaw - lastYawDegrees) > 5.0f; // 5 degree threshold
        boolean directionChanged = arrowDirection != lastArrowDirection;
        boolean timeToUpdate = (now - lastUpdateMillis) >= MIN_UPDATE_MS;

        List<Waypoint> visibleWaypoints = null;
        if (waypointStorage != null) {
            visibleWaypoints = waypointStorage.getWaypointConfig(playerRef.getUuid()).getVisibleWaypoints();
        }

        if (positionChanged || rotationChanged || directionChanged || timeToUpdate) {
            lastBlockX = blockX;
            lastBlockZ = blockZ;
            lastArrowDirection = arrowDirection;
            lastYawDegrees = normalizedYaw;
            lastUpdateMillis = now;

            changed |= updateMapPixels(builder, world.getWorldMapManager(), blockX, blockZ, arrowDirection, directionChanged, normalizedYaw, playerRef, visibleWaypoints);

            // Update coordinates only if changed
            if (blockX != lastCoordX || blockY != lastCoordY || blockZ != lastCoordZ) {
                builder.set("#MinimapCoords.Text", "X: " + blockX + "  Y: " + blockY + "  Z: " + blockZ);
                lastCoordX = blockX;
                lastCoordY = blockY;
                lastCoordZ = blockZ;
                changed = true;
            }
        }

        changed |= updateCompassRing(builder, pos, normalizedYaw, visibleWaypoints);
        maybeSpawnWaypointEffects(visibleWaypoints, pos, store, storeRef);

        return changed;
    }

    @SuppressWarnings("null")
    private boolean updateMapPixels(@Nonnull UICommandBuilder builder,
                                    WorldMapManager mapManager,
                                    int playerX,
                                    int playerZ,
                                    int arrowDirection,
                                    boolean directionChanged,
                                    float yawDegrees,
                                    @Nonnull PlayerRef playerRef,
                                    @Nullable List<Waypoint> waypoints) {
        if (mapManager == null) {
            return false;
        }

        boolean changed = false;
        
        // Pre-compute arrow pixel indices for current direction
        int[][] arrowPattern = ARROW_PATTERNS[arrowDirection];
        java.util.Set<Integer> arrowIndices = new java.util.HashSet<>();
        for (int[] offset : arrowPattern) {
            int ax = HALF_GRID + offset[0];
            int ay = HALF_GRID + offset[1];
            if (ax >= 0 && ax < GRID_SIZE && ay >= 0 && ay < GRID_SIZE) {
                arrowIndices.add(ay * GRID_SIZE + ax);
            }
        }
        
        // If direction changed, force clear old arrow pixels by invalidating their cache
        if (directionChanged) {
            for (Integer oldIndex : lastArrowIndices) {
                lastColorInts[oldIndex] = -1; // Invalidate cache to force redraw
            }
        }
        lastArrowIndices = arrowIndices; // Store for next update

        // Cache rotation values if yaw changed (avoid recomputing trig functions for every pixel)
        if (yawDegrees != lastYaw) {
            double radians = Math.toRadians(yawDegrees + 180.0);
            cachedCos = Math.cos(radians);
            cachedSin = Math.sin(radians);
            lastYaw = yawDegrees;
        }

        for (int i = 0; i < VISIBLE_PIXEL_COUNT; i++) {
            int index = VISIBLE_INDICES[i];
            int gridX = index % GRID_SIZE;
            int gridY = index / GRID_SIZE;

            int colorInt;
            boolean isArrowPixel = arrowIndices.contains(index);
            
            if (isArrowPixel) {
                // Player arrow marker (white) - always points north
                colorInt = PLAYER_MARKER_COLOR_INT;
            } else {
                // Rotate the sampling coordinates based on player yaw + 180 degrees (map rotates, player stays north)
                // Use cached trig values to avoid recomputing for every pixel
                double dx = (gridX - HALF_GRID) * minimapZoom;
                double dz = -(gridY - HALF_GRID) * minimapZoom; // Negate Z to fix forward = up
                // Rotate point around center using cached values
                double rotatedX = dx * cachedCos - dz * cachedSin;
                double rotatedZ = dx * cachedSin + dz * cachedCos;
                int worldX = playerX + (int) Math.round(rotatedX);
                int worldZ = playerZ + (int) Math.round(rotatedZ);

                // Check if there's a waypoint at this position
                String waypointColor = getWaypointAtPosition(waypoints, worldX, worldZ);
                if (waypointColor != null) {
                    // Waypoint marker color
                    colorInt = hexToInt(waypointColor);
                } else {
                    // Terrain color
                    colorInt = sampleMapColorInt(mapManager, worldX, worldZ);
                }
            }

            if (colorInt != lastColorInts[index]) {
                lastColorInts[index] = colorInt;
                String colorStr = isArrowPixel ? PLAYER_MARKER_COLOR : intToHex(colorInt);
                builder.set(PIXEL_SELECTORS[index], colorStr);
                changed = true;
            }
        }

        return changed;
    }

    private boolean updateCompassRing(@Nonnull UICommandBuilder builder,
                                      @Nonnull Vector3d playerPos,
                                      float yawDegrees,
                                      @Nullable List<Waypoint> waypoints) {
        if (waypoints == null || waypoints.isEmpty()) {
            return hideAllCompassMarkers(builder);
        }

        int playerX = (int) Math.floor(playerPos.getX());
        int playerZ = (int) Math.floor(playerPos.getZ());
        boolean changed = false;

        // Calculate the minimap visible range (half the minimap width in world units)
        // GRID_SIZE is 25 pixels, each pixel covers minimapZoom blocks
        // So visible radius varies with zoom level
        int minimapVisibleRadius = (GRID_SIZE / 2) * minimapZoom;

        // Filter to only waypoints that are NOT visible on the minimap
        List<Waypoint> offMapWaypoints = new ArrayList<>();
        for (Waypoint wp : waypoints) {
            if (!wp.isVisible()) continue; // Skip hidden waypoints
            
            double distance = wp.distance2DTo(playerX, playerZ);
            // Only add to compass if beyond minimap visible range
            if (distance > minimapVisibleRadius) {
                offMapWaypoints.add(wp);
            }
        }

        if (offMapWaypoints.isEmpty()) {
            return hideAllCompassMarkers(builder);
        }

        // Sort by distance (closest first)
        offMapWaypoints.sort(Comparator.comparingDouble(wp -> wp.distance2DTo(playerX, playerZ)));

        int count = Math.min(MAX_COMPASS_MARKERS, offMapWaypoints.size());
        for (int i = 0; i < count; i++) {
            Waypoint wp = offMapWaypoints.get(i);
            @SuppressWarnings("null")
            int bearing = getBearingDegrees(playerX, playerZ, wp);
            // Rotate compass with the map (same rotation as map uses)
            int adjustedBearing = normalizeDegrees(bearing + (int) yawDegrees);
            int[] pos = compassPositionFromBearing(adjustedBearing);
            changed |= applyCompassMarker(builder, i, pos[0], pos[1], wp.getColor());
        }

        for (int i = count; i < MAX_COMPASS_MARKERS; i++) {
            changed |= hideCompassMarker(builder, i);
        }

        return changed;
    }

    @SuppressWarnings("null")
    private boolean applyCompassMarker(@Nonnull UICommandBuilder builder,
                                       int index,
                                       int left,
                                       int top,
                                       @Nonnull String color) {
        boolean changed = false;
        if (!lastCompassVisible[index]) {
            builder.set("#CompassMarker" + index + ".Visible", true);
            lastCompassVisible[index] = true;
            changed = true;
        }

        if (left != lastCompassX[index] || top != lastCompassY[index]) {
            Anchor anchor = buildAnchor(left, top, COMPASS_MARKER_SIZE, COMPASS_MARKER_SIZE);
            builder.setObject("#CompassMarker" + index + ".Anchor", anchor);
            lastCompassX[index] = left;
            lastCompassY[index] = top;
            changed = true;
        }

        // Set the background color directly instead of trying to change TexturePath
        // CustomUI doesn't allow changing TexturePath at runtime, but allows color changes
        if (!color.equals(lastCompassColor[index])) {
            builder.set("#CompassMarker" + index + ".Background", color);
            lastCompassColor[index] = color;
            changed = true;
        }

        return changed;
    }

    private boolean hideCompassMarker(@Nonnull UICommandBuilder builder, int index) {
        if (!lastCompassVisible[index]) {
            return false;
        }
        builder.set("#CompassMarker" + index + ".Visible", false);
        lastCompassVisible[index] = false;
        return true;
    }

    private boolean hideAllCompassMarkers(@Nonnull UICommandBuilder builder) {
        boolean changed = false;
        for (int i = 0; i < MAX_COMPASS_MARKERS; i++) {
            changed |= hideCompassMarker(builder, i);
        }
        return changed;
    }

    private static Anchor buildAnchor(int left, int top, int width, int height) {
        Anchor anchor = new Anchor();
        anchor.setLeft(Value.of(left));
        anchor.setTop(Value.of(top));
        anchor.setWidth(Value.of(width));
        anchor.setHeight(Value.of(height));
        return anchor;
    }

    private static int getBearingDegrees(int playerX, int playerZ, @Nonnull Waypoint wp) {
        double dx = wp.getX() - (double) playerX;
        double dz = wp.getZ() - (double) playerZ;
        double angle = Math.toDegrees(Math.atan2(dx, -dz));
        return normalizeDegrees((int) Math.round(angle));
    }

    private static int normalizeDegrees(int degrees) {
        int d = degrees % 360;
        if (d < 0) {
            d += 360;
        }
        return d;
    }

    private static int[] compassPositionFromBearing(int bearingDegrees) {
        double radians = Math.toRadians(normalizeDegrees(bearingDegrees));
        double x = Math.sin(radians) * COMPASS_RING_RADIUS;
        double y = -Math.cos(radians) * COMPASS_RING_RADIUS;
        int left = (int) Math.round(COMPASS_RING_CENTER_X + x - (COMPASS_MARKER_SIZE / 2.0));
        int top = (int) Math.round(COMPASS_RING_CENTER_Y + y - (COMPASS_MARKER_SIZE / 2.0));
        return new int[]{left, top};
    }


    private void maybeSpawnWaypointEffects(@Nullable List<Waypoint> waypoints,
                                           @Nonnull Vector3d playerPos,
                                           @Nonnull Store<EntityStore> store,
                                           @Nonnull Ref<EntityStore> storeRef) {
        if (waypoints == null || waypoints.isEmpty()) {
            return;
        }

        long now = System.currentTimeMillis();
        if (now - lastEffectMillis < WAYPOINT_EFFECT_INTERVAL_MS) {
            return;
        }
        lastEffectMillis = now;

        int playerX = (int) Math.floor(playerPos.getX());
        int playerZ = (int) Math.floor(playerPos.getZ());
        List<Waypoint> sorted = new ArrayList<>(waypoints);
        sorted.sort(Comparator.comparingDouble(wp -> wp.distance2DTo(playerX, playerZ)));

        int spawned = 0;
        for (Waypoint wp : sorted) {
            if (wp.distance2DTo(playerX, playerZ) > WAYPOINT_EFFECT_RADIUS) {
                continue;
            }
            Vector3d effectPos = new Vector3d(wp.getX() + 0.5, wp.getY() + 1.5, wp.getZ() + 0.5);
            WaypointEffects.spawn(effectPos, storeRef, store);
            spawned++;
            if (spawned >= MAX_EFFECT_WAYPOINTS) {
                break;
            }
        }
    }

    /**
     * Checks if there's a waypoint at the given world coordinates.
     * Returns the waypoint color if found, null otherwise.
     */
    @Nullable
    private String getWaypointAtPosition(@Nullable List<Waypoint> waypoints, int worldX, int worldZ) {
        if (waypoints == null || waypoints.isEmpty()) {
            return null;
        }

        // Check if any waypoint is within render range (2 blocks)
        for (Waypoint wp : waypoints) {
            double distance = wp.distance2DTo(worldX, worldZ);
            if (distance <= 2.0) {
                return wp.getColor();
            }
        }

        return null;
    }

    /**
     * Converts hex color string to quantized 9-bit integer.
     */
    private int hexToInt(@Nonnull String hexColor) {
        try {
            String hex = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;
            int rgb = Integer.parseInt(hex, 16);
            // Quantize to 9-bit (3 bits per channel)
            int r = ((rgb >> 16) & 0xFF) >> 5; // 0-7
            int g = ((rgb >> 8) & 0xFF) >> 5;  // 0-7
            int b = (rgb & 0xFF) >> 5;         // 0-7
            return (r << 6) | (g << 3) | b;
        } catch (Exception e) {
            return 0x1b6; // 9-bit magenta fallback (7,5,6)
        }
    }

    @SuppressWarnings("null")
    private int sampleMapColorInt(@Nonnull WorldMapManager mapManager, int worldX, int worldZ) {
        int chunkX = Math.floorDiv(worldX, 32);
        int chunkZ = Math.floorDiv(worldZ, 32);
        MapImage image = mapManager.getImageIfInMemory(chunkX, chunkZ);

        if (image == null || image.data == null || image.width <= 0 || image.height <= 0) {
            mapManager.getImageAsync(chunkX, chunkZ);
            return DEFAULT_COLOR_INT;
        }

        int localX = Math.floorMod(worldX, 32);
        int localZ = Math.floorMod(worldZ, 32);
        int imgX = localX * image.width / 32;
        int imgZ = localZ * image.height / 32;
        imgX = Math.max(0, Math.min(image.width - 1, imgX));
        imgZ = Math.max(0, Math.min(image.height - 1, imgZ));
        int idx = imgZ * image.width + imgX;

        if (idx < 0 || idx >= image.data.length) {
            return DEFAULT_COLOR_INT;
        }
        return rgbaToQuantizedInt(image.data[idx]);
    }

    private int rgbaToQuantizedInt(int rgba) {
        // Quantize to 9-bit (3 bits per channel = 512 colors) for reduced network traffic
        int r = ((rgba >>> 24) & 0xFF) >> 5; // 0-7
        int g = ((rgba >>> 16) & 0xFF) >> 5; // 0-7
        int b = ((rgba >>> 8) & 0xFF) >> 5;  // 0-7
        return (r << 6) | (g << 3) | b; // Pack into 9 bits
    }

    // 3-bit to 8-bit expansion: 0→0, 1→36, 2→73, 3→109, 4→146, 5→182, 6→219, 7→255
    private static final int[] EXPAND_3BIT = {0, 36, 73, 109, 146, 182, 219, 255};

    private String intToHex(int quantized) {
        if (quantized < 0 || quantized >= colorPalette.length) {
            return DEFAULT_COLOR;
        }
        if (colorPalette[quantized] == null) {
            // Extract 3-bit channels from 9-bit packed value
            int r = EXPAND_3BIT[(quantized >> 6) & 0x7];
            int g = EXPAND_3BIT[(quantized >> 3) & 0x7];
            int b = EXPAND_3BIT[quantized & 0x7];
            // Use 6-digit hex for Hytale UI compatibility
            colorPalette[quantized] = String.format("#%02x%02x%02x", r, g, b);
        }
        return colorPalette[quantized];
    }

    private static char toBase36Char(int value) {
        return value < 10 ? (char) ('0' + value) : (char) ('a' + (value - 10));
    }

    private static String toBase36Pair(int value) {
        int high = value / 36;
        int low = value % 36;
        return "" + toBase36Char(high) + toBase36Char(low);
    }
}
