// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

const { useStore } = require("react-redux");
const { router } = require("../server");


/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
router.get("/", restriced, (req, res, next) => {
useStore.find()
.then(users => {
  res.status(200).json(users)

})
})



} )
// Don't forget to add the router to the `exports` object so it can be required in other modules
