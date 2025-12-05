<template>
  <div class="profile-container">
    <h2 class="title">Hồ sơ giảng viên</h2>

    <div class="profile-card">
      <div class="avatar-section">
        <img class="avatar" src="https://via.placeholder.com/120" alt="avatar" /> //Thiếu nghiệp vụ upload ảnh
        <h3>{{ teacher.full_name || "Chưa có tên" }}</h3>
        <p>Mã user: <strong>{{ teacher.user_id || "[Lỗi]" }}</strong></p>
      </div>

      <div class="info-section">
        <h4>Thông tin giảng viên</h4>

        <form v-if="!exists || !complete" @submit.prevent="updateInfo">
          <ul>
            <li><strong>Bộ môn:</strong><select v-model="teacher.department_id">
              <option v-for="d in departments" :key="d.department_id" :value="d.department_id">{{ d.department_name }}</option>
            </select>
            </li>
            <li><strong>Email:</strong><input v-model="teacher.email" type="email" /></li>
            <li><strong>Số điện thoại:</strong><input v-model="teacher.phone" /></li>
            <li><strong>Họ tên:</strong><input v-model="teacher.full_name" /></li>
          </ul>
          <button class="btn" type="submit">Lưu hồ sơ</button>
        </form>

        <div v-else>
          <ul>
            <li><strong>Tên: </strong> {{ teacher.full_name }}</li>
            <li><strong>Bộ môn:</strong> {{ teacher.department_name }}</li>
            <li><strong>Email:</strong> {{ teacher.email}}</li>
            <li><strong>Số điện thoại:</strong> {{ teacher.phone }}</li>
            <li><strong>Môn phụ trách:</strong> {{ teacher.subjects }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherProfile",
  data() {
    return {
      teacher: {},
      departments: [],
      exists: false,
      complete: false
    };
  },
  async mounted() {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      await this.checkProfile(userId);
      await this.loadDepartments();
    }
  },
  methods: {
    async checkProfile(userId) {
      const res = await fetch(`http://localhost:8888/api/teachers/${userId}/check-profile`);
      const data = await res.json();
      this.exists = data.exists;
      this.complete = data.complete;

      // Lấy username, password từ localStorage
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      if (data.exists) {
        const res2 = await fetch(`http://localhost:8888/api/teachers/user/${userId}`);
        this.teacher = (await res2.json()).teacher;
        
        // Luôn gán thêm username, password
        this.teacher.username = username || this.teacher.username;
        this.teacher.password = password || this.teacher.password;
      } else {
        this.teacher = {
          teacher_id: "",
          user_id: userId,
          full_name: "",
          department_id: "",
          email: "",
          phone: "",
          username: username || "",
          password: password || ""
        };
      }
    },
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },
    async updateInfo() {
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`http://localhost:8888/api/teachers/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.teacher)
      });
      const result = await res.json();
      console.log("Kết quả cập nhật:", result);

      if (res.ok && result.success) {
        alert("Cập nhật hồ sơ thành công!");
        this.complete = true;
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