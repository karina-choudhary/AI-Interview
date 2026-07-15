const express = require("express");
const router = express.Router();

const upload = require("../config/middlware/upload.middleware");
const Resume = require("../models/Resume.model");
const{getAllResumes,deleteResume,updateResume}= require("../controllers/resume.controller");
const authmiddleware= require("../config/middlware/auth.middleware");

router.post("/upload", authmiddleware, upload.single("resume"), async (req, res) => {
  try {
    const resume = await Resume.create({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      user:req.user.id,
    });

    res.status(200).json({
      message: "Resume Uploaded Successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;