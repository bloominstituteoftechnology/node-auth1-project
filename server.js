const express = require('express');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/cs10', () => {
    console.log('\n*** Connected to database **\n');
})
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err)
        });
})

server.listen(8000, () => {
    console.log('\n*** API running on port 8K **\n');
})