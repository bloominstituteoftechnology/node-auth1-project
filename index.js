const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const db = require("./db/helpers");

const server = express();

server.use(express.json());
server.use(helmet());



const port = 9000;
server.listen(
  port,
  console.log(`\n ===> Server is running on port:${port} <=== \n`)
);
