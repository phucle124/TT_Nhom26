const express = require('express');
const router = express.Router();
const db = require('../db');


// Lấy danh sách gán môn cho giảng viên
// GET /teacher-subjects
router.get('/teacher-subjects', (req, res) => {
  const query = `
    SELECT ts.id, t.full_name, d.department_name, s.subject_name
    FROM teacher_subjects ts
    JOIN teachers t ON ts.teacher_id = t.teacher_id
    JOIN departments d ON t.department_id = d.department_id
    JOIN subjects s ON ts.subject_id = s.subject_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Gán môn cho giảng viên
router.post('/teacher-subjects', (req, res) => {
  const { teacher_id, subject_id } = req.body;
  if (!teacher_id || !subject_id) {
    return res.status(400).json({ error: 'Thiếu teacher_id hoặc subject_id' });
  }
  const query = `
    INSERT INTO teacher_subjects (teacher_id, subject_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE teacher_id=teacher_id
  `;
  db.query(query, [teacher_id, subject_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Đã gán môn cho giảng viên', id: results.insertId });
  });
});

// Xóa gán môn
router.delete('/teacher-subjects/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM teacher_subjects WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Đã bỏ gán môn cho giảng viên' });
  });
});

module.exports = router;