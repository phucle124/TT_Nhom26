<template>
    <div class="login-page">
      <div class="switch-wrapper">
      <ToggleSwitch />
    </div>

      <h2 class="display-5 fw-bolder mb-5 text-light" >Chào mừng đến với hệ thống quản lí thông tin sinh viên</h2>
      <br>
      
      <FormLogin />  <!-- Gọi form đăng nhập thực sự -->
    </div>
  </template>
  
  <script>
  import FormLogin from '@/components/FormLogin.vue'
  
  export default {
    name: 'LoginPage',
    components: { FormLogin}
  }
  </script>
  
  <style>
  

.login-page {
  min-height: 100vh;   /* phủ toàn bộ chiều cao màn hình */
  width: 100%;
  background: linear-gradient(to right, #1265ad, #000428);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


  </style>
  