// dependencies
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
// vars
// const db = require("./database/dbConfig.js");
const server = express();
const PORT = 7000;
// middleware
server.use(express.json());
server.use(cors());
// requests
server.get("/", (req, res) => {
  res.send("Its Alive!");
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
