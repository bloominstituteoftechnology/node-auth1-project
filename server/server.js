const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

server = express();
server.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/authDB")
  .then(conn => {
    console.log(" connected to authDB");
  })
  .catch(err => {
    console.log(`err: ${err}`);
  });

server.get("/", (req, res) => {
  res.status(200).json({ msg: " app is running just be happy!!!!" });
});

const registerRoute = require("./registerRoute.js");
server.use("/api/register", registerRoute);

const loginRoute = require("./loginRoute.js");
server.use("/api/login", loginRoute);

server.listen(7000, () => {
  console.log("\n=== Api running on port 7000===\n");
});
