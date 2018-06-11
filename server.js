const express = require('express')
server = express();
userModel = require('./models/user')
mongoose = require('mongoose')

server.use(express.json())
server.get('/', (req, res) => {
    res.status(200).json({ api: running })
})
server.post('/api/register', (req, res) => {
    userModel.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({ error: err.message }))
    // save the user to the db
})

mongoose.connect('mongodb://localhost/cs10')
server.listen(8000, () => {
    console.log('\n *** API running on port 8000 ***\n')
})