const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả môn học
router.get('/subjects', (req, res) => {
    db.query('SELECT subject_id, subject_name, credit FROM subjects', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Thêm môn học
router.post('/subjects', (req, res) => {
    const { subject_name, credit } = req.body;
    db.query('INSERT INTO subjects (subject_name, credit) VALUES (?, ?)',
        [subject_name, credit],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, id: results.insertId });
        });
});

// Xóa môn học
router.delete('/subjects/:id', (req, res) => {
    db.query('DELETE FROM subjects WHERE subject_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

module.exports = router;