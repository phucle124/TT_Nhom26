<template>
    <div class="student-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2>Student</h2>
        <nav>
          <router-link to="/student/dashboard">Dashboard</router-link>
          <router-link to="/student/schedule">Lịch học</router-link>
          <router-link to="/student/materials">Tài liệu</router-link>
          <router-link to="/student/notifications">Thông báo</router-link>
          <router-link to="/student/profile">Trang cá nhân</router-link>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="content">
        <header class="header">
          <h1>Student Portal</h1>
        </header>
  
        <section class="page-content">
          <router-view></router-view>
        </section>
      </main>
    </div>
  </template>
  
<script>
import { apiFetch } from "@/services/jwt.js";
export default {
  name: "StudentLayout",
  data() {
    return {
      student: null
    };
  },
  async mounted() {
    const userId = localStorage.getItem("user_id");
    // Gọi API students kèm token
    const data = await apiFetch(`/students/${userId}`, { method: "GET" });
    this.student = data;
  }
};
</script>

  <style>
  .student-layout {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 240px;
    background: #1c3d5a;
    color: white;
    padding: 20px;
  }
  
  .sidebar a {
    display: block;
    color: #e2e8f0;
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
  