const GAMEBOARD_WIDTH = 600;
const GAMEBOARD_HEIGHT = 300;

const BALL_RADIUS = 18;
const DEFAULT_BALL_SPEED = 2;

const DEFAULT_BAR_WIDTH = 80;
const DEFAULT_BAR_HEIGHT = 20;

let score = 0;

function startGame() {
    gameBoard.start();
    ball.crashWith(bar);
    ball.updateBall();
    bar.updateBar();
}

class GameBoard {
    constructor() {
    }
    start() {
        this.canvas = document.getElementById("mycanvas");
        this.context = this.canvas.getContext('2d');
        this.interval = setInterval(updateGameBoard, 20);
        window.addEventListener('keydown', function (e) {
            gameBoard.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameBoard.key = false;
        })
    }
    clear() {
        this.context.clearRect(0, 0, GAMEBOARD_WIDTH, GAMEBOARD_HEIGHT);
    }
    stop() {
        clearInterval(this.interval);
    }
}

class Ball {
    constructor(ballXpos, ballYpos) {
        this.ballXpos = ballXpos;
        this.ballYPos = ballYpos;
        this.speedX = DEFAULT_BALL_SPEED;
        this.speedY = DEFAULT_BALL_SPEED;
        this.canvas = document.getElementById("mycanvas");
        this.context = this.canvas.getContext('2d');
    }
    updateBall() {
        this.context.beginPath();
        this.context.arc(this.ballXpos, this.ballYPos, BALL_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = "red";
        this.context.fill();
    }
    crashWith(bar) {
        let flag = true;
        this.ballXpos += this.speedX;
        if (this.ballXpos + BALL_RADIUS > GAMEBOARD_WIDTH || this.ballXpos < BALL_RADIUS) {
            this.speedX = -this.speedX;
        }

        this.ballYPos -= this.speedY;
        if (this.ballYPos < BALL_RADIUS || (this.ballYPos + BALL_RADIUS > bar.barYPos && this.ballXpos + BALL_RADIUS > bar.barXpos &&
            this.ballXpos - BALL_RADIUS < bar.barXpos + DEFAULT_BAR_WIDTH)) {
            this.speedY = -this.speedY;
        }
        else if (this.ballYPos + BALL_RADIUS > GAMEBOARD_HEIGHT) {
            flag = false;
        }
        return flag;
    }
}

class Bar {
    constructor(barXPos, barYPos) {
        this.barXpos = barXPos;
        this.barYPos = barYPos;
        this.canvas = document.getElementById("mycanvas");
        this.context = this.canvas.getContext('2d');
    }
    updateBar() {
        this.context.fillStyle = "green";
        this.context.fillRect(this.barXpos, this.barYPos, DEFAULT_BAR_WIDTH, DEFAULT_BAR_HEIGHT);
    }
    moveBar() {
        if (gameBoard.key && gameBoard.key === 37) {
            this.barXpos -= 5;
        }
        if (gameBoard.key && gameBoard.key === 39) {
            this.barXpos += 5;
        }
        if (this.barXpos < 0) {
            this.barXpos = 0;
        } else if (this.barXpos + DEFAULT_BAR_WIDTH > GAMEBOARD_WIDTH) {
            this.barXpos = GAMEBOARD_WIDTH - DEFAULT_BAR_WIDTH;
        }
    }
}

let ball = new Ball(280, 250);
let bar = new Bar(240, 280);
let gameBoard = new GameBoard();

function updateGameBoard() {
    if (ball.crashWith(bar)) {
        score += 0.01;
        document.getElementById('score').innerHTML = "Score: " + score.toFixed(0);
    }
    else {
        gameBoard.stop();
    }
    gameBoard.clear();
    ball.crashWith(bar);
    bar.moveBar();
    ball.updateBall();
    bar.updateBar();
}