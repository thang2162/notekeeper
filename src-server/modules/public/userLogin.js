exports.userLogin = (req, res) => {
  console.log('\n\nuserlogin\n\n');

  const UserModel = req.app.locals.UserModel;

  const bcrypt = req.app.locals.bcrypt;
  const jwt = req.app.locals.jwt;
  const crypto = req.app.locals.crypto;

  const jwtKey = req.app.locals.jwtKey;
  const authKey = req.app.locals.authKey;

                  var data = req.body;

          console.log(JSON.stringify(data));



  var resData = {};

  //console.log(buff);

  UserModel.findOne({ email: data.email }, function (err, doc) {

    //console.log(JSON.stringify(doc));

  if(doc != null){

    bcrypt.compare(data.password, doc.password, function(bcryptErr, bcryptRes) {
        // res == true

        if(bcryptRes === true)
        {

          var token = jwt.sign({ id: doc._id.toString(), email: doc.email  }, jwtKey, {expiresIn: 86400, issuer: "NoteKeeper"});

          const iv = Buffer.from(crypto.randomBytes(16));

          var cipher = crypto.createCipheriv('aes-256-ctr', authKey, iv);

          var encrypted_token = cipher.update(token, 'utf8', 'hex');
          encrypted_token += cipher.final('hex');

          console.log("PW Check Success: " + doc)
          resData.status = 'success';
          resData.msg = 'You\'re LoggedIn!';
          resData.jwt = `${iv.toString('hex')}:${encrypted_token.toString()}`;

          res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin" : "*"
        });

          res.status(200).send(JSON.stringify(resData));

        }
        else {

          console.log("PW Check Failed: " + doc)
          resData.status = 'failed';
          resData.msg = 'Wrong Email or Password!';

          res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin" : "*"
        });

          res.status(200).send(JSON.stringify(resData));

        }

    });


  }
    else {
    console.log(err + " " + doc)
    resData.status = 'failed';
    resData.msg = 'Wrong Username or Password!';

    res.set({
  "Content-Type": "application/javascript",
  "Access-Control-Allow-Origin" : "*"
  });

    res.status(200).send(JSON.stringify(resData));
  }

  });
};
