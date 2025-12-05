<template>
  <div class="p-5">
    <h2>Quản lý điểm số</h2>

    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>MSSV</th>
          <th>Họ tên</th>
          <th>Điểm</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.student_id">
          <td>{{ s.student_id }}</td>
          <td>{{ s.full_name }}</td>
          <td>{{ s.grade }}</td>
          <td>
            <button @click="openEditDialog(s)">Sửa</button>
            <button @click="deleteScore(s.student_id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal sửa điểm -->
    <div v-if="showDialog" class="modal">
      <div class="modal-content">
        <h3>Sửa điểm cho {{ editingStudent.full_name }}</h3>
        <input
          type="number"
          v-model="editingStudent.grade"
          min="0"
          max="10"
          step="0.1"
        />
        <div class="modal-actions">
          <button @click="saveGrade(editingStudent.student_id, editingStudent.grade)">Lưu</button>
          <button @click="cancelEdit">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [],
      showDialog: false,
      editingStudent: {}
    };
  },
  mounted() {
    this.loadScores();
  },
  methods: {
    async loadScores() {
      const res = await fetch("http://localhost:8888/api/scores");
      this.students = await res.json();
    },
    openEditDialog(student) {
      this.editingStudent = { ...student }; // copy dữ liệu
      this.showDialog = true;
    },
    cancelEdit() {
      this.showDialog = false;
      this.editingStudent = {};
    },
    async saveGrade(id, grade) {
      const res = await fetch(`http://localhost:8888/api/scores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade })
      });
      if (res.ok) {
        alert("Cập nhật thành công!");
        this.showDialog = false;
        this.loadScores();
      } else {
        alert("Có lỗi khi cập nhật!");
      }
    },
    async deleteScore(id) {
      const res = await fetch(`http://localhost:8888/api/scores/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Xóa thành công!");
        this.loadScores();
      } else {
        alert("Có lỗi khi xóa!");
      }
    }
  }
};
</script>
<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  min-width: 300px;
}
.modal-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>