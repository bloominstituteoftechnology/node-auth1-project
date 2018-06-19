const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');

const server = express();

const port = 5555;

//middleware for cookie
const sessionOptions = {
    secret: 'Secret makes a woman woman.',
    cookie: {
        maxAge: 1000 * 60 * 60 //ms*second*mins = an hour
    },
    httpOnly: true,
    secure: false,
    saveUninitialized: false,
    name: 'someone'
};

server.use(helmet());
server.use(cors());
server.use(express.json()); //this needs to be bofore route(line 15) becoz it needs to be json format before passing to the route.
server.use(session(sessionOptions));



// add route here 
const userRouter = require('./users/userRouter');

server.use('/api', userRouter);

server.get('/', (req, res) => {
    if(req.session && req.session.username) {
        res.status(200).json({ message: `Hello again, ${req.session.username}`})
    } else {
        res.status(401).json({ message: 'Who are you??'})
    }
})

//connect mongoose here
mongoose.connect('mongodb://localhost/users', {userMongoClient: true}, (error) => {
    if(error) console.log(error);
    console.log('\n*** Connected to database ***\n');
})


server.listen(port, () => {
    console.log(`Server up and running on ${port}` )
})