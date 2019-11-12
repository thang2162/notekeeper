exports.deleteUser = (req, res, UserModel, NoteModel, jwt, jwtKey, authKey) => {
  console.log('\n\ndeleteUser\n\n');

  var resData = {};

  jwt.verify(req.headers.authorization, jwtKey, function(err, decoded) {
  console.log(JSON.stringify(decoded)) // bar

  if (!err && decoded.authKey ===  authKey) {

  //  UserModel.createIndexes( { "$**": "text" } )

  NoteModel.deleteMany({ email: decoded.email }, function(err) {

  res.set({
  "Content-Type": "application/javascript",
  "Access-Control-Allow-Origin" : "*"
  });

  if(!err)
  {

    UserModel.deleteOne({ email: decoded.email }, function (err2) {

      if(!err2)
      {

      console.log('aSync 2 done!');


      resData.status = 'success';
      resData.msg = 'Account successfully deleted!';

      res.status(200).send(JSON.stringify(resData));

      }
      else {
        resData.status = 'error';
        resData.msg = 'Error, Please try again later!';

        res.status(200).send(JSON.stringify(resData));
        }

    });
  }
  else {
    resData.status = 'error';
    resData.msg = 'Error, Please try again later!';

    res.status(200).send(JSON.stringify(resData));
    }
  }

  );

  }
  else {
    res.set({
    "Content-Type": "application/javascript",
    "Access-Control-Allow-Origin" : "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }

  });
};
