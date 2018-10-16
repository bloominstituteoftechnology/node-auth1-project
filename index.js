const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const db = require("./data/dbConfig.js");
const mainRoutes = require("./api/mainRoutes");
const KnexSessionStore = require("connect-session-knex")(session);
const cors = require("cors");
const server = express();

server.use(express.json());
server.use(cors());
server.use(morgan("dev"));

// setup session
server.use(
  session({
    name: "excerptsession",
    secret: "random noises session secret",
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: false // no secure (ssl)
    },
    store: new KnexSessionStore({
      tablename: "session",
      sidfieldname: "sid",
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
    }),
    httpOnly: true, // set to http
    resave: false,
    saveUninitialized: true
  })
);

server.use("/api", mainRoutes);

server.listen(8800, () =>
  console.log("\n === API listening on port 8800 === \n")
);
