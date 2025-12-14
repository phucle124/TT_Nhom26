const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả thông báo (BỎ , KHÔNG DÙNG)
router.get('/notifications', (req, res) => {
  db.query('SELECT * FROM notifications ORDER BY create_day DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

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


// Gửi thông báo toàn trường (admin)
router.post('/notifications', (req, res) => {
//   console.log("Request body:", req.body);     //Dùng để theo dõi dữ liệu json trả về ở terminal (dùng cho debug)
  const { name, content, user_id } = req.body;

  if (user_id != 1) {
    return res.status(403).json({ success: false, message: "Chỉ admin mới được gửi thông báo toàn trường" });
  }

  // lấy tất cả user_id ngoại trừ admin
  const getUsers = `SELECT user_id FROM users WHERE user_id != 1`;
  db.query(getUsers, (err, users) => {
    if (err) return res.status(500).json({ success: false, error: err });

    const sql = `
      INSERT INTO notifications (name, content, create_day, type, subject_id, user_id)
      VALUES (?, ?, NOW(), ?, ?, ?)
    `;

    users.forEach(u => {
      db.query(sql, [name, content, "Toàn trường", null, u.user_id], (err) => {
        if (err) console.error("Lỗi thêm thông báo cho user id: ", u.user_id, ":", err);
      });
    });

    //trả về response ngay sau khi chạy xong forEach
    res.json({ success: true, message: "Thông báo đã gửi cho tất cả sinh viên" });
  });
});

module.exports = router;