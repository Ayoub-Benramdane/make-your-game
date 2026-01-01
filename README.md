# Make Your Game – Space Invaders Projects

This repository contains multiple versions of a **Space Invaders** game developed using **HTML, CSS, and vanilla JavaScript**.  
Each version focuses on a specific objective while respecting the same core principles: **performance, clean logic, and smooth gameplay at 60 FPS**.

No frameworks, no canvas, no external libraries are used.

---

## 1. Base Game – Core Gameplay

### Description
A classic single-player Space Invaders game where the player controls a spaceship to destroy invading enemies while avoiding their attacks.

### Main Features
- Smooth keyboard controls
- Shooting mechanics
- Enemy movement and attacks
- Score, lives, and timer display
- Pause menu (continue / restart)
- Game over screen
- Runs at **60 FPS** using `requestAnimationFrame`

### Learning Goals
- Game loop
- DOM manipulation
- FPS and performance optimization
- Event handling

---

## 2. Story Mode Version

### Description
This version adds a **story mode** to the game. The player progresses through a narrative that evolves during gameplay.

### Story Structure
- **Introduction**: Displayed before the game starts
- **Development**: Triggered when the player reaches a specific score
- **Conclusion**: Shown at the end of the game (win or loss)

### Learning Goals
- Game storytelling
- State-based game progression
- Narrative integration into gameplay

---

## 3. Different Maps Version (Tile Maps)

### Description
This version focuses on **tile map generation** using a **custom tile engine**.

### Key Requirements
- One tileset image for all tiles
- Custom tile map engine (no tile editors)
- At least **3 different maps**
- Each map has a unique layout
- Logical grid-based map structure

### Learning Goals
- Tile maps
- Image manipulation
- Rendering optimization
- Map-based game logic

---

## 4. Score Handling Backend

### Description
A backend service written in **Go** that handles game scores and scoreboards.

### Features
- REST API with `GET` and `POST`
- Stores scores in JSON format
- Scoreboard showing:
  - Rank
  - Player name
  - Score
  - Time
- Displays top 5 scores
- Pagination support
- Percentile display for submitted score

### Learning Goals
- API development
- JSON handling
- Sorting algorithms
- Backend and frontend integration

---

## Global Constraints

- Minimum **60 FPS**
- No frame drops
- Keyboard-only controls
- No frameworks
- No canvas
- Clean code and good practices

---

## Tools & Technologies

- HTML
- CSS
- JavaScript (DOM-based)
- Go (backend)
- Browser Developer Tools (Performance, FPS, Paint Flashing)

---

## Conclusion

These projects demonstrate different aspects of game development:
- Performance-critical rendering
- Game logic and structure
- Storytelling
- Tile map systems
- Backend score management
