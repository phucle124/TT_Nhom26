<template>
    <div class="profile-container">
      <h2 class="title">Hồ sơ giảng viên</h2>
  
      <div class="profile-card">
        <div class="avatar-section">
          <img class="avatar" src="https://via.placeholder.com/120" alt="avatar" />
          <h3>{{ teacher.name }}</h3>
          <p>Mã GV: <strong>{{ teacher.id }}</strong></p>
        </div>
  
        <div class="info-section">
          <h4>Thông tin giảng viên</h4>
          <ul>
            <li><strong>Bộ môn:</strong> {{ teacher.department }}</li>
            <li><strong>Email:</strong> {{ teacher.email }}</li>
            <li><strong>Số điện thoại:</strong> {{ teacher.phone }}</li>
            <li><strong>Môn phụ trách:</strong> {{ teacher.subjects.join(", ") }}</li>
          </ul>
  
          <button class="btn" @click="updateInfo">Cập nhật hồ sơ</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeacherProfile",
  
    data() {
      return {
        teacher: {
          id: "GV102",
          name: "Trần Quốc Bảo",
          department: "Công nghệ phần mềm",
          email: "tranbaogv@example.com",
          phone: "0912345678",
          subjects: ["Software Engineering", "Database Systems"]
        }
      };
    },
  
    methods: {
      updateInfo() {
        alert("Chức năng cập nhật hồ sơ sẽ được bổ sung!");
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
    background: #ff9800;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 6px;
  }
  
  .btn:hover {
    background: #e68900;
  }
  </style>
  