const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy thông báo
router.get('/notifications', (req, res) => {
    db.query('SELECT * FROM notifications', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Gửi thông báo
router.post('/notifications', (req, res) => {
    const { name, content, type, subject_id } = req.body;
    db.query(
        'INSERT INTO notifications (name, content, create_day, type, subject_id) VALUES (?, ?, NOW(), ?, ?)',
        [name, content, type, subject_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, id: results.insertId });
        }
    );
});

module.exports = router;