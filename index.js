const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile');
const dbOne = knex(dbConfig.development);

const loginRouter = require('./routes/loginRoutes');

const PORT = process.env.PORT || 3800;

server.use(express.json());

server.use('/api', loginRouter);

// server.get('/api/user', (req, res)=>{
//     dbOne('Users')
//         .then(response => {
//             res.json(response)
//         })
//         .catch(err => {
//             res.status(500).json({ message: "Could not fetch users" })
//         })
// })

//SERVER

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});