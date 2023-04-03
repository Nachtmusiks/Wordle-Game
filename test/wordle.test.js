import { MATCH, GAME_STATUS, MESSAGE, tally, play}  from '../src/wordle.js';
import {expect, jest, test} from '@jest/globals';

const {EXACT, EXISTS, NO_MATCH} = MATCH; 
const {WIN, LOSE, IN_PROGRESS, WRONG_SPELLING} = GAME_STATUS;

test('canary test', () => {
  expect(true).toBe(true);
});

describe.each([
  ['FAVOR', 'FAVOR', [EXACT, EXACT, EXACT, EXACT, EXACT]],
  ['FAVOR', 'TESTS', [NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH]],
  ['FAVOR', 'RAPID', [EXISTS, EXACT, NO_MATCH, NO_MATCH, NO_MATCH]],
  ['FAVOR', 'MAYOR', [NO_MATCH, EXACT, NO_MATCH, EXACT, EXACT]],
  ['FAVOR', 'RIVER', [NO_MATCH, NO_MATCH, EXACT, NO_MATCH, EXACT]],
  ['FAVOR', 'AMAST', [EXISTS, NO_MATCH, NO_MATCH, NO_MATCH, NO_MATCH]],
  ['SKILL', 'SKILL', [EXACT, EXACT, EXACT, EXACT, EXACT]],
  ['SKILL', 'SWIRL', [EXACT, NO_MATCH, EXACT, NO_MATCH, EXACT]],
  ['SKILL', 'CIVIL', [NO_MATCH, EXISTS, NO_MATCH, NO_MATCH, EXACT]],
  ['SKILL', 'SHIMS', [EXACT, NO_MATCH, EXACT, NO_MATCH, NO_MATCH]],
  ['SKILL', 'SILLY', [EXACT, EXISTS, EXISTS, EXACT, NO_MATCH]],
  ['SKILL', 'SLICE', [EXACT, EXISTS, EXACT, NO_MATCH, NO_MATCH]],
  
])('.tally(%s, %s)', (target, guess, response) => {
  test(`returns ${response}`, () => {
    expect(tally(target, guess)).toStrictEqual(response);  
  });
});

describe.each([
  ['FAVOR', 'FOR', 'INVALID WORD LENGTH: Expected 5 received 3'],
  ['FAVOR', 'FERVER', 'INVALID WORD LENGTH: Expected 5 received 6']

])('.tally(%s, %s)', (target, guess, response) => {
  test(`throw error "${response}"`, () => {
    expect(() => tally(target, guess)).toThrow(response);
  });
});

describe.each([
  ['FAVOR', 'FAVOR', 0, {attempts: 1, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[0]}],
  ['FAVOR', 'RAPID', 0, {attempts: 1, response: [EXISTS, EXACT, NO_MATCH, NO_MATCH, NO_MATCH], gameStatus: IN_PROGRESS, message: ''}],
  ['SKILL', 'SKILL', 1, {attempts: 2, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[1]}],
  ['SKILL', 'SWIRL', 1, {attempts: 2, response: [EXACT, NO_MATCH, EXACT, NO_MATCH, EXACT], gameStatus: IN_PROGRESS, message: ''}],
  ['PANDA', 'PANDA', 2, {attempts: 3, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[2]}],
  ['PANDA', 'PANTS', 2, {attempts: 3, response: [EXACT, EXACT, EXACT, NO_MATCH, NO_MATCH], gameStatus: IN_PROGRESS, message: ''}],
  ['FAVOR', 'FAVOR', 3, {attempts: 4, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[3]}],
  ['FAVOR', 'RAPID', 3, {attempts: 4, response: [EXISTS, EXACT, NO_MATCH, NO_MATCH, NO_MATCH], gameStatus: IN_PROGRESS, message: ''}],
  ['SKILL', 'SKILL', 4, {attempts: 5, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[4]}],
  ['SKILL', 'SWIRL', 4, {attempts: 5, response: [EXACT, NO_MATCH, EXACT, NO_MATCH, EXACT], gameStatus: IN_PROGRESS, message: ''}],
  ['PANDA', 'PANDA', 5, {attempts: 6, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[5]}],
  ['PANDA', 'PANTS', 5, {attempts: 6, response: [EXACT, EXACT, EXACT, NO_MATCH, NO_MATCH], gameStatus: LOSE, message: MESSAGE[6]('PANDA')}],

])('.play(%s, %s, %d)', (target, guess, attempt, response) => {
  test(`returns ${JSON.stringify(response)}`, async () => {
    expect(await play(target, guess, attempt)).toStrictEqual(response);
  });
});

describe.each([
  ['FAVOR', 'FOR', 0, 'INVALID WORD LENGTH: Expected 5 received 3'],
  ['FAVOR', 'FAVOR', 6, 'ATTEMPT IS OVER THE LIMIT: MAX ATTEMPT is 6 received 7'],
  ['FAVOR', 'RAPID', 7, 'ATTEMPT IS OVER THE LIMIT: MAX ATTEMPT is 6 received 8']

])('.play(%s, %s, %d)', (target, guess, attempt, response) => {
  test(`throw error "${response}"`, async () => {
    await expect(play(target, guess, attempt)).rejects.toThrow(response);
  });
});

describe.each([
  ['FAVOR', 'FAVOR', 0, {attempts: 1, response: [EXACT, EXACT, EXACT, EXACT, EXACT], gameStatus: WIN, message: MESSAGE[0]}],
  ['FAVOR', 'RIVER', 0, {attempts: 1, response: [NO_MATCH, NO_MATCH, EXACT, NO_MATCH, EXACT], gameStatus: IN_PROGRESS, message: ''}]
  
])('.play(%s, %s, %d) with correct spelling', (target, guess, attempt, response) => {
  test(`returns ${JSON.stringify(response)}`, async () => {
    const isSpellingCorrect = jest.fn().mockReturnValue(true);

    const result = await play(target, guess, attempt, isSpellingCorrect);
  
    expect(isSpellingCorrect).toHaveBeenCalledWith(guess);
  
    expect(result).toEqual(response);
  });
});

describe.each([
  ['FAVOR', 'FAVOR', 0, {attempts: 0, response: '', gameStatus: WRONG_SPELLING, message: ''}],
  ['FAVOR', 'RIVER', 1, {attempts: 1, response: '', gameStatus: WRONG_SPELLING, message: ''}]
  
])('.play(%s, %s, %d) with wrong spelling', (target, guess, attempt, response) => {
  test(`returns ${JSON.stringify(response)}`, async () => {
    const isSpellingCorrect = jest.fn().mockReturnValue(false);

    const result = await play(target, guess, attempt, isSpellingCorrect);
  
    expect(isSpellingCorrect).toHaveBeenCalledWith(guess);
  
    expect(result).toEqual(response);
  });
});

test('play passes on the exception from isSpellingCorrect to the caller', async () => {
  const isSpellingCorrect = jest.fn().mockImplementation(() => {
    throw new Error('Spell Checking Service is Down'); 
  });

  await expect(play('FAVOR', 'FAVOR', 0, isSpellingCorrect)).rejects.toThrow('Spell Checking Service is Down');

  expect(isSpellingCorrect).toHaveBeenCalledWith('FAVOR');
});
