const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

module.exports = server => {
    server.use(express.json(),logger("tiny"), helmet())
};