const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// const cookieParser = require("cookie-parser");

module.exports = server => {
	server.use(helmet());
	server.use(express.json()); // "body-parser"
	// server.use(cookieParser()); // "cookie-parser"
	server.use(cors());
};
