//server
const express = require("express");
//security
const helmet = require("helmet");
//cors?
const cors = require("cors");
//session using express
const session = require("express-session");
//session store using knex
const KnexSessionStore = require("connect-session-knex")(session); //currying
//Routing
const authRouter = require("./database/authentication/auth-router.js");
const usersRouter = require("./database/users/users-router.js");
const knexstoreconfig = require("./database/dbConfig.js");
// const sessionConfig = require('./database/authentication/session-config.js');
//config of session using express
const sessionConfig = {
  name: "excalibur",
  secret: "sword of destiny",
  resave: false, //avoid recreating unchanged sessions
  saveUninitialized: false, //GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10, //milliseconds, session time
    secure: false, //use for https
    httpOnly: true //can JS access the cookie on the client
  },
  //store is using session-express to be transferred to Knexsessionstore
  store: new KnexSessionStore({
    // knex: require('./database/dbConfig.js'), dont do this, lol
    knex: knexstoreconfig,
    tablename: "sessiondata",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 30 //milliseconds, deletes expired sessions
    //it works
  })
};
//server initialize
const server = express();
//middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
//Routers
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
//server CRUD
//root GET
server.get("/", (req, res) => {
  res.send("Server Running");
});
//export server!
module.exports = server;
