const express = require("express");
const server = express();
const bcrypt = require("bcryptjs");
const db = require("./database/dbConfig");
const cors = require("cors");

server.use(express.json());
server.use(cors());

server.post("/api/login", (req, res) => {
  //get username and password from body
  const creds = res.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //passwords match and user exists
        res.status(200).json({ message: "welcome" });
      } else {
        res
          .status(401)
          .json({ message: "invalid username or password" })
          .catch(err => json(err));
      }
    });
});

server.listen(4500, () => console.log("\n== Port 4500 ==\n"));
