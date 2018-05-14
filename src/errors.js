module.exports = {
  userNotLoggedIn: {
    status: 401,
    error: 'Please login before attempting to access this page'
  },
  userTokenExpired: {
    status: 400,
    error: 'Your session has expired. Please login again'
  },
  usersFetch: {
    status: 500,
    error: 'Unable to fetch users'
  },
  userLoginMissingFields: {
    status: 401,
    error: 'Please provide a username and password'
  },
  userRegisterMissingName: {
    status: 400,
    error: 'Please provide a username'
  },
  userRegisterMissingPassword: {
    status: 400,
    error: 'Please provide a password'
  },
  userRegisterInvalidPassword: {
    status: 400,
    error: 'Please provide a password at least 7 characters long'
  }
}