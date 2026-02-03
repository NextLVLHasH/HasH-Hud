package com.nextlvlhash.page;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.protocol.packets.interface_.CustomUIEventBindingType;
import com.hypixel.hytale.protocol.packets.interface_.Page;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.pages.InteractiveCustomUIPage;
import com.hypixel.hytale.server.core.modules.entity.component.TransformComponent;
import com.hypixel.hytale.server.core.ui.builder.EventData;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointCategory;
import com.nextlvlhash.waypoint.WaypointConfig;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Waypoint list page with search and add functionality.
 * Shows all waypoints as clickable buttons with centered text.
 * Supports pagination with 4 waypoints per page.
 */
public class WaypointListPage extends InteractiveCustomUIPage<WaypointListPage.WaypointListData> {

    private static final int WAYPOINTS_PER_PAGE = 4;
    private static final int MAX_WAYPOINTS = 12;
    private final WaypointStorage storage;
    
    // Current state (passed through constructor for page reopens)
    private final String currentSearchQuery;
    private final boolean isAddingWaypoint;
    private final int currentPage;
    private List<Waypoint> filteredWaypoints = new ArrayList<>();

    public WaypointListPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage) {
        this(playerRef, storage, "", false, 0);
    }

    public WaypointListPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage, 
                            @Nonnull String searchQuery, boolean isAddingWaypoint) {
        this(playerRef, storage, searchQuery, isAddingWaypoint, 0);
    }

    @SuppressWarnings("null")
    public WaypointListPage(@Nonnull PlayerRef playerRef, @Nonnull WaypointStorage storage, 
                            @Nonnull String searchQuery, boolean isAddingWaypoint, int page) {
        super(playerRef, CustomPageLifetime.CanDismiss, WaypointListData.CODEC);
        this.storage = storage;
        this.currentSearchQuery = searchQuery;
        this.isAddingWaypoint = isAddingWaypoint;
        this.currentPage = Math.max(0, page);
    }

    @SuppressWarnings("null")
    @Override
    public void build(@Nonnull Ref<EntityStore> ref,
                      @Nonnull UICommandBuilder ui,
                      @Nonnull UIEventBuilder events,
                      @Nonnull Store<EntityStore> store) {
        ui.append("hudmenu/waypointlist.ui");

        // Set the search input value to maintain search state across page reopens
        if (!currentSearchQuery.isEmpty()) {
            ui.set("#SearchInput.Value", currentSearchQuery);
        }

        // Build waypoint list with current search query
        buildWaypointList(ui, events, currentSearchQuery);

        // Get total waypoint count to check if max reached
        WaypointConfig config = storage.getWaypointConfig(playerRef.getUuid());
        int totalWaypoints = config.getWaypoints().size();
        boolean canAddMore = totalWaypoints < MAX_WAYPOINTS;

        // Set add form visibility based on state and max waypoint limit
        ui.set("#AddWaypointSection.Visible", isAddingWaypoint && canAddMore);
        ui.set("#AddWaypointButton.Visible", !isAddingWaypoint && canAddMore);

        // Search event - triggers page reopen with new query
        events.addEventBinding(CustomUIEventBindingType.ValueChanged,
                "#SearchInput",
                EventData.of("@SearchText", "#SearchInput.Value").put("Action", "SEARCH"),
                true);

        // Add waypoint button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#AddWaypointButton",
                new EventData().put("Action", "SHOW_ADD_FORM"),
                false);

        // Confirm add button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#ConfirmAddButton",
                EventData.of("@NewName", "#AddNameInput.Value").put("Action", "CONFIRM_ADD"),
                false);

        // Cancel add button
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#CancelAddButton",
                new EventData().put("Action", "CANCEL_ADD"),
                false);

        // Back button event
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#BackButton",
                new EventData().put("Action", "BACK"),
                false);

        // Page navigation buttons (1, 2, 3)
        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#Page1Button",
                new EventData().put("Action", "GO_TO_PAGE").put("PageNum", "0"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#Page2Button",
                new EventData().put("Action", "GO_TO_PAGE").put("PageNum", "1"),
                false);

        events.addEventBinding(CustomUIEventBindingType.Activating,
                "#Page3Button",
                new EventData().put("Action", "GO_TO_PAGE").put("PageNum", "2"),
                false);
    }

    private void buildWaypointList(@Nonnull UICommandBuilder ui,
                                   @Nonnull UIEventBuilder events,
                                   @Nonnull String query) {
        WaypointConfig config = storage.getWaypointConfig(playerRef.getUuid());
        List<Waypoint> waypoints = config.getWaypoints();

        // Filter waypoints by search query
        if (query.isEmpty()) {
            filteredWaypoints = new ArrayList<>(waypoints);
        } else {
            String lowerQuery = query.toLowerCase();
            filteredWaypoints = waypoints.stream()
                    .filter(wp -> wp.getName().toLowerCase().contains(lowerQuery))
                    .collect(Collectors.toList());
        }

        // Calculate pagination
        int totalWaypoints = filteredWaypoints.size();
        int totalPages = Math.max(1, (int) Math.ceil((double) totalWaypoints / WAYPOINTS_PER_PAGE));
        int safePage = Math.min(currentPage, totalPages - 1);
        int startIndex = safePage * WAYPOINTS_PER_PAGE;
        int endIndex = Math.min(startIndex + WAYPOINTS_PER_PAGE, totalWaypoints);

        // Show/hide no waypoints message
        boolean hasWaypoints = !filteredWaypoints.isEmpty();
        ui.set("#NoWaypointsLabel.Visible", !hasWaypoints);

        // Show page buttons based on total pages (max 3 pages supported)
        ui.set("#Page1Button.Visible", totalPages >= 1 && hasWaypoints);
        ui.set("#Page2Button.Visible", totalPages >= 2);
        ui.set("#Page3Button.Visible", totalPages >= 3);

        // Highlight current page by changing text color (gold for active)
        ui.set("#Page1Label.Style.TextColor", safePage == 0 ? "#FFD700" : "#FFFFFF");
        ui.set("#Page2Label.Style.TextColor", safePage == 1 ? "#FFD700" : "#FFFFFF");
        ui.set("#Page3Label.Style.TextColor", safePage == 2 ? "#FFD700" : "#FFFFFF");

        // Display waypoints for current page (4 per page)
        for (int i = 0; i < WAYPOINTS_PER_PAGE; i++) {
            String buttonId = "#Waypoint" + i;
            String labelId = "#Waypoint" + i + "Label";
            String iconId = "#Waypoint" + i + "Icon";

            int waypointIndex = startIndex + i;
            if (waypointIndex < endIndex) {
                Waypoint wp = filteredWaypoints.get(waypointIndex);
                ui.set(buttonId + ".Visible", true);
                ui.set(labelId + ".Text", wp.getName());

                // Set the waypoint icon color (solid color, not texture - TexturePath can't change at runtime)
                String iconColor = wp.getIcon().getHexColor();
                ui.set(iconId + ".Background", iconColor);

                // Set the waypoint label color to the waypoint's stored color so list matches marker
                String labelColor = wp.getColor();
                if (labelColor != null && !labelColor.isEmpty()) {
                    ui.set(labelId + ".Style.TextColor", labelColor);
                }

                // Add click event for this waypoint with its ID
                events.addEventBinding(CustomUIEventBindingType.Activating,
                        buttonId,
                        new EventData().put("Action", "SELECT_WAYPOINT").put("WaypointId", wp.getId()),
                        false);
            } else {
                ui.set(buttonId + ".Visible", false);
            }
        }
    }

    @SuppressWarnings("null")
    @Override
    public void handleDataEvent(@Nonnull Ref<EntityStore> ref,
                                 @Nonnull Store<EntityStore> store,
                                 @Nonnull WaypointListData data) {
        super.handleDataEvent(ref, store, data);

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
            case SEARCH:
                // Search - reopen page with new search query (reset to page 0)
                String newQuery = data.searchText != null ? data.searchText : "";
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointListPage(this.playerRef, this.storage, newQuery, false, 0));
                break;

            case SHOW_ADD_FORM:
                // Show the add waypoint form by reopening with addMode flag
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointListPage(this.playerRef, this.storage, currentSearchQuery, true, currentPage));
                break;

            case CONFIRM_ADD:
                // Add new waypoint with current player position
                String newName = data.newName != null ? data.newName.trim() : "";
                if (!newName.isEmpty()) {
                    addWaypoint(ref, store, newName);
                }
                // Reopen page without add mode to show updated list
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointListPage(this.playerRef, this.storage, currentSearchQuery, false, currentPage));
                break;

            case CANCEL_ADD:
                // Hide the add form by reopening without add mode
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointListPage(this.playerRef, this.storage, currentSearchQuery, false, currentPage));
                break;

            case PREV_PAGE:
            case NEXT_PAGE:
                // Deprecated - use GO_TO_PAGE instead
                break;

            case GO_TO_PAGE:
                // Go to specific page number
                int targetPage = 0;
                if (data.pageNum != null) {
                    try {
                        targetPage = Integer.parseInt(data.pageNum);
                    } catch (NumberFormatException e) {
                        targetPage = 0;
                    }
                }
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointListPage(this.playerRef, this.storage, currentSearchQuery, false, targetPage));
                break;

            case BACK:
                // Close the page (go back to game)
                player.getPageManager().setPage(ref, store, Page.None);
                break;

            case SETTINGS:
                // Open settings page
                player.getPageManager().openCustomPage(ref, store,
                        new WaypointSettingsPage(this.playerRef, this.storage));
                break;

            case SELECT_WAYPOINT:
                // Open edit page for selected waypoint
                if (data.waypointId != null && !data.waypointId.isEmpty()) {
                    @SuppressWarnings("")
                    Waypoint waypoint = storage.getWaypoint(playerRef.getUuid(), data.waypointId);
                    if (waypoint != null) {
                        // Check if player is an operator (has teleport permission)
                        boolean isOperator = checkOperatorStatus(player);
                        player.getPageManager().openCustomPage(ref, store,
                                new WaypointEditPage(this.playerRef, this.storage, waypoint, isOperator));
                    }
                }
                break;
        }
    }

    /**
     * Check if the player has operator status.
     * This can be customized based on your server's permission system.
     * For now, we'll always return true - you can modify this method
     * to check your specific permission system.
     */
    private boolean checkOperatorStatus(@Nonnull Player player) {
        // For now, allow teleport for all players (you can restrict this)
        // Example checks you could implement:
        // - Check a permission node: player.hasPermission("waypoint.teleport")
        // - Check player name list: OPERATOR_NAMES.contains(player.getDisplayName())
        // - Check a database or config file
        return true; // Allow teleport for all players by default
    }

    private void addWaypoint(@Nonnull Ref<EntityStore> ref,
                             @Nonnull Store<EntityStore> store,
                             @Nonnull String name) {
        try {
            // Get player's current position using TransformComponent
            TransformComponent transform = store.getComponent(ref, TransformComponent.getComponentType());
            if (transform != null) {
                Vector3d pos = transform.getPosition();
                int x = (int) Math.floor(pos.getX());
                int y = (int) Math.floor(pos.getY());
                int z = (int) Math.floor(pos.getZ());

                // Create new waypoint with 5-param constructor
                Waypoint waypoint = new Waypoint(name, x, y, z, WaypointCategory.OTHER);
                waypoint.setVisible(true);

                // Add to storage
                storage.addWaypoint(playerRef.getUuid(), waypoint);

                System.out.println("[HudMod] Added waypoint '" + name + "' at " + x + ", " + y + ", " + z);
            }
        } catch (Exception e) {
            System.out.println("[HudMod] Error adding waypoint: " + e.getMessage());
        }
    }

    private enum Action {
        SEARCH,
        SHOW_ADD_FORM,
        CONFIRM_ADD,
        CANCEL_ADD,
        BACK,
        SETTINGS,
        SELECT_WAYPOINT,
        PREV_PAGE,
        NEXT_PAGE,
        GO_TO_PAGE;

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

    public static class WaypointListData {
        public static final BuilderCodec<WaypointListData> CODEC;

        private String action;
        private String searchText;
        private String waypointId;
        private String newName;
        private String pageNum;

        static {
            CODEC = BuilderCodec.builder(WaypointListData.class, WaypointListData::new)
                    .append(new KeyedCodec<>("Action", Codec.STRING),
                            (data, value) -> data.action = value,
                            (data) -> data.action)
                    .add()
                    .append(new KeyedCodec<>("@SearchText", Codec.STRING),
                            (data, value) -> data.searchText = value,
                            (data) -> data.searchText)
                    .add()
                    .append(new KeyedCodec<>("WaypointId", Codec.STRING),
                            (data, value) -> data.waypointId = value,
                            (data) -> data.waypointId)
                    .add()
                    .append(new KeyedCodec<>("@NewName", Codec.STRING),
                            (data, value) -> data.newName = value,
                            (data) -> data.newName)
                    .add()
                    .append(new KeyedCodec<>("PageNum", Codec.STRING),
                            (data, value) -> data.pageNum = value,
                            (data) -> data.pageNum)
                    .add()
                    .build();
        }
    }
}
