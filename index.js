const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const server = express();
const port = process.env.PORT || 4300;
const db = require("./database/helpers/userHelpers");
// Cookie and New Session
server.use(
  session({
    name: "mehsession", // default is connect.sid
    secret: "1h4hs7u3nsaskMsdhw23NW1@#s9",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false
  })
);

server.use(express.json());
server.use(cors());

//custom middleware
function protect(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send("access denied");
  }
}

server.get("/", (req, res) => {
  res.send("The Sever is alive");
});


// protect this route, only authenticated users should see it
server.get('/api/users', protect, (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);

  db.insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/api/login", (req, res) => {
  //Check if username exists and the passwords match the user
  const creds = req.body;

  db.findByUser(creds.username)
    .then(users => {
      if (
        users.length &&
        bcrypt.compareSync(creds.password, users[0].password)
      ) {
        req.session.userId = users[0].id;
        res.status(200).json({ info: "correct" });
      } else {
        res.status(404).json({ err: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send("failed to logout");
    } else {
      res.send("Logout Successfull");
    }
  });
});

server.listen(port, () => {
  console.log(`\n === WebAPI Auth-I Listening on: ${port} === \n`);
});
