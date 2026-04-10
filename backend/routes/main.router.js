const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");
const commentRouter = require("./comment.router");
const prRouter = require("./pr.router");

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(commentRouter);
mainRouter.use(prRouter);

mainRouter.get("/", (req, res) => {
  res.send("Welcome to GitHub Clone API!");
});

module.exports = mainRouter;