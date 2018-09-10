const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const server = express();

//Middleware
server.use(helmet());
server.use(morgan("short"));
server.use(cors());

//Middleware^

PORT = 9000;

server.listen(PORT);
