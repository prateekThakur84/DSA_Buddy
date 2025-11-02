
const express = require('express');
const submitRouter = express.Router();
const {authenticateUser} = require("../middleware/auth.middleware");
const {submitCode,runCode} = require("../controllers/submission.controller");

submitRouter.post("/submit/:id", authenticateUser, submitCode);
submitRouter.post("/run/:id",authenticateUser,runCode);

module.exports = submitRouter;
