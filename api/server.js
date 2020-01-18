const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// const db = require("../../data/dbconfig");
// SERVER EXPRESS
const server = express();
// MIDDLEWARE
server.use(helmet());
server.use(express.json());
server.use(cors());
// Hashing a password with bcryptjs. it is a npm i.
// const bcrypt = require("bcryptjs");
// // to hash a password
// const credentials = req.body;
// const hash = bcrypt.hashSync(credentials.password, 14);
// credentials.password = hash;
// // move on to save the user.
// let { username, password } = req.body;
//////////////////////////////// SERVER API
server.get("/", (req, res) => {
  res.status(200).json({
    message: "web auth1 project api says hi."
  });
});

//////////////////////////////// POST REGISTER USER /api/register
// Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.                                                                                                                                                         |
server.post("/api/register", async (req, res) => {
  try {
    URLSearchParams.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          // we will return 401 if the password or username are invalid
          // we don't want to let attackers know when they have a good username
          res.status(401).json({ message: "eat my shorts attackers!" });
        }
      });
  } catch (error) {
    res.status(500).json({ message: "ay dio mio missed it." });
  }
});

//////////////////////////////// POST LOGIN USER /api/login
// Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
server.post("/api/login", async (req, res) => {
  try {
    res.status(200).json({
      message: "Register in this Login!"
    });
  } catch (error) {
    res.status(500).json({ message: "ay dios mios Login" });
  }
});

//////////////////////////////// GET USER /api/users
// If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.
server.get("/api/user", async (req, res) => {
  try {
    res.status(200).json({
      message: "welcome to a new api user"
    });
  } catch (error) {
    res.status(500).json({ message: "ay dios mios User" });
  }
});

module.exports = server;

// // SERVER GET ANOTHER_BRANCH DUMMY
// server.get("/branchName", async (req, res) => {
//   // bringing in a database file aqui.
//   const branchName = await db("ANOTHER_BRANCH");
//   try {
//     res.status(200).json({
//       message: "welcome to a new branch"
//     });
//   } catch (error) {
//     res.status(500).json({ message: "ay dios mios" });
//   }
// });
