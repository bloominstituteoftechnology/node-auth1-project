const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./data/db');
const cors = require('cors');
const helmet = require('helmet');
const server = express();

//middleware
server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000', credentials: true}));
server.use(helmet());
server.use(session({
    name: 'lambdaSession',
    secret: 'this-is-a-secret-token',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: false
}));

function sendError(code, message, error) {
    return {
        code,
        message,
        errMsg: error
    }
}

function protected (req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        next(sendError(401, 'Failed to proceed', 'Please login.'));
    }
}

//Endpoint for GET
server.get('/', (req, res) => {
    res.status(200).send('Welcome!')
});

// server.get('/users', async (req, res, next) => {
//     try {   
//         const id = await db.getId(req.session.username);
//         response = req.session.username === 'adminUser'
//         ? await (db.get()) 
//         : await (db.get(id));
//         res.status(200).json(response);
//     } catch (error) {
//         next(sendError(500, 'Failed to retrieve users information.', error.message))
//     }
// })

server.get('/api/restricted/users', protected, async (req, res, next) => {
    try {   
        const id = await db.getId(req.session.username);
        response = req.session.username === 'adminUser'
        ? await (db.get()) 
        : await (db.get(id));
        res.status(200).json(response);
    } catch (error) {
        next(sendError(500, 'Failed to retrieve users information.', error.message))
    }
})

server.get('/users/:id(\\d+)/', async (req, res, next) => {
    const id = req.params.id;
    try {
        
        const response = await (db.get(id));
        res.status(200).json(response);
    } catch (error) {
        next(sendError(500, 'Failed to retrieve users information.', error.message))
    }
})

server.post('/users/register', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return next(sendError(400, 'Failed to save user login to database.', 'Please provide username and password.'))
    }
    const hash = bcrypt.hashSync(req.body.password, 14);
    const newUser = {
        ...req.body,
        password: hash
    }
    try {
        const response = await (db.post(newUser));
        res.status(201).json(response);
    } catch (error) {
        next(sendError(500, 'Failed to save user login to database.', error.message))
    }
})

server.post('/users/login', async (req, res, next) => {
    if (!req.body.username && !req.body.password) {
        return next(sendError(400, 'Failed to login.', 'Please provide username and password.'))
    }
    try {
        const response = await (db.login(req.body.username));
        if (response == null) {
            return next(sendError(400, 'Failed to login.', 'Incorect credentials.'));
        }
        const match = bcrypt.compareSync(String(req.body.password), response);
        if (match) {
            const loggedinSession = req.session;
            loggedinSession.authenticated = true;
            loggedinSession.username = req.body.username;
            res.status(200).send('Login successfully')
        } else {
            next(sendError(400, 'Failed to login.', 'Incorect credentials.'));
        }

    } catch (error) {
        next(sendError(500, 'Failed to login.', error.message))
    }
})

server.post('/users/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('Failed to log out.');
            } else {
                res.send('Logged out successfully.')
            }
        })
    }
});

server.use((error, req, res, next) => {
    res.status(error.code).json({ message: error.message, error: error.errMsg })
})

server.use(function (req, res, next) {
    res.status(404).send("Sorry this page does not exist.")
  })

const port = 8000;
server.listen(port, console.log(`=== Web API listening at port ${port} ===`));