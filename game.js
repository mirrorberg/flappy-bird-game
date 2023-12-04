
// Start the game
// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
let birdImage = new Image();
let gooseImage = new Image();
birdImage.src = 'LennardSchulte.png'; // Your friend's face
gooseImage.src = 'Flag_of_Finland.svg.png'; // Goose image

// Bird properties
let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 60,
    height: 60,
    gravity: 0.25,
    velocity: 0,
    jump: 4.6
};

// Obstacle properties
let obstacles = [];
let frames = 0;
let interval = 90; // Interval for generating new obstacles
let score = 0;
let gameRunning = false;

const obstacleWidth = 50;  // Desired width for the obstacle
const obstacleHeight = 50; // Desired height for the obstacle

// Draw bird and obstacles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generate new obstacles
    if (frames % interval === 0) {
        let obstacleHeight = Math.random() * (canvas.height - 200) + 50;
        obstacles.push({ x: canvas.width, y: obstacleHeight });
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    // Begrenzen Sie die Bewegung des Vogels am unteren Rand des Bildschirms
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        gameRunning = false;

    }


    // Draw obstacles
    obstacles.forEach((obstacle, index) => {

        let adjustedYPosition = canvas.height - obstacle.y - obstacleHeight;

        // Draw the obstacle with the new width and height
        ctx.drawImage(gooseImage, obstacle.x, adjustedYPosition, obstacleWidth, obstacleHeight);
    
        obstacle.x -= 2; // Speed of the obstacles

        // Check for collisions
        if (bird.x < obstacle.x + obstacleWidth &&
            bird.x + bird.width > obstacle.x &&
            bird.y < canvas.height - obstacle.y &&
            bird.height + bird.y > canvas.height - obstacle.y - obstacleHeight) {
            // If there is a collision, stop the game
            gameRunning = false;
        }
    

        // Remove obstacles when they move out of the canvas
        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(index, 1); // Remove the obstacle from the array
            score++; // Increment the score
        }
    });

    ctx.fillText(`Score: ${score}`, 10, 20);
    frames++;

    if (gameRunning) {
        requestAnimationFrame(draw);
    } else {
        ctx.fillText("Game Over", canvas.width / 2 - 30, canvas.height / 2);
    }
}

// Event listener for user input
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameRunning) {
        bird.velocity = -bird.jump;
    } else if (event.code === "Space" && !gameRunning) {
        // Restart the game
       startGame();
    }  
});

// Event-Listener für Touch-Events hinzufügen
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Verhindern des Standard-Scrollverhaltens
    if (!gameRunning) {
        startGame(); // Startet das Spiel, wenn es nicht bereits läuft
    } else {
        bird.velocity = -bird.jump; // Lässt den Vogel springen
    }
}, false);

// Event-Listener für Mausklicks hinzufügen
canvas.addEventListener("mousedown", (event) => {
    event.preventDefault(); // Verhindern der Standardaktionen
    if (!gameRunning) {
        startGame(); // Startet das Spiel, wenn es nicht bereits läuft
    } else {
        bird.velocity = -bird.jump; // Lässt den Vogel springen
    }
}, false);


function startGame() {
    // Spielvariablen zurücksetzen
    bird.y = canvas.height / 2;
    obstacles = [];
    score = 0;
    frames = 0;
    gameRunning = true;
    draw(); // Beginnt die Spielschleife
}
// Start the game
draw();