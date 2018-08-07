const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/db');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const MemcachedStore = require('connect-memcached')(session);

const server = express();

server.use(express.json());

server.use(morgan('dev'));

server.use(cookieParser());

let servers =['127.0.0.1:11211'];


//session middleware with memcache

server.use(session({
      secret  : 'j6AaYtaxQXUntFsFownFMZYR',
      key     : 'logS',
      proxy   : 'true',
      saveUninitialized: false,
      resave: false,	
      store   : new MemcachedStore({
      hosts: servers, //this should be where your Memcached server is running
      secret: 'j6AaYtt531oncDgQXUntFsFownF7ZYR', // Optionally use transparent encryption for memcache session data 
    }),
}));



//session middleware without memcache
/*server.use(session({ 
	secret: 'j6AaYtaxQXUntF.sFownFMZ-YR',
	httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    	secure: false, // only set cookies over https. Server will not send back a cookie over http.
    	resave: false,
      	saveUninitialized: false,
	cookie: { maxAge: 60000 }
}));*/


function protected(req, res, next) {
  if (req.session && req.session.loggedInFlag) //checking if a user is logged in using data stored in a session
{
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}


function roles(req, res, next){

	db('users')
	.where('id', req.session.userId)
	.then(user => {
	console.log(user);

	if(req.session.loggedInFlag === true && user[0].role ==='admin')
	{
		next();
	}

	else {
		res.status(401).json({ message: 'you shall not pass, since you are not an admin!!' });
	}
	})

	.catch(err => {
		res.status(500).json(err);
	
	});
}


server.get('/', (req, res)=> {
        res.send('hELLO... teSTING');

});



server.post('/api/register', (req, res)=> {

	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 14);  //hasing password using bcrypt
	credentials.password = hash;


	db('users')
	.insert(credentials)
	
	.then(ids =>{

		db('users')
		.where('id', ids[0])
		.first()
		.then(user => {
	          res.status(200).json(user);	
		})
	})

	.catch(err =>{
	if(err.message.includes('UNIQUE constraint failed: users.username')) res.status(500).json({errorMessage:"username already taken, use another username"});  //checking if the username is alread taken
	
	else res.status(500).json(err);
	});
});


server.post('/api/login', (req, res)=> {
	
	const credentials = req.body;

	db('users')
	.where({username: credentials.username})
	.first()
	.then(user =>{
		if(user && bcrypt.compareSync(credentials.password, user.password)) {
			//req.session.logged = true;
			//req.session.cookie.userId = user.id;
			req.session.loggedInFlag = true;
			req.session.userId = user.id;

			//console.log(req.session.key);
			console.log(req.session.loggedInFlag);

			res.status(200).send(`Logged In, Welcome`);
		}
		else{
			res.status(401).json({message: 'Incorrect credentials'});
		}
	})
	
	.catch(err => {
		res.status(500).json(err);
	});

});


server.get('/api/users', roles, (req, res)=> {

                db('users')
                .then(response =>{
                        res.status(200).json(response);

                })

                .catch(err => {
                        res.status(500).json(err);
                });

});





server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});



server.get('/api/restricted/', protected, (req, res) => {
	

	res.status(200).send("Welcome, You're Logged in");  

});



server.use((req, res)=> {
	 res.status(404).send("Wrong URL. Please provide a correct URL");
});


server.listen(4002, ()=>  console.log('API listening on port 4002'));
