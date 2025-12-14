const express = require('express');
const router = express.Router();
const db = require('../db');




// Lấy danh sách tất cả giảng viên  (DÙNG CHO ManageSchedules.vue)
router.get('/teachers', (req, res) => {
  const query = `
    SELECT t.teacher_id, t.phone, d.department_name
    FROM teachers t
    LEFT JOIN departments d ON t.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
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
    SELECT 
      u.user_id,
      u.full_name,
      u.phone,
      d.department_name,
      t.teach_note,
      t.level,
      t.workplace,
      GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
    FROM teachers t
    JOIN users u ON t.user_id = u.user_id
    JOIN departments d ON u.department_id = d.department_id
    LEFT JOIN subjects s ON d.department_id = s.department_id
    WHERE t.user_id = ?
    GROUP BY u.user_id, u.full_name, u.phone, d.department_name, t.teach_note, t.level, t.workplace;

  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Lỗi server", error: err });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ giảng viên" });
    }

    res.json({ success: true, teacher: results[0] });
  });
});


// Thêm mới giảng viên
router.post('/teachers', (req, res) => {
  const { user_id, full_name, email, department_id, level, workplace, birth, address, phone, idCard } = req.body;

  const sql = `
    INSERT INTO teachers (user_id, full_name, email, department_id, level, workplace)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, full_name, email, department_id, level, workplace], (err, results) => {
    if (err) {
      console.error('Lỗi thêm giảng viên:', err);
      return res.status(500).json({ error: err });
    }

    // Nếu muốn đồng bộ thông tin cá nhân vào bảng users
    const updateUser = `
      UPDATE users 
      SET id_card=?, birth=?, address=?, phone=? 
      WHERE user_id=?
    `;
    db.query(updateUser, [idCard, birth, address, phone, user_id], (err2) => {
      if (err2) console.error('Lỗi cập nhật user:', err2);
    });

    res.json({ success: true, id: results.insertId });
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