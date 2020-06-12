//NoteKeeper - nodejs server
const http = require('http'),
	fs = require('fs'),
	path = require('path'),
	constants = require('constants'),
    https = require('https');

require('dotenv').config();

const rateLimit = require("express-rate-limit");

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
const emailSecure = Boolean(process.env.EMAIL_IS_SECURE);
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFromAddr = process.env.EMAIL_FROM_ADDRESS;

const crypto = require('crypto');

//Server Settings
const port = Number(process.env.SERVER_PORT);

const spdy = require('spdy');
const helmet = require('helmet');

const caCrt = fs.readFileSync(process.env.SSL_CA_FILE).toString();

const sslOptions = {
  secureProtocol: 'SSLv23_method', //Poodlebleed Fix - Disables SSL 3.0
  secureOptions: constants.SSL_OP_NO_SSLv3,	//Poodlebleed Fix - Disables SSL 3.0
  key: fs.readFileSync(process.env.SSL_KEY_FILE).toString(),
  cert: fs.readFileSync(process.env.SSL_CERT_FILE).toString(),
  ca: [caCrt],
  ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', //:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM
  honorCipherOrder: true,
  requestCert: false
};

const express = require('express')

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const multer = require('multer');
const upload = multer();
const app = express();

const bodyParser = require('body-parser');

'use strict';
const nodemailer = require('nodemailer');


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

//  apply to all requests
app.use(limiter);

app.get('/', (req, res) => res.send('Hello World!'));

const cors = require("cors");

app.use(helmet());

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

// expost consts to app
app.locals.saltRounds = saltRounds;
app.locals.jwtKey = jwtKey;
app.locals.authKey = authKey;
app.locals.emailHost = emailHost;
app.locals.emailPort = emailPort;
app.locals.emailSecure = emailSecure;
app.locals.emailUsername = emailUsername;
app.locals.emailPassword = emailPassword;
app.locals.emailFromAddr = emailFromAddr;

//ctrTest Controller
app.use('/ctrTest', ctrTest);

app.use('/pub', publicCtr);

var authMiddleWare = (req, res, next) => {

		var decipher = crypto.createDecipher('aes-128-cbc', authKey);
		var decrypted_jwt = decipher.update(req.headers.authorization, 'hex', 'utf8');
		decrypted_jwt += decipher.final('utf8');

	  jwt.verify(decrypted_jwt, jwtKey, function(err, decoded) {
			console.log("Verifying JWT " + JSON.stringify(decoded)); // bar

			if (!err && decoded) {
				res.locals.id = decoded.id;
				res.locals.email = decoded.email;
				next();
			} else {
				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(401).send("Invalid Auth Token!");
			}

		});
};

app.use(authMiddleWare);

app.use('/pvt', privateCtr);

//https.createServer(sslOptions, app).listen(port, () => console.log(`NoteKeeper server listening on port ${port}!`));

spdy.createServer(sslOptions, app).listen(port, () => console.log(`NoteKeeper server listening on port ${port}!`));

//End of REST Server
