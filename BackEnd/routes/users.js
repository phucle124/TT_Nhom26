const express = require('express')
const router = express.Router()
const db = require('../db')


//Lấy tất cả user
router.get('/users', (req, res) => {
    db.query("SELECT user_id, username, role FROM users WHERE username != 'admin'", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

//Lấy tất cả user là sinh viên
router.get('/users/students', (req, res) => {
  const query = `SELECT user_id, username 
                 FROM users 
                 WHERE role = 'Sinh_vien'`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
    res.json(results);
  });
});




//Thêm user
router.post('/users', (req, res) => {
    const { username, password, role } = req.body;
    db.query('INSERT INTO users (username,password,role) VALUES (?,?,?)', [username, password, role],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, id: results.insertId });
        });
});


// Xóa user
router.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE user_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

module.exports = router;


