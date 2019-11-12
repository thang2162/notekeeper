//ctrTest Test Controller!

const exp = require('express');
const rtr = exp.Router();

rtr.get('/', (req, res) => res.send('Welcome to ctrTest!'));

rtr.get('/serverDateTime', (req, res) => {
  const d = new Date();
  res.send(d.toString());
});

module.exports = rtr;
