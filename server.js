const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());
server.use(morgan('dev'));

server.get('/', (req, res) => {
  res.send('Sup fam');
});

server.listen(7000, () => console.log('ya made it to port 7000 mon'));
