const {letters} = require('../lib/castingValues.js');
const {parser} = require('../lib/stringToCasting.js');

// Makes sure all letters evaluate properly
for(key in letters){
  try{
    const tmp = parser(letters[key]);
    console.log({key: `${key}`,  eval: eval(tmp)});
  }catch(err){
    const tmp = parser(letters[key]);
    console.log({ msg: `error for ${key}:`,err: err, obfuscation: tmp });
  }
}
