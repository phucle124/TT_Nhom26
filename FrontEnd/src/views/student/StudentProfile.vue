<template>
  <div class="profile-container">
    <h2 class="text-center text-primary mb-4 border-bottom pb-2">Hồ sơ sinh viên</h2>

    <!-- Hiển thị lớp/khoa chỉ đọc -->
      <p><strong>Họ tên:</strong> {{ student.full_name }}</p>
      <p><strong>Lớp:</strong> {{ student.class_name }}</p>
      <p><strong>Khoa:</strong> {{ student.department_name }}</p>
      <p><strong>Năm học:</strong> {{ student.year_start }} - {{ student.year_start + 3}} </p>
    <!-- Form cập nhật thông tin cá nhân -->
     <form @submit.prevent="updateProfile">
      <strong>Nơi ở hiện tại:</strong>
      <input v-model="student.current_address" type="text" required />
      <strong>Số điện thoại:</strong>
      <input v-model="student.phone" type="tel" required />
      <button type="submit">Cập nhật</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      student: {}
    };
  },
  async mounted() {
    const userId = localStorage.getItem("user_id");
    const res = await fetch(`http://localhost:8888/api/students/user/${userId}`);
    this.student = await res.json();
  },
  methods: {
    async updateProfile() {
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`http://localhost:8888/api/students/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // email: this.student.email,
          current_address: this.student.current_address,
          phone: this.student.phone,
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(result.message || "Lỗi khi cập nhật!");
      }
    }
  }
};
</script>