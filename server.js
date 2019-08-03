

const express = require("express");

const userRouter = require("./users/userRouter.js");

const server = express();

server.use(logger);
server.use(express.json());
server.use("/api/users", userRouter);
server.use("/", (req, res) => res.send("API up and running!"));

/*
server.use(validateUserId);
server.use(validateUser);
server.use(validatePost);
*/

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const date = new Date();
  const timestamp = date.toUTCString();
  console.log(
    `(${timestamp}) Request method: ${req.method}, Request URL: ${
      req.originalUrl
    }`
  );
  next();
}

module.exports = server;
