const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const loginRoutes = require("../login/login.js")

module.exports = server => {
  server.use(express.json());
  server.use(helmet());
  server.use(morgan("dev"));
  server.use(cors());

    server.use("/api", loginRoutes)
};
