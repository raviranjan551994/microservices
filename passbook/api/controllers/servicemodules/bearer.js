const jwt = require("jsonwebtoken");

// generating client secret -> Convert 'indiabuyspanel' to A1Z26 Cipher
const CLIENT_SECRET = "914491221251916114512";

exports.bearerfunc = function(request) {
  var bearerHeader = request.header("Authorization");
  if (bearerHeader) {
    var authsplit = bearerHeader.split(" ");
    var authorization = authsplit[1].toString();
    var finaltoken = "";

    jwt.verify(authorization, CLIENT_SECRET, function(err, token) {
      if (err) {
        console.log(err);
        finaltoken = "";
      } else {
        console.log(token);
        finaltoken = token;
      }
    });

    return finaltoken;
  }
};

exports.ClientSecretKey = CLIENT_SECRET;
