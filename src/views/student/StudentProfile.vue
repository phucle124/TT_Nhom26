<template>
    <div class="profile-container">
      <h2 class="title">Hồ sơ sinh viên</h2>
  
      <div class="profile-card">
        <div class="avatar-section">
          <img class="avatar" src="https://via.placeholder.com/120" alt="avatar" />
          <h3>{{ student.name }}</h3>
          <p>MSSV: <strong>{{ student.id }}</strong></p>
        </div>
  
        <div class="info-section">
          <h4>Thông tin cá nhân</h4>
          <ul>
            <li><strong>Lớp:</strong> {{ student.class }}</li>
            <li><strong>Ngành:</strong> {{ student.major }}</li>
            <li><strong>Email:</strong> {{ student.email }}</li>
            <li><strong>Số điện thoại:</strong> {{ student.phone }}</li>
          </ul>
  
          <button class="btn" @click="updateInfo">Cập nhật thông tin</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentProfile",
  
    data() {
      return {
        student: {
          id: "SV001",
          name: "Nguyễn Văn A",
          class: "CTK45",
          major: "Công nghệ thông tin",
          email: "nguyenvana@example.com",
          phone: "0901234567"
        }
      };
    },
  
    methods: {
      updateInfo() {
        alert("Chức năng cập nhật thông tin sẽ được thêm sau!");
      }
    }
  };
  </script>
  
  <style>
  .profile-container {
    padding: 20px;
  }
  
  .title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .profile-card {
    display: flex;
    gap: 40px;
    background: #ffffff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px #ddd;
  }
  
  .avatar-section {
    text-align: center;
    width: 200px;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  
  .info-section ul {
    list-style: none;
    padding: 0;
    margin-top: 10px;
  }
  
  .info-section li {
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .btn {
    margin-top: 15px;
    padding: 8px 14px;
    background: #2e7dff;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 6px;
  }
  
  .btn:hover {
    background: #1a5fe0;
  }
  </style>
  