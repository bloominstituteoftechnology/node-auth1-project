const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const projectDb = knex(knexConfig.development);
const server = express();
server.use(helmet());
server.use(express.json());

const port = 8000;
server.listen(port, () => console.log(`API running on port ${port}`));

// checker endpoint
server.get('/', (request, response) => {
    response.send('Server initialized.');
});

// server.get('/api/users', (request, response) => {
//     projectDb('actions')
//         .then(actions => {
//             return response
//                 .status(200)
//                 .json(actions);
//         })
//         .catch(() => {
//             return response
//                 .status(500)
//                 .json({ Error: "Could not find list of actions." })
//         });
// });

// server.post('/api/register', (request, response) => {
//     const newAction = request.body;

//     if (!newAction.description_action) {
//         return response
//             .status(400)
//             .send({ Error: "Missing description for the action" });
//     }

//     projectDb
//         .insert(newAction)
//         .into('actions')
//         .then(id => {
//             return response
//                 .status(201)
//                 .json(id);
//         })
//         .catch(() => {
//             return response
//                 .status(500)
//                 .json({ Error: "There was an error while saving the action" })
//         });
// });

// server.post('/api/login', (request, response) => {
//     const newAction = request.body;

//     if (!newAction.description_action) {
//         return response
//             .status(400)
//             .send({ Error: "Missing description for the action" });
//     }

//     projectDb
//         .insert(newAction)
//         .into('actions')
//         .then(id => {
//             return response
//                 .status(201)
//                 .json(id);
//         })
//         .catch(() => {
//             return response
//                 .status(500)
//                 .json({ Error: "There was an error while saving the action" })
//         });
// });