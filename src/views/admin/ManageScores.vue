<template>
    <div class="p-5">
      <h2>Quản lý điểm số</h2>
  
      <table border="1" cellpadding="10">
        <tr>
          <th>MSSV</th>
          <th>Họ tên</th>
          <th>Điểm</th>
        </tr>
  
        <tr v-for="s in students" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.grade }}</td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return { students: [] };
  },
  mounted() {
    this.loadScores();
  },
  methods: {
    async loadScores() {
      const res = await fetch("/api/scores");
      this.students = await res.json();
    },
    async updateGrade(id, grade) {
      await fetch(`/api/scores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade })
      });
      alert("Cập nhật thành công!");
    }
  }
};
</script>
  