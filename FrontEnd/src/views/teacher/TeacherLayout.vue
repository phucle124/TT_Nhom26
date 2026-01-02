<template>
    <div class="teacher-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2>Teacher</h2>
        <nav>
          <router-link to="/teacher/dashboard">Dashboard</router-link>
          <router-link to="/teacher/materials">Quản lý tài liệu</router-link> 
          <router-link to="/teacher/notifications">Thông báo môn học</router-link>
          <router-link to="/teacher/profile">Trang cá nhân</router-link>
          <router-link to="/teacher/schedule">Lịch dạy</router-link>
          <button class="btn btn-danger" @click="logout()">Đăng xuất</button>
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

  methods: {
      logout(){

        //Chuyển tất cả các giá trị localStorage đã hứng ở FormLogin.vue về null
        // user_id=null
        // role=null
        // username=null
        // password=null

        // window.localStorage.removeItem('user_id')
        // window.localStorage.removeItem('role')
        // window.localStorage.removeItem('username')
        // window.localStorage.removeItem('password')

        window.localStorage.clear()

        

        window.location.href = '/login'
      }
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
    height: 100%;
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
  