//? s8  import
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');



//? s9 export
module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
};
