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
let timerDeath;
let isDevelopmentShown = false;

// Game State
const gameState = {
    player: document.querySelector('img'),
    screen: document.getElementById('game-container'),
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
    gameState.playerX = (gameState.screen.offsetWidth - gameState.player.offsetWidth) / 2;
    gameState.playerY = gameState.screen.offsetHeight - gameState.player.offsetHeight;
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
    gameState.screen.appendChild(countdownElement);
}

function createScore() {
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.innerHTML = `
        <p style="margin: 0; color: rgb(255, 255, 255);">
            Score: <span id="scoreValue">${gameState.score}</span>
        </p>`;
    scoreElement.style.cssText = 'position:absolute;top:10px;left:20px;font:bold 20px Arial;';
    gameState.screen.appendChild(scoreElement);
}

function createLives() {
    const livesContainer = document.createElement('div');
    livesContainer.style.cssText = 'position:absolute;top:2px;left:30px;';
    for (let i = 0; i < INITIAL_LIVES; i++) {
        const life = createLifeElement(i);
        livesContainer.appendChild(life);
    }
    gameState.screen.appendChild(livesContainer);
}

function createLifeElement(index) {
    const life = document.createElement('img');
    life.className = 'life';
    life.src = "./img/life.png";
    life.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        transform: translate(${gameState.screen.offsetWidth - (index + 1) * 40 - 30}px, 2px);
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
                y: row * 60 + 10
            });
        }
    }
    gameState.screen.appendChild(fragment);
}

function createInvaderElement(row, col) {
    const isSpecial = row === col || col === INVADER_COLS - row - 1;
    const invader = document.createElement('img');
    invader.src = isSpecial ? './img/enemy2.png' : './img/invader.png';
    invader.style.position = 'absolute';
    invader.style.width = isSpecial ? '30px' : '40px';
    invader.style.height = isSpecial ? '30px' : '40px';
    const initialX = col * 60 + 30;
    const initialY = row * 60 + 10;
    invader.style.transform = `translate(${initialX}px, ${initialY}px)`;
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
        invader.element.style.transform = `translate(${invader.x}px, ${invader.y}px)`;

        if (newX > gameState.screen.offsetWidth - 40 || newX < 10) {
            shouldReverse = true;
        }
    });

    if (shouldReverse) {
        gameState.invaderDirection *= -1;
        gameState.invaders.forEach(invader => {
            invader.y += 10;
            invader.element.style.transform = `translate(${invader.x}px, ${invader.y}px)`;
            if (invader.y > gameState.screen.offsetHeight - 100) {
                endGame(false);
            }
        });
    }
    if (!isDevelopmentShown && gameState.score >= 100) {
        isDevelopmentShown = true;
        gameState.isPaused = true;
        clearInterval(timerDeath);
        showDevelopment();
    }
}

function updateBullets() {
    // Update player bullets
    gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= BULLET_SPEED;
        bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
        if (bullet.y <= 0) {
            bullet.element.remove();
            return false;
        }
        return true;
    });

    // Update invader bullets
    gameState.invaderBullets = gameState.invaderBullets.filter(bullet => {
        bullet.y += INVADER_BULLET_SPEED;
        bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
        return bullet.y < gameState.screen.offsetHeight;
    });
}

function checkCollisions() {
    // Player bullets vs invaders
    gameState.bullets.forEach((bullet, bulletIndex) => {
        gameState.invaders.forEach((invader, invaderIndex) => {
            if (checkCollision(bullet.element, invader.element)) {
                gameState.screen.removeChild(bullet.element);
                gameState.screen.removeChild(invader.element);
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
            gameState.screen.removeChild(bullet.element);
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
    const livesContainer = gameState.screen.querySelector('.life').parentElement;
    livesContainer.innerHTML = '';
    for (let i = 0; i < gameState.lives; i++) {
        livesContainer.appendChild(createLifeElement(i));
    }
}

function updateGameState() {
    gameState.countdown--;
    if (gameState.countdown == 0) {
        clearInterval(timerDeath);
        endGame(false);
    }
    document.getElementById('countdownValue').textContent = `${gameState.countdown}`;
}

function endGame(success) {
    gameState.isPaused = true;
    clearInterval(timerDeath);
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
        <div style="background-color: transparent; border-radius: 8px; border: 2px solid rgb(255, 255, 255); height: 70%; width: 55%">
        <div style="border: 2px solid rgb(255, 255, 255);">
            <h2>${isVictory ? 'Victory!! <br><br> You saved the galaxy! It was a difficult task, but well done, Hero, to protect the universe!!!!' : 'Game Over <br><br> The invaders overran your defenses, unfortunately the invaders dominated the universe and couldn\'t protect it.'}</h2>
        </div>
        <p>Score: ${gameState.score}</p>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="restartButton">Restart</button>
        </div>
    `;

    menu.querySelector('#restartButton').addEventListener('click', () => location.reload());
    gameState.screen.appendChild(menu);
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

    gameState.screen.appendChild(menu);
}

function Continue(menu) {
    gameState.isPaused = false;
    gameState.screen.removeChild(menu);
    timerDeath = setInterval(updateGameState, 1000);
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

function showDevelopment() {
    const dev = document.createElement('div');
    dev.id = 'development';
    dev.style.cssText = `
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
    dev.innerHTML = `
        <div style="background-color: transparent; border-radius: 8px; border: 2px solid rgb(255, 255, 255); height: 70%; width: 55%">
        <div style="border: 2px solid rgb(255, 255, 255); padding: 0;">
            <p style="font-size: 25px;">The plot is thick!!!! <br><br> You have reached a critical point in your quest. The invaders are getting ready for their last attack, you, hero, don't let them do what they like.</p>
        </div>
        <br><br>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="restartButton">Restart</button>
        <button style="cursor: pointer; border-radius: 8px; padding: 6px" id="continueButton">Continue</button>
        </div>
    `;
    dev.querySelector('#restartButton').addEventListener('click', () => {
        location.reload();
        resetGame();
    });
    dev.querySelector('#continueButton').addEventListener('click', () => {
        gameState.screen.removeChild(dev);
        gameState.isPaused = false;
        timerDeath = setInterval(updateGameState, 1000);
    });
    gameState.screen.appendChild(dev);
}

function positionPlayer() {
    gameState.player.style.transform = `translate(${gameState.playerX}px, ${gameState.playerY}px)`;
}

function fireBullet() {
    if (Date.now() - gameState.lastFireTime < 600) return;
    const bullet = document.createElement('div');
    bullet.style.position = 'absolute';
    bullet.style.width = '6px';
    bullet.style.height = '6px';
    bullet.style.borderRadius = '50%';
    bullet.style.background = 'red';

    const bulletX = gameState.playerX + gameState.player.offsetWidth / 2 - 3;
    const bulletY = gameState.playerY - 15;
    bullet.style.transform = `translate(${bulletX}px, ${bulletY}px)`;

    gameState.screen.appendChild(bullet);
    gameState.bullets.push({
        element: bullet,
        x: bulletX,
        y: bulletY
    });
    gameState.lastFireTime = Date.now();
}

function invaderFiring() {
    if (gameState.invaders.length === 0) return;
    const invader = gameState.invaders[Math.floor(Math.random() * gameState.invaders.length)];
    const bullet = document.createElement('div');
    bullet.style.position = 'absolute';
    bullet.style.width = '6px';
    bullet.style.height = '6px';
    bullet.style.borderRadius = '50%';
    bullet.style.background = 'red';

    const bulletX = invader.x + 22;
    const bulletY = invader.y + 50;
    bullet.style.transform = `translate(${bulletX}px, ${bulletY}px)`;

    gameState.screen.appendChild(bullet);
    gameState.invaderBullets.push({
        element: bullet,
        x: bulletX,
        y: bulletY
    });
}

function togglePause() {
    gameState.isPaused = true;
    clearInterval(timerDeath);
    showPauseMenu();
    if (!gameState.isPaused) gameLoop();
}

function handleResize() {
    gameState.playerX = Math.min(
        Math.max(30, gameState.playerX),
        gameState.screen.offsetWidth - gameState.player.offsetWidth - 30
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
        let text = "Welcome To Space Invaders Story Mode \n In a galaxy far, far away, our hero embarks on the quest to defeat the alien invaders who seized the galaxy and restore peace. \n\n\n\n\n\n\n Press Enter To Start";
        let fontSize = "24px";
        let startDiv = document.createElement("div");
        startDiv.style.position = "absolute";
        startDiv.style.top = (gameContainer.clientHeight / 2 - 180) + "px";
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
    if (gameState.invaders.length === 0) {
        endGame(true);
        return;
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
            gameState.screen.offsetWidth - gameState.player.offsetWidth - 4,
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
            timerDeath = setInterval(updateGameState, 1000);
            init();
            gameLoop();
            gameStart = true;
        }
    }
    positionPlayer();
}
animate();
