const express = require('express');
const server = express();
const CORS = require("cors");
const bcrypt = require('bcryptjs');

server.use(express.json());
server.use(CORS());

const database = require('./data/db.js');

server.get('/users/', (req, res) => {

    database.getUsers().then(users => {
        res.status(200).json(users);
    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'An error has occured!'});

    });

});

server.post('/register/', (req, res) => {

    console.log(bcrypt.hashSync(req.body.password, 14));

    database.addUser(req.body.username, bcrypt.hashSync(req.body.password, 14)).then(result => {

        console.log(result);
        res.status(200).json({user_id: result.id});
        // database.getProjectById(result.id).then(project => {
        //     res.status(201).json({project});
        // });

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the project to the database!'});

    });

});

server.post('/login/', (req, res) => {

    database.getUserByName(req.body.username).then(user => {

        console.log(user);
        
        if (user === undefined || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({ error: 'Incorrect credentials' });
        }

        res.status(200).json({response: 'Login succesfull!'});

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'Error attempting to login!'});
    
    });



    // console.log(req.body);

    // database.addResource(req.body).then(result => {

    //     console.log(result);
    //     database.getResourceById(result.id).then(resource => {
    //         res.status(201).json({resource});
    //     });

    // }).catch(err => {

    //     console.log(err);
    //     res.status(500).json({error: 'There was an error while saving the resource to the database!'});

    // });

});

server.listen(5000, '127.0.0.1', () => console.log('Server listening on port 5000.'));