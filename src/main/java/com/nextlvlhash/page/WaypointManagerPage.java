package com.nextlvlhash.page;

import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.entity.entities.player.pages.BasicCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointConfig;

import javax.annotation.Nonnull;
import java.util.List;

/**
 * Waypoint management page with clear, organized display.
 * Use commands to manage: /waypoint add, remove, toggle, list, menu
 */
public class WaypointManagerPage extends BasicCustomUIPage {

    private final WaypointStorage storage;

    public WaypointManagerPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage) {
        super(playerRef, CustomPageLifetime.CanDismissOrCloseThroughInteraction);
        this.storage = storage;
    }

    @Override
    public void build(@SuppressWarnings("null") @Nonnull UICommandBuilder builder) {
        builder.append("hudmenu/waypointmenu.ui");
        builder.set("#WaypointListLabel.TextSpans", Message.raw(buildWaypointListText()));
    }

    @SuppressWarnings("null")
    @Nonnull
    private String buildWaypointListText() {
        WaypointConfig config = storage.getWaypointConfig(playerRef.getUuid());
        List<Waypoint> waypoints = config.getWaypoints();

        if (waypoints.isEmpty()) {
            return "\n\n          No waypoints saved yet!\n\n" +
                   "      Use /waypoint add <name>\n" +
                   "      to create your first waypoint.";
        }

        StringBuilder text = new StringBuilder();
        text.append("Total: ").append(waypoints.size()).append(" / 50\n\n");

        for (int i = 0; i < waypoints.size(); i++) {
            Waypoint wp = waypoints.get(i);

            // Top border
            text.append("====================================\n");

            // Status indicator + Name
            String status = wp.isVisible() ? "[VISIBLE]" : "[HIDDEN]";
            text.append(status).append(" ").append(wp.getName()).append("\n");

            // Coordinates
            text.append("Location: X:").append(wp.getX())
                .append(" Y:").append(wp.getY())
                .append(" Z:").append(wp.getZ()).append("\n");

            // Category
            text.append("Category: ").append(wp.getCategory().getDisplayName()).append("\n");

            // Bottom border
            text.append("====================================");

            // Add spacing between waypoints
            if (i < waypoints.size() - 1) {
                text.append("\n\n");
            }
        }

        return text.toString();
    }
}
