/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
// My mLabs DB <3
const MONGO_URI = require('./config');

/* Server and General Middleware */
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

/* Mongoose */
mongoose.connect(MONGO_URI)
  .then(_ => console.log("\n*** Connected to mLabs MongoDB ***\n"))
  .catch(err => console.log(err));

/* Routes */
server.get('/', (req, res) => {
  res.status(200).json({ api: '--- API running ---'});
});

/* Server Start */
const port = 5000;
server.listen(port, () => console.log(`\n === Server is listening at ${port} ===\n`));