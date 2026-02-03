package com.nextlvlhash.hud;

import com.hypixel.hytale.server.core.entity.entities.player.hud.CustomUIHud;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;

import javax.annotation.Nonnull;

/**
 * Displays HUD Menu button indicator.
 * Users can use /hudmenu command to open the menu.
 */
public class JButtonHud extends CustomUIHud {
    private static final String HUD_PATH = "hudisplay/jbutton.ui";
    private static final String RESOURCE_PATH = "Common/UI/Custom/hudisplay/jbutton.ui";

    private final String titleText;
    private final String pressText;
    private boolean isHidden = false;

    public JButtonHud(@Nonnull PlayerRef playerRef,
                      @Nonnull String titleText,
                      @Nonnull String pressText) {
        super(playerRef);
        this.titleText = titleText != null ? titleText : "HUD Menu";
        this.pressText = pressText != null ? pressText : "Use /hudmenu";
    }

    @Override
    protected void build(@Nonnull UICommandBuilder builder) {
        if (!resourceExists(RESOURCE_PATH)) {
            System.out.println("[JButtonHud] Warning: UI resource not found at " + RESOURCE_PATH);
            return;
        }

        builder.append(HUD_PATH);

        if (!this.titleText.isEmpty()) {
            builder.set("#JTitle.Text", this.titleText);
            builder.set("#JTitle.Visible", true);
        } else {
            builder.set("#JTitle.Visible", false);
        }

        if (!this.pressText.isEmpty()) {
            builder.set("#JPressText.Text", this.pressText);
            builder.set("#JPressText.Visible", true);
        } else {
            builder.set("#JPressText.Visible", false);
        }
    }

    public void hideContent() {
        this.isHidden = true;
        UICommandBuilder builder = new UICommandBuilder();
        builder.set("#HudMenuButton.Visible", false);
        builder.set("#JTitle.Visible", false);
        builder.set("#JPressText.Visible", false);
        this.update(false, builder);
    }

    public void showContent() {
        this.isHidden = false;
        UICommandBuilder builder = new UICommandBuilder();
        builder.set("#HudMenuButton.Visible", true);

        if (this.titleText != null && !this.titleText.isEmpty()) {
            builder.set("#JTitle.Visible", true);
        }
        if (this.pressText != null && !this.pressText.isEmpty()) {
            builder.set("#JPressText.Visible", true);
        }

        this.update(false, builder);
    }

    public boolean isHidden() {
        return this.isHidden;
    }

    private static boolean resourceExists(@Nonnull String path) {
        return JButtonHud.class.getClassLoader().getResource(path) != null;
    }
}
