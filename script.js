const btnCells = document.querySelectorAll('[type]');
const COLS = 3;
const ROWS = 3;
const playerX = playerFctry('playerX', 'X');
const playerO = playerFctry('playerO', 'O');

const gameBoard = (function() {
    const board = [];
    
    //initialize the board
    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
          board[i][j] = Cell();
        }
    }

    //renders the gameBoard
    const _render = () => {
        let k = -1;
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                k++;
                btnCells[k].textContent = board[i][j].getContent();
            }
        }
    };

    //checks if a cell is available
    const _isCellAvailable = (row, col) => {
        if(row < ROWS && col < COLS) {
            return board[row][col].getContent() === ''? true : false;
        }
        return false;
    };

    //checks the board to see if the move made completes any adjacent line 
    //(a line is only complete if its 3 cells have the same marker) 
    //if so, returns true
    const checkStraightAdjLines = (row, col) => {
        let hCells = 0;           //counter for horizontal lines
        let vCells = 0;           //counter for vertical lines
        let dCells = 0;           //counter for the diagonal line
        let inverseDCells = 0;    //counter for the inverseDiagonal line

        const MAX_SCORE = 3;
        
        j = COLS-1;
        const mark = board[row][col].getContent();

        //checks if the rows, columns or diagonals are equal to the used marker
        for (let i = 0; i < ROWS; i++) {
            if(board[row][i].getContent()   === mark) hCells++;
            if(board[i][col].getContent()   === mark) vCells++;
            if(board[i][i].getContent()     === mark) dCells++;
            if(board[i][j--].getContent()   === mark) inverseDCells++;
        }

        if(hCells === MAX_SCORE 
        || vCells === MAX_SCORE 
        || dCells === MAX_SCORE 
        || inverseDCells === MAX_SCORE)
        { return true;}
    };

    //checks if all cells are marked
    //if so, return true
    const isBoardFull = () => {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if(board[i][j].getContent() === '') return false;
            }
        }

        return true;
    }

    //all cells content are setted to empty
    const resetBoard = () => {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                board[i][j].addMarker('');
            }
        }
        _render();
    };

    //add a marker to the cell if its empty
    const addMarker = (row, col, marker) => {
        if(_isCellAvailable(row, col)) {
            board[row][col].addMarker(marker.getMarker());
            _render();
            return true;
        }
        return false;
    };

    return { addMarker, checkStraightAdjLines, isBoardFull, resetBoard }
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

    return { getName, getMarker };
}

const gameController = (function(playerX, playerO) {
    let activePlayer = playerX;

    const getActivePlayer = () => { return activePlayer; };
    const switchPlayerTurn = () => { activePlayer =  activePlayer === playerX ? playerO : playerX; };
    const resetGame = () => { gameBoard.resetBoard(); activePlayer = playerX; }

    //execute a turn with current player
    const playTurn = (btn) => {
        const row = Math.floor([...btnCells].indexOf(btn)/ROWS); // GIVES THE ROW POSITION
        const col = Math.floor([...btnCells].indexOf(btn)%COLS); // GIVES THE COLUMN POSITION

        const moveValid = gameBoard.addMarker(row, col, activePlayer);

        //checks if the move made by the player completes a straigth line
        //if it does, than show that he won and reset the game
        if(gameBoard.checkStraightAdjLines(row, col)) {
            console.log(activePlayer.getName() + " won");
            resetGame();
            return;
        }else if(gameBoard.isBoardFull()){
            console.log("DRAW!");
            resetGame();
            return;
        }
        if(moveValid) switchPlayerTurn();
    }

    //binds the playTurn method to every buttonCell
    btnCells.forEach(btn => {
        btn.addEventListener('click', playTurn.bind(this, btn));
    });

    return{ getActivePlayer }
})(playerX, playerO);