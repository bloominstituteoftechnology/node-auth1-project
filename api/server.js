const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./user/user-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/", userRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "server running" });
});

module.exports = server;
