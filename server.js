const express = require('express');
const apiRoutes = require('./api/apiRoutes');

const server = express();
server.use(express.json());
server.use('/api', apiRoutes);

server.listen(8000, () => console.log('API is running on port 8000'));