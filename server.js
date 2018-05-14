const express = require("express");
const mongoose = require("mongoose");

const server = express();

server.unsubscribe(express.json());

server.get("/", (req, res) => {
  res.send({ route: "/", message: "req.message" });
});

server.listen(5000, () => console.log("\n== API running on port 5000 ==\n"));
