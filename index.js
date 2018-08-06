const express = require("express");
const db = require("./data/db");
const bcrypt = require("bcryptjs");
const server = express();
server.use(express.json());

server.get("/api", (req, res) => {
  res.send("working...");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  console.log(user);
});

const port = 9000;
server.listen(port, function() {
  console.log(`Web API listening on http://localhost:${port}`);
});
