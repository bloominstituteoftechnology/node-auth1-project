const express = require('express');
const server = express();
const bcrypt = require('bcryptjs');

const knex = require('knex');
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

server.use(express.json());

server.post('/api/register', async ( req, res ) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync( credentials.password, 5 )
    credentials.password = hash;
    if ( !credentials.username || !credentials.password ) {
        res.status(400).json({
            message: "Username and password are required."
        })
    } else {
        try {
            const newUser = await db('users').insert( credentials );
            res.status(201).json( newUser );
        }
        catch ( err ) {
            res.status(500).json( err.message );
        };
    };  
});

server.post('/api/login', async ( req, res ) => {
    const credentials = req.body;
    try {
            const user = await db('users')
                                .where({ username: credentials.username })
                                .first()
            if ( bcrypt.compareSync( credentials.password, user.password ) ) {
                res.status(200).json({
                    message: "Logged in."  
                });
            } else {
                res.status(400).json({
                    message: "You shall not pass!"
                });
            }
    }
    catch (err) {
        res.status(500).json( err.message );
    };
});

// server.get('/api/users', async ( req, res ) => {
//     try {
//         const users = await db('users');
//         res.status(200).json( users )
//     }
//     catch ( err ) {
//         res.status(500).json( err.message );
//     };
// });


const port = 8000;
server.listen( port, () => console.log(`===Server is running on port ${port}===`))
