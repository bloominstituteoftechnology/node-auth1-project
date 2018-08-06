const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('./data/db');

const port = 8002;
const server = express();

server.use(express.json());

server.listen(port, () => console.log(`Server is listening port ${port}`))

server.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>')
})

server.get('/user')

// // ******  to hash a password *******

server.post('/api/register', (req, res) => {
    const info = req.body;
    const hash = bcrypt.hashSync(info.password, 14);
    info.password = hash;

    if(info.userName && info.password) {
        db('user')
            .insert(info)
            .then( ids => {
                db('user')
                .where({ id: ids[0]})
                .first()
                .then(user => {
                    res.status(200).json(user)
                })
                .catch(err => res.status(500).json(err))
            })
    } else {
        res.status(400).json({ message: 'Please provide both userName and password' })

    }
})
server.post('/api/login', (req, res) => {
    const info = req.body;
    
  

    if(info.userName && info.password) {
        db('user')
            .where({ userName: info.userName })
            .first()
            .then(user => {
                if(!user || !bcrypt.compareSync(info.password, user.password)) {
                    return res.status(401).json({ error: 'Incorect credentials '});
                } else {
                    res.send('welcome')
                }
            })
            .catch(err => res.status(500).json(err))
        
        } else {
            res.status(400).json({ message: 'Please provide both userName and password' })
    
        }
})

// const credentials = req.body;

// const hash = bcrypt.hashSync(credentials.password, 14);

// credentials.password = hash;

// // move on to save the user.

// // ******  to hash a password *******
// const credentials = req.body;

// // find the user in the database by it's username then
// if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
//   return res.status(401).json({ error: 'Incorrect credentials' });
// }

// // the user is valid, continue on


// //hash password
// const hash = bcrypt.hashSync(user.password, 14);
// user.password = hash

// db('users')
//     .insert(user)
//     .then(function(ids) {
//         db('users')
//         .where({ id: ids[0] })
//         .first()
//         .then(user => {
//             res.status(201).json(user);
//         });
//     })
//     .catch(function(err) {
//         res.status(500).json({ err });
//     })


//     // login 

//     server.post('/login', function(req, res) {
//         const credentials = req.body;


//     })
//     db('users')
//     .where({ username: user.username}).first()
//     .then(function(user) {

//         if()
//     })