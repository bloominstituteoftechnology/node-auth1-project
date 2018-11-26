const knex = require('knex');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bcrypt = require('bcryptjs');


const server = express();

server.use(express.json());








server.listen(8000, () => console.log('\n====Server running on port 8000====\n'));
