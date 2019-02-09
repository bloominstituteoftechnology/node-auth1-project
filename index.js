const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan')
const cors = require('cors')

const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig.js')

const PORT = 5050;

const server = express();
server.use(express.json()); 
server.use(cors('localhost:5050'))
server.use(
            helmet(),
            morgan('dev'),
          );
//endpoints

server.get('/api/users',(req, res) =>{
  db('users')
  .select('id', 'username')
  .then(users => {
    res.json(users);
  })
  .catch(err => res.send(err));
})

server.post("/api/login",(req, res) =>{
  const user = req.body;
  db("users")
    .where("username", user.username)
    .then(users =>{
    if( users.length && 
        bcrypt.compareSync(user.password, users[0].password)
    ){
      res.status(202).send("user logged in");
    }
    else{
      res.status(401).send("invalid username or password");
    }
    })
    .catch(err =>{
      res.status(500).send(err);
    })
})

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);
  db("users")
    .insert(user)
    .then(id => {
      res.status(201).send({ message: `id ${id} created` });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


//listen
server.listen(PORT, () =>{
  console.log(`\n=== Web API Listening on http://localhost:${PORT} ===\n`);
})