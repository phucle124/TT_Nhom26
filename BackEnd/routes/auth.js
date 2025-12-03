const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

/*Source cũ: dùng respond dạng json là các thông tin lấy từ localStorage như role,username,user_id*/

// router.post('/login', (req, res) => {
//     console.log('Đã nhận request đăng nhập:', req.body);

//     const { username, password } = req.body;
//     const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Lỗi truy vấn:', err);
//             return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
//         }

//         if (results.length > 0) {
//             const user = results[0];
//             res.json({ success: true, role: user.role, username: user.username, user_id: user.user_id });
//         } else {
//             res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
//         }
//     });
// });

const secretKey = 'MyStudentPortalSecretKey';

/*Sourc Mới: Dùng token tạo ra với user_id và username và secretKey tồn tại trong 1h*/
router.post('/login', (req, res) => {
    console.log('Đã nhận request đăng nhập:', req.body);

    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
        }

        if (results.length === 0) { 
            res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
        }
      
        const user = results[0];            //Dùng biến user để lấy thông tin từ table users 
        const token = jwt.sign(             //jwt.sign(payload, secretOrPrivateKey, [options, callback])
                    { user_id: user.user_id, username: user.username, role: user.role },
                    secretKey,
                    {expiresIn: '1h'}           //Token có thời hạn 1 giờ
        );

       res.json({
            success: true,
            message: 'Đăng nhập thành công',
            role: user.role,
            username: user.username,
            user_id: user.user_id,
            token
        });


    });
});

//Hàm xác minh token bằng middleware
function XacMinhToken(req, res, next) {
  // Token chuẩn: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có token' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    // Gắn thông tin user vào request để các route khác dùng
    req.user = user;
    next();
  });
}

// Route kiểm tra token hợp lệ
router.get('/validate-token', XacMinhToken, (req, res) => {
  res.json({ success: true, message: 'Token hợp lệ', user: req.user });
});


module.exports = { router , XacMinhToken };
