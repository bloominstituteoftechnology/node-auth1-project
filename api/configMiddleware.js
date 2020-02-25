const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

module.exports = server => {
  server.user(helmet());
  server.use(express.json());
  server.use(cors());
};
