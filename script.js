const btnCells = document.querySelectorAll('.cell');
const COLS = 3;
const ROWS = 3;
const playerX = playerFctry('X', 'X');
const playerO = playerFctry('O', 'O');



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
    const modal = document.getElementById("ModalW");
    const btnClose = document.getElementById("btn-close");
    const spanWinner = document.getElementById("winner");
    const wMsg = document.getElementById('wMsg');
    let modalDisplay = window.getComputedStyle(modal).getPropertyValue('display');
    let modalOpacity = window.getComputedStyle(modal).getPropertyValue('opacity');

    const getActivePlayer = () => { return activePlayer; };
    const switchPlayerTurn = () => { activePlayer =  activePlayer === playerX ? playerO : playerX; };
    const resetGame = () => { gameBoard.resetBoard(); activePlayer = playerX; };

    //changes the modal display
    const ModalOnOff = () => {
        console.log(modalDisplay);
        if(modalDisplay === 'none') {
            modal.style.display = 'block'; 
            modalDisplay = 'block';
        } else {
            setTimeout(() => { modal.style.display = 'none';  }, 150);
            modalDisplay = 'none';
        }
        console.log(modalDisplay);
    };

    //changes the modal opacity
    const fadeInOut = () => {
        if(modalOpacity === '0') {
            setTimeout(() => { modal.style.opacity = '1'; }, 50);
            modalOpacity = '1';
        } else {
            modal.style.opacity = '0';
            modalOpacity = '0';
        }
    };

    //closes modal when btnClose is clicked 
    btnClose.addEventListener('click', () => {
        fadeInOut();
        ModalOnOff();
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            fadeInOut();
            ModalOnOff();
        }
    });

    //display modal with the winner
    const showWinner = (name) => {
        spanWinner.textContent = name;
        if(name === 'Draw') {
            wMsg.style.display = 'none';
            spanWinner.style.fontSize = '7.5rem';
        }else {
            wMsg.style.display = 'block';
            spanWinner.style.fontSize = '12rem';
        }

        ModalOnOff();
        fadeInOut();
    }

    //execute a turn with current player
    const playTurn = (btn) => {
        const row = Math.floor([...btnCells].indexOf(btn)/ROWS); // GIVES THE ROW POSITION
        const col = Math.floor([...btnCells].indexOf(btn)%COLS); // GIVES THE COLUMN POSITION

        const moveValid = gameBoard.addMarker(row, col, activePlayer);

        //checks if the move made by the player completes a straight line
        //if it does, than show that he won and reset the game
        if(gameBoard.checkStraightAdjLines(row, col)) {
            console.log(activePlayer.getName() + " won");
            showWinner(activePlayer.getName());
            resetGame();

            return;
        }else if(gameBoard.isBoardFull()){
            console.log("DRAW!");
            showWinner('Draw');
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