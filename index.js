const express = require("express");
const db = require("./data/db.js");
const bcrypt = require("bcrypt");

const server = express();
server.use(express.json());

server.get("/api/users", async (req, res) => {
  try {
    const list = await db("Users");
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.post("/api/register", async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  if (!user.user || !user.password) {
    res.status(401).json({ error: "Please enter a username and password" });
  }
  try {
    const ids = await db.insert(user).into("Users");
    res.status(201).json(ids[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

server.post("/api/login", async (req, res) => {
  const credentials = req.body;
  const user = credentials.user;
  try {
    const getUser = await db
      .select()
      .from("Users")
      .where({ user })
      .first();
    console.log("getUser is: ", getUser);
    if (!getUser || !bcrypt.compareSync(credentials.password, getUser.password)) {
      return res.status(401).json({ error: "Incorrect credentials" });
    } else {
      res.status(200).json({ message: "Logged in" });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

server.listen(8000, () => {
  console.log(`\n=== Web API Listening on http://localhost:8000 === \n`);
});
