const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./database/dbConfig.js");
const server = express();

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Server Running");
});
function protected(req, res, next) {
     if (req.session && req.session.username) {
         next();
        
    } else {
              res.status(401).json({ message: 'no pass!!!' });
        
    }
    
} 
server.post('/api/register', (req, res)=>{
    const creds=req.body;
    const hash=bcrypt.hashSync(creds.password, 14);
    creds.password= hash;
    db('users')
    .insert(creds)
    .then(ids=>{
        const id = ids[0];
        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post('/api/login',(reg, res )=>{
    const creds=req.body;
    db('users')
    .where({username:creds.username})
    .first()
    .then(user=>{
        if (user && bcrypt.compareSync(creds.password, user.password)){
            req.session.username=user.username;
            res.status(200).send(`Welcome back ${req.session.username}`);
        }else{
            res.status(401).json({message:'No pass...:('});
        }
        })
        .catch(err => res.status(500).send(err));
    });
    server.get('/api/users', protected, (req, res)=>{
        db('users')
        .select('id', 'username', 'password')
        .then(users=>{
            res.json(users);
        })
        .catch(err=>res.send(err));
    });
    
   
server.listen(5500, () => console.log("\nrunning on port 5500\n"));
