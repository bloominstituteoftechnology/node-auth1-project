const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const MONGO_URI = require('./config');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

mongoose.connect(MONGO_URI)
  .then(_ => console.log("\n*** Connected to mLabs MongoDB ***\n"))
  .catch(err => console.log(err));

server.get('/', (req, res) => {
  res.status(200).json({ api: '--- API running ---'});
});

const port = 5000;
server.listen(port, () => console.log(`\n === Server is listening at ${port} ===\n`));