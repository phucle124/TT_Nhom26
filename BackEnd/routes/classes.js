const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả lớp kèm môn học và khoa
// router.get('/classes', (req, res) => {
//   const query = `
//     SELECT c.class_id, c.class_name, c.year, s.subject_name, d.department_name
//     FROM classes c
//     JOIN subjects s ON c.subject_id = s.subject_id
//     JOIN departments d ON s.department_id = d.department_id
//   `;
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });


//Hiển thị các môn thuộc lớp cụ thể (phục vụ cho UX/UI ở Manage_SubjecsClasses.vue)
router.get('/classes', (req, res) => {
  const query = `
    SELECT c.class_id, c.class_name, c.year, s.subject_id, s.subject_name, d.department_name
    FROM classes c
    JOIN subjects s ON c.subject_id = s.subject_id
    JOIN departments d ON s.department_id = d.department_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Gom các môn theo class_id
    const classesMap = {};
    results.forEach(r => {
      if (!classesMap[r.class_id]) {
        classesMap[r.class_id] = {
          class_id: r.class_id,
          class_name: r.class_name,
          year: r.year,
          department_name: r.department_name,
          subjects: []
        };
      }
      classesMap[r.class_id].subjects.push({
        subject_id: r.subject_id,
        subject_name: r.subject_name
      });
    });

    // Trả về mảng lớp với subjects là mảng
    const finalResults = Object.values(classesMap);
    res.json(finalResults);
  });
});

//Lấy thông tin môn học,  lớp học dự theo id lớp
router.get('/classes/:id', (req, res) => {
  const sql = `
    SELECT s.subject_id, s.subject_name
    FROM class_subjects cs
    JOIN subjects s ON cs.subject_id = s.subject_id
    WHERE cs.class_id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//Lấy lớp theo khoa
router.get('/classes/department/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const query = `
    SELECT c.class_id, c.class_name
    FROM classes c
    JOIN subjects s ON c.subject_id = s.subject_id
    JOIN departments d ON s.department_id = d.department_id
    WHERE d.department_id = ?;
  `;
  db.query(query, [departmentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


//Lấy lớp theo giảng viên (ManageSchedules.vue)  bằng cách join 4 bảng:  teacher_subjects, subjects, departments, classes
router.get('/teacher-classes/:teacherId', (req, res) => {
  const {teacherId} = req.params;
  const query = `
      SELECT DISTINCT c.class_id, c.class_name
        FROM teacher_subjects ts
        JOIN subjects s ON ts.subject_id = s.subject_id
        JOIN departments d ON s.department_id = d.department_id
        JOIN classes c ON c.subject_id = s.subject_id
        WHERE ts.teacher_id = ?`;

  db.query(query, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Thêm lớp (KHÔNG DÙNG NỮA)
router.post('/classes', (req, res) => {
  const { class_name, year, subject_id } = req.body;
  const query = "INSERT INTO classes (class_name, year, subject_id) VALUES (?, ?, ?)";
  db.query(query, [class_name, year, subject_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Đã thêm lớp', id: results.insertId });
  });
});



// Thêm lớp hàng loạt (bulk) theo số lượng lớp, khoa và tiền tố cho tên lớp
router.post('/classes/bulk', (req, res) => {
  const { quantity, department_id, class_name_prefix, year, subject_id, startNumber } = req.body;

  // Lấy department_code từ DB
  db.query(
    "SELECT code FROM departments WHERE department_id = ?",
    [department_id],
    (err, deptRows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (deptRows.length === 0) {
        return res.status(400).json({ error: "Khoa không tồn tại" });
      }

      const deptCode = deptRows[0].code;

      // Xác định prefix
      let prefix = "";
      switch (deptCode) {
        case "CNTT": prefix = "D22_TH"; break;
        case "QTKD": prefix = "D22_QTKD"; break;
        case "NNA":  prefix = "D22_NNA"; break;
        default: prefix = ""; // fallback
      }

      // Sinh danh sách lớp
      const values = [];
      const start = parseInt(startNumber, 10);
      for (let i = 0; i < quantity; i++) {
        const num = String(start + i).padStart(2, "0");
        const class_name = `${prefix}${num}`;
        values.push([class_name, year, subject_id]);
      }

      const insertQuery = "INSERT INTO classes (class_name, year, subject_id) VALUES ?";
      const checkQuery = "SELECT class_name FROM classes WHERE class_name IN (?)";
      const classNames = values.map(v => v[0]);

      // Kiểm tra trùng
      db.query(checkQuery, [classNames], (err2, existing) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const existingNames = existing.map(e => e.class_name);
        const toInsert = values.filter(v => !existingNames.includes(v[0]));
        const duplicatesList = values.filter(v => existingNames.includes(v[0])).map(v => v[0]);

        if (toInsert.length > 0) {
          db.query(insertQuery, [toInsert], (err3) => {
            if (err3) return res.status(500).json({ error: err3.message });

            if (duplicatesList.length > 0) {
              return res.status(201).json({
                message: `Đã thêm ${toInsert.length} lớp, có ${duplicatesList.length} lớp bị trùng`,
                duplicates: duplicatesList
              });
            }
            return res.status(201).json({ message: `Đã thêm ${toInsert.length} lớp thành công` });
          });
        } else {
          return res.status(200).json({
            message: `Có ${duplicatesList.length} lớp bị trùng, không thêm mới lớp nào`,
            duplicates: duplicatesList
          });
        }
      });
    }
  );
});


// Xóa lớp
router.delete('/classes/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM classes WHERE class_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Đã xóa lớp' });
  });
});

module.exports = router;