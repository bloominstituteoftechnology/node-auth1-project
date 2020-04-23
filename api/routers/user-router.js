const router = require("express").Router();

const UserTbl = require("../../dbModels/users-model.js");

router.get("/", (req, res) => {
  UserTbl.findUsers()
    .then((userList) => {
      res.send(userList);
    })
    .catch((err) => {
      res.status(500).json({ message: "exception", error: err });
    });
});

module.exports = router;
