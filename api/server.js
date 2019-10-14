const express = require("express");
const helmet = require("helmet");


const server = express();

server.use(helmet());
server.use(express.json());



module.exports = server;