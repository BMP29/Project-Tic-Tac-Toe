const btnCells = document.querySelectorAll('[type]');
const COLS = 3;
const ROWS = 3;

const gameBoard = (function() {
    const board = [];
    
    //initializa the board
    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
          board[i][j] = Cell();
        }
    }

    //renders the gameBoard
    const render = () => {
        let k = -1;
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                k++;
                btnCells[k].textContent = board[i][j].getContent();
            }
        }
    };

    //checks if a cell is empty
    const isCellAvailable = (row, col) => {
        if(row < ROWS && col < COLS) {
            return board[row][col].getContent() === ''? true : false;
        }
        return false;
    };

    //add a marker the cell if its empty
    const addMarker = (row, col, marker) => {
        if(isCellAvailable(row, col)) {
            board[row][col].addMarker(marker.getMarker());
            render();
        }
    };

    return { addMarker }
})();

function Cell() {
    let content = '';

    const addMarker = (marker) => { content = marker; };
    const getContent = () => { return content; };

    return { addMarker, getContent };
}

function playerFctry(name, marker) {
    const getName = () => { return name; };
    const getMarker = () => { return marker; };
    const setName = (name) => { this.name = name; };

    return { getName, getMarker, setName };
}

const playerX = playerFctry('playerX', 'X');
const playerO = playerFctry('playerO', 'O');

const gameController = (function(playerX, playerO) {
    const players = [playerX, playerO];
    let activePlayer = players[0];

    const getActivePlayer = () => { return activePlayer; };
    const switchPlayerTurn = () => { activePlayer =  activePlayer === players[0] ? players[1] : players[0]; };

    const playRound = (btn) => {
        gameBoard.addMarker(
            Math.floor([...btnCells].indexOf(btn)/ROWS), // GIVES THE ROW POSITION
            Math.floor([...btnCells].indexOf(btn)%COLS), // GIVES THE COLUMN POSITION
            activePlayer
        );
        switchPlayerTurn();
    }

    btnCells.forEach(btn => {
        btn.addEventListener('click', playRound.bind(this, btn));
    });

    return{ activePlayer }
})(playerX, playerO);