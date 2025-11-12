const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
    console.log('Đã nhận request đăng nhập:', req.body);

    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({ success: true, role: user.role, username: user.username });
        } else {
            res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
        }
    });
});

module.exports = router;
