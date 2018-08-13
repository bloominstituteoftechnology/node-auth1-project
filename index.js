const express = require('express');
const app = express();
const logger = require('morgan');
const helmet = require('helmet')
const bcrypt = require('bcryptjs')


app.use(express.json())
app.use(helmet());
app.use(logger("dev"));

app.get('/', (req, res) => {
    res.send('welcome to Lambda School Authentication Projects');
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});

//Run app, then load http://localhost:3000 in a browser to see the output.