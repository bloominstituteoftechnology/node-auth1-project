const express = require("express");

const configMiddleware = require("./globalMiddleware.js");
const configSession = require("./sessionConfig");
const restrictedRoute = require("./auth/restricted-middleware.js");

const authRouter = require("./auth/auth-router.js");
const userRouter = require("./routers/user-router.js");

const server = express();
configMiddleware(server);
configSession(server);

server.get("/api", (req, res) => {
  res.send(`The api on server is running`);
});

server.use("/api/auth", authRouter);
server.use("/api/users", restrictedRoute, userRouter);

module.exports = server;
