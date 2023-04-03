import { WordPicker } from '../src/word.picker.js';
import {expect, jest, test} from '@jest/globals';

const [getResponse, parse, getARandomWordGivenASeed, getARandomWord] = [WordPicker.getResponse, WordPicker.parse, WordPicker.getARandomWordGivenASeed, WordPicker.getARandomWord];

beforeEach(() => {
  jest.spyOn(WordPicker, 'getResponse').mockImplementation(async () => '[FAVOR, RIVER, SKILL]');
  
  jest.spyOn(WordPicker, 'parse').mockImplementation(() => ['FAVOR', 'RIVER', 'SKILL']);

  jest.spyOn(WordPicker, 'getARandomWordGivenASeed').mockImplementationOnce(() => 'FAVOR');

  WordPicker.seed = null;

  WordPicker.random = null;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('getResponse returns some response string', async () => {
  expect((await getResponse()).length).toBeGreaterThan(0);
});

test('parse response takes a string of words and returns a list of words', () => {
  expect(parse('[FAVOR, RIVER,SKILL]')).toStrictEqual(['FAVOR', 'RIVER', 'SKILL']);
});

test('parse returns takes an empty string of words and returns an empty list', () => {
  expect(parse('[]')).toStrictEqual([]);
});

test('parse throws an exception if string does not have a list', () => {
  expect(() => parse('FAVOR')).toThrow(new Error('No list was passed!'));
});

test('given a seed and a list of words, get a random word', () => {
  const seed = 123456789; 

  const words = ['FAVOR', 'RIVER', 'SKILL'];

  expect(words).toContain(getARandomWordGivenASeed(seed, words));
});

test('given the same seed, get two random words and verify they are different', () => {
  const seed = 123456789;

  const words = ['FAVOR', 'RIVER', 'SKILL'];

  expect(getARandomWordGivenASeed(seed, words)).not.toBe(getARandomWordGivenASeed(seed, words));
});

test('verify that getARandomWord calls getResponse, parse, and getARandomWordGivenASeed', async () => {
  const getResponseSpy = jest.spyOn(WordPicker, 'getResponse');

  const parseSpy = jest.spyOn(WordPicker, 'parse');

  const getARandomWordGivenASeedSpy = jest.spyOn(WordPicker, 'getARandomWordGivenASeed');

  const seedValue = Date.now();
  
  const seedSpy = jest.spyOn(Date, 'now').mockReturnValue(seedValue);

  expect( await WordPicker.getResponse()).toBe('[FAVOR, RIVER, SKILL]');

  expect(await getARandomWord()).toBe('FAVOR');

  expect(getResponseSpy).toBeCalled();

  expect(parseSpy).toBeCalledWith('[FAVOR, RIVER, SKILL]');

  expect(getARandomWordGivenASeedSpy).toBeCalledWith(seedValue, ['FAVOR', 'RIVER', 'SKILL']);
});

test('verify that getARandomWord calls getARandomWordGivenASeed with a seed', async () => {
  const getARandomWordGivenASeedSpy = jest.spyOn(WordPicker, 'getARandomWordGivenASeed').mockReset().mockImplementationOnce(getARandomWordGivenASeed);

  await getARandomWord();

  expect(getARandomWordGivenASeedSpy).toBeCalledWith(WordPicker.seed, ['FAVOR', 'RIVER', 'SKILL']);

  expect(WordPicker.seed).not.toBeNull();
});

test('verify that getARandomWord calls getARandomWordGivenASeed with a different seed when called a second time', async () => {
  const getARandomWordGivenASeedSpy = jest.spyOn(WordPicker, 'getARandomWordGivenASeed').mockReset().mockImplementation(getARandomWordGivenASeed);

  await getARandomWord();

  const firstCallsSeed = WordPicker.seed;

  expect(getARandomWordGivenASeedSpy).toBeCalledWith(firstCallsSeed, ['FAVOR', 'RIVER', 'SKILL']);

  await new Promise(r => setTimeout(r, 5));

  await getARandomWord();

  const secondCallsSeed = WordPicker.seed;

  expect(getARandomWordGivenASeedSpy).toBeCalledWith(secondCallsSeed, ['FAVOR', 'RIVER', 'SKILL']);

  expect(firstCallsSeed).not.toBe(secondCallsSeed);
});

test('check the random word is of length 5', async () => {
  const getResponseSpy = jest.spyOn(WordPicker, 'getResponse').mockReset().mockImplementationOnce(async () => '[FAVORS, RIVERS, SKILLED]');
  
  const parseSpy = jest.spyOn(WordPicker, 'parse').mockReset().mockImplementationOnce(() => ['FAVORS', 'RIVERS', 'SKILLED']);

  const getARandomWordGivenASeedSpy = jest.spyOn(WordPicker, 'getARandomWordGivenASeed').mockReset().mockImplementation(getARandomWordGivenASeed);

  await expect(getARandomWord()).rejects.toThrow('Word length is longer than 5 characters');
});

test('check the random word is in uppercase', async () => {
  const getResponseSpy = jest.spyOn(WordPicker, 'getResponse').mockReset().mockImplementationOnce(async () => '[print]');
  
  const parseSpy = jest.spyOn(WordPicker, 'parse').mockReset().mockImplementationOnce(() => ['print']);

  const getARandomWordGivenASeedSpy = jest.spyOn(WordPicker, 'getARandomWordGivenASeed').mockReset().mockImplementation(getARandomWordGivenASeed);

  await expect(getARandomWord()).resolves.toBe('PRINT');
});