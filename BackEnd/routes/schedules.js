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

// Lấy lịch dạy của giảng viên từ user_id
router.get('/schedules/lecturer/byUser/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // B1: Lấy teacher_id từ bảng teachers
  const queryTeacher = `SELECT teacher_id FROM teachers WHERE user_id = ?`;

  db.query(queryTeacher, [userId], (err, teacherResults) => {
    if (err) return res.status(500).json({ error: err });
    if (teacherResults.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const teacherId = teacherResults[0].teacher_id;

    // B2: Lấy lịch dạy từ bảng schedules theo teacher_id
    const querySchedules = `
      SELECT sch.schedule_id, sub.subject_name, sch.day, sch.start_time, sch.end_time, sch.room, c.class_name
      FROM schedules sch
      JOIN subjects sub ON sch.subject_id = sub.subject_id
      JOIN classes c ON sch.class_id = c.class_id
      WHERE sch.teacher_id = ?
    `;

    db.query(querySchedules, [teacherId], (err, scheduleResults) => {
      if (err) return res.status(500).json({ error: err });
      res.json(scheduleResults);
    });
  });
});

// Lấy lịch học của sinh viên từ user_id
router.get('/schedules/student/byUser/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // B1: Lấy class_id từ bảng students
  const queryStudent = `SELECT class_id FROM students WHERE user_id = ?`;
  db.query(queryStudent, [userId], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err });
    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const classId = studentResults[0].class_id;

    // B2: Lấy lịch học từ bảng schedules theo class_id
    const querySchedules = `
      SELECT sch.schedule_id,
             sub.subject_name,
             sch.day,
             sch.start_time,
             sch.end_time,
             sch.room,
             t.full_name AS teacher_name
      FROM schedules sch
      JOIN subjects sub ON sch.subject_id = sub.subject_id
      JOIN teachers t ON sch.teacher_id = t.teacher_id
      WHERE sch.class_id = ?
    `;
    db.query(querySchedules, [classId], (err, scheduleResults) => {
      if (err) return res.status(500).json({ error: err });
      res.json(scheduleResults);
    });
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