const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

server = express();
server.use(express.json());
server.use(cors());
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect("mongodb://localhost:27017/authDB")
  .then(conn => {
    console.log(" connected to authDB");
  })
  .catch(err => {
    console.log(`err: ${err}`);
  });

const sessionConfig = {
  secret: "hello Hilal Aissani",
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUnInitialized: false,
  name: "Bello",
  store: new MongoStore({
    url: "mongodb://localhost/registerSessionsDB",
    ttl: 60 * 10
  })
};

server.use(session(sessionConfig));

server.get("/", (req, res) => {
  res.status(200).json({ msg: " app is running just be happy!!!!" });
});
//---------session--------------------
server.get("/api/", (req, res) => {
  if (req.session && req.session.username) {
    res
      .status(200)
      .json({ msg: ` welcome mister ${req.session.username} back !!!!` });
  } else {
    res.status(200).json({ msg: ` who are you mister ????????` });
  }
});
//-----------end of session -------------
const registerRoute = require("./registerRoute.js");
server.use("/api/registers", registerRoute);

const loginRoute = require("./loginRoute.js");
server.use("/api/login", loginRoute);

const logoutRoute = require("./logoutRoute.js");
server.use("/api/logout", logoutRoute);

server.listen(7000, () => {
  console.log("\n=== Api running on port 7000===\n");
});
