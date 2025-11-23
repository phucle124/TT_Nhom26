<template>
<div class="admin-layout">
    <aside class="sidebar">
        <nav>
            <router-link to="./dashboard">Dashboard</router-link>
            <router-link to="./manage-accounts">Quản lí tài khoản</router-link>
            <router-link to="./manage-schedules">Quản lí lịch học</router-link>
            <router-link to="./manage-classes">Quản lí lớp học</router-link>
            <router-link to="./manage-subjects">Quản lí môn học</router-link>
            <router-link to="./manage-scores">Quản lí điểm</router-link>
            <router-link to="./manage-notification">Quản lí thông báo</router-link>
        </nav>
    </aside>

    <!--Content -->
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

<!-- <script>

</script> -->

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: row;   /* đảm bảo chia theo chiều ngang */
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
  width: 100%;            /* link chiếm hết chiều ngang sidebar */
}

.sidebar a:hover {
  color: #fff;
  font-weight: bold;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-content {
  padding: 20px;
}
</style>