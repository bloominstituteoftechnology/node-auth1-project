const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");

module.exports = server => {
  const protected = (req, res, next) => {
    const {path} = req
    let reg = /(?:api\/)(\w+)\/*/g
    let destination = reg.exec(path)[1]
    if (destination === 'users' || destination === 'restricted'){
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ message: "hit the bricks, bozo!" });
          } 
    }
    next();
  };
  server.use(express.json());
  server.use(session(sessionConfig));
  server.use(cors());
  server.use(protected);
  server.use(helmet());

  return server;
};
