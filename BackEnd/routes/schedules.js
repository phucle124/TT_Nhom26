const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql or mysql2 connection/pool using callback API


 //  Lấy tất cả lịch học, join qua course_classes -> subjects, teachers -> users */
router.get('/schedules', (req, res) => {
  const query = `
    SELECT
      sch.schedule_id,
      sch.course_class_id,
      cc.subject_id,
      sub.subject_name,
      cc.teacher_id,
      u.user_id AS teacher_user_id,
      u.full_name AS teacher_name,
      cc.semester,
      cc.academic_year,
      sch.day,
      sch.start_time,
      sch.end_time,
      sch.room
    FROM schedules sch
    LEFT JOIN course_classes cc ON sch.course_class_id = cc.course_class_id
    LEFT JOIN subjects sub ON cc.subject_id = sub.subject_id
    LEFT JOIN teachers t ON cc.teacher_id = t.teacher_id
    LEFT JOIN users u ON t.user_id = u.user_id
    ORDER BY sch.day, sch.start_time;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('GET /schedules error:', err);
      return res.status(500).json({ error: 'Lỗi server khi lấy lịch' });
    }
    res.json(results);
  });
});


//   Lấy danh sách môn giảng viên được gán (teacher_subjects) 
router.get('/teacher-subjects/:teacher_id', (req, res) => {
  const { teacher_id } = req.params;
  const query = `
    SELECT sub.subject_id, sub.subject_name
    FROM teacher_subjects ts
    JOIN subjects sub ON ts.subject_id = sub.subject_id
    WHERE ts.teacher_id = ?
  `;
  db.query(query, [teacher_id], (err, results) => {
    if (err) {
      console.error('GET /teacher-subjects error:', err);
      return res.status(500).json({ error: 'Lỗi server khi lấy môn giảng viên' });
    }
    res.json(results);
  });
});


 //  Lấy danh sách course_classes mà giảng viên được gán 
router.get('/teacher-course-classes/:teacher_id', (req, res) => {
  const { teacher_id } = req.params;
  const query = `
    SELECT cc.course_class_id, cc.subject_id, sub.subject_name, cc.semester, cc.academic_year, cc.capacity, cc.window_id, cc.department_id
    FROM course_classes cc
    LEFT JOIN subjects sub ON cc.subject_id = sub.subject_id
    WHERE cc.teacher_id = ?
  `;
  db.query(query, [teacher_id], (err, results) => {
    if (err) {
      console.error('GET /teacher-course-classes error:', err);
      return res.status(500).json({ error: 'Lỗi server khi lấy lớp học phần của giảng viên' });
    }
    res.json(results);
  });
});


//   Lấy lịch dạy của giảng viên theo user_id 
router.get('/schedules/lecturer/byUser/:user_id', (req, res) => {
  const userId = req.params.user_id;
  db.query('SELECT teacher_id FROM teachers WHERE user_id = ?', [userId], (err, teacherRows) => {
    if (err) {
      console.error('GET teacher by user error:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    if (!teacherRows || teacherRows.length === 0) return res.status(404).json({ error: 'Teacher not found' });
    const teacherId = teacherRows[0].teacher_id;

    const query = `
      SELECT sch.schedule_id, sch.course_class_id, sub.subject_name, cc.semester, cc.academic_year, sch.day, sch.start_time, sch.end_time, sch.room
      FROM schedules sch
      LEFT JOIN course_classes cc ON sch.course_class_id = cc.course_class_id
      LEFT JOIN subjects sub ON cc.subject_id = sub.subject_id
      WHERE cc.teacher_id = ?
      ORDER BY sch.day, sch.start_time
    `;
    db.query(query, [teacherId], (err2, scheduleResults) => {
      if (err2) {
        console.error('GET schedules by teacher error:', err2);
        return res.status(500).json({ error: 'Lỗi server' });
      }
      res.json(scheduleResults);
    });
  });
});

/* GET /api/schedules/student/byUser/:user_id
   Lấy lịch học của sinh viên theo user_id:
   - tìm student_id từ students.user_id
   - lấy enrollments.course_class_id cho student_id
   - lấy schedules cho các course_class_id đó
*/
router.get('/schedules/student/byUser/:user_id', (req, res) => {
  const userId = req.params.user_id;

  db.query('SELECT student_id FROM students WHERE user_id = ?', [userId], (err, studentRows) => {
    if (err) {
      console.error('GET student by user error:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    if (!studentRows || studentRows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const studentId = studentRows[0].student_id;

    db.query('SELECT course_class_id FROM enrollments WHERE student_id = ? AND status = "Thành công"', [studentId], (err2, enrollRows) => {
      if (err2) {
        console.error('GET enrollments error:', err2);
        return res.status(500).json({ error: 'Lỗi server' });
      }
      if (!enrollRows || enrollRows.length === 0) return res.json([]);

      const courseClassIds = enrollRows.map(r => r.course_class_id);
      const placeholders = courseClassIds.map(() => '?').join(',');

      const query = `
        SELECT sch.schedule_id, sch.course_class_id, sub.subject_name, cc.semester, cc.academic_year, sch.day, sch.start_time, sch.end_time, sch.room, u.full_name AS teacher_name
        FROM schedules sch
        LEFT JOIN course_classes cc ON sch.course_class_id = cc.course_class_id
        LEFT JOIN subjects sub ON cc.subject_id = sub.subject_id
        LEFT JOIN teachers t ON cc.teacher_id = t.teacher_id
        LEFT JOIN users u ON t.user_id = u.user_id
        WHERE sch.course_class_id IN (${placeholders})
        ORDER BY sch.day, sch.start_time
      `;
      db.query(query, courseClassIds, (err3, scheduleResults) => {
        if (err3) {
          console.error('GET schedules for student error:', err3);
          return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(scheduleResults);
      });
    });
  });
});


//Thêm lịch
router.post('/schedules', (req, res) => {
  const { course_class_id, day, start_time, end_time, room } = req.body;

  if (!course_class_id || !day || !start_time || !end_time || room === undefined) {
    return res.status(400).json({ error: 'Thiếu tham số bắt buộc: course_class_id, day, start_time, end_time, room' });
  }

  const insertQ = `
    INSERT INTO schedules (course_class_id, day, start_time, end_time, room)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQ, [course_class_id, day, start_time, end_time, room], (err, result) => {
    if (err) {
      console.error('insert schedule error:', err);
      return res.status(500).json({ error: 'Lỗi server khi thêm lịch' });
    }
    return res.status(201).json({ message: 'Schedule added', id: result.insertId });
  });
});

/* DELETE /api/schedules/:id */
router.delete('/schedules/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM schedules WHERE schedule_id = ?', [id], (err, result) => {
    if (err) {
      console.error('DELETE /schedules error:', err);
      return res.status(500).json({ error: 'Lỗi server khi xóa lịch' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  });
});

module.exports = router;