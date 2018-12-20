const express = require("express");

const configureMiddleware = require("./config/middleware");
const db = require("./data/dbConfig");
const bcyrpt = require("bcryptjs");

// Create server
const server = express();
const PORT = 3000;

// Middleware
configureMiddleware(server);

server.get("/", (req, res) => {
  res.send("🔑 🔑 🔑");
});

// Start listening
server.listen(PORT, () => {
  console.log(`\n=== API Listening on http://localhost:${PORT} ===\n`);
});
