const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(helmet());
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.json({message: 'your app is running!'});
});

app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);
});
