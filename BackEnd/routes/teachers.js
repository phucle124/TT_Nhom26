const express = require('express');
const router = express.Router();
const db = require('../db');




// Lấy danh sách tất cả giảng viên
router.get('/teachers', (req, res) => {
  const query = `
    SELECT t.teacher_id, t.full_name, t.email, t.phone, d.department_name
    FROM teachers t
    LEFT JOIN departments d ON t.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


/**
 * Kiểm tra hồ sơ giảng viên theo user_id
 * - exists = false: chưa có bản ghi nào trong bảng teachers
 * - exists = true, complete = false: record thiếu thông tin bắt buộc
 * - exists = true, complete = true: perfect record
 */
router.get('/teachers/:user_id/check-profile', (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM teachers WHERE user_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (!results[0]) {
      // chưa có hồ sơ
      return res.json({ exists: false, complete: false });
    }

    const t = results[0];
    // kiểm tra các trường bắt buộc (khi thêm vào từ giao diện)
    const isComplete = t.full_name && t.email && t.phone && t.department_id;

    res.json({
      exists: true,
      complete: !!isComplete,
      teacher_id: t.teacher_id
    });
  });
});



/**
 * Lấy thông tin giảng viên theo user_id
 * - exists = false: chưa có hồ sơ
 * - exists = true: trả về dữ liệu hồ sơ
 */
router.get('/teachers/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  console.log("🔍 CHECK USER_ID:", user_id);
  const query = `
    SELECT t.teacher_id, t.full_name, t.email, t.phone, d.department_name,
           GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
    FROM teachers t
    LEFT JOIN departments d ON t.department_id = d.department_id
    LEFT JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
    LEFT JOIN subjects s ON ts.subject_id = s.subject_id
    WHERE t.user_id = ?
    GROUP BY t.teacher_id;
  `;
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results[0]) {
      return res.json({ exists: false, teacher: null });
    }
    res.json({ exists: true, teacher: results[0] });
  });
});

//Cập nhật thông tin giảng viên theo teacher_id


router.put('/teachers/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { full_name, email, phone, department_id } = req.body;

  // Lấy username, password từ bảng users
  const userSql = "SELECT username, password FROM users WHERE user_id=?";
  db.query(userSql, [userId], (errUser, userResults) => {
    if (errUser) return res.status(500).json({ success: false, message: "Lỗi server khi lấy user" });
    if (userResults.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy user" });

    const { username, password } = userResults[0];

    // Kiểm tra xem đã có hồ sơ chưa
    const checkSql = "SELECT * FROM teachers WHERE user_id=?";
    db.query(checkSql, [userId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Lỗi server" });

      if (results.length > 0) {
        // Đã có hồ sơ → UPDATE
        const updateSql = "UPDATE teachers SET full_name=?, email=?, phone=?, department_id=?, username=?, password=? WHERE user_id=?";
        db.query(updateSql, [full_name, email, phone, department_id, username, password, userId], (err2) => {
          if (err2) return res.status(500).json({ success: false, message: "Lỗi server" });
          return res.json({ success: true, message: "Cập nhật hồ sơ thành công" });
        });
      } else {
        // Chưa có hồ sơ → INSERT
        const insertSql = "INSERT INTO teachers (user_id, full_name, email, phone, department_id, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(insertSql, [userId, full_name, email, phone, department_id, username, password], (err3, result) => {
          if (err3) return res.status(500).json({ success: false, message: "Lỗi server" });
          return res.json({ success: true, message: "Tạo hồ sơ giảng viên thành công", teacher_id: result.insertId });
        });
      }
    });
  });
});


module.exports = router;