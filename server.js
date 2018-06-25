const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo(session);
//const MongoStore = require("connect-mongo")(session);
//shorter way of doing the same thing

const User = require("./auth/UserModel");
//User aka the model/schema should generally be capitalized

mongoose //cs10 instantiates cs10 database
  .connect("mongodb://localhost/cs10")
  .then(console.log(`\n*** Derrick connected to the cs10 Database***\n`))
  .catch(err => res.status(500).json(err));

const server = express();

server.use(express.json());

const sessionOptions = {
  secret: "derrick is actually kevin",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //24 hours
  },
  httpOnly: true, //only send through http defalut value is true
  secure: false, //only use https
  resave: true,
  savedUninitialized: false,
  name: "not telling you!", //changing name so it's not easy to crack
  store: new MongoStore({
    url: "mongodb://localhost/sessions", // where the session data is stored
    ttl: 60 * 10 //in seconds. aka cleans up sessions after 10 min
  })
};

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json("Please login to continue");
  }
}

server.use(session(sessionOptions));

server.get("/", (req, res) => {
  if (req.session && req.session.username) {
    res.status(200).json(`Welcome Back ${req.session.username}`);
  } else {
    res.status(401).send("you do not have session");
  }
});

server.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const newUser = { username, password };
  //   const user = new User({ username, password });
  //   user.save().then(user => res.json(user)).catch();
  User.create(newUser)
    //User.create with capital U is sending newUser through model first and then saving it
    .then(user => res.status(201).json(user))
    .catch(err =>
      res
        .status(500)
        .json(err.message)
        .end()
    );
});

server.post("/api/login", (req, res) => {
  //find the inputed user, find their saved password, compare saved password to inputed password
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        user
          .validatePassword(password)
          .then(passwordMatches => {
            //console.log(passwordMatches);
            //bcrypt.compare returns a boolean
            if (passwordMatches) {
              req.session.username = user.username;
              res.send("login successful, please have a cookie");
            } else {
              res.status(401).send("password does not match");
            }
          })
          .catch(() => {
            res.send("server error comparing passwords");
          });
      } else {
        res.status(401).send("User not Found");
      }
    })
    .catch(err => res.send(err.message));
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      err ? res.send("error logging out") : res.send("Logout Successful");
    });
  }
});

server.get("/api/users", protected, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

const port = 8000;
server.listen(port, () => {
  console.log(`\n*** Derrick's Auth-I API running on port ${port}***\n`);
});
