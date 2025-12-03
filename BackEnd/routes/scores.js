const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách điểm (join sinh viên + môn học)
router.get('/scores', (req, res) => {
  const query = `
    SELECT sc.score_id, st.student_id, st.full_name, sub.subject_name,
           sc.attendance, sc.midterm, sc.final, sc.total
    FROM scores sc
    JOIN students st ON sc.student_id = st.student_id
    JOIN subjects sub ON sc.subject_id = sub.subject_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm hoặc cập nhật điểm cho sinh viên
router.post('/scores', (req, res) => {
  const { student_id, subject_id, attendance, midterm, final } = req.body;
  const query = `
    INSERT INTO scores (student_id, subject_id, attendance, midterm, final)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE attendance=?, midterm=?, final=?,
      total=(attendance*0.2 + midterm*0.3 + final*0.5)
  `;
  db.query(query, [student_id, subject_id, attendance, midterm, final, attendance, midterm, final], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Điểm đã được lưu thành công' });
  });
});

module.exports = router;