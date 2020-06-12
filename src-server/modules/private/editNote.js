exports.editNote = (req, res) => {
  console.log('\n\nedit note\n\n');
  console.log(res.locals.id + ", " + res.locals.email);

  const NoteModel = req.app.locals.NoteModel;

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};

  	NoteModel.updateOne({ _id: data.note_id, email: res.locals.email}, { $set: { title: data.title, note: data.note, CreatedOn: new Date() } },
  		//	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
  		function (err) {

  			if(!err){


  				res.set({
  				"Content-Type": "application/javascript",
  				"Access-Control-Allow-Origin" : "*"
  				});

  				console.log('Note Edited!');


  				resData.status = 'success';
  				resData.msg = 'Note successfully edited!';

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
  	);

};
