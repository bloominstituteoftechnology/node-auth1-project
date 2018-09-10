"use strict";

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./database/dbConfig");
const bcrypt = require("bcrypt");

const server = new express();
const PORT = 9000;
const saltRounds = 15;

server.use(helmet());
server.use(express.json());
server.use(morgan("dev"));

server.get("/", (req, res) => res.send("Running"));

server.post("/api/register", async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
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

server.post("/api/login", async (req, res, next) => {
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
