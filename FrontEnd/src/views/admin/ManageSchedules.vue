<template>
  <div class="p-5">
    <h2>Quản lý lịch học</h2>

    <input type="text" v-model="room" placeholder="Phòng học..." />
    <input type="date" v-model="dayOfWeek" />
    <input type="time" v-model="start_time" />
    <input type="time" v-model="end_time" />

    <select v-model="class_id">
      <option value="" selected disabled>Chọn lớp học</option>
      <option v-for="c in classes" :key="c.class_id" :value="c.class_id">
        {{ c.class_name }}
      </option>
    </select>

    <select v-model="teacher_id" @change="loadSubjectsByTeacher">
      <option value="" selected disabled>Chọn giảng viên</option>
      <option v-for="t in teachers" :key="t.teacher_id" :value="t.teacher_id">
        {{ t.full_name }}
      </option>
    </select>

    <select v-model="subject_id">
      <option value="" selected disabled>Chọn môn học</option>
      <option v-for="s in subjects" :key="s.subject_id" :value="s.subject_id">
        {{ s.subject_name }}
      </option>
    </select>

    <button @click="addSchedule">Thêm</button>

    <table border="1" cellpadding="10">
      <tr>
        <th>Môn học</th>
        <th>Phòng</th>
        <th>Ngày</th>
        <th>Bắt đầu</th>
        <th>Kết thúc</th>
        <th>Lớp</th>
        <th>Giảng viên</th>
      </tr>
      <tr v-for="s in schedules" :key="s.schedule_id">
        <td>{{ s.subject_name }}</td>
        <td>{{ s.room }}</td>
        <td>{{ formatDate(s.day) }}</td>
        <td>{{ s.start_time }}</td>
        <td>{{ s.end_time }}</td>
        <td>{{ s.class_name }}</td>
        <td>{{ s.teacher_name }}</td>
        <td><button @click="deleteSchedule(s.schedule_id)">Xóa</button></td>

      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subjects: [],
      classes: [],
      teachers: [],
      schedules: [],
      subject_id: "",
      room: "",
      dayOfWeek: "",
      start_time: "",
      end_time: "",
      class_id: "",
      teacher_id: ""
    };
  },
  mounted() {
    this.loadSchedules();
    this.loadClasses();
    this.loadTeachers();
  },
  methods: {
    async loadSchedules() {
      const res = await fetch("http://localhost:8888/api/schedules");
      this.schedules = await res.json();
    },
    async loadClasses() {
      const res = await fetch("http://localhost:8888/api/classes");
      this.classes = await res.json();
    },
    async loadTeachers() {
      const res = await fetch("http://localhost:8888/api/teachers");
      this.teachers = await res.json();
    },
    async loadSubjectsByTeacher() {
      if (!this.teacher_id) return;
      const res = await fetch(`http://localhost:8888/api/teacher-subjects/${this.teacher_id}`);
      this.subjects = await res.json();
    },
    formatDate(dateString) {
      const d = new Date(dateString);
      return d.toLocaleDateString("vi-VN"); // dd/MM/yyyy
    },
    async addSchedule() {
      const res = await fetch("http://localhost:8888/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: this.subject_id,
          room: this.room,
          day: this.dayOfWeek,
          start_time: this.start_time,
          end_time: this.end_time,
          class_id: this.class_id,
          teacher_id: this.teacher_id
        })
      });
      if (res.ok) {
        alert("Đã thêm lịch học!");
        // reset form
        this.subject_id = "";
        this.room = "";
        this.dayOfWeek = "";
        this.start_time = "";
        this.end_time = "";
        this.class_id = "";
        this.teacher_id = "";
        this.subjects = [];
        this.loadSchedules();
      } else {
        const err = await res.json();
        alert("Lỗi khi thêm lịch: " + err.error);
      }
    },
    async deleteSchedule(id) {
      const res = await fetch(`http://localhost:8888/api/schedules/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Đã xóa lịch học!");
        this.loadSchedules();
      } else {
        alert("Lỗi khi xóa lịch học!");
      }
    }
  }
};
</script>

<style>
.form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>