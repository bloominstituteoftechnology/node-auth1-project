const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cors = require("cors");
const dbConnection = require("../data/dbConfig");
const KnexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
  name: "almondMilk",
  secret: process.env.SESSION_SECRET || "CONFIDENTIAL",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000
  })
};

module.exports = function(server) {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig));
};