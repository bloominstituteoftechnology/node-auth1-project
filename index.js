const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

//Using Sessions & Cookies for FSW13 w/ Luis Hernandez (near 0:23:15)
const session = require('express-session'); // added this library
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./dbConfig.js');

const server = express();
// Session is like a storage

//*** Day 2 session configuration ***//
//Using Sessions & Cookies for FSW13 w/ Luis Hernandez (near 0:24:50)
const sessionConfig = {
    name: 'Kakarot', // defaults to connect.sid when there is a vulnerablity
    secret: 'The secret is....',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1, // Day
        secure: false, // only saves the cookies over http(s) or when connection is secure. Server will not send back a cookie over http.
    }, // 1 day/milliseconds
    httpOnly: true, // Only JS code can access cookies.
    resave: false,
    saveUninitialized: false, // laws
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};
server.use(session(sessionConfig));

server.use(express.json());
server.use(helmet());
server.use(cors());

//*** Day 2 Makes sure you are logged in ***//
function protection(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({
            message: 'Log in or else...'
        });
    }
}


server.get('/', (req, res) => {
  res.send('This sshizz working?');
});

//################################### POST ########################################//

//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:02:00)
server.post('/register', (req, res) => {
  const credentials = req.body;
  // hash the password here
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  // then save the user

  db('users')
  .insert(credentials)
  .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
  })
  .catch(err => {
      res.status(500).send(err);   
  })
});
//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:22:00)
// Always send as a post because you don't wanna send login information as part of the URL becuase people can see that

//Using Sessions & Cookies for FSW13 w/ Luis Hernandez (near 0:35:40)
// On Login any information we want stored in this session we just add it to (req.session) object which was created by the express session library.
server.post('/login', (req ,res) => {
  const credentials = req.body;

  db('users')
  .where({username: credentials.username})
  .first()
  .then(user => {
    //Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:18)
    // (near 1:24) CompareSync is comparing the 2 password the user sent to he hash password in the database
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
          //Using Sessions & Cookies for FSW13 w/ Luis Hernandez (near 0:33:38)
          req.session.username = user.username
          res.status(200).json(`Started from the bottom now you here ${user.username}!`);
      } else {
          res.status(401).json({ message: `That's wrong dude....`});
      }
  })
  .catch(err => res.status(500).send(err))

});


//################################### GET ########################################//

//*** Day 2 Logout ***//
server.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send(`You're stuck here!!!`);
            } else {
                res.send(`Until next time...hahahahahaha!`);
            }
        });
    }
});


// Protected this route because only authneticated users should see this
//Introduction to Authentication for FSW13 w/ Luis Hernandez (near 1:03:00)
server.get('/users', protection, (req, res) => {
  db('users')
  // added the password field in just to see if it was hashed...don't forget to takeout lol
  .select('id', 'username')
  .then(users => {
      res.json(users);
  })
  .catch(err => res.send(err));
});

const port = 9001;
server.listen(port, () => console.log(`******* Running on power level ${port} *******`));

// NEVER STORE PLAIN-TEXT Passwords