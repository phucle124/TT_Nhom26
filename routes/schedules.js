const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách lịch học
router.get('/schedules', (req, res) => {
    const query = `
    SELECT s.schedule_id, sub.subject_name, s.room, s.start_time, s.end_time, c.name AS class_name, t.full_name AS teacher_name
    FROM schedules s
    JOIN subjects sub ON s.subject_id = sub.subject_id
    JOIN teachers t ON sub.teacher_name = t.full_name
    JOIN classes c ON s.student_id = c.id
  `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Thêm lịch học
router.post('/schedules', (req, res) => {
    const { subject_id, room, start_time, end_time, student_id } = req.body;
    db.query(
        'INSERT INTO schedules (subject_id, room, start_time, end_time, student_id, note) VALUES (?, ?, ?, ?, ?, ?)',
        [subject_id, room, start_time, end_time, student_id, ''],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, id: results.insertId });
        }
    );
});

module.exports = router;