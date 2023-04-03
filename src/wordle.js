export const MATCH = {
  NO_MATCH: 'NO_MATCH',
  EXACT: 'EXACT',
  EXISTS: 'EXISTS',
};

export const GAME_STATUS = {
  WIN: 'WIN',
  LOSE: 'LOST',
  IN_PROGRESS: 'IN PROGRESS',
  WRONG_SPELLING: 'WRONG SPELLING'
};

export const MESSAGE = {
  0: 'Amazing',
  1: 'Splendid',
  2: 'Awesome',
  3: 'Yay',
  4: 'Yay',
  5: 'Yay',
  6: (target) => `It was ${target}, better luck next time`
};

const {EXACT, EXISTS, NO_MATCH} = MATCH; 

const MAX_ATTEMPTS = 5;

export function tally(target, guess) {
  if (guess.length !== 5) {
    throw new Error(`INVALID WORD LENGTH: Expected 5 received ${guess.length}`);
  }

  return guess
    .split('')
    .reduce(
      (score, letter, i) => [...score, tallyOfCurrentChar(i, target, guess)], []);
} 

function tallyOfCurrentChar(position, target, guess) {
  if (target[position] === guess[position]) {
    return EXACT;
  }

  const currentLetter = guess[position];

  const positionalMatches = countPositionalMatches(target, guess, currentLetter);

  const nonPositionalOccurrencesInTarget = countNumberOfOccurrenceeUntilPosition(target.length - 1, target, currentLetter) - positionalMatches;

  const numberOfOccurancesInGuessUntilPosition = countNumberOfOccurrenceeUntilPosition(position, guess, currentLetter);

  return nonPositionalOccurrencesInTarget >= numberOfOccurancesInGuessUntilPosition ? EXISTS : NO_MATCH;
}

function countPositionalMatches(target, guess, letter) {
  return target
    .split('')
    .filter((ch, i) => target[i] === guess[i])
    .filter((ch) => ch === letter).length;
}

function countNumberOfOccurrenceeUntilPosition(position, word, letter) {
  const matches = word
    .substring(0, position + 1)
    .match(new RegExp(letter, 'g'));

  return matches ? matches.length : 0;
}

export async function play(target, guess, attempt, isSpellingCorrect = async (guess) => true) { 
  if (attempt > MAX_ATTEMPTS) {
    throw new Error(`ATTEMPT IS OVER THE LIMIT: MAX ATTEMPT is 6 received ${attempt+1}`);
  }

  if (await isSpellingCorrect(guess)) {
    const response = tally(target, guess);

    const gameStatus = target === guess ? GAME_STATUS.WIN : attempt === MAX_ATTEMPTS ? GAME_STATUS.LOSE : GAME_STATUS.IN_PROGRESS;
  
    const message = gameStatus === GAME_STATUS.WIN ? MESSAGE[attempt] : gameStatus === GAME_STATUS.LOSE ? MESSAGE[attempt + 1](target) : '';
  
    return { attempts: attempt + 1, response: response, gameStatus: gameStatus, message: message };
  }

  return { attempts: attempt, response: '', gameStatus: GAME_STATUS.WRONG_SPELLING, message: '' };
}

