
const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../db/dbConfig');

const router = express.Router();

router.post('/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);

    creds.password = hash;

    db('usernames')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/login', (req, res) => {
    const creds = req.body;

    db('usernames')
        .where({ username: creds.username })
        .first().then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).send('Logged in');
            } else {
                res.status(401).json({ error: "You shall not pass!"})
            }
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;

// router.post('/login', (req, res) => {
//     const project = req.body;

//     db.insert(project)
//         .into('projects')
//         .then(id => {
//         res.status(201).json(id);
//         })
//         .catch(err => res.status(500).json({ errorMessage: 'There was an error while saving the project to the database. Maybe that record already exists.' }));
// });

// server.get('/users', (req, res) => {
//     db.find()
//     .then(posts => {
//         res.status(200).json(posts);
//     })
//     .catch(err => {
//         console.error('error', err);

//         res.status(500).json({ error: 'The users information could not be retrieved.' });
//     });
// });