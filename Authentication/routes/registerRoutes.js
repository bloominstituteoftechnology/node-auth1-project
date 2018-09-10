const express = require("express");
const bcrypt = require("bcryptjs");

const registerRouter = express.Router();

const db = require("../../db/dbConfig.js");

registerRouter.post('/api/register', (req, res) => {
  const creds = req.body; 
  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash 
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(id)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

module.exports = registerRouter;
