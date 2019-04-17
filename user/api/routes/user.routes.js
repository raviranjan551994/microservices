"use strict";
module.exports = function(app) {
  var userList = require("../controllers/user.controller");

  // userList Routes
  app.route("/users/createnew").post(userList.create_new_user);
  app.route("/users/login").post(userList.login_user);
};
