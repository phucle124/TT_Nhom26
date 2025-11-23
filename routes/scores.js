const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy điểm
router.get('/scores', (req, res) => {
    db.query('SELECT student_id, username, grade FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Sửa điểm
router.put('/scores/:id', (req, res) => {
    const { grade } = req.body;
    db.query('UPDATE students SET grade = ? WHERE student_id = ?', [grade, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

module.exports = router;