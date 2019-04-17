"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
      required: false,
      default: ""
    },
    userrole: {
      type: String,
      enum: ["IB_USER", "IB_ADMIN", "IB_MODERATOR", "IB_AGENT"],
      default: "IB_USER"
    },
    userstatus: {
      type: String,
      enum: ["active", "rejected", "pending", "blocked"],
      default: "pending"
    },
    onboardstatus: {
      type: String,
      enum: ["watchvideo", "givetests", "onboarded"],
      default: "watchvideo"
    },
    payment: {
      type: Array
    },
    pincode: {
       type: String,
      required: true
    },
    videoUrl: {
       type: String,
      required: true
    },
    answer: {
       type: String,
      required: true
    },
    nameOnCard: {
       type: String,
      required: true
    },
    cardNumber: {
       type: String,
      required: true
    },
    cvv: {
       type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    useremail: {
      type: String,
      required: true
    },
    userphone: {
      type: String,
      required: true
    },
    uniqueid: {
      type: String,
      unique: true
    },
    teststaken: {
      type: Number,
      default: 0
    },
    assignedAgents: [
      {
        agentName: {
          type: String,
          required: true
        },
        addedOn: {
          type: Date,
          required: true
        }
      }
    ],
    assignedTo: [
      {
        userName: {
          type: String,
          required: true
        },
        addedOn: {
          type: Date,
          required: true
        }
      }
    ],
    testanswers: [
      {
        attempt: { type: Number, required: true },
        answers: [
          {
            quescode: { type: String, required: true },
            optionanswered: { type: String, required: true }
          }
        ],
        score: { type: Number, required: true },
        numQues: { type: Number, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  if (user.password.length >= 60) {
    return next();
  } else {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  }
});

// Password Verification
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

module.exports = mongoose.model("Users", UserSchema);
