//Notekeeper Public Controller!

const exp = require('express');
const rtr = exp.Router();

const newUser_module = require('./newUser');
const userLogin_module = require('./userLogin');

//Create New User
rtr.post('/newuser', (req, res) => { newUser_module.newUser(req, res) });

//User login
rtr.post('/userlogin', (req, res) => { userLogin_module.userLogin(req, res) });


module.exports = rtr;
