const express = require('express');

const configureMiddleware = require('./configure-middleware.js');

const server = express();

configureMiddleware(server); // connecting all middlewares in 1 fell swoop

server.get("/", (req,res)=>{
    res.json(`Api is working`)
})
module.exports = server;
