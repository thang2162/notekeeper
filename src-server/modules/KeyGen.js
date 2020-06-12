var generator = require('generate-password');

exports.gen_key = (len, optObj = null) => {

  console.log('Generate Key');

  return generator.generate({len, ...optObj});

};
