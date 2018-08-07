const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(8000, () => {
  console.log('Server running on PORT 8000');
});
