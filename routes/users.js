import { Router } from 'express'
import User from '../models/users'
const usersRouter = Router({ mergeParams: true })

const authenticate = (req, res, next) =>
  req.session && req.session.username
    ? next()
    : res.status(401).send('Mithrandil looks down upon you')

usersRouter.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find()
      .select('username')
      .exec()
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

export default usersRouter
