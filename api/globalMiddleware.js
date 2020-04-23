const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const middlewareComponents = [express.json(), helmet(), cors()];

module.exports = (server) => {
  server.use(middlewareComponents);
};
