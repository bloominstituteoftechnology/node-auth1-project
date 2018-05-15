import { Router } from 'express'
import User from '../models/users'
const loginRouter = Router({ mergeParams: true })

loginRouter.post('/', (req, res) => {
  const { username, password } = req.body
  User.findOne({ username })
    .then(user => {
      if (user) {
        user.isPasswordValid(password).then(isValid => {
          if (isValid) {
            req.session.username = user.username
            res.send('have a cookie')
          } else {
            res.status(401).send('invalid password')
          }
        })
      } else {
        res.status(401).send('invalid username')
      }
    })
    .catch(err => res.send(err))
})

export default loginRouter
