const express = require('express');
const server = express();

// Imported Routers
const userRoute = require('./router/users');
const registerRoute = require('./router/register');
const loginRoute = require('./router/login');

server.use(express.json());

// Routes
server.use('/api/users', userRoute);
server.use('/api/register', registerRoute);
server.use('/api/login', loginRoute);

server.listen(8000, () => {
    console.log('===API===')
});