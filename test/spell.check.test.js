import {SpellChecker} from '../src/spell.check.js';
import {expect, jest, test} from '@jest/globals';

const [getResponse, parse, isSpellingCorrect] = [SpellChecker.getResponse, SpellChecker.parse, async (word) => await SpellChecker.isSpellingCorrect(word)];

afterEach(() => {
  jest.clearAllMocks();
});

test('getResponse takes FAVOR returns some response', async () => {
  const result = await getResponse('FAVOR');
  
  expect(result.length).toBeGreaterThan(0);
});

describe.each([
  ['true', true],
  ['false', false]
])('.parse("%s")', (string, value) => {
  test(`to return boolean value ${value}`, () => {
    expect(parse(string)).toBe(value);
  });
});

test('isSpellingCorrect calls getResponse and parse', async () => {
  const parseSpy = jest.spyOn(SpellChecker, 'parse').mockImplementationOnce(() => true);
  
  const getResponseSpy = jest.spyOn(SpellChecker, 'getResponse').mockImplementationOnce(() => 'true');

  expect(await isSpellingCorrect('FAVOR')).toBeTruthy();

  expect(parseSpy).toHaveBeenCalledWith('true');

  expect(getResponseSpy).toHaveBeenCalledWith('FAVOR');
});

test('isSpellingCorrect passes on the exception from getResponse to the caller', async () => {
  const spy = jest.spyOn(SpellChecker, 'getResponse').mockImplementationOnce(() => {
    throw new Error('Failed to check spelling'); 
  });

  await expect(isSpellingCorrect('FAVOR')).rejects.toThrow(new Error('Failed to check spelling'));
    
  expect(spy).toBeCalledTimes(1);
});
