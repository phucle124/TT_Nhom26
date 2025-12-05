<template>
    <div class="container text-center">
      <h1 class="display-4 fw-bolder mb-2 text-dark">Chào mừng đến với Hệ thống quản lý lịch học</h1>
      <p>Đăng nhập để truy cập vào các chức năng của hệ thống.</p>
      <router-link to="/login" class="btn btn-primary btn-lg mt-3 btn-login">Đăng nhập ngay</router-link>
    </div>
  </template>
  
  <script>
  export default { name: 'HomePage' }
  </script>

<style>
body {
  background: #f5f7fa;
  font-family: "Inter", sans-serif;
}

.container {
  margin-top: 18vh;
  padding: 30px 20px;
}

h1 {
  font-weight: 800;
  font-size: 2.6rem;
  color: #222;
  margin-bottom: 15px;
}

p {
  font-size: 1.5rem;
  color: #555;
}

.btn-login {
  font-size: 1.3rem;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  background-color: #4c6ef5;
  border: none;
  transition: 0.2s ease;
}

.btn-login:hover {
  background-color: #3b5bdb;
  transform: scale(108%);
  box-shadow: 0 6px 12px rgba(76, 110, 245, 0.25);
}

</style>
  