const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả khoa
router.get('/departments', (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm khoa
router.post('/departments', (req, res) => {
  const { department_name, code, description } = req.body;
  const query = "INSERT INTO departments (department_name, code, description) VALUES (?, ?, ?)";
  db.query(query, [department_name, code, description], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Department added', id: results.insertId });
  });
});

module.exports = router;