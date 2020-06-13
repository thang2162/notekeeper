//Notekeeper Public Controller!

const exp = require('express');
const rtr = exp.Router();

const newUser_module = require('./newUser');
const userLogin_module = require('./userLogin');
const reqPwReset_module = require('./reqPwReset');
const resetPw_module = require('./resetPw');

//Create New User
rtr.post('/newuser', (req, res) => { newUser_module.newUser(req, res) });

//User login
rtr.post('/userlogin', (req, res) => { userLogin_module.userLogin(req, res) });

//Request Password Reset
rtr.post('/reqPwReset', (req, res) => { reqPwReset_module.reqPwReset(req, res) });

//Reset Password
rtr.post('/resetPw', (req, res) => { resetPw_module.resetPw(req, res) });


module.exports = rtr;
