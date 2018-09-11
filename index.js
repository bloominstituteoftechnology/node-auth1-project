const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const restrictedRoutes = require("./routes/restrictedRoutes");
const middleware = require("./middleware");

const server = express();

server.use(express.json());
server.use(cors({ credentials: true, origin: "http://localhost:8080" }));
server.use(helmet());
server.use(morgan("dev"));
server.use(
	session({
		secret: "lauren is the coolest!!!",
		cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
		httpOnly: true,
		secure: true,
		resave: false,
		saveUninitialized: false,
	}),
);

server.use("/api", authRoutes);
server.use("/api/restricted", middleware.isLoggedIn, restrictedRoutes);

const port = 8000;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port}===`);
});
