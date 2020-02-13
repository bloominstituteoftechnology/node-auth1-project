const router = require('express').Router();


// /routers/registerRouter.js
const registerRouter = require('../routers/registerRouter.js');
// /routers/loginRouter.js
const loginRouter = require('../routers/loginRouter.js');
// /router/userRouter.js
const userRouter = require('../routers/userRouter.js');

// /api/register
router.use('/register', registerRouter);
// /api/user
router.use('/users', userRouter);
// /api/login
router.use('/login', loginRouter);



module.exports = router;