const { primitives, letters } = require('./castingValues.js');

// these are all the
const isSmallestCast = char =>
  char === '(' || char === ')' || char === '[' || char === ']'
               || char === '+' || char === '!' || char === ' ';

// makes the token object
const token = (type, value) => {
  return {
    type,
    value
  };
};

/**
 * Makes a string that is the value copied iteration amount of times
 *
 * @param  {string} value - usually a 10 or a 1 in obfuscated js
 * @return {string} a string that's equivalent to something like
 *                  5.times{ |x| aggregate += x }` in ruby
 */
const times = (value, iterations) => {
  let ans = [];
  for(let i = 0; i < iterations; ++i){
    ans.push(value);
  }
  return ans.join(' + ');
}

/**
 * Parses a number string into an obfuscated js number. The number will be a sum
 *  of ones and tens that is cast to a number with `+`
 *
 * @param  {string} integer number to obfuscate
 * @return {string} obfuscated number
 */
const numberConverter = (string) => {
  const int = parseInt(string);
  // guard for if this is called on something that isn't a string
  if(int === NaN){
    return string;
  } else {
    let mut = int;
    let vals = {one: 0, ten: 0};
    while(mut > 0){
      if(mut % 10 === 0){
        vals.ten += 1;
        mut -= 10;
      }else{
        vals.one += 1;
        mut -= 1;
      }
    }
    return `(${concatNumbers(vals.ten, vals.one)})`;
  }
}

/**
 * Helper for the `numberConverter`. Any number w/ out a ones place or that is 2 -> 9
 * is still valid because `filter` takes out any blank values. Otherwise just concat
 * with `join` will be something like `+ +!+[]` which is invalid js
 *
 * @param  {number} tens - number of times ten needs to be replicated
 * @return {string} ones - number of times one needs to be replicated
 */
const concatNumbers = (tens, ones) =>
  [times(primitives['10'], tens), times(primitives['1'], ones)]
    .filter(val => val !== '')
    .join(' + ');

/**
 * Converts a string formatted like `'"someVal"'` into obfuscated js
 *
 * @param  {string} string to obfuscate
 * @return {string} obfuscated string
 */
const stringConverter = (string) =>
  string.slice(1, string.length - 1)
    .split('')
    .map( (char) => {
        return parser(letters[char]) }
      )
    .reduce( (acc, curr) => acc + '+' + curr) + '+[]';

/**
 * Takes a string argument for a character and tokenizes it for interpretation
 *
 * @param  {string} string - Input string defined in casting values
 * @return {Array<Object>} Completed tokenized array ready for parsing
 *         the object has a `type` (complex or primitive) and a `value` string char
 */
const tokenize = (string) => {
  const tokens = [];
  let word = '';
  for(let i = 0; i < string.length; ++i){
    let char = string[i];
    if(isSmallestCast(char)){
      if(word.length !== 0){
        tokens.push(token('complex', word));
        word = '';
      }
      tokens.push(token('primitive', char));
    }else if(char === '"') {
      do{
        word += char
        ++i;
        char = string[i];
      } while(char !== '"');
      word += char;
      tokens.push(token('complex', word));
      word = '';
    } else {
      word += char;
    }
  }

  if(word.length > 0){
    tokens.push(token('complex', word))
  }
  return tokens;
}

/**
 * Takes a string argument for a value, tokenizes it, then parses the tokens to
 * an executable js value
 *
 * @param  {string} string Input string defined in casting values
 * @return {string} fully formatted obfuscated string with only [],(),+, and ! characters
 */
const parser = (string) => {
  const tokens = tokenize(string);

  let ans =  tokens.map( (token) => {
    let parsed = '';
    if(token.type === 'primitive'){
      parsed += token.value;
    }else{
      if(token.value === '""'){
        parsed += primitives.blank;
      } else if (Object.keys(primitives).includes(token.value)) {
        parsed += primitives[token.value];
      } else if(token.value === ' '){
        parsed += ' ';
      }else if(token.value === 'String' || token.value === 'Number' || token.value === 'Infinity'){
        parsed += token.value;
      }else if(token.value.search('"') !== - 1){
        parsed += stringConverter(token.value);
      }else {
        parsed += numberConverter(token.value);
      }
    }
    return parsed;
  });
  return ans.reduce( (acc, curr) => acc + curr);
}
module.exports = {
  parser
}