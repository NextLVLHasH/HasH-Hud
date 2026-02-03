package com.nextlvlhash.waypoint;

import javax.annotation.Nonnull;

/**
 * Categories for organizing waypoints.
 */
public enum WaypointCategory {
    HOME("Home", "#4CAF50"),
    FARM("Farm", "#8BC34A"),
    MINE("Mine", "#9E9E9E"),
    CAVE("Cave", "#795548"),
    DANGER("Danger", "#F44336"),
    DEATH("Death", "#E91E63"),
    OTHER("Other", "#9C27B0");

    private final String displayName;
    private final String defaultColor;

    WaypointCategory(String displayName, String defaultColor) {
        this.displayName = displayName;
        this.defaultColor = defaultColor;
    }

    @SuppressWarnings("null")
    @Nonnull
    public String getDisplayName() {
        return displayName;
    }

    @SuppressWarnings("null")
    @Nonnull
    public String getDefaultColor() {
        return defaultColor;
    }

    @Nonnull
    public static WaypointCategory fromString(String name) {
        for (WaypointCategory category : values()) {
            if (category.name().equalsIgnoreCase(name)) {
                return category;
            }
        }
        return OTHER;
    }
}
