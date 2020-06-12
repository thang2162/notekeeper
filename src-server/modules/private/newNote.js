exports.newNote = (req, res) => {
  console.log('\n\nnew note\n\n');
  console.log(res.locals.id + ", " + res.locals.email);

  const NoteModel = req.app.locals.NoteModel;

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};

    var nNote = new NoteModel();

    nNote.CreatedOn = new Date();
    nNote.title = data.title;
    nNote.note = data.note;
    nNote.email = res.locals.email;

    res.set({
    "Content-Type": "application/javascript",
    "Access-Control-Allow-Origin" : "*"
    });

    resData.status = 'success';
    resData.objID = nNote._id.toString();
    resData.msg = 'New note created!';

    nNote.save();

    res.status(200).send(JSON.stringify(resData));

};
