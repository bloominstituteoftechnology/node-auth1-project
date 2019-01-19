const express = require('express');
const server = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3800;

server.use(express.json());
server.use(cors());


const session = require('express-session');

server.use(session({
    name: 'notsession',
    secret: 'this really should not be a string',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}))

// const loginRouter = require('./routes/loginRoutes');
// server.use('/api', loginRouter);

const dbLogin = require('./data/userModel');

function protect(req, res, next){
    if(req.session && req.session.userId){
        next();
    } else {
        res.status(400).send('You shall not pass!');
    }
}

server.get('/', (req, res) => {
    res.json({ message: "Welcome"})
})

//Test outside of routes to let sessions work


server.post('/api/register', (req, res) => {
    const user = req.body;
    if(user.Password.length > 12){
        user.Password = bcrypt.hashSync(user.Password, 10)
        if(user.Username){
            dbLogin.add(user)
            .then(response => {
                res.status(201).json({ message: "Account created successfully!" })
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to add new account" })
            })
        } else{
            res.status(400).json({ message: "New accounts require a Username" })
        }
        
    } else {
        res.status(400).json({ message: "Password must be at least 12 characters long"})
    }
})

server.post('/api/login', (req, res) => {
    const loginUser = req.body;
    if(loginUser.Username && loginUser.Password){
        dbLogin.login(loginUser.Username)
            .then(response => {
                console.log('session', req.session, 'id', response[0].id)
                console.log('length', response.length, 'password', bcrypt.hashSync(loginUser.Password, 10), 'response password', response[0].Password)
                if(response.length && bcrypt.compareSync(loginUser.Password, response[0].Password)){
                    req.session.userId = response[0].id;
                    res.json({ message: "Login successful!" })
                } else {
                    res.status(404).json({ message: "Invalid username or password" })
                }
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to login" })
            })
    } else {
        res.status(400).json({ message: "Please login with username and password" })
    }
})

server.get('/api/users', protect, (req, res) => {    
    dbLogin.fetch()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "Unable to fetch users" })
        })
})

//SERVER

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});