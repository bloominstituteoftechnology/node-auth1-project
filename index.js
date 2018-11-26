const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');


const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan('dev'));

server.get('/', (req, res) => {
    res.status(200).json({message: 'Alive on post 3300'})
})


server.listen(3300, () => console.log("\nServer listening on port 3300\n"))
