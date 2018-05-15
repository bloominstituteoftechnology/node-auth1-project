import { Router } from 'express'
import registerRouter from './register'
import loginRouter from './login'
import usersRouter from './users'

const mainRouter = Router({ mergeParams: true })
mainRouter.use('/register', registerRouter)

mainRouter.use('/login', loginRouter)

mainRouter.use('/users', usersRouter)

export default mainRouter
