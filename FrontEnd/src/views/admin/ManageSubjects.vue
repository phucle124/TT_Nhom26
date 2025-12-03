<template>
  <div class="p-5">
    <h2>Quản lý môn học</h2>

    <input v-model="newSubject" placeholder="Tên môn..." />
    <select v-model="newCredit">
      <option value="" disabled selected>Chọn số tín chỉ</option>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="addCourse">Thêm</button>

    <table border="1" cellpadding="5" cellspacing="0" style="margin-top:20px;  border-collapse: collapse;">
      <thead>
        <tr>
          <th>Tên môn học</th>
          <th>Số tín chỉ</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in subjects" :key="c.subject_id">
          <td>{{ c.subject_name }}</td>
          <td>{{ c.credit }}</td>
          <td>
            <button @click="deleteCourse(c.subject_id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: "AdminCourses",
  data() {
    return {
      newCredit: "",
      newSubject: "",
      subjects: []
    };
  },
  mounted() {
    this.loadSubjects();
  },
  methods: {
    async loadSubjects() {
      const res = await fetch("http://localhost:8888/api/subjects");
      this.subjects = await res.json();
    },
    async addCourse() {
      if (!this.newSubject.trim() || this.newCredit === "") return;
      await fetch("http://localhost:8888/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject_name: this.newSubject,
          credit:this.newCredit
         })
      });
      this.newCredit="";
      this.newSubject = "";
      this.loadSubjects();
    },
    async deleteCourse(id) {
      await fetch(`http://localhost:8888/api/subjects/${id}`, { method: "DELETE" });
      this.loadSubjects();
    }
  }
};
</script>

<style scoped>
td {
  text-align: center;
}
</style>