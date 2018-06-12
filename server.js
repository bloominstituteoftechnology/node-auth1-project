/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
// My Config File <3
const { MONGO_URI, secret } = require('./config');
// Routes
const userRoutes = require('./user/userRoutes');

/* Middleware Functions */
const checkAuth = (req, res, next) => {
  // console.log("checkAuth--req.session:",req.session,"req.session.username:",req.session.username);
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ error: "Please login to access the resource" });
  }
}

/* Server and General Middleware */
const server = express();
server.use(helmet());
server.use(cors({
  origin: true,
  credentials: true
}));
server.use(express.json());
server.use(session({
  secret,
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname'
}));
server.use('/api/users', checkAuth);
server.use('/api/restricted', checkAuth);


/* Mongoose */
mongoose.connect(MONGO_URI)
  .then(_ => console.log("\n*** Connected to mLabs MongoDB ***\n"))
  .catch(err => console.log(err));

/* Routes */
server.get('/', (req, res) => {
  res.status(200).json({ api: '--- API running ---'});
});

server.get('/api/restricted', (req, res) => {
  res.status(200).json({ message: "Connection Successful" });
})

server.use('/api', userRoutes);

/* Server Start */
const port = 5000;
server.listen(port, () => console.log(`\n === Server is listening at ${port} ===\n`));