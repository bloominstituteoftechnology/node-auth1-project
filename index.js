const express = require("express");
const cors = require("cors");
const bcrpyt = require("bcryptjs");
const server = express();
const loginRoutes = require('./routes/loginRoutes');

server.use(express.json(), cors());
server.use('/api', loginRoutes);

server.listen(9000, function() {
  console.log("API Running on Port 9000.");
});
