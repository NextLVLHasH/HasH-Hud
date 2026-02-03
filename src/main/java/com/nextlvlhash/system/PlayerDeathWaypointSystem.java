package com.nextlvlhash.system;

import com.hypixel.hytale.component.CommandBuffer;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.component.query.Query;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.UUIDComponent;
import com.hypixel.hytale.server.core.modules.entity.component.TransformComponent;
import com.hypixel.hytale.server.core.modules.entity.damage.DeathComponent;
import com.hypixel.hytale.server.core.modules.entity.damage.DeathSystems;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.waypoint.Waypoint;
import com.nextlvlhash.waypoint.WaypointCategory;

import javax.annotation.Nonnull;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * System that creates waypoints when players die.
 */
public class PlayerDeathWaypointSystem extends DeathSystems.OnDeathSystem {

    private final WaypointStorage storage;

    public PlayerDeathWaypointSystem(@Nonnull WaypointStorage storage) {
        this.storage = storage;
    }

    @Nonnull
    @Override
    public Query<EntityStore> getQuery() {
        return Query.and(Player.getComponentType());
    }

    @Override
    public void onComponentAdded(@Nonnull Ref<EntityStore> ref,
                                  @Nonnull DeathComponent component,
                                  @Nonnull Store<EntityStore> store,
                                  @Nonnull CommandBuffer<EntityStore> commandBuffer) {
        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            return;
        }

        UUIDComponent uuidComp = store.getComponent(ref, UUIDComponent.getComponentType());
        if (uuidComp == null) {
            return;
        }

        UUID uuid = uuidComp.getUuid();

        // Check if auto death waypoint is enabled for this player
        if (!storage.getWaypointConfig(uuid).isAutoDeathWaypoint()) {
            return;
        }

        TransformComponent transform = store.getComponent(ref, TransformComponent.getComponentType());
        if (transform == null) {
            return;
        }

        Vector3d pos = transform.getPosition();
        int x = (int) Math.floor(pos.getX());
        int y = (int) Math.floor(pos.getY());
        int z = (int) Math.floor(pos.getZ());

        String deathName = "Death " + new SimpleDateFormat("HH:mm:ss").format(new Date());
        Waypoint deathWaypoint = new Waypoint(deathName, x, y, z, WaypointCategory.DEATH);

        storage.addWaypoint(uuid, deathWaypoint);
    }
}
