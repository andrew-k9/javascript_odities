const values = require('./castingValues.js');
const { primitives } = require('./castingValues.js');

const isSmallestCast = char => char === '(' || char === ')' || char === '[' || char === ']' || char === '+' || char === '!' || char === ' ';
const token = (type, value) => {
  return {
    type,
    value
  };
};

const times = (value, iterations) => {
  let ans = [];
  for(let i = 0; i < iterations; ++i){
    ans.push(value);
  }
  return ans.join(' + ');
}

const numberConverter = (string) => {
  const int = parseInt(string);
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
    const tmp = [times(primitives['10'], vals.ten), times(primitives['1'], vals.one)].
      filter(val => val !== '').join(' + ');
    return `(${tmp})`;
  }
}

const stringConverter = (string) => {
  const str = string.slice(1,string.length - 1);
  const letters = values.letters;
  return str.
    split('').
    map( (char) => parser(letters[char]) ).
    reduce( (acc, curr) => acc + '+' + curr) + '+[]';
}

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
        tokens.push(token('complex', word));
        word = '';
      }
      tokens.push(token('primitive', char));
    } else {
      word += char;
    }
  });
  if(word.length > 0){
    tokens.push(token('complex', word))
  }
  return tokens;
}

/**
 * Takes a string argument for a character, tokenizes it, then parses the tokens to
 * an executable js value
 *
 * @param {string} string Input string defined in casting values
 * @return {string} fully formatted string with only [],(),+, and ! characters
 */
const parser = (string) => {
  const tokens = tokenize(string);
  const primitives = values.primitives;
  let parsed = '';

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

//console.log(stringConverter('"to"'))
// const tmp = parser('26["toString"](36)')
// console.log('val', eval(tmp))
// console.log('tmp', tmp)
const letters = values.letters;
for(key in letters){
  try{
    const tmp = parser(letters[key]);
    console.log({key: `${key}:`,  eval: eval(tmp)});
  }catch(err){
    const tmp = parser(letters[key]);
    console.log({ msg: `error for ${key}:`,err: err, fuck: tmp });
  }
}