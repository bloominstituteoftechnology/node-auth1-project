const express = require('express');
const db = require('./dbConfig');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Test')
})

app.post('/api/register', (req, res) => {
 const creds = req.body;

 const hash = bcrypt.hashSync(creds.password, 16)

 creds.password = hash;

 db('users').insert(creds).then(ids => {
     res.status(201).json(ids)
 })
 .catch(err => json(err))

})

const PORT = 3500
app.listen(PORT, console.log(`==^_^== ${PORT} ==^_^==`));