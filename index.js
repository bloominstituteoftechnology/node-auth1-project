const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const restrictedRoutes = require("./routes/restrictedRoutes");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(
	session({
		secret: "lauren is cool",
		cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
		httpOnlly: true,
		secure: true,
		resave: false,
		saveUninitialized: false,
	}),
);

server.use("/api", authRoutes);
server.use("/api/restricted", isLoggedIn, restrictedRoutes);

function isLoggedIn(req, res, next) {
	if (req.session && req.session.name) {
		next();
	} else {
		next(
			res.status(403).json({ message: "Invalid User Name or Password" }),
		);
	}
}
const port = 8000;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port}===`);
});
