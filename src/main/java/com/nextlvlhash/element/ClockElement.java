package com.nextlvlhash.element;

import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * Manages clock hand visibility updates.
 * Uses pre-rendered clock hand images (one per hour position).
 */
public class ClockElement {

    private int lastHandIndex = -1;

    /**
     * Updates clock hand visibility based on current hour.
     * Only sends updates when the hour changes.
     *
     * @param builder UICommandBuilder to add updates to
     * @param dateTime current in-game time
     * @return true if the clock hand was updated
     */
    public boolean updateClockHand(@Nonnull UICommandBuilder builder, @Nonnull LocalDateTime dateTime) {
        int hour = dateTime.getHour();
        int handIndex = hour % 12;

        if (handIndex == lastHandIndex) {
            return false;
        }

        // Hide all hands on first update
        if (lastHandIndex == -1) {
            for (int i = 0; i < 12; i++) {
                builder.set(String.format("#ClockHand%02d.Visible", i), false);
            }
        } else {
            // Hide previous hand
            builder.set(String.format("#ClockHand%02d.Visible", lastHandIndex), false);
        }

        // Show current hand
        builder.set(String.format("#ClockHand%02d.Visible", handIndex), true);
        lastHandIndex = handIndex;

        return true;
    }
}
