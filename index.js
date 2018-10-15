const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile')
const db = knex(knexConfig.development);

const server = express();

server.use(express.json(), cors(), helmet());