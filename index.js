const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./database/dbConfig.js");
const KnexSessionStore = require("connect-session-knex")(session);

const path = require("path");

const server = express();

const login = require("./Login/login.js");
const configMiddleware = require("./config/middleware.js");

//configure middleware for the server
configMiddleware(server);

server.get("/download", (req, res, next) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath, (err) => {
    // if there is an error the callback function will get an error as it's first argument
    if (err) {
      // we could handle the error here or pass it down to error-handling middleware like so:
      next(err); // call the next error-handling middleware in the queue
    } else {
      console.log("File sent successfully");
    }
  });
});

server.use(errorHandler);

//-----------------------------------------//
// Optional Way for configuration //
//const knexConfig = require("./knexfile");
//const db = knex(knexConfig.development);
//----------------------------------------//

//======session configuration====//
const sessionsConfig = {
  name: "monkey", // default is connect.sid
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};
//======session configuration====//

server.use(session(sessionsConfig));

server.use("/api", login);

//========middleware==========//
function errorHandler(err, req, res, next) {
  console.error(err);

  switch (err.statusCode) {
    case 404:
      res.status(404).json({
        message: "There was an error performing the required operation"
      });

      break;

    default:
      res.status(500).json({
        message: "There was an error performing the required operation"
      });

      break;
  }
}
//========middleware==========//

server.listen(2500, () => console.log("\n===Running on Port: 2500===\n"));
