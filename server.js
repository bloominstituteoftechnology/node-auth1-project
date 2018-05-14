const express = require('express');
const mongoose = require('mongoose');

const server = express();

server.use(express.json());

server.listen(8000, () => console.log('\n=== api running on port 8000===\n'));
