//set requires
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./helpers/dbHelpers");

//set port #
const PORT = 8000;

const server = express();
server.use(express.json(), cors(), session({
      //allows us to encrypt and unencrypt default is connect.sid
         name: 'notsession',
      //cookie encryption key: allows us to open cookie
         secret: 'nobody tosses a dwarf!',
      //cookie age 1 day in milliseconds
         cookie: {
           maxAge: 1 * 24 * 60 * 60 * 1000
         },
      // don't let JS code access cookies. Browser extensions run JS code on your browser!
         httpOnly: true,
         resave: false,
      //cookie consent
         saveUninitialized: false,
}));

function protect(req, res, next) {
   req.session && req.session.userId ? next() : res.status(400).send("You shall not pass!");
}
server.get("/", (req, res) => {
   res.send("Homepage");
});

/*Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.*/
server.post("/api/register", (req, res) => {
   const user = req.body;
   if (user.username && user.password) {
   user.password = bcrypt.hashSync(user.password, 14);
   db.insert(user)
      .then(ids => {
         res.status(201).json({id: ids[0]});
      })
      .catch(err => {
         res.status(500).send(err);
      })
   } else  res.status(400).json({err: "please provide a username and password"});
});

/*Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'*/
server.post("/api/login", (req, res) => {
   const login = req.body;
   if (login.username && login.password) {
      db.findByUsername(login.username)
         .then(users => {
            if(users.length && bcrypt.compareSync(login.password, users[0].password)) {
            req.session.userId = users[0].id
            res.send("Logged in")
             } else { res.status(404).send("You shall not pass!");}
         })
         .catch(err => {
            res.status(500).send(err);
         });
   } else  res.status(400).json({err: "please provide a username and password"});
});

/*If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.*/
server.get("/api/users", protect, (req, res) => {
   db.findUsers()
      .then(users => {res.json(users)})
      .catch(err => {res.json(err)});
});

//allow incoming request to server
server.listen(PORT, () => {
   console.log(`server running on port ${PORT}`)
});