const express = require("express"),
  port = process.env.PORT || 5000,
  cors = require("cors"),
  server = express();

server.use(express.json());
server.use(cors());

server.get("/api", (req, res) => {
  res.status(200).send("<h1>Welcome to the Authentication API</h1>");
});

server.listen(port, () => {
  console.log("Server listening on port:" + port);
});
