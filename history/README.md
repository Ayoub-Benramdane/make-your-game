# Space Invaders – Story Mode

This project is a **single-player, story-driven Space Invaders game** built using **HTML, CSS, and vanilla JavaScript**.  
The objective is to recreate a classic arcade game while building a **custom game engine**, maintaining **smooth 60 FPS gameplay**, and implementing a **story mode** that evolves during play.

The game is developed using **plain JavaScript and the DOM**, without frameworks or canvas, with a strong focus on performance and animation consistency.

---

## Story Mode

This version introduces a **story mode** where the narrative progresses dynamically based on the player’s performance.

### Story Structure

The story is divided into three stages:

- **Introduction**  
  Displayed before the game starts.  
  Presents the invasion and the player’s mission.

- **Development**  
  Triggered when the player reaches a specific score or milestone during gameplay.  
  The situation escalates as the game progresses.

- **Conclusion**  
  Displayed when the game ends, either in victory or defeat.  
  The ending reflects the player’s outcome.

This ensures the story has **logic, progression, and interaction with gameplay**.

---

## Gameplay Features

- Single-player Space Invaders gameplay
- Continuous keyboard-controlled movement
- Shooting mechanics with enemy firing patterns
- Scoreboard displaying:
  - Score
  - Lives
  - Game timer
- Pause menu:
  - Continue
  - Restart
- Game over screen with story conclusion
- Starfield background animation
- Game loop powered by `requestAnimationFrame`

---

## Performance & Technical Requirements

- Runs at **60 FPS**
- No frame drops during gameplay or pause
- Proper use of `requestAnimationFrame`
- Minimal DOM layers for optimized rendering
- Smooth animations without jank or stuttering
- Continuous input handling (no key spamming)

---

## Controls

- **Arrow Left / Right**: Move the spaceship
- **Spacebar**: Shoot
- **P**: Pause / Resume
- **R**: Restart game
- **Enter**: Start game or continue after game over

---

## How to Run the Game

1. Open the project folder
2. Open `index.html` in a modern web browser
3. The introduction screen appears before gameplay starts

No installation or build step is required.

---

## Folder Structure

.
├── index.html # Game entry point and story screens
├── img/ # Game images and sprites
└── scripts/
├── game.js # Game logic and story progression
└── starfield.js # Background animation

---

## Development Rules

- No frameworks
- No canvas
- No external libraries
- Plain JavaScript, DOM, HTML, and CSS only
- Keyboard-only gameplay
- Performance tested using browser Developer Tools

---

## Learning Objectives

This project helps develop skills in:

- Story mode game design
- Custom game loop implementation
- `requestAnimationFrame`
- FPS optimization
- DOM-based animation
- Event loop behavior
- Performance profiling using browser dev tools

---

## Possible Improvements

- Multiple story paths
- Additional story checkpoints
- Adaptive difficulty
- Save system for story progress
- More narrative-driven visual effects
