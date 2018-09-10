"use strict";
const express = require("express");
const server = express();
const PORT = 7000;

const configureMiddleware = require("./middleware/middleware.js");
configureMiddleware(server);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
