const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả thông báo (BỎ , KHÔNG DÙNG)
// router.get('/notifications', (req, res) => {
//   db.query('SELECT * FROM notifications ORDER BY create_day DESC', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// Lấy thông báo cho sinh viên theo user_id
router.get('/notifications/student/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY create_day DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// Gửi thông báo toàn trường (admin) (SOURCE CŨ)
// router.post('/notifications', (req, res) => {
// //   console.log("Request body:", req.body);     //Dùng để theo dõi dữ liệu json trả về ở terminal (dùng cho debug)
//   const { name, content, user_id } = req.body;

//   if (user_id != 1) {
//     return res.status(403).json({ success: false, message: "Chỉ admin mới được gửi thông báo toàn trường" });
//   }

//   // lấy tất cả user_id ngoại trừ admin
//   const getUsers = `SELECT user_id FROM users WHERE user_id != 1`;
//   db.query(getUsers, (err, users) => {
//     if (err) return res.status(500).json({ success: false, error: err });

//     const sql = `
//       INSERT INTO notifications (name, content, create_day, type, subject_id, user_id)
//       VALUES (?, ?, NOW(), ?, ?, ?)
//     `;

//     users.forEach(u => {
//       db.query(sql, [name, content, "Toàn trường", null, u.user_id], (err) => {
//         if (err) console.error("Lỗi thêm thông báo cho user id: ", u.user_id, ":", err);
//       });
//     });

//     //trả về response ngay sau khi chạy xong forEach
//     res.json({ success: true, message: "Thông báo đã gửi cho tất cả sinh viên" });
//   });
// });

// Gửi thông báo ở phía PĐT và giảng viên
router.post('/notifications', (req, res) => {
  const { name, content, user_id, type, subject_id } = req.body;

  // Lấy role của người gửi
  const getRoleSql = `SELECT role FROM users WHERE user_id = ?`;
  db.query(getRoleSql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User không tồn tại" });

    const role = results[0].role;

    // Nếu là PĐT 
    if (role === 'PĐT') {
      const getUsers = `SELECT user_id FROM users WHERE role != 'PĐT'`;
      db.query(getUsers, (err2, users) => {
        if (err2) return res.status(500).json({ success: false, error: err2 });

        const sql = `
          INSERT INTO notifications (name, content, create_day, type, subject_id, user_id)
          VALUES (?, ?, NOW(), ?, ?, ?)
        `;

        users.forEach(u => {
          db.query(sql, [name, content, "Toàn trường", null, u.user_id], (err3) => {
            if (err3) console.error("Lỗi thêm thông báo cho user id:", u.user_id, ":", err3);
          });
        });

        return res.json({ success: true, message: "Thông báo toàn trường đã gửi" });
      });
    }

    // Nếu là Giảng viên 
    else if (role === 'Giang_vien') {
      if (type !== 'Cá nhân' && type !== 'Môn học') {
        return res.status(400).json({ success: false, message: "Giảng viên chỉ được gửi thông báo Cá nhân hoặc Môn học" });
      }

      const getStudents = `SELECT user_id FROM users WHERE role = 'Sinh_vien'`;
      db.query(getStudents, (err2, students) => {
        if (err2) return res.status(500).json({ success: false, error: err2 });

        const sql = `
          INSERT INTO notifications (name, content, create_day, type, subject_id, user_id)
          VALUES (?, ?, NOW(), ?, ?, ?)
        `;

        students.forEach(s => {
          db.query(sql, [name, content, type, type === 'Môn học' ? subject_id : null, s.user_id], (err3) => {
            if (err3) console.error("Lỗi thêm thông báo cho sinh viên id:", s.user_id, ":", err3);
          });
        });

        return res.json({ success: true, message: `Thông báo ${type} đã gửi cho tất cả sinh viên` });
      });
    }

    // Các role khác không được phép
    else {
      return res.status(403).json({ success: false, message: "Role này không được phép gửi thông báo" });
    }
  });
});

module.exports = router;