const express = require("express");
const prController = require("../controllers/prController");

const prRouter = express.Router();

prRouter.post("/pr/create/:userId", prController.createPR);
prRouter.get("/prs", prController.getPRs);
prRouter.get("/pr/:id", prController.getPRById);
prRouter.put("/pr/update/:id", prController.updatePR);
prRouter.delete("/pr/delete/:id", prController.deletePR);

module.exports = prRouter;
