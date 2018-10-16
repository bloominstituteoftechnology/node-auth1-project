const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('./data/sessionconfig');
const usersTable = require('./data/helpers/credsmodel');
const errorHandler = require('./api/ErrorHandler/errorhandler');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session);


const protected = (req, res, next) => {
	if(req.session && req.session.username) {
		next();
	} else {
		next(["h401", "Not authorized!"]);
	}
};


server.post('/api/register', (req, res, next) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    usersTable.addNewUser(credentials)
        .then((id) =>{
            req.session.username = credentials.username;
            res.status(201).json({"newUserId": id[0]});
        })
        .catch((err) => {
            next(["h500", err]);
        });
});

server.post('/api/login', (req, res, next) => {
	const credentials = req.body;
	usersTable.authUser(credentials)
		.then((user) => {
			if(user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = user.username;
				res.status(200).json({"message": 'Welcome home. Country roads.'});
			} else {
				next(["h401", "You shall not pass!"]);
			}
		})
		.catch((err) => {
			next(["h500", err]);
		});
});

server.get('/api/logout', (req, res, next) => {
	if(req.session) {
		req.session.destroy((err) => {
			if(err) {
				next(["h500", err]);
			} else {
				res.status(200).json({message: "logged out"});
			}
		});
	}
});

// protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res, next) => {
    usersTable.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            next(["h500", err]);
        });
});

server.use((req, res, next) => {
    next(["h404", `The requested path '${req.url}' doesn't exist.`]);
});

server.use(errorHandler);

const port = 8080;
server.listen(port, () => console.log(`\n~~~ Server listening on port ${port} ~~~\n`));
