<template>
    <div>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link to="/" class="home-link">Quay về trang chủ</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>

 
  body{
    text-align: center;
    align-items: center;
    
    padding: 100px 20px;
    color: #333;
  }
  
  body h1 {
    font-size: 3em;
    margin-bottom: 20px;
    margin-left: 200px;
  }
  
  body p {
    font-size: 1.2em;
    margin-bottom: 30px;
    margin-left: 200px;
  }
  
  .home-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-left: 200px;
  }
  
  .home-link:hover {
    background-color: #2c8f6f;
  }

  
  </style>