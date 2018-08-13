const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("up and running...");
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
