const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
//server
const server = express();

//welcome, users and auth routers
const welcomeRouter = require("./welcome/welcome-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

// SESSION CONFIG
const sessionConfig = {
  name: "sessionID",
  secret: "keep this cookie a secret",
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, // HTTPS, it's the lock icon on url bar
    httpOnly: true,
  },
  // only save the session and cookie if the user allows you to
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require("./database/dbconfig"),
    tablename: "sessions", //this creates a table inside the DB next to users
    //this can be named sID or id because it's inside sessions table
    sidfieldname: "session_id", // it's a column that has your session id
    createtable: true, //if no table of sessions name, this creates it in DB next to users
    clearInterval: 3600 * 1000, // session will be store for this time, after this, it deletes again
  }),
};

//Global middleware
server.use(session(sessionConfig));
server.use(helmet());
server.use(cors());
server.use(express.json());

//Server endpoints --------->
//GET welcome router /5000
server.use("/", welcomeRouter);
//GET /api/users
server.use("/api/users", usersRouter);
//GET /api/auth REGISTER, LOGIN, LOGOUT
server.use("/api/auth", authRouter);

module.exports = server;
