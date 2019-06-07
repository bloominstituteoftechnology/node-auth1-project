const express = require("express");
// const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const users = require("./data/users/users-model.js");

const server = express();

// server.use(helmet());
server.use(express.json());

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({ hello: "Testing Hello World!" });
});

// server.post("/api/register", async (req, res) => {
//   const user = req.body;

//   //Hashes current password and sets it as new password
//   const hash = bcrypt.hashSync(user.password, 12);
//   user.password = hash;
//   try {
//     const addUser = await users.add(user);
//     if (addUser) {
//       res.status(201).json(addUser);
//     } else {
//       res.status(404).json({ message: "This doesnt work" });
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

server.post("/api/register", (req, res) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.status(404).json({ message: "missing user or pass" });
  } else {
    //Hashes current password and sets it as new password
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;
    users
      .add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

//THIS DOESNT WORK FOR SOME REASON
// server.get("/api/users", async (req, res) => {
//   try {
//     const users = await users.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// server.get("/api/users", async (req, res) => {
//   try {
//     const users = await db("users");
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({
//       message: "Error in retrieving users"
//     });
//   }
// });

server.get("/api/users", async (req, res) => {
  try {
    const getUsers = await users.find();
    if (getUsers) {
      res.status(200).json(getUsers);
    } else {
      res.status(400).json({ message: "cant get users" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error." });
  }
});

module.exports = server;
