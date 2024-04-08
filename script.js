import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.querySelector("#game-board");
const result = document.querySelector("#res");
const section = document.querySelector("#section");
const point = document.querySelector("#point");
const hpoint = document.querySelector("#highscore-point");
const button = document.querySelector("#button");
const game = document.querySelector("#game");


const grid = new Grid(gameBoard)


const a = grid.aValue();
const b = grid.bValue();


section.style.setProperty("--gridSize", `${a}`);
section.style.setProperty("--cellSize", `${b}vmin`);


// console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
// let ele = document.querySelectorAll(".tile");

function restart(){
    grid.cells.forEach(cell => cell.removeTile())
    point.textContent = `00`;
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);
}

button.addEventListener("click",restart)

userInput();

// console.log(grid.cellsByColumn);

function userInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                userInput()
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                userInput()
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                userInput()
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                userInput()
                return;
            }
            await moveRight();
            break;
        default:
            userInput()
            return;
    }
    grid.cells.forEach(cell => cell.mergeTiles(point));
    if (parseInt(point.textContent) > parseInt(hpoint.textContent)) {
        hpoint.textContent = `${point.textContent}`
    }

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile;
    if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
        newTile.waitForTransition(true).then(() => {
            result.textContent = "Game Over !!!!";
            userInput();

        });
        return;

    }

    userInput()
}

const moveUp = () => {
    return slideTiles(grid.cellsByColumn);
}
const moveDown = () => {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}
const moveLeft = () => {
    return slideTiles(grid.cellsByRow);
}
const moveRight = () => {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

const slideTiles = (cells) => {
    return Promise.all(
        cells.flatMap(group => {
            const promises = [];
            for (let i = 1; i < group.length; i++) {
                const cell = group[i];
                if (cell.tile == null) continue;
                let lastValidCell;
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j];
                    if (!moveToCell.canAccept(cell.tile)) break;
                    lastValidCell = moveToCell;
                }
                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition());
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    }
                    else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null;
                }
            }
            return promises;
        }))
}

const canMoveUp = () => {
    return canMove(grid.cellsByColumn)
}

const canMove = (cells) => {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) {
                return false;
            }
            if (cell.tile == null) {
                return false;
            }
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile)
        })
    })
}
const canMoveDown = () => {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
const canMoveLeft = () => {
    return canMove(grid.cellsByRow)
}
const canMoveRight = () => {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}
