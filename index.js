const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const auth = require('./auth/protected');

const app = express();

app.use(
  session({
    name: 'auth-1',
    secret: 'this is my secret phrase',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', auth.protected, userRoutes);

app.listen(8000, () => {
  console.log('Server running on PORT 8000');
});
