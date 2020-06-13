const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {resolve} = require('path');
require('dotenv').config({ path: resolve(__dirname,'../.env') });

exports.auth = (req, res, next) => {

  console.log('Auth')

  console.log(req.headers.authorization);

  if (req.headers.authorization) {

      const tokenParts = req.headers.authorization.split(':');

      if (tokenParts[1]) {

          //extract the IV from the first half of the value
          const IV = Buffer.from(tokenParts.shift(), 'hex');

          //extract the encrypted text without the IV
          const encryptedText = Buffer.from(tokenParts.join(':'), 'hex');

          var decipher = crypto.createDecipheriv('aes-256-ctr', process.env.AUTH_KEY, IV);
          var decrypted_jwt = decipher.update(encryptedText, 'hex', 'utf8');
          decrypted_jwt += decipher.final('utf8');

          jwt.verify(decrypted_jwt.toString(), process.env.JWT_KEY, function(err, decoded) {
              console.log("Verifying JWT " + JSON.stringify(decoded)); // bar

              if (!err && decoded) {
                  res.locals.id = decoded.id;
                  res.locals.email = decoded.email;
                  next();
              } else {
                  res.set({
                      "Content-Type": "text/plain",
                      "Access-Control-Allow-Origin": "*"
                  });

                  res.status(401).send("Invalid Auth Token!");
              }

          });
      } else {
          res.set({
              "Content-Type": "text/plain",
              "Access-Control-Allow-Origin": "*"
          });

          res.status(401).send("Invalid Auth Token!");
      }
  } else {
      res.set({
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
      });

      res.status(401).send("Invalid Auth Token!");
  }

};
