package com.nextlvlhash.page;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.hud.HudPosition;
import com.nextlvlhash.hud.HudRefreshHelper;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.WaypointConfig;

import javax.annotation.Nonnull;

/**
 * Settings page for waypoint system configuration.
 * Allows changing HUD position (left/right) and other preferences.
 */
public class WaypointSettingsPage extends InteractiveCustomUIPage<WaypointSettingsPage.SettingsData> {

    private final WaypointStorage storage;

    @SuppressWarnings("null")
    public WaypointSettingsPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage) {
        super(playerRef, CustomPageLifetime.CanDismiss, SettingsData.CODEC);
        this.storage = storage;
    }

    @SuppressWarnings("null")
    @Override
    public void build(@Nonnull Ref<EntityStore> ref,
                      @Nonnull UICommandBuilder ui,
                      @Nonnull UIEventBuilder events,
                      @Nonnull Store<EntityStore> store) {
        ui.append("hudmenu/waypointsettings.ui");

        // Get current config
        WaypointConfig config = storage.getWaypointConfig(playerRef.getUuid());

        // Set current values - show position grid number and display name
        HudPosition hudPos = config.getHudPosition();
        ui.set("#HudPositionValue.Text", hudPos.getGridNumber() + " - " + hudPos.getDisplayName());
        ui.set("#DeathWaypointValue.Text", config.isAutoDeathWaypoint() ? "ON" : "OFF");
        ui.set("#MaxWaypointsValue.Text", String.valueOf(config.getMaxWaypoints()));
        ui.set("#CurrentWaypointsValue.Text", String.valueOf(config.getWaypoints().size()));
        
        // Set zoom slider value
        int zoomValue = config.getMinimapZoom();
        ui.set("#ZoomSlider.Value", zoomValue);
        ui.set("#ZoomValue.Text", zoomValue + "x");

        // Zoom slider event binding
        events.addEventBinding(CustomUIEventBindingType.ValueChanged,
                "#ZoomSlider",
                new EventData().put("Action", "ZOOM_CHANGED"),
                false);

        // Toggle position button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#TogglePositionButton",
                new EventData().put("Action", "TOGGLE_POSITION"),
                false);

        // Toggle death waypoint button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#ToggleDeathWaypointButton",
                new EventData().put("Action", "TOGGLE_DEATH_WP"),
                false);

        // Save button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#SaveButton",
                new EventData().put("Action", "SAVE"),
                false);

        // Back button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#BackButton",
                new EventData().put("Action", "BACK"),
                false);
    }

    @SuppressWarnings("null")
    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref,
                                 @Nonnull Store<EntityStore> store,
                                 @Nonnull SettingsData data) {

        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            return;
        }

        Action action = Action.from(data.action);
        if (action == null) {
            sendUpdate();
            return;
        }

        WaypointConfig config = storage.getWaypointConfig(playerRef.getUuid());

        switch (action) {
            case ZOOM_CHANGED:
                // Update zoom value from slider
                if (data.zoomValue != null) {
                    int newZoom = data.zoomValue.intValue();
                    config.setMinimapZoom(newZoom);
                    
                    // Refresh the HUD to apply new zoom setting immediately
                    HudRefreshHelper.refreshHud(ref, store, playerRef, storage);
                    
                    // Reopen page to update display
                    player.getPageManager().openCustomPage(ref, store,
                            new WaypointSettingsPage(this.playerRef, this.storage));
                }
                break;

            case TOGGLE_POSITION:
                // Cycle to next position (1->2->3->4->5->6->7->8->9->1)
                config.cycleHudPosition();
                
                // Reopen page to show update
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointSettingsPage(this.playerRef, this.storage));
                break;

            case TOGGLE_DEATH_WP:
                // Toggle auto death waypoint
                config.setAutoDeathWaypoint(!config.isAutoDeathWaypoint());
                
                // Reopen page to show update
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointSettingsPage(this.playerRef, this.storage));
                break;

            case SAVE:
                // Save config
                WaypointConfig config2 = storage.getWaypointConfig(playerRef.getUuid());
                storage.saveWaypointConfig(playerRef.getUuid(), config2).thenAccept(v -> {
                    player.sendMessage(Message.raw("§aSettings saved!"));
                    
                    // Refresh the HUD to apply new position setting
                    HudRefreshHelper.refreshHud(ref, store, playerRef, storage);
                    
                    // Return to main menu
                    player.getPageManager().openCustomPage(ref, store,
                            new HudMenuPage(this.playerRef, this.storage));
                });
                sendUpdate();
                break;

            case BACK:
                // Save config and refresh HUD before returning to main menu
                WaypointConfig configToSave = storage.getWaypointConfig(playerRef.getUuid());
                storage.saveWaypointConfig(playerRef.getUuid(), configToSave).thenAccept(v -> {
                    // Refresh the HUD to apply new position setting
                    HudRefreshHelper.refreshHud(ref, store, playerRef, storage);
                });
                // Return to main menu
                player.getPageManager().openCustomPage(ref, store,
                        new HudMenuPage(this.playerRef, this.storage));
                break;
        }
    }

    private enum Action {
        ZOOM_CHANGED,
        TOGGLE_POSITION,
        TOGGLE_DEATH_WP,
        SAVE,
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

    public static class SettingsData {
        public static final BuilderCodec<SettingsData> CODEC;

        private String action;
        private Double zoomValue;

        static {
            CODEC = BuilderCodec.builder(SettingsData.class, SettingsData::new)
                    .append(new KeyedCodec<>("Action", Codec.STRING),
                            (data, value) -> data.action = value,
                            (data) -> data.action)
                    .add()
                    .append(new KeyedCodec<>("ZoomSlider.Value", Codec.DOUBLE),
                            (data, value) -> data.zoomValue = value,
                            (data) -> data.zoomValue)
                    .add()
                    .build();
        }
    }
}
