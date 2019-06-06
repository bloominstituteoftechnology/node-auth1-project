const express = require("express");
const helmet = require("helmet");

const server = express();

server.use(helmet());
server.use(express.json());

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({ hello: "Testing Hello World!" });
});

module.exports = server;
