package com.nextlvlhash.waypoint;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;

import javax.annotation.Nonnull;
import java.util.UUID;

/**
 * Represents a player waypoint with position, metadata, and display settings.
 */
public class Waypoint {
    public static final BuilderCodec<Waypoint> CODEC;

    private String id;
    private String name;
    private String description;
    private int x;
    private int y;
    private int z;
    private String color;
    private String category;
    private String icon;
    private boolean visible;
    private boolean isGlobal;
    private String ownerUuid;
    private String ownerName;
    private long createdTime;

    public Waypoint() {
        this.id = UUID.randomUUID().toString();
        this.name = "Waypoint";
        this.description = "";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.color = WaypointIcon.WHITE.getHexColor();
        this.category = WaypointCategory.OTHER.name();
        this.icon = WaypointIcon.WHITE.name();
        this.visible = true;
        this.isGlobal = false;
        this.ownerUuid = "";
        this.ownerName = "";
        this.createdTime = System.currentTimeMillis();
    }

    public Waypoint(@Nonnull String name, int x, int y, int z, @Nonnull WaypointCategory category) {
        this();
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
        this.category = category.name();
        this.color = category.getDefaultColor();
    }

    @Nonnull
    public String getId() {
        return id != null ? id : "";
    }

    public void setId(@Nonnull String id) {
        this.id = id;
    }

    @Nonnull
    public String getName() {
        return name != null ? name : "Waypoint";
    }

    public void setName(@Nonnull String name) {
        this.name = name;
    }

    @Nonnull
    public String getDescription() {
        return description != null ? description : "";
    }

    public void setDescription(@Nonnull String description) {
        this.description = description;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getZ() {
        return z;
    }

    public void setZ(int z) {
        this.z = z;
    }

    @Nonnull
    public String getColor() {
        return color != null ? color : "#FF00FF";
    }

    public void setColor(@Nonnull String color) {
        this.color = color;
    }

    @Nonnull
    public WaypointCategory getCategory() {
        return WaypointCategory.fromString(category);
    }

    public void setCategory(@Nonnull WaypointCategory category) {
        this.category = category.name();
    }

    @Nonnull
    public WaypointIcon getIcon() {
        return WaypointIcon.fromString(icon);
    }

    public void setIcon(@Nonnull WaypointIcon icon) {
        this.icon = icon.name();
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }

    public boolean isGlobal() {
        return isGlobal;
    }

    public void setGlobal(boolean global) {
        isGlobal = global;
    }

    @Nonnull
    public String getOwnerUuid() {
        return ownerUuid != null ? ownerUuid : "";
    }

    public void setOwnerUuid(@Nonnull String ownerUuid) {
        this.ownerUuid = ownerUuid;
    }

    @Nonnull
    public String getOwnerName() {
        return ownerName != null ? ownerName : "";
    }

    public void setOwnerName(@Nonnull String ownerName) {
        this.ownerName = ownerName;
    }

    /**
     * Gets the icon image path for this waypoint.
     */
    @Nonnull
    public String getIconPath() {
        return getIcon().getIconPath();
    }

    /**
     * Calculates distance from this waypoint to given coordinates.
     */
    public double distanceTo(int targetX, int targetY, int targetZ) {
        int dx = this.x - targetX;
        int dy = this.y - targetY;
        int dz = this.z - targetZ;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Calculates 2D distance (ignoring Y) from this waypoint to given coordinates.
     */
    public double distance2DTo(int targetX, int targetZ) {
        int dx = this.x - targetX;
        int dz = this.z - targetZ;
        return Math.sqrt(dx * dx + dz * dz);
    }

    static {
        CODEC = BuilderCodec.builder(Waypoint.class, Waypoint::new)
            .append(new KeyedCodec<>("Id", Codec.STRING),
                    (o, i) -> o.id = i, (o) -> o.id).add()
            .append(new KeyedCodec<>("Name", Codec.STRING),
                    (o, i) -> o.name = i, (o) -> o.name).add()
            .append(new KeyedCodec<>("Description", Codec.STRING),
                    (o, i) -> o.description = i, (o) -> o.description).add()
            .append(new KeyedCodec<>("X", Codec.INTEGER),
                    (o, i) -> o.x = i, (o) -> o.x).add()
            .append(new KeyedCodec<>("Y", Codec.INTEGER),
                    (o, i) -> o.y = i, (o) -> o.y).add()
            .append(new KeyedCodec<>("Z", Codec.INTEGER),
                    (o, i) -> o.z = i, (o) -> o.z).add()
            .append(new KeyedCodec<>("Color", Codec.STRING),
                    (o, i) -> o.color = i, (o) -> o.color).add()
            .append(new KeyedCodec<>("Category", Codec.STRING),
                    (o, i) -> o.category = i, (o) -> o.category).add()
            .append(new KeyedCodec<>("Icon", Codec.STRING),
                    (o, i) -> o.icon = i, (o) -> o.icon).add()
            .append(new KeyedCodec<>("Visible", Codec.BOOLEAN),
                    (o, i) -> o.visible = i, (o) -> o.visible).add()
            .append(new KeyedCodec<>("IsGlobal", Codec.BOOLEAN),
                    (o, i) -> o.isGlobal = i, (o) -> o.isGlobal).add()
            .append(new KeyedCodec<>("OwnerUuid", Codec.STRING),
                    (o, i) -> o.ownerUuid = i, (o) -> o.ownerUuid).add()
            .append(new KeyedCodec<>("OwnerName", Codec.STRING),
                    (o, i) -> o.ownerName = i, (o) -> o.ownerName).add()
            .append(new KeyedCodec<>("CreatedTime", Codec.LONG),
                    (o, i) -> o.createdTime = i, (o) -> o.createdTime).add()
            .build();
    }
}
