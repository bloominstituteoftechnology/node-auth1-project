const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../../db/dbConfig.js");
const logoutRouter = express.Router(); 

logoutRouter.get("/", (req, res) => {
  if (req.session) {
    req.session.destory(err => {
      if (err){
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
})


module.exports = logoutRouter; 