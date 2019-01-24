const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js')

const server = express();

const PORT = 5050;

server.use(express.json());
server.use(cors());


server.post('/api/register', (req, res) =>{
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    if(!user.username || !user.password){res.status(400).json({message:'Please provide username and password!'})}
    db.insertUser(user)
    .then(ids =>{
        const id = ids[0]
        res.json({newUserId: id})
    })
    .catch(err =>{
        res.status(500).json({err})
    })
})

server.post('/api/login', (req, res)=>{
    const creds = req.body;
    db.findByUsername(creds.username)
    .then(user =>{
        if(user && bcrypt.compareSync(creds.password, user.password)){
            res.json({welcome:user.username})
        }else{
            res.status(401).json({message:"Invalid username or password!"})
        }
    })
    .catch(err =>{
        res.status(err =>{
            res.status(500).json({err})
        })
    })
})

server.get("/api/users", (req, res) => {
    db.getUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}!`)
})