const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

//connect to db
mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => {
    console.log("\n=== connected to mongo ====\n");
  })
  .catch(err => console.log("error connecting to mongo", err));

//middleware
server.use(helmet());
server.use(express.json());

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
