const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const User = require("./users/User");
const restrictedRouter = require("./restrictedRouter");
mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => {
    console.log("\n===connected to mongo ===\n");
  })
  .catch(err => console.log("error connecting to mongo", err));

const server = express();

function loginAuthenticate(req, res, next) {
  const authdb = mongoose.connect(`mongodb://localhost/authdb`);
  const searchUser = req.body.username;
  let passwordFlag = false;

  if (searchUser !== undefined) {
    User.find({ username: searchUser }).then(user => {
      if (user.length === 0) {
        res.status(400).send("User not in database");
      } else {
        bcrypt.compare(req.body.password, user[0].password).then(checked => {
          if (checked) next();
          else res.status(401).send("Access Denied");
        });
      }
    });
  } else {
    res.status(400).send("Must supply a username");
  }
}

function authenticate(req, res, next) {
  req.session && req.session.username
    ? next()
    : res.status(401).send("You shall not pass!");
}

const sessionConfig = {
  secret: "this is our secret",
  cookie: {
    maxAge: 86400000
  }, // 1 day in ms
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: "noname",
  store: new MongoStore({
    url: "mongodb://localhost/sessions",
    ttl: 60 * 10
  })
};

server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/restricted", authenticate, restrictedRouter);


server.get("/api/users", authenticate, (req, res) => {
  User.find()
    .select("-_id -__v")
    .then(result => {
      res.status(201).json(result);
    });
});

server.post("/api/register", function(req, res) {
  const user = new User(req.body);

  user.save().then(user =>
    res
      .status(201)
      .send(user)
      .catch(res.status(500).send(err))
  );
});

server.post("/api/login", loginAuthenticate, (req, res) => {
  const username = req.body.username;
  User.findOne({ username }).then(user => {
    req.session.username = user.username;
    res.send("have a cookie");
  });
});



  server.listen(8000, () => console.log("\n=== api running on 8k ===\n"));
