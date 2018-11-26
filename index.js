const express = require("express");

const db = require("./database/dbConfig.js");

const server = express();

port = 3000;

server.listen(port, () => console.log(`\n listening on port: ${port} \n`));
