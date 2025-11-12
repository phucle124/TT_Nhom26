<template>
    <div class="login-page">
      <h2>Chào mừng đến với hệ thống quản lí thông tin sinh viên</h2>
      <br>
      <p>Hãy đăng nhập để tiếp tục</p>
      <FormLogin />  <!-- Gọi form đăng nhập thực sự -->
    </div>
  </template>
  
  <script>
  import FormLogin from '@/components/FormLogin.vue'
  
  export default {
    name: 'LoginPage',
    components: { FormLogin }
  }
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #004e92, #000428);
    color: white;
  }
  </style>
  