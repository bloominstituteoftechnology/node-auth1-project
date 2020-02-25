//  import dependencies
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session"); //  npm i express-session
const KnexStore = require("connect-session-knex")(session); //   remember to curry and pass the session

const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");
const restricted = require("../auth/restricted-middleware");
const knex = require("../database/dbConfig"); //  needed for storing sessions in the DB

const server = express();

// Creates session and cookie >>>>>>>
const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  resave: false,
  saveUninitialized: true, // GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, //  should always be true in production
    httpOnly: true //  true means JS can't touch the cookie, always default here
  },
  //  remember "new" keyword
  store: new KnexStore({
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 15 // interval when to delete expired cookies
  })
};

// Middleware >>>>>>>
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(session(sessionConfig)); // Turn on session middleware
//  at this point there is a req.session object created by express-session

//  Endpoint Routes >>>>>>>
server.use("/api/auth", authRouter);
server.use("/api/users", restricted, usersRouter);

server.get("/", (req, res) => {
  console.log(req.session);
  res.json({ api: "up" });
});

module.exports = server;
