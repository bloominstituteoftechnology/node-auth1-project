const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const userRouter = require("../routers/user/user-router");
const authRouter = require("../routers/auth/auth-router");

const server = express();

const sessionConfig = {
  name: "bannana",
  secret: "this is a secret",
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 1,
    secure: false
  },
  resave: false,
  saveUninitialized: true
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/", userRouter);
server.use('/api/', authRouter);

server.get("/", (req, res) => {

  const welcome = req.session.username || "you are currently not logged in";
  res.status(200).json({ message: `hello ${welcome}` });
});

module.exports = server;
