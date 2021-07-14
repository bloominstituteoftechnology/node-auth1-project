const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

//import routers
const welcomeRouter = require("../welcome/welcome-router");
const weatherRouter = require("../weather/weather-router");

//global middleware
server.use(express.json(), helmet(), cors(), morgan("dev"));

<<<<<<< HEAD
//GET endpoints---->
=======
//GET
>>>>>>> 74e57fbc341d2cff17463e73224fc637189532cc
server.use("/", welcomeRouter);
server.use("/api/weather", weatherRouter);

//middleware for catch on routers
server.use((err, req, res) => {
  console.log(err);
  res.status(500).json({
    message: "500 error: Something went wrong",
  });
});

module.exports = server;
