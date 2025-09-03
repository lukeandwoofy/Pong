const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;

const PADDLE_SPEED = 7;
const AI_SPEED = 4;

let playerY = HEIGHT/2 - PADDLE_HEIGHT/2;
let aiY = HEIGHT/2 - PADDLE_HEIGHT/2;

let ballX = WIDTH/2 - BALL_SIZE/2;
let ballY = HEIGHT/2 - BALL_SIZE/2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Mouse control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;

    // Clamp paddle inside canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    ctx.fillStyle = "#fff";
    for (let i = 0; i < HEIGHT; i += 32) {
        ctx.fillRect(WIDTH/2 - 1, i, 2, 16);
    }

    // Player paddle
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update game state
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY *= -1;
        ballY = Math.max(Math.min(ballY, HEIGHT - BALL_SIZE), 0);
    }

    // Ball collision with player paddle
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX *= -1;
        // Add a bit of randomness to bounce angle
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.2;
        ballX = PADDLE_WIDTH; // Prevent sticking
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX *= -1;
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.2;
        ballX = WIDTH - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
    }

    // Ball out of bounds (reset)
    if (ballX < -BALL_SIZE || ballX > WIDTH + BALL_SIZE) {
        reset();
    }

    // Move AI paddle
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if (ballY + BALL_SIZE/2 > aiCenter + 10) {
        aiY += AI_SPEED;
    } else if (ballY + BALL_SIZE/2 < aiCenter - 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle inside canvas
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

function reset() {
    ballX = WIDTH/2 - BALL_SIZE/2;
    ballY = HEIGHT/2 - BALL_SIZE/2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    aiY = HEIGHT/2 - PADDLE_HEIGHT/2;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
