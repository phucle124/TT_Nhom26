<template>
    <form @submit.prevent="handleLogin">
      <label>
        Username
        <input v-model="username" type="text" placeholder="Username" />
      </label>
  
      <label>
        Password
        <input v-model="password" type="password" placeholder="Password" />
      </label>
  
      <button type="submit">Đăng nhập</button>
    </form>
  </template>
  
  <script>
  export default {
    name: 'FormLogin',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      async handleLogin() {
        if (!this.username) {
          alert('Không được để trống Tên đăng nhập.')
          return
        }
        if (!this.password) {
          alert('Không được để trống Mật khẩu.')
          return
        }
      
        try{
          const response = await fetch('http://localhost:8888/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: this.username,
              password: this.password
            })
          });
          const data = await response.json();
          if (response.ok && data.success) {
            alert(`Đăng nhập thành công với ${data.role}`);
            
          } else {
            alert(data.message || 'Đăng nhập thất bại');
          }


        }catch (error) {
          alert('Lỗi kết nối đến máy chủ');
          console.error(error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  form {
    max-width: 280px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
  }
  
  button {
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>