<template>
  <div class="container py-4">
    <h2 class="mb-4">Thông báo của bạn</h2>

    <div v-for="note in notifications" :key="note.notification_id" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ note.name }}</h5>
        <p class="card-text">{{ note.content }}</p>
        <small class="text-muted">
          {{ formatDate(note.create_day) }}
        </small>
        <span class="badge bg-secondary ms-2">{{ note.type }}</span>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      notifications: []
    };
  },
  mounted() {
    this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      try {
        const userId = localStorage.getItem("user_id");
        const res = await fetch(`http://localhost:8888/api/notifications/student/${userId}`);
        if (!res.ok) throw new Error("Không thể tải thông báo");
        this.notifications = await res.json();
      } catch (err) {
        console.error("Lỗi load thông báo:", err);
        this.notifications = [];
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("vi-VN");
    }
  }
};
</script>

