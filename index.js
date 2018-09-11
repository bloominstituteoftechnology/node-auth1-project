const express = require('express'); 
const knex = require('knex'); 
const dbConfig = require('./knexfile'); 
const db = knex(dbConfig.development); 
const bcrypt = require('bcryptjs'); 
const Joi = require('joi'); 
const session = require('express-session'); 

const server = express(); 
server.use(express.json()); 
server.use(
    session({
        name: 'notsession', 
        secret: 'This is a secret key', 
        cookie: { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            secure: false}, 
        httpOnly: true,  
        resave: false, 
        saveUninitialized: true
    })
)

server.post("/api/register", (req, res) => {
    const creds = req.body;
    
    // Joi validation
    const schema = {
        username: Joi.string().min(8).required(), 
        password: Joi.string().min(8).required()
    }

    const result = Joi.validate(creds, schema); 
    if(result.error){
        res.status(404).send(result.error.details[0].message)
    };

    const hash = bcrypt.hashSync(creds.password, 12)
    creds.password = hash;
    db('users').insert(creds).then(id => {
        res.status(201).json(id); 
    }).catch(err => {
        res.status(500).json({error: "Error updating the data to the database"})
    })
}); 

server.get("/api/users", (req, res) => {
    if(req.session.userId){
        db('users').then(users => {
            res.status(200).json(users)
        }).catch(err => {
            res.status(500).json({error: "Error retrieving data from the database"})
        });
    }else {
        res.status(403).json({message: "Access to this information is forbidden. Please login to view!"})
    }
}); 

server.post("/api/login", (req, res) => {
    const creds = req.body; 
    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)){
            req.session.userId = user.id;
            res.status(200).json({message: `Logged in! Welcome to the site, ${user.username}`});
        }else {
            res.status(401).json({message: "YOU SHALL NOT PASS! Please try again. Username or Password is incorrect"})
        }
    }).catch(err => res.send(err)); 
})



server.listen(3400, () => {
    console.log("This server is listening on port 3400")
}); 

