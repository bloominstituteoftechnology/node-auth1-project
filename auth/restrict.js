const bcrypt = require("bcryptjs");
const db = require("./authModel");

function restrict() {
  return async (req, res, next) => {
    const error = { message: "Woops! Something's not right." };
    try {
      const { user_name, password } = req.headers;
      if (!user_name || !password) {
        return res.status(401).json(error);
      }
      const user = await db.findBy({ user_name }).first();
      if (!user) {
        return res.status(401).json(error);
      }
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        return res.status(401).json(error);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = restrict;
