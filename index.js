const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const PORT = 3300;
const db = require("./data/dbConfig.js");

const server = express();

const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).send("access denied");
  }
};

server.use(express.json());
server.use(cors());
server.use(
  session({
    name: "notsession",
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  })
);

server.post("/api/register", (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password);
  db("users")
    .insert(newUser)
    .then(id => {
      res.status(201).send({ message: `id ${id} created` });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/api/login", (req, res) => {
  const user = req.body;
  db("users")
    .where("username", user.username)
    .then(users => {
      if (
        users.length &&
        bcrypt.compareSync(user.password, users[0].password)
      ) {
        req.session.userId = users[0].id;
        res.status(202).send("login successful");
      } else {
        res.status(401).send("You shall not pass!");
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.get("/api/restricted/users", protect, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.send(err);
    });
});

server.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("login successful");
    }
  });
});
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
