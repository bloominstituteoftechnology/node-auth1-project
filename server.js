const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./UserModel.js'); //connecting with schema

//making sure mongoose works
mongoose.connect('mongodb://localhost/temp').then(() => {
  console.log('\n*** Connected to database ***\n');
})
  .catch(err => {
    console.log('error connecting to database');
});

const server = express();
server.use(express.json());

//session
const sessionConfig = {
    secret: 'one does not simply walk into mordor',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000 //one day in milliseconds
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname', //change from default so hackers don't know you're using express
  store: new MongoStore ({
    url: "mongodb://localhost/session",
    ttl: 60 * 10
  })
};

server.use(session(sessionConfig));

//middleware
function auth(req, res, next) {
  if(req.session && req.session.username) {
    next();
  } else {
    res.status(401).json('You shall not pass!');
  }
};
// restrict access to /api/restricted
const restrictAccess = (req, res, next) => {
  if (req.path.startsWith('/api/restricted')) {
    if (req.session && req.session.userId) next ();
    else
      res.status(422).json('You must be logged in to see this.');
  } else {
    next();
  }
};

server.use(restrictAccess);

//GET endpoint for /api/users that will only show array of users if logged in. Verify password is hashed before saved.
server.get('/api/users', auth, (req, res) => {
    User.find()
      .then(users => {
	res.status(200).json(users);
      })
      .catch(users => {
        res.status(500).json(err);
      });
});

//POST endpoint creating user inside body
//hashing takes place in pre-function located in schema
server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//POST endpoint using credentials to login the user
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })//query middleware
    .then(user => {
      if(user) {
       user.isPasswordValid(password)
	.then(passwordsMatch => {
	  if(passwordsMatch) {
	    req.session.username = user.username;
            res.status(201).json('have a cookie!');
          } else {
	    res.status(401).json('invalid credentials');
	  }
	})
    .catch(err => {
      res.send('error comparing passwords');
    });
} else {
  res.status(401).json('invalid credentials');
}
    })
    .catch(err => {
      res.send(err);
    });
});
      

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
	if(err) {
	  res.send('There was an error logging out');
	} else {
	  res.send('Logged out');
	}
      });
    }
  });

    server.listen(8000, () => console.log('\n*** API running on port 8000 ***\n'));
