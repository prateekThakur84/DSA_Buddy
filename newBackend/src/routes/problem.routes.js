const express = require('express');

const problemRouter =  express.Router();
const {authenticateAdmin} = require("../middleware/auth.middleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem} = require("../controllers/problem.controller");
const {authenticateUser} = require("../middleware/auth.middleware");


// Create
problemRouter.post("/create",authenticateAdmin ,createProblem);
problemRouter.put("/update/:id",authenticateAdmin, updateProblem);
problemRouter.delete("/delete/:id",authenticateAdmin, deleteProblem);


problemRouter.get("/problemById/:id",authenticateUser,getProblemById);

problemRouter.get("/getAllProblem",authenticateUser, getAllProblem);
problemRouter.get("/problemSolvedByUser",authenticateUser, solvedAllProblembyUser);

problemRouter.get("/submittedProblem/:pid",authenticateUser,submittedProblem);


module.exports = problemRouter;
