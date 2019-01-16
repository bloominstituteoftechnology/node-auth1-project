const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Yep, this is the server!");
});

const PORT = 4045;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
