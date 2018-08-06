const express = require('express');
const db = require('./data/db.js');
const bcrypt = require('bcryptjs'); 
const server = express();
server.use(express.json());


server.get('/users', (req, res) => {
   db('users')
   .then(users => {res.status(200).json(users)})
   .catch(err => {
       res.status(500).json(err)
   })
  })

server.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);    
    user.password = hash;

    db('users')
    .insert(user)
    .then(ids => {
        db('users')
            .where({ id: ids[0]})
            .first()
            .then(user => {
                res.status(201).json(user);
            })
    })
    .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
})


const port = 3300;
server.listen(port, function() {
 console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
