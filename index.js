//create express server
const express = require('express');
const server = express();

//built-in & 3rd party middleware
server.use(express.json());
const cors = require('cors');
server.use(cors());

//Configure express-session middleware
const session = require('express-session');
server.use(session({
    name: 'notsession',
    secret: 'this is not a secret',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
}));

//Access route handlers/endpoints
const usersRoutes = require('./Routers/usersRouter')
server.use('/api/', usersRoutes);

//endpoint to test server
server.get('/', (req,res) =>{
    res.json("Success");
})

//listener
const PORT = 4000;
server.listen(PORT, ()=>{
    console.log(`Server up and running on port ${PORT}`);
})