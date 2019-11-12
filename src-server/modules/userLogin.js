exports.userLogin = (req, res, UserModel, bcrypt, jwt, jwtKey, authKey) => {
  console.log('\n\nuserlogin\n\n');

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

          var token = jwt.sign({ authKey: authKey, email: doc.email  }, jwtKey, {expiresIn: 86400, issuer: "NoteKeeper"});

          console.log("PW Check Success: " + doc)
          resData.status = 'success';
          resData.msg = 'You\'re LoggedIn!';
          resData.jwt = token;

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
