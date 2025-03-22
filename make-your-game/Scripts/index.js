const gameContainer = document.getElementById("game-container");

const INVADER_ROWS = 4;
const INVADER_COLS = 8;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 5;
const INVADER_BULLET_SPEED = 4;
const INVADER_MOVE_INTERVAL = 100;
const INVADER_FIRE_INTERVAL = 1000;
const INITIAL_LIVES = 3;
const GAME_DURATION = 60;
let timer_death;


// Game State
const gameState = {
    player: document.querySelector('img'),
    ecran: document.getElementById('game-container'),
    invaders: [],
    bullets: [],
    invaderBullets: [],
    lives: INITIAL_LIVES,
    score: 0,
    countdown: GAME_DURATION,
    isPaused: false,
    invaderDirection: 1,
    lastFireTime: 0,
    lastInvaderFireTime: 0,
    playerX: 0,
    playerY: 0,
    keys: {
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
        p: false,
        r: false,
        Enter: false
    }
};
gameState.player.width = 90;
gameState.player.height = 50;

// Initialization
function init() {
    setupPlayer();
    setupHeader();
    createHUD();
    createInvaders();
    updateGameState();
    gameLoop();
}

function setupPlayer() {
    gameState.player.style.position = 'absolute';
    gameState.player.style.display = "block";
    gameState.playerX = (gameState.ecran.offsetWidth - gameState.player.offsetWidth) / 2;
    gameState.playerY = gameState.ecran.offsetHeight - gameState.player.offsetHeight;
    positionPlayer();
}

function setupHeader() {
    const header = document.createElement('div');
    header.id = "header";
    header.style.height = "40px";
    header.style.top = "10px";
    header.style.border = "1px solid rgb(255, 255, 255)";
    gameContainer.appendChild(header);
}

function createHUD() {
    createCountdown();
    createScore();
    createLives();
}

function createCountdown() {
    const countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.innerHTML = `
        <p style="margin: 0; color: rgb(255, 255, 255);">
            Timer: <span id="countdownValue">${gameState.countdown}</span>
        </p>`;
    countdownElement.style.cssText = 'position:absolute;top:10px;left:140px;font:bold 20px Arial;';
    gameState.ecran.appendChild(countdownElement);
}

function createScore() {
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.innerHTML = `
        <p style="margin: 0; color: rgb(255, 255, 255);">
            Score: <span id="scoreValue">${gameState.score}</span>
        </p>`;
    scoreElement.style.cssText = 'position:absolute;top:10px;left:20px;font:bold 20px Arial;';
    gameState.ecran.appendChild(scoreElement);
}

function createLives() {
    const livesContainer = document.createElement('div');
    livesContainer.style.cssText = 'position:absolute;top:2px;left:30px;';
    for (let i = 0; i < INITIAL_LIVES; i++) {
        const life = createLifeElement(i);
        livesContainer.appendChild(life);
    }
    gameState.ecran.appendChild(livesContainer);
}

function createLifeElement(index) {
    const life = document.createElement('img');
    life.className = 'life';
    life.src = "./img/life.png";
    life.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        left: ${gameState.ecran.offsetWidth - (index + 1) * 40 - 30}px;
        top: 2px;
    `;
    return life;
}

function createInvaders() {
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < INVADER_ROWS; row++) {
        for (let col = 0 + row; col < INVADER_COLS - row; col++) {
            const invader = createInvaderElement(row, col);
            fragment.appendChild(invader);
            gameState.invaders.push({
                element: invader,
                x: col * 60 + 30,
                y: row * 60 + 50
            });
        }
    }
    gameState.ecran.appendChild(fragment);
}

function createInvaderElement(row, col) {
    const isSpecial = row === col || col === INVADER_COLS - row - 1;
    const invader = document.createElement('img');
    invader.src = isSpecial ? './img/enemy2.png' : './img/invader.png';
    invader.style.cssText = `
        position: absolute;
        width: ${isSpecial ? 30 : 40}px;
        height: ${isSpecial ? 30 : 40}px;
        left: ${col * 60 + 30}px;
        top: ${row * 60 + 50}px;
    `;
    return invader;
}

function updateInvaders(timestamp) {
    if (timestamp - gameState.lastInvaderFireTime > INVADER_FIRE_INTERVAL) {
        invaderFiring();
        gameState.lastInvaderFireTime = timestamp;
    }

    let shouldReverse = false;
    gameState.invaders.forEach(invader => {
        const newX = invader.x + 1 * gameState.invaderDirection;
        invader.x = newX;
        invader.element.style.left = `${newX}px`;

        if (newX > gameState.ecran.offsetWidth - 40 || newX < 10) {
            shouldReverse = true;
        }
    });

    if (shouldReverse) {
        gameState.invaderDirection *= -1;
        gameState.invaders.forEach(invader => {
            invader.y += 10;
            invader.element.style.top = `${invader.y}px`;
            if (invader.y > gameState.ecran.offsetHeight - 100) {
                endGame(false);
            }
        });
    }
}

function updateBullets() {
    // Update player bullets
    gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= BULLET_SPEED;
        bullet.element.style.top = `${bullet.y}px`;
        if (parseInt(bullet.element.style.top) <= 0) {
            bullet.element.remove();
            return false;
        }
        return bullet.y > 0;
    });

    // Update invader bullets
    gameState.invaderBullets = gameState.invaderBullets.filter(bullet => {
        bullet.y += INVADER_BULLET_SPEED;
        bullet.element.style.top = `${bullet.y}px`;
        return bullet.y < gameState.ecran.offsetHeight;
    });
}

function checkCollisions() {
    // Player bullets vs invaders
    gameState.bullets.forEach((bullet, bulletIndex) => {
        gameState.invaders.forEach((invader, invaderIndex) => {
            if (checkCollision(bullet.element, invader.element)) {
                gameState.ecran.removeChild(bullet.element);
                gameState.ecran.removeChild(invader.element);
                gameState.bullets.splice(bulletIndex, 1);
                gameState.invaders.splice(invaderIndex, 1);
                gameState.score += 10;
                document.getElementById('scoreValue').textContent = gameState.score;
            }
        });
    });

    // Invader bullets vs player
    gameState.invaderBullets.forEach((bullet, index) => {
        if (checkCollision(bullet.element, gameState.player)) {
            handlePlayerHit();
            gameState.ecran.removeChild(bullet.element);
            gameState.invaderBullets.splice(index, 1);
        }
    });
}

function checkCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function handlePlayerHit() {
    gameState.lives--;
    updateLivesDisplay();
    if (gameState.lives <= 0) {
        endGame(false);
        return;
    }

    gameState.player.style.transition = 'opacity 0.3s';
    gameState.player.style.opacity = '0.1';
    setTimeout(() => gameState.player.style.opacity = '1', 300);
    setupPlayer();
}

function updateLivesDisplay() {
    const livesContainer = gameState.ecran.querySelector('.life').parentElement;
    livesContainer.innerHTML = '';
    for (let i = 0; i < gameState.lives; i++) {
        livesContainer.appendChild(createLifeElement(i));
    }
}

function updateGameState() {
    gameState.countdown--;
    if (gameState.countdown == 0) {
        clearInterval(timer_death);
        endGame(false);
    }
    document.getElementById('countdownValue').textContent = `${gameState.countdown}`;
}

function endGame(success) {
    gameState.isPaused = true;
    clearInterval(timer_death);
    showGameMenu(success);
}

function showGameMenu(isVictory) {
    const menu = document.createElement('div');
    menu.id = 'gameMenu';
    menu.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        z-index: 1000;
    `;

    menu.innerHTML = `
        <div style="background-color: transparent; border-radius: 8px; border: 2px solid rgb(255, 255, 255); height: 30%; width: 30%">
        <div style="border: 2px solid rgb(255, 255, 255);">
            <h2>${isVictory ? 'Victory!' : 'Game Over'}</h2>
        </div>
        <p>Score: ${gameState.score}</p>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="restartButton">Restart</button>
        </div>
    `;

    menu.querySelector('#restartButton').addEventListener('click', () => location.reload());

    gameState.ecran.appendChild(menu);
}

function showPauseMenu() {
    const menu = document.createElement('div');
    menu.id = 'pauseMenu';
    menu.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        z-index: 1000;
    `;

    menu.innerHTML = `
        <div style="background-color: transparent; border-radius: 8px; border: 2px solid rgb(255, 255, 255); height: 30%; width: 30%">
        <div style="border: 2px solid rgb(255, 255, 255); padding: 0;">
            <h2 style="">Pause Game</h2>
        </div>
        <br><br>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="restartButton">Restart</button>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="continueButton">Continue</button>
        </div>
    `;

    menu.querySelector('#restartButton').addEventListener('click', () => {
        location.reload();
        resetGame();
    });
    menu.querySelector('#continueButton').addEventListener('click', () => {
        Continue(menu);
    });

    gameState.ecran.appendChild(menu);
}

function Continue(menu) {
    gameState.isPaused = false;
    gameState.ecran.removeChild(menu);
    timer_death = setInterval(updateGameState, 1000);
}

function resetGame() {
    gameState.isPaused = false;
    gameState.lives = INITIAL_LIVES;
    gameState.score = 0;
    gameState.countdown = GAME_DURATION;
    updateLivesDisplay();
    document.getElementById('scoreValue').textContent = '0';
    document.getElementById('countdownValue').textContent = GAME_DURATION;
    gameLoop();
}

function positionPlayer() {
    gameState.player.style.left = `${gameState.playerX}px`;
    gameState.player.style.top = `${gameState.playerY}px`;
}

function fireBullet() {
    if (Date.now() - gameState.lastFireTime < 600) return;

    const bullet = document.createElement('div');
    bullet.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: red;
        left: ${gameState.playerX + gameState.player.offsetWidth / 2 - 3}px;
        top: ${gameState.playerY - 15}px;
    `;

    gameState.ecran.appendChild(bullet);
    gameState.bullets.push({
        element: bullet,
        y: gameState.playerY - 15
    });
    gameState.lastFireTime = Date.now();
}

function invaderFiring() {
    if (gameState.invaders.length === 0) {
        endGame(true);
        return;
    }
    const invader = gameState.invaders[Math.floor(Math.random() * gameState.invaders.length)];
    const bullet = document.createElement('div');
    bullet.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: red;
        left: ${parseInt(invader.element.style.left) + 22}px;
        top: ${parseInt(invader.element.style.top) + 50}px;
    `;

    gameState.ecran.appendChild(bullet);
    gameState.invaderBullets.push({
        element: bullet,
        y: parseInt(invader.element.style.top) + 50
    });
}

function togglePause() {
    gameState.isPaused = true;
    clearInterval(timer_death);
    showPauseMenu();
    if (!gameState.isPaused) gameLoop();
}

function handleResize() {
    gameState.playerX = Math.min(
        Math.max(30, gameState.playerX),
        gameState.ecran.offsetWidth - gameState.player.offsetWidth - 30
    );
    positionPlayer();
}

let gameStart = false;
function drawBackground() {
    gameContainer.style.backgroundColor = "black";
}

var flash = false;
function drawStart() {
    drawBackground();
    if (flash) {
        let text = "Press Enter To Start";
        let fontSize = "24px";
        let startDiv = document.createElement("div");
        startDiv.style.position = "absolute";
        startDiv.style.top = (gameContainer.clientHeight / 2 - 30) + "px";
        startDiv.style.left = (gameContainer.clientWidth / 2 - 300) + "px";
        startDiv.style.width = "600px";
        startDiv.style.fontFamily = "'Press Start 2P', cursive";
        startDiv.style.fontSize = fontSize;
        startDiv.style.color = "white";
        startDiv.style.textAlign = "center";
        startDiv.innerText = text;
        gameContainer.appendChild(startDiv);
        setTimeout(() => { startDiv.remove(); }, 400);
        flash = false;
    } else flash = true;
};

function gameLoop(timestamp = 0) {
    drawBackground();

    if (!gameState.isPaused) {
        updateInvaders(timestamp);
        updateBullets();
        checkCollisions();
    }

    requestAnimationFrame(gameLoop);
};

drawStart();
let presStart = setInterval(drawStart, 400);

function setupEventListeners() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
}
setupEventListeners();

function handleKeyDown(e) {    
    switch (e.key) {
        case 'ArrowLeft':
            gameState.keys.ArrowLeft = true;
            break;
        case 'ArrowRight':
            gameState.keys.ArrowRight = true;
            break;
        case ' ':
            gameState.keys.Space = true;
            break;
        case 'p':
            gameState.keys.p = true;
            break;
        case 'r':
            gameState.keys.r = true;
            break;
        case 'Enter':
            gameState.keys.Enter = true;
            break;
    }
}

function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowLeft':
            gameState.keys.ArrowLeft = false;
            break;
        case 'ArrowRight':
            gameState.keys.ArrowRight = false;
            break;
        case ' ':
            gameState.keys.Space = false;
            break;
        case 'p':
            gameState.keys.p = false;
            break;
        case 'r':
            gameState.keys.r = false;
            break;
        case 'Enter':
            gameState.keys.Enter = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (gameState.keys.ArrowLeft === true && !gameState.isPaused) {
        gameState.playerX = Math.max(4, gameState.playerX - PLAYER_SPEED);
    } else if (gameState.keys.ArrowRight === true && !gameState.isPaused) {
        gameState.playerX = Math.min(
            gameState.ecran.offsetWidth - gameState.player.offsetWidth - 4,
            gameState.playerX + PLAYER_SPEED
        );
    }
    if (gameState.keys.Space === true && !gameState.isPaused) {
        fireBullet();
    }
    if (gameState.keys.p === true && !gameState.isPaused && gameStart) {
        togglePause();
    }
    if (gameState.keys.r === true && !gameState.isPaused) {
        location.reload();
    }
    if (gameState.keys.Enter === true) {
        if (!gameStart) {
            clearInterval(presStart);
            timer_death = setInterval(updateGameState, 1000);
            init();
            gameLoop();
            gameStart = true;
        }
    }
    positionPlayer();
}
animate();