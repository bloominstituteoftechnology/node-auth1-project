const express = require("express");
const morgan = require("morgan");
const mainRoutes = require("./api/mainRoutes");

const server = express();

server.use(express.json());
server.use(morgan("dev"));
server.use("/api", mainRoutes);

server.listen(8800, () =>
  console.log("\n === API listening on port 8800 === \n")
);
