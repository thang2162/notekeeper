exports.reqPwReset = (req, res) => {
    console.log('\n\nRequest Password Reset\n\n');

    const UserModel = req.app.locals.UserModel;

    const nodemailer = req.app.locals.nodemailer;

    const emailHost = req.app.locals.emailHost;
    const emailPort = req.app.locals.emailPort;
    const emailSecure = req.app.locals.emailSecure;
    const emailUsername = req.app.locals.emailUsername;
    const emailPassword = req.app.locals.emailPassword;
    const emailFromAddr = req.app.locals.emailFromAddr;

    var data = req.body;

    console.log(JSON.stringify(data));

    var resData = {};

    let resetToken = req.app.locals.keyGen.gen_key(32, {
        //exclude: '?=&',
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: false,
        strict: true
    });

    console.log(resetToken);

    UserModel.findOneAndUpdate({
            email: data.email
        }, {
            $set: {
                resetKey: resetToken
            }
        },
        function(err, doc) {

          console.log(JSON.stringify(doc) + "\n\n" + err)

            if (doc) {

                console.log('\nSending Email...\n');

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: emailHost,
                    port: emailPort,
                    secure: emailSecure, // true for 465, false for other ports
                    auth: {
                        user: emailUsername, // generated ethereal user
                        pass: emailPassword // generated ethereal password
                    }
                });

                console.log(transporter);

                // setup email data with unicode symbols
                let mailOptions = {
                    from: emailFromAddr, // sender address
                    to: data.email, // list of receivers
                    subject: 'Reset Your Password!', // Subject line
                    text: 'Please use the following link to reset your password: ' +
                    '\n\nhttps://notekeeper.bithatchery.com/#/resetpassword?key=' + resetToken
                    + '&email=' + data.email
                };

                console.log('\n3\n');

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('\nEmail Error\n');
                        return console.log(error);
                    } else {

                        resData.status = 'success';
                        resData.msg = 'Password Reset Request Successful! Please check your email.';

                        res.set({
                            "Content-Type": "application/javascript",
                            "Access-Control-Allow-Origin": "*"
                        });

                        res.status(200).send(JSON.stringify(resData));


                        console.log('Message sent: %s', info.messageId);
                    }
                    // Preview only available when sending through an Ethereal account
                    //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });



            } else {
                console.log(err + " " + doc)
                resData.status = 'failed';
                resData.msg = 'Account Not Found!';

                res.set({
                    "Content-Type": "application/javascript",
                    "Access-Control-Allow-Origin": "*"
                });

                res.status(200).send(JSON.stringify(resData));
            }


        });

};
