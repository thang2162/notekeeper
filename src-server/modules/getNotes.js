exports.getNotes = (req, res, NoteModel, jwt, jwtKey, authKey) => {
  console.log('\n\ndispNotePage\n\n');

  var resData = {};

  var notesArr = [];

  jwt.verify(req.headers.authorization, jwtKey, function(err, decoded) {
  console.log(JSON.stringify(decoded)) // bar

  if (!err && decoded.authKey ===  authKey) {

    var notesCursor = NoteModel.find({email: decoded.email}).sort({CreatedOn: -1}).batchSize(10000).lean().cursor();

     notesCursor.addCursorFlag('noCursorTimeout', true);

      notesCursor.eachAsync(doc => {
      console.log("\nNote Doc ID:" + doc._id);

  return new Promise(function(resolve, reject) {

    notesArr.push({_id: doc._id.toString(), title: doc.title, note: doc.note, CreatedOn: doc.CreatedOn});
    resolve();

      	});
    }).
      then(() => {

          res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin" : "*"
          });

          res.status(200).send(JSON.stringify(notesArr));


    }); //notesCursor
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
