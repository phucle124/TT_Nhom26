<template>
  <div class="p-6">
    <h2 class="title">Quản lí môn giảng viên dạy</h2>

    <!-- Form gán môn -->
    <div class="form">
      <!-- Chọn khoa -->
      <select v-model="department_id">
        <option value="" disabled>Chọn khoa</option>
        <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
          {{ d.department_name }}
        </option>
      </select>

      <!-- Chọn giảng viên -->
      <select v-model="teacher_id">
        <option value="" disabled>Chọn giảng viên</option>
        <option v-for="t in teachers" :key="t.teacher_id" :value="t.teacher_id">
          {{ t.full_name }}
        </option>
      </select>

      <!-- Chọn môn học -->
      <select v-model="subject_id">
        <option value="" disabled>Chọn môn học</option>
        <option v-for="s in subjects" :key="s.subject_id" :value="s.subject_id">
          {{ s.subject_name }}
        </option>
      </select>

      <button @click="assignSubject">Gán môn</button>
    </div>

    <!-- Danh sách gán -->
    <table border="1" cellpadding="10" class="assign-table">
      <thead>
        <tr>
          <th>Khoa</th>
          <th>Giảng viên</th>
          <th>Môn học</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ts in teacherSubjects" :key="ts.id">
          <td>{{ ts.department_name }}</td>
          <td>{{ ts.full_name }}</td>
          <td>{{ ts.subject_name }}</td>
          <td>
            <button @click="removeAssign(ts.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ManageTeacherSubject",
  data() {
    return {
      departments: [],
      teachers: [],
      subjects: [],
      teacherSubjects: [],
      department_id: "",
      teacher_id: "",
      subject_id: ""
    };
  },
  mounted() {
    this.loadDepartments();
    this.loadTeachers();
    this.loadSubjects();
    this.loadTeacherSubjects();
  },
  methods: {
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },
    async loadTeachers() {
      const res = await fetch("http://localhost:8888/api/teachers");
      this.teachers = await res.json();
    },
    async loadSubjects() {
      const res = await fetch("http://localhost:8888/api/subjects");
      this.subjects = await res.json();
    },
    async loadTeacherSubjects() {
      const res = await fetch("http://localhost:8888/api/teacher-subjects");
      this.teacherSubjects = await res.json();
    },
    async assignSubject() {
      if (!this.department_id || !this.teacher_id || !this.subject_id) {
        alert("Vui lòng chọn khoa, giảng viên và môn học!");
        return;
      }
      const res = await fetch("http://localhost:8888/api/teacher-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department_id: this.department_id,
          teacher_id: this.teacher_id,
          subject_id: this.subject_id
        })
      });
      if (res.ok) {
        alert("Đã gán môn cho giảng viên!");
        this.loadTeacherSubjects();
      }
    },
    async removeAssign(id) {
      const res = await fetch(`http://localhost:8888/api/teacher-subjects/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Đã bỏ gán môn!");
        this.loadTeacherSubjects();
      }
    }
  }
};
</script>

<style>
.title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.assign-table {
  width: 100%;
  border-collapse: collapse;
}
.assign-table th {
  background: #f0f0f0;
}
.assign-table td,
.assign-table th {
  padding: 8px;
}
button {
  padding: 6px 12px;
  background: #2e7dff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #1a5fe0;
}
</style>