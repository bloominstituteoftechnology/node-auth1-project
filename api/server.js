const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
// npm i express helmet morgan
// yarn add express helmet morgan

// const gatekeeper = require('../gatekeeper/gatekeeperMiddleware.js');

const server = express();

// configure middleware
// ORDER MATTERS! they will execute top to bottom
server.use(express.json()); // built in
server.use(helmet()); // third party
server.use(morgan('short')); // third party

// custom
// server.use(gatekeeper); // using middleware globally

// configure endpoints (route handlers are middleware!!)
server.get('/', (req, res) => {
  res.status(200).json({ api: 'running' });
});

// server.get('/secret', gatekeeper, (req, res) => {
//   res.send(req.welcomeMessage);
// });

module.exports = server;
