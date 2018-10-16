const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    store: new KnexSessionStore({
        tablename: 'sesn',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    }),
    secret: 'The fluidity of objectivity is poetic in its nobility.',
    name: 'Mazarine',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 1
    },
}

const server = express();

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

function protected (req, res, next) {
    if (req.session && req.session.usrs_id) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
}

server.get('/api/usrs', protected, (req, res) => {
    db('usrs')
        .select('id', 'usrs_nme', 'usrs_pwd')
        .then(usrs => {
            res.json({ usrs_id: req.session.usrs_id, usrs });
        })
        .catch(err => {
            res.send(err);
        });
});

server.post('/api/rgtr', (req, res) => {
    const crds = req.body;
    
    const hash = bcrypt.hashSync(crds.usrs_pwd, 14);
    crds.usrs_pwd = hash;

    db('usrs')
        .insert(crds)
        .then(ids => {
        const id = ids[0];
        req.session.usrs_id = id;
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
                req.session.usrs_id = usridv.id;
                res.status(200).json({ welcome: usridv.usrs_nme });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.get('/api/lgo', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('Logout failure')
            } else {
                res.send('Logout successful')
            }
        });
    }
});

server.listen(5000, () => console.log('\nRunning on port 5000\n'));