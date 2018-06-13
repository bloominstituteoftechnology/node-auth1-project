const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// const db = require('./data/db.js');

const server = express();

// db
//   .connectTo('starwars')
//   .then(() => console.log('\n... API Connected to Database ...\n'))
//   .catch(err => console.log('\n*** ERROR Connecting to Database ***\n', err));

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => res.send('API Running...'));

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
