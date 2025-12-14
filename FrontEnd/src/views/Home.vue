<template>
    <div class="container text-center py-5">
      <h1 class="display-4 fw-bolder mb-2 text-dark">Chào mừng đến với Hệ thống quản lý lịch học</h1>

      <p class="text-dark mb-4">Đăng nhập để truy cập vào các chức năng của hệ thống.</p>
      <br>
      <router-link to="/login" class="btn btn-primary btn-lg mt-3 btn-login">Đăng nhập ngay</router-link>
    </div>
  </template>
  
  <script>
  export default { name: 'HomePage' }
  </script>

  <style scoped>
  .container {
    height: 100vh;
    margin-top: 100px;
    vertical-align: middle;
  }

  p{
    font-size: 1.4rem;
  }
</style>