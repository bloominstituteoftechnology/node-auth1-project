const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

server.get('/api/usrs', (req, res) => {
    db('usrs')
        .select('id', 'usrs_nme', 'usrs_pwd')
        .then(usrs => {
            res.json(usrs);
        })
        .catch(err => {
            res.send(err);
        })
});

server.post('/api/rgtr', (req, res) => {
    const crds = req.body;
    
    const hash = bcrypt.hashSync(crds.usrs_pwd, 14);
    crds.usrs_pwd = hash;

    db('usrs')
        .insert(crds)
        .then(ids => {
        const id = ids[0];
        res.status(201).json({ nwId: id });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/lgn', (req, res) => {
    const crds = req.body;

    db('usrs')
        .where({ usrs_nme: crds.usrs_nme })
        .first()
        .then(usridv => {
            if (usridv && bcrypt.compareSync(crds.usrs_pwd, usridv.usrs_pwd)) {
                res.status(200).json({ welcome: usridv.usrs_nme });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.listen(5000, () => console.log('\nRunning on port 5000\n'));