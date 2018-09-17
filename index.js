const express = require(express);
const helmet = require(helmet);
const bcrypt = require(bcryptjs);
const cors = require("cors");

const db = require("./db/helpers");

server.use(express.json());
server.use(helmet());
