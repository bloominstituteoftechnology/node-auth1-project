const express = require('express');
const cors = require('cors');

const port = 3300;
const server = express();

server.use(express.json());
server.use(cors());
server.use(routes);

server.get('/', (req, res) => {
    res.send('Hello!')
  })

server.listen(port, () => console.log('API running...'))