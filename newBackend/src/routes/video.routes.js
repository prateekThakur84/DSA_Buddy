const express = require('express');
const {authenticateAdmin} = require('../middleware/auth.middleware');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/video.controller")

videoRouter.get("/create/:problemId",authenticateAdmin,generateUploadSignature);
videoRouter.post("/save",authenticateAdmin,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",authenticateAdmin,deleteVideo);


module.exports = videoRouter;