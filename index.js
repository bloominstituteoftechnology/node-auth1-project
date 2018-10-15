const express = require("express");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());

const usersRoutes = require("./users/usersRoutes.js");

server.use("/api", usersRoutes);

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
