// const express = require('express');
// const mongoose = require('mongoose');
// const User = require('./users/User');
// mongoose.connect('mongodb://localhost/authdb')
// .then(res => {
//     console.log(('\n=== Connected to Mongo ===\n'));
// })
// .catch(err => {
//     console.log('\n=== Error connecting to Mong ===\n', err);
// });

// const server = express();

// server.use(express.json());

// function authCred(req,res,next) {
//     if (req.body.password === 'test') {
//         next();
//     } else {
//         res.status(401).send('You shall not pass');
//     };
//     User
// };
// // server.get('/api/users', (req,res) => {

// // })
// server.get('/', (req,res) => {
//     res.send({route: '/', message: req.message});
// });



// server.post('/api/register', (req,res) => {
//     const user = new User(req.body);
//     user.save().then(user => res.status(201).send(user))
//     .catch(err => res.status(500).send(err));
// });

// server.post('/api/login', authCred, (req,res) => {
//     res.send('Logged in');
// });

// server.listen(7000, () => console.log.apply('\n=== api is running on port 7000===\n'));

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const User = require('./users/User');
const bcrypt = require('bcrypt');


mongoose.connect('mongodb://localhost/authdb')
  .then(resp => console.log('connected to mongodb'))
  .catch(err => console.log(err));

server.use(express.json());


function authenticate(req, res, next) {
  const username = req.body.username;
  const passBody = req.body.password;


  User.find({ username: username })
    .then(user => {
      bcrypt.compare(passBody, user[0].password)
        .then(function (ifPass) {
          // res == true
          if (ifPass) {
            console.log('from if pass', user[0]._id)
            if (!user[0].session) {
              User.findByIdAndUpdate(user[0]._id, { session: 1 }, { new: true }, function (err, model) {
              })
            } else {
              User.findByIdAndUpdate(user[0]._id, { session: user[0].session + 1 }, { new: true }, function (err, model) {
              })
            }
            console.log('after update', user.session)
            next();
          } else {
            res.status(401).send('You shall not pass!!!');
          }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}


server.get('/api/users', (req, res) => {
  User.find()
    .then(resp => res.json(resp))
    .catch(err => console.log(err))
})



server.post('/api/register', function (req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post('/api/login', authenticate, (req, res) => {
  res.send('Logged in');
});




server.listen(8000, () => console.log("server running on port 8000"));