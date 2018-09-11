const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const restrictedRoutes = require('./routes/restrictedRoutes');
const session = require('express-session');

const server = express();
const mw = require('./middleware');

server.use(express.json());
server.use(cors({ credentials: true, origin: 'http://localhost:3001' }));
server.use(morgan('dev'));

server.use(
  session({
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: false,
  }),
);

server.use('/api', authRoutes);
server.use('/api/restricted', mw.isLoggedIn, restrictedRoutes);
server.use(mw.errorHandler);

server.get('/', (req, res) => {
  res.send('ya made it mon');
});

server.use(mw.errorHandler);
server.listen(7000, () => console.log('ya made it to port 7000 mon'));
