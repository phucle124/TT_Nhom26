const express = require('express');
const router = express.Router();
const db = require('../db');

//Lấy dữ liệu trong bảng curriculum để xác định môn nào học ở năm nào ? ở học kì nào ?
router.get('/semester-subjects', (req, res) => {
  const { year, semester, department } = req.query;
  const sql = `
    SELECT s.subject_id, s.subject_name, s.credit
    FROM curriculum c
    JOIN subjects s ON c.subject_id = s.subject_id
    WHERE c.year = ? AND c.semester = ? AND c.department_id = ?
  `;
  db.query(sql, [year, semester, department], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//Lấy danh sách course_classes

router.get('/course-classes', (req, res) => {
  const query = `
    SELECT cc.course_class_id, cc.semester, cc.academic_year,
           s.subject_id, s.subject_name, s.credit
    FROM course_classes cc
    JOIN subjects s ON cc.subject_id = s.subject_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.get('/course-classes/:studentId', (req, res) => {
  const { studentId } = req.params;

  const q1 = `
    SELECT s.year_start, u.department_id
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_id = ?
    LIMIT 1
  `;

  db.query(q1, [studentId], (err, studentRows) => {
    if (err) {
      console.error('Error fetching student:', err);
      return res.status(500).json({ courses: [], message: 'Lỗi server khi lấy thông tin sinh viên' });
    }
    if (!studentRows || studentRows.length === 0) {
      return res.status(404).json({ courses: [], message: 'Không tìm thấy sinh viên' });
    }

    const { year_start: yearStart, department_id: deptId } = studentRows[0];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const studentYear = currentYear - yearStart + 1;
    const semester = currentMonth >= 7 ? 'HK1' : 'HK2';

    // 1) Kiểm tra registration_windows active cho khoa
    const qWin = `
      SELECT window_id, semester, academic_year, day_start, day_end
      FROM registration_windows
      WHERE department_id = ? AND day_start <= NOW() AND day_end >= NOW()
      ORDER BY day_start DESC
      LIMIT 1
    `;

    db.query(qWin, [deptId], (errW, winRows) => {
      if (errW) {
        console.error('Error fetching registration_windows:', errW);
        // fallback tiếp tục xuống phần curriculum
      }

      // helper để trả kết quả rỗng với message
      const noClassesMsg = () => res.json({
        courses: [],
        message: 'Hiện chưa có course_classes tương ứng cho curriculum này hoặc course_classes chưa được sinh'
      });

      if (winRows && winRows.length > 0) {
        const win = winRows[0];
        // 2) Nếu có window active, ưu tiên lấy course_classes khớp semester + academic_year của window
        const qByWindow = `
          SELECT cc.course_class_id, cc.subject_id, s.subject_name, s.credit,
                 cc.semester, cc.academic_year, cc.capacity, cc.teacher_id
          FROM course_classes cc
          JOIN subjects s ON cc.subject_id = s.subject_id
          WHERE cc.semester = ? AND cc.academic_year = ?
        `;
        db.query(qByWindow, [win.semester, win.academic_year], (errCw, cwRows) => {
          if (errCw) {
            console.error('Error fetching course_classes by window:', errCw);
            // fallback xuống curriculum-based
          } else if (cwRows && cwRows.length > 0) {
            return res.json({ courses: cwRows, message: 'OK (lấy theo đợt đăng ký của PĐT)' });
          }
          // nếu không tìm thấy lớp theo window, tiếp tục fallback
          fetchByCurriculum();
        });
      } else {
        // không có window active -> fallback
        fetchByCurriculum();
      }

      // Fallback: lấy course_classes dựa trên curriculum + semester (bỏ lọc academic_year)
      function fetchByCurriculum() {
        const qCurr = `
          SELECT DISTINCT cu.subject_id
          FROM curriculum cu
          WHERE cu.year = ? AND cu.semester = ? AND cu.department_id = ?
        `;
        db.query(qCurr, [studentYear, semester, deptId], (errCu, subjRows) => {
          if (errCu) {
            console.error('Error fetching curriculum subjects:', errCu);
            return res.status(500).json({ courses: [], message: 'Lỗi server khi lấy curriculum' });
          }
          if (!subjRows || subjRows.length === 0) {
            return res.json({ courses: [], message: 'Curriculum không có môn cho năm/học kỳ/khoa này' });
          }
          const subjectIds = subjRows.map(r => r.subject_id);
          // dùng JOIN thay IN nếu subjectIds dài; ở đây dùng IN cho đơn giản
          const placeholders = subjectIds.map(() => '?').join(',');
          const qClasses = `
            SELECT cc.course_class_id, cc.subject_id, s.subject_name, s.credit,
                   cc.semester, cc.academic_year, cc.capacity, cc.teacher_id
            FROM course_classes cc
            JOIN subjects s ON cc.subject_id = s.subject_id
            WHERE cc.subject_id IN (${placeholders}) AND cc.semester = ?
          `;
          const params = [...subjectIds, semester];
          db.query(qClasses, params, (errCc, ccRows) => {
            if (errCc) {
              console.error('Error fetching course_classes by curriculum:', errCc);
              return res.status(500).json({ courses: [], message: 'Lỗi server khi truy vấn lớp học' });
            }
            if (!ccRows || ccRows.length === 0) return noClassesMsg();
            return res.json({ courses: ccRows, message: 'OK (lấy theo curriculum)' });
          });
        });
      }
    });
  });
});


// Lấy danh sách enrollments theo student_id
router.get('/enrollments/:studentId', (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT e.enrollment_id, e.student_id, cc.semester, s.subject_name
    FROM enrollments e
    JOIN course_classes cc ON e.course_class_id = cc.course_class_id
    JOIN subjects s ON cc.subject_id = s.subject_id
    WHERE e.student_id = ?;
  `;
  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});




// Mở đăng ký môn học
// Mở đăng ký môn học (cải tiến)
router.post('/registration-windows', (req, res) => {
  const {
    semester,
    academic_year,
    day_start,
    day_end,
    target_group = 'all',
    department_id,
    year,
    class_ids // optional array when target_group === 'classes'
  } = req.body;

  if (!semester || !academic_year || !day_start || !day_end || !department_id || !year) {
    return res.status(400).json({ error: 'Thiếu tham số bắt buộc' });
  }

  db.getConnection((connErr, connection) => {
    if (connErr) {
      console.error('Get connection error:', connErr);
      return res.status(500).json({ error: 'DB connection error' });
    }

    connection.beginTransaction(errTx => {
      if (errTx) {
        connection.release();
        console.error('Transaction begin error:', errTx);
        return res.status(500).json({ error: 'Transaction error' });
      }

      // 1) Insert registration window
      const qInsertWindow = `
        INSERT INTO registration_windows (semester, academic_year, day_start, day_end, target_group, department_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        qInsertWindow,
        [semester, academic_year, day_start, day_end, target_group, department_id],
        (errIns, insertRes) => {
          if (errIns) {
            console.error('Insert window error:', errIns);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: 'Lỗi khi tạo registration window' });
            });
          }

          const windowId = insertRes.insertId;

          // 2) Lấy danh sách subjects từ curriculum
          const qSubjects = `
            SELECT DISTINCT s.subject_id
            FROM curriculum cu
            JOIN subjects s ON cu.subject_id = s.subject_id
            WHERE cu.year = ? AND cu.semester = ? AND cu.department_id = ? AND s.department_id = ?
          `;
          connection.query(qSubjects, [year, semester, department_id, department_id], (errSub, subjects) => {
            if (errSub) {
              console.error('Query subjects error:', errSub);
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: 'Lỗi khi lấy danh sách môn' });
              });
            }

            if (!subjects || subjects.length === 0) {
              // commit window only
              return connection.commit(commitErr => {
                if (commitErr) {
                  console.error('Commit error (no subjects):', commitErr);
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ error: 'Lỗi commit' });
                  });
                }
                connection.release();
                return res.json({
                  message: 'Đã mở đăng ký nhưng curriculum không có môn học cho khoa này',
                  window_id: windowId
                });
              });
            }

            // 3) Lấy danh sách classes tùy target_group
            const handleClassesResult = (errCls, classes) => {
              if (errCls) {
                console.error('Query classes error:', errCls);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ error: 'Lỗi khi lấy danh sách lớp' });
                });
              }

              if (!classes || classes.length === 0) {
                // commit window only
                return connection.commit(commitErr => {
                  if (commitErr) {
                    console.error('Commit error (no classes):', commitErr);
                    return connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ error: 'Lỗi commit' });
                    });
                  }
                  connection.release();
                  return res.json({
                    message: 'Đã mở đăng ký nhưng không tìm thấy lớp sinh viên phù hợp để sinh course_classes',
                    window_id: windowId
                  });
                });
              }

              // 4) Tạo danh sách cặp (subject, class) cần insert
              const pairs = [];
              for (let i = 0; i < subjects.length; i++) {
                for (let j = 0; j < classes.length; j++) {
                  pairs.push({
                    subject_id: subjects[i].subject_id,
                    class_id: classes[j].class_id
                  });
                }
              }

              // 5) Insert từng cặp (subject, class) với kiểm tra NOT EXISTS
              const insertCourseClassQ = `
                INSERT INTO course_classes (subject_id, teacher_id, semester, academic_year, capacity, department_id, window_id, class_id)
                SELECT ?, ?, ?, ?, ?, ?, ?, ?
                WHERE NOT EXISTS (
                  SELECT 1 FROM course_classes
                  WHERE subject_id = ? AND semester = ? AND academic_year = ? AND department_id = ? AND class_id = ?
                )
              `;
              const defaultCapacity = 50;
              const defaultTeacher = null;

              // process pairs sequentially using recursion to avoid callback hell concurrency issues
              let idx = 0;
              const processNext = () => {
                if (idx >= pairs.length) {
                  // done, commit
                  return connection.commit(commitErr => {
                    if (commitErr) {
                      console.error('Commit error:', commitErr);
                      return connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ error: 'Lỗi commit' });
                      });
                    }
                    connection.release();
                    return res.json({
                      message: 'Đã mở đăng ký và sinh course_classes thành công',
                      window_id: windowId,
                      created_pairs: pairs.length
                    });
                  });
                }

                const p = pairs[idx++];
                connection.query(
                  insertCourseClassQ,
                  [
                    p.subject_id, defaultTeacher, semester, academic_year, defaultCapacity, department_id, windowId, p.class_id,
                    // params for NOT EXISTS
                    p.subject_id, semester, academic_year, department_id, p.class_id
                  ],
                  (errInsCC) => {
                    if (errInsCC) {
                      console.error('Insert course_class error at pair', p, errInsCC);
                      return connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ error: 'Lỗi khi tạo course_class' });
                      });
                    }
                    // continue next
                    processNext();
                  }
                );
              };

              // start processing
              processNext();
            }; // end handleClassesResult

            // decide classes query based on target_group
            if (target_group === 'all') {
              const qClasses = `SELECT class_id FROM classes WHERE department_id = ? AND year = ?`;
              connection.query(qClasses, [department_id, year], handleClassesResult);
            } else if (target_group === 'classes' && Array.isArray(class_ids) && class_ids.length > 0) {
              // validate class_ids belong to department (optional)
              const qClassesByIds = `SELECT class_id FROM classes WHERE class_id IN (?) AND department_id = ?`;
              connection.query(qClassesByIds, [class_ids, department_id], handleClassesResult);
            } else {
              // fallback: no classes specified
              return connection.commit(commitErr => {
                if (commitErr) {
                  console.error('Commit error (no class selection):', commitErr);
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ error: 'Lỗi commit' });
                  });
                }
                connection.release();
                return res.status(400).json({ error: 'Không có lớp để tạo. Vui lòng chọn lớp hoặc dùng target_group = all.' });
              });
            }
          }); // end subjects query
        } // end insert window callback
      ); // end connection.query insert window
    }); // end beginTransaction
  }); // end getConnection

});



router.post('/enrollments', (req, res) => {
  const { student_id, course_class_ids } = req.body;
  if (!student_id || !course_class_ids) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }

  const values = course_class_ids.map(id => [student_id, id]);
  const query = `INSERT INTO enrollments (student_id, course_class_id) VALUES ?`;

  db.query(query, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Đăng ký thành công", inserted: result.affectedRows });
  });
});




module.exports = router;