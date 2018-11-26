//bring in your dependencies
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const db = require('./database/dbConfig')

//set up server with dependencies
const server = express();
server.use(express.json);
server.use(cors());
server.use(morgan());
server.use(helmet());

//make sure it works check
server.get('/', (req, res) => {
    console.log('testing to see if this works')
    res.send({ message: 'do not forget to add the correct url info' })
})

server.listen(9000, () => {
    console.log('\nrunning on port 9000\n');
})