const express = require('express');
const router = express.Router();
const db = require('../db');




// Lấy danh sách tất cả giảng viên  (DÙNG CHO ManageSchedules.vue)
router.get('/teachers', (req, res) => {
  const query = `
    SELECT t.teacher_id, u.full_name, d.department_name
    FROM teachers t
    JOIN users u ON t.user_id = u.user_id
    JOIN departments d ON u.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get('/teachers/byDepartment/:department_id', (req, res) => {
  const departmentId = req.params.department_id;
  if (!departmentId) return res.status(400).json({ error: 'Thiếu department_id' });

  const q = `
    SELECT t.teacher_id, t.user_id, u.full_name, t.level, t.workplace
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE u.department_id = ?
    ORDER BY u.full_name
  `;
  db.query(q, [departmentId], (err, rows) => {
    if (err) {
      console.error('GET teachers/byDepartment error:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    // trả mảng rỗng nếu không có
    return res.json(Array.isArray(rows) ? rows : []);
  });
});


//Lấy ra cột level (dùng cho ManageAccounts.vue)
router.get('/teacher/level', (req, res) => {
  const sql = `
    SELECT COLUMN_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'teachers' AND COLUMN_NAME = 'level'
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy level:', err);
      return res.status(500).json({ error: err });
    }

    // Kết quả: enum('Cao đẳng','Cử nhân','Thạc sĩ','Tiến sĩ','Phó Giáo sư','Giáo sư')
    const enumStr = results[0].COLUMN_TYPE;
    const levels = enumStr
      .replace(/^enum\(/, '')   // bỏ chữ enum(
      .replace(/\)$/, '')       // bỏ dấu )
      .split(',')
      .map(v => v.replace(/'/g, '')); // bỏ dấu '

    res.json(levels);
  });
});


// Lấy thông tin giảng viên theo user_id (cho phần mounted của TeacherProfile.vue)
router.get('/teachers/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT u.user_id,
      u.full_name,
      u.phone,
      d.department_name,
      t.teach_note,
      t.level,
      t.workplace,
      GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
      FROM teachers t 
      JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
      JOIN subjects s ON ts.subject_id = s.subject_id
      JOIN departments d ON d.department_id = s.department_id
      JOIN users u ON d.department_id = u.department_id
      WHERE u.user_id = ?

  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Lỗi server", error: err });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ giảng viên" });
    }

    res.json({ success: true, teacher: results[0] });
  });
});



// Cập nhật thông tin giảng viên theo user_id
router.put('/teachers/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { full_name, phone, teach_note, level, workplace } = req.body;

  const updateTeacher = `
   UPDATE teachers
    SET teach_note = COALESCE(?, teach_note),
    level = COALESCE(?, level),
    workplace = COALESCE(?, workplace)
    WHERE user_id = ?
  `;

  db.query(updateTeacher, [teach_note, level, workplace, userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Lỗi server khi cập nhật", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ giảng viên" });
    }

    // Đồng bộ thông tin cơ bản vào bảng users
    const updateUser = `
      UPDATE users
      SET full_name=?, phone=?
      WHERE user_id=?
    `;
    db.query(updateUser, [full_name, phone, userId], (err2) => {
      if (err2) console.error('Lỗi cập nhật user:', err2);
    });

    res.json({ success: true, message: "Cập nhật hồ sơ thành công", user_id: userId });
  });
});




module.exports = router;