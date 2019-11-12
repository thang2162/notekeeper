exports.deleteNote = (req, res, NoteModel, jwt, jwtKey, authKey) => {
  console.log('\n\ndeleteNote\n\n');

  var resData = {};

  jwt.verify(req.headers.authorization, jwtKey, function(err, decoded) {
  console.log(JSON.stringify(decoded)) // bar

  if (!err && decoded.authKey ===  authKey) {

  //  UserModel.createIndexes( { "$**": "text" } )

  NoteModel.findByIdAndDelete(req.params.note_id, function(err, doc) {

  res.set({
  "Content-Type": "application/javascript",
  "Access-Control-Allow-Origin" : "*"
  });

  if(!err)
  {

  resData.note = doc;

  resData.status = 'success';
  resData.msg = 'Note successfully deleted!';

  res.status(200).send(JSON.stringify(resData));

  }
  else {
    resData.status = 'failed';
    resData.msg = 'Note does not exist!';

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
