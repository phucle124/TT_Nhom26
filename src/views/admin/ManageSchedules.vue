<template>
  <div class="p-5">
    <h2>Quản lý lịch học</h2>

    <select v-model="subject_id">
      <option v-for="s in subjects" :key="s.subject_id" :value="s.subject_id">
        {{ s.subject_name }}
      </option>
    </select>

    <input v-model="room" placeholder="Phòng..." />
    <input type="time" v-model="start_time" />
    <input type="time" v-model="end_time" />

    <select v-model="class_id">
      <option v-for="c in classes" :key="c.id" :value="c.id">
        {{ c.name }}
      </option>
    </select>

    <select v-model="teacher_id">
      <option v-for="t in teachers" :key="t.teacher_id" :value="t.teacher_id">
        {{ t.full_name }}
      </option>
    </select>

    <button @click="addSchedule">Thêm</button>

    <table border="1" cellpadding="10">
      <tr>
        <th>Môn học</th>
        <th>Phòng</th>
        <th>Bắt đầu</th>
        <th>Kết thúc</th>
        <th>Lớp</th>
        <th>Giảng viên</th>
      </tr>
      <tr v-for="s in schedules" :key="s.schedule_id">
        <td>{{ s.subject_name }}</td>
        <td>{{ s.room }}</td>
        <td>{{ s.start_time }}</td>
        <td>{{ s.end_time }}</td>
        <td>{{ s.class_name }}</td>
        <td>{{ s.teacher_name }}</td>
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
      start_time: "",
      end_time: "",
      class_id: "",
      teacher_id: ""
    };
  },
  mounted() {
    this.loadSchedules();
    this.loadSubjects();
    this.loadClasses();
    this.loadTeachers();
  },
  methods: {
    async loadSchedules() {
      const res = await fetch("http://localhost:8888/api/schedules");
      this.schedules = await res.json();
    },
    async loadSubjects() {
      const res = await fetch("http://localhost:8888/api/subjects");
      this.subjects = await res.json();
    },
    async loadClasses() {
      const res = await fetch("http://localhost:8888/api/classes");
      this.classes = await res.json();
    },
    async loadTeachers() {
      const res = await fetch("http://localhost:8888/api/teachers");
      this.teachers = await res.json();
    },
    async addSchedule() {
      await fetch("http://localhost:8888/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: this.subject_id,
          room: this.room,
          start_time: this.start_time,
          end_time: this.end_time,
          student_id: this.class_id,
          teacher_id: this.teacher_id
        })
      });
      this.loadSchedules();
    }
  }
};
</script>
  