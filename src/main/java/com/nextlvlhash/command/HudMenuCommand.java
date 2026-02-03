package com.nextlvlhash.command;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.GameMode;
import com.hypixel.hytale.server.core.Message;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import com.nextlvlhash.page.HudMenuPage;
import com.nextlvlhash.storage.WaypointStorage;

import javax.annotation.Nonnull;

/**
 * Command to open the HUD menu.
 */
public class HudMenuCommand extends AbstractPlayerCommand {

    private final WaypointStorage storage;

    public HudMenuCommand(@Nonnull WaypointStorage storage) {
        super("hudmenu", "Open the HUD menu");
        this.setPermissionGroup(GameMode.Adventure);
        this.storage = storage;
    }

    @SuppressWarnings("null")
    @Override
    protected void execute(@Nonnull CommandContext ctx,
                           @Nonnull Store<EntityStore> store,
                           @Nonnull Ref<EntityStore> ref,
                           @Nonnull PlayerRef playerRef,
                           @Nonnull World world) {
        Player player = store.getComponent(ref, Player.getComponentType());
        if (player == null) {
            ctx.sendMessage(Message.raw("§cError: Could not get player component."));
            return;
        }

        System.out.println("[HudMod] Opening HUD menu for player " + player.getDisplayName());
        
        // Open the HUD menu page
        player.getPageManager().openCustomPage(ref, store, new HudMenuPage(playerRef, storage));
        
        ctx.sendMessage(Message.raw("§aOpening HUD menu..."));
    }
}
