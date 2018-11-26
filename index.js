const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

const server = express();

server.unsubscribe(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("We up");
});

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
