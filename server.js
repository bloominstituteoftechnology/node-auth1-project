const express = require('express');
const apiRoutes = require('./api/apiRoutes');
const session = require('express-session');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());
server.use(session({
    secret: 'Ceir7ohfeecaiphohmiebaingewahshaijuthohbeviefiebai',
    resave: false,
    saveUninitialized: true
}));
server.use('/api', apiRoutes);

server.listen(8000, () => console.log('API is running on port 8000'));