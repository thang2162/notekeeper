exports.deleteUser = (req, res) => {
  console.log('\n\ndeleteUser\n\n');
  console.log(res.locals.id + ", " + res.locals.email);

  const NoteModel = req.app.locals.NoteModel;
  const UserModel = req.app.locals.UserModel;

  var resData = {};

  //  UserModel.createIndexes( { "$**": "text" } )

  NoteModel.deleteMany({ email: res.locals.email }, function(err) {

  res.set({
  "Content-Type": "application/javascript",
  "Access-Control-Allow-Origin" : "*"
  });

  if(!err)
  {

    UserModel.deleteOne({ email: res.locals.email }, function (err2) {

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

};
