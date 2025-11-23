<template>
    <div class="p-5">
      <h2>Admin Dashboard</h2>
  
      <ul>
        <li><router-link to="/admin/users">Quản lý tài khoản</router-link></li>
        <li><router-link to="/admin/classes">Quản lý lớp học</router-link></li>
        <li><router-link to="/admin/courses">Quản lý môn học</router-link></li>
        <li><router-link to="/admin/schedule">Quản lý lịch học</router-link></li>
        <li><router-link to="/admin/grades">Quản lý điểm số</router-link></li>
        <li><router-link to="/admin/notifications">Thông báo toàn trường</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminDashboard",
  };
  </script>
  
  <style>
  ul li {
    margin: 10px 0;
  }
  </style>
  