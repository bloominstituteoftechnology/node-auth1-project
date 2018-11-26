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
const PORT = 3500
app.listen(PORT, console.log(`==^_^== ${PORT} ==^_^==`));