const express = require('express');
const server = express();

const userRoute = require('./router/users');

server.use(express.json());

server.use('/users', userRoute);

server.listen(8000, () => {
    console.log('===API===')
});