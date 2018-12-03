const express = require('express');
const bcrypt = require('bcryptjs');
const server = express();

const db = require('./data/helpers');

server.use(express.json());


// REGISTER EndpointZ
server.post('/api/register', async(req, res) => {
    // get form input values
    const registrationData = req.body;

    // validate data
    if (!registrationData.username || !registrationData.password) {
        return res
            .status(400)
            .json({ message: 'Please enter a valid username and password.' });
    }

    // Check if user already exists
    try {
        const userInDb = await db.getByUsername(registrationData.username);
        if (userInDb) {
            res.status(422).json({ message: 'That username already exists.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'caught' });
    }

    // generate a hash
    const hash = bcrypt.hashSync(registrationData.password, 10);

    // replace plain text with hash
    registrationData.password = hash;

    // save to db
    try {
        const newUserId = await db.addUser(registrationData);
        res.status(201).json(newUserId);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong with the request.' });
    }
});


// LOGIN EndP01ntZ
server.post('/api/login', async(req, res) => {
    // get form input values
    const loginData = req.body;

    // get user
    try {
        const user = await db.getByUsername(loginData.username);
        if (user && bcrypt.compareSync(loginData.password, user.password)) {
            req.session.userId = user.id;
            res.status(200).json({ message: 'Logged in.' });
        } else {
            res
                .status(401)
                .json({ message: 'The username or password does not match.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong, pal.' });
    }
});



// LOGOUT Endp0intz
server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            return err ?
                res.json({ message: 'Something went wrong', err }) :
                res.status(200).json({ message: 'You are now logged out.' });
        });
    }
});


server.get('/', (req, res) => {
    res.send('Hi Sir!');
});



server.listen(3300, () => console.log('Server started on port 3300'));