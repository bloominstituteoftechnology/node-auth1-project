const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const usersTable = require('./data/helpers/credsmodel');
const errorHandler = require('./api/ErrorHandler/errorhandler');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
let isAuthed = false;

server.post('/api/register', (req, res, next) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    usersTable.addNewUser(credentials)
        .then((ids) =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
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
                isAuthed = true;
				res.status(200).json({message: 'Welcome home. Country roads.'});
			} else {
                isAuthed = false;
				next(["h401", "You shall not pass!"]);
			}
		})
		.catch((err) => {
			next(["h500", err]);
		});
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res, next) => {
    if(isAuthed) {
        usersTable.find()
            .then((users) => {
                res.status(200).json(users);
            })
            .catch((err) => {
                next(["h500", err])
            });
    } else {
        next(["h403", "An account is required!"]);
    }
});

server.use((req, res, next) => {
    next(["h404", `The requested path '${req.url}' doesn't exist.`]);
});

server.use(errorHandler);

const port = 8080;
server.listen(port, () => console.log(`\n~~~ Server listening on port ${port} ~~~\n`));
