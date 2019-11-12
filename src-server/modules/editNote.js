exports.editNote = (req, res, NoteModel, jwt, jwtKey, authKey) => {
  console.log('\n\nedit note\n\n');

                  var data = req.body;

          console.log(JSON.stringify(data));

  var resData = {};

  jwt.verify(req.headers.authorization, jwtKey, function(err, decoded) {
  console.log(JSON.stringify(decoded)) // bar

  if (!err && decoded.authKey ===  authKey) {

  	NoteModel.updateOne({ _id: data.note_id, email: decoded.email}, { $set: { title: data.title, note: data.note, CreatedOn: new Date() } },
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
