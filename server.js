const express = require('express');
const mongoose = require ('mongoose'); 
const bodyParser = require ('body-parser'); 
const session = require ('expess-session'); 

const User = require ('./auth/UserModel'); 

mongoose.connect('mongodb://localhost/authIDb')
    .then(()=> {
    console.log('\n*** Connected to database ***\n');
});

const server = express(); 

server.use(express.json()); 
server.use(bodyParser.json()); 
// server.use(session({
//     secret: '$2b$12$UyBPjlgZlmPDyNUyxeQazuAyA5stlTkXBQrkaRZlRCLY5glkqmPBi'
// }));

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...'});
}); 

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err); 
        });
}); 


server.post('/api/login', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(200).json({ api: 'Logged in' }); 
        })
        .catch(error => {
            res.status(401).json({ error: 'You shall not pass!' });
        });
    });

server.get('/api/users', (req, res) => {
    res.status(200).json(res); 
})


server.listen(5000, () => {
    console.log('\n*** API running on port 5000 ***\n'); 
}); 