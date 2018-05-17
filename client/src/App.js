var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('mongoose')(session);

mongoose.connect('mongodb://localhost/5000');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname));

var routes = require('../../route/router.js');
app.use('/', routes);

app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});