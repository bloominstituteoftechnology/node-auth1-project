"use strict";
// dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
// setting store, db required
const db = require("../database/dbConfig.js");
const KnexSessionStore = require("connect-session-knex")(session);
// secret for store
const randomSecret = Math.random(1, 1000);
// routes
const userRoutes = require("../routes/userRoutes.js");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  switch (err.code) {
    case 404:
      res.status(404).json({
        message: "The requested user does not exist.",
      });
    case 406:
      res.status(406).json({
        message: "Please provide a username and password.",
      });
      break;
    default:
      res.status(500).json({
        message: "There was an error performing the required operation",
      });
      break;
  }
};

// start sessionConfig
const sessionConfig = {
  name: "definitely not connect.sid", // default is connect.sid
  // secret: "nobody tosses a dwarf!",
  secret: randomSecret,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};
// end sessionConfig

module.exports = server => {
  // server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  server.use(helmet());
  server.use(express.json());
  server.use(session(sessionConfig));
  server.use(morgan("dev"));
  server.use("/api", userRoutes);
  server.use(errorHandler);
};
