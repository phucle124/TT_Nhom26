<template>
    <div class="p-5">
      <h2>Student Dashboard</h2>
      <p>Chào mừng bạn đến trang dành cho sinh viên.</p>
  
      <ul>
        <li><router-link to="/student/schedule">Xem lịch học</router-link></li>
        <li><router-link to="/student/materials">Xem tài liệu</router-link></li>
        <li><router-link to="/student/notifications">Thông báo</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  
  export default {
      name: "StudentDashboard",
  };
</script>

  