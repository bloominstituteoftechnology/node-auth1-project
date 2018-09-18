const express = require('express');
const server = express();
const knex = require('knex');
const dBConfig = require('./knexfile');
//Middleware
server.use(express.json());

const db = knex(dBConfig.development);