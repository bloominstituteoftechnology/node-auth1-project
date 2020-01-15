const express = require("express");
// const db = require("../../data/dbconfig");
// SERVER
const server = express();

// SERVER API
server.get("/", (req, res) => {
  res.status(200).json({
    message: "web auth1 project api says hi."
  });
});
// // SERVER GET ANOTHER_BRANCH
server.get("/branchName", async (req, res) => {
  // bringing in a database file aqui.
  const branchName = await db("ANOTHER_BRANCH");
  try {
    res.status(200).json({
      message: "welcome to a new branch"
    });
  } catch (error) {
    res.status(500).json({ message: "ay dios mios" });
  }
});

module.exports = server;
