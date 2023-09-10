const btnPos = document.querySelectorAll('[data-position]');

const gameBoard = (function() {
    const COLS = 3;
    const ROWS = 3;

    const board = [];
    
    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
          board[i][j] = Cell();
        }
    }

    const render = () => {
        let k = -1;
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                k++;
                btnPos[k].textContent = board[i][j].getContent();
            }
        }
    };

    const isCellAvailable = (row, col) => {
        return board[row][col].getContent() === ''? true : false;
    };

    const addMarker = (row, col, marker) => {
        if(isCellAvailable(row, col)) {
            board[row][col].addMarker(marker);
            render();
            return true;
        }
        return false;
    };

    return { addMarker }
})();

function Cell() {
    let content = '';

    const addMarker = (marker) => { content = marker; };
    const getContent = () => { return content; };

    return { addMarker, getContent };
}