const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const bcrypt = require('bcryptjs'); // 
const db = require('./database/dbConfig.js');

const server = express();

//==============configures the session ====================
const sessionConfig = {
    name: 'mysession',
    secret: 'thisismysecretandknowonecanknowaboutityoubetternottell',
    cookie: {
        magAge: 1000 * 60 * 10,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore ({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        cleareInterval: 1000 * 60 * 60,
    })
}

//===========tells server what to do===================
server.use(session(sessionConfig))
server.use(express.json());
server.use(cors());


//=========== middleware ==============================
function protected (req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({you: 'shall not pass'})
    }
}
//===========end points================================

//POST ENDPOINTS
server.post('/api/login', (req,res) => {
    const creds = req.body;

    db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        req.session.user = user.id;
        res.status(200).json({ message: 'you have logged in successfuly' });
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: 'You have entered the wrong login credentials' });
      }
    })
    .catch(err => res.json(err));
});


server.post('/api/register', (req,res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json(ids)
    })
    .catch(error => res.status(500).json({message: '***Error making user***', error}) )
})

//============= GET ENDPOINTS ===============
server.get('/api/users', protected, (req, res) => {
    db('users')
    .select('id','username','password')
    .then(users => {
        res.json(users);
    })
    .catch(error => res.status(500).json(error))
})

server.get('/api/me', protected, (req, res) => {
    db('users')
    .select('id', 'username','password')
    .where({ id: req.session.user})
    .first()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err))
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('you can never leave');
        } else {
          res.send('bye');
        }
      });
    } else {
      res.end();
    }
  });
  
server.get('/', (req, res) => {
    res.send('Its Alive!');
  });

server.listen(8000, () => console.log('\nrunning on port 8000\n'));