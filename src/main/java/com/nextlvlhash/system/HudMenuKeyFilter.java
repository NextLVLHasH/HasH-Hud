package com.nextlvlhash.system;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.InteractionType;
import com.hypixel.hytale.protocol.Packet;
import com.hypixel.hytale.protocol.packets.interaction.SyncInteractionChain;
import com.hypixel.hytale.protocol.packets.interaction.SyncInteractionChains;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.io.adapter.PlayerPacketFilter;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.page.HudMenuPage;
import com.nextlvlhash.storage.WaypointStorage;

import javax.annotation.Nonnull;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Packet filter that captures the O key (GameModeSwap interaction) to open the HUD menu.
 * This allows players to press O to open the HUD menu without typing a command.
 */
public class HudMenuKeyFilter implements PlayerPacketFilter {

    private final WaypointStorage waypointStorage;
    private final Map<UUID, Long> lastTriggerMs = new ConcurrentHashMap<>();
    private static final long COOLDOWN_MS = 500L; // Prevent double triggers

    public HudMenuKeyFilter(@Nonnull WaypointStorage waypointStorage) {
        this.waypointStorage = waypointStorage;
    }

    @Override
    public boolean test(@SuppressWarnings("null") @Nonnull PlayerRef playerRef, @SuppressWarnings("null") @Nonnull Packet packet) {
        // Only process SyncInteractionChains packets
        if (!(packet instanceof SyncInteractionChains)) {
            return false;
        }

        SyncInteractionChains syncPacket = (SyncInteractionChains) packet;
        SyncInteractionChain[] updates = syncPacket.updates;
        
        if (updates == null || updates.length == 0) {
            return false;
        }

        // Check each interaction chain for GameModeSwap (O key)
        for (SyncInteractionChain chain : updates) {
            if (chain == null) {
                continue;
            }

            if (chain.interactionType == InteractionType.GameModeSwap) {
                // O key was pressed - open HUD menu
                return handleOKeyPress(playerRef);
            }
        }

        return false;
    }

    private boolean handleOKeyPress(@Nonnull PlayerRef playerRef) {
        UUID uuid = playerRef.getUuid();
        
        // Cooldown check to prevent double triggers
        long now = System.currentTimeMillis();
        Long lastTrigger = lastTriggerMs.get(uuid);
        if (lastTrigger != null && (now - lastTrigger) < COOLDOWN_MS) {
            return true; // Block the packet but don't open menu again
        }
        lastTriggerMs.put(uuid, now);

        try {
            Ref<EntityStore> storeRef = playerRef.getReference();
            if (storeRef == null || !storeRef.isValid()) {
                return false;
            }
            Store<EntityStore> store = storeRef.getStore();

            // Get Player component from store
            Player player = store.getComponent(storeRef, Player.getComponentType());
            if (player == null) {
                System.out.println("[HudMod] O key pressed but player component not found");
                return false;
            }

            // Open HUD menu page
            String username = playerRef.getUsername();
            System.out.println("[HudMod] O key pressed - creating HudMenuPage for " + username);
            @SuppressWarnings("null")
            HudMenuPage hudMenuPage = new HudMenuPage(playerRef, waypointStorage);
            System.out.println("[HudMod] HudMenuPage instance created: " + hudMenuPage);
            System.out.println("[HudMod] Opening page via PageManager...");
            player.getPageManager().openCustomPage(storeRef, store, hudMenuPage);
            System.out.println("[HudMod] openCustomPage() call completed");

            // Return true to consume the packet (prevent gamemode swap)
            return true;
        } catch (Exception e) {
            System.out.println("[HudMod] Error handling O key press: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Clean up player data on disconnect
     */
    public void onPlayerDisconnect(@Nonnull UUID uuid) {
        lastTriggerMs.remove(uuid);
    }
}
