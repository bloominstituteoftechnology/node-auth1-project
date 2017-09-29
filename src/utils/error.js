const STATUS_USER_ERROR = 422;

module.exports = {
  /* Sends the given err, a string or an object, to the client. Sets the status
   code appropriately. */
  sendUserError: (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
      res.json({ message: err.message, stack: err.stack });
    } else {
      res.json({ error: err });
    }
  }
};
