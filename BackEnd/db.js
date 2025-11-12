require('dotenv').config();
const mysql = require('mysql2');

//Tạo kết nối tới mySQL

const connection = mysql.createPool({
    host: process.env.DB_HOST,  // -> mặc định dùng 127.0.0.1:3306 (có thể thay thế bằng IP của máy chủ MySQL)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // -> mặc định là rỗng
    database: process.env.DB_NAME, // -> tên của database 
    waitForConnections: true,
    connectionLimit: 10, // -> số lượng kết nối tối đa tới MySQL
    queueLimit: 0 // -> số lượng kết nối tối đa trong hàng đợi
});

module.exports = connection;