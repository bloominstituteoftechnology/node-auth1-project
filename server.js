const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db');

const server = express();

//middleware
server.use(express.json());

function sendError(code, message, error) {
    return {
        code,
        message,
        errMsg: error
    }
}

//Endpoint for GET
server.get('/', (req, res) => {
    res.status(200).send('Welcome!')
});

server.get('/users', async (req, res, next) => {
    try {
        const response = await (db.get());
        res.status(200).json(response);
    } catch(error) {
        next(sendError(500, 'Failed to retrieve users information.', error.message))
    }
})

server.get('/users/:id', async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const response = await (db.get(id));
        res.status(200).json(response);
    } catch(error) {
        next(sendError(500, 'Failed to retrieve users information.', error.message))
    }
})

server.post('/users/register', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return next(sendError(401, 'Failed to save user login to database.', 'Please provide username and password.'))
    }
    const hash = bcrypt.hashSync(req.body.password, 14);
    const newUser = {
        ...req.body,
        password: hash
    }
    try {
        const response = await (db.post(newUser));
        res.status(201).json(response);
    } catch(error) {
        next(sendError(500, 'Failed to save user login to database.', error.message))
    }
})

server.post('/users/login', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return next(sendError(401, 'Failed to login.', 'Please provide username and password.'))
    }
    try {
        const response = await (db.login(req.body.username));
        const match = bcrypt.compareSync(String(req.body.password), response);
        return match 
        ? res.status(200).send('Login successfully')
        : next(sendError(401, 'Failed to login.', 'Incorect credentials.'));
        
    } catch(error) {
        next(sendError(500, 'Failed to login.', error.message))
    }
})

server.use((error, req, res, next) => {
    res.status(error.code).send({message: error.message, error: error.errMsg})
})

const port = 8000;
server.listen(port, console.log(`=== Web API listening at port ${port} ===`));