const express = require("express");
const helmt = require("helmet");
const logger = require("morgan");

module.exports = server => {
    server.use(express.json(),logger("tiny"), helmet())
};