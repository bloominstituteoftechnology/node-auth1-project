const express = require('express');
const server = express();

server.use(express.json());

const database = require('./data/db.js');

server.get('/users/', (req, res) => {

    database.getTasks().then(cars => {
        res.status(200).json(cars);
    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'An error has occured!'});

    });

});

server.post('/register/', (req, res) => {

    // console.log(req.body);

    database.addProject(req.body).then(result => {

        console.log(result);
        database.getProjectById(result.id).then(project => {
            res.status(201).json({project});
        });

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the project to the database!'});

    });

});

server.post('/login/', (req, res) => {

    // console.log(req.body);

    database.addResource(req.body).then(result => {

        console.log(result);
        database.getResourceById(result.id).then(resource => {
            res.status(201).json({resource});
        });

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the resource to the database!'});

    });

});

server.post('/task/', (req, res) => {

    // console.log(req.body);

    database.addTask(req.body).then(result => {

        console.log(result);
        database.getTaskById(result.id).then(task => {
            res.status(201).json({task});
        });

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the task to the database!'});

    });

});



server.post('/project/resource', (req, res) => {

    // console.log(req.body);

    database.addTask(req.body).then(result => {

        console.log(result);
        res.status(201).json({result});

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the resource to the project.'});

    });

});

server.listen(5000, '127.0.0.1', () => console.log('Server listening on port 5000.'));