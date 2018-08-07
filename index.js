const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());
