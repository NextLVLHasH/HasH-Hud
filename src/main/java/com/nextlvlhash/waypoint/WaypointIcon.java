package com.nextlvlhash.waypoint;

import javax.annotation.Nonnull;

/**
 * Waypoint marker colors/styles that display on the map.
 * 10-color system with white as default.
 */
public enum WaypointIcon {
    WHITE("White", "waypoints/waywhite.png", "#FFFFFF"),
    RED("Red", "waypoints/wayred.png", "#F44336"),
    ORANGE("Orange", "waypoints/wayorange.png", "#FF9800"),
    YELLOW("Yellow", "waypoints/wayyellow.png", "#FFEB3B"),
    GREEN("Green", "waypoints/waygreen.png", "#4CAF50"),
    CYAN("Cyan", "waypoints/waycyan.png", "#00BCD4"),
    BLUE("Blue", "waypoints/wayblue.png", "#2196F3"),
    PURPLE("Purple", "waypoints/waypurple.png", "#9C27B0"),
    PINK("Pink", "waypoints/waypink.png", "#E91E63"),
    BLACK("Black", "waypoints/wayblack.png", "#333333");

    private final String displayName;
    private final String iconPath;
    private final String hexColor;

    WaypointIcon(String displayName, String iconPath, String hexColor) {
        this.displayName = displayName;
        this.iconPath = iconPath;
        this.hexColor = hexColor;
    }

    @SuppressWarnings("null")
    @Nonnull
    public String getDisplayName() {
        return displayName;
    }

    @SuppressWarnings("null")
    @Nonnull
    public String getIconPath() {
        return iconPath;
    }

    @SuppressWarnings("null")
    @Nonnull
    public String getHexColor() {
        return hexColor;
    }

    @Nonnull
    public static WaypointIcon fromString(String name) {
        for (WaypointIcon icon : values()) {
            if (icon.name().equalsIgnoreCase(name)) {
                return icon;
            }
        }
        return WHITE;
    }

    /**
     * Get the next icon in the cycle (for cycling through options)
     */
    public WaypointIcon next() {
        WaypointIcon[] values = values();
        int nextIndex = (this.ordinal() + 1) % values.length;
        return values[nextIndex];
    }
}
