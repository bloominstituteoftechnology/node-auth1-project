const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Its Alive!");
});


server.listen(3001, () => console.log("\nrunning on port 3001\n"));
