const VALUE_EMPTY = 1;
const VALUE_X = 2;
const VALUE_O = 3;
const DEFAULT_COLS = 10;
const DEFAULT_ROWS = 10;
const DEFAULT_CELL_SIZE = 40;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = VALUE_EMPTY;
    }
    getHtml() {
        let top = this.x * DEFAULT_CELL_SIZE;
        let left = this.y * DEFAULT_CELL_SIZE;
        let cellHtml = '<div id="cell-' + this.x + '-' + this.y + '" onclick="play(' + this.x + ',' + this.y + ')" class="cell" style="position: absolute; width: ' +
            DEFAULT_CELL_SIZE + 'px; height:' +
            DEFAULT_CELL_SIZE + 'px; left:' +
            left + 'px; top:' +
            top + 'px; line-height: ' +
            DEFAULT_CELL_SIZE + 'px;"></div>';
        return cellHtml;
    }
    draw() {
        let cellDiv = document.getElementById("cell-" + this.x + "-" + this.y);
        switch (this.value) {
            case VALUE_X:
                cellDiv.innerHTML = "X";
                break;
            case VALUE_O:
                cellDiv.innerHTML = "O";
                break;
            default:
                cellDiv.innerHTML = "";
                break;
        }
    }
}

class GameBoard {
    constructor(rows, cols, elementId) {
        this.rows = rows;
        this.cols = cols;
        this.elementId = elementId;
        this.turn = VALUE_O;
        this.cells = [];
        this.isOver = false;
    }
    draw() {
        let gameBoardDiv = document.getElementById(this.elementId);
        gameBoardDiv.innerHTML = "";
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            this.cells.push(row);
            for (let j = 0; j < this.cols; j++) {
                let cell = new Cell(i, j);
                row.push(cell);
                gameBoardDiv.innerHTML += cell.getHtml();
            }
        }
    }
    play(x, y) {
        if (this.isOver) {
            return;
        }
        let cell = this.cells[x][y];
        if (cell.value === VALUE_EMPTY) {
            cell.value = this.turn;
            cell.draw();
            this.check(x, y);
            if (this.turn === VALUE_O) {
                this.turn = VALUE_X;
            }
            else {
                this.turn = VALUE_O;
            }
        }
        else {
            alert("Cell is not empty");
        }
    }
    check(x, y) {
        let cell = this.cells[x][y];
        //check huong ngang
        let count = 1;
        let i = 1;
        let j = 1;
        while ((y + i < this.cols) && this.cells[x][y + i].value === cell.value) {
            count++;
            i++;
        }
        while ((y - i >= 0) && this.cells[x][y - i].value === cell.value) {
            count++;
            i++;
        }
        this.endGame(count);
        //huong doc
        while ((x + i < this.rows) && this.cells[x + i][y].value === cell.value) {
            count++;
            i++;
        }
        while ((x - i >= 0) && this.cells[x - i][y].value === cell.value) {
            count++;
            i++;
        }
        this.endGame(count);
        //cheo trai
        while ((y + i < this.cols) && (x + i < this.rows) && this.cells[x + i][y + j].value === cell.value) {
            count++;
            i++;
            j++;
        }
        while ((x - i >= 0) && (y - j >= 0) && this.cells[x - i][y - j].value === cell.value) {
            count++;
            i++;
            j++;
        }
        this.endGame(count);
        //cheo phai
        while ((y + j < this.cols) && (x - i >= 0) && this.cells[x - i][y + j].value === cell.value) {
            count++;
            i++;
            j++;
        }
        while ((y - j >= 0) && (x + i < this.rows) && this.cells[x + i][y - j].value === cell.value) {
            count++;
            i++;
            j++;
        }
        this.endGame(count);
    }
    endGame(count) {
        if (count >= 5) {
            this.isOver = true;
            alert("You win");
        }
    }
}

function play(x, y) {
    gameBoard.play(x, y);
}

function start() {
    gameBoard = new GameBoard(DEFAULT_ROWS, DEFAULT_COLS, "game-board");
    gameBoard.draw();
}

let gameBoard;
start();