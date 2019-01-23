const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./data/dbConfig.js");
const mw = require("./middleware.js");
const PORT = 4200;

const server = express();

server.use(express.json(), cors());

server.use(
  session({
    name: "anythingbutsession", // default is connect.sid
    secret: "cookies are delicious!", //this allows us to encrypt or unencrypt. we wouldn't want this to be hard coded or a string.
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000 //the age of our cookie
    }, // this is 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false, //forces the session to be saved back to the session store, even if the session wasn't modified during the request
    saveUninitialized: false //do we want to make people give their consent for cookies? thing EU's GDPR laws
  })
);

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. Hashes the password

server.post("/api/register", (req, res) => {
  const user = req.body;
  if (mw.passCheck(user)) {
    user.password = bcrypt.hashSync(user.password, 12);
    db.addUser(user)
      .then(id => {
        res.status(201).json(id);
      })
      .catch(err => {
        res.status(500).json({ err: "Could not enter that user" });
      });
  } else {
    res.status(500).json({
      err:
        "Please learn to follow basic instructions on the creation of your password"
    });
  }
});

// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user.
// On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id.
// If login fails, respond with the correct status code and the message: 'You shall not pass!' |
server.post("/api/login", (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.username)
    .then(users => {
      if (
        users.length &&
        bcrypt.compareSync(creds.password, users[0].password)
      ) {
        res.json({ info: "correct" });
      } else {
        res.status(404).json({ err: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ err: `There is an error of: ${err}` });
    });
});

// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database.
// If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

server.get("/api/users", (req, res) => {
  if (req.session && req.session.userID) {
    db.findUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json({ err: `err: ${err}`})
      });
  } else {
    res.status(400).send('You shall not pass!')
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
