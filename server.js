const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// we will bring bcrypt onboard
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sessionStore = require("connect-session-knex")(session);
// pull in Users model (to do db operations)
const Users = require("./users/users-model");

const usersRouter = require("./users/users.router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(
  session({
    name: "monkey",
    secret: "this should come from process.env", // the cookie is encrypted
    cookie: {
      maxAge: 1000 * 60,
      secure: false, // in production do true (https is a must)
      httpOnly: true, // this means the JS on the page cannot read the cookie
    },
    resave: false, // we don't want to recreate sessions that haven't changed
    saveUninitialized: false, // we don't want to persist the session 'by default' (GDPR!!!!)
    // store: {
    //   knex: require("../database/connection"),
    //   tablename: "sessions",
    //   sidfieldname: "sid",
    //   createTable: true,
    //   clearInterval: 1000 * 60 * 60,
    // },
  })
);

// [POST] register and login (we need to send paylod - req.body)
server.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // do the hash, add the hash to the db
    const hash = bcrypt.hashSync(password, 10); // 2 ^ 10 rounds of hashing
    // we will insert a record WITHOUT the raw password but the hash instead
    const user = { username, password: hash, role: 2 };
    const addedUser = await Users.add(user);
    // send back the record to the client
    res.json(addedUser);
  } catch (err) {
    // res.status(500).json({ message: 'Something went terrible' }) // PRODUCTION
    res.status(500).json({ message: err.message });
  }
});

server.post("/auth/login", async (req, res) => {
  // checks whether credentials legit
  try {
    // 1- use the req.username to find in the db the user with said username
    // 2- compare the bcrypt has of the user we just pulled against req.body.password
    const [user] = await Users.findBy({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // 3- if user AND credentials good then welcome message
      req.session.user = user;
      res.json({ message: `welcome back, ${user.username}` });
    } else {
      // 4- if no user, send back a failure message
      // 5- if user but credentials bad send packing
      res.status(401).json({ message: "bad credentials" });
    }
  } catch (err) {
    // res.status(500).json({ message: 'bad credentials' }); /// PRODUCTION
    res.status(500).json({ message: err.message });
  }
});

// [GET] logout no need for req.body
server.get("/auth/logout", (req, res) => {
  if (req.session && req.session.user) {
    // we need to destroy the session
    req.session.destroy((err) => {
      if (err) res.json({ message: "you can not leave" });
      else res.json({ message: "good bye" });
    });
  } else {
    res.json({ message: "you had no session actually!" });
  }
});

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
