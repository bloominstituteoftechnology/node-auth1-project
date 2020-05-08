const express = require("express");
const session = require("express-session");

const welcomeRouter = require("./routers/welcome-router");
const usersRouter = require("./routers/users-router");
const authRouter = require("./routers/auth-router");
const restricted = require("./routers/restricted-middleware");

const server = express();
const port = process.env.PORT || 5000;

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
};

server.use(express.json());
server.use(session(sessionConfig));

server.use("/welcome", welcomeRouter);
server.use("/users", restricted, usersRouter);
server.use("/auth", authRouter);

server.use((err, res, req, next) => {
  console.log(err);
  escape.status(500).json({
    message: "Ooops! Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server initialized on http://localhost:${port}...`);
});
