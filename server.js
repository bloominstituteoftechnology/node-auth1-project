const express = require('express');
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

server.post('/users', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return next(sendError(401, 'Failed to save user login to database.', 'Please provide username and password.'))
    }

    try {
        const response = await (db.post(req.body));
        res.status(201).json(response);
    } catch(error) {
        next(sendError(500, 'Failed to save user login to database.', error.message))
    }
})

server.use((error, req, res, next) => {
    res.status(error.code).send({message: error.message, error: error.errMsg})
})

const port = 8000;
server.listen(port, console.log(`=== Web API listening at port ${port} ===`));