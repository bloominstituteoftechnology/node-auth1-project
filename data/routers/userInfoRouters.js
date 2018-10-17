const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../models/userInfoModel");
const session = require("express-session");

router.use(
  session({
    name: "notsession",
    secret: "not a gnelf not a gnoblin",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  })
);

router.get("/", (req, res) => {
  db.get().then(userInfo => {
    res.json(userInfo);
  });
});

router.get("/users", (req, res) => {
  db.getAllUsernames()
    .then(usernameList => {
      if (req.session && req.session.userId) {
       const usernameArray = [];
        usernameList.forEach(user => {
          usernameArray.push(user.username);
        });
        res.json({usernames: usernameArray });

      } else {
        res.json({ message: "not allowed" });
      }
    })
    .catch(err => res.json(err));
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 14);
  db.add({ username, password: hash }).then(() => {
    db.get()
      .then(userInfo => {
        req.session.userId = userInfo.id;
        res.json(userInfo);
      })
      .catch(err => res.json(err));
  });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  db.getByUsername(username)
    .then(userInfo => {
      if (userInfo && bcrypt.compareSync(password, userInfo.password)) {
        req.session.userId = userInfo.id;
        console.log(req.session.userId)
        res.json( {message: 'logged in', loggedIn: true});
      } else {
        res.json({message: 'failed login', loggedIn: false});
      }
    })
    .catch(err => res.json(err));
});

module.exports = router;
