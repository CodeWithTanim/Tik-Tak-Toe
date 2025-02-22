document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('mode');
    const difficulty = urlParams.get('difficulty');
    const player1 = decodeURIComponent(urlParams.get('p1') || 'Human');
    const player2 = gameMode === 'computer' ? 'Computer' : decodeURIComponent(urlParams.get('p2') || 'Player 2');

    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart-game');
    const playersDisplay = document.getElementById('players-display');

    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill(null);
    let isComputerTurn = false;

    // Initialize game
    playersDisplay.innerHTML = `${player1} <span class="vs">vs</span> ${player2}`;
    status.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn`;

    // Game logic
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function checkWinner() {
        for (const combo of winCombos) {
            const [a, b, c] = combo;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return combo;
            }
        }
        return null;
    }

    function handleClick(e) {
        const cell = e.target;
        const index = Array.from(cells).indexOf(cell);

        if (!gameActive || boardState[index] || (gameMode === 'computer' && isComputerTurn)) return;

        makeMove(index);

        if (gameMode === 'computer' && gameActive) {
            isComputerTurn = true;
            setTimeout(computerMove, 500);
        }
    }

    function makeMove(index) {
        boardState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;

        const winningCombo = checkWinner();
        if (winningCombo) {
            gameActive = false;
            winningCombo.forEach(i => cells[i].classList.add('win'));
            status.textContent = `${currentPlayer === 'X' ? player1 : player2} wins! 🎉`;
            restartBtn.classList.remove('hidden');
            launchConfetti();
        } else if (!boardState.includes(null)) {
            gameActive = false;
            status.textContent = "It's a tie!";
            restartBtn.classList.remove('hidden');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `${currentPlayer === 'X' ? player1 : player2}'s turn`;
        }
    }

    function computerMove() {
        if (!gameActive) return;

        let index;
        switch (difficulty) {
            case 'hard':
                index = getBestMove();
                break;
            case 'normal':
                index = Math.random() < 0.7 ? getBestMove() : getRandomMove();
                break;
            default: // easy
                index = getRandomMove();
        }

        makeMove(index);
        isComputerTurn = false;
    }

    function getRandomMove() {
        const emptyCells = boardState
            .map((cell, index) => cell === null ? index : null)
            .filter(cell => cell !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function getBestMove() {
        // Minimax algorithm implementation
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (boardState[i] === null) {
                boardState[i] = 'O';
                let score = minimax(boardState, 0, false);
                boardState[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner();

        if (winner) return isMaximizing ? -1 : 1;
        if (!board.includes(null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function launchConfetti() {
        const duration = 2000;
        const end = Date.now() + duration;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }
    
    // Add home button functionality
    document.getElementById('home-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    function restartGame() {
        boardState = Array(9).fill(null);
        gameActive = true;
        currentPlayer = 'X';
        isComputerTurn = false;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('win');
        });
        status.textContent = `${player1}'s turn`;
        restartBtn.classList.add('hidden');
    }

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartBtn.addEventListener('click', restartGame);

    // Start computer first if needed
    if (gameMode === 'computer' && currentPlayer === 'O') {
        isComputerTurn = true;
        setTimeout(computerMove, 500);
    }
});