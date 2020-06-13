exports.resetPw = (req, res) => {
    console.log('\n\nReset Password\n\n');

    const UserModel = req.app.locals.UserModel;

    const bcrypt = req.app.locals.bcrypt;

    const saltRounds = req.app.locals.saltRounds;

    var data = req.body;

    console.log(JSON.stringify(data));

    var resData = {};

    //console.log(buff);
    //  UserModel.createIndexes( { "$**": "text" } )
    UserModel.findOne({
        email: data.email
    }, function(err, doc) {

        if (doc != null && doc.resetKey === data.key
          && data.email === doc.email
          && doc.resetKey !== null) {

            bcrypt.hash(data.password, saltRounds, function(err, hash) {
                // Store hash in your password DB.

                UserModel.updateOne({
                        email: data.email
                    }, {
                        $set: {
                            password: hash,
                            resetKey: null
                        }
                    },
                    function(err, doc2) {

                        if (!err) {

                            res.set({
                                "Content-Type": "application/javascript",
                                "Access-Control-Allow-Origin": "*"
                            });

                            console.log('Password Changed!');


                            resData.status = 'success';
                            resData.msg = 'Password successfully changed!';

                            res.status(200).send(JSON.stringify(resData));

                        } else {
                            console.log(err + " " + doc2)
                            resData.status = 'failed';
                            resData.msg = 'There was a problem resetting your password. Please try again later.';

                            res.set({
                                "Content-Type": "application/javascript",
                                "Access-Control-Allow-Origin": "*"
                            });

                            res.status(200).send(JSON.stringify(resData));
                        }


                    });

            });

        } else {

            resData.status = 'failed';
            resData.msg = 'Invalid Reset Key or Email';

            res.set({
                "Content-Type": "application/javascript",
                "Access-Control-Allow-Origin": "*"
            });

            res.status(200).send(JSON.stringify(resData));

        }



    });


};
