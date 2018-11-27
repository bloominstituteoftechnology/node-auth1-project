const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
    name: "monkey",
    secret: "wq3or8sbo98ew092j3rbvn",
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes
        secure: false // are we using https?
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: "sessions",
        sidfieldname: "sid",
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60 // 1 hour
    })
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

const port = 9000;
const rounds = 14;

function protected(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: "You shall not pass!" });
    }
}

server.get("/", (req, res) => {
    res.send('Connected!');
});

server.post("/api/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, rounds);
    creds.password = hash;

    db("users")
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user) {
                res.status(409).json({ message: "Username in use" });
            } else {
                db("users")
                    .insert(creds)
                    .then(ids => {
                        res.status(201).json(ids);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

server.post("/api/login", (req, res) => {
    const creds = req.body;

    db("users")
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                // Start session, cookie
                req.session.userId = user.id;
                res.status(200).json({ message: "Welcome!" });
            } else {
                res.status(401).json({ message: "You shall not pass!" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

server.get("/api/users", protected, (req, res) => {
    db("users")
        .select('id', 'username', 'password')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

server.get("/api/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send("You're stuck");
            } else {
                res.send("Bye!");
            }
        });
    } else {
        res.end();
    }
});

server.listen(port, () => console.log(`Server live on port ${port}`));