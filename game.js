// Get the container element
const container = document.querySelector('.container');
// Get the score element
const scoreElement = document.getElementById('score');
// Get the missed element
const missedElement = document.getElementById('missed');

// Initialize variables
let score = 0;
let missed = 0;
let isGameOver = false;
let gameInterval;

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function missedMole() {
    missed++;
    missedElement.textContent = missed;
    if (missed > 5) {
        gameOver();
        return
    }
}

function blinkMole(mole, time) {
    for (let i = 0; i < time; i++) {
        setTimeout(() => mole.style.backgroundImage = 'url(cat2.png)', 200 * i);
        setTimeout(() => mole.style.backgroundImage = 'url(cat.png)', 100 * (i + 1));
    }
}

function moleHandler(mole) {
    // Add event listener to handle mole whacking
    mole.addEventListener('click', () => {
        setTimeout(() => mole.remove(), 200);
        mole.classList.add('beated');
        score++;
        scoreElement.textContent = score;
        mole.style.backgroundImage = 'url(cat2.png)';
    });

    setTimeout(() => {
        if (isGameOver) return;
        if (mole.classList.contains('beated')) {
            return;
        }

        missedMole();
        mole.remove();
    }, 6000);

    setTimeout(() => {
        blinkMole(mole, 5);
    }, 3000);
}

// Function to create a mole element
function createMole() {
    const mole = document.createElement('div');
    mole.classList.add('mole');

    // Set random top and left positions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // const moleWidth = mole.offsetWidth;
    // const moleHeight = mole.offsetHeight;
    const moleWidth = 110;
    const moleHeight = 110;

    const maxTop = containerHeight - moleHeight;
    const maxLeft = containerWidth - moleWidth;

    const randomTop = getRandomNumber(0, maxTop);
    const randomLeft = getRandomNumber(0, maxLeft);

    mole.style.top = `${randomTop}px`;
    mole.style.left = `${randomLeft}px`;

    moleHandler(mole);

    return mole;
}

// Start the game
function startGame() {
    return setTimeout(() => {
        if (isGameOver) {
            return;
        }

        // Generate a random number of moles (between 1 and 2)
        const numMoles = getRandomNumber(1, 2);

        // Create and append the moles to the container
        for (let i = 0; i < numMoles; i++) {
            const mole = createMole();
            container.appendChild(mole);
        }

        startGame();
    }, (2000 - (score * 10)) > 200 ? (2000 - (score * 10)) : 200);
}

// Function to end the game
function gameOver() {
    clearTimeout(gameInterval);
    container.innerHTML = '<h1>Game Over</h1>';
    isGameOver = true;
}

// display welcome 5..4..3..2..1 before start game
function displayWelcome() {
    // reset game
    score = 0;
    missed = 0;
    container.innerHTML = '';
    scoreElement.textContent = score;
    missedElement.textContent = missed;
    isGameOver = false;

    let count = 5;
    container.innerHTML = `<h1 style='font-size:60px;color:red'>${count}</h1>`;

    let interval = setInterval(() => {
        count--;
        container.innerHTML = `<h1 style='font-size:60px;color:red'>${count}</h1>`;

        if (count == 0) {
            container.innerHTML = `<h1 style='font-size:60px;color:red'>GO!!!</h1>`;
            clearInterval(interval);

            setTimeout(() => {
                container.innerHTML = '';
                gameInterval = startGame();
            }, 1000);
        }
    }, 1000);
}

displayWelcome();

// Everytime touch container (not touch mole), minus score
container.addEventListener('click', (event) => {
    container.classList.add('changed_cursor');
    setTimeout(() => {
        container.classList.remove('changed_cursor');
    }, 150);

    if (isGameOver) {
        displayWelcome()
        return;
    }

    if (!event.target.classList.contains('mole')) {
        missedMole();
        // if (score == 0) {
        //     gameOver();
        //     return
        // }
        // score--;
        // scoreElement.textContent = score;
    }
});