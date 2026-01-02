const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const db = require("../db");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/materials")); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/test", upload.single("file"), (req, res) => {
  console.log("File nhận được:", req.file);
  res.send({ success: true, file: req.file.filename });
});



module.exports = router;