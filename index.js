const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const server = express()
const port = process.env.PORT || 4300;
const db = require("./database/helpers/userHelpers");

server.use(express.json())
server.use(cors());

server.get("/", (req, res) => {
  res.send("The Sever is alive");
});



server.listen(port, () => {
    console.log(`\n === WebAPI Auth-I Listening on: ${port} === \n`)
})