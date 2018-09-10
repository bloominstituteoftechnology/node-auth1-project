const express = require('express');
var morgan = require('morgan');

const server = express();

server.use(express.json());
server.use(morgan('dev'));

server.get('/', (req, res) => {
  res.send('Sup fam');
});

server.listen(7000, () => console.log('ya made it to port 7000 mon'));
