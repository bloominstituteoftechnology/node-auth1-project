const express = require("express");

const server = express();

server.use(express.json());

server.use((err, res, req, next) => {
  console.log(err);
  escape.status(500).json({
    message: "Ooops! Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server initialized on http://localhost:${port}...`);
});
