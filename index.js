const bcrypt = require('bcryptjs'); // adds hash library

const db = require('./database/dbConfig.js');

const server = require('./api/server.js');

// [GET] /
// test endpoint
server.get('/', (req, res) => {
    res.send('Server running');
});

// [GET] /api/restricted/test
// test restricted global middleware
server.get('/api/restricted/test', (req, res) => {
    res.send('You must be logged in since you can see me!')
});

// [GET] /api/restricted/users
// return all usernames with id
server.get('/api/restricted/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            if (users.length) {
                res.status(200).json(users);
            } else {
                res.status(200).json({ message: 'No users in database' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving users ' });
        });
});

// [POST] /api/register
// create account with username and password, fails if username already exists
server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(id => {
            res.status(201).json({ id: id[0] });
        })
        .catch(err => {
            if (err.errno === 19) {
                res.status(500).json({ message: 'Username already exists' });
            } else {
                res.status(500).json({ message: 'Error creating new account' });
            }
        });
});

// [POST] /api/login
// user login, fails if username does not exist or password incorrect
server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.userId = user.id;
                res.status(200).json({ message: 'Correct username and password, good job!' });
            } else {
                res.status(401).json({ message: 'Failed authentication, username does not exist or password is incorrect' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error occurred during login' });
        })


});

const port = 8765;
server.listen(port, () => console.log(`\nServer listening on port ${port}\n`));