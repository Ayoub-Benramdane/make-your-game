# Space Invaders Game

## Project Overview

This project is a single-player Space Invaders game built using plain HTML, CSS, and JavaScript. The goal is to create a smooth and responsive browser game that runs consistently at **60 FPS**, without using frameworks or the `<canvas>` element.

The game implements its own simple engine using the DOM and `requestAnimationFrame`, focusing heavily on performance, smooth animations, and responsive keyboard controls.

This project explores how modern browsers handle rendering, animations, and input, while avoiding frame drops and visual stuttering (jank).

---

## Objectives

* Run the game at **60 FPS** consistently
* Avoid frame drops and jank animations
* Use `requestAnimationFrame` correctly
* Measure and monitor performance using browser developer tools
* Implement smooth keyboard controls (no key spamming required)
* Build the game engine using **plain JavaScript and DOM only**

No frameworks and no canvas are used.

---

## How It Works

* The game loop is driven by `requestAnimationFrame`
* Player input is handled using keyboard event listeners
* Holding down a key results in continuous movement or shooting
* Releasing a key immediately stops the action
* Game objects (player, invaders, bullets) are updated and rendered each frame
* Rendering layers are kept minimal to optimize performance

Animations are based on transforms and opacity to reduce layout and paint costs.

---

## Features

* **60 FPS Game Loop** using `requestAnimationFrame`
* **Smooth Keyboard Controls** (no stuttering or input lag)
* **Pause Menu**

  * Continue game
  * Restart game
* **Scoreboard** displaying:

  * Score
  * Remaining lives
  * Countdown timer
* **Game States**

  * Playing
  * Paused
  * Game Over
* **Starfield Background Animation** optimized for performance

---

## Controls

* **Arrow Left / Right**: Move spaceship
* **Spacebar**: Shoot
* **P**: Pause / Resume game
* **R**: Restart game
* **Enter**: Start a new game after game over

Controls are designed to be smooth: holding a key continues the action, releasing it stops immediately.

---

## Performance Considerations

* Uses `requestAnimationFrame` for consistent frame timing
* Avoids unnecessary DOM updates
* Minimizes rendering layers
* Uses CSS transforms instead of layout-heavy properties
* Designed to avoid frame drops, even when paused

Performance can be analyzed using browser Developer Tools:

* FPS monitoring
* Frame timing
* Paint flashing
* Task execution time

---

## Tech Stack

* **HTML5**: Structure and layout
* **CSS3**: Styling, animations, transforms
* **JavaScript (ES6+)**: Game loop, logic, input handling

---

## Installation

No installation required.

1. Use a modern web browser (Firefox, Chrome, Edge, Safari)
2. Clone or download the repository

---

## How to Run the Project

1. Navigate to the project directory
2. Open `index.html` in your browser
3. The game starts automatically

---

## Folder Structure

```
make-your-game/
├── index.html          # Main game HTML file
├── img/                # Game images and sprites
└── scripts/
    ├── game.js         # Core game engine and logic
    └── starfield.js    # Optimized background animation
```

---

## Genre

This game follows the **Space Invaders** genre, respecting the constraints of the classic gameplay while focusing on modern performance requirements.

---

## Learning Objectives

This project helps develop skills in:

* `requestAnimationFrame`
* Event loop and frame timing
* FPS optimization
* DOM-based rendering
* Smooth animations without jank
* Keyboard input handling
* Performance analysis using Developer Tools

---

## Future Improvements

* Add sound effects and background music
* Implement difficulty scaling
* Add power-ups and special weapons
* Improve enemy AI patterns
* Add visual effects while preserving performance
* Integrate scoreboard backend service
