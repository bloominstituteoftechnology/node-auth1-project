const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const server = express();

server.use(express.json());

server.use(morgan('dev'));



server.get('/', (req, res)=> {
	res.send('hELLO... teSTING');

});




server.listen(4002, ()=>  console.log('API listening on port 4002'));
