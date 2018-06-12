/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
// My mLabs DB <3
const MONGO_URI = require('./config');
// Routes
const userRoutes = require('./user/userRoutes');

/* Middleware Functions */
const checkAuth = (req, res, next) => {
  if (req.session._id) {
    next();
  } else {
    res.status(403).json({ error: "Please login to access the resource" });
  }
}
/* Server and General Middleware */
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
  secret: `9cj2kz8bxezM2duz3n8S
  JaKQZZ5q9LDn3alWB52M
  YvP14Gz9Ja9CO6m4blBh
  G4q41tkFHoPk0i3L14Em
  0g2ekN4oGJ1umgD7hn7t`
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