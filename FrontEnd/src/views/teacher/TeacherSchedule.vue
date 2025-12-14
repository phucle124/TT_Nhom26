<template>
  <div>
    <h2>Lịch dạy của tôi</h2>
    <table>
      <thead>
        <tr>
          <th>Môn học</th>
          <th>Ngày</th>
          <th>Giờ bắt đầu</th>
          <th>Giờ kết thúc</th>
          <th>Phòng</th>
          <th>Lớp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in schedules" :key="s.schedule_id">
          <td>{{ s.subject_name }}</td>
          <td>{{ formatDate(s.day) }}</td>
          <td>{{ s.start_time }}</td>
          <td>{{ s.end_time }}</td>
          <td>{{ s.room }}</td>
          <td>{{ s.class_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return { schedules: [] };
  },
  async mounted() {
    await this.loadSchedules();
  },
  methods: {
    async loadSchedules() {
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`http://localhost:8888/api/schedules/lecturer/byUser/${userId}`);
      this.schedules = await res.json();
    },
    formatDate(dateString) {
      const d = new Date(dateString);
      return d.toLocaleDateString("vi-VN"); // dd/MM/yyyy
    },
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>