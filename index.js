const express = require('express');
const helmet = require('helmet');
const server = express();

server.use(express.json());
server.use(helmet());

const userRoutes = require('./routes/userRoutes');

server.use('/api/', userRoutes);

const port = 3600;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});