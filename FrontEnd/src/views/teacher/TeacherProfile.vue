<template>
  <div class="profile-container">
    <h2 class="title">Hồ sơ giảng viên</h2>

    <div class="profile-card">
      <div class="avatar-section">
        <img class="avatar" src="https://via.placeholder.com/120" alt="avatar" />
        <h3>{{ teacher.full_name || "Chưa có tên" }}</h3>
        <p>Mã user: <strong>{{ teacher.user_id || "[Lỗi]" }}</strong></p>
      </div>

      <div class="info-section">
        <h4 class="text-center text-info mb-4 border-bottom pb-2">Thông tin giảng viên</h4>
        <ul>
          <li><strong>Tên: </strong> {{ teacher.full_name }}</li>
          <li><strong>Khoa:</strong> {{ teacher.department_name }}</li>
          <li><strong>Trình độ:</strong> {{ teacher.level }}</li>
          <li><strong>Môn phụ trách:</strong> {{ teacher.subjects }}</li>
        </ul>
      </div>

      <!-- Form cập nhật -->
      <form @submit.prevent="updateProfile">
        <strong>Thông tin bổ sung:</strong>
        <input v-model="teacher.teach_note" type="text" placeholder="Ghi chú" />

        <strong>Số điện thoại:</strong>
        <input v-model="teacher.phone" type="tel" placeholder="Số điện thoại" />

        <strong>Nơi công tác:</strong>
        <input v-model="teacher.workplace" type="text" placeholder="Nơi công tác" />

        <button class="btn" type="submit">Cập nhật</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherProfile",
  data() {
    return {
      teacher: {
        user_id: "",
        full_name: "",
        department_id: "",
        department_name: "",
        subjects: "",       // nhận 1 chuỗi render từ CÁC CỘT có cùng  
        teach_note: "",
        phone: "",
        level: "",
        workplace: ""
      },
      departments: []
    };
  },
  async mounted() {
    const userId = localStorage.getItem("user_id");
    const res = await fetch(`http://localhost:8888/api/teachers/user/${userId}`);
    const data = await res.json();

    if (res.ok && data.success && data.teacher) {
    this.teacher = data.teacher;
    } else {
    // fallback để tránh undefined
    this.teacher = {
      user_id: userId,
      full_name: "",
      department_id: "",
      department_name: "",
      subjects: "",
      teach_note: "",
      phone: "",
      level: "",
      workplace: ""
    };
  }
    // Lấy danh sách khoa/bộ môn
    await this.loadDepartments();
  },
  methods: {    
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },

    async updateProfile() {   // Cá nhân giảng viên tự cập nhật phần hồ sơ của mình
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`http://localhost:8888/api/teachers/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.teacher)
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(result.message || "Lỗi khi cập nhật hồ sơ!");
      }
    }
  }
};
</script>


<style>
.profile-container { padding: 20px; }
.title { font-size: 26px; font-weight: bold; margin-bottom: 20px; }
.profile-card { display: flex; gap: 40px; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px #ddd; }
.avatar-section { text-align: center; width: 200px; }
.avatar { width: 120px; height: 120px; border-radius: 50%; }
.info-section ul { list-style: none; padding: 0; margin-top: 10px; }
.info-section li { margin-bottom: 8px; font-size: 16px; }
.btn { margin-top: 15px; padding: 8px 14px; background: #ff9800; border: none; color: #fff; cursor: pointer; border-radius: 6px; }
.btn:hover { background: #e68900; }
</style>