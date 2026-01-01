# Space Invaders Game - Different Maps Version

A classic Space Invaders game implemented using HTML, CSS, and JavaScript. This version features multiple levels with different invader formations and map layouts. Control your spaceship to shoot down invading aliens while avoiding their bullets. The game features a scoring system, lives, and a time limit.

## Features

- Player spaceship movement with arrow keys
- Shooting mechanics to destroy invaders
- Multiple levels with unique invader formations
- Invader movement and firing patterns
- Score tracking and high score display
- Lives system (3 lives)
- 60-second game timer per level
- Pause functionality
- Game over and restart options
- Starfield background animation

## Tech Stack

- **HTML5**: Game structure and layout
- **CSS3**: Styling and animations
- **JavaScript (ES6+)**: Game logic and interactivity

## Installation

No installation required! This is a client-side web application.

1. Ensure you have a modern web browser (Chrome, Firefox, Safari, Edge)
2. Clone or download the project files

## How to Run the Project

1. Navigate to the `different-maps` directory
2. Open `index.html` in your web browser
3. The game will load and start automatically

### Controls

- **Arrow Left/Right**: Move spaceship
- **Spacebar**: Shoot
- **P**: Pause/Unpause
- **R**: Restart game
- **Enter**: Start new game (on game over screen)

## Folder Structure

```
different-maps/
├── index.html          # Main game HTML file
├── img/                # Game images and sprites
└── scripts/
    ├── game.js         # Main game logic (with multiple map levels)
    └── starfield.js    # Background starfield animation
```

## Future Improvements

- Add sound effects and background music
- Implement different difficulty levels
- Add power-ups and special weapons
- Include multiplayer mode
- Add score persistence with local storage
- Create mobile touch controls
- Add more enemy types and formations
- Implement achievements and leaderboards
- Add particle effects for explosions
- Create more diverse level designs
- Add level progression with increasing difficulty</content>
<parameter name="filePath">/home/spo/Documents/Repos/make-your-game/different-maps/README.md# Space Invaders – Different Maps Version

This project is a single-player **Space Invaders game** built using **HTML, CSS, and vanilla JavaScript**.  
This version focuses on **tile maps**, **map generation**, and **rendering performance**, while respecting the same principles as the base game project.

---

## Objectives

- Use a **custom tile map system**
- Generate maps using your **own engine**
- Use a **tileset image** (single image for all tiles)
- Create **at least 3 different maps**
- Keep smooth gameplay at **60 FPS**

---

## Tile Map System

- All tiles are stored in **one tileset image**
- Tiles are rendered by selecting parts of the tileset
- No tile editors are used
- Maps are defined using logical grid data (arrays)

Each map has its own layout and gameplay behavior.

---

## Features

- Keyboard-only controls
- Smooth movement and shooting
- Multiple tile-based maps
- Different enemy formations per map
- Score, lives, and timer display
- Pause menu:
  - Continue
  - Restart
- Game over screen
- Starfield background animation

---

## Performance

- Uses `requestAnimationFrame`
- Runs at **60 FPS**
- No frame drops
- Minimal DOM layers
- Only visible elements are rendered
- No canvas
- No frameworks

---

## Controls

- **Arrow Left / Right**: Move spaceship
- **Spacebar**: Shoot
- **P**: Pause / Resume
- **R**: Restart
- **Enter**: Start game / Restart after game over

---

## How to Run

1. Go to the `different-maps` directory
2. Open `index.html` in your browser
3. Play the game

No installation required.

---

## Folder Structure

different-maps/
├── index.html
├── img/
│ └── tileset.png
└── scripts/
├── game.js
└── starfield.js


---

## Learning Outcomes

- Tile maps
- Image manipulation
- Rendering optimization
