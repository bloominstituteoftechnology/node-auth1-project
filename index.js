// import packages
const express = require("express");
const db = require("./data/db");
const server = express();
const bcrypt = require("bcryptjs");

// import routers

// use middleware

// endpoints
server.get("/", (req, res) => {
  res.send("Up and running...");
});

// run server
const port = 8000;
server.listen(port, function() {
  console.log(`\n=== WEB API LISTENING ON HTTP://LOCALHOST:${port} ===\n`);
});
