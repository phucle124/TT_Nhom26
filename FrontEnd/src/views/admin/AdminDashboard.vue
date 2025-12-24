<template>
    <div class="p-5">
      <h2>Admin Dashboard</h2>
  
      <ul>
        <li><router-link to="/admin/manage-accounts">Quản lý tài khoản</router-link></li>
        <li><router-link to="/admin/manage-subjects-classes">Quản lý lớp học & lớp học</router-link></li>
        <li><router-link to="/admin/manage-courses">Quản lý môn học</router-link></li>
        <li><router-link to="/admin/manage-schedule">Quản lý lịch học</router-link></li>
        <li><router-link to="/admin/manage-notification">Thông báo toàn trường</router-link></li>
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

  *{
    height: auto;
  }

  </style>
  