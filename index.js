const express = require('express');

const server = express();
const port = 8080;

// test api
server.get('/', (_, res) => res.send('API is running...'));

server.listen(port, () => console.log(`Listening to port: ${port}`));
