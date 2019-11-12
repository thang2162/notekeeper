//NoteKeeper - nodejs server

//Email Settings
const emailHost = "smtp.email.com";
const emailPort = 587;
const emailSecure = false;
const emailUsername = "email@email.com";
const emailPassword = "password";
const emailFromAddr = "email@email.com";

//Server Settings
const port = 5443

var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	constants = require('constants'),
    https = require('https');

var caCrt = fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.ca-bundle').toString();

var sslOptions = {
  secureProtocol: 'SSLv23_method', //Poodlebleed Fix - Disables SSL 3.0
  secureOptions: constants.SSL_OP_NO_SSLv3,	//Poodlebleed Fix - Disables SSL 3.0
  key: fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.key').toString(),
  cert: fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.crt').toString(),
  ca: [caCrt],
  ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', //:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM
  honorCipherOrder: true,
  requestCert: false
};

const express = require('express')

var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var multer = require('multer');
var upload = multer();
var app = express();

var bodyParser = require('body-parser');

'use strict';
const nodemailer = require('nodemailer');


var jwtKey = "somwkey";
var authKey = "anotherkey";

//Start of DB Schema
const mongoose = require('./models/model');

var UserModel = mongoose.model('User');
var NoteModel = mongoose.model('Note');

//End of DB Schema

//Start of REST Server

//Endpoint Modules
const newUser_module = require('./modules/newUser');
const userLogin_module = require('./modules/userLogin');
const getNotes_module = require('./modules/getNotes');
const newNote_module = require('./modules/newNote');
const deleteNote_module = require('./modules/deleteNote');
const changePassword_module = require('./modules/changePassword');
const deleteUser_module = require('./modules/deleteUser');
const editNote_module = require('./modules/editNote');

//Controller Module
const ctrTest = require('./controllers/ctrTest');

app.get('/', (req, res) => res.send('Hello World!'));

const cors = require("cors");

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// for parsing multipart/form-data
app.use(upload.array());

//Create New User
app.post('/newuser', (req, res) => { newUser_module.newUser(req, res, UserModel, nodemailer, bcrypt, saltRounds, emailHost, emailPort, emailSecure, emailUsername, emailPassword, emailFromAddr) });

//User login
app.post('/userlogin', (req, res) => { userLogin_module.userLogin(req, res, UserModel, bcrypt, jwt, jwtKey, authKey) });

//Load my notebook page
app.get('/getNotes', (req, res) => { getNotes_module.getNotes(req, res, NoteModel, jwt, jwtKey, authKey) });

//Create new note
app.post('/newNote', (req, res) => { newNote_module.newNote(req, res, NoteModel, jwt, jwtKey, authKey) });

//Delete Note
app.delete('/deleteNote/:note_id', (req, res) => { deleteNote_module.deleteNote(req, res, NoteModel, jwt, jwtKey, authKey) });

//Change Password
app.post('/changePassword', (req, res) => { changePassword_module.changePassword(req, res, UserModel, bcrypt, jwt, jwtKey, authKey, saltRounds) });

//Delete Account
app.delete('/deleteUser', (req, res) => { deleteUser_module.deleteUser(req, res, UserModel, NoteModel, jwt, jwtKey, authKey) });

//Edit Note
app.post('/editNote', (req, res) => { editNote_module.editNote(req, res, NoteModel, jwt, jwtKey, authKey) });

//ctrTest Controller
app.use('/ctrTest', ctrTest);

https.createServer(sslOptions, app).listen(port, () => console.log(`NoteKeeper server listening on port ${port}!`));
//End of REST Server
