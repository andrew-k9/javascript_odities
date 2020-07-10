const values = require('./castingValues.js');

const isSmallestCast = char => char === '(' || char === ')' || char === '[' || char === ']' || char === '+' || char === '!';
const token = (type, value) => {
  return {
    type,
    value
  }
};

/**
 * Takes a string argument for a character and tokenizes it for interpretation
 *
 * @param {string} string Input string defined in casting values
 * @return {Array<Object>} Completed tokenized array ready for parsing
 *         the object has a `type` (complex or primitive) and a `value` string char
 */
const tokenize = (string) => {
  let tokens = [];
  let word = '';
  string.split('').forEach( char => {
    if(isSmallestCast(char)){
      if(word.length !== 0){
        console.log('token:', token('complex', word))
        tokens.push(token('complex', word));
        word = '';
      }
      tokens.push(token('primitive', char));
    } else {
      word += char;
    }
  });
  return tokens
}

/**
 * Takes a string argument for a character, tokenizes it, then parses the tokens to
 * an executable js value
 *
 * @param {string} string Input string defined in casting values
 * @return {string} fully formatted string with only [],(),+, and ! characters
 */
const parser = (string) => {
  console.log('parser', string);
  return tokenize(string);
}

console.log(parser('([]["entries"]()+"")[3]'));