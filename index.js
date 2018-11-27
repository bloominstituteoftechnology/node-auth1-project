const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);



const db = require('./database/dbConfig.js');
const server = express();

const sessionConfig = {
    name: 'Monster',
    secret: 'hunter',
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minutes
      secure: false // only set it over https; in production you want this true
    },
    httpOnly: true, //no js can touch this cookie
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
}

  server.use(session(sessionConfig));
server.use(express.json());
server.use(morgan());
server.use(helmet());


server.get('/', (req, res) => {
    res.send('My server can respond');
});


//==========CREATE A NEW USER(REGISTER)=========
server.post('/api/register', (req, res) => {
    //grabs username and password from body
        const creds = req.body;

    // generate hash from the user's password
        const hash = bcrypt.hashSync(creds.password, 14);

    //override the user.password with the hash
        creds.password = hash;

    //save the user to the database
        db('users').insert(creds)
        .then(ids => {
        res.status(201).json(ids);
        })
        .catch(err => res.status(401).json(err));
});

//==========LOGIN A USER==========
server.post('/api/login', (req, res) => {
    //grabs username and password from body
        const creds = req.body;
    db('users').where({ username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.userId = user.id;
         //paswords match and username exists
            res.status(200).json({message: 'Logged in'});
    
    
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
        
    }).catch(err => res.status(401).json({message: "You shall not pass!"}, err))
});

function protected(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({message: "You shall not pass!"})
    }
}
//==========GET USER INFO==========
server.get('/api/users', protected,  (req, res) => {
    db('users')
      .select('id', 'username') //to get password add ", 'password' "
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(401).json({message: 'You shall not pass!'}));
});
 
server.get('/api/logout', (req, res) => {
    if(req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('you can never leave');
        } else {
          res.send('bye');
        }
      })
    }
  })

server.listen(8000, () => console.log('\n====Server running on port 8000====\n'));
