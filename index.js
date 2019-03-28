const express = require("express");
const bcrypt = require("bcryptjs");
const mwConfig = require("./data/mwConfig");
const db = require("./data/dbConfig.js");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
    name: "notsession",
    secret: "nobody tosses a dwarf!",
    cookie: {
        maxAge: 1 * 15,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new knexSessionStore ({
        tablename: "sessions",
        sidfieldname: "sid",
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
}
const PORT = 9090;
const server = express();
server.use(express.json());
server.use(session(sessionConfig));
mwConfig(server);

// endpoints

server.post("/register", (req,res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14)
    credentials.password = hash;

    db("users")
      .insert(credentials)
      .then(ids => {
          res.status(201).json(ids)
      })
      .catch(() => {
          res.status(500).json({ error: "Unable to register user"});
      })
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
