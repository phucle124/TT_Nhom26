const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả lớp kèm môn học và khoa
router.get('/classes', (req, res) => {
  const query = `
    SELECT c.class_id, c.class_name, c.year, s.subject_name, d.department_name
    FROM classes c
    JOIN subjects s ON c.subject_id = s.subject_id
    JOIN departments d ON s.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm lớp
router.post('/classes', (req, res) => {
  const { class_name, year, subject_id } = req.body;
  const query = "INSERT INTO classes (class_name, year, subject_id) VALUES (?, ?, ?)";
  db.query(query, [class_name, year, subject_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Đã thêm lớp', id: results.insertId });
  });
});

// Xóa lớp
router.delete('/classes/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM classes WHERE class_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Đã xóa lớp' });
  });
});

module.exports = router;