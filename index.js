const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

const db = require('./data/dbHelpers.js');
const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));

server.post('/api/register', (req,res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);
    db.insert('user')
        .then( ids => {
            res.status(201).json({ id: ids[0] });
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Failed to add user '});
        });
});


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});