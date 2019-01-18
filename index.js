const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const authenticate = require('./middleware/authenticate');
const db = require('./data/dbHelpers.js');

const restrictedRouter = require('./routers/restrictedRouter');

const server = express();
const PORT = 5000;

server.use(express.json());
server.use(session({
    name: 'notsession',
    secret: 'Monkey see, monkey do',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}));

server.use('/api/restricted', restrictedRouter);

server.get('/', (req, res) => {
    res.send('API is Active');
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);
    db.insertUser(user)
        .then(ids => {
            res.status(201).json({ id: ids[0] });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

server.post('/api/login', (req, res) => {
    const user = req.body;
    db.findByUsername(user.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
                req.session.userId = users[0].id;
                res.json({info: "Logged in"});
            } else {
                res.status(404).json({err: "Invalid username or password"});
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

server.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send({err: 'Failed to logout'});
    } else {
      res.send({info: 'Logged out'});
    }
  });
});

server.get('/api/users', authenticate, (req, res) => {
    db.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

server.listen(PORT, () => console.log(`\nServer running on port ${PORT}\n`));