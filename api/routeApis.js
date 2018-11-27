
const route = require('express')()
const db = require('../database/dbConfig')
const bcrypt = require('bcryptjs')


const protected = (req, res, next)=> {
    if(req.session && req.session.userID){
        next();
    } else{
        res.status(401).json({message : "Log in required"})
    }
}

const login = (req, res, next) => {
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
}; 


// register a new user
// hash password before saving to DB
const registerUser = (req, res, next) => {
    
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 3);

    newUser.password = hash;

    db('users')
        .insert(newUser)
        .then(ids =>{res.status(200).json(ids)})
        .catch((err)=>
        res.status(500).json({ message: 'could not add', err }))
};

const getUsers = (req, res, next) => {

    db('users')
        .select('*')
        .then(users =>{res.status(200).json(users)})
        .catch((err)=>
 res.status(500).json({ message: 'could not get users', err }))
};

const logout = (req, res) => {
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
  };


route.get('/', (req, res) => {
    res.send("route is RUNNING !");
})


// Register
route.post('/register', registerUser)
// GET USERS
route.get('/users', protected, getUsers)
// LOGIN
route.post('/login', login)
// LOGOUT
route.get('/logout', logout)

// Restricted
route.get('/restricted', protected)




module.exports = (server) => {
    server.use('/api', route)
  }