# Cube Wars :gun:


## :mag_right: Installation

```bash


# used to run server locally
yarn global add serve

cd cube-wars

# run the website locally
serve
```



## :camera: Screenshots

![](HY54lH2.png)

![](MrgtDNt.png)

## CubeWars Game — Implementation Details

### Overview

CubeWars is a browser-based top-down zombie shooter implemented in
JavaScript using **PixiJS** (rendering), **Matter.js** (physics), and
**CreateJS** (animation tweens). The game runs entirely in the browser
and communicates with an external MFRL adaptation controller via
WebSocket.

---

### Architecture

The game is structured around a central `Game` class that owns and
coordinates all subsystems:

```
Game
├── World          — tile-based map, wall collisions, blood stains
├── Player         — movement, health, scoring, data submission
│   └── Weapons    — weapon cycling, firing, bullet management
│       └── Bullet — physics-based projectile, damage, knockback
├── ZombieManager  — level progression, zombie spawning, color/difficulty
│   └── Zombie     — AI pathfinding, physics, health, death animation
├── RegenPodManager — health pod spawning on level completion
│   └── RegenPod   — sensor-based health/ammo restoration pickup
├── NotificationManager — in-game HUD notifications
├── SoundManager   — background audio switching (normal / horror)
├── PostHandler    — HTTP POST of gameplay data to the server
└── ActionHandlerForEmotion — WebSocket receiver for MFRL adaptations
```

---

### Game Loop

The `Game.update(delta)` method runs every frame via the PixiJS ticker
and calls `update()` on each subsystem in order:

```
World → Player → ZombieManager → RegenPodManager → NotificationManager
```

Physics simulation runs independently via `Matter.Engine.run()`.
Collision events are handled through Matter.js event listeners,
covering: player–zombie contact damage, bullet–zombie knockback,
player–regenPod regeneration, and bullet–wall destruction.

---

### Player

- Moves via `WASD` / arrow keys with inertia-based velocity
  (`PLAYER_INERTIA`, `PLAYER_ACC` constants).
- Has a health bar rendered as a PIXI overlay; dies and redirects to
  `gameover.html` when health reaches 0.
- On death or timeout, gameplay data (`level`, `kills`) is submitted
  via `PostHandler` to the local server.

---

### Weapons & Bullets

- The player starts with one weapon; additional weapons unlock at
  score thresholds defined in `GUNS_DATA`.
- Each bullet is a physics body (`Matter.Bodies.circle`) with
  properties: `force`, `damage`, `durability`, `mass`, `radius`.
- Bullets are destroyed on wall contact or after `MAX_BULLET_LIFETIME`
  milliseconds.
- Firing direction is derived from movement keys; the weapon sprite
  rotates to reflect the aimed direction.

---

### Zombies & Difficulty

- Zombies use **A\* pathfinding** (`PathFinder`) to navigate toward
  the player through the tile grid.
- Each zombie has randomised acceleration (`getRandomZombieAcc()`),
  health, and a cooldown-gated attack.
- On death, zombies fade out via a CreateJS tween and are removed
  from the physics world.
- **Difficulty** is stored in `localStorage` (`gamemode` key) and
  controls the zombie count per level via `getZombieCount(level)`.
- **Zombie color** is changed at runtime via `ZombieManager.changecolor(hex)`,
  which redraws all alive zombies using PIXI Graphics. The default
  color is green (`0x6f9a8d`); red (`0xFF0000`) is used for
  high-arousal adaptation.

---

### MFRL Adaptation Interface

The `ActionHandlerForEmotion` class is the bridge between the
external MFRL controller (TypeScript) and the game. It:

1. Opens a **WebSocket** connection to `ws://localhost:8080`.
2. Listens for incoming `action_index` messages from the MFRL
   controller (filtering out its own messages by `clientId`).
3. Routes the action index to the corresponding game modification
   via a `switch-case`:

| Action index | Constant | Effect |
|---|---|---|
| 0 | `Hard` | Sets difficulty to HARD via `ZombieManager` |
| 1 | `Regular` | Sets difficulty to REGULAR |
| 2 | `Easy` | Sets difficulty to EASY |
| 3 | `Colorred` | Changes zombie color to red (`0xFF0000`) |
| 4 | `Colorgreen` | Changes zombie color to green (`0x6f9a8d`) |
| 5 | `Popuphidden` | Hides the overlay popup |
| 6 | `PopupVisible` | Shows popup: *"Try to kill the zombies and level up!"* |
| 7 | `SoundNormal` | Switches to normal background audio |
| 8 | `SoundHorror` | Switches to horror background audio |
| 9 | `DoNothing` | No change applied |

All adaptation changes are applied **instantaneously** at runtime
with no transition animation.

---

### Data Flow (Experiment)

```
Browser (CubeWars)
    │
    ├─── WebSocket (port 8080) ──► MFRL Controller (TypeScript)
    │                                   │
    │                              Q-learning agent
    │                              selects action_index
    │                                   │
    │◄── WebSocket action_index ─────────┘
    │
    ├─── HTTP POST (port 8080) ──► Server
    │    { level, kills, clientId }
    │
    └─── Face API (browser) ──► Emotion detection ──► MFRL input
```

---

### HTML Pages

| File | Purpose |
|---|---|
| `game.html` | Main game screen; loads all JS modules |
| `gameover.html` | Shown when player health reaches 0 |
| `WaitingScreen.html` | Waiting/transition screen between conditions |
