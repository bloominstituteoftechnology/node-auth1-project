const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const logger = require('morgan');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(logger('dev'));

server.get('/', (req, res) => {
    res.send({API: "live"})
})

const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`Server listening on ${port}`));