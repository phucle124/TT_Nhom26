//Nạp framework
const express = require('express'); //Cú pháp (cũ) phổ biến khi dùng với express - commonjs
const app = express();
//Truy cập vào file .env dùng để lưu thông tin kết nối tới db
require('dotenv').config();
//Lấy ra các giá trị thuộc tính từ file .env
// const port = process.env.PORT;

// app.get('/', (req, res) => {
//     res.send(`Server is running on port ${port}`);
// });

// app.listen(port, () => {
//     console.log(`Server is running on port:${port}`);
// });


const connection = require('./db');

connection.query('SELECT * FROM students', function (err, results, fields) {
    if (err) throw err;
    console.log(results);
});