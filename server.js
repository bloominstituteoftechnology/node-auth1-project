const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session')
const authRouter = require('./users/users-router.js');


const router = express();

const sessionConfiguration ={
  name: 'ohfosho',
  secret: 'keeps it secret, keep it safe',
  cookies: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
}

router.use(sessions(sessionConfiguration));

router.use(helmet());
router.use(express.json());
router.use(cors());

router.use('/api/auth', authRouter);


router.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = router;
