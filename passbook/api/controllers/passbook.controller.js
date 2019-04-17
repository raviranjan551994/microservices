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
  Passbook = mongoose.model("Passbook"),
  fs = require("fs"),
  uniqid = require("uniqid");

exports.create_new_passbook = function(req, res) {
  var fields = [
    "username",
    "name",
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
    Passbook.findOne(
      {
        username: req.body.username
      },
      function(err, passbook) {
        if (err) {
          res.json({
            error: err.message,
            type: err.name
          });
        } else {
          if (passbook) {
            res.json({
              error: "User name already exists",
              success: false
            });
          } else {
            Passbook.findOne(
              {
                useremail: req.body.useremail
              },
              function(err, passbook2) {
                if (err) {
                  res.json({
                    error: err.message,
                    type: err.name
                  });
                } else {
                  if (passbook2) {
                    res.json({
                      error: "User email already exists",
                      success: false
                    });
                  } else {
                    req.body.uniqueid = uniqid();
                    var newPassbook = new Passbook(req.body);
                    newPassbook.save(function(err, newPassbook) {
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

