const express = require("express");
const bcrypt = require("bcryptjs");

const registerRouter = express.Router();

const db = require("../../db/dbConfig.js");

registerRouter.post("/", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0]
      res.status(201).json(id);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

//"react-router-dom, axios, and others will need to be added"
module.exports = registerRouter;
