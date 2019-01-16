const express = require("express");
const knex = require("knex");
const cors = require("cors");

const dbConfig = require("./knexfile");
const db = knex(dbConfig.development);

const PORT = 8000;

server = express();
server.use(express.json());

server.listen(PORT, () => {
   console.log(`server running on port ${PORT}`)
});