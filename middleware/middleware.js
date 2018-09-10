"use strict";
// dependencies
const express = require("express");
const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// routes
const userRoutes = require("../routes/userRoutes.js");

module.exports = server => {
  // server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  // server.use(helmet());
  server.use(express.json());
  // server.use(morgan("dev"));
  server.use("/api", userRoutes);
  // server.use(errorHandler);
};
