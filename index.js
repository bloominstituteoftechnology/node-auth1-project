"use strict";

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors')
const db = require("./database/dbConfig");
const bcrypt = require("bcrypt");
const { convertUsernameToLowecase } = require('./middleware')

const server = new express();
const PORT = 9000;

server.use(cors({
  credentials: true
}))
server.use(helmet());
server.use(express.json());
server.use(morgan("dev", {
  immediate: true
}));

server.get("/", (req, res) => res.send("Running"));

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

server.post("/api/register", convertUsernameToLowecase,  async (req, res, next) => {
  try {
    const salt = getRandomArbitrary(10, 50)
    const hash = await bcrypt.hash(req.body.password, salt);
    res.status(200).json(
      await db(`users`).insert({
        username: req.body.username,
        password: hash
      })
    );
  } catch (err) {
    next(err);
  }
});

server.get("/api/users", async (req, res, next) => {
  try {
    res.status(200).json(await db(`users`).select("id", "username"));
  } catch (err) {
    next(err);
  }
});

server.post("/api/login", convertUsernameToLowecase, async (req, res, next) => {
  try {
    const hashPass = await db(`users`)
      .where({ username: req.body.username })
      .select('password');
    console.log(hashPass)
    res
      .status(200)
      .json({ status: await bcrypt.compare(req.body.password, hashPass[0].password) });
  } catch (err) {
    next(err);
  }
});

server.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`));
