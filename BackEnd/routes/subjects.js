const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả môn học kèm tên khoa
router.get('/subjects', (req, res) => {
  const query = `
    SELECT s.subject_id, s.subject_name, s.credit, d.department_name
    FROM subjects s
    JOIN departments d ON s.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//Lấy môn học theo mã khoa
router.get('/subjects/department/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;
  const query = `
    SELECT s.subject_id, s.subject_name, s.credit, d.department_name
    FROM subjects s
    JOIN departments d ON s.department_id = d.department_id
    WHERE s.department_id = ?
  `;
  db.query(query, [departmentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm môn học
router.post('/subjects', (req, res) => {
  const { subject_name, credit, department_id, year, semester } = req.body;

  const querySubject = "INSERT INTO subjects (subject_name, credit, department_id) VALUES (?, ?, ?)";
  db.query(querySubject, [subject_name, credit, department_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const subjectId = results.insertId;

    const queryCurriculum = "INSERT INTO curriculum (subject_id, year, semester, department_id) VALUES (?, ?, ?, ?)";
    db.query(queryCurriculum, [subjectId, year, semester, department_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.status(201).json({ 
        message: 'Thêm môn học thành công', 
        subject_id: subjectId 
      });
    });
  });
});

// Xóa môn học
router.delete('/subjects/:id', (req, res) => {
  const id = req.params.id;


  const queryCurriculum = 'DELETE FROM curriculum WHERE subject_id = ?';
  db.query(queryCurriculum, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
  });


  const query = 'DELETE FROM subjects WHERE subject_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Đã xoá môn học'});
  });
});

module.exports = router;