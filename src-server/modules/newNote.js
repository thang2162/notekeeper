exports.newNote = (req, res, NoteModel, jwt, jwtKey, authKey) => {
  console.log('\n\nnew note\n\n');

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};

  jwt.verify(req.headers.authorization, jwtKey, function(err, decoded) {
  console.log(JSON.stringify(decoded)) // bar

  if (!err && decoded.authKey ===  authKey) {

    var nNote = new NoteModel();

    nNote.CreatedOn = new Date();
    nNote.title = data.title;
    nNote.note = data.note;
    nNote.email = decoded.email;

    res.set({
    "Content-Type": "application/javascript",
    "Access-Control-Allow-Origin" : "*"
    });

    resData.status = 'success';
    resData.objID = nNote._id.toString();
    resData.msg = 'New note created!';

    nNote.save();

    res.status(200).send(JSON.stringify(resData));

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
