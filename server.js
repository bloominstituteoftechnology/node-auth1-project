const express = require('express')
server = express();
User = require('./models/user')
mongoose = require('mongoose')
bcrypt = require('bcrypt')

server.use(express.json())
server.get('/', (req, res) => {
    res.status(200).json({ api: running })
})
server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({ error: err.message }))
    // save the user to the db
})

server.post('/api/login', async function (req, res) {
    let { username, password } = req.body
    // console.log(password)
    // const hash = await bcrypt.hash(password, 12)
    User.findOne({ username })
        .then(result => {
            if (!result) {
                return res.status(401).send('Invalid username')
            } else if (!bcrypt.compareSync(password, result.password)) {
                // console.log("user pw", result[0].password, "login", hash)
                return res.status(401).send('Invalid username or password')
            } else {
                return res.status(200).send('Succesfully logged in!')
            }
        })
})

mongoose.connect('mongodb://localhost/cs10')
server.listen(8000, () => {
    console.log('\n *** API running on port 8000 ***\n')
})