const express = require('express'); 
const knex = require('knex'); 
const dbConfig = require('./knexfile'); 
const db = knex(dbConfig.development); 
const bcrypt = require('bcryptjs'); 
const Joi = require('joi'); 

const server = express(); 
server.use(express.json()); 

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

server.get("/api/register", (req, res) => {
    db('users').then(users => {
        res.status(200).json(users); 
    })
})

server.listen(3400, () => {
    console.log("This server is listening on port 3400")
}); 

