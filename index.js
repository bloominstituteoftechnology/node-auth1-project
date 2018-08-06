const express = require('express');
const server  = express();
const PORT    = 8000;
const bcrypt  = require('bcryptjs');

server.use(express.json());

server.get('/', (req, res) => {
   res.status(200).send('HellO!');
 });

 server.post('/api/register', (req, res) => {
   const user = req.body;
   const hash = bcrypt.hashSync(user.password, 14);
   console.log(hash);
   res.status(200).send('Yeah, we got it');
   //hashing stuff
   //saving to database stuff
 })

 server.post('/api/login', (req, res) => {
   const user = req.body;
   //should not need this const hash = bcrypt.hashSync(user.password, 14);
   const isValid = bcrypt.compareSync(user.password, /*hash which was retrieved from db*/);
 });

 server.get('/api/users', (req, res) => {

 })

server.listen(PORT, () => console.log(`App is listening on ${PORT}`))
