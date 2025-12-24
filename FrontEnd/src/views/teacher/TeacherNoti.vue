<template>
  <div class="card m-3 shadow-sm">
    <div class="card-body">
      <h5 class="card-title">Tạo thông báo</h5>
      
      <input v-model="title" placeholder="Tiêu đề..." class="form-control">
      <textarea v-model="content" placeholder="Nội dung..." class="form-control"></textarea>
      
      <select v-model="type" class="form-select">
        <option disabled="">-- Chọn loại --</option>
        <option value="Cá nhân">Cá nhân</option>
        <option value="Môn học">Môn học</option>
      </select>

      <select v-if="type==='Môn học'" v-model="selectedSubjectId" class="form-select ">
        
        <option v-for="s in subjects" :key="s.subject_id">{{ s.subject_name }}</option>
      </select>

      <button @click="sendNotification" class="btn btn-success w-100 mb-3">Gửi</button>

      
      <div v-for="n in notifications" :key="n.notifications" class="small mb-1">
        - <b>{{ n.type }}</b>: {{ n.content }}
      </div>
      

    </div>
  </div>
</template>
  
<script>
export default {
  name: "TeacherNotifications",
  data() {
    return {
      title: "",
      content: "",
      type: "",                // Cá nhân hoặc Môn học
      selectedSubjectId: "",   // id môn học nếu chọn Môn học
      subjects: [],
      notifications: []
    };
  },
  mounted() {
    this.loadNotifications();
    this.loadSubjects();
  },
  methods: {
    async loadNotifications() {
      const res = await fetch("http://localhost:8888/api/notifications");
      this.notifications = await res.json();
    },
    async loadSubjects() {
      const res = await fetch("http://localhost:8888/api/subjects");
      this.subjects = await res.json();
    },
    async sendNotification() {
      const userId = localStorage.getItem("user_id");

      const payload = {
        name: this.title,
        content: this.content,
        user_id: userId,
        type: this.type,
        subject_id: this.type === "Môn học" ? this.selectedSubjectId : null
      };

      await fetch("http://localhost:8888/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      this.loadNotifications();
      this.title = "";
      this.content = "";
      this.type = "";
      this.selectedSubjectId = "";
    }
  }
};
</script>