package com.nextlvlhash.hud;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.server.core.entity.entities.player.hud.CustomUIHud;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.element.ClockElement;
import com.nextlvlhash.storage.WaypointStorage;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.LocalDateTime;

/**
 * Main HUD combining clock and minimap.
 * Uses a single UICommandBuilder to batch all updates into one network packet.
 */
public class ClockHud extends CustomUIHud {

    private final ClockElement clockElement;
    private final MinimapHud minimapHud;

    public ClockHud(@Nonnull PlayerRef playerRef, @Nullable WaypointStorage waypointStorage) {
        super(playerRef);
        this.clockElement = new ClockElement();
        this.minimapHud = new MinimapHud(waypointStorage, playerRef.getUuid());
    }

    @Override
    public void build(@Nonnull UICommandBuilder builder) {
        minimapHud.build(builder);
        // Load appropriate clock position based on minimap settings
        if (minimapHud.isHudOnLeft()) {
            builder.append("hudisplay/clockhud_left.ui");
        } else {
            builder.append("hudisplay/clockhud_right.ui");
        }
    }

    /**
     * Main update method called every tick.
     * Batches all UI changes into a single network packet for optimal performance.
     *
     * @param dateTime current world time
     * @param world current world
     * @param storeRef entity store reference
     * @param playerRef player reference
     */
    public void update(@Nonnull LocalDateTime dateTime,
                       @Nonnull World world,
                       @Nonnull Ref<EntityStore> storeRef,
                       @Nonnull PlayerRef playerRef) {
        UICommandBuilder builder = new UICommandBuilder();
        boolean changed = false;

        // Add clock hand updates to builder
        changed |= clockElement.updateClockHand(builder, dateTime);

        // Add date updates to builder
        changed |= minimapHud.applyDate(builder, dateTime);

        // Add minimap updates (pixels + coords) to builder
        changed |= minimapHud.updateMap(builder, world, storeRef, playerRef);

        // Send single batched update if anything changed
        if (changed) {
            update(false, builder);
        }
    }
}
