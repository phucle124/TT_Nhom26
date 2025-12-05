<template>
  <div class="manage-container">
    <h2>Quản lý gán lớp & khoa cho sinh viên</h2>

    <!-- Form gán lớp/khoa -->
    <div class="assign-form">
      <label>Sinh viên:</label>
      <select v-model="selectedStudentId">
        <option disabled value="">-- Chọn sinh viên --</option>
        <option v-for="s in studentUsers" :key="s.user_id" :value="s.user_id">
          {{ s.username }}
        </option>
      </select>

      <label>Lớp:</label>
      <select v-model="selectedClassId">
        <option disabled value="">-- Chọn lớp --</option>
        <option v-for="c in classes" :key="c.class_id" :value="c.class_id">
          {{ c.class_name }}
        </option>
      </select>

      <label>Khoa:</label>
      <select v-model="selectedDepartmentId">
        <option disabled value="">-- Chọn khoa --</option>
        <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
          {{ d.department_name }}
        </option>
      </select>

      <button @click="assignClassDepartment">Gán</button>
    </div>

    <!-- Danh sách sinh viên -->
    <table class="student-table">
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Lớp</th>
          <th>Khoa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.student_id">
          <td>{{ s.full_name }}</td>
          <td>{{ s.class_name || "Chưa gán" }}</td>
          <td>{{ s.department_name || "Chưa gán" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ManageStudent_Classes_Departments",
  data() {
    return {
      students: [],          // dữ liệu bảng students (đã gán lớp/khoa)
      studentUsers: [],      // danh sách user role = 'Sinh_Vien' để hiển thị dropdown
      classes: [],
      departments: [],
      selectedStudentId: "",
      selectedClassId: "",
      selectedDepartmentId: ""
    };
  },
  async mounted() {
    await this.loadStudentUsers();   // load cho dropdown
    await this.loadStudents();       // load cho bảng
    await this.loadClasses();
    await this.loadDepartments();
  },
  methods: {
    // Lấy danh sách user role = 'Sinh_Vien' để hiển thị dropdown
    async loadStudentUsers() {
      const res = await fetch("http://localhost:8888/api/users/students");
      this.studentUsers = await res.json();
    },

    // Lấy danh sách sinh viên từ bảng students (đã gán lớp/khoa)
    async loadStudents() {
      const res = await fetch("http://localhost:8888/api/students");
      this.students = await res.json();
    },

    async loadClasses() {
      const res = await fetch("http://localhost:8888/api/classes");
      this.classes = await res.json();
    },

    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },

    async assignClassDepartment() {
      if (!this.selectedStudentId || !this.selectedClassId || !this.selectedDepartmentId) {
        alert("Vui lòng chọn đủ sinh viên, lớp và khoa!");
        return;
      }

      const url = `http://localhost:8888/api/students/assign/${this.selectedStudentId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: this.selectedClassId,
          department_id: this.selectedDepartmentId
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Gán lớp/khoa thành công!");
        await this.loadStudents();   // reload bảng
      } else {
        alert(result.message || "Lỗi khi gán lớp/khoa!");
      }
    }
  }
};
</script>

<style>
.manage-container { padding: 20px; }
.assign-form { margin-bottom: 20px; }
.assign-form label { display: block; margin-top: 10px; }
.student-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
.student-table th, .student-table td { border: 1px solid #ddd; padding: 8px; }
button { margin-top: 10px; padding: 6px 12px; }
</style>