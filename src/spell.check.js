import fetch from 'node-fetch';

export const SpellChecker = {
  async getResponse(word) {
    const url = `http://agilec.cs.uh.edu/spell?check=${word}`;

    const response = await fetch(url);
    
    return await response.text();
  },

  parse(response) {
    return JSON.parse(response);
  },

  isSpellingCorrect: async (word) => { 
    const response = await SpellChecker.getResponse(word); 
    
    return SpellChecker.parse(response);
  }
};