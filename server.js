// import { isValid } from 'ipaddr.js';

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const User = require('./users/User');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const Restricted = require('./restricted/Restricted');

mongoose.connect('mongodb://localhost/authdb')
  .then(resp => console.log('connected to mongodb'))
  .catch(err => console.log(err));

server.use(express.json());
server.use(cors());
server.use(session({
  secret: 'You shall not pass!',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  secure: false,
  name: 'AuthAplicationProject',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  })
}));

function authenticate(req, res, next) {
  // const username = req.body.username;
  // const passBody = req.body.password;


  // User.find({ username: username })
  //   .then(user => {
  //     bcrypt.compare(passBody, user[0].password)
  //       .then(function (ifPass) {
  //         // res == true
  //         if (ifPass) {
  //           console.log('from if pass', user[0]._id)
  //           if (!user[0].session) {
  //             User.findByIdAndUpdate(user[0]._id, { session: 1 }, { new: true }, function (err, model) {
  //             })
  //           } else {
  //             User.findByIdAndUpdate(user[0]._id, { session: user[0].session + 1 }, { new: true }, function (err, model) {
  //             })
  //           }
  //           console.log('after update', user.session)
  //           next();
  //         } else {
  //           res.status(401).send('You shall not pass!!!');
  //         }
  //       }).catch(err => console.log(err))
  //   }).catch(err => console.log(err))
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send('You shall not pass!!');
  }
}





server.get('/api/users', authenticate, (req, res) => {
  User.find().then(users => {
    res.send(users)
  })
  // let query = User.find();

  // query.where('session').gt(0)
  //   .then(user => {
  //     console.log('line 78', user)
  //     if (user.length) {

  //       User.find()
  //         .then(resp => res.json(resp))
  //         .catch(err => console.log(err))
  //       console.log(user)
  //     } else {
  //       res.status(404).send('You shall not pass!');
  //     }
  //   })
  //   .catch(err => console.log(err))
})
server.get('/api/test', (req,res) => {
  User.find().then(users => {
    res.send(users)
  })
})



server.post('/api/register', function (req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});


server.get('/api/logout', (req, res) => {
  if (req.session) {
    console.log('Current Session logout, session:', req.session);
    req.session.destroy(function (err) {
      if (err) {
        res.send("error");
      } else {
        res.send('Goodbye');
      }
    });
  };





});

server.get('/api/', (req, res) => {
  // req.session.name = 'Abram';
  // res.send('have a cookie');
  // User.find().then(users => {
  //   req.session.name = users[0].username;
  //   res.json(users)
  // });
  if (req.session && req.session.username) {
    res.send(`Welcome back ${req.session.username}`)
  } else {
    res.send("Who are you, really? Don't lie to me!")
  }
});
// server.get('/greet', (req, res) => {
//   // req.session.name = 'Abram';
//   const { name } = req.session;
//   res.send(`hello ${name}`)
//   // User.find().then(users => res.json(users));
// });
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const passBody = req.body.password;

  const userInfo = { username, password };
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username;
            res.send("Have a cookie");

          } else {
            res.status(401).send('Invalid user-name')
          }
        });
      } else {
        res.status(404).send("Invalid PASSWORD")
      }
    }).catch(err => res.send(err))


});

// function 

// server.get('/api/restricted', (req, res) => {
//   if (req.session && req.session.username) {
//     next();
//   } else {
//     res.status(401).send('You shall not pass!!');
//   }
//     // let query = User.find();

//     // query.where('session').gt(0)
//     //   .then(user => {
//     //     console.log('line 78', user)
//     //     if (user.length) {

//     //       User.find()
//     //         .then(resp => res.json(resp))
//     //         .catch(err => console.log(err))
//     //       console.log(user)
//     //     } else {
//     //       res.status(404).send('You shall not pass!');
//     //     }
//     //   })
//     //   .catch(err => console.log(err))
//   });
  server.use('/api/restricted/', authenticate, Restricted);

//   * Write a piece of ** global ** middleware that ensures
//   * a user is logged in when accessing _any_ route
//     * prefixed by`/api/restricted/`.For instance,
//   * `/api/restricted/something`, `/api/restricted/other`,
//   * and`/api/restricted/a` should all be protected by the
//   * middleware; only logged in users should be able to access
//     * these routes.
// * Build a React application that implements components to register,
//   login and view a list of users.

server.listen(8000, () => console.log("server running on port 8000"));