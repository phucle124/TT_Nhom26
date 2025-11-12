<template>
    <nav class="navbar navbar-expand navbar-light bg-light mb-4">
      <div class="container">
        <router-link class="navbar-brand" to="/">EduPortal</router-link>
        <div class="navbar-nav">
          <router-link class="nav-item nav-link" to="/">Trang chủ</router-link>
          <router-link class="nav-item nav-link" to="/introduce">Giới thiệu</router-link>
          <router-link class="nav-item nav-link" to="/login">Đăng nhập</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default { name: 'NavigateBar' }
  </script>
  
  <style scoped>
  .navbar {
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  </style>
  