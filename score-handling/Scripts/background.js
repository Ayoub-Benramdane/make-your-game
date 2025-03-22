const backgroundGame = document.getElementById('background-game');
const numStars = 250;
let stars = [];

function createStars() {
    backgroundGame.innerHTML = '';
    stars = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const radius = Math.ceil(Math.random() * 3);
        star.style.width = `${radius * 2}px`;
        star.style.height = `${radius * 2}px`;
        // Calculate positions directly within [100, width-100] and [100, height-100]
        let x = Math.random() * (width - 200) + 100;
        let y = Math.random() * (height - 200) + 100;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        // Random velocities
        let dx = (Math.round(Math.random() * 4) - 2) || 1;
        let dy = (Math.round(Math.random() * 4) - 2) || 1;
        star.dataset.dx = dx;
        star.dataset.dy = dy;
        backgroundGame.appendChild(star);
        stars.push(star);
    }
}

function updateStars() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    stars.forEach(star => {
        let dx = parseFloat(star.dataset.dx);
        let dy = parseFloat(star.dataset.dy);
        let left = parseFloat(star.style.left);
        let top = parseFloat(star.style.top);
        left += dx;
        top += dy;
        if (left < 0 || left > width) { left = Math.random() * width; }
        if (top < 0 || top > height) { top = Math.random() * height; }
        star.style.left = `${left}px`;
        star.style.top = `${top}px`;
    });
}

function animateStars() {
    updateStars();
    requestAnimationFrame(animateStars);
}

// Debounce function to limit the rate of calls on resize
function debounce(fn, delay) {
    let timeoutId;
    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fn, delay);
    };
}

createStars();
animateStars();
window.addEventListener('resize', debounce(() => {
    createStars();
    createText();
}, 200));

// Create responsive text elements for "SPACE" and "INVADERS"
function createText() {
    // Remove any existing text elements
    const oldText = document.querySelectorAll('.space-text');
    oldText.forEach(el => el.remove());
    const container = backgroundGame;
    if (window.innerWidth >= 1200) {
        const space = document.createElement('div');
        space.classList.add('space-text');
        space.textContent = 'SPACE';
        space.style.right = '100px';
        space.style.top = (window.innerHeight / 2 - 20) + 'px';
        container.appendChild(space);
        const invaders = document.createElement('div');
        invaders.classList.add('space-text');
        invaders.textContent = 'INVADERS';
        invaders.style.right = '70px';
        invaders.style.top = (window.innerHeight / 2 + 20) + 'px';
        container.appendChild(invaders);
    } else {
        const space = document.createElement('div');
        space.classList.add('space-text');
        space.textContent = 'SPACE';
        space.style.left = (window.innerWidth / 2 - 60) + 'px';
        space.style.bottom = '50px';
        container.appendChild(space);
        const invaders = document.createElement('div');
        invaders.classList.add('space-text');
        invaders.textContent = 'INVADERS';
        invaders.style.left = (window.innerWidth / 2 - 97) + 'px';
        invaders.style.bottom = '10px';
        container.appendChild(invaders);
    }
}

createText();
window.addEventListener('resize', debounce(createText, 200));
