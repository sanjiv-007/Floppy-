const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function createPipe() {
    const gap = 120;
    const topHeight = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: 50,
        height: topHeight
    });
    pipes.push({
        x: canvas.width,
        y: topHeight + gap,
        width: 50,
        height: canvas.height - topHeight - gap
    });
}

document.addEventListener('keydown', () => {
    player.velocity = player.jump;
});

function update() {
    frame++;
    player.velocity += player.gravity;
    player.y += player.velocity;

    if (frame % 90 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;
    });

    // Remove offscreen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Collision detection
    pipes.forEach(pipe => {
        if (
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            player.y < pipe.y + pipe.height &&
            player.y + player.height > pipe.y
        ) {
            gameOver = true;
        }
    });

    if (player.y + player.height > canvas.height || player.y < 0) {
        gameOver = true;
    }

    if (!gameOver) score = Math.floor(frame / 10);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function loop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(loop);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', 80, canvas.height / 2);
    }
}

playerImg.onload = () => loop();
