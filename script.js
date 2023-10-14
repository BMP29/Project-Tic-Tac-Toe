const btnCells = document.querySelectorAll('.cell');
const COLS = 3;
const ROWS = 3;

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
        { return true; }
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

    const getBoardCopy = () => { return board; }; 

    return { addMarker, checkStraightAdjLines, isBoardFull, resetBoard, getBoardCopy }
})();

const PerfectPlayer = (() => {
    const _evaluate = (b) => { 
        let player = 'O';
        let opponent = 'X';
        // Checking for Rows for X or O victory. 
        for(let row = 0; row < 3; row++) 
        { 
            if (b[row][0].getContent() == b[row][1].getContent() && 
                b[row][1].getContent() == b[row][2].getContent()) 
            { 
                if (b[row][0].getContent() == player) 
                    return +10; 
                    
                else if (b[row][0].getContent() == opponent) 
                    return -10; 
            } 
        } 
    
        // Checking for Columns for X or O victory. 
        for(let col = 0; col < 3; col++) 
        { 
            if (b[0][col].getContent() == b[1][col].getContent() && 
                b[1][col].getContent() == b[2][col].getContent()) 
            { 
                if (b[0][col].getContent() == player) 
                    return +10; 
    
                else if (b[0][col].getContent() == opponent) 
                    return -10; 
            } 
        } 
    
        // Checking for Diagonals for X or O victory. 
        if (b[0][0].getContent() == b[1][1].getContent() && 
            b[1][1].getContent() == b[2][2].getContent()) 
        { 
            if (b[0][0].getContent() == player) 
                return +10; 
                
            else if (b[0][0].getContent() == opponent) 
                return -10; 
        } 
    
        if (b[0][2].getContent() == b[1][1].getContent() &&  
            b[1][1].getContent() == b[2][0].getContent()) 
        { 
            if (b[0][2].getContent() == player) 
                return +10; 
                
            else if (b[0][2].getContent() == opponent) 
                return -10; 
        } 
    
        // Else if none of them have 
        // won then return 0 
        return 0; 
    } 

    // This is the minimax function. It  
    // considers all the possible ways  
    // the game can go and returns the  
    // value of the board 
    const _minimax = (board, depth, isMax) => {
        let score = _evaluate(board); 
        let player = 'O';
        let opponent = 'X';
    
        // If Maximizer has won the game 
        // return his/her evaluated score 
        if (score == 10) 
            return score; 
    
        // If Minimizer has won the game 
        // return his/her evaluated score 
        if (score == -10) 
            return score; 
    
        // If there are no more moves and 
        // no winner then it is a tie 
        if (!gameBoard.isBoardFull() == false) 
            return 0; 
    
        // If this maximizer's move 
        if (isMax) 
        { 
            let best = -1000; 
    
            // Traverse all cells 
            for(let i = 0; i < 3; i++) 
            { 
                for(let j = 0; j < 3; j++) 
                { 
                    
                    // Check if cell is empty 
                    if (board[i][j].getContent() == '') 
                    { 
                        
                        // Make the move 
                        board[i][j].addMarker(player); 
    
                        // Call minimax recursively  
                        // and choose the maximum value 
                        best = Math.max(best, _minimax(board, 
                                        depth + 1, !isMax)); 
    
                        // Undo the move 
                        board[i][j].addMarker('');
                    } 
                } 
            } 
            return best; 
        } 
    
        // If this minimizer's move 
        else
        { 
            let best = 1000; 
    
            // Traverse all cells 
            for(let i = 0; i < 3; i++) 
            { 
                for(let j = 0; j < 3; j++) 
                { 
                    
                    // Check if cell is empty 
                    if (board[i][j].getContent() == '') 
                    { 
                        
                        // Make the move 
                        board[i][j].addMarker(opponent); 
    
                        // Call minimax recursively and  
                        // choose the minimum value 
                        best = Math.min(best, _minimax(board, 
                                        depth + 1, !isMax)); 
    
                        // Undo the move 
                        board[i][j].addMarker(''); 
                    } 
                } 
            } 
            return best; 
        } 
    } 

    // This will return the best possible 
    // move for the player 
    const findBestMove = () => {
        const player = 'O';
        let bestVal = -Infinity; 
        let bestMove = [];
        let board = gameBoard.getBoardCopy();

        // Traverse all cells, evaluate  
        // minimax function for all empty  
        // cells. And return the cell 
        // with optimal value. 
        for(let i = 0; i < 3; i++) 
        { 
            for(let j = 0; j < 3; j++) 
            { 
                
                // Check if cell is empty 
                if (board[i][j].getContent() == '') 
                { 
                    
                    // Make the move 
                    board[i][j].addMarker(player);

                    // compute evaluation function  
                    // for this move. 
                    let moveVal = _minimax(board, 0, false); 
    
                    // Undo the move 
                    board[i][j].addMarker('');
    
                    // If the value of the current move  
                    // is more than the best value, then  
                    // update best 
                    if (moveVal > bestVal) 
                    { 
                        bestMove[0] = i;
                        bestMove[1] = j;
                        bestVal = moveVal; 
                    } 
                } 
            } 
        } 
    
        return bestMove; 
    }

    return { findBestMove };
})();

const gameController = (function() {
    const playerX = playerFctry('X', 'X');
    const playerO = playerFctry('O', 'O');

    let activePlayer = playerX;
    let gameMd;
    const modal = document.getElementById("ModalW");
    const btnClose = document.getElementById("btn-close");
    const spanWinner = document.getElementById("winner");
    const wMsg = document.getElementById('wMsg');
    const gameMode = document.getElementById('gameModes');
    let modalDisplay = window.getComputedStyle(modal).getPropertyValue('display');
    let modalOpacity = window.getComputedStyle(modal).getPropertyValue('opacity');

    const _resetGame = () => { gameBoard.resetBoard(); activePlayer = playerX; };

    const _switchPlayerTurn = () => { 
        activePlayer =  activePlayer === playerX ? playerO : playerX; 
    };

    gameMode.addEventListener('change', () => {
        gameMd = gameMode.value;

        if(gameMd === 'pve') {
            const ai = activePlayer === playerX ? playerO : playerX;
            console.log(ai.getMarker());
        }
    });

    //changes the modal display
    const _ModalOnOff = () => {
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
    const _fadeInOut = () => {
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
        _fadeInOut();
        _ModalOnOff();
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            _fadeInOut();
            _ModalOnOff();
        }
    });

    //display modal with the winner
    const _showWinner = (name) => {
        spanWinner.textContent = name;
        if(name === 'Draw') {
            wMsg.style.display = 'none';
            spanWinner.style.fontSize = '7.5rem';
        }else {
            wMsg.style.display = 'block';
            spanWinner.style.fontSize = '12rem';
        }

        _ModalOnOff();
        _fadeInOut();
    }

    //execute a turn with current player
    const _playTurn = (row, col) => {
        const moveValid = gameBoard.addMarker(row, col, activePlayer);
        let winner = undefined;

        //checks if the move made by the player completes a straight line
        //if it does, than show that he won and reset the game
        if(gameBoard.checkStraightAdjLines(row, col)) {
            console.log(activePlayer.getName() + " won");
            _showWinner(activePlayer.getName());
            winner = activePlayer.getName();
            _resetGame();
            
        }else if(gameBoard.isBoardFull()){
            console.log("DRAW!");
            _showWinner('Draw');
            winner = 'Draw';
            _resetGame();
        }
        
        if(moveValid && winner === undefined) _switchPlayerTurn();
        return { winner, moveValid };
    }

    //binds the playTurn method and Ai-Turn logic to every buttonCell
    btnCells.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = Math.floor([...btnCells].indexOf(btn)/ROWS); // GIVES THE ROW POSITION
            const col = Math.floor([...btnCells].indexOf(btn)%COLS); // GIVES THE COLUMN POSITION

            let data = _playTurn(row, col);

            if(gameMd === 'pve' && data.winner === undefined && data.moveValid) {
                const aiMove = PerfectPlayer.findBestMove();
                _playTurn(aiMove[0], aiMove[1]);
            }
        });
    });
})();