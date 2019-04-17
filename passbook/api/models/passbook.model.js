"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var PassbookSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    name: {
      type: String,
      required: false,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "rejected", "pending", "blocked"],
      default: "pending"
    },
    pincode: {
       type: String,
      required: true
    },
    nameOnCard: {
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
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Passbook", PassbookSchema);
