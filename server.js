const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const userRouter = require("./users-router");
const authRouter = require("./auth-router");
const authenticator = require("./authenticator");

const server = express();

const sessionConfig = {
  name: "session",
  secret: process.env.SESSION_SECRET || "this is a secret",
  resave: false,
  saveUninitialized: process.env.SEND_COOKIES || true,
  cookie: {
    maxAge: 1000 * 30,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", authenticator, userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req,res) => {
    res.json({api: "up"});
})

module.exports = server;