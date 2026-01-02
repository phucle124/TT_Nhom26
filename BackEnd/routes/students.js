const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy danh sách tất cả sinh viên
router.get('/students', (req, res) => {
  const query = `
    SELECT s.student_id, c.class_name, d.department_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    JOIN departments d ON s.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Lấy thông tin sinh viên theo user id  (LẤY THÔNG TIN CHO PHẦN MOUNTED)
// routes/students.js
router.get('/students/user/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.student_id, s.year_start, s.current_address, s.class_id, c.class_name,
           u.user_id, u.full_name, u.phone, u.department_id, d.department_name
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN departments d ON u.department_id = d.department_id
    WHERE s.user_id = ?
    LIMIT 1
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching student by user id:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
    }
    res.json(results[0]);
  });
});



// PĐT gán lớp/khoa cho sinh viên từ bảng users
router.post('/students/assign/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { class_id, department_id } = req.body;

  const queryUser = `SELECT username, password
                     FROM users 
                     WHERE user_id = ? AND role = 'Sinh_vien'`;

  db.query(queryUser, [userId], (err, userResults) => {
    if (err) {
      console.error('Lỗi truy vấn users:', err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy user' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user Sinh_vien' });
    }

    const { username, password } = userResults[0];

    // email và phone để rỗng, sinh viên sẽ tự nhập sau
    const queryInsert = `
      INSERT INTO students (user_id, full_name, username, password, email, phone, class_id, department_id)
      VALUES (?, ?, ?, ?, '', '', ?, ?)
      ON DUPLICATE KEY UPDATE 
        class_id = VALUES(class_id), 
        department_id = VALUES(department_id)
    `;

    db.query(queryInsert, [userId, username, username, password, class_id, department_id], (err2) => {
      if (err2) {
        console.error('Lỗi insert/update students:', err2);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gán lớp/khoa' });
      }
      res.json({ success: true, message: 'Gán lớp/khoa thành công' });
    });
  });
});


// Thêm mới sinh viên
// Tạo hồ sơ sinh viên theo user_id
router.post('/students/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { full_name, email, phone, class_id, department_id } = req.body;

  const query = `
    INSERT INTO students (user_id, class_id, department_id)
    VALUES (?, ?, ?)
  `;
  db.query(query, [userId, class_id, department_id], (err, results) => {
    if (err) {
      console.error('Lỗi thêm hồ sơ:', err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
    res.status(201).json({ success: true, message: 'Tạo hồ sơ thành công', id: results.insertId });
  });
});


// Lấy thông tin sinh viên theo user_id
router.get('/students/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = `
    SELECT s.student_id, s.user_id, d.department_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    JOIN departments d ON s.department_id = d.department_id
    WHERE s.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
    }
    res.json(results[0]); // trả về object trực tiếp có user_id
  });
});

// Cập nhật thông tin sinh viên theo user_id
router.put('/students/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { full_name, email, phone, class_id, current_address,department_id } = req.body;

  const query = `
    UPDATE students
    SET full_name = ?, phone = ?, class_id = ?, current_address = ?, department_id = ?
    WHERE user_id = ?
  `;
  db.query(query, [full_name, phone, class_id, current_address, department_id, userId], (err, result) => {
    if (err) {
      console.error('Lỗi cập nhật:', err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên để cập nhật' });
    }
    res.json({ success: true, message: 'Cập nhật thành công' });
  });
});

//Dùng cho admin gán lớp/khoa cho sinh viên
router.put('/students/assign/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { class_id, department_id } = req.body;
  const query = `
    UPDATE students
    SET class_id = ?, department_id = ?
    WHERE user_id = ?
  `;
  db.query(query, [class_id, department_id, userId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
    res.json({ success: true, message: 'Gán lớp/khoa thành công' });
  });
});

// Cập nhật hồ sơ sinh viên (chỉ thông tin cá nhân trong bảng users)
router.put('/students/profile/:id', (req, res) => {
  const { id } = req.params;
  const { phone, current_address } = req.body;
  const queryUser = `UPDATE users SET phone = ? WHERE user_id = ?`;
  const queryStudent = `UPDATE students SET current_address = ? WHERE user_id = ?`;
  db.query(queryUser, [phone, id], (err) => {
    if (err) return res.status(500).json({ error: err });

    db.query(queryStudent, [current_address,id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    });
  });
});


module.exports = router;