package com.nextlvlhash.page;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.protocol.packets.interface_.Page;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.storage.WaypointStorage;

import javax.annotation.Nonnull;

/**
 * Main HUD menu page accessed via the J key.
 * Provides access to waypoint management and other HUD features.
 */
public class HudMenuPage extends InteractiveCustomUIPage<HudMenuPage.HudMenuData> {

    private final WaypointStorage storage;

    @SuppressWarnings("null")
    public HudMenuPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage) {
        super(playerRef, CustomPageLifetime.CanDismiss, HudMenuData.CODEC);
        this.storage = storage;
    }

    @Override
    public void build(@Nonnull Ref<EntityStore> ref,
                      @Nonnull UICommandBuilder ui,
                      @Nonnull UIEventBuilder events,
                      @Nonnull Store<EntityStore> store) {
        System.out.println("[HudMenuPage] build() method called - setting up UI");
        
        ui.append("hudmenu/hudmenu.ui");
        
        System.out.println("[HudMenuPage] UI file appended, adding event bindings");

        // Add event bindings for menu buttons
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#WaypointsButton",
                new EventData().put("Action", "WAYPOINTS"),
                false);
        System.out.println("[HudMenuPage] Added WaypointsButton binding");

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#SettingsButton",
                new EventData().put("Action", "SETTINGS"),
                false);
        System.out.println("[HudMenuPage] Added SettingsButton binding");

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#CloseButton",
                new EventData().put("Action", "CLOSE"),
                false);
        System.out.println("[HudMenuPage] Added CloseButton binding");
        
        System.out.println("[HudMenuPage] build() method complete");
    }

    @SuppressWarnings("null")
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref,
                                 @Nonnull Store<EntityStore> store,
                                 @Nonnull HudMenuData data) {
        super.handleDataEvent(ref, store, data);

        System.out.println("[HudMenuPage] handleDataEvent called with action: " + data.action);

        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            System.out.println("[HudMenuPage] Player component is null!");
            sendUpdate();
            return;
        }

        Action action = Action.from(data.action);
        if (action == null) {
            System.out.println("[HudMenuPage] Action is null for: " + data.action);
            sendUpdate();
            return;
        }

        System.out.println("[HudMenuPage] Processing action: " + action);

        switch (action) {
            case WAYPOINTS:
                // Open waypoint list directly
                System.out.println("[HudMenuPage] Opening waypoint list");
                player.getPageManager().openCustomPage(ref, store, new WaypointListPage(this.playerRef, this.storage));
                break;

            case SETTINGS:
                // Open settings page
                System.out.println("[HudMenuPage] Opening settings page");
                player.getPageManager().openCustomPage(ref, store, new WaypointSettingsPage(this.playerRef, this.storage));
                break;

            case CLOSE:
                // Close the menu
                System.out.println("[HudMenuPage] Closing menu");
                player.getPageManager().setPage(ref, store, Page.None);
                break;
        }
    }

    private enum Action {
        WAYPOINTS,
        SETTINGS,
        CLOSE;

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

    public static class HudMenuData {
        public static final BuilderCodec<HudMenuData> CODEC;

        private String action;

        static {
            CODEC = BuilderCodec.builder(HudMenuData.class, HudMenuData::new)
                    .append(new KeyedCodec<>("Action", Codec.STRING),
                            (data, value) -> data.action = value,
                            (data) -> data.action)
                    .add()
                    .build();
        }
    }
}
