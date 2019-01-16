//set requires
const express = require("express");
const knex = require("knex");
const cors = require("cors");
const bcrypt = require("bcryptjs")

const dbConfig = require("./knexfile");
const db = knex(dbConfig.development);

//set port #
const PORT = 8000;

const server = express();
server.use(express.json(), cors());

/*Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.*/
server.post("/api/register", (req, res) => {
   const user = req.body;
   if (user.username && user.password) {
   user.password = bcrypt.hashSync(user.password, 14);
   db("users").insert(user)
      .then(ids => {
         res.status(201).json({ids: ids})
      })
      .catch(err => {
         res.status(500).send(err);
      })
   } else  res.status(400).json({err: "please provide a username and password"});
});

/*Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'*/
server.post("/api/login", (req, res) => {
   const user = req.body;
   if (user.username && user.password) {
      user.password = bcrypt.hashSync(user.password, 14);
      db("users").where("username", user.username)
         .then(users => {
            users.length && bcrypt.compareSync(users.password, users[0].password) ?
            res.json({info: "login correct"})
            : res.status(404).json({err: "invalid username or password"});
         })
         .catch(err => {
            res.status(500).send(err);
         })
   } else  res.status(400).json({err: "please provide a username and password"});
});

/*If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.*/
server.get("/api/users", (req, res) => {

});

//allow incoming request to server
server.listen(PORT, () => {
   console.log(`server running on port ${PORT}`)
});