const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const server = express();
const db = knex(knexConfig.development);
server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
	res.send("Its Alive!");
});

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
