const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const server = express();

server.use(express.json());
server.use(morgan());
server.use(helmet());


server.get('/', (req, res) => {
    res.send('My server can respond');
});


//==========CREATE A NEW USER(REGISTER)=========
server.post('/api/register', (req, res) => {
    //grabs username and password from body
        const creds = req.body;

    // generate hash from the user's password
        const hash = bcrypt.hashSync(creds.password, 14);

    //override the user.password with the hash
        creds.password = hash;

    //save the user to the database
        db('users').insert(creds)
        .then(ids => {
        res.status(201).json(ids);
        })
        .catch(err => res.status(401).json(err));
});

//==========LOGIN A USER==========
server.post('/api/login', (req, res) => {
    //grabs username and password from body
        const creds = req.body;
    db('users').where({ username: creds.username}).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
        //paswords match and username exists
        res.status(200).json({message: 'Logged in'});
    
    
        } else {
        res.status(401).json({message: 'You shall not pass!'})
        }
        
    }).catch(err => res.status(401).json({message: "You shall not pass!"}, err))
});

//==========GET USER INFO==========
server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(401).json({message: 'You shall not pass!'}));
});
 

server.listen(8000, () => console.log('\n====Server running on port 8000====\n'));
