import { GAME_STATUS, play } from './wordle.js';
import { SpellChecker } from './spell.check.js';
import { WordPicker } from './word.picker.js';
import './styles.css';

let currentGuess = [];

let currentAttempt = 0;

let gameOver = false;

let target;

(async () => {
  target = await WordPicker.getARandomWord();
})();

function createBoard() {
  const table = document.getElementById('grid');

  for (let i = 0; i < 6; i++) {
    const row = table.insertRow(i);

    for (let j = 0; j < 5; j++) {
      const cell = row.insertCell(j);
      
      cell.textContent = '';
    }
  } 
}

async function guess() { 
 
  const [numberOfAttempts, response, gameStatus, message] = Object.values(await play(target, currentGuess.join(''), currentAttempt, SpellChecker.isSpellingCorrect));

  if(gameStatus === GAME_STATUS.WRONG_SPELLING) {
    alert('Not a valid word, try again!');

    disableGuessButton();
    
    return;
  }

  const row = document.getElementById('grid').rows[currentAttempt];
  
  for (const [index, match] of response.entries()) {
    const cell = row.children[index];
    cell.classList.add(match);
  }

  currentGuess = [];

  currentAttempt = numberOfAttempts;

  disableGuessButton();

  if(gameStatus !== GAME_STATUS.IN_PROGRESS) {
    setTimeout(() => alert(message), 1);

    gameOver = true;
  }
}

function insertLetter(pressedKey) {
  if (currentGuess.length === 5) {
    return;
  }

  pressedKey = pressedKey.toUpperCase();

  const row = document.getElementById('grid').rows[currentAttempt];

  const cell = row.children[currentGuess.length];

  cell.textContent = pressedKey;

  currentGuess.push(pressedKey);
}

function deleteLetter() {
  const row = document.getElementById('grid').rows[currentAttempt];

  const cell = row.children[currentGuess.length - 1];

  cell.textContent = '';
  
  if (currentGuess.length === 5){
    disableGuessButton();
  }

  currentGuess.pop();
}

document.getElementById('guessButton').addEventListener('click', () => {
  if (document.getElementById('guessButton').disabled === false){
    guess();
  }
});

document.addEventListener('keyup', (event) => {
  const keypress = event.key;

  if (gameOver === true)
  {
    return;
  }

  if (keypress === 'Enter' && isGuessButtonEnabled()){
    guess();
    return;
  }

  else if (keypress === 'Backspace' && currentGuess.length !== 0){
    deleteLetter();
    return;
  }


  else if (currentGuess.length !== 5 && keypress.length === 1 && keypress.match(/[a-z]/gi)) {
    insertLetter(keypress);
    
    if (currentGuess.length === 5) {
      enableGuessButton();
    }
  }
});

function enableGuessButton() {
  const guessButton = document.getElementById('guessButton');
  
  guessButton.disabled = false;
}

function disableGuessButton() {
  const guessButton = document.getElementById('guessButton');

  guessButton.disabled = true;
}

function isGuessButtonEnabled(){
  const guessButton = document.getElementById('guessButton');

  return guessButton.disabled === false;
}

createBoard();