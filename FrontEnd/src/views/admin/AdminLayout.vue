<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav>
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/manage-accounts">Quản lí tài khoản</router-link>
        <router-link to="/admin/manage-schedules">Quản lí lịch học</router-link>
        <router-link to="/admin/manage-classes">Quản lí lớp học</router-link>
        <router-link to="/admin/manage-subjects">Quản lí môn học</router-link>
        <router-link to="/admin/manage-scores">Quản lí điểm</router-link>
        <router-link to="/admin/manage-notification">Quản lí thông báo</router-link>

      </nav>
    </aside>


    <!-- Content -->
    <main class="content">
      <header class="header">
        <h1>Quản lí hệ thống</h1>
      </header>
      <section class="page-content">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>



<style>
.admin-layout {
  display: flex;
  flex-direction: row; /* chia theo chiều ngang */
  height: 100vh;
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
  margin: .4rem 0;
  padding: 0.4rem;
}


</style>