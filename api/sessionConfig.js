require("dotenv").config();
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
  name: "raza-session",
  secret: process.env.SECRETKEY,
  cookie: {
    maxAge: 3600 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("../database/dbConfig.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 3600 * 1000,
  }),
};

module.exports = (server) => {
  server.use(session(sessionConfig));
};
