/*
| POST   | /api/register | Creates a `user` using the 
information sent inside the `body` of the request. 
**Hash the password** before saving the user to the 
database.                                                                                                                                                 |


| POST   | /api/login    | Use the credentials sent 
inside the `body` to authenticate the user. On 
successful login, create a new session for the 
user and send back a 'Logged in' 
message and a cookie that contains the user id. 
If login fails, respond with the correct status 
code and the message: 'You shall not pass!' |


| GET    | /api/users    | If the user is logged in, 
respond with an array of all the users contained in 
the database. If the user is not logged in repond 
with the correct status code and the message: 
'You shall not pass!'.            |
*/

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 4);

  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      console.log(err);
    });
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(9000, () => console.log("running on port 9k"));
