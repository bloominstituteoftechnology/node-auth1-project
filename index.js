const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const dbConfig = require('./knexfile.js')

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

//---------GET REQUESTS-------//

//-----obligatory welcome----///
server.get('/', (req, res) => {
  db('credentials')
  .then( credentials => {
    res.status(200).send("welcome pilgrim");
  })
})

//All:

server.get('/api/credentials', (req, res) => {
  db('credentials')
  .then( credentials => {
    res.status(200).json(credentials);
  })
  .catch(err =>{
    console.log(err)
    res.status(500).json(err)
  })
})
//BY ID:

server.get('/api/credentials/:id', (req, res) => {
  const  {id} = req.params;
  db('credentials')
  .select()
  .where('id', id)
  .then( credentials => {
    res.status(200).json(credentials);
  })
  .catch(err =>{
    console.log(err)
    res.status(500).json(err)
  })
})

//----POST ------//

server.post( '/api/credentials', (req, res) => {
  const zoo = req.body;

  db.insert(zoo)
  .into('credentials')
  .then(credentials => {
    res.status(201).json(credentials);
  })
  .catch(err => {
    res.status(500).json(err);
  })
})

//-------DELETE------------//

server.delete('/api/credentials/:id', (req, res) => {
  const { id } = req.params;
   db('credentials')
   .where({ id })
   .del()
   .then( credentials => {
     res.status(200).json(credentials);
   })
   .catch(err => {
     console.log(err)
     res.status(500).json(err)
   })
})

//-------------PUT-----------//
server.put('/api/credentials/:id', (req, res) => {
  const { id } = req.params;
  const name = req.body;

  db('credentials')
  .where( { id })
  .update(name)
  .then( credentials => {
    res.status(200).json(credentials)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
