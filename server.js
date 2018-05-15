const express = require("express");
const mongoose = require("mongoose");

const usersRouter = require("./users/usersRouter");
const registerRouter = require("./register/registerRouter");

const server = express();

server.use(express.json());

mongoose
  .connect("mongodb://localhost/authdb")
  .then(connect => {
    console.log("\n== Connected to AuthDB ==\n");
  })
  .catch(error => console.log("Error connecting to AuthDB.", error));

server.use("/api/users", usersRouter);
server.use("/api/register", registerRouter);

server.get("/", (req, res) => {
  res.send("--- API is Running ---");
});

server.listen(5000, () => console.log("\n== API running on port 5000 ==\n"));
