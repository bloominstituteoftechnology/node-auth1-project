const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");
const PORT = 4200;

const server = express();

server.use(express.json(), cors());

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. Hashes the password

server.post("./api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);
  db("users")
    .insert(user)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json({ err: "Could not enter that user" });
    });
});

// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user.
// On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id.
// If login fails, respond with the correct status code and the message: 'You shall not pass!' |

// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database.
// If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
