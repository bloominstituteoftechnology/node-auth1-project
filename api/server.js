
const session = require('express-session'); //might need this code

const knexSessionStore = require('connect-session-knex')(session); //might need this code

const express = require('express');

const loggedInCheck = require('./auth/logged-in-check-middleware.js'); //might need this code





const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");


const server = express();

const sessionConfig = {
    name: 'sksession',
    secret: 'myspeshulsecret',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // should be true in production
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
  
    store: new knexSessionStore(
      {
        knex: require("../database/connection.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60
      }
    )
  }
  // I will need this code

  server.use(express.json());

  server.use(session(sessionConfig));


  server.use("/api/users", loggedInCheck, usersRouter);
  server.use("/api/auth", authRouter);
  
  server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;