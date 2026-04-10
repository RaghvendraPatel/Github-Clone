const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.post("/repo/star/:repoId", repoController.starRepository);
repoRouter.post("/repo/unstar/:repoId", repoController.unstarRepository);
repoRouter.get("/starred/:userId", repoController.getStarredRepositories);

module.exports = repoRouter;