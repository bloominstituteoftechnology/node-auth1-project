const express = require("express");
const mongoose = require('mongoose');
const server = express();
const port = 5555;
const usersRouter = require("./routes/usersRouter");



server.use(express.json());

server.use("/", usersRouter);

mongoose.connect("mongodb://localhost/userdb")
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch(() => {
    console.log("Error can't connect to Mongo");
  })


server.get("/", (req, res) => {
  res.json("Home");
})



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
