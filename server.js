const express = require ('express');
const authnRouter = require('./authN /authnRouter');
const getuserRouter = require('./authN /getuserRouter');


const server = express()
server.use(express.json())
server.use ('/authn', authnRouter);
server.use('/getuser', getuserRouter);

module.exports = server;