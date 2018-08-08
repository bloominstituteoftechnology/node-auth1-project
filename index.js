const express = require("express");
const db = require("./data/db.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors({ origin: "http://localhost:3000", credentials: true }));

// configure express-session middleware
server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    // only set cookies over https. Server will not send back a cookie over http.
    resave: false,
    saveUninitialized: false
  })
);

function protected(req, res, next) {
  if (req.session && (req.session.username === "frodo" || req.session.username === "gandalf")) {
    console.log("session name", req.session.username);
    next();
  } else {
    console.log("session name", req.session.username);
    return res.status(401).json({ error: "Incorrect credentials." });
  }
}

server.get("/api/users", protected, async (req, res) => {
  try {
    const list = await db("Users");
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.post("/api/register", async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  if (!user.user || !user.password) {
    res.status(401).json({ error: "Please enter a username and password" });
  }
  try {
    const ids = await db.insert(user).into("Users");
    try {
      const newUser = await db("Users")
        .where({ id: ids[0] })
        .first();
      res.status(201).json(ids[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

server.post("/api/login", async (req, res) => {
  const credentials = req.body;
  const user = credentials.user;
  try {
    const getUser = await db
      .select()
      .from("Users")
      .where({ user })
      .first();
    console.log("getUser is: ", getUser);
    if (getUser && bcrypt.compareSync(credentials.password, getUser.password)) {
      req.session.username = user;
      res.send(`Logged In, Welcome ${user}`);
    } else {
      return res.status(401).json({ error: "Incorrect credentials, you shall not pass!" });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("Successfully logged out.");
      }
    });
  }
});

server.get("/api/restricted/", protected, (req, res) => {
  res.send("You are viewing restricted content");
});

server.listen(8000, () => {
  console.log(`\n=== Web API Listening on http://localhost:8000 === \n`);
});
