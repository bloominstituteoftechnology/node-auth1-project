const bcrypt = require("bcryptjs")
const RouterModel = require('../routers/modelRouter')

function blockUser() {
    return async (req, res, next) => {
        try {
            if(!req.session || !req.session.user) {
                res.status(401).json({message:"User Does not Exist"})
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = blockUser