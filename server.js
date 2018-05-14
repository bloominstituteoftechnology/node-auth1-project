const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/userauthdb')
.then(conn => {
    console.log(`\n=== connected to database ===\n`);
})
.catch(err => {
    console.log(`error connecting to database: ${err}`);
})

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n=== API running on port ${port} ===\n`));