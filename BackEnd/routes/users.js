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

// Lấy user theo user_id
router.get('/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

//Thêm mới user (SOURCE CŨ)
// router.post('/users', (req, res) => { 
//   const { username, password, role } = req.body; 
//   db.query('INSERT INTO users (username,password,role) VALUES (?,?,?)', 
//     [username, password, role], (err, results) => { 
//       if (err) return res.status(500).json({ error: err }); 
//         res.json({ success: true, id: results.insertId }); 
//     }); 
// });


// Thêm mới user (Sinh viên và Giảng viên) => (Thêm) ManageAccounts.vue
router.post('/users', (req, res) => {
  const { username, password, role, idCard, birth, address, phone,
          full_name, yearStart, classId, departmentId,
          level, workplace } = req.body;

  // Insert vào bảng users
  const queryUser = `
    INSERT INTO users (username, password, role, id_card, birth, address, phone, full_name, department_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(queryUser, [username, password, role, idCard, birth, address, phone, full_name, departmentId], (err, results) => {
    if (err) {
      console.error('Lỗi thêm user:', err);
      return res.status(500).json({ error: err });
    }

    const newUserId = results.insertId;

    // Nếu là sinh viên thì thêm vào bảng students
    if (role === 'Sinh_vien') {
      db.query(
        'INSERT INTO students (user_id, year_start, current_address, class_id) VALUES (?,?,?,?)',
        [newUserId, yearStart, address, classId],   // classId phải có giá trị
        (err2) => {
          if (err2) {
            console.error('Lỗi thêm sinh viên:', err2);
            return res.status(500).json({ error: err2 });
          }
          return res.json({ success: true, id: newUserId });
        }
      );
    }

    // Nếu là giảng viên thì thêm vào bảng teachers
    else if (role === 'Giang_vien') {
      db.query(
        'INSERT INTO teachers (user_id, level, workplace) VALUES (?,?,?)',
        [newUserId, level, workplace],
        (err3, results3) => {
          if (err3) {
            console.error('Lỗi thêm giảng viên:', err3);
            return res.status(500).json({ error: err3 });
          }
          const teacherId = results3.insertId;
          return res.json({ success: true, id: newUserId, teacherId });
        }
      );
    }
   else res.json({ success: true, id: newUserId });
  });
});


// Sửa user
router.put('/users/:id', (req, res) => {
  const {
    full_name,
    department_id,
    id_card,
    birth,
    address,
    phone,
    role,
    year_start,
    current_address,
    class_id,
    level,
    workplace,
    teach_note,
    subjectIds // mảng môn học từ frontend
  } = req.body;

  const userId = req.params.id;

  // Update bảng users
  const sqlUser = `
    UPDATE users 
    SET full_name=?, department_id=?, id_card=?, birth=?, address=?, phone=?, role=? 
    WHERE user_id=?`;

  db.query(sqlUser, [full_name, department_id, id_card, birth, address, phone, role, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    if (role === 'Sinh_vien') {
      const sqlStudent = `
        UPDATE students 
        SET year_start=?, current_address=?, class_id=? 
        WHERE user_id=?`;
      db.query(sqlStudent, [year_start, current_address, class_id, userId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        return res.json({ success: true, message: 'Cập nhật sinh viên thành công' });
      });
    }

    else if (role === 'Giang_vien') {
      const sqlTeacher = `
        UPDATE teachers 
        SET level=?, workplace=?, teach_note=? 
        WHERE user_id=?`;
      db.query(sqlTeacher, [level, workplace, teach_note, userId], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        // --- cập nhật teacher_subjects ---
        const deleteSql = `DELETE FROM teacher_subjects WHERE teacher_id=?`;
        db.query(deleteSql, [userId], (errDel) => {
          if (errDel) return res.status(500).json({ error: errDel.message });

          if (Array.isArray(subjectIds) && subjectIds.length > 0) {
            const insertSql = `INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES ?`;
            const values = subjectIds.map(sid => [userId, sid]);
            db.query(insertSql, [values], (errIns) => {
              if (errIns) return res.status(500).json({ error: errIns.message });
              return res.json({ success: true, message: 'Cập nhật giảng viên + môn phụ trách thành công' });
            });
          } else {
            return res.json({ success: true, message: 'Cập nhật giảng viên thành công (không có môn phụ trách)' });
          }
        });
      });
    }

    else {
      return res.json({ success: true, message: 'Cập nhật user thành công' });
    }
  });
});


//Xóa user (SOURCE CŨ)
// router.delete('/users/:id', (req, res) => {
//     db.query('DELETE FROM users WHERE user_id = ?', [req.params.id], (err) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json({ success: true });
//     });
// });

router.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  // Xóa ở bảng students
  db.query('DELETE FROM students WHERE user_id = ?', [id], (err) => {
    if (err) {
      console.error('Lỗi xoá students:', err);
      return res.status(500).json({ error: err });
    }

    // Xóa ở bảng teachers
    db.query('DELETE FROM teachers WHERE user_id = ?', [id], (err2) => {
      if (err2) {
        console.error('Lỗi xoá teachers:', err2);
        return res.status(500).json({ error: err2 });
      }

      // Cuối cùng xóa ở bảng users
      db.query('DELETE FROM users WHERE user_id = ?', [id], (err3) => {
        if (err3) {
          console.error('Lỗi xoá users:', err3);
          return res.status(500).json({ error: err3 });
        }
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;


