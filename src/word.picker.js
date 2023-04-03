import fetch from 'node-fetch';
const seedrandom = require('seedrandom');

export const WordPicker = {
  async getResponse(){
    const url = 'http://agilec.cs.uh.edu/words';

    const response = await fetch(url);

    return await response.text();
  },

  parse(response){
    if( response.indexOf('[') !== 0 || response.indexOf(']') === -1){
      throw new Error('No list was passed!');
    }

    const words = response.match(/[a-zA-Z]+/g);

    return words? words: [];
  },

  getARandomWordGivenASeed(seed, words){
  
    if (WordPicker.seed !== seed){
      WordPicker.random = seedrandom(seed);
      
      WordPicker.seed = seed;
    }

    return words[Math.floor(WordPicker.random() * words.length)]; 
  },

  async getARandomWord(){
    const response = await WordPicker.getResponse();

    const words = WordPicker.parse(response);
    
    const randomWord = WordPicker.getARandomWordGivenASeed(Date.now(), words);

    if (randomWord.length !== 5){
      throw new Error('Word length is longer than 5 characters');
    }
    
    return randomWord.toUpperCase();
  }
};

