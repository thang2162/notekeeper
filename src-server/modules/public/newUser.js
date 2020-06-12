exports.newUser = (req, res) => {
  console.log('\n\nNewUser\n\n');

  console.log(req.body);

  const UserModel = req.app.locals.UserModel;

  const bcrypt = req.app.locals.bcrypt;
  const nodemailer = req.app.locals.nodemailer;

  const saltRounds = req.app.locals.saltRounds;

  const emailHost = req.app.locals.emailHost;
  const emailPort = req.app.locals.emailPort;
  const emailSecure = req.app.locals.emailSecure;
  const emailUsername = req.app.locals.emailUsername;
  const emailPassword = req.app.locals.emailPassword;
  const emailFromAddr = req.app.locals.emailFromAddr;

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};

  //console.log(buff);

  		   bcrypt.hash(data.password, saltRounds, function(err, hash) {
  		   // Store hash in your password DB.

  UserModel.findOneAndUpdate({ email: data.email },{ $setOnInsert: {
  	CreatedOn: new Date(),
    email: data.email,
    password: hash,
    resetKey: null}},
     { upsert: true }, function (err, doc) {

  		 if(!doc){

         console.log('\nSending Email...\n');

  		   // create reusable transporter object using the default SMTP transport
  		   let transporter = nodemailer.createTransport({
  		       host: emailHost,
  		       port: emailPort,
  		       secure: emailSecure, // true for 465, false for other ports
  		       auth: {
  		           user: emailUsername, // generated ethereal user
  		           pass: emailPassword // generated ethereal password
  		       }
  		   });

         console.log(transporter);

  		   // setup email data with unicode symbols
  		   let mailOptions = {
  		       from: emailFromAddr, // sender address
  		       to: data.email, // list of receivers
  		       subject: 'Welcome to NoteKeeper!', // Subject line
  		       text: 'Hi There, ' + '\n\nEmail: ' + data.email + '\nPassword: ' + data.password
  		   };

         console.log('\n3\n');

  		   // send mail with defined transport object
  		   transporter.sendMail(mailOptions, (error, info) => {
  		       if (error) {
                console.log('\nEmail Error\n');
  		           return console.log(error);
  		       }
  		       else {

  		         resData.status = 'success';
  		         resData.msg = 'Account successfully created! Please check your email.';

  		         res.set({
  		       "Content-Type": "application/javascript",
  		       "Access-Control-Allow-Origin" : "*"
  		     });

  		         res.status(200).send(JSON.stringify(resData));


  		         console.log('Message sent: %s', info.messageId);
  		       }
  		       // Preview only available when sending through an Ethereal account
  		     //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  		       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  		       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  		   });



  		 }
  		   else {
  		   console.log(err + " " + doc)
  		   resData.status = 'failed';
  		   resData.msg = 'Account Already Exists';

  		   res.set({
  		 "Content-Type": "application/javascript",
  		 "Access-Control-Allow-Origin" : "*"
  		 });

  		   res.status(200).send(JSON.stringify(resData));
  		 }


  	 });

  	 		 });

};
