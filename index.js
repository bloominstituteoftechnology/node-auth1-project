"use strict";

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors')
const db = require("./database/dbConfig");
const bcrypt = require("bcrypt");
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
const { protectedL, convertUsernameToLowecase } = require('./middleware')

const server = new express();
const PORT = 9000;
const sessionConfig = {
  name: 'monkey', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig));
server.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
server.use(helmet());
server.use(express.json());
server.use(morgan("dev"));

server.get("/", (req, res) => res.send("Running"));

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

server.post("/api/register",  convertUsernameToLowecase, async (req, res, next) => {
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

server.get("/api/users", protectedL, async (req, res, next) => {
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
    req.session.username = req.body.username
    res
      .status(200)
      .json({ status: await bcrypt.compare(req.body.password, hashPass[0].password) });
  } catch (err) {
    next(err);
  }
});

server.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`));
