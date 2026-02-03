package com.nextlvlhash.waypoint;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.server.core.universe.world.ParticleUtil;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import javax.annotation.Nonnull;

/**
 * Centralized helper for waypoint particle effects.
 */
public final class WaypointEffects {
    // Particle system id from the base assets. Adjust if you want a different effect.
    public static final String PARTICLE_SYSTEM_ID = "Status_Effect/Potion_Health/Potion_Health_Implosion";

    private WaypointEffects() {
    }

    @SuppressWarnings("null")
    public static void spawn(@Nonnull Vector3d position,
                             @Nonnull Ref<EntityStore> viewerRef,
                             @Nonnull Store<EntityStore> store) {
        ParticleUtil.spawnParticleEffect(PARTICLE_SYSTEM_ID, position,
            java.util.Collections.singletonList(viewerRef), store);
        ParticleUtil.spawnParticleEffect(PARTICLE_SYSTEM_ID, position, store);
    }
}
