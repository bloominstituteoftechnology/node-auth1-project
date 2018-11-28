const db = require("./dbConfig");


const config = session => {
const KnexConnection = require("connect-session-knex")(session);
  return {
    secret: "this-is-his-dog",
    name: "mewithoutYou",
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60
    },
    store: new KnexConnection({
      knex: db
    })
  };
};

module.exports = config;
