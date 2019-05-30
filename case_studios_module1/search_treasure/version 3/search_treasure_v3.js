const GAMEBOARD_WIDTH = 480;
const GAMEBOARD_HEIGHT = 270;

const DEFAULT_WIDTH_BIRD = 30;
const DEFAULT_HEIGHT_BIRD = 30;
const DEFAULT_XPOSITION_BIRD = 10;
const DEFAULT_YPOSITION_BIRD = 120;

const DEFAULT_WIDTH_COIN = 30;
const DEFAULT_HEIGHT_COIN = 30;

const DEFAULT_WIDTH_OBSTACLE = 23;
const MIN_HEIGHT_OBSTACLE = 20;
const MAX_HEIGHT_OBSTACLE = 135;
const MIN_GAP = 60;
const MAX_GAP = 90;
const DEFAULT_SPEED = 2;
const NORMAL_SPEED = 3.5;
const MAX_SPEED = 5;

const BUTTON_CTRL = 17;
const BUTTON_LEFT = 37;
const BUTTON_RIGHT = 39;
const BUTTON_UP = 38;
const BUTTON_DOWN = 40;

let bird;
let background;
let obstacles = [];
let coin = [];
let myScore = 0;
let sound;

function startGame() {
    bird = new Component("img/bird.png", DEFAULT_XPOSITION_BIRD, DEFAULT_YPOSITION_BIRD, DEFAULT_WIDTH_BIRD, DEFAULT_HEIGHT_BIRD, "image");
    background = new Component("img/bg.png", 0, 0, GAMEBOARD_WIDTH, GAMEBOARD_HEIGHT, "background");
    soundCrash = new Sound("sound/explosion.mp3");
    soundCoin = new Sound("sound/coin.wav");
    gameBoard.start();
}

class GameBoard {
    constructor() {
        this.canvas = document.createElement('canvas');
    }
    start() {
        this.canvas.width = GAMEBOARD_WIDTH;
        this.canvas.height = GAMEBOARD_HEIGHT;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.firstChild);//chèn element canvas vào trước child đầu tiên của body
        this.interval = setInterval(updateGameBoard, 20);
        this.frameNo = 0;
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
        clearInterval(this.interval);
        alert("Chết rồi! Gà rứa :v\nĐược có " + myScore + " điểm chay");
    }
}

let gameBoard = new GameBoard();

class Component {
    constructor(image, posX, posY, width, height, type) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.type = type;
        this.image = new Image();
        this.image.src = image;
        this.speedX = 0;
        this.speedY = 0;
    }
    //cập nhật component
    update() {
        let ctx = gameBoard.context;
        if (this.type === "image" || this.type === "background") {
            ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        }
        //hàm if thứ 2 vẽ ra 1 background chạy ngay theo sau bground đầu tiên
        if (this.type === "background") {
            ctx.drawImage(this.image, this.posX + this.width, this.posY, this.width, this.height);
        }
    }
    //gán bước đi cho component
    newPos() {
        if (this.type === "background") {
            this.posX += this.speedX;
            if (this.posX === -(this.width)) {
                this.posX = 0;
            }
        }
        if (this.type === "image") {
            if (this.posX < 0) {
                this.posX = 0;
            }
            else if (this.posX + this.width > GAMEBOARD_WIDTH) {
                this.posX = GAMEBOARD_WIDTH - DEFAULT_WIDTH_BIRD;
            }
            else {
                this.posX += this.speedX;
            }
            if (this.posY < 0) {
                this.posY = 0;
            }
            else if (this.posY + this.height > GAMEBOARD_HEIGHT) {
                this.posY = GAMEBOARD_HEIGHT - DEFAULT_HEIGHT_BIRD;
            }
            else {
                this.posY += this.speedY;
            }
        }
    }
    //xử lý va chạm
    crashWidth(otherobj) {
        //khai báo các cạnh của component
        let leftEdge = this.posX;
        let rightEdge = this.posX + this.width;
        let topEdge = this.posY;
        let bottomEdge = this.posY + this.height;
        //khai báo các cạnh của vật cản (obstacle)
        let leftObs = otherobj.posX;
        let rightObs = otherobj.posX + otherobj.width;
        let topObs = otherobj.posY;
        let botObs = otherobj.posY + otherobj.height;
        //xử lý va chạm
        let crash = true;
        if ((bottomEdge < topObs) || (topEdge > botObs) || (rightEdge < leftObs) || (leftEdge > rightObs)) {
            crash = false;
        }
        return crash;
    }
}

class Sound {
    constructor(src) {
        this.sound = document.createElement('audio');
        this.sound.src = src;
        this.sound.setAttribute = ("preload", "auto");
        this.sound.setAttribute = ("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}

function updateGameBoard() {
    //nếu va chạm với chướng ngại vật thì xóa lệnh lặp interval
    for (let i = 0; i < obstacles.length; i++) {
        if (bird.crashWidth(obstacles[i])) {
            soundCrash.play();
            gameBoard.stop();
            return;
        }
    }
    //nếu ăn trúng tiền thì + điểm, hiển trị ra thẻ div và xóa phần tử trong mảng coin
    for (let i = 0; i < coin.length; i++) {
        if (bird.crashWidth(coin[i])) {
            soundCoin.play();
            myScore++;
            document.getElementById('score').innerHTML = "Score: " + myScore;
            coin.splice(i, 1);
        }
    }
    gameBoard.clear();
    //dịch chuyển background sang trái với speed = 1
    background.speedX = -1;
    background.newPos();
    background.update();
    //xử lý các obstacle
    createRandomObstacle();
    moveObstacle();
    //xử lý bird
    move();
    bird.newPos();
    bird.update();
}
//xử lý di chuyển của bird
function move() {
    bird.speedX = 0;
    bird.speedY = 0;
    if (gameBoard.key && gameBoard.key === BUTTON_LEFT)
        bird.speedX = -DEFAULT_SPEED;
    if (gameBoard.key && gameBoard.key === BUTTON_RIGHT)
        bird.speedX = DEFAULT_SPEED;
    if (gameBoard.key && gameBoard.key === BUTTON_CTRL)
        bird.speedX = MAX_SPEED;
    if (gameBoard.key && gameBoard.key === BUTTON_UP)
        bird.speedY = -DEFAULT_SPEED;
    if (gameBoard.key && gameBoard.key === BUTTON_DOWN)
        bird.speedY = DEFAULT_SPEED;
    if (!gameBoard.key)
        bird.speedX = -DEFAULT_SPEED;
}
//Hàm everyinterval trả về true nếu số khung hình hiện tại tương ứng với khoảng đã cho
function everyInterval(n) {
    if ((gameBoard.frameNo / n) % 1 === 0) {
        return true;
    }
    return false;
}
//sinh ngẫu nhiên các vật cản
function createRandomObstacle() {
    gameBoard.frameNo++;
    if (gameBoard.frameNo === 1 || everyInterval(100)) {
        let randomHeight = Math.floor(Math.random() * (MAX_HEIGHT_OBSTACLE - MIN_HEIGHT_OBSTACLE + 1) + MIN_HEIGHT_OBSTACLE);
        let gap = Math.floor(Math.random() * (MAX_GAP - MIN_GAP + 1) + MIN_GAP);
        //tạo obstacle ở phía trên
        let topObstacle = new Component("img/obs.png", GAMEBOARD_WIDTH, 0, DEFAULT_WIDTH_OBSTACLE, randomHeight, "image");
        obstacles.push(topObstacle);
        //tạo obstacle ở phía dưới
        let botObstacle = new Component("img/obs.png", GAMEBOARD_WIDTH, randomHeight + gap, DEFAULT_WIDTH_OBSTACLE, GAMEBOARD_HEIGHT - randomHeight - gap, "image");
        obstacles.push(botObstacle);
        //sinh ngẫu nhiên các phần thưởng, vị trí X của coin được sinh ra nằm ở phía sau màn hình (vượt quá width của canvas)
        let randomPosX = Math.floor(Math.random() * (656 - GAMEBOARD_WIDTH + 1) + GAMEBOARD_WIDTH);
        let randomPosY = Math.floor(Math.random() * (GAMEBOARD_HEIGHT + 1) + 0);
        let randomCoin = new Component("img/coin.png", randomPosX, randomPosY, DEFAULT_WIDTH_COIN, DEFAULT_HEIGHT_COIN, "image");
        coin.push(randomCoin);
    }
}
//dịch chuyển obstacle và coin sang trái
function moveObstacle() {
    for (let i = 0; i < obstacles.length; i++) {
        if (myScore < 5) {
            obstacles[i].posX -= DEFAULT_SPEED;
            obstacles[i].update();
        }
        else if (myScore < 10) {
            obstacles[i].posX -= NORMAL_SPEED;
            obstacles[i].update();
        }
        else {
            obstacles[i].posX -= MAX_SPEED;
            obstacles[i].update();
        }
    }
    for (let i = 0; i < coin.length; i++) {
        if (myScore < 5) {
            coin[i].posX -= DEFAULT_SPEED;
            coin[i].update();
        }
        else if (myScore < 10) {
            coin[i].posX -= NORMAL_SPEED;
            coin[i].update();
        }
        else {
            coin[i].posX -= MAX_SPEED;
            coin[i].update();
        }
    }
}

function reset() {
    location.reload();
}