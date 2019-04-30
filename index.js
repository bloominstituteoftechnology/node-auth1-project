const express = require('express')
const bcrypt = require('bcrypt')
const Users = require('./data/dbHelpers')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.send('testing')
})

server.post('/api/register', (req, res) => {
    const user = req.body
    user.password = bcrypt.hashSync(user.password, 10)
    console.log(user)
    Users.addUser(user)
        .then(resp => res.json(resp))
        .catch(err => res.json(err))
})

server.get('/api/users', (req, res) => {
    Users.find()
        .then(response => res.json(response))
        .catch(err => res.json(err))
});

server.post('/api/login', (req, res) => {
    const {username, password} = req.body

    Users.findBy({username: username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.json({message: `Welcome ${user.username}`})
            } else res.json({err: 'You shall not pass'})
        })
        .catch(err => res.json(err))

})

server.listen(3300, () => console.log('Server up'))
