const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.post("/follow/:userId", userController.followUser);
userRouter.post("/unfollow/:userId", userController.unfollowUser);
userRouter.get("/followers/:userId", userController.getFollowers);
userRouter.get("/following/:userId", userController.getFollowing);

module.exports = userRouter;