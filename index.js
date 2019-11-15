const express = require("express"),
  port = process.env.PORT || 5000,
  cors = require("cors"),
  Users = require("./data/db-helpers"),
  server = express();

server.use(express.json());
server.use(cors());

server.get("/api", (req, res) => {
  res.status(200).send("<h1>Welcome to the Authentication API</h1>");
});
server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Unable to access database" });
    });
});
server.listen(port, () => {
  console.log("Server listening on port:" + port);
});
