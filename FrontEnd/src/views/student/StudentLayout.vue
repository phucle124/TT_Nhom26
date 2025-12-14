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
          <h1>Sinh viên</h1>
        </header>
  
        <router-view></router-view>
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
  
 
  .sidebar a {
    display: block;
    color: #e2e8f0;
    padding: 10px 0;
    text-decoration: none;
  }
  
  .student-layout {
  display: flex;
  height: 100vh;
}

/* Sidebar cố định 240px */
.sidebar {
  width: 240px;
  background: #1c3d5a;
  color: white;
  padding: 20px;
}

/* Nội dung chiếm phần còn lại */
.content {
  flex: 1;                  /* chiếm hết không gian còn lại */
  display: flex;
  flex-direction: column;   /* header trên, nội dung dưới */
  padding: 20px;
  overflow-y: auto;         /* cuộn nếu nội dung dài */
}

/* Header cố định trên cùng */
.header {
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

/* Nội dung trang */
.page-content {
  flex: 1;
  max-width: 1200px;        /* giới hạn chiều rộng để không quá dài */
  margin: 0 auto;           /* căn giữa */
  padding: 20px;
}

/* Profile container */
.profile-container {
  width: 100%;
  max-width: 800px;         /* giới hạn chiều rộng hợp lý */
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-container input {
  width: 100%;              /* input full chiều ngang container */
  padding: 8px;
  margin: 8px 0 16px 0;
  box-sizing: border-box;
}


  </style>
  