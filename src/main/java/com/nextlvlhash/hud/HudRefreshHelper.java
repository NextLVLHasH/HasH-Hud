package com.nextlvlhash.hud;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.entities.player.hud.HudManager;
import com.hypixel.hytale.server.core.modules.time.WorldTimeResource;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.storage.WaypointStorage;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * Helper class to refresh/rebuild the custom HUD for a player.
 * Used when settings change that require the HUD to be rebuilt (e.g., position).
 */
public class HudRefreshHelper {

    /**
     * Rebuilds and sets the custom HUD for a player.
     * Call this after changing settings that affect HUD layout (like position).
     * This method ensures the HUD update runs on the world thread.
     *
     * @param ref Entity store reference
     * @param store Entity store
     * @param playerRef Player reference
     * @param waypointStorage Waypoint storage instance
     */
    @SuppressWarnings("null")
    public static void refreshHud(@Nonnull Ref<EntityStore> ref,
                                   @Nonnull Store<EntityStore> store,
                                   @Nonnull PlayerRef playerRef,
                                   @Nonnull WaypointStorage waypointStorage) {
        // Get the world from the store to ensure we run on the correct thread
        World world = store.getExternalData().getWorld();
        // Execute on the world thread
        world.execute(() -> {
            Player player = store.getComponent(ref, Player.getComponentType());
            if (player == null) {
                return;
            }

            // Create a new ClockHud with current settings
            ClockHud clockHud = new ClockHud(playerRef, waypointStorage);

            // Set the new HUD - this will rebuild with updated position
            HudManager hudManager = player.getHudManager();
            hudManager.setCustomHud(playerRef, clockHud);

            // Perform initial time sync so clock and minimap display correctly
            WorldTimeResource timeResource = store.getResource(WorldTimeResource.getResourceType());
            if (timeResource != null) {
                LocalDateTime dateTime = timeResource.getGameDateTime();
                clockHud.update(dateTime, world, ref, playerRef);
            }
        });
    }
}
