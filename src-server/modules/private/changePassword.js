exports.changePassword = (req, res) => {

  console.log('\n\changePassword\n\n');

  console.log(res.locals.id + ", " + res.locals.email);

  const UserModel = req.app.locals.UserModel;

  const bcrypt = req.app.locals.bcrypt;

  const saltRounds = req.app.locals.saltRounds;

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};


  //  UserModel.createIndexes( { "$**": "text" } )
  UserModel.findOne({ email: res.locals.email }, function (err, doc) {

  if(doc != null){


    bcrypt.compare(data.oldPassword, doc.password, function(bcryptErr, bcryptRes) {
        // res == true

        if(bcryptRes === true)
        {

          bcrypt.hash(data.newPassword, saltRounds, function(err, hash) {

          if(!err){
          UserModel.updateOne({ email: res.locals.email}, { $set: { password: hash} },
            //	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
            function (err) {

              if(!err){


                res.set({
                "Content-Type": "application/javascript",
                "Access-Control-Allow-Origin" : "*"
                });

                console.log('Password Changed!');


                resData.status = 'success';
                resData.msg = 'Password successfully changed!';

                res.status(200).send(JSON.stringify(resData));
                  }
                  else {
                    console.log(err);
                    //reject();
                    resData.status = 'error';
                    resData.msg = 'Please try again later';

                    res.set({
                  "Content-Type": "application/javascript",
                  "Access-Control-Allow-Origin" : "*"
                  });

                    res.status(200).send(JSON.stringify(resData));
                  }
            }
          ); }else {

            console.log(err);
            //reject();
            resData.status = 'error';
            resData.msg = 'Please try again later';

            res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin" : "*"
          });

            res.status(200).send(JSON.stringify(resData));
          }

        });
        }
        else {

          console.log("PW Check Failed: " + doc)
          resData.status = 'failed';
          resData.msg = 'Wrong Username or Password!';

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
    resData.msg = 'User Doesn\'t Exist!';

    res.set({
  "Content-Type": "application/javascript",
  "Access-Control-Allow-Origin" : "*"
  });

    res.status(200).send(JSON.stringify(resData));
  }

  });

};
