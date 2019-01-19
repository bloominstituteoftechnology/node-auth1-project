const express = require('express');
const server = express();
const cors = require('cors');


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

const loginRouter = require('./routes/loginRoutes');
server.use('/api', loginRouter);



server.get('/', (req, res) => {
    res.json({ message: "Welcome"})
})

//SERVER

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});