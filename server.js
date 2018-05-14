const express = require("express");
const mongoose = require("mongoose");

const usersRouter = require("./user/usersRouter");

const server = express();

server.use(express.json());

mongoose
  .connect("mongodb://localhost/authdb")
  .then(connect => {
    console.log("\n== Connected to AuthDB ==\n");
  })
  .catch(error => console.log("Error connecting to AuthDB.", error));

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send("--- API is Running ---");
});

server.listen(5000, () => console.log("\n== API running on port 5000 ==\n"));
