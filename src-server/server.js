//NoteKeeper - nodejs server
'use strict';
const fs = require('fs'),
    https = require('https'),
    spdy = require('spdy'),
    path = require('path'),
    jwt = require('jsonwebtoken'),
    constants = require('constants'),
    rateLimit = require("express-rate-limit"),
    crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    express = require('express'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    multer = require('multer'),
    helmet = require('helmet');

require('dotenv').config({
    path: path.resolve(__dirname, './.env')
});

const caCrt = fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.ca-bundle').toString();

const sslOptions = {
    secureProtocol: 'SSLv23_method', //Poodlebleed Fix - Disables SSL 3.0
    secureOptions: constants.SSL_OP_NO_SSLv3, //Poodlebleed Fix - Disables SSL 3.0 */
    key: fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.key').toString(),
    cert: fs.readFileSync('/home/bitnami/notekeeper.bithatchery.com.crt').toString(),
    ca: [caCrt],
    ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', //:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM
    honorCipherOrder: true,
    requestCert: false
};

console.log(process.env.NODE_PORT && process.env.NODE_PORT !== '' ? process.env.NODE_PORT : process.env.SERVER_PORT);

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//Email Settings
const emailHost = process.env.EMAIL_HOST;
const emailPort = Number(process.env.EMAIL_PORT);
const emailSecure = process.env.EMAIL_IS_SECURE === 'true' ? true : false;
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFromAddr = process.env.EMAIL_FROM_ADDRESS;

//Server Settings
const port = Number(process.env.NODE_PORT && process.env.NODE_PORT !== '' ? process.env.NODE_PORT : process.env.SERVER_PORT);

const saltRounds = 10;

const upload = multer();
const app = express();

const jwtKey = process.env.JWT_KEY;
const authKey = process.env.AUTH_KEY;

//Start of DB Schema
const mongoose = require('./models/model');

//End of DB Schema

//Start of REST Server

//Controller Module
const ctrTest = require('./controllers/ctrTest');
const publicCtr = require('./modules/public'); //Public Endpoints
const privateCtr = require('./modules/private'); //Private Endpoints

const authMiddleWare = require('./modules/Auth');
const keyGen = require('./modules/KeyGen');

app.get('/', (req, res) => res.status(200).send('This is the NoteKeeper Server!'));

//  apply to all requests
app.use(limiter);

const cors = require("cors");

app.use(helmet());

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

// for parsing multipart/form-data
app.use(upload.array());

// expose db models to app
app.locals.UserModel = mongoose.model('User');
app.locals.NoteModel = mongoose.model('Note');

// expose libs to app
app.locals.nodemailer = nodemailer;
app.locals.bcrypt = bcrypt;
app.locals.crypto = crypto;
app.locals.jwt = jwt;
app.locals.keyGen = keyGen;

// expost consts to app
app.locals.saltRounds = saltRounds;
app.locals.jwtKey = jwtKey;
app.locals.authKey = authKey; //Must be a 32 Character String
app.locals.emailHost = emailHost;
app.locals.emailPort = emailPort;
app.locals.emailSecure = emailSecure;
app.locals.emailUsername = emailUsername;
app.locals.emailPassword = emailPassword;
app.locals.emailFromAddr = emailFromAddr;

//ctrTest Controller
app.use('/ctrTest', ctrTest);

app.use('/pub', publicCtr);

app.use('/pvt', authMiddleWare.auth, privateCtr);

// https.createServer(sslOptions, app).listen(port, () => console.log(`NoteKeeper server listening on port ${port}!`));

spdy.createServer(sslOptions, app).listen(port, () => console.log(`NoteKeeper server listening on port ${port}!`));

//End of REST Server
