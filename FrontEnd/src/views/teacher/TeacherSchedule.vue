<template>
  <div class="container-fluid p-4">
    <h2 class="mb-4 fw-bold text-primary">Lịch dạy của tôi</h2>
    
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-hover table-bordered align-middle">
        <thead class="table-primary">
          <tr>
            <th>Môn học</th>
            <th>Ngày</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Phòng</th>
            <th>Lớp</th>
            <th>Tài liệu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in schedules" :key="s.schedule_id">
            <td class="fw-bold">{{ s.subject_name }}</td>
            <td>{{ formatDate(s.day) }}</td>
            <td>{{ s.start_time }}</td>
            <td>{{ s.end_time }}</td>
            <td><span class="badge bg-info text-dark">{{ s.room }}</span></td>
            <td>{{ s.class_name }}</td>
            <td>
              <input type="file" @change="handleFileUpload($event, s)" />

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import axios from "axios";


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
      return d.toLocaleDateString("vi-VN"); 
    },
    handleFileUpload(e, schedule) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Chỉ được phép upload file PDF!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", schedule.subject_id);
    formData.append("class_id", schedule.class_id);

    axios.post("http://localhost:8888/api/materials/upload/test", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      console.log("Upload thành công:", res.data);
      alert("Upload thành công!");
    })
    .catch(err => {
      console.error("Lỗi upload:", err);
      alert("Upload thất bại!");
    });
  }




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