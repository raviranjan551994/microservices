"use strict";
module.exports = function(app) {
  var passbookList = require("../controllers/passbook.controller");

  // passbook Routes
  app.route("/passbook/createnew").post(passbookList.create_new_passbook);
};
