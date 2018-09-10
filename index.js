const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const usersRoutes = require("./routes/usersRoutes");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

server.use("/api/users", usersRoutes);

const port = 8000;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port}===`);
});
