const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require("./dbConfig");


module.exports = {
    name: "Marvin",
    secret:
      "I have this terrible pain running down all the diodes on my left side",
  
    cookie: {
      maxAge: 1000 *60 * 60,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: "sessions",
      sidfieldname: "sessionid",
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  };