exports.getNotes = (req, res) => {
  console.log('\n\ndispNotePage\n\n');
  console.log(res.locals.id + ", " + res.locals.email);

  const NoteModel = req.app.locals.NoteModel;

  var resData = {};

  var notesArr = [];

    var notesCursor = NoteModel.find({email: res.locals.email}).sort({CreatedOn: -1}).batchSize(10000).lean().cursor();

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
};
