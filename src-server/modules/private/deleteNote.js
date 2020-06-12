exports.deleteNote = (req, res) => {
  console.log('\n\ndeleteNote\n\n');
  console.log(res.locals.id + ", " + res.locals.email);

  const NoteModel = req.app.locals.NoteModel;

  var resData = {};

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

};
