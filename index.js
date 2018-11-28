//bring in your dependencies
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const db = require('./database/dbConfig')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session); //needs to be below const session to work

const sessionConfig = { //setting up for cookies
    name: 'the best cookie',
    secret: 'order66',
    cookie: {
        maxAge: 1000 * 60 * 10, //1 sec into 1 min into 10 mins. So it times out in 10 mins
        secure: false //only set it over https; in production make this TRUE!!!!
    },
    httpOnly: true, //make it so that no JS can touch this cookie, aka more secure.
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions', //notice it's all lower case
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60, //for some reason this is camalcase...  
    })
};

//set up server with dependencies
const server = express();
server.use(express.json());
server.use(cors());
server.use(morgan());
server.use(helmet());
server.use(session(sessionConfig)) //wires up session management

//make sure it works check
server.get('/', (req, res) => {
    console.log('testing to see if this works')
    res.send({ message: 'do not forget to add the correct url info' })
})

//middleware local
function restricted(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ you: 'shall not pass!' })
    }
}



//Info for me to learn from

//HOW TO CALL/USE THE LOCAL MIDDLEWARE ABOVE
// server.get('/api/users', restricted, (req, res) => {
//     //they're logged in, go ahead and provide access/data
//     db('users')
//         .select('id', 'username')
//         .then(users => {
//             res.json(users);
//         })
//         .catch(err => res.json(err));

//     //bounce them
//     res.status(401).json({ message: 'you shall not pass' })
// });


// //custom middleware (will be used globally) to restrict access if path starts with '/api/restricted'
// function restrictMiddleware(req, res, next) {
//     // if path contains '/api/restricted', no matter what follows, runs check for valid session and cookie info
//     if (req.path.includes("/api/restricted")) {
//       // verifies if user is logged in. if yes, points to next middleware (the endpoint, in this case)
//       if (req.session && req.session.userId) {
//         next();
//       } else {
//         // not logged in, kill request
//         res.status(401).json({ message: "You shall not pass!" });
//       }
//     } else {
//       // path doesn't contain '/api/restricted', so runs the next middleware(endpoint) as it's written
//       next();
//     }
//   }

//   //all server requests first pass through restrict middleware
//   server.use(restrictMiddleware);







//endpoints


//register new users
server.post('/api/register', (req, res) => {
    // grab username and password from body
    const creds = req.body;
    // generate the hash from the user's password
    const hash = bcrypt.hashSync(creds.password, 8);
    // override the user.password with the hash
    creds.password = hash;
    // save the user to the database
    db('users')
        .insert(creds)
        .then(id => res.status(201).json(id))
        .catch(err => res.status(500).json(err))
})

//login 
server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                //passwords match and has correct username too
                req.session.userId = user.id
                res.status(200).json({ message: 'Welcome to Asgard mortal' })
            } else {
                //they don't match
                res.status(401).json({ message: 'YOU SHALL NOT PASS!' })
            }
        })
        .catch(err => res.status(500).json(error))
})


//List of users
//protect this route, only authenticated users should see it (without using the middleware)
server.get('/api/users', (req, res) => {
    if (req.session && req.session.userId) {
        //they're logged in, go ahead and provide access/data
        db('users')
            .select('id', 'username')
            .then(users => {
                res.json(users);
            })
            .catch(err => res.json(err));

    } else {
        //bounce them
        res.status(401).json({ message: 'you shall not pass' })
    }
});




server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('you can never leave');
            } else {
                res.send('bye')
            }
        })
    } else {
        res.end();
    }
})



//port
server.listen(9000, () => {
    console.log('\nrunning on port 9000\n');
})
