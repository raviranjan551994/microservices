const BearerModule = require("./servicemodules/bearer"),
  bearerfunc = BearerModule.bearerfunc,
  CLIENT_SECRET = BearerModule.ClientSecretKey;

// ============================

function sendDbError(response, error) {
  response.json({
    error: error.message,
    type: error.name,
    success: false
  });
}

// To send missing error of an absent field
function sendMissError(response, myString) {
  response.json({
    error: myString,
    success: false
  });
}

const mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  User = mongoose.model("Users"),
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_user = function(req, res) {
  var fields = [
    "username",
    "password",
    "fullname",
    "userrole",
    "useremail",
    "userphone",
    "city",
    "pincode",
  ];
  var missCount = 0;

  for (var i in fields) {
    if (!req.body[fields[i]]) {
      res.json({
        error: "No " + fields[i] + " found",
        success: false
      });
      missCount++;
      break;
    }
  }
  if (missCount == 0) {
    User.findOne(
      {
        username: req.body.username
      },
      function(err, user) {
        if (err) {
          res.json({
            error: err.message,
            type: err.name
          });
        } else {
          if (user) {
            res.json({
              error: "User name already exists",
              success: false
            });
          } else {
            User.findOne(
              {
                useremail: req.body.useremail
              },
              function(err, user2) {
                if (err) {
                  res.json({
                    error: err.message,
                    type: err.name
                  });
                } else {
                  if (user2) {
                    res.json({
                      error: "User email already exists",
                      success: false
                    });
                  } else {
                    req.body.uniqueid = uniqid();
                    var newUser = new User(req.body);
                    newUser.save(function(err, newuser) {
                      if (err) {
                        sendDbError(res, err);
                      } else {
                        res.json({
                          error: false,
                          success: true
                        });
                      }
                    });
                  }
                }
              }
            );
          }
        }
      }
    );
  }
};

exports.login_user = function(req, res) {
  var inputusername = req.body.username;
  var inputpassword = req.body.password;

  if (inputusername == null) {
    res.json({
      error: "Error! Username has not been entered"
    });
  } else if (inputpassword == null) {
    res.json({
      error: "Error! Password has not been entered"
    });
  } else {
    User.findOne({ username: inputusername }, function(err, user) {
      if (err) res.send(err);

      if (user) {
        // test a matching password:
        user.comparePassword(inputpassword, function(err, isMatch) {
          if (err) res.send(err);

          if (!isMatch) {
            res.json({
              error: true,
              access: "Access denied - username and password are incorrect",
              match: isMatch,
              inputusername: inputusername
            });
          }

          if (isMatch) {
            var myToken = jwt.sign(
              { username: inputusername, userrole: user.userrole },
              CLIENT_SECRET
            );

            res.json({
              error: false,
              access: "Access granted - username and password are correct",
              match: isMatch,
              inputusername: inputusername,
              accesstoken: myToken,
              userrole: user.userrole,
              userfullname: user.fullname
            });
          }
        });
      }

      if (!user) {
        res.json({
          error: true,
          errormsg: "ERROR: User does NOT exist!"
        });
      }
    });
  }
};

