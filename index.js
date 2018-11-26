const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig");

const server = express();

server.use(express.json());
server.use(cors);

server.listen(5500, () => console.log("\nrunning on Port 5500\n"));
