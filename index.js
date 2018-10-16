const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const server = express();
const loginRoutes = require('./routes/loginRoutes');
const restrictedRoutes = require('./routes/restrictedRoutes');

server.use(express.json(), cors(), helmet());
server.use('/api', loginRoutes);
server.use('/api/restricted', restrictedRoutes);

server.listen(9000, function() {
  console.log("API Running on Port 9000.");
});
