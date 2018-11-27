const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbconfig.js');

const server = express();

require('./middleware')(server)



const protected = (req, res, next)=> {
    if(req.session && req.session.userID){
        next();
    } else{
        res.status(401).json({message : "Log in required"})
    }
}

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username : creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){
                req.session.userID = user.id;
                res.status(200).json({message: "Login Successful!"})
            }
            else{res.status(401).json({message : "You shall not PASS !!"})}
        })
        
        .catch((err)=>  res.status(500).json({ message: 'could not login', err }))
}); 


// register a new user
// hash password before saving to DB
server.post('/api/register', (req, res) => {
    
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 3);

    newUser.password = hash;

    db('users')
        .insert(newUser)
        .then(ids =>{res.status(200).json(ids)})
        .catch((err)=>
        res.status(500).json({ message: 'could not add', err }))
});

server.get('/api/users', protected,  (req, res) => {

    db('users')
        .select('*')
        .then(users =>{res.status(200).json(users)})
        .catch((err)=>
 res.status(500).json({ message: 'could not get users', err }))
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('you can never leave');
        } else {
          res.send('bye');
        }
      });
    } else {
      res.end();
    }
  });

  
server.get('/', (req, res) => {
    res.send("Server is RUNNING !");
})
server.listen(9000, () => console.log('Server is UP at 9000'));

