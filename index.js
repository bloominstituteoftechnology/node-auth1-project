const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const server = express();

//Middleware
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(cors());

//Middleware^

server.get('/', (req, res) => {
  res.send("Server started")
})

PORT = 9000;

server.listen(PORT);
