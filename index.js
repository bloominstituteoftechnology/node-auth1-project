const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const register = require('./api/register')
const login = require('./api/login');

//connection to the data base
const db = knex(knexConfig.development);
const server = express();

const sessionConfig = {
	name: 'monkey', // default is sid
	secret: 'joqiej;lksdjfoifoierqeoiausa9879*a96876relhjlkn&&T*&^%*yogfhldkj',
	cookie: {
		maxAge: 1000 * 60 * 5, // in miliseconds
		secure: false, // only send the cookie over https, should be true in production
	},
	httpOnly: true, // js can't touch this,
	resave: false,
	saveUninitialized: false,
	store: new KnexSessionStore({
		tablename: 'sessions',
		sidfieldname: 'sid',
		knex: db,
		createtable: true,
		clearInterval: 1000 * 60 * 10,
	}),
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req,res) => {
    res.send("It is working");
});

server.get('/api/users', async (req, res) => {
    const usersList = await db('users').select('id', 'username', 'password');
        try {
            if(req.session && req.session.compared) {
                res.json(usersList);
            } else {
                res.status(401).json({ message: 'You are not authorized to view this page' });
            }
        }
        catch (err){
            res.status(500).json({message: "There was an error trying to retrieve users from the data base"})
        }
  });

server.get('/api/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.status(500).send('There was an error trying to log out');
			} else {
				res.status(200).send('You succesfully logged out');
			}
		});
	} else {
		res.json({ message: 'You are logged out already' });
	}
});  

server.use('/api/register', register);
server.use('/api/login', login);

server.listen(9000, () => console.log('\n Api is running \n'));