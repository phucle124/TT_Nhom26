//Nạp framework
const express = require('express'); //Cú pháp (cũ) phổ biến khi dùng với express - commonjs
const cors = require('cors');
const app = express();
//Truy cập vào file .env dùng để lưu thông tin kết nối tới db
require('dotenv').config();
//Lấy ra các giá trị thuộc tính từ file .env
const port = process.env.PORT || 8888; // fallback nếu .env không có PORT

const db = require('./db');

app.use(cors());
app.use(express.json());

const usersRoutes = require('./routes/users');
const schedulesRoutes = require('./routes/schedules');
const scoresRoutes = require('./routes/scores');
const notificationsRoutes = require('./routes/notifications');
const subjectsRoutes = require('./routes/subjects');
const departmentsRoutes = require('./routes/departments');
const classesRoutes = require('./routes/classes');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const teacherSubjectRoutes = require('./routes/teacherSubjects');
const { router: authRoutes, XacMinhToken } = require('./routes/auth');


app.use('/api', teacherSubjectRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', scoresRoutes);
app.use('/api', notificationsRoutes);
app.use('/api', subjectsRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', classesRoutes);

app.use('/api', teacherRoutes);
app.use('/api', studentRoutes);

//Bảo vệ 2 route student và teacher bằng middleware xác minh token
app.use('/api/students', XacMinhToken, studentRoutes);
app.use('/api/teachers', XacMinhToken, teacherRoutes);

app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});

function resetAutoIncrementIfEmpty(tableName) {
  // 1. Kiểm tra số lượng bản ghi trong bảng
  const checkQuery = `SELECT COUNT(*) AS count FROM ${tableName}`;
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error(`Error checking ${tableName}:`, err);
      return;
    }
    // 2. Nếu kết quả trả về count = 0 (tức là bảng rỗng)
    if (results[0].count === 0) {
      // 3. Thì chạy lệnh ALTER TABLE để reset AUTO_INCREMENT về 1
      const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1`;
      db.query(resetQuery, (err2) => {
        if (err2) {
          console.error(`Bảng ${tableName} đã có dữ liệu`);
        } else {
          console.log(`reset id cho bảng dữ liệu rỗng: ${tableName}`);
        }
      });
    }
  });
}

// Chạy khi server start
["teachers","students","subjects","classes","schedules","scores","teacher_subjects","notifications","materials"]
  .forEach(table => resetAutoIncrementIfEmpty(table));

db.getConnection((err, connection) => {
    if (err) {
        console.error('Không thể kết nối tới MySQL!', err.message);
    } else {
        connection.query('SELECT 1', (queryErr) => {
            if (queryErr) {
                console.error('MySQL không phản hồi:', queryErr.message);
            } else {
                console.log('Kết nối MySQL thành công');
            }
            connection.release();
        });
    }
});

