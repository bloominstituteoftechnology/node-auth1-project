const express = require("express");
const welcomeRouter = require("./routers/welcome-router");
const usersRouter = require("./routers/users-router");

const server = express();
const port = process.env.PORT || 5000;

server.use(express.json());

server.use("/welcome", welcomeRouter);
server.use("/users", usersRouter);

server.use((err, res, req, next) => {
  console.log(err);
  escape.status(500).json({
    message: "Ooops! Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server initialized on http://localhost:${port}...`);
});
