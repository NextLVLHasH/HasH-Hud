package com.nextlvlhash.hud;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Represents the HUD anchor positions on screen.
 * Only TOP_LEFT and TOP_RIGHT are currently supported.
 */
public enum HudPosition {
    TOP_LEFT(1, "Top Left"),
    TOP_RIGHT(2, "Top Right");

    private final int gridNumber;
    private final String displayName;

    HudPosition(int gridNumber, String displayName) {
        this.gridNumber = gridNumber;
        this.displayName = displayName;
    }

    /**
     * Gets the grid number (1-9) for this position.
     */
    public int getGridNumber() {
        return gridNumber;
    }

    /**
     * Gets the human-readable display name.
     */
    @SuppressWarnings("null")
    @Nonnull
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Returns true if this position is on the left side of the screen.
     */
    public boolean isLeftSide() {
        return this == TOP_LEFT;
    }

    /**
     * Returns true if this position is on the right side of the screen.
     */
    public boolean isRightSide() {
        return this == TOP_RIGHT;
    }

    /**
     * Returns true if this position is horizontally centered.
     */
    public boolean isHorizontalCenter() {
        return false;
    }

    /**
     * Returns true if this position is at the top of the screen.
     */
    public boolean isTop() {
        return true; // Both positions are at top
    }

    /**
     * Returns true if this position is at the bottom of the screen.
     */
    public boolean isBottom() {
        return false;
    }

    /**
     * Returns true if this position is vertically centered.
     */
    public boolean isVerticalCenter() {
        return false;
    }

    /**
     * Toggles between TOP_LEFT and TOP_RIGHT.
     */
    @Nonnull
    public HudPosition next() {
        return this == TOP_LEFT ? TOP_RIGHT : TOP_LEFT;
    }

    /**
     * Toggles between TOP_LEFT and TOP_RIGHT.
     */
    @Nonnull
    public HudPosition previous() {
        return this == TOP_LEFT ? TOP_RIGHT : TOP_LEFT;
    }

    /**
     * Finds a HudPosition by its grid number (1-2).
     * @return the position, or TOP_RIGHT as default if not found
     */
    @Nonnull
    public static HudPosition fromGridNumber(int number) {
        if (number == 1) return TOP_LEFT;
        return TOP_RIGHT; // Default
    }

    /**
     * Parses a HudPosition from a string (name or grid number).
     * Supports legacy "LEFT"/"RIGHT" values for backwards compatibility.
     * @return the position, or TOP_RIGHT as default if not found
     */
    @Nonnull
    public static HudPosition fromString(@Nullable String value) {
        if (value == null || value.isEmpty()) {
            return TOP_RIGHT; // Default
        }

        // Handle legacy LEFT/RIGHT values
        if ("LEFT".equalsIgnoreCase(value)) {
            return TOP_LEFT;
        }
        if ("RIGHT".equalsIgnoreCase(value)) {
            return TOP_RIGHT;
        }

        // Try parsing as grid number
        try {
            int number = Integer.parseInt(value);
            return fromGridNumber(number);
        } catch (NumberFormatException ignored) {
            // Not a number, try as enum name
        }

        // Try parsing as enum name
        try {
            return valueOf(value.toUpperCase().replace(" ", "_").replace("-", "_"));
        } catch (IllegalArgumentException e) {
            return TOP_RIGHT; // Default
        }
    }

    /**
     * Converts this position to a string for storage.
     */
    @SuppressWarnings("null")
    @Nonnull
    public String toStorageString() {
        return name();
    }

    @Override
    public String toString() {
        return displayName;
    }
}
