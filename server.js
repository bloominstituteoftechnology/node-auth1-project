const express = require('express');

const server = express();
server.use(express.json());

//route handlers
// const projectsRouter = require('./routes/projectsRouter.js');

// //routers
// server.use('/api/projects', projectsRouter);

module.exports = server;