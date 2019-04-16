//create express server
const express = require("express");
const server = express();

//built-in & 3rd party middleware
server.use(express.json());
const cors = require("cors");
server.use(cors());

//Import knex configuration
configuredKnex = require("./data/dbConfig");

//Configure express-session middleware and knex session store
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
server.use(
  session({
    name: "notsession",
    secret: "this is not a secret",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, //use cookie over https
      httpOnly: true //false means JS can access the cookie
    },
    resave: false, //avoid recreating unchanged sessions
    saveUninitialized: false, //GDPR compliance
    store: new knexSessionStore({
      knex: configuredKnex,
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 30 //delete expired sessions
    })
  })
);

//Access route handlers/endpoints
const usersRoutes = require("./Routers/usersRouter");
server.use("/api/", usersRoutes);

//endpoint to test server
server.get("/", (req, res) => {
  res.json("Success");
});

//listener
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
