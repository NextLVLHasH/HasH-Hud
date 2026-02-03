package com.nextlvlhash;

import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.HytaleServer;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.entity.UUIDComponent;
import com.hypixel.hytale.server.core.entity.entities.player.hud.HudManager;
import com.hypixel.hytale.server.core.event.events.player.PlayerDisconnectEvent;
import com.hypixel.hytale.server.core.event.events.player.PlayerReadyEvent;
import com.hypixel.hytale.server.core.io.adapter.PacketAdapters;
import com.hypixel.hytale.server.core.modules.time.WorldTimeResource;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.Universe;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.command.WaypointCommand;
import com.nextlvlhash.command.HudMenuCommand;
import com.nextlvlhash.hud.ClockHud;
import com.nextlvlhash.storage.WaypointStorage;
import com.nextlvlhash.system.PlayerDeathWaypointSystem;
import com.nextlvlhash.system.MapIntegrationSystem;
import com.nextlvlhash.system.HudMenuKeyFilter;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class hudmodmain extends JavaPlugin {

    private final ConcurrentHashMap<UUID, ScheduledFuture<?>> updateTasks = new ConcurrentHashMap<>();
    private WaypointStorage waypointStorage;
    private HudMenuKeyFilter hudMenuKeyFilter;

    public hudmodmain(@Nonnull JavaPluginInit init) {
        super(init);
    }

    @SuppressWarnings("null")
    @Override
    protected void setup() {
        // Initialize waypoint storage
        waypointStorage = new WaypointStorage(this.getDataDirectory());
        waypointStorage.init();

        // Register O key packet filter to open HUD menu
        hudMenuKeyFilter = new HudMenuKeyFilter(waypointStorage);
        PacketAdapters.registerInbound(hudMenuKeyFilter);
        System.out.println("[HudMod] Registered O key hotkey for HUD menu");

        // Register commands
        this.getCommandRegistry().registerCommand(new WaypointCommand(waypointStorage));
        this.getCommandRegistry().registerCommand(new HudMenuCommand(waypointStorage));

        // Register death waypoint system
        this.getEntityStoreRegistry().registerSystem(new PlayerDeathWaypointSystem(waypointStorage));

        // Show and initialize the HUD when the player is ready (has joined the world)
        this.getEventRegistry().registerGlobal(PlayerReadyEvent.class, event -> {
            Player player = event.getPlayer();

            // Perform periodic updates on the world thread once UI is loaded
            Ref<EntityStore> storeRef = event.getPlayerRef();
            Store<EntityStore> store = storeRef.getStore();
            World world = store.getExternalData().getWorld();

            // Get UUID from UUIDComponent instead of deprecated method
            UUIDComponent uuidComp = store.getComponent(storeRef, UUIDComponent.getComponentType());
            if (uuidComp == null) {
                System.out.println("[HudMod] Could not get UUID for player");
                return;
            }
            UUID uuid = uuidComp.getUuid();

            // Get PlayerRef using the UUID
            PlayerRef playerRef = Universe.get().getPlayer(uuid);

            ClockHud clockHud = new ClockHud(playerRef, waypointStorage);

            HudManager hudManager = player.getHudManager();
            hudManager.setCustomHud(playerRef, clockHud);
            System.out.println("[HudMod] Set custom HUD for " + player.getDisplayName());
            System.out.println("[HudMod] Press O to open HUD menu");

            // Initial sync so the minimap clock shows a single correct hand immediately
            world.execute(() -> {
                WorldTimeResource timeResource = storeRef.getStore()
                        .getResource(WorldTimeResource.getResourceType());
                LocalDateTime dateTime = timeResource.getGameDateTime();
                clockHud.update(dateTime, world, storeRef, playerRef);
                
                // Sync waypoints to native map on join
                MapIntegrationSystem.syncWaypointsToMap(player, waypointStorage);
            });

            ScheduledFuture<?> existing = updateTasks.remove(uuid);
            if (existing != null) {
                existing.cancel(false);
            }

            // Update HUD every 750ms for better performance
            ScheduledFuture<?> task = HytaleServer.SCHEDULED_EXECUTOR.scheduleAtFixedRate(() -> {
                if (!playerRef.isValid()) {
                    ScheduledFuture<?> running = updateTasks.remove(uuid);
                    if (running != null) {
                        running.cancel(false);
                    }
                    return;
                }

                world.execute(() -> {
                    if (!playerRef.isValid()) {
                        return;
                    }

                    WorldTimeResource timeResource = storeRef.getStore()
                            .getResource(WorldTimeResource.getResourceType());
                    LocalDateTime dateTime = timeResource.getGameDateTime();
                    clockHud.update(dateTime, world, storeRef, playerRef);
                });
            }, 750, 750, TimeUnit.MILLISECONDS);

            updateTasks.put(uuid, task);
        });

        this.getEventRegistry().registerGlobal(PlayerDisconnectEvent.class, event -> {
            PlayerRef playerRef = event.getPlayerRef();
            Ref<EntityStore> storeRef = playerRef.getReference();
            if (storeRef != null && storeRef.isValid()) {
                Store<EntityStore> store = storeRef.getStore();
                UUIDComponent uuidComp = store.getComponent(storeRef, UUIDComponent.getComponentType());
                if (uuidComp != null) {
                    UUID uuid = uuidComp.getUuid();
                    ScheduledFuture<?> task = updateTasks.remove(uuid);
                    if (task != null) {
                        task.cancel(false);
                    }
                    // Clear waypoint cache
                    waypointStorage.clearCache(uuid);
                    // Clean up O key filter state
                    hudMenuKeyFilter.onPlayerDisconnect(uuid);
                }
            }
        });

        System.out.println("[HudMod] initialized - Press O to open menu!");
    }
}
