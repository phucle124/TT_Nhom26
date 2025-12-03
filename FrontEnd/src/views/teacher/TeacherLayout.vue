<template>
    <div class="teacher-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2>Teacher</h2>
        <nav>
          <router-link to="/teacher/dashboard">Dashboard</router-link>
          <router-link to="/teacher/materials">Quản lý tài liệu</router-link>
          <!-- <router-link to="/teacher/scores">Nhập điểm</router-link> -->     
          <router-link to="/teacher/notifications">Thông báo môn học</router-link>
          <router-link to="/teacher/profile">Trang cá nhân</router-link>
        </nav>
      </aside>
  
      <router-view></router-view>
    </div>
  </template>
  
<script>
import { apiFetch } from "@/services/jwt.js";
export default {
  name: "TeacherLayout",
   data() {
    return {
      teacher: null
    };
  },
  async mounted() {
    const userId = localStorage.getItem("user_id");
    // Gọi API teachers kèm token
    const data = await apiFetch(`/teachers/${userId}`, { method: "GET" });
    this.teacher = data;
  }
};
</script>

  <style>
  .teacher-layout {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 240px;
    background: #4a148c;
    color: white;
    padding: 20px;
  }
  
  .sidebar a {
    display: block;
    color: #e1bee7;
    padding: 10px 0;
    text-decoration: none;
  }
  
  .sidebar a:hover {
    color: white;
    font-weight: bold;
  }
  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background: #fff;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .page-content {
    padding: 20px;
  }
  </style>
  