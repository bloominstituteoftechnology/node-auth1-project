const express = require("express");
const helmet = require("helmet");

module.exports = server => {
  server.use(express.json());
  server.use(helmet());
};
