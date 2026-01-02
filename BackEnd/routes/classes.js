const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả lớp kèm môn học và khoa
router.get('/classes', (req, res) => {
  const query = `
    SELECT c.class_id, c.class_name
    FROM classes c
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


//Lấy thông tin môn học,  lớp học dự theo id lớp
// router.get('/classes/:id', (req, res) => {
//   const sql = `
//     SELECT s.subject_id, s.subject_name
//     FROM class_subjects cs
//     JOIN subjects s ON cs.subject_id = s.subject_id
//     WHERE cs.class_id = ?
//   `;
//   db.query(sql, [req.params.id], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

//Lấy lớp theo khoa (theo đường liên kết qua students thì sẽ chỉ lấy được các lớp đã có sinh viên)
// router.get('/classes/department/:departmentId', (req, res) => {
//   const { departmentId } = req.params;
//   const query = `
//     SELECT c.class_id, c.class_name
//     FROM classes c
//     JOIN students s ON c.class_id = s.class_id
//     JOIN users u ON s.user_id = u.user_id
//     JOIN departments d ON u.department_id = d.department_id
//     WHERE d.department_id = ?;
//   `;
//   db.query(query, [departmentId], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

//Lấy lớp theo khoa (Lấy hết)
router.get('/classes/department/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const query = `
    SELECT c.class_id, c.class_name,c.year, d.department_name
    FROM classes c
    JOIN departments d ON c.department_id = d.department_id
    WHERE d.department_id = ?;
  `;
  db.query(query, [departmentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// Trả về danh sách course_classes (lớp học phần) thuộc một khoa.
router.get('/classes/byDepartment/:department_id', (req, res) => {
  const departmentId = Number(req.params.department_id);
  if (!Number.isInteger(departmentId) || departmentId <= 0) {
    return res.status(400).json({ error: 'department_id không hợp lệ' });
  }

  const q = `
    SELECT
      cc.course_class_id,
      cc.subject_id,
      s.subject_name,
      cc.teacher_id,
      u.full_name AS teacher_name,
      cc.semester,
      cc.academic_year,
      cc.capacity,
      cc.department_id,
      cl.class_id,
      cl.class_name
    FROM course_classes cc
    JOIN subjects s ON cc.subject_id = s.subject_id
    LEFT JOIN teachers t ON cc.teacher_id = t.teacher_id
    LEFT JOIN users u ON t.user_id = u.user_id
    LEFT JOIN classes cl ON cc.class_id = cl.class_id
    WHERE cc.department_id = ?
    ORDER BY s.subject_name, cc.course_class_id
  `;

  db.query(q, [departmentId], (err, rows) => {
    if (err) {
      console.error('GET /api/classes/byDepartment error:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    const result = (Array.isArray(rows) ? rows : []).map(r => ({
      course_class_id: r.course_class_id,
      subject_id: r.subject_id,
      subject_name: r.subject_name,
      teacher_id: r.teacher_id ?? null,
      teacher_name: r.teacher_name ?? null,
      semester: r.semester,
      academic_year: r.academic_year,
      capacity: r.capacity,
      department_id: r.department_id,
      class_id: r.class_id ?? null,
      class_name: r.class_name ?? null
    }));

    return res.json(result);
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
// router.post('/classes', (req, res) => {
//   const { class_name, year, subject_id } = req.body;
//   const query = "INSERT INTO classes (class_name, year, department_id) VALUES (?, ?, ?)";
//   db.query(query, [class_name, year, subject_id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({ message: 'Đã thêm lớp', id: results.insertId });
//   });
// });



// Thêm lớp hàng loạt (bulk) theo số lượng lớp, khoa và tiền tố cho tên lớp
router.post('/classes/bulk', (req, res) => {
  const { quantity, department_id, year, startNumber } = req.body;

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
        case "CNTP":  prefix = "D22_CNTP"; break;
        default: prefix = ""; // fallback
      }

      // Sinh danh sách lớp
      const values = [];
      const start = parseInt(startNumber, 10);
      for (let i = 0; i < quantity; i++) {
        const num = String(start + i).padStart(2, "0");
        const class_name = `${prefix}${num}`;
        values.push([class_name, year,department_id]);
      }

      const insertQuery = "INSERT INTO classes (class_name, year, department_id) VALUES ?";
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