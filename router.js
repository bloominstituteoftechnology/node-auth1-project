const bycryptjs = require('bcryptjs');

const router = require("express").Router();

const Users = require("./.........")

router.post("/register", (req, res) => {
  const credentials = req.body;

  const rounds = process.env.BCRYPT_ROUNDS || 8;

  credentials.password = hash;

  Users.add(credentials).then(users => {
    res.status(201).json({ data:user });
  })
})
