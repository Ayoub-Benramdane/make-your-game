# Score Handling Backend

## Project Overview

This project is a Go-based backend service designed to handle scoreboards for a game (such as Space Invaders). Its purpose is to collect, store, rank, and display player scores efficiently after each game session.

The service exposes a simple API that allows the game client to submit scores and retrieve ranked scoreboard data. Scores are stored in JSON format and sorted to always display the highest scores first.

The project focuses on API design, data handling with JSON, performance considerations, and sorting algorithms.

---

## How It Works

1. After a game ends, the player is asked to enter their name.
2. The game client sends the player name, score, and game duration to the backend using a POST request.
3. The backend stores each play in a JSON file.
4. Scores are sorted in descending order based on score value.
5. A scoreboard is generated showing the top scores.
6. The player is informed of their rank and percentile position.

After every game, whether the player wins or loses, the scoreboard is displayed with the five highest scores.

---

## Features

* **Scoreboard Management**

  * Stores each game result (name, score, time)
  * Sorts scores in descending order
  * Displays the top 5 scores
* **API Service**

  * Accepts POST requests to submit scores
  * Accepts GET requests to retrieve scoreboard data
* **JSON Storage**

  * Persists all scores in a JSON file
* **Ranking & Pagination**

  * Calculates player rank and percentile
  * Supports pagination for large score lists
* **Static Content Serving**

  * Serves the game interface and assets

---

## Scoreboard Format

Each scoreboard entry contains:

* Position (rank)
* Player name
* Score
* Time (in minutes and seconds)

Example:

```
Rank | Name | Score  | Time
----------------------------
1st  | Kave | 233254 | 12:01
2nd  | A.J. | 222555 | 03:00
3rd  | O.J. | 14356  | 05:40
4th  | -.-  | 13663  | 02:34
5th  | iris | 2354   | 00:40

<- Page 1/50 ->
```

For the submitted score, the backend also returns the percentile position, for example:

```
Congrats O.J, you are in the top 6%, on the 2nd position.
```

---

## API Endpoints

* **GET /**

  * Serves the game HTML page
* **GET /score**

  * Returns ranked scoreboard data in JSON format (paginated)
* **POST /score**

  * Submits a new score
  * Expects JSON payload containing player name, score, and time

---

## Tech Stack

* **Language**: Go
* **Web Server**: Standard library `net/http`
* **Data Storage**: JSON file
* **Allowed Packages**:

  * Go standard library
  * Gorilla WebSocket

---

## Installation

1. Install Go (latest stable version recommended)
2. Clone or navigate to the project directory
3. Run:

   ```bash
   go mod tidy
   ```

---

## Usage

1. Start the server:

   ```bash
   go run main.go
   ```
2. Open your browser and go to:

   ```
   http://localhost:8404
   ```
3. Play the game and submit your score after each session.

---

## Folder Structure

```
score-handling/
├── main.go              # Main server entry point
├── go.mod               # Go module definition
├── index.html           # Game interface
├── handler/             # API handlers and score logic
│   ├── scores.go        # Score handling and ranking logic
│   └── score.json       # JSON storage for scores
├── img/                 # Static image assets
└── scripts/             # Static JavaScript files
```

---

## Performance & Reliability

* Designed to handle frequent score submissions efficiently
* Uses in-memory sorting with controlled JSON persistence
* Validates input data to prevent malformed requests
* Never crashes unexpectedly on invalid input

---

## Learning Objectives

This project helps develop skills in:

* Designing and implementing RESTful APIs
* Handling GET and POST requests
* Working with JSON data
* Implementing sorting algorithms
* Managing rankings and pagination
* Writing clean, maintainable Go code
