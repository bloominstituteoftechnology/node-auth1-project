const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session"); // install this library
const KnexSessionStore = require("connect-session-knex")(session); // install library

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");
const requiresAuth = require("../auth/requires-auth.js");
const dbConnection = require("../database/connection.js");

const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
      secure: process.env.COOKIE_SECURE || false, // true means use only over https
      httpOnly: true, // JS code on the client cannot access the session cookie
    },
    resave: false,
    saveUninitialized: true, // GDPR compliance, read the docs
    store: new KnexSessionStore({
      knex: dbConnection,
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 6000, // delete expired sessions - in milliseconds
    }),
  };
  
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig)); // turn on sessions
  
  server.use("/api/users", requiresAuth, usersRouter);
  server.use("/api/auth", authRouter);
  
  server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;
  