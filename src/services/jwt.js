// src/services/jwt.js

// Hàm tiện ích để gọi API có kèm token
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  // Gắn token vào header nếu có
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  console.log("Headers có token là:", headers);
  const response = await fetch(`http://localhost:8888/api${endpoint}`, {
    ...options,
    headers
  });

  // Nếu token hết hạn, backend sẽ trả về 403
  if (response.status === 403) {
    alert('Token đã hết hạn, vui lòng đăng nhập lại');
    // Có thể redirect về trang login
    window.location.href = '/login';
  }

  return response.json();
}