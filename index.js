const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig');



const server = express();
server.use(express.json());

                                                                                                                                
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.     


server.post('/api/register', (req,res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(error => json(error))
})


server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)){
        res.status(200).json({message: 'Logged in'})
      } else {
        res.status(401).json({message: 'you shall not pass!'})
      }
    })
    .catch(error => res.json(error))
})



server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(error => res.send(error))
})


server.get('/', (req, res) => {
  res.send('It\'s Alive!');
});

const port = 8000;
server.listen(port, () => console.log(`server is running on ${port}`))