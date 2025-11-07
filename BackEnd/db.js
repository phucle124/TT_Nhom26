const mysql = require('mysql2');

//Tạo kết nối tới mySQL

const connection = mysql.createPool({
    host: 'localhost',  // -> mặc định dùng 127.0.0.1:3306 (có thể thay thế bằng IP của máy chủ MySQL)
    user: 'root',
    password: '', // -> mặc định là rỗng
    database: 'student_portal', // -> tên của database 
    waitForConnections: true,
    connectionLimit: 10, // -> số lượng kết nối tối đa tới MySQL
    queueLimit: 0 // -> số lượng kết nối tối đa trong hàng đợi
});

module.exports = connection;