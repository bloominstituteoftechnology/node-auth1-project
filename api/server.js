const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// ROUTES
const authRouter = require("../auth/auth-router");
const authUsers = require("../users/users-router");

// SERVER EXPRESS
const server = express();

// MIDDLEWARE
server.use(helmet());
server.use(express.json());
server.use(cors());

//  MAS ROUTES
server.use("/auth", authRouter);
server.user("/users", authUsers);

//////////////////////////////// SERVER API
server.get("/", (req, res, next) => {
  res.status(200).json({
    message: "web auth api says hi."
  });
});

server.use((err, req, res, next) => {
  console.log("Error", err);

  res.status(500).json({
    message: "ay dios mio something went wrong."
  });
});

module.exports = server;
