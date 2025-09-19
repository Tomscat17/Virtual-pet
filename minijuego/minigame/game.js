const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const hedgehogImage = new Image();
hedgehogImage.src = 'normal_frente.png';

// Carga el sonido del salto
const jumpSound = new Audio('salto.mp3');

let scrollSpeed = 0.9;
let moveDirection = 0;
let isGameOver = false;

let player;
let platforms;

function restartGame() {
    isGameOver = false;
    player = new Player(canvas.width / 2 - 20, 500, 40, 40);

    platforms = [
        new Platform(canvas.width / 2 - 50, 550, 100, 20, 'green')
    ];

    let lastY = 550;
    for (let i = 0; i < 6; i++) {
        let platWidth = Math.random() * (120 - 50) + 50;
        let platX = Math.random() * (canvas.width - platWidth);
        lastY -= 80;
        platforms.push(new Platform(platX, lastY, platWidth, 20, 'green'));
    }
    
    gameLoop();
}

function rectsIntersect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = 0;
        this.dy = 0;
        this.gravity = 0.2;
        this.jumpForce = -8;
    }

    draw() {
        ctx.drawImage(hedgehogImage, this.x, this.y, this.width, this.height);
    }

    update(platforms) {
        this.dx = moveDirection * 3;
        this.x += this.dx;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }

        this.dy += this.gravity;
        this.y += this.dy;

        if (this.y < 0) {
            this.y = 0;
        }

        platforms.forEach(platform => {
            if (rectsIntersect(this, platform)) {
                if (this.dy > 0 && this.y + this.height - this.dy <= platform.y) {
                    this.y = platform.y - this.height;
                    this.dy = this.jumpForce;
                    jumpSound.currentTime = 0; // Reinicia el audio para reproducirlo rápidamente
                    jumpSound.play();
                }
            }
        });
    }
}

class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function generatePlatform() {
    let platWidth = Math.random() * (120 - 50) + 50;
    let platX = Math.random() * (canvas.width - platWidth);
    let platY = -20;
    platforms.push(new Platform(platX, platY, platWidth, 20, 'green'));
}

function gameLoop() {
    if (isGameOver) {
        showGameOverScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(platform => {
        platform.y += scrollSpeed;
        platform.draw();
    });

    platforms = platforms.filter(platform => platform.y < canvas.height);

    let lastPlatformY = platforms[platforms.length - 1].y;
    if (lastPlatformY > 70) {
        generatePlatform();
    }

    player.update(platforms);
    player.draw();

    if (player.y > canvas.height) {
        isGameOver = true;
    }

    requestAnimationFrame(gameLoop);
}

function showGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '30px Arial';
    ctx.fillText('¡Juego Terminado!', canvas.width / 2, canvas.height / 2 - 50);

    const btnWidth = 150;
    const btnHeight = 50;
    const btnX = (canvas.width / 2) - (btnWidth / 2);
    const btnY = (canvas.height / 2);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Reintentar', canvas.width / 2, canvas.height / 2 + 30);
}

let startX = 0;

canvas.addEventListener('mousedown', (e) => {
    if (!isGameOver) {
        startX = e.clientX - canvas.offsetLeft;
    }
});
canvas.addEventListener('touchstart', (e) => {
    if (!isGameOver) {
        startX = e.touches[0].clientX - canvas.offsetLeft;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isGameOver) {
        checkButtonClick(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    } else {
        const endX = e.clientX - canvas.offsetLeft;
        handleMovement(startX, endX);
    }
});
canvas.addEventListener('touchend', (e) => {
    if (isGameOver) {
        checkButtonClick(e.changedTouches[0].clientX - canvas.offsetLeft, e.changedTouches[0].clientY - canvas.offsetTop);
    } else {
        const endX = e.changedTouches[0].clientX - canvas.offsetLeft;
        handleMovement(startX, endX);
    }
});

function handleMovement(start, end) {
    if (start > end + 20) {
        moveDirection = -1;
    } else if (start < end - 20) {
        moveDirection = 1;
    } else {
        moveDirection = 0;
    }
    setTimeout(() => {
        moveDirection = 0;
    }, 150);
}

function checkButtonClick(x, y) {
    const btnWidth = 150;
    const btnHeight = 50;
    const btnX = (canvas.width / 2) - (btnWidth / 2);
    const btnY = (canvas.height / 2);

    if (x > btnX && x < btnX + btnWidth && y > btnY && y < btnY + btnHeight) {
        restartGame();
    }
}

hedgehogImage.onload = () => {
    restartGame();
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveDirection = -1;
    } else if (e.key === 'ArrowRight') {
        moveDirection = 1;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        moveDirection = 0;
    }
});