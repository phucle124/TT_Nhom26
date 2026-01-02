<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav>
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/manage-accounts">Quản lí tài khoản</router-link>
        <router-link to="/admin/manage-schedules">Quản lí lịch học</router-link>
        <router-link to="/admin/manage-subjects-classes">Quản lí môn học & lớp học</router-link>
        <router-link to="/admin/manage-notification">Quản lí thông báo</router-link>
        <router-link to="/admin/manage-course-enrollments">Mở đăng ký môn học</router-link>
        
        <button class="btn btn-danger" @click="logout()">Đăng xuất</button>
      </nav>
    </aside>


    <!-- Content -->
    <main class="content">
      <header class="header">
        <h1>QUẢN LÍ HỆ THÔNG</h1>
      </header>
      <section class="page-content">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>

  export default {

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

        // alert("Đã đăng xuất thành công!");

        window.location.href = '/login'
      }
    }
  }
</script>



<style>
.admin-layout {
  display: flex;
  flex-direction: row; /* chia theo chiều ngang */
  height: 100%;
  background: #f5f5f5;
}

.sidebar {
  width: 240px;
  background: #333;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column; /* ép các link xếp dọc */
  align-items: flex-start; /* căn sát bên trái */
}

.sidebar a {
  display: block;
  color: #eee;
  padding: 8px 0;
  text-decoration: none;
  width: 100%; /* link chiếm hết chiều ngang sidebar */
}

.sidebar a:hover,
.router-link-active {
  color: #fff;
  font-weight: bold;
}



.header {
  background: white;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  padding: 20px;
}

select {
  appearance: base-select;
  width: 200px;
  
  
  margin: .4rem 0;
  padding: 0.4rem;
}
option{
  background: #e8e8e8;
}

option:checked {
  border: none;
  background: #c8c8c8;
}
input, button {
  margin: 10px;
  
}


</style>