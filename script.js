document.addEventListener('DOMContentLoaded', () => {
    const wordLength = 5;
    let targetWords = [];
    let target;
    let currentGuess = 0;
    let result = 0;
    let previousGuesses = [];

    const guessNumberInput = document.getElementById('number-guesses');
    const guessGameContainer = document.getElementById('guess-game-container');
    const gameContainer = document.getElementById('game-container');
    const userGuessInput = document.getElementById('user-guess');

    fetch('nounlist.txt')
        .then(response => response.text())
        .then(data => {
            targetWords = data.split('\n').filter(word => word.length === wordLength && /^[a-zA-Z]+$/.test(word.toUpperCase()));
            // Initialize the game variables here
            target = targetWords[Math.floor(Math.random() * targetWords.length)].toUpperCase();
            currentGuess = 0;
            previousGuesses = [];
        })
        .catch(error => console.error('Error loading words:', error));

    guessNumberInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            const numOfGuesses = parseInt(guessNumberInput.value);

        if (numOfGuesses < 1 || numOfGuesses > 5 || isNaN(numOfGuesses)) {
            alert('Number of guesses should be between 1 and 5 (inclusive)');
            return;
        }

        guessGameContainer.style.display = 'none';
        gameContainer.style.display = 'block';

        createBoard(numOfGuesses, wordLength);
        }
    });

    userGuessInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            console.log('THIS IS TARGET: ', target);
            let guess = userGuessInput.value.toUpperCase();
            if (previousGuesses.includes(guess)) {
                alert('You have already guessed that word. Try a different one.');
                return;
            }
            if (guess.length == wordLength) {
                previousGuesses.push(guess);
                result = handleGuess(guess, target, currentGuess, wordLength);
                if (result == 0) {
                    ++currentGuess;
                    userGuessInput.value = '';
                }
            }
            else {
                alert(`Please enter a ${wordLength}-letter word.`);
            }
        }
    });

    function createBoard(rows, wordLength) {
        const board = document.getElementById('board');
        board.innerHTML = '';
    
        for (let i = 0; i < rows; ++i) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < wordLength; ++j) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }
    
    function handleGuess(guess, target, currentGuess, wordLength) {
        let result = 0;
        const row = document.getElementsByClassName('row')[currentGuess];
        let correct = 0;
    
        for (let i = 0; i < guess.length; ++i) {
            const cell = row.children[i];
            cell.textContent = guess[i];
            if (guess[i] == target[i]) {
                cell.style.backgroundColor = '#d3edc5';
                ++correct;
            }
            else if (target.includes(guess[i])) {
                cell.style.backgroundColor = '#fdf3d6';
            }
            else {
                cell.style.backgroundColor = 'grey';
            }
        }
    
        if (correct == wordLength) {
            for (let i = 0; i < row.children.length; i++) {
                row.children[i].style.backgroundColor = '#d3edc5'; // Green color
            }
            setTimeout(() => {
                alert('Congrats! You guessed the word!');
                result = resetGame(guess);
            }, 500);
        }
        else if (currentGuess == document.getElementsByClassName('row').length - 1) {
            setTimeout(() => {
                alert(`Game over! The correct word was ${target}.`);
                result = resetGame(guess);
            }, 500);
        }

        return result;
    }
    
    function resetGame(guess) {
        document.getElementById('guess-game-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('number-guesses').value = '';
        document.getElementById('board').innerHTML = '';
        currentGuess = 0;
        userGuessInput.value = '';
        target = targetWords[Math.floor(Math.random() * targetWords.length)].toUpperCase();;
        guess.value = '';
        previousGuesses = [];
        

        return 1;
    }
});

