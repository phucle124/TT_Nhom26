const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả lịch học
router.get('/schedules', (req, res) => {
  const query = `
    SELECT sch.schedule_id, sub.subject_name, c.class_name, t.full_name AS teacher_name,
           sch.day, sch.start_time, sch.end_time, sch.room
    FROM schedules sch
    JOIN subjects sub ON sch.subject_id = sub.subject_id
    JOIN classes c ON sch.class_id = c.class_id
    JOIN teachers t ON sch.teacher_id = t.teacher_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Lấy danh sách môn mà giảng viên được gán
router.get('/teacher-subjects/:teacher_id', (req, res) => {
  const { teacher_id } = req.params;
  const query = `
    SELECT sub.subject_id, sub.subject_name
    FROM teacher_subjects ts
    JOIN subjects sub ON ts.subject_id = sub.subject_id
    WHERE ts.teacher_id = ?
  `;
  db.query(query, [teacher_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm lịch học
router.post('/schedules', (req, res) => {
  const { subject_id, class_id, teacher_id, day, start_time, end_time, room } = req.body;
  const query = `
    INSERT INTO schedules (subject_id, class_id, teacher_id, day, start_time, end_time, room)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [subject_id, class_id, teacher_id, day, start_time, end_time, room], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Schedule added', id: results.insertId });
  });
});

// Xóa lịch học
router.delete('/schedules/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM schedules WHERE schedule_id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Schedule deleted' });
  });
});

module.exports = router;