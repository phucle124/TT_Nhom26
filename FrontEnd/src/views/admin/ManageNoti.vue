<template>
  <div class="container py-4">
    <h2>Quản lý thông báo</h2>

    <!-- Form nhập -->
    <div class="card">
      <div class="card-body">
        
          <label class="form-label">Tiêu đề</label>
          <input v-model="name" type="text" class="form-control" placeholder="Nhập tiêu đề..." />
       
        
          <label class="form-label">Nội dung</label>
          <textarea v-model="content" class="form-control" rows="3" placeholder="Nhập nội dung..."></textarea>
        
        <button @click="sendNotification" class="btn btn-primary">
          Gửi thông báo
        </button>
      </div>
    </div>

    
    
  </div>
</template>



<script>
export default {
  data() {
    return {
      notifications: [],
      name: "",
      content: "",
      subject_id: null
    };
  },
  mounted() {
    this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      const res = await fetch("/api/notifications");
      this.notifications = await res.json();
    },
    async sendNotification() {
      const userId = localStorage.getItem("user_id"); 
      await fetch("http://localhost:8888/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.name,
          content: this.content,
          type: "Toàn trường",   //gán cứng
          subject_id: null,
          user_id: userId
        })
      });
      this.loadNotifications();
      this.name = "";
      this.content = "";
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("vi-VN");
    }
  }
};
</script>

