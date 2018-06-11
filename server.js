const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/dbauth').then(() => { 
    console.log('/n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

/*function authenticate(req, res, next) {
    if (req.body.password === 'mellon') {
        next();
    }else{ res.status(401).send('You shall not pass!!');
 }
}*/

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
});

server.post('/api/register', (req, res) => {
    // save the user to the database
    // const user = new User(req.body)
    // user.save().then().catch
    // or an alternative syntax would be:
    User.create(req.body).then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

/*user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});*/

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
        if(user) {
            //compare the passwords
            user.isPasswordValid(password).then(isValid => {
                if(isValid) {
                res.send('login successful');
        } else {
        res.status(401).send('You shall not pass!');
        }
    });
    } else {
        res.status(401).send('You shall not pass!');
    }
})
    .catch(err => res.send(err));
});



server.listen(8000, () => {
    console.log('/n*** API running on port 8K ***\n');
});