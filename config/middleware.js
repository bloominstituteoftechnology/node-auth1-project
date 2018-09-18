const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

module.exports = (server) => {
  server.use(express.json()); //this teaches express how to parse JSON info from req.body
  server.use(helmet());
  server.use(morgan("dev"));
  server.use(cors());
};