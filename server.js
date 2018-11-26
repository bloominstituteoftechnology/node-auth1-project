
const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const app = express();

app.use(express.json());

module.exports = app;   