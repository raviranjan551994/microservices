// generating client secret -> Convert 'indiabuyspanel' to A1Z26 Cipher
const CLIENT_SECRET = "914491221251916114512";

// Import Packages:
const express = require("express"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT || 4040,
  ip = "0.0.0.0",
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  expressjwt = require("express-jwt"),
  jwt = require("jsonwebtoken");

// Import Database Models:
require("./api/models/user.model");

// Connect to MongoDB
var dbURI = "mongodb://presto:presto1@ds251622.mlab.com:51622/presto";
mongoose.connect(dbURI);
mongoose.connection.on("error", function(err) {
  console.log("Mongo connection error: " + err);
});
mongoose.connection.on("connected", function() {
  console.log("Mongo connected");
});

// Body Parser Enable
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Support Enable:
app.use(cors());

// Unprotected Paths:
const unprotected = [
  "/",
  "/users/createnew",
  "/users/login"
];

// Public Files
app.use("/", express.static(__dirname + "/public/"));

// JSON Web Tokens:
app.use(
  expressjwt({
    secret: CLIENT_SECRET
    // credentialsRequired: false
  }).unless({ path: unprotected })
);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({
      message: err.message,
      flag: "Unauthorized"
    });
    console.log("Original Requested URL: " + req.originalUrl);
    console.log(err.message);
    return;
  }
  next();
});

// Import Routes:
const userRouter = require("./api/routes/user.routes");

// Register Routes:
userRouter(app);

app.listen(port);

console.log("Server listening on port " + port);
