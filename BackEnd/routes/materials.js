const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const db = require("../db");

// Upload tài liệu PDF
router.post("/materials/upload", (req, res) => {
  const { subject_id, uploader_id, teacher_id, class_id, name } = req.body;

  if (!subject_id) {
    return res.status(400).json({ success: false, message: "subject_id không được để trống" });
  }

  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: "Không có file upload" });
  }

  const file = req.files.file;
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ success: false, message: "Chỉ được phép upload file PDF" });
  }

  const uploadDir = path.join(__dirname, "../uploads/materials");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = Date.now() + "-" + file.name;
  const filePath = path.join(uploadDir, fileName);

  file.mv(filePath, (err) => {
    if (err) {
    console.error("Lỗi lưu file:", err);
    return res.status(500).json({ success: false, error: err });
  }

    console.log("File đã lưu tại:", filePath);
    const relativePath = "/uploads/materials/" + fileName;

    const sql = `
      INSERT INTO materials (subject_id, uploader_id, teacher_id, class_id, name, file_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [subject_id, uploader_id, teacher_id || null, class_id || null, name, relativePath], (err2, result) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });
      res.json({ success: true, material_id: result.insertId, file: fileName, path: relativePath });
    });
  });
});

module.exports = router;