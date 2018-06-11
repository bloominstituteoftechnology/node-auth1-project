const express = require("express");
const mongoose = require('mongoose');
const server = express();
const port = 5555;

server.get("/", (req, res) => {
  res.json("Home");
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
