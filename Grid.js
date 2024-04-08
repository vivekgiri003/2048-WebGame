const gridSize = 4;
const cellSize = 15;
const cellGap = 1.5;


export default class Grid {
    #cells
    get cells(){
        return this.#cells;
    }
    // using constructor for the Grid function calling from script.js
    constructor(gridElement) {
        // from script.js we get gridElement = gameBoard i.e the querySelector of game=board div in html;
        gridElement.style.setProperty("--gridSize", `${gridSize}`);
        gridElement.style.setProperty("--cellSize", `${cellSize}vmin`);
        gridElement.style.setProperty("--cellGap", `${cellGap}vmin`);

        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % gridSize, Math.floor(index / gridSize));
        })
    }

    aValue(){
        return cellSize;
    }
    bValue(){
        return gridSize;
    }

    get cellsByColumn(){
        return this.#cells.reduce((cellGrid, cell)=>{
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y]=cell;
            return cellGrid;
        },[])
    }
    get cellsByRow(){
        return this.#cells.reduce((cellGrid, cell)=>{
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x]=cell;
            return cellGrid;
        },[])
    }
    get #emptyCells(){
        return this.#cells.filter(cell => cell.tile == null)
    }
    get #filledCells(){
        return this.#cells.filter(cell => cell.tile != null)
    }
    filledCell(){
        return this.#filledCells
    }
    randomEmptyCell(){
        const randomIndex=Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex];
    }
    scoreValue(){
        return Cell.score;
    }
}
class Cell {
    #x
    #y
    #cellElement
    #tile
    #mergeTile
    // constructor for class cell for calling it using three parameter
    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }
    get x(){
        return this.#x;
    }
    get y(){
        return this.#y;
    }

    get tile(){
        return this.#tile;
    }
    set tile(value){
        this.#tile = value;
        if(value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }
    get mergeTile(){
        return this.#mergeTile;
    }

    set mergeTile(value){
        this.#mergeTile = value;
        if(value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }
    canAccept(tile){
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value));
    }
    mergeTiles(point){
        
        if(this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.#mergeTile.value;
        let value = parseInt(point.textContent);
        point.textContent = `${value+this.tile.value}`;
        this.mergeTile.removeMergeTile();
        this.mergeTile = null;
        
    }
    removeTile(){
        if(this.tile == null ) return;
        this.tile.removeMergeTile();
        this.tile = null;
    }
}

const createCellElements = (gridElement) => {
    const cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}