<template>
    <div class="p-5">
      <h2>Teacher Dashboard</h2>
  
      <ul>
        <li><router-link to="/teacher/materials">Quản lý tài liệu</router-link></li>
        <li><router-link to="/teacher/grades">Nhập điểm</router-link></li>
        <li><router-link to="/teacher/notifications">Tạo thông báo môn học</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeacherDashboard",
  };
  </script>
  
  <style>
  ul li {
    margin: 10px 0;
  }
  </style>
  