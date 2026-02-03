# HudMod - Custom Minimap + Clock HUD + Waypoints

HudMod adds a clean, lightweight HUD overlay for Hytale with a circular minimap, a single‑hand clock, and a full waypoint management system. The minimap is rendered directly from the in‑game WorldMap data (the same source as the M‑key map), and the clock displays world time using a 12‑hour face.

## Features
- **Circular minimap** based on live WorldMap data
- **Waypoint system** with minimap markers (customizable colors/icons)
- **GUI waypoint manager** - Press **J** to open HUD menu
- Day counter + X/Y/Z coordinates under the map
- Single‑hand 12‑hour clock that updates on the hour
- Lightweight and non‑intrusive HUD layout
- Configurable HUD position (6 positions: top/middle/bottom × left/right)
- Auto death waypoints (optional)
- Paginated waypoint list with search
- Per-waypoint visibility toggle

## Commands
- `/waypoint add <name>` - Create waypoint at current position
- `/waypoint remove <name>` - Delete a waypoint
- `/waypoint list` - Show all waypoints
- `/waypoint toggle <name>` - Toggle waypoint visibility
- `/waypoint menu` - Open legacy text menu
- `/hudmenu` - Open graphical HUD menu (or press **J**)

## Installation
1. Build or download `HudMod-1.0.jar`.
2. Drop it into:
   - `%APPDATA%\Hytale\UserData\Mods` (client), or
   - the server `mods` folder.
3. Launch the game/server.

## Map Integration Status
**Current:** Waypoints appear on the custom minimap HUD (top-left corner).

**Future:** When Hytale adds the `AddMapMarker` API, waypoints will also appear on the native M-key world map. The infrastructure is already in place in `MapIntegrationSystem.java` - it just needs Hytale to expose the packet.

For now, use the minimap to see your waypoints. Check settings to adjust HUD position if needed.

## Notes
- Uses Custom UI assets under `Common/UI/Custom`.
- `manifest.json` includes `"IncludesAssetPack": true`.
- Waypoint data stored in `UserData/Mods/HudMod/waypoints/`

If you find issues or want new HUD elements, open a ticket or message the author.
