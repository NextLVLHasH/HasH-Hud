package com.nextlvlhash.page;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.protocol.packets.interface_.Page;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.command.system.CommandManager;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointIcon;

import javax.annotation.Nonnull;

/**
 * Waypoint edit page - allows editing name, description, and visibility.
 * Also provides delete and teleport functionality (OP only for teleport).
 */
public class WaypointEditPage extends InteractiveCustomUIPage<WaypointEditPage.WaypointEditData> {

    private final WaypointStorage storage;
    private final Waypoint waypoint;
    private final boolean isOperator;

    public WaypointEditPage(@Nonnull PlayerRef playerRef,
                           @Nonnull WaypointStorage storage,
                           @Nonnull Waypoint waypoint) {
        this(playerRef, storage, waypoint, false);
    }

    @SuppressWarnings("null")
    public WaypointEditPage(@Nonnull PlayerRef playerRef,
                           @Nonnull WaypointStorage storage,
                           @Nonnull Waypoint waypoint,
                           boolean isOperator) {
        super(playerRef, CustomPageLifetime.CanDismiss, WaypointEditData.CODEC);
        this.storage = storage;
        this.waypoint = waypoint;
        this.isOperator = isOperator;
    }

    @SuppressWarnings("null")
    @Override
    public void build(@Nonnull Ref<EntityStore> ref,
                      @Nonnull UICommandBuilder ui,
                      @Nonnull UIEventBuilder events,
                      @Nonnull Store<EntityStore> store) {
        ui.append("hudmenu/waypointedit.ui");

        // Set current values (use .Value for TextField elements)
        ui.set("#NameInput.Value", waypoint.getName());
        ui.set("#CoordsValue.Text", String.format("X: %d  Y: %d  Z: %d",
                waypoint.getX(), waypoint.getY(), waypoint.getZ()));
        ui.set("#DescInput.Value", waypoint.getDescription());

        // Set marker icon color (solid color - TexturePath can't change at runtime)
        WaypointIcon currentIcon = waypoint.getIcon();
        ui.set("#MarkerIconPreview.Background", currentIcon.getHexColor());
        ui.set("#MarkerColorLabel.Text", currentIcon.getDisplayName());

        // Update toggle button text based on visibility
        String visibilityText = waypoint.isVisible() ? "HIDE" : "SHOW";
        ui.set("#ToggleVisibilityLabel.Text", visibilityText);

        // Show teleport button only for operators
        ui.set("#TeleportButton.Visible", isOperator);

        // Add event bindings - use dynamic binding for text inputs with proper value capture
        events.addEventBinding(CustomUIEventBindingType.ValueChanged,
                "#NameInput",
                EventData.of("@NameValue", "#NameInput.Value").put("Action", "NAME_CHANGED"),
                true);

        events.addEventBinding(CustomUIEventBindingType.ValueChanged,
                "#DescInput",
                EventData.of("@DescValue", "#DescInput.Value").put("Action", "DESC_CHANGED"),
                true);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#ChangeColorButton",
                new EventData().put("Action", "CHANGE_COLOR"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#ToggleVisibilityButton",
                new EventData().put("Action", "TOGGLE_VISIBILITY"),
                false);

        // Teleport button (only visible to OPs)
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#TeleportButton",
                new EventData().put("Action", "TELEPORT"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#SaveButton",
                new EventData().put("Action", "SAVE"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#DeleteButton",
                new EventData().put("Action", "DELETE"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#BackButton",
                new EventData().put("Action", "BACK"),
                false);
    }

    @SuppressWarnings("null")
    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref,
                                 @Nonnull Store<EntityStore> store,
                                 @Nonnull WaypointEditData data) {

        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            return;
        }

        Action action = Action.from(data.action);
        if (action == null) {
            sendUpdate();
            return;
        }

        switch (action) {
            case NAME_CHANGED:
                // Use the captured TextField value
                if (data.nameValue != null && !data.nameValue.isEmpty()) {
                    waypoint.setName(data.nameValue);
                }
                sendUpdate();
                break;

            case DESC_CHANGED:
                // Use the captured TextField value
                if (data.descValue != null) {
                    waypoint.setDescription(data.descValue);
                }
                sendUpdate();
                break;

            case CHANGE_COLOR:
                // Cycle to next color/icon
                WaypointIcon currentIcon = waypoint.getIcon();
                WaypointIcon nextIcon = currentIcon.next();
                waypoint.setIcon(nextIcon);
                waypoint.setColor(nextIcon.getHexColor());

                // Reopen page to update icon preview
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointEditPage(this.playerRef, this.storage, waypoint, this.isOperator));
                break;

            case TOGGLE_VISIBILITY:
                waypoint.setVisible(!waypoint.isVisible());

                // Reopen page to update visibility toggle button
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointEditPage(this.playerRef, this.storage, waypoint, this.isOperator));
                break;

            case TELEPORT:
                // Teleport player to waypoint location using /tp command
                if (isOperator) {
                    // Build tp command: /tp PlayerName X Y Z
                    String playerName = player.getDisplayName();
                    int x = waypoint.getX();
                    int y = waypoint.getY() + 1; // +1 for safety
                    int z = waypoint.getZ();
                    
                    String tpCommand = String.format("tp %s %d %d %d", playerName, x, y, z);
                    
                    // Execute the command through CommandManager
                    CommandManager.get().handleCommand(this.playerRef, tpCommand);
                    
                    player.sendMessage(Message.raw("§aTeleported to '" + waypoint.getName() + "'!"));
                    
                    // Close the menu after teleport
                    player.getPageManager().setPage(ref, store, Page.None);
                } else {
                    player.sendMessage(Message.raw("§cYou must be an operator to teleport."));
                }
                sendUpdate();
                break;

            case SAVE:
                // Save waypoint
                storage.updateWaypoint(playerRef.getUuid(), waypoint).thenAccept(v -> {
                    // Send success message
                    player.sendMessage(Message.raw("§aWaypoint '" + waypoint.getName() + "' saved!"));
                    // Return to list
                    player.getPageManager().openCustomPage(ref, store, new WaypointListPage(this.playerRef, this.storage));
                });
                sendUpdate(); // Acknowledge event while async operation runs
                break;

            case DELETE:
                // Delete waypoint
                storage.removeWaypoint(playerRef.getUuid(), waypoint.getId()).thenAccept(success -> {
                    if (success) {
                        player.sendMessage(Message.raw("§aWaypoint '" + waypoint.getName() + "' deleted!"));
                        // Return to list
                        player.getPageManager().openCustomPage(ref, store, new WaypointListPage(this.playerRef, this.storage));
                    } else {
                        player.sendMessage(Message.raw("§cFailed to delete waypoint."));
                    }
                });
                sendUpdate(); // Acknowledge event while async operation runs
                break;

            case BACK:
                // Return to waypoint list without saving
                player.getPageManager().openCustomPage(ref, store, new WaypointListPage(this.playerRef, this.storage));
                break;
        }
    }

    private enum Action {
        NAME_CHANGED,
        DESC_CHANGED,
        CHANGE_COLOR,
        TOGGLE_VISIBILITY,
        TELEPORT,
        SAVE,
        DELETE,
        BACK;

        static Action from(String raw) {
            if (raw == null) {
                return null;
            }
            try {
                return valueOf(raw.toUpperCase());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
    }

    public static class WaypointEditData {
        public static final BuilderCodec<WaypointEditData> CODEC;

        private String action;
        private String nameValue;  // Captured from TextField value binding
        private String descValue;  // Captured from TextField value binding

        static {
            CODEC = BuilderCodec.builder(WaypointEditData.class, WaypointEditData::new)
                    .append(new KeyedCodec<>("Action", Codec.STRING),
                            (data, value) -> data.action = value,
                            (data) -> data.action)
                    .add()
                    .append(new KeyedCodec<>("@NameValue", Codec.STRING),
                            (data, value) -> data.nameValue = value,
                            (data) -> data.nameValue)
                    .add()
                    .append(new KeyedCodec<>("@DescValue", Codec.STRING),
                            (data, value) -> data.descValue = value,
                            (data) -> data.descValue)
                    .add()
                    .build();
        }
    }
}
