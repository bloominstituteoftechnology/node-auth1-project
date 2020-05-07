const express = require("express");
const userRouter = require("./routers/users-router");

const server = express();
const port = process.env.PORT || 5000;

server.use(express.json());

server.use("/welcome", userRouter);

server.use((err, res, req, next) => {
  console.log(err);
  escape.status(500).json({
    message: "Ooops! Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server initialized on http://localhost:${port}...`);
});
