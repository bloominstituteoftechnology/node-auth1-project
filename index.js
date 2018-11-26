const express = require("express");
const knex = require("knex");
const bcrpyt = require("bcrypt");

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();
const PORT = 3500;

server.use(express.json());

server.listen(PORT, () => console.log(`PORT ${PORT}`));
