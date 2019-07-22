const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Users = require("./users/users-model.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/users", async (req, res) => {
  try {
    const users = await Users.getUsers();
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "no users found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

function checkCredentials(req, res, next) {
  if (req.body.username && req.body.password) {
    req.body.password= bcrypt.hashSync(req.body.password, 12);
    next();
  } else if (!req.body.password) {
    return res.status(400).json({ message: "Missing password" });
  } else {
    return res.status(400).json({ message: "Missing username" });
  }
}

async function authUser(req, res, next){
  try{
    const user = Users.findUserByName(req.body.name)
  }
}

server.post("/register", async (req, res) => {
  try {
    const newUser = await Users.registerUser(
      req.body.username,
      req.body.password
    );
    if (user) {
      return res.status(201).json({ message: "registration successful" });
    } else {
      return res.status(400).json({ message: "registration failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

server.post("/login", async (req, res) => {
  try {
    const userID = await Users.findUserByName(req.body.username);
    if (userID > 0) {
      return res
        .status(200)
        .json({ message: "login successful", cookie: userID });
    } else {
      return res.status(400).json({ message: "login failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
