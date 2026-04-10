const express = require("express");
const commentController = require("../controllers/commentController");

const commentRouter = express.Router();

commentRouter.post("/comment/create/:userId", commentController.createComment);
commentRouter.get("/comments", commentController.getComments);
commentRouter.put("/comment/update/:id", commentController.updateComment);
commentRouter.delete("/comment/delete/:id", commentController.deleteComment);

module.exports = commentRouter;
