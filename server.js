const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig');

const server = express();

server.use(express.json());
server.use(cors({}));
server.use(helmet());

//ENDPOINTS

//create a user and save to db, hashing password
server.post('/api/register', (req, res) => {
  let { username, password }  = req.body;

  if(!username || !password) return res
                                      .status(422)
                                      .json({
                                        message: 'A username and password is required for this operation!'
                                      });
  const hash = bcrypt.hashSync(password, 16);
  password = hash;
  db('users')
    .insert({ username, password })
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).json(err));
});

//authenticate passed in user data, message 'You shall not pass!' on failure
//tuesday: create a new session and send back cookie
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res
                                      .status(422)
                                      .json({
                                        message: 'A username and password is required for this operation!'
                                      });
  db('users')
    .where({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)){
        res.status(200).json({ message: 'Logged In' });
      }else if(!user){
        res.status(404).json({ message: 'Invalid Username' });
      }else{
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

//if the user is logged in, send user array, if not send the shall not pass message
//verify hashing
server.get('/api/users', (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

const PORT = 8000;
server.listen(PORT, () => console.log(`SERVER = PORT: ${PORT} = LISTENING`));
