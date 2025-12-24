const express = require('express');
const router = express.Router();
const db = require('../db');


// Lấy danh sách gán môn cho giảng viên
// GET /teacher-subjects
// Lấy danh sách môn theo giảng viên
router.get('/teacher-subjects/:teacher_id', (req, res) => {
  const teacherId = req.params.teacher_id;
  const query = `
    SELECT s.subject_id, s.subject_name, u.full_name
    FROM subjects s 
    JOIN teacher_subjects ts ON s.subject_id = ts.subject_id
    JOIN teachers t ON ts.teacher_id = t.teacher_id
    JOIN users u ON t.user_id = u.user_id
    WHERE t.teacher_id = ?
  `;
  db.query(query, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Gán nhiều môn cho giảng viên
router.post('/teacher-subjects', (req, res) => {
  const { teacher_id, subjectIds } = req.body;

  if (!teacher_id || !Array.isArray(subjectIds) || subjectIds.length === 0) {
    return res.status(400).json({ error: 'Thiếu teacher_id hoặc subjectIds' });
  }

  // Tạo mảng values để insert nhiều dòng
  const values = subjectIds.map(sid => [teacher_id, sid]);

  const query = `
    INSERT INTO teacher_subjects (teacher_id, subject_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE teacher_id=teacher_id
  `;

  db.query(query, [values], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, affectedRows: results.affectedRows });
  });
});
// Xóa gán môn
// router.delete('/teacher-subjects/:id', (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM teacher_subjects WHERE id = ?", [id], (err) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: 'Đã bỏ gán môn cho giảng viên' });
//   });
// });

module.exports = router;