const express = require('express');
const server  = express();
const PORT    = 8000;
const bcrypt  = require('bcryptjs');
const db      = require('./data/dbConfig');

server.use(express.json());

server.get('/', (req, res) => {
   res.status(200).send('HellO!');
 });

 server.get('/api/users', (req, res) => {
   const users = db('users').then(response => {
     res.status(200).json(response);
   }).catch(err => {
     res.status(500).json(`${err}`);
   });
 })

 server.post('/api/register', async (req, res) => {
   const user = req.body;
   const hash = bcrypt.hashSync(user.password, 14);
   user.password = hash;

   try {
     if (user.username && user.password) {
       const ids = await db.insert(user).into('users');
       const id = ids[0];
       res.status(201).json(await db('users').where('id', id).first());
     } else {
       throw Error;
     }
   } catch (err) {
     return console.log(`${err}`);
   }
 })

 server.post('/api/login', (req, res) => {
   const user = req.body;
   //should not need this const hash = bcrypt.hashSync(user.password, 14);
   const isValid = bcrypt.compareSync(user.password, /*hash which was retrieved from db*/);
 });

 server.get('/api/users', (req, res) => {

 })

server.listen(PORT, () => console.log(`App is listening on ${PORT}`))
