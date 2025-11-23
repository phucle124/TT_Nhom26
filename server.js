//Nạp framework
const express = require('express'); //Cú pháp (cũ) phổ biến khi dùng với express - commonjs
const cors = require('cors');
const app = express();
//Truy cập vào file .env dùng để lưu thông tin kết nối tới db
require('dotenv').config();
//Lấy ra các giá trị thuộc tính từ file .env
const port = process.env.PORT;

const db = require('./db');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const schedulesRoutes = require('./routes/schedules');
const scoresRoutes = require('./routes/scores');
const notificationsRoutes = require('./routes/notifications');
const subjectsRoutes = require('./routes/subjects');

app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', schedulesRoutes);
app.use('/api', scoresRoutes);
app.use('/api', notificationsRoutes);
app.use('/api', subjectsRoutes);


app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
});

app.post('/login', (req, res) => {
    console.log('Đã nhận req [Đăng nhập]: ', req.body);
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('Không thể kết nối tới MySQL:', err);
    } else {
        console.log('Kết nối MySQL thành công');
        connection.release();
    }
});
