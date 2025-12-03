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
  .btn-login{
    font-size: 1.5rem;   
    padding: 1rem 2rem;
  }
</style>
  