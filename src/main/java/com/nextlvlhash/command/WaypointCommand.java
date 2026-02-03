package com.nextlvlhash.command;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.protocol.GameMode;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractCommandCollection;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.entity.UUIDComponent;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.modules.entity.component.TransformComponent;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.page.WaypointListPage;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.system.MapIntegrationSystem;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointCategory;
import com.nextlvlhash.waypoint.WaypointConfig;
import com.nextlvlhash.waypoint.WaypointEffects;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.UUID;

/**
 * Command collection for managing waypoints.
 */
public class WaypointCommand extends AbstractCommandCollection {

    public WaypointCommand(@Nonnull WaypointStorage storage) {
        super("waypoint", "Manage waypoints");
        this.setPermissionGroup(GameMode.Adventure);
        addAliases("wp");

        addSubCommand(new AddCommand(storage));
        addSubCommand(new RemoveCommand(storage));
        addSubCommand(new ListCommand(storage));
        addSubCommand(new ToggleCommand(storage));
        addSubCommand(new MenuCommand(storage));
    }

    private static String extractName(@Nonnull CommandContext ctx, @Nonnull String subCommand) {
        String input = ctx.getInputString();
        String trimmed = input.trim();
        if (trimmed.startsWith("/")) {
            trimmed = trimmed.substring(1).trim();
        }

        String lower = trimmed.toLowerCase();
        if (lower.startsWith("waypoint ")) {
            trimmed = trimmed.substring("waypoint ".length()).trim();
            lower = trimmed.toLowerCase();
        } else if (lower.startsWith("wp ")) {
            trimmed = trimmed.substring("wp ".length()).trim();
            lower = trimmed.toLowerCase();
        }

        String subLower = subCommand.toLowerCase();
        if (lower.startsWith(subLower + " ")) {
            // Skip the subcommand AND the space after it
            trimmed = trimmed.substring((subLower + " ").length()).trim();
        } else if (lower.equals(subLower)) {
            trimmed = "";
        }

        return trimmed.trim();
    }

    /**
     * Add waypoint at current location.
     */
    private static class AddCommand extends AbstractPlayerCommand {
        private final WaypointStorage storage;

        AddCommand(WaypointStorage storage) {
            super("add", "Add a waypoint at current location");
            this.storage = storage;
        }

        @Override
        protected void execute(@Nonnull CommandContext ctx,
                               @Nonnull Store<EntityStore> store,
                               @Nonnull Ref<EntityStore> ref,
                               @Nonnull PlayerRef playerRef,
                               @Nonnull World world) {
            Player player = store.getComponent(ref, Player.getComponentType());
            if (player == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get player component."));
                return;
            }

            UUIDComponent uuidComp = store.getComponent(ref, UUIDComponent.getComponentType());
            if (uuidComp == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get UUID."));
                return;
            }

            UUID uuid = uuidComp.getUuid();
            TransformComponent transform = store.getComponent(ref, TransformComponent.getComponentType());
            if (transform == null) {
                ctx.sendMessage(Message.raw("§cCould not get your position."));
                return;
            }

            Vector3d pos = transform.getPosition();
            int x = (int) Math.floor(pos.getX());
            int y = (int) Math.floor(pos.getY());
            int z = (int) Math.floor(pos.getZ());

            String name = extractName(ctx, "add");
            final String waypointName = name.isEmpty() ? "Waypoint" : name;

            Waypoint waypoint = new Waypoint(waypointName, x, y, z, WaypointCategory.OTHER);

            storage.addWaypoint(uuid, waypoint).thenAccept(success -> {
                if (success) {
                    ctx.sendMessage(Message.raw("§aWaypoint '" + waypointName + "' added at " + x + ", " + y + ", " + z));
                    Vector3d effectPos = new Vector3d(x + 0.5, y + 1.5, z + 0.5);
                    world.execute(() -> {
                        WaypointEffects.spawn(effectPos, ref, ref.getStore());
                        // Add to native map
                        MapIntegrationSystem.addWaypointToMap(player, waypoint);
                    });
                } else {
                    ctx.sendMessage(Message.raw("§cCannot add waypoint. Max limit reached."));
                }
            });
        }
    }

    /**
     * Remove waypoint by name.
     */
    private static class RemoveCommand extends AbstractPlayerCommand {
        private final WaypointStorage storage;

        RemoveCommand(WaypointStorage storage) {
            super("remove", "Remove a waypoint by name");
            this.storage = storage;
        }

        @Override
        protected void execute(@Nonnull CommandContext ctx,
                               @Nonnull Store<EntityStore> store,
                               @Nonnull Ref<EntityStore> ref,
                               @Nonnull PlayerRef playerRef,
                               @Nonnull World world) {
            Player player = store.getComponent(ref, Player.getComponentType());
            UUIDComponent uuidComp = store.getComponent(ref, UUIDComponent.getComponentType());
            if (uuidComp == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get UUID."));
                return;
            }

            UUID uuid = uuidComp.getUuid();

            String name = extractName(ctx, "remove");
            if (name.isEmpty()) {
                ctx.sendMessage(Message.raw("§cUsage: /waypoint remove <name>"));
                return;
            }

            WaypointConfig config = storage.getWaypointConfig(uuid);

            Waypoint toRemove = config.getWaypoints().stream()
                .filter(wp -> wp.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);

            if (toRemove == null) {
                ctx.sendMessage(Message.raw("§cWaypoint '" + name + "' not found."));
                return;
            }

            final String waypointId = toRemove.getId();
            storage.removeWaypoint(uuid, waypointId).thenAccept(success -> {
                if (success) {
                    ctx.sendMessage(Message.raw("§aWaypoint '" + name + "' removed."));
                    // Remove from native map
                    if (player != null) {
                        world.execute(() -> MapIntegrationSystem.removeWaypointFromMap(player, waypointId));
                    }
                } else {
                    ctx.sendMessage(Message.raw("§cFailed to remove waypoint."));
                }
            });
        }
    }

    /**
     * List all waypoints.
     */
    private static class ListCommand extends AbstractPlayerCommand {
        private final WaypointStorage storage;

        ListCommand(WaypointStorage storage) {
            super("list", "List all waypoints");
            this.storage = storage;
        }

        @SuppressWarnings("null")
        @Override
        protected void execute(@Nonnull CommandContext ctx,
                               @Nonnull Store<EntityStore> store,
                               @Nonnull Ref<EntityStore> ref,
                               @Nonnull PlayerRef playerRef,
                               @Nonnull World world) {
            UUIDComponent uuidComp = store.getComponent(ref, UUIDComponent.getComponentType());
            if (uuidComp == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get UUID."));
                return;
            }

            UUID uuid = uuidComp.getUuid();
            WaypointConfig config = storage.getWaypointConfig(uuid);
            List<Waypoint> waypoints = config.getWaypoints();

            if (waypoints.isEmpty()) {
                ctx.sendMessage(Message.raw("§eYou have no waypoints."));
                return;
            }

            ctx.sendMessage(Message.raw("§6=== Your Waypoints ==="));
            for (Waypoint wp : waypoints) {
                String visibility = wp.isVisible() ? "§a✓" : "§c✗";
                String line = String.format("%s §f%s §7[%s] §8(%d, %d, %d)",
                    visibility, wp.getName(), wp.getCategory().getDisplayName(),
                    wp.getX(), wp.getY(), wp.getZ());
                ctx.sendMessage(Message.raw(line));
            }
        }
    }

    /**
     * Toggle waypoint visibility.
     */
    private static class ToggleCommand extends AbstractPlayerCommand {
        private final WaypointStorage storage;

        ToggleCommand(WaypointStorage storage) {
            super("toggle", "Toggle waypoint visibility");
            this.storage = storage;
        }

        @SuppressWarnings("null")
        @Override
        protected void execute(@Nonnull CommandContext ctx,
                               @Nonnull Store<EntityStore> store,
                               @Nonnull Ref<EntityStore> ref,
                               @Nonnull PlayerRef playerRef,
                               @Nonnull World world) {
            Player player = store.getComponent(ref, Player.getComponentType());
            UUIDComponent uuidComp = store.getComponent(ref, UUIDComponent.getComponentType());
            if (uuidComp == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get UUID."));
                return;
            }

            UUID uuid = uuidComp.getUuid();

            String name = extractName(ctx, "toggle");
            if (name.isEmpty()) {
                ctx.sendMessage(Message.raw("§cUsage: /waypoint toggle <name>"));
                return;
            }

            WaypointConfig config = storage.getWaypointConfig(uuid);

            Waypoint waypoint = config.getWaypoints().stream()
                .filter(wp -> wp.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);

            if (waypoint == null) {
                ctx.sendMessage(Message.raw("§cWaypoint '" + name + "' not found."));
                return;
            }

            waypoint.setVisible(!waypoint.isVisible());
            boolean nowVisible = waypoint.isVisible();

            storage.updateWaypoint(uuid, waypoint).thenAccept(v -> {
                String status = nowVisible ? "§avisible" : "§chidden";
                ctx.sendMessage(Message.raw("§eWaypoint '" + name + "' is now " + status));
                world.execute(() -> {
                    if (nowVisible) {
                        Vector3d effectPos = new Vector3d(waypoint.getX() + 0.5, waypoint.getY() + 1.5, waypoint.getZ() + 0.5);
                        WaypointEffects.spawn(effectPos, ref, ref.getStore());
                    }
                    // Sync visibility change to native map
                    if (player != null) {
                        MapIntegrationSystem.syncWaypointsToMap(player, storage);
                    }
                });
            });
        }
    }

    /**
     * Open the waypoint menu UI.
     */
    private static class MenuCommand extends AbstractPlayerCommand {
        private final WaypointStorage storage;

        MenuCommand(WaypointStorage storage) {
            super("menu", "Open the waypoint menu");
            this.storage = storage;
        }

        @SuppressWarnings("null")
        @Override
        protected void execute(@Nonnull CommandContext ctx,
                               @Nonnull Store<EntityStore> store,
                               @Nonnull Ref<EntityStore> ref,
                               @Nonnull PlayerRef playerRef,
                               @Nonnull World world) {
            Player player = store.getComponent(ref, Player.getComponentType());
            if (player == null) {
                ctx.sendMessage(Message.raw("§cError: Could not get player component."));
                return;
            }

            System.out.println("[HudMod] Opening waypoint list for player " + player.getDisplayName());
            
            player.getPageManager().openCustomPage(ref, store, new WaypointListPage(playerRef, storage));
            
            ctx.sendMessage(Message.raw("§aOpening waypoint list..."));
        }
    }
}
