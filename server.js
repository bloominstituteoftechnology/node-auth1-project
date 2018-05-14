const express = require('express');
const mongoose = require('mongoose');

const user = ('./users/User.js')

mongoose
    .connect('mongodb://localhost/authenticatedb')
    .then(conn => {
        console.log('\n== connected to mongoDB')
    })
    .catch(err => {
        console.log('error connecting to mongo', err)
    })

const server = express();

authen = (req, res, next) => {
    next();
}

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Api Running")
})

server.get('/api/users', authen, (req, res) => {

})

server.post('/api/register', (req, res) => {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(200).send(user))
        .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    
})

const port = 5000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`));