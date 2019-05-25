const GAMEBOARD_WIDTH = 670;
const GAMEBOARD_HEIGHT = 420;

const DEFAULT_WIDTH_BIRD = 50;
const DEFAULT_HEIGHT_BIRD = 50;
const DEFAULT_XPOSITION_BIRD = 10;
const DEFAULT_YPOSITION_BIRD = 120;

const DEFAULT_WIDTH_COIN = 50;
const DEFAULT_HEIGHT_COIN = 50;
const DEFAULT_XPOSITION_COIN = 300;
const DEFAULT_YPOSITION_COIN = 120;

const DEFAULT_WIDTH_OBSTACLE = 15;
const MIN_GAP = 75;
const MAX_GAP = 120;
const DEFAULT_SPEED = 3;

const BUTTON_LEFT = 37;
const BUTTON_RIGHT = 39;
const BUTTON_UP = 38;
const BUTTON_DOWN = 40;

let bird;
let obstacles = [];
let coin;
let myScore = 0;

function startGame() {
    gameBoard.start();
    bird = new Component(DEFAULT_WIDTH_BIRD, DEFAULT_HEIGHT_BIRD, "img/bird.png", DEFAULT_XPOSITION_BIRD, DEFAULT_YPOSITION_BIRD, "image");
    coin = new Coin(DEFAULT_WIDTH_COIN, DEFAULT_HEIGHT_COIN, "img/coin.png", DEFAULT_XPOSITION_COIN, DEFAULT_YPOSITION_COIN, "image");
}

class GameBoard {
    constructor() {
        this.width = GAMEBOARD_WIDTH;
        this.height = GAMEBOARD_HEIGHT;
        this.canvas = document.createElement("canvas");//tạo đối tượng canvas
    }
    start() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);//gán giá trị vào canvas
        this.frameNo = 0;//dùng để sinh chướng ngại vật
        this.interval = setInterval(updateGameBoard, 20);
        //xử lý sự kiện nhấn và thả phím
        window.addEventListener('keydown', function (e) {
            gameBoard.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameBoard.key = false;
        })
    }
    clear() {
        this.context.clearRect(0, 0, GAMEBOARD_WIDTH, GAMEBOARD_HEIGHT);//xóa màn hình
    }
    stop() {
        clearInterval(this.interval);//xóa lệnh lặp interval
        alert("Chết rồi! Gà rứa :v\nĐược có " + myScore + " điểm chay");
        location.reload();
    }
}

let gameBoard = new GameBoard();

class Component {
    constructor(width, height, color, xPosition, yPosition, type) {
        this.type = type;
        if (type === "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.color = color;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.speedX = 0;
        this.speedY = 0;
    }
    //cập nhật nhân vật (component)
    update() {
        let ctx = gameBoard.context;
        if (this.type === "image") {
            ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        }
    }
    //gán tốc độ cho bird, nếu bird vượt quá khung của game board thì set lại ở ngay mép các khung
    newPosition() {
        if (this.xPosition < 0) {
            this.xPosition = 0;
        }
        else if (this.xPosition + this.width > GAMEBOARD_WIDTH) {
            this.xPosition = GAMEBOARD_WIDTH - DEFAULT_WIDTH_BIRD;
        }
        else {
            this.xPosition += this.speedX;
        }
        if (this.yPosition < 0) {
            this.yPosition = 0;
        }
        else if (this.yPosition + this.height > GAMEBOARD_HEIGHT) {
            this.yPosition = GAMEBOARD_HEIGHT - DEFAULT_HEIGHT_BIRD;
        }
        else {
            this.yPosition += this.speedY;
        }
    }
    crashWith(otherobj) {
        //khai báo các cạnh của bird
        let leftEdgeOfBird = this.xPosition;
        let rightEdgeOfBird = this.xPosition + this.width;
        let topEdgeOfBird = this.yPosition;
        let bottomEdgeOfBird = this.yPosition + this.height;
        //khai báo các cạnh của vật cản (obstacle)
        let leftObs = otherobj.xPosition;
        let rightObs = otherobj.xPosition + otherobj.width;
        let topObs = otherobj.yPosition;
        let botObs = otherobj.yPosition + otherobj.height;
        //xử lý va chạm
        let crash = true;
        if ((bottomEdgeOfBird < topObs) || (topEdgeOfBird > botObs) || (rightEdgeOfBird < leftObs) || (leftEdgeOfBird > rightObs)) {
            crash = false;
        }
        return crash;
    }
}

class Coin extends Component {
    moveCoin() {
        //nếu đồng xu vượt quá mép trái thì đẩy về phía bên phải
        let randomYPosition = Math.floor((Math.random() * (200 - 20 + 1)) + 20);
        this.xPosition -= DEFAULT_SPEED;
        if (this.xPosition < -DEFAULT_WIDTH_COIN) {
            this.xPosition = GAMEBOARD_WIDTH + 150;
            this.yPosition = randomYPosition;
        }
        //nếu chim ăn đồng xu thì tăng điểm và hiển thị ra màn hình
        //đẩy đồng xu về bên phải
        if ((bird.xPosition + bird.width >= this.xPosition) && (bird.xPosition <= this.xPosition + this.width)
            && (bird.yPosition + bird.height >= this.yPosition) && (bird.yPosition <= this.yPosition + this.height)
        ) {
            myScore++;
            document.getElementById('score').innerHTML = "Score: " + myScore;
            this.xPosition = GAMEBOARD_WIDTH + 150;
            this.yPosition = randomYPosition;
        }
    }
}

function updateGameBoard() {
    //nếu va chạm với chướng ngại vật (crash = true) thì xóa lệnh lặp interval
    let randomHeight, minHeight, maxHeight, gap;
    for (let i = 0; i < obstacles.length; i++) {
        if (bird.crashWith(obstacles[i])) {
            gameBoard.stop();
            return;
        }
    }
    //nếu va chạm với đồng xu thì cộng điểm
    if (bird.crashWith(coin)) {
        coin.moveCoin();
    }
    gameBoard.clear();//xóa game board
    //tạo nhiều obs với tọa độ x là cuối khung canvas, tọa độ y cố định và chiều cao là random sau mỗi 100ms
    gameBoard.frameNo++;
    if (gameBoard.frameNo === 1 || everyInterval(100)) {
        minHeight = 20;
        maxHeight = 200;
        randomHeight = Math.floor((Math.random() * (maxHeight - minHeight + 1)) + minHeight);
        gap = Math.floor((Math.random() * (MAX_GAP - MIN_GAP + 1)) + MIN_GAP);
        //tạo obs ở phía trên
        let topObstacle = new Component(DEFAULT_WIDTH_OBSTACLE, randomHeight, "black", GAMEBOARD_WIDTH, 0);
        obstacles.push(topObstacle);
        //tạo obs ở phía dưới
        let botObstacle = new Component(DEFAULT_WIDTH_OBSTACLE, GAMEBOARD_HEIGHT - randomHeight - gap, "black", GAMEBOARD_WIDTH, randomHeight + gap);
        obstacles.push(botObstacle);
    }
    //di chuyển obs thứ i sang trái
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].xPosition -= DEFAULT_SPEED;
        obstacles[i].update();
    }
    move();//di chuyển con chim bằng bàn phím
    bird.newPosition();//gán tốc độ cho con chim
    coin.moveCoin();
    coin.update();
    bird.update();
}

function move() {
    bird.speedX = 0;
    bird.speedY = 0;
    if (gameBoard.key && gameBoard.key === BUTTON_LEFT) {
        bird.speedX = -DEFAULT_SPEED;
    }
    if (gameBoard.key && gameBoard.key === BUTTON_RIGHT) {
        bird.speedX = DEFAULT_SPEED;
    }
    if (gameBoard.key && gameBoard.key === BUTTON_UP) {
        bird.speedY = -DEFAULT_SPEED;
    }
    if (gameBoard.key && gameBoard.key === BUTTON_DOWN) {
        bird.speedY = DEFAULT_SPEED;
    }
}

function everyInterval(n) {
    if ((gameBoard.frameNo / n) % 1 === 0) {
        return true;
    }
    return false;
}