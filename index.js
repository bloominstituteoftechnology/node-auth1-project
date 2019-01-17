const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const logger = require('morgan');
const Joi = require('joi');

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

const loginRouter = require('./routes/loginRoutes');

const PORT = 4444;
const server = express();

server.use(
    express.json(),
    logger('dev')
);
server.use("/api",loginRouter)


server.listen(PORT, ()=> console.log(`server running on port: ${PORT}`));
