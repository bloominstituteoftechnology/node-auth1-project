const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(logger(`combined`));
  server.use(cors());
};
