<template>
  <div class="container py-4">
    <h2 class="mb-4">Quản lý thông báo</h2>

    <!-- Form nhập thông báo -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Tiêu đề</label>
          <input v-model="name" type="text" class="form-control" placeholder="Nhập tiêu đề..." />
        </div>
        <div class="mb-3">
          <label class="form-label">Nội dung</label>
          <textarea v-model="content" class="form-control" rows="3" placeholder="Nhập nội dung..."></textarea>
        </div>
        <button @click="sendNotification" class="btn btn-primary">
          Gửi thông báo
        </button>
      </div>
    </div>

    <!-- Danh sách thông báo -->
    <h4 class="mb-3">Danh sách thông báo</h4>
    <ul class="list-group">
      <li v-for="n in notifications" :key="n.notification_id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ n.name }}</strong>
            <div class="text-muted small">{{ n.content }}</div>
          </div>
          <span class="badge bg-info text-dark">
            {{ n.type }} - {{ formatDate(n.create_day) }}
          </span>
        </div>
      </li>
    </ul>
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
      const userId = localStorage.getItem("user_id"); // phải là "1" cho admin
      await fetch("http://localhost:8888/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.name,
          content: this.content,
          type: "Toàn trường",   // gán cứng
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

