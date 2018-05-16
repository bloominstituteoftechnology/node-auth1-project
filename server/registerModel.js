const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require("bcrypt");

const definition = {
  username: {
    type: String,
    require: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
};

const options = {
  timestamps: true
};

const registerSchema = new Schema(definition, options);

registerSchema.pre("save", function(next) {
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

registerSchema.methods.isPasswordValid = function(passwordGuess) {
  const val = bcrypt.compare(passwordGuess, this.password);
  return val;
};

const registerModel = mongoose.model("Register", registerSchema);
module.exports = registerModel;
