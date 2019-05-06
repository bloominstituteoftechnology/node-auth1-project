const express = require("express");
const helmet = require("helmet");

const userRouter = require("../routes/user-router.js");

const server = express();

server.use(helmet());
server.use(express.json());

server.use("/", userRouter);

server.get("/", (req, res) => {
  res.status(200).send("Server currently running!!");
});

module.exports = server;
